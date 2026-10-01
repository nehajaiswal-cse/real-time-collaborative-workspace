// import { Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard.jsx";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import MyBoards from "./pages/MyBoards";
// import Members from "./pages/Members.jsx";

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         {/* ================= PUBLIC ROUTES ================= */}

//         <Route path="/" element={<Dashboard />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* ================= USER ROUTES ================= */}

       
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/myboards" element={<MyBoards/>} />
//           <Route path="/members" element={<Members />} />
        
//       </Routes>

//     </div>
//   );
// };

// export default App;


import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyBoards from "./pages/MyBoards.jsx";
import Members from "./pages/Members.jsx";

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
      <Route path="/members" element={<Members />} />
    </Routes>
  );
};

export default App;