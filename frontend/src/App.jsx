import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Authpage";
import ModePage from "./pages/Modepage";
import Dashboard from "./pages/Dashboard";
import Invitations from "./pages/Invitations";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/mode" element={<ProtectedRoute><ModePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/invitations" element={<ProtectedRoute><Invitations /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
