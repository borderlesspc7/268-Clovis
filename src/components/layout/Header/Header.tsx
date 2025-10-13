import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import "./Header.css";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Sistema de Documentos Agrícolas</h1>
        </div>

        <div className="header-actions">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
