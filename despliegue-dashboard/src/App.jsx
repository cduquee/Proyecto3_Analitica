
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
//import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* Fondo*/}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        
      </div>
    </div>
  );
}

export default App;
