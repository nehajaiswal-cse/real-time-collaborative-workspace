import { Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBoards from "./pages/MyBoards";
import Members from "./pages/Members.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ROUTES ================= */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myboards" element={<MyBoards />} />
        <Route path="/members" element={<Members />} />
        <Route path="/boards/:boardId" element={<BoardDetail />} />
      </Routes>
    </div>
  );
};


export default App;