import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectForm from "./pages/ProjectForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/projects/:slug" element={<Overview />} />

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/edit/:id"
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;