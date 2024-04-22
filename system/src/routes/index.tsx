import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import ExampleHeatmap from "../pages/teste";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<LoginPage />} />
      <Route path="/client" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/teste" element={<ExampleHeatmap />} />
    </Routes>
  );
};

export default MainRoutes;
