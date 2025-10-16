import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Projetos } from "../pages/Projetos/Projetos";
import { NovoProjeto } from "../pages/NovoProjeto/NovoProjeto";
import { GerarDocumentos } from "../pages/GerarDocumentos/GerarDocumentos";
import Relatorios from "../pages/Relatorios/Relatorios";

export const AppRoutes = () => {
  // Componentes temporários para as páginas que ainda não foram criadas
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
              <Dashboard />
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
        <Route
          path={paths.gerarDocumentos}
          element={
            <ProtectedRoute>
              <GerarDocumentos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
