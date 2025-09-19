// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope, Calendar, CheckCircle2, HeartPulse,
  Sparkles, Mail, Phone, MapPin
} from "lucide-react";
import { SERVICES } from "./KineSite.jsx"; // 🔑 import depuis KineSite

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-100 grid place-items-center ring-1 ring-teal-200">
              <Stethoscope className="h-5 w-5 text-teal-700" />
            </div>
            <span className="font-semibold tracking-tight">PhysioBorn</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/" className="text-sm text-slate-700 hover:text-teal-700">Accueil</Link>
            <Link to="/rdv" className="btn btn-primary text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Prendre RDV
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-teal-200/60">
            <Sparkles className="h-3.5 w-3.5" /> Votre cabinet de kinésithérapie dans la région du centre
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
            Récupérez, bougez, <span className="text-teal-700">respirez</span> mieux
          </h1>
          <p className="mt-4 text-slate-600">
            Bilan complet, programme d’exercices personnalisé et suivi régulier.
            Réservez votre première séance en ligne en quelques clics.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/rdv" className="btn btn-primary flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Prendre rendez-vous
            </Link>
            <a href="#services" className="btn btn-outline">Voir les services</a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container py-14">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Nos services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div key={s.id} className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm p-5 hover:shadow-md transition">
              <h3 className="mt-3 text-lg font-semibold">{s.label}</h3>
              <p className="text-slate-600 text-sm mt-1">Durée indicative : {s.duration} min</p>
              <ul className="text-sm text-slate-600 mt-3 space-y-1">
                {s.details.slice(0, 3).map((d, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5" /> {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/rdv" className="btn btn-primary">Réserver maintenant</Link>
        </div>
      </section>

      {/* Contact + Footer comme avant */}
      <section className="container py-14">
        <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm p-6 md:p-8">
          <h3 className="text-xl font-semibold">Première visite ?</h3>
          <p className="text-slate-600 mt-1">Amenez vos documents médicaux si disponibles.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
            <div className="rounded-xl ring-1 ring-slate-200 p-3 bg-white/70">
              <Mail className="h-4 w-4 inline mr-2" /> physiobornreservation@outlook.fr
            </div>
            <div className="rounded-xl ring-1 ring-slate-200 p-3 bg-white/70">
              <Phone className="h-4 w-4 inline mr-2" /> +32 483/54.50.42
            </div>
            <div className="rounded-xl ring-1 ring-slate-200 p-3 bg-white/70">
              <MapPin className="h-4 w-4 inline mr-2" /> Rue Sault à Sault 22, 7141 Carnières
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="container py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-slate-600">© {new Date().getFullYear()} PhysioBorn. Tous droits réservés.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
