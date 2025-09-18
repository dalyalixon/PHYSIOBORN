import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import KineSite from "./components/kinesite.jsx"; // IMPORTANT : K majuscule et .jsx

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rdv" element={<KineSite />} />
        {/* fallback simple */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
