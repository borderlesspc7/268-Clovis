import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout/Layout";
import { useProjects } from "../../hooks/useProjects";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  MapPin,
  User,
  Building,
} from "lucide-react";
import "./NovoProjeto.css";

interface ProjectData {
  name: string;
  description: string;
  location: string;
  area: string;
  owner: string;
  cpf: string;
  email: string;
  phone: string;
}

export const NovoProjeto: React.FC = () => {
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    location: "",
    area: "",
    owner: "",
    cpf: "",
    email: "",
    phone: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Apenas arquivos PDF são permitidos";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "O arquivo deve ter no máximo 10MB";
    }
    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrors({ file: error });
      return;
    }

    setUploadedFile(file);
    setErrors({});
    simulateUpload();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));

    // Remove error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!uploadedFile) {
        newErrors.file = "É obrigatório fazer upload do PDF";
      }
    }

    if (step === 2) {
      if (!projectData.name.trim()) {
        newErrors.name = "Nome do projeto é obrigatório";
      }
      if (!projectData.description.trim()) {
        newErrors.description = "Descrição é obrigatória";
      }
      if (!projectData.location.trim()) {
        newErrors.location = "Localização é obrigatória";
      }
      if (!projectData.area.trim()) {
        newErrors.area = "Área é obrigatória";
      }
    }

    if (step === 3) {
      if (!projectData.owner.trim()) {
        newErrors.owner = "Nome do proprietário é obrigatório";
      }
      if (!projectData.cpf.trim()) {
        newErrors.cpf = "CPF é obrigatório";
      }
      if (!projectData.email.trim()) {
        newErrors.email = "Email é obrigatório";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    setIsCreating(true);

    try {
      // Criar o projeto usando o contexto (Firestore)
      const newProject = await addProject({
        name: projectData.name,
        owner: projectData.owner,
        location: projectData.location,
        area: projectData.area,
        status: "active",
        description: projectData.description,
      });

      console.log("Projeto criado:", newProject);

      // Redirecionar para a página de projetos
      navigate("/projetos");
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("Erro ao criar projeto. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Upload do PDF",
      description: "Faça upload do memorial descritivo",
    },
    {
      number: 2,
      title: "Dados do Projeto",
      description: "Informações básicas do projeto",
    },
    { number: 3, title: "Proprietário", description: "Dados do proprietário" },
  ];

  return (
    <Layout>
      <div className="novo-projeto">
        <div className="page-header-novo-projeto">
          <div className="header-content-projeto">
            <h1>Novo Projeto</h1>
          </div>
          <p>Crie um novo projeto de documentação agrícola</p>
        </div>

        {/* Progress Steps */}
        <div className="steps-container">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${currentStep >= step.number ? "active" : ""} ${
                currentStep > step.number ? "completed" : ""
              }`}
            >
              <div className="step-number">
                {currentStep > step.number ? (
                  <CheckCircle size={20} />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-content-container">
          {currentStep === 1 && (
            <div className="upload-step">
              <h2>Upload do Memorial Descritivo</h2>
              <p className="step-description">
                Faça upload do PDF do memorial descritivo fornecido pelo
                Ministério da Agricultura
              </p>

              {!uploadedFile ? (
                <div
                  className={`upload-area ${isDragOver ? "drag-over" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="upload-content">
                    <Upload size={48} />
                    <h3>Arraste o arquivo PDF aqui</h3>
                    <p>ou clique para selecionar</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      className="file-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="uploaded-file">
                  <div className="file-info">
                    <FileText size={24} />
                    <div className="file-details">
                      <h4>{uploadedFile.name}</h4>
                      <p>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {isUploading ? (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span>{uploadProgress}%</span>
                    </div>
                  ) : (
                    <button onClick={removeFile} className="remove-file">
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}

              {errors.file && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{errors.file}</span>
                </div>
              )}

              <div className="upload-info">
                <Info size={16} />
                <div>
                  <p>
                    <strong>Requisitos do arquivo:</strong>
                  </p>
                  <ul>
                    <li>Formato: PDF</li>
                    <li>Tamanho máximo: 10MB</li>
                    <li>Deve ser um memorial descritivo oficial</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="project-data-step">
              <h2>Dados do Projeto</h2>
              <p className="step-description">
                Preencha as informações básicas do projeto agrícola
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    <Building size={16} />
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={projectData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Fazenda São João"
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && (
                    <span className="field-error">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    <MapPin size={16} />
                    Localização *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={projectData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: Município, Estado"
                    className={errors.location ? "error" : ""}
                  />
                  {errors.location && (
                    <span className="field-error">{errors.location}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="area">
                    <Calendar size={16} />
                    Área (hectares) *
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={projectData.area}
                    onChange={handleInputChange}
                    placeholder="Ex: 150"
                    className={errors.area ? "error" : ""}
                  />
                  {errors.area && (
                    <span className="field-error">{errors.area}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">
                    <FileText size={16} />
                    Descrição do Projeto *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva o tipo de atividade agrícola, culturas, etc."
                    rows={4}
                    className={errors.description ? "error" : ""}
                  />
                  {errors.description && (
                    <span className="field-error">{errors.description}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="owner-data-step">
              <h2>Dados do Proprietário</h2>
              <p className="step-description">
                Informações do proprietário responsável pelo projeto
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="owner">
                    <User size={16} />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="owner"
                    name="owner"
                    value={projectData.owner}
                    onChange={handleInputChange}
                    placeholder="Nome completo do proprietário"
                    className={errors.owner ? "error" : ""}
                  />
                  {errors.owner && (
                    <span className="field-error">{errors.owner}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cpf">
                    <User size={16} />
                    CPF *
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={projectData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    className={errors.cpf ? "error" : ""}
                  />
                  {errors.cpf && (
                    <span className="field-error">{errors.cpf}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <User size={16} />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={projectData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemplo.com"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <User size={16} />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={projectData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {currentStep > 1 && (
            <button onClick={prevStep} className="btn-secondary">
              Voltar
            </button>
          )}
          <div className="spacer" />
          {currentStep < 3 ? (
            <button onClick={nextStep} className="btn-primary">
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={isCreating}
            >
              {isCreating ? "Criando Projeto..." : "Criar Projeto"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};
