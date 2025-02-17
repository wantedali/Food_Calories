import React from "react";
import SignUp from "./pages/Signup/SignUp";
import SignIn from "./pages/SignIn/signIn";
import Splash from "./pages/Splash"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;