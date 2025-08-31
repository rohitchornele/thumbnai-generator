// App.jsx
import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BuyCredit from "./pages/BuyCredit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeneratorPage from "./pages/GeneratorPage";
import ProtectedRoute from "./configs/ProtectedRoute";

const App = () => {
  const { showLogin, user } = useContext(AppContext);

  return (
    <div className="min-h-screen px-4 sm:px-10 md:px-14 lg:px-28 bg-gradient-to-b to-[#030010] via-[#1f0d01] from-black text-white">
      <ToastContainer position="bottom-right" />
      <Navbar />
      {showLogin && <Login />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/result"
          element={
            <ProtectedRoute isAllowed={!!user} redirectTo="/">
              <GeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/buy" element={<BuyCredit />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
