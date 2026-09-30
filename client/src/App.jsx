import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBoards from "./pages/MyBoards";

  return (
    <div>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ROUTES ================= */}

       
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/myboards" element={<MyBoards/>} />
        
      </Routes>

    </div>
  );
}



export default App;
