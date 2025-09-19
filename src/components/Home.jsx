import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Calendar, CheckCircle2, HeartPulse, Sparkles } from "lucide-react";
import { Mail, Phone, MapPin } from "lucide-react";

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
            <Link to="/rdv" className="btn btn-primary text-sm">
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
            <Link to="/rdv" className="btn btn-primary">
              <Calendar className="h-4 w-4" /> Prendre rendez-vous
            </Link>
            <a href="#services" className="btn btn-outline">Voir les services</a>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700">
            <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-4">
              <CheckCircle2 className="h-4 w-4 text-teal-600 inline mr-2" />
              Conventionné INAMI
            </div>
            <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-4">
              <CheckCircle2 className="h-4 w-4 text-teal-600 inline mr-2" />
              Accès PMR
            </div>
            <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-4">
              <CheckCircle2 className="h-4 w-4 text-teal-600 inline mr-2" />
              Ouvert tôt & tard
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container py-14">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Nos services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <HeartPulse className="h-5 w-5" />, title: "Kinésithérapie classique", desc: "Douleurs musculo-squelettiques, posture, mobilité." },
            { icon: <Stethoscope className="h-5 w-5" />, title: "Kinésithérapie du sport", desc: "Prévention, récupération et retour au sport." },
            { icon: <Calendar className="h-5 w-5" />, title: "À domicile", desc: "Séances à votre domicile sur demande." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm p-5 hover:shadow-md transition">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-teal-50 text-teal-700 ring-1 ring-teal-200/60">
                {s.icon} Service
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/rdv" className="btn btn-primary">Réserver maintenant</Link>
        </div>
      </section>

      {/* Mini-contact */}
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
              <MapPin className="h-4 w-4 inline mr-2" /> Rue Sault à Sault 22,7141 Carnières
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="container py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-slate-600">© {new Date().getFullYear()} PhysioBorn — HAMACHE Dalya. Tous droits réservés.</div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/physioborn?igsh=MXhnZmdqb3hnYW1xZA=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/1CDLJ3EuXD/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Facebook
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
