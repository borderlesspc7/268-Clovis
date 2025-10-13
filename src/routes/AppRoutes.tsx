import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Layout } from "../components/layout/Layout/Layout";

export const AppRoutes = () => {
  // Componentes temporários para as páginas que ainda não foram criadas
  const Dashboard = () => <div>Dashboard (em desenvolvimento)</div>;
  const Projetos = () => <div>Projetos (em desenvolvimento)</div>;
  const NovoProjeto = () => <div>Novo Projeto (em desenvolvimento)</div>;
  const Relatorios = () => <div>Relatórios (em desenvolvimento)</div>;
  const Historico = () => <div>Histórico (em desenvolvimento)</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Login />} />
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.register} element={<Register />} />
        <Route
          path={paths.dashboard}
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.projetos}
          element={
            <ProtectedRoute>
              <Projetos />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.novoProjeto}
          element={
            <ProtectedRoute>
              <NovoProjeto />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.relatorios}
          element={
            <ProtectedRoute>
              <Relatorios />
            </ProtectedRoute>
          }
        />
        <Route
          path={paths.historico}
          element={
            <ProtectedRoute>
              <Historico />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
