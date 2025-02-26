import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup/SignUp";
import SignIn from "./pages/SignIn/signIn";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import History from "./pages/History";
import Info from "./pages/Info"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;