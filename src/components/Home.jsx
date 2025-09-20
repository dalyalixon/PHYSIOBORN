import React from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope, Calendar, CheckCircle2, HeartPulse, ActivitySquare,
  Sparkles, Mail, Phone, MapPin, Quote, ArrowRight
} from "lucide-react";

/* ——— Services (on en affiche 3 sur l’accueil) ——— */
const SERVICES = [
  {
    id: "classique",
    label: "Kinésithérapie classique",
    duration: 30,
    details: [
      "Douleurs musculo-squelettiques",
      "Mobilité & posture",
      "Exercices personnalisés",
    ],
  },
  {
    id: "sport",
    label: "Kinésithérapie du sport",
    duration: 30,
    details: [
      "Prévention des blessures",
      "Récupération et retour au sport",
      "Renforcement spécifique",
    ],
  },
  {
    id: "neuro",
    label: "Kinésithérapie neurologique",
    duration: 30,
    details: [
      "AVC, SEP, Parkinson",
      "Équilibre, marche",
      "Rééducation fonctionnelle",
    ],
  },
  {
    id: "respi",
    label: "Kinésithérapie respiratoire",
    duration: 30,
    details: [
      "Exercices respiratoires",
      "Drainage bronchique",
      "Éducation thérapeutique",
    ],
  },
  {
    id: "cupping",
    label: "Cupping (50 € — non remboursable)",
    duration: 45,
    price: 50,
    reimbursable: false,
    details: [
      "Ventouses thérapeutiques",
      "Relâchement myofascial",
      "Amélioration de la circulation",
    ],
  },
  {
    id: "autre",
    label: "Autre",
    duration: 30,
    details: [
      "Besoin spécifique",
      "Évaluation et orientation",
      "Plan de soins adapté",
    ],
  },
]; // ✅ correction : tableau bien fermé

// Avis courts
const TESTIMONIALS = [
  { name: "Sabrina", text: "Accueil chaleureux et explications claires. Ma douleur d’épaule a nettement diminué !" },
  { name: "Nicolas", text: "Horaires flexibles, prise en charge pro. J’ai repris le sport en confiance." },
  { name: "Lina", text: "Très à l’écoute, exercices simples à faire à la maison. Je recommande !" },
];

export default function Home() {
  const featured = ["classique", "sport", "respi"];
  const featuredServices = SERVICES.filter(s => featured.includes(s.id));

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

      {/* HERO */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Colonne gauche */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-teal-200/60">
              <Sparkles className="h-3.5 w-3.5" /> Votre kinésithérapeute à Carnières
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
              Prenez soin de votre corps, <span className="text-teal-700">il vous accompagnera </span> toute votre vie
            </h1>
            <p className="mt-4 text-slate-600">
              Bilan précis, suivi personnalisé, et exercices simples à refaire à la maison.
              Nous vous accompagnons pour reprendre vos activités en toute confiance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/rdv" className="btn btn-primary flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Voir les disponibilités
              </Link>
              <a href="#services" className="btn btn-outline flex items-center gap-2">
                Découvrir nos services <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-700">
              <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-3">
                <CheckCircle2 className="h-4 w-4 text-teal-600 inline mr-2" />
                Conventionné INAMI
              </div>
              <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-3">
                <CheckCircle2 className="h-4 w-4 text-teal-600 inline mr-2" />
                Accès PMR
              </div>
              <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-3">
                <CheckCircle2 className="h-4 w-4 text-teal-600 inline mr-2" />
                Horaires flexibles
              </div>
            </div>
          </div>

          {/* Colonne droite : visuel */}
          <div className="rounded-3xl overflow-hidden shadow-md ring-1 ring-slate-200">
            <img
              src="/Homephoto.jpg"
              alt="Cabinet PhysioBorn"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Présentation courte */}
      <section className="container py-8">
        <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold">Pourquoi nous choisir ?</h2>
          <p className="text-slate-600 mt-3 max-w-3xl">
            Chez <strong>PhysioBorn</strong>, on prend le temps d’écouter votre histoire, d’évaluer votre
            mobilité et d’expliquer clairement le plan de traitement. Notre objectif : vous rendre autonome
            avec des exercices efficaces et un suivi adapté à votre rythme.
          </p>
        </div>
      </section>

      {/* 3 services phares */}
      <section id="services" className="container py-14">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Nos services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredServices.map((s, idx) => (
            <div
              key={s.id}
              className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-teal-50 text-teal-700 ring-1 ring-teal-200/60">
                <HeartPulse className="h-4 w-4" /> Service {idx + 1}
              </div>
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
        <div className="mt-8 flex gap-3">
          <Link to="/rdv" className="btn btn-primary">Prendre rendez-vous</Link>
          <a href="#contact" className="btn btn-outline">Une question ?</a>
        </div>
      </section>

      {/* Avis patients */}
      <section className="container py-14">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Ils nous font confiance</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm p-5">
              <Quote className="h-4 w-4 text-teal-600" />
              <blockquote className="mt-3 text-slate-700">“{t.text}”</blockquote>
              <figcaption className="mt-3 text-sm text-slate-500">— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Infos pratiques + CTA final */}
      <section id="contact" className="container pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5 text-teal-600" /> Où nous trouver
              </div>
              <p className="text-slate-600 text-sm mt-1">Rue Sault à Sault 22, 7141 Carnières</p>
            </div>
            <div className="p-5 text-sm text-slate-600 space-y-2">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +32 483/54.50.42</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> physiobornreservation@outlook.fr</div>
              <div className="pt-2">
                <a
                  className="btn btn-outline inline-flex"
                  href="https://maps.google.com/?q=Rue+Sault+%C3%A0+Sault+22,+7141+Carni%C3%A8res"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-sm p-6 md:p-8">
            <h3 className="text-xl font-semibold">Prêt à réserver votre séance ?</h3>
            <p className="text-white/90 mt-2">Consultez les disponibilités et confirmez en quelques clics.</p>
            <Link to="/rdv" className="btn bg-white text-teal-700 ring-teal-200 hover:bg-slate-50 mt-4 inline-flex">
              <Calendar className="h-4 w-4" /> Voir les créneaux
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="container py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-slate-600">© {new Date().getFullYear()} PhysioBorn. Tous droits réservés.</div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/physioborn?igsh=MXhnZmdqb3hnYW1xZA=="
              target="_blank" rel="noopener noreferrer" className="hover:underline"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/1CDLJ3EuXD/?mibextid=wwXIfr"
              target="_blank" rel="noopener noreferrer" className="hover:underline"
            >
              Facebook
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
