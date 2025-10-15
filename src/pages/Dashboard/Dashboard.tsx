import React, { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout/Layout";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import "./Dashboard.css";
import { useProjects } from "../../hooks/useProjects";
import { authService } from "../../services/authService";

export const Dashboard: React.FC = () => {
  // Estado para filtros
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedChart, setSelectedChart] = useState("line");
  const { projects } = useProjects();
  const [usersCount, setUsersCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const users = await authService.getAllUsers();
        if (isMounted) setUsersCount(users.length);
      } catch {
        if (isMounted) setUsersCount(0);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dados mockados para as métricas
  const metrics = [
    {
      title: "Total de Projetos",
      value: projects.length,
      change: "+12%",
      changeType: "positive" as const,
      icon: FileText,
      color: "#667eea",
    },
    {
      title: "Documentos Gerados",
      value: projects.filter((project) => project.status === "completed")
        .length,
      change: "+8%",
      changeType: "positive" as const,
      icon: CheckCircle,
      color: "#10b981",
    },
    {
      title: "Em Processamento",
      value: projects.filter((project) => project.status === "pending").length,
      change: "-2%",
      changeType: "negative" as const,
      icon: Clock,
      color: "#f59e0b",
    },
    {
      title: "Usuários",
      value: usersCount,
      change: "+5%",
      changeType: "positive" as const,
      icon: Users,
      color: "#8b5cf6",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "document",
      title: "Memorial Descritivo gerado",
      description: "Projeto Fazenda São João - Processo #2024-001",
      time: "2 horas atrás",
      status: "success",
    },
    {
      id: 2,
      type: "project",
      title: "Novo projeto criado",
      description: "Fazenda Santa Maria - 150 hectares",
      time: "4 horas atrás",
      status: "info",
    },
    {
      id: 3,
      type: "warning",
      title: "Processamento em andamento",
      description: "Fazenda Esperança - Aguardando validação",
      time: "6 horas atrás",
      status: "warning",
    },
    {
      id: 4,
      type: "user",
      title: "Novo usuário registrado",
      description: "João Silva - Engenheiro Agrônomo",
      time: "1 dia atrás",
      status: "info",
    },
  ];

  // Dados para gráficos
  const chartData = [
    { name: "Jan", projetos: 4, documentos: 12, usuarios: 8 },
    { name: "Fev", projetos: 6, documentos: 18, usuarios: 10 },
    { name: "Mar", projetos: 8, documentos: 25, usuarios: 12 },
    { name: "Abr", projetos: 12, documentos: 32, usuarios: 15 },
    { name: "Mai", projetos: 18, documentos: 45, usuarios: 18 },
    { name: "Jun", projetos: 24, documentos: 56, usuarios: 20 },
  ];

  const pieData = [
    { name: "Memoriais", value: 45, color: "#667eea" },
    { name: "Requerimentos", value: 30, color: "#10b981" },
    { name: "Declarações", value: 25, color: "#f59e0b" },
  ];

  const barData = [
    { name: "Em Análise", value: 7, color: "#f59e0b" },
    { name: "Aprovados", value: 15, color: "#10b981" },
    { name: "Rejeitados", value: 2, color: "#ef4444" },
  ];

  // Opções de período
  const periodOptions = [
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
    { value: "90d", label: "90 dias" },
    { value: "1y", label: "1 ano" },
  ];

  // Opções de gráfico
  const chartOptions = [
    { value: "line", label: "Linha", icon: TrendingUp },
    { value: "bar", label: "Barras", icon: BarChart },
    { value: "pie", label: "Pizza", icon: PieChart },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "project":
        return FileText;
      case "warning":
        return AlertCircle;
      case "user":
        return Users;
      default:
        return Calendar;
    }
  };

  // Renderizar gráfico baseado na seleção
  const renderChart = () => {
    switch (selectedChart) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="projetos"
                stroke="#667eea"
                strokeWidth={2}
                name="Projetos"
              />
              <Line
                type="monotone"
                dataKey="documentos"
                stroke="#10b981"
                strokeWidth={2}
                name="Documentos"
              />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Usuários"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-content-dashboard">
            <h1>Dashboard</h1>
            <p className="subtitle">
              Visão geral do sistema de documentos agrícolas
            </p>
          </div>
          <div className="header-actions-dashboard">
            <div className="filters-container">
              <div className="filter-group">
                <Filter size={16} />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="filter-select"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="metric-card">
                <div className="metric-header">
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: `${metric.color}15`,
                      color: metric.color,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className={`metric-change ${metric.changeType}`}>
                    {metric.changeType === "positive" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div className="metric-content">
                  <h3 className="metric-value">{metric.value}</h3>
                  <p className="metric-title">{metric.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conteúdo Principal */}
        <div className="dashboard-content">
          {/* Atividades Recentes */}
          <div className="recent-activity">
            <div className="section-header">
              <h2>Atividades Recentes</h2>
              <button className="view-all-btn">Ver todas</button>
            </div>
            <div className="activity-list">
              {recentActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.status}`}>
                      <ActivityIcon size={16} />
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-description">
                        {activity.description}
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gráfico de Tendências */}
          <div className="trends-chart">
            <div className="section-header">
              <h2>Tendências do Sistema</h2>
              <div className="chart-controls">
                <div className="chart-type-selector">
                  {chartOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedChart(option.value)}
                        className={`chart-type-btn ${
                          selectedChart === option.value ? "active" : ""
                        }`}
                      >
                        <Icon size={16} />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="chart-container">{renderChart()}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
