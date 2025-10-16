import React, { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout/Layout";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import ReportViewer from "./ReportViewer";
import "./Relatorios.css";

interface ReportData {
  id: string;
  title: string;
  type: "projects" | "users" | "documents" | "activities";
  description: string;
  data: {
    total: number;
    byStatus?: {
      active: number;
      pending: number;
      completed: number;
      cancelled: number;
    };
    byMonth?: Array<{ month: string; count: number }>;
    byType?: {
      descriptive: number;
      requirements: number;
      declarations: number;
    };
    byAction?: Array<{ action: string; count: number }>;
    byUser?: Array<{ user: string; count: number }>;
    active?: number;
    inactive?: number;
  };
  createdAt: string;
  status: "completed" | "generating" | "failed";
}

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

const Relatorios: React.FC = () => {
  const { projects } = useProjects();
  const { user } = useAuth();
  const [users, setUsers] = useState<unknown[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await authService.getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Mock de atividades - em produção viria de um serviço real
    const mockActivities: ActivityLog[] = [
      {
        id: "1",
        action: "Projeto criado",
        user: user?.email || "Usuário",
        timestamp: new Date().toISOString(),
        details: "Novo projeto de documentação agrícola criado",
      },
      {
        id: "2",
        action: "Documento gerado",
        user: user?.email || "Usuário",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: "Relatório descritivo gerado com sucesso",
      },
      {
        id: "3",
        action: "Usuário registrado",
        user: "admin@example.com",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        details: "Novo usuário registrado no sistema",
      },
    ];
    setActivities(mockActivities);
  }, [user]);

  const generateReport = async (type: string) => {
    setIsGenerating(true);

    try {
      // Simular geração de relatório
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `Relatório de ${
          type === "projects"
            ? "Projetos"
            : type === "users"
            ? "Usuários"
            : type === "documents"
            ? "Documentos"
            : "Atividades"
        }`,
        type: type as "projects" | "users" | "documents" | "activities",
        description: `Relatório gerado em ${new Date().toLocaleDateString(
          "pt-BR"
        )}`,
        data: getReportData(type),
        createdAt: new Date().toISOString(),
        status: "completed",
      };

      setReports((prev) => [newReport, ...prev]);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportData = (type: string) => {
    switch (type) {
      case "projects":
        return {
          total: projects.length,
          byStatus: {
            active: projects.filter((p) => p.status === "active").length,
            pending: projects.filter((p) => p.status === "pending").length,
            completed: projects.filter((p) => p.status === "completed").length,
            cancelled: projects.filter((p) => p.status === "cancelled").length,
          },
          byMonth: getProjectsByMonth(),
        };
      case "users":
        return {
          total: users.length,
          active: users.filter(
            (u: unknown) => (u as { isActive?: boolean }).isActive !== false
          ).length,
          inactive: users.filter(
            (u: unknown) => (u as { isActive?: boolean }).isActive === false
          ).length,
          byMonth: getUsersByMonth(),
        };
      case "documents":
        return {
          total: projects.length * 3, // Simulando 3 documentos por projeto
          byType: {
            descriptive: Math.floor(Math.random() * 50),
            requirements: Math.floor(Math.random() * 30),
            declarations: Math.floor(Math.random() * 20),
          },
        };
      case "activities":
        return {
          total: activities.length,
          byAction: getActivitiesByAction(),
          byUser: getActivitiesByUser(),
        };
      default:
        return {
          total: 0,
        };
    }
  };

  const getProjectsByMonth = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7);
      const count = projects.filter(
        (p) => p.createdAt && p.createdAt.substring(0, 7) === monthKey
      ).length;
      months.push({ month: monthKey, count });
    }
    return months;
  };

  const getUsersByMonth = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7);
      const count = users.filter((u: unknown) => {
        const user = u as { createdAt?: string };
        return (
          user.createdAt &&
          typeof user.createdAt === "string" &&
          user.createdAt.substring(0, 7) === monthKey
        );
      }).length;
      months.push({ month: monthKey, count });
    }
    return months;
  };

  const getActivitiesByAction = () => {
    const actions = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(actions).map(([action, count]) => ({
      action,
      count,
    }));
  };

  const getActivitiesByUser = () => {
    const users = activities.reduce((acc, activity) => {
      acc[activity.user] = (acc[activity.user] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(users).map(([user, count]) => ({ user, count }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "generating":
        return <Clock size={16} className="text-yellow-500" />;
      case "failed":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="relatorios">
        <div className="page-header-relatorios">
          <div className="header-content-relatorios">
            <h1>Relatórios</h1>
            <p>Gere e visualize relatórios detalhados do sistema</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <label>Período:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="filter-input"
              />
              <span>até</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="filter-input"
              />
            </div>
          </div>
        </div>

        {/* Cards de Relatórios */}
        <div className="reports-grid">
          <div
            className="report-card"
            onClick={() => generateReport("projects")}
          >
            <div className="report-icon">
              <BarChart3 size={24} />
            </div>
            <div className="report-content">
              <h3>Relatório de Projetos</h3>
              <p>Análise detalhada dos projetos do sistema</p>
              <div className="report-stats">
                <span>{projects.length} projetos</span>
              </div>
            </div>
          </div>

          <div className="report-card" onClick={() => generateReport("users")}>
            <div className="report-icon">
              <Users size={24} />
            </div>
            <div className="report-content">
              <h3>Relatório de Usuários</h3>
              <p>Estatísticas de usuários e atividades</p>
              <div className="report-stats">
                <span>{users.length} usuários</span>
              </div>
            </div>
          </div>

          <div
            className="report-card"
            onClick={() => generateReport("documents")}
          >
            <div className="report-icon">
              <FileText size={24} />
            </div>
            <div className="report-content">
              <h3>Relatório de Documentos</h3>
              <p>Análise de documentos gerados</p>
              <div className="report-stats">
                <span>{projects.length * 3} documentos</span>
              </div>
            </div>
          </div>

          <div
            className="report-card"
            onClick={() => generateReport("activities")}
          >
            <div className="report-icon">
              <TrendingUp size={24} />
            </div>
            <div className="report-content">
              <h3>Relatório de Atividades</h3>
              <p>Log de atividades do sistema</p>
              <div className="report-stats">
                <span>{activities.length} atividades</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Relatórios Gerados */}
        {reports.length > 0 && (
          <div className="reports-list">
            <h2>Relatórios Gerados</h2>
            <div className="reports-table">
              <div className="table-header">
                <div className="col-title">Título</div>
                <div className="col-type">Tipo</div>
                <div className="col-date">Data</div>
                <div className="col-status">Status</div>
                <div className="col-actions">Ações</div>
              </div>
              {reports.map((report) => (
                <div key={report.id} className="table-row">
                  <div className="col-title">
                    <h4>{report.title}</h4>
                    <p>{report.description}</p>
                  </div>
                  <div className="col-type">
                    <span className="type-badge">{report.type}</span>
                  </div>
                  <div className="col-date">{formatDate(report.createdAt)}</div>
                  <div className="col-status">
                    <div className="status-badge">
                      {getStatusIcon(report.status)}
                      <span>{report.status}</span>
                    </div>
                  </div>
                  <div className="col-actions">
                    <button
                      className="btn-icon"
                      title="Visualizar"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon" title="Download">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Gerando relatório...</p>
            </div>
          </div>
        )}

        {/* Report Viewer Modal */}
        {selectedReport && (
          <ReportViewer
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Relatorios;
