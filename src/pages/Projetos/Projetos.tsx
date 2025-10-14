import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout/Layout";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  MapPin,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FilePlus,
} from "lucide-react";
import "./Projetos.css";

interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  area: string;
  owner: string;
  status: "em_analise" | "aprovado" | "rejeitado" | "concluido";
  createdAt: string;
  updatedAt: string;
  documentsCount: number;
  pdfName: string;
}

export const Projetos: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Dados mockados dos projetos
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Fazenda São João",
      description: "Projeto de cultivo de soja e milho em área de 150 hectares",
      location: "Ribeirão Preto, SP",
      area: "150",
      owner: "João Silva",
      status: "aprovado",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      documentsCount: 3,
      pdfName: "memorial_sao_joao.pdf",
    },
    {
      id: "2",
      name: "Fazenda Santa Maria",
      description: "Projeto de pecuária extensiva com 200 hectares",
      location: "Campinas, SP",
      area: "200",
      owner: "Maria Santos",
      status: "em_analise",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-22",
      documentsCount: 1,
      pdfName: "memorial_santa_maria.pdf",
    },
    {
      id: "3",
      name: "Sítio Esperança",
      description: "Projeto de agricultura familiar com hortaliças",
      location: "Sorocaba, SP",
      area: "25",
      owner: "Carlos Oliveira",
      status: "concluido",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-25",
      documentsCount: 3,
      pdfName: "memorial_esperanca.pdf",
    },
    {
      id: "4",
      name: "Fazenda Verde Vale",
      description: "Projeto de reflorestamento e preservação ambiental",
      location: "Piracicaba, SP",
      area: "300",
      owner: "Ana Costa",
      status: "rejeitado",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-18",
      documentsCount: 2,
      pdfName: "memorial_verde_vale.pdf",
    },
  ]);

  const getStatusInfo = (status: Project["status"]) => {
    switch (status) {
      case "em_analise":
        return {
          label: "Em Análise",
          color: "#f59e0b",
          bgColor: "#fef3c7",
          icon: Clock,
        };
      case "aprovado":
        return {
          label: "Aprovado",
          color: "#10b981",
          bgColor: "#d1fae5",
          icon: CheckCircle,
        };
      case "rejeitado":
        return {
          label: "Rejeitado",
          color: "#ef4444",
          bgColor: "#fee2e2",
          icon: AlertCircle,
        };
      case "concluido":
        return {
          label: "Concluído",
          color: "#8b5cf6",
          bgColor: "#ede9fe",
          icon: CheckCircle,
        };
      default:
        return {
          label: "Desconhecido",
          color: "#6b7280",
          bgColor: "#f3f4f6",
          icon: AlertCircle,
        };
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleProjectAction = (projectId: string, action: string) => {
    console.log(`Ação ${action} no projeto ${projectId}`);
    setSelectedProject(null);

    if (action === "generate") {
      navigate(`/projetos/${projectId}/gerar-documentos`);
    }
  };

  return (
    <Layout>
      <div className="projetos">
        <div className="page-header">
          <div className="header-content-projeto">
            <h1>Projetos</h1>
            <p>Gerencie todos os seus projetos de documentação agrícola</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/novo-projeto")}
          >
            <Plus size={16} />
            Novo Projeto
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="filters-section">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, proprietário ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-container">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle ${showFilters ? "active" : ""}`}
            >
              <Filter size={16} />
              Filtros
            </button>

            {showFilters && (
              <div className="filter-dropdown">
                <div className="filter-group">
                  <label>Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Todos</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="rejeitado">Rejeitado</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#fef3c7", color: "#f59e0b" }}
            >
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <h3>
                {projects.filter((p) => p.status === "em_analise").length}
              </h3>
              <p>Em Análise</p>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#d1fae5", color: "#10b981" }}
            >
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>{projects.filter((p) => p.status === "aprovado").length}</h3>
              <p>Aprovados</p>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#ede9fe", color: "#8b5cf6" }}
            >
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>{projects.filter((p) => p.status === "concluido").length}</h3>
              <p>Concluídos</p>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#fee2e2", color: "#ef4444" }}
            >
              <AlertCircle size={20} />
            </div>
            <div className="stat-content">
              <h3>{projects.filter((p) => p.status === "rejeitado").length}</h3>
              <p>Rejeitados</p>
            </div>
          </div>
        </div>

        {/* Lista de Projetos */}
        <div className="projects-list">
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>Nenhum projeto encontrado</h3>
              <p>Tente ajustar os filtros ou criar um novo projeto</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const statusInfo = getStatusInfo(project.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <div className="project-title">
                      <h3>{project.name}</h3>
                      <div
                        className="status-badge"
                        style={{
                          backgroundColor: statusInfo.bgColor,
                          color: statusInfo.color,
                        }}
                      >
                        <StatusIcon size={14} />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    <div className="project-actions">
                      <button
                        onClick={() =>
                          setSelectedProject(
                            selectedProject === project.id ? null : project.id
                          )
                        }
                        className="action-button"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {selectedProject === project.id && (
                        <div className="action-menu">
                          <button
                            onClick={() =>
                              handleProjectAction(project.id, "generate")
                            }
                            className="action-item primary"
                          >
                            <FilePlus size={16} />
                            Gerar Documentos
                          </button>
                          <button
                            onClick={() =>
                              handleProjectAction(project.id, "view")
                            }
                            className="action-item"
                          >
                            <Eye size={16} />
                            Visualizar
                          </button>
                          <button
                            onClick={() =>
                              handleProjectAction(project.id, "edit")
                            }
                            className="action-item"
                          >
                            <Edit size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleProjectAction(project.id, "download")
                            }
                            className="action-item"
                          >
                            <Download size={16} />
                            Baixar PDF
                          </button>
                          <button
                            onClick={() =>
                              handleProjectAction(project.id, "delete")
                            }
                            className="action-item danger"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="project-content">
                    <p className="project-description">{project.description}</p>

                    <div className="project-details">
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{project.location}</span>
                      </div>
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{project.area} hectares</span>
                      </div>
                      <div className="detail-item">
                        <User size={16} />
                        <span>{project.owner}</span>
                      </div>
                      <div className="detail-item">
                        <FileText size={16} />
                        <span>{project.documentsCount} documentos</span>
                      </div>
                    </div>
                  </div>

                  <div className="project-footer">
                    <div className="project-dates">
                      <span>Criado em {formatDate(project.createdAt)}</span>
                      <span>Atualizado em {formatDate(project.updatedAt)}</span>
                    </div>
                    <div className="project-pdf">
                      <FileText size={14} />
                      <span>{project.pdfName}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};
