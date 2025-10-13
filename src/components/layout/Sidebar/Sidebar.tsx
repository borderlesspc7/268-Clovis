import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  PlusCircle,
  BarChart3,
  Clock,
  Wheat,
} from "lucide-react";
import "./Sidebar.css";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/projetos",
      icon: FolderOpen,
      label: "Projetos",
    },
    {
      path: "/novo-projeto",
      icon: PlusCircle,
      label: "Novo Projeto",
    },
    {
      path: "/relatorios",
      icon: BarChart3,
      label: "Relatórios",
    },
    {
      path: "/historico",
      icon: Clock,
      label: "Histórico",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Wheat className="logo-icon" size={32} />
          <span className="logo-text">AgriDocs</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <Icon className="nav-icon" size={20} />
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="version">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};
