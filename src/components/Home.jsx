import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    console.log("%cHome monté ✅", "color:green");
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Accueil PhysioBorn</h1>
      <p>Si tu vois ce texte, la route “/” fonctionne 🎉</p>
      <p>
        Va vers la page RDV : <Link to="/rdv">/rdv</Link>
      </p>
    </div>
  );
}
