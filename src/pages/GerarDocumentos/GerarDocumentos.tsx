import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout/Layout";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Save,
  Download,
  Eye,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { documentTemplates } from "../../data/documentTemplates";
import type {
  DocumentTemplate,
  DocumentField,
  FieldType,
} from "../../types/document";
import "./GerarDocumentos.css";

export const GerarDocumentos: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] =
    useState<DocumentTemplate | null>(null);
  const [documentFields, setDocumentFields] = useState<DocumentField[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dados mockados do projeto (em produção viria da API)
  const projectData = {
    id: projectId || "1",
    name: "Fazenda São João",
    owner: "João Silva",
    location: "Ribeirão Preto, SP",
    area: "150",
  };

  // Dados mockados extraídos do PDF (em produção viria da API de OCR)
  const extractedData = {
    area_total: "150 hectares",
    coordenadas: "Lat: -21.1775, Long: -47.8103",
    tipo_solo: "Latossolo Vermelho-Amarelo",
    vegetacao_nativa: "Cerrado",
    recursos_hidricos: "Rio Pardo",
    area_requerida: "150 hectares",
    localizacao_exata: "Fazenda São João, Zona Rural",
    area_impacto: "50 hectares",
    limites_ambientais: "Reserva Legal de 30%",
  };

  useEffect(() => {
    if (selectedTemplate) {
      // Combinar todos os campos do template
      const allFields = [
        ...selectedTemplate.standardFields,
        ...selectedTemplate.extractedFields,
        ...selectedTemplate.manualFields,
      ];

      // Preencher campos extraídos com dados mockados
      const fieldsWithValues = allFields.map((field) => {
        if (
          field.type === "extracted" &&
          extractedData[field.id as keyof typeof extractedData]
        ) {
          return {
            ...field,
            value: extractedData[field.id as keyof typeof extractedData],
          };
        }
        return field;
      });

      setDocumentFields(fieldsWithValues);
    }
  }, [selectedTemplate]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setDocumentFields((prev) =>
      prev.map((field) => (field.id === fieldId ? { ...field, value } : field))
    );

    // Remove error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    documentFields.forEach((field) => {
      if (field.required && !field.value.trim()) {
        newErrors[field.id] = `${field.label} é obrigatório`;
      }

      // Validação de CPF
      if (field.id === "cpf_requerente" && field.value) {
        const cpfPattern = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
        if (!cpfPattern.test(field.value)) {
          newErrors[field.id] = "CPF deve estar no formato 000.000.000-00";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateDocument = async () => {
    if (!validateFields()) {
      return;
    }

    setIsGenerating(true);

    // Simular geração do documento
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGenerating(false);
    setCurrentStep(3);
  };

  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case "standard":
        return <CheckCircle size={16} />;
      case "extracted":
        return <Info size={16} />;
      case "manual":
        return <AlertCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getFieldTypeLabel = (type: FieldType) => {
    switch (type) {
      case "standard":
        return "Campo Padrão";
      case "extracted":
        return "Extraído do PDF";
      case "manual":
        return "Preenchimento Manual";
      default:
        return "Campo";
    }
  };

  if (currentStep === 1) {
    return (
      <Layout>
        <div className="gerar-documentos">
          <div className="page-header-gerar-documentos">
            <button
              onClick={() => navigate("/projetos")}
              className="back-button"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <div className="header-content-gerar-documentos">
              <h1>Gerar Documentos</h1>
              <p>
                Selecione o tipo de documento que deseja gerar para o projeto{" "}
                {projectData.name}
              </p>
            </div>
          </div>

          <div className="templates-grid">
            {documentTemplates.map((template) => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => {
                  setSelectedTemplate(template);
                  setCurrentStep(2);
                }}
              >
                <div className="template-icon">
                  <FileText size={32} />
                </div>
                <div className="template-content">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <div className="template-stats">
                    <span>{template.standardFields.length} padrão</span>
                    <span>{template.extractedFields.length} extraído</span>
                    <span>{template.manualFields.length} manual</span>
                  </div>
                </div>
                <div className="template-arrow">
                  <ArrowLeft size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (currentStep === 2 && selectedTemplate) {
    return (
      <Layout>
        <div className="gerar-documentos">
          <div className="page-header-gerar-documentos">
            <button onClick={() => setCurrentStep(1)} className="back-button">
              <ArrowLeft size={16} />
              Voltar
            </button>
            <div className="header-content-gerar-documentos">
              <h1>Preencher {selectedTemplate.name}</h1>
              <p>Preencha os campos necessários para gerar o documento</p>
            </div>
          </div>

          <div className="document-form">
            <div className="form-sections">
              {/* Campos Padrão */}
              {selectedTemplate.standardFields.length > 0 && (
                <div className="field-section">
                  <div className="section-header">
                    <CheckCircle size={20} style={{ color: "#10b981" }} />
                    <h2>Campos Padrão</h2>
                    <span className="section-badge">Automático</span>
                  </div>
                  <div className="fields-grid">
                    {selectedTemplate.standardFields.map((field) => (
                      <div key={field.id} className="field-item standard">
                        <label>{field.label}</label>
                        <div className="field-value">{field.value}</div>
                        <div className="field-type">
                          {getFieldIcon(field.type)}
                          <span>{getFieldTypeLabel(field.type)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campos Extraídos */}
              {selectedTemplate.extractedFields.length > 0 && (
                <div className="field-section">
                  <div className="section-header">
                    <Info size={20} style={{ color: "#3b82f6" }} />
                    <h2>Campos Extraídos do PDF</h2>
                    <span className="section-badge">OCR</span>
                  </div>
                  <div className="fields-grid">
                    {selectedTemplate.extractedFields.map((field) => {
                      const fieldData = documentFields.find(
                        (f) => f.id === field.id
                      );
                      return (
                        <div key={field.id} className="field-item extracted">
                          <label>{field.label}</label>
                          <div className="field-value">
                            {fieldData?.value || "Não encontrado"}
                          </div>
                          <div className="field-type">
                            {getFieldIcon(field.type)}
                            <span>{getFieldTypeLabel(field.type)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Campos Manuais */}
              {selectedTemplate.manualFields.length > 0 && (
                <div className="field-section">
                  <div className="section-header">
                    <AlertCircle size={20} style={{ color: "#f59e0b" }} />
                    <h2>Campos de Preenchimento Manual</h2>
                    <span className="section-badge">Obrigatório</span>
                  </div>
                  <div className="fields-grid">
                    {selectedTemplate.manualFields.map((field) => {
                      const fieldData = documentFields.find(
                        (f) => f.id === field.id
                      );
                      return (
                        <div key={field.id} className="field-item manual">
                          <label>
                            {field.label}
                            {field.required && (
                              <span className="required">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={fieldData?.value || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            placeholder={field.placeholder}
                            className={errors[field.id] ? "error" : ""}
                          />
                          {errors[field.id] && (
                            <span className="field-error">
                              {errors[field.id]}
                            </span>
                          )}
                          <div className="field-type">
                            {getFieldIcon(field.type)}
                            <span>{getFieldTypeLabel(field.type)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateDocument}
                className="btn-primary"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="spinning" />
                    Gerando Documento...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Gerar Documento
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (currentStep === 3) {
    return (
      <Layout>
        <div className="gerar-documentos">
          <div className="page-header-gerar-documentos">
            <div className="header-content-gerar-documentos">
              <h1>Documento Gerado com Sucesso!</h1>
              <p>
                O {selectedTemplate?.name} foi gerado e está pronto para
                download
              </p>
            </div>
          </div>

          <div className="success-container">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h2>Documento Gerado</h2>
            <p>
              O documento foi criado com base nos dados fornecidos e está
              disponível para download.
            </p>

            <div className="document-preview">
              <div className="preview-header">
                <FileText size={24} />
                <div>
                  <h3>{selectedTemplate?.name}</h3>
                  <p>Projeto: {projectData.name}</p>
                </div>
              </div>
              <div className="preview-content">
                <p>📄 Documento PDF gerado automaticamente</p>
                <p>
                  📅 Data de geração: {new Date().toLocaleDateString("pt-BR")}
                </p>
                <p>📊 Status: Concluído</p>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-primary">
                <Download size={16} />
                Baixar Documento
              </button>
              <button className="btn-secondary">
                <Eye size={16} />
                Visualizar
              </button>
              <button
                onClick={() => navigate("/projetos")}
                className="btn-secondary"
              >
                Voltar aos Projetos
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
};
