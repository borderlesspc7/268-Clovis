import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout/Layout";
import { useProjects } from "../../hooks/useProjects";
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

export const Projetos: React.FC = () => {
  const navigate = useNavigate();
  const { projects, deleteProject, isLoading } = useProjects();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Ativo",
          color: "#10b981",
          bgColor: "#d1fae5",
          icon: CheckCircle,
        };
      case "pending":
        return {
          label: "Pendente",
          color: "#f59e0b",
          bgColor: "#fef3c7",
          icon: Clock,
        };
      case "completed":
        return {
          label: "Concluído",
          color: "#8b5cf6",
          bgColor: "#ede9fe",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Cancelado",
          color: "#ef4444",
          bgColor: "#fee2e2",
          icon: AlertCircle,
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

  const formatDate = (value: unknown) => {
    try {
      if (!value) return "-";
      if (value instanceof Date) return value.toLocaleDateString("pt-BR");
      if (value instanceof Timestamp)
        return value.toDate().toLocaleDateString("pt-BR");
      if (typeof value === "number")
        return new Date(value).toLocaleDateString("pt-BR");
      if (typeof value === "string") {
        const d = new Date(value);
        if (!isNaN(d.getTime())) return d.toLocaleDateString("pt-BR");
        const asNum = Number(value);
        if (!isNaN(asNum)) return new Date(asNum).toLocaleDateString("pt-BR");
      }
      return "-";
    } catch {
      return "-";
    }
  };

  const handleProjectAction = (projectId: string, action: string) => {
    console.log(`Ação ${action} no projeto ${projectId}`);
    setSelectedProject(null);

    if (action === "generate") {
      navigate(`/projetos/${projectId}/gerar-documentos`);
    } else if (action === "delete") {
      if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
        deleteProject(projectId);
      }
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
                    <option value="active">Ativo</option>
                    <option value="pending">Pendente</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
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
              <h3>{projects.filter((p) => p.status === "pending").length}</h3>
              <p>Pendentes</p>
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
              <h3>{projects.filter((p) => p.status === "active").length}</h3>
              <p>Ativos</p>
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
              <h3>{projects.filter((p) => p.status === "completed").length}</h3>
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
              <h3>{projects.filter((p) => p.status === "cancelled").length}</h3>
              <p>Cancelados</p>
            </div>
          </div>
        </div>

        {/* Lista de Projetos */}
        <div className="projects-list">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando projetos...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>Nenhum projeto encontrado</h3>
              <p>Tente ajustar os filtros ou criar um novo projeto</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/novo-projeto")}
              >
                <Plus size={16} />
                Criar Primeiro Projeto
              </button>
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
                        <span>0 documentos</span>
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
                      <span>PDF não carregado</span>
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
