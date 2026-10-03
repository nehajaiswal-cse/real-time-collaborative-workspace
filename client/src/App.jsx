import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyBoards from "./pages/MyBoards.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";
import Members from "./pages/Members.jsx";
import Activity from "./pages/Activity.jsx";
 


const App = () => {
   return (
    <Routes>
      {/* Open Login when visiting the root URL */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Application routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/myboards" element={<MyBoards />} />
      <Route path="/boards/:boardId" element={<BoardDetail />} />
      <Route path="/members" element={<Members />} />
      <Route path="/activity" element={<Activity />} />
    </Routes>
  );
};


 


export default App;