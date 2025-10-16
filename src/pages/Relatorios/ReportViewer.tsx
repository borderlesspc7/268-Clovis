import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { X, Download, FileText } from "lucide-react";
import "./ReportViewer.css";

interface ReportData {
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
}

interface ReportViewerProps {
  report: {
    id: string;
    title: string;
    type: string;
    description: string;
    data: ReportData;
    createdAt: string;
    status: string;
  };
  onClose: () => void;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  const renderChart = () => {
    switch (report.type) {
      case "projects":
        return (
          <div className="charts-container">
            <div className="chart-section">
              <h3>Projetos por Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Ativos",
                      value: report.data.byStatus?.active || 0,
                    },
                    {
                      name: "Pendentes",
                      value: report.data.byStatus?.pending || 0,
                    },
                    {
                      name: "Concluídos",
                      value: report.data.byStatus?.completed || 0,
                    },
                    {
                      name: "Cancelados",
                      value: report.data.byStatus?.cancelled || 0,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h3>Projetos por Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.data.byMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="charts-container">
            <div className="chart-section">
              <h3>Usuários Ativos vs Inativos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Ativos", value: report.data.active || 0 },
                      { name: "Inativos", value: report.data.inactive || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1].map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h3>Usuários por Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.data.byMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="charts-container">
            <div className="chart-section">
              <h3>Documentos por Tipo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Descritivos",
                      value: report.data.byType?.descriptive || 0,
                    },
                    {
                      name: "Requisitos",
                      value: report.data.byType?.requirements || 0,
                    },
                    {
                      name: "Declarações",
                      value: report.data.byType?.declarations || 0,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "activities":
        return (
          <div className="charts-container">
            <div className="chart-section">
              <h3>Atividades por Ação</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.data.byAction || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="action" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h3>Atividades por Usuário</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.data.byUser || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="user" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return <div>Dados não disponíveis</div>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="report-viewer-overlay">
      <div className="report-viewer">
        <div className="report-header">
          <div className="header-content-report-viewer">
            <h2>{report.title}</h2>
            <p>{report.description}</p>
            <div className="report-meta">
              <span>Gerado em: {formatDate(report.createdAt)}</span>
              <span>Tipo: {report.type}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-icon" title="Download">
              <Download size={20} />
            </button>
            <button className="btn-icon" onClick={onClose} title="Fechar">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="report-content">
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">
                <FileText size={24} />
              </div>
              <div className="card-content">
                <h3>Total</h3>
                <p>{report.data.total}</p>
              </div>
            </div>

            {report.type === "projects" && (
              <>
                <div className="summary-card">
                  <div
                    className="card-icon"
                    style={{ background: "#d1fae5", color: "#10b981" }}
                  >
                    <FileText size={24} />
                  </div>
                  <div className="card-content">
                    <h3>Ativos</h3>
                    <p>{report.data.byStatus?.active || 0}</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div
                    className="card-icon"
                    style={{ background: "#fef3c7", color: "#f59e0b" }}
                  >
                    <FileText size={24} />
                  </div>
                  <div className="card-content">
                    <h3>Pendentes</h3>
                    <p>{report.data.byStatus?.pending || 0}</p>
                  </div>
                </div>
              </>
            )}

            {report.type === "users" && (
              <>
                <div className="summary-card">
                  <div
                    className="card-icon"
                    style={{ background: "#d1fae5", color: "#10b981" }}
                  >
                    <FileText size={24} />
                  </div>
                  <div className="card-content">
                    <h3>Ativos</h3>
                    <p>{report.data.active || 0}</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div
                    className="card-icon"
                    style={{ background: "#fee2e2", color: "#ef4444" }}
                  >
                    <FileText size={24} />
                  </div>
                  <div className="card-content">
                    <h3>Inativos</h3>
                    <p>{report.data.inactive || 0}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
