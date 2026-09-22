import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        {/* ================= USER ROUTES ================= */}

       
          <Route path="/user" element={<Dashboard />} />
        
      </Routes>

    </div>
  );
};

export default App;