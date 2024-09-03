import { Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
