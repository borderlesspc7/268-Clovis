import React, { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout/Layout";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import {
  Clock,
  User,
  FileText,
  FolderPlus,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Filter,
  Search,
  Calendar,
  ChevronRight,
} from "lucide-react";
import "./Historico.css";

interface HistoryEntry {
  id: string;
  action: string;
  type: "project" | "user" | "document" | "system";
  user: string;
  userId: string;
  timestamp: string;
  details: string;
  status: "success" | "error" | "warning" | "info";
  metadata?: Record<string, unknown>;
}

const Historico: React.FC = () => {
  const { projects } = useProjects();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const generateHistory = async () => {
      const users = await authService.getAllUsers();
      const mockHistory: HistoryEntry[] = [];

      // Gerar histórico baseado em projetos reais
      projects.forEach((project, index) => {
        mockHistory.push({
          id: `${project.id}-created`,
          action: "Projeto criado",
          type: "project",
          user: user?.email || "Sistema",
          userId: user?.uid || "system",
          timestamp: project.createdAt,
          details: `Projeto "${project.name}" foi criado com sucesso`,
          status: "success",
          metadata: {
            projectId: project.id,
            projectName: project.name,
          },
        });

        if (project.updatedAt !== project.createdAt) {
          mockHistory.push({
            id: `${project.id}-updated`,
            action: "Projeto atualizado",
            type: "project",
            user: user?.email || "Sistema",
            userId: user?.uid || "system",
            timestamp: project.updatedAt,
            details: `Projeto "${project.name}" foi atualizado`,
            status: "info",
            metadata: {
              projectId: project.id,
              projectName: project.name,
            },
          });
        }
      });

      // Gerar histórico baseado em usuários reais
      users.forEach((u: any) => {
        mockHistory.push({
          id: `user-${u.uid}-registered`,
          action: "Usuário registrado",
          type: "user",
          user: "Sistema",
          userId: "system",
          timestamp:
            u.createdAt instanceof Date
              ? u.createdAt.toISOString()
              : new Date().toISOString(),
          details: `Novo usuário registrado: ${u.email}`,
          status: "success",
          metadata: {
            userId: u.uid,
            userEmail: u.email,
          },
        });
      });

      // Adicionar algumas atividades de sistema mockadas
      const systemActivities = [
        {
          id: "sys-1",
          action: "Sistema iniciado",
          type: "system" as const,
          user: "Sistema",
          userId: "system",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: "Sistema de documentação agrícola iniciado",
          status: "success" as const,
        },
        {
          id: "sys-2",
          action: "Backup realizado",
          type: "system" as const,
          user: "Sistema",
          userId: "system",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          details: "Backup automático dos dados realizado com sucesso",
          status: "success" as const,
        },
      ];

      mockHistory.push(...systemActivities);

      // Ordenar por timestamp (mais recente primeiro)
      mockHistory.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setHistory(mockHistory);
      setFilteredHistory(mockHistory);
    };

    generateHistory();
  }, [projects, user]);

  useEffect(() => {
    let filtered = [...history];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de tipo
    if (filterType !== "all") {
      filtered = filtered.filter((entry) => entry.type === filterType);
    }

    // Filtro de status
    if (filterStatus !== "all") {
      filtered = filtered.filter((entry) => entry.status === filterStatus);
    }

    // Filtro de data
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start).getTime();
      const endDate = new Date(dateRange.end).getTime() + 24 * 60 * 60 * 1000; // Include end day
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.timestamp).getTime();
        return entryDate >= startDate && entryDate <= endDate;
      });
    }

    setFilteredHistory(filtered);
  }, [searchTerm, filterType, filterStatus, dateRange, history]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24)
      return `Há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (type: string, action: string) => {
    switch (type) {
      case "project":
        if (action.includes("criado")) return <FolderPlus size={20} />;
        if (action.includes("atualizado")) return <Edit size={20} />;
        if (action.includes("excluído")) return <Trash2 size={20} />;
        return <FileText size={20} />;
      case "user":
        if (action.includes("registrado")) return <UserPlus size={20} />;
        return <User size={20} />;
      case "document":
        if (action.includes("gerado")) return <Download size={20} />;
        if (action.includes("upload")) return <Upload size={20} />;
        return <FileText size={20} />;
      case "system":
        return <Clock size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "project":
        return "Projeto";
      case "user":
        return "Usuário";
      case "document":
        return "Documento";
      case "system":
        return "Sistema";
      default:
        return type;
    }
  };

  const exportHistory = () => {
    const csv = [
      ["Data/Hora", "Tipo", "Ação", "Usuário", "Detalhes", "Status"],
      ...filteredHistory.map((entry) => [
        new Date(entry.timestamp).toLocaleString("pt-BR"),
        getTypeLabel(entry.type),
        entry.action,
        entry.user,
        entry.details,
        entry.status,
      ]),
    ]
      .map((row) => row.join(";"))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Agrupar por data
  const groupedHistory = filteredHistory.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString("pt-BR");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, HistoryEntry[]>);

  return (
    <Layout>
      <div className="historico">
        <div className="page-header-historico">
          <div className="header-content-historico">
            <h1>Histórico</h1>
            <p>Registro completo de atividades do sistema</p>
          </div>
          <button className="btn-export" onClick={exportHistory}>
            <Download size={16} />
            Exportar
          </button>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="search-filters-section">
          <div className="search-container-historico">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por ação, usuário ou detalhes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-historico"
            />
          </div>

          <button
            className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group-historico">
              <label>Tipo:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select-historico"
              >
                <option value="all">Todos</option>
                <option value="project">Projetos</option>
                <option value="user">Usuários</option>
                <option value="document">Documentos</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div className="filter-group-historico">
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select-historico"
              >
                <option value="all">Todos</option>
                <option value="success">Sucesso</option>
                <option value="error">Erro</option>
                <option value="warning">Aviso</option>
                <option value="info">Info</option>
              </select>
            </div>

            <div className="filter-group-historico">
              <label>Período:</label>
              <div className="date-range">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="date-input"
                />
                <span>até</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="date-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas Rápidas */}
        <div className="stats-cards">
          <div className="stat-card-historico">
            <div
              className="stat-icon-historico"
              style={{ background: "#dbeafe" }}
            >
              <FileText size={20} style={{ color: "#3b82f6" }} />
            </div>
            <div className="stat-info">
              <h3>{filteredHistory.length}</h3>
              <p>Total de Atividades</p>
            </div>
          </div>

          <div className="stat-card-historico">
            <div
              className="stat-icon-historico"
              style={{ background: "#d1fae5" }}
            >
              <CheckCircle size={20} style={{ color: "#10b981" }} />
            </div>
            <div className="stat-info">
              <h3>
                {filteredHistory.filter((h) => h.status === "success").length}
              </h3>
              <p>Sucesso</p>
            </div>
          </div>

          <div className="stat-card-historico">
            <div
              className="stat-icon-historico"
              style={{ background: "#fee2e2" }}
            >
              <XCircle size={20} style={{ color: "#ef4444" }} />
            </div>
            <div className="stat-info">
              <h3>
                {filteredHistory.filter((h) => h.status === "error").length}
              </h3>
              <p>Erros</p>
            </div>
          </div>

          <div className="stat-card-historico">
            <div
              className="stat-icon-historico"
              style={{ background: "#f3f4f6" }}
            >
              <Calendar size={20} style={{ color: "#6b7280" }} />
            </div>
            <div className="stat-info">
              <h3>{Object.keys(groupedHistory).length}</h3>
              <p>Dias com Atividade</p>
            </div>
          </div>
        </div>

        {/* Timeline de Histórico */}
        <div className="history-timeline">
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <h3>Nenhuma atividade encontrada</h3>
              <p>Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date} className="timeline-group">
                <div className="timeline-date">
                  <Calendar size={16} />
                  <span>{date}</span>
                </div>
                <div className="timeline-entries">
                  {entries.map((entry) => (
                    <div key={entry.id} className="timeline-entry">
                      <div className="entry-marker">
                        <div
                          className="marker-dot"
                          style={{
                            backgroundColor: getStatusColor(entry.status),
                          }}
                        />
                        <div className="marker-line" />
                      </div>
                      <div className="entry-card">
                        <div className="entry-header">
                          <div className="entry-icon">
                            {getActionIcon(entry.type, entry.action)}
                          </div>
                          <div className="entry-main">
                            <div className="entry-title">
                              <h4>{entry.action}</h4>
                              <span
                                className="entry-type"
                                style={{
                                  backgroundColor: `${getStatusColor(
                                    entry.status
                                  )}20`,
                                  color: getStatusColor(entry.status),
                                }}
                              >
                                {getTypeLabel(entry.type)}
                              </span>
                            </div>
                            <p className="entry-details">{entry.details}</p>
                          </div>
                        </div>
                        <div className="entry-footer">
                          <div className="entry-user">
                            <User size={14} />
                            <span>{entry.user}</span>
                          </div>
                          <div className="entry-time">
                            <Clock size={14} />
                            <span>{formatDate(entry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Historico;
