// src/components/KineSite.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Mail, Phone, MapPin, Clock, Stethoscope,
  CheckCircle2, Sparkles, ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";
import {
  format, addMinutes, parseISO, addDays, isBefore,
  setHours, setMinutes, isToday, startOfDay
} from "date-fns";
import { fr } from "date-fns/locale";
import { Toaster, toast } from "sonner";

import { db } from "../lib/firebase";
import {
  collection, doc, getDocs, runTransaction,
  Timestamp, query, where
} from "firebase/firestore";

import emailjs from "@emailjs/browser";

// ===== ENV =====
const EMAILJS_PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;       // client
const EMAILJS_ADMIN_TPL_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID; // admin (facultatif)
const CLINIC_EMAIL         = import.meta.env.VITE_CLINIC_EMAIL || "contact@physioborn.be";

/* ---------- OUVERTURES ---------- */
const OPENING_HOURS = {
  1: [[8, 0, 14, 0], [16, 15, 21, 20]], // Lundi
  2: [[8, 0, 14, 0], [16, 15, 21, 20]], // Mardi
  3: [[8, 0, 14, 0], [16, 15, 21, 20]], // Mercredi
  4: [[8, 0, 14, 0], [16, 15, 21, 20]], // Jeudi
  5: [[8, 0, 14, 0], [16, 15, 21, 20]], // Vendredi
  6: [],                                 // Samedi fermé
  0: [],                                 // Dimanche fermé
};




const LOOKAHEAD_DAYS = 14;

/* ---------- SERVICES (menu déroulant) ---------- */
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
];
const SERVICE_MAP = Object.fromEntries(SERVICES.map(s => [s.id, s]));

/* ---------- UTILS ---------- */
const dayKey  = (d) => format(d, "yyyy-MM-dd");
const timeKey = (d) => format(d, "HH:mm");

function generateSlotsForDate(date) {
  const periods = OPENING_HOURS[date.getDay()] || [];
  const now = new Date();
  const slots = [];

  periods.forEach(([sh, sm, eh, em]) => {
    let cur = setMinutes(setHours(new Date(date), sh), sm);
    const end = setMinutes(setHours(new Date(date), eh), em);

    while (isBefore(addMinutes(cur, 30), end)) {
      // on ne propose le créneau que si pas déjà passé
      if (!isToday(date) || isBefore(now, cur)) {
        slots.push(new Date(cur));
      }
      // avance de 30 min (durée du rdv) + 10 min de pause
      cur = addMinutes(cur, 40);
    }
  });

  return slots;
}


function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-teal-200/60">
        {Icon && <Icon className="h-3.5 w-3.5" />} {subtitle}
      </div>
      <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

/* ==================== PAGE ==================== */
export default function KineSite() {
  // Init EmailJS + permission notifications (silencieux)
  useEffect(() => {
    try { if (EMAILJS_PUBLIC_KEY) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch {}
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Formulaire
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [service, setService] = useState("classique");
  const [date, setDate]       = useState("");
  const [time, setTime]       = useState("");
  const [message, setMessage] = useState("");

  // Planning
  const [days, setDays]         = useState([]);
  const [booked, setBooked]     = useState({});
  const [focusIndex, setFocusIndex] = useState(0);

  // Refs pour snap scroll
  const itemRefs = useRef([]);

  const durationMin = SERVICE_MAP[service]?.duration ?? 30;

  // Génère les jours
  useEffect(() => {
    const list = [];
    for (let i = 0; i < LOOKAHEAD_DAYS; i++) {
      const d = startOfDay(addDays(new Date(), i));
      list.push({ date: d, slots: generateSlotsForDate(d, durationMin) });
    }
    setDays(list);
    setFocusIndex(0);
  }, [service, durationMin]);

  // Charge RDV existants
  useEffect(() => {
    (async () => {
      const start = new Date();
      const end   = addDays(new Date(), LOOKAHEAD_DAYS);
      const q = query(
        collection(db, "bookings"),
        where("start", ">=", Timestamp.fromDate(start)),
        where("start", "<=", Timestamp.fromDate(end))
      );
      const snap = await getDocs(q);
      const map = {};
      snap.forEach(d => {
        const s = d.data().start.toDate();
        const dk = dayKey(s);
        const tk = timeKey(s);
        if (!map[dk]) map[dk] = new Set();
        map[dk].add(tk);
      });
      setBooked(map);
    })().catch(console.error);
  }, []);

  // Scroll vers le jour actif
  useEffect(() => {
    const el = itemRefs.current[focusIndex];
    if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [focusIndex, days.length]);

  // Prochaine disponibilité
  const nextAvailable = useMemo(() => {
    for (let i = 0; i < days.length; i++) {
      const { date: d, slots } = days[i];
      const taken = booked[dayKey(d)] || new Set();
      for (const s of slots) {
        if (!taken.has(timeKey(s))) return { index: i, day: d, slot: s };
      }
    }
    return null;
  }, [days, booked]);

  useEffect(() => {
    if (nextAvailable) setFocusIndex(nextAvailable.index);
  }, [nextAvailable]);

  // Sélection créneau
  function pickSlot(d, s) {
    setDate(dayKey(d));
    setTime(timeKey(s));
    toast.info(`Créneau sélectionné : ${format(s, "dd/MM à HH:mm")}`);
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
  }

  const startISO = useMemo(() => (date && time ? `${date}T${time}:00` : null), [date, time]);

  // Envoi emails (client + cabinet)
  async function sendEmails({ start }) {
    const human = format(start, "EEEE d MMM yyyy 'à' HH:mm", { locale: fr });
    const selected = SERVICE_MAP[service];

    const shared = {
      date_time: human,
      service_label: selected?.label,
      duration: `${selected?.duration ?? 30} min`,
      price: selected?.id === "cupping" ? "50 € (non remboursable)" : undefined,
      phone,
      notes: message || "(aucune remarque)",
    };

    const clientPayload = {
      ...shared,
      to_name: name,
      to_email: email,
      clinic_email: CLINIC_EMAIL,
    };

    const adminPayload = {
      ...shared,
      to_name: "PhysioBorn",
      to_email: CLINIC_EMAIL,
      clinic_email: CLINIC_EMAIL,
      notes: `${name} • ${email || "sans email"} • ${message || "aucune remarque"}`,
    };

    const adminTpl = EMAILJS_ADMIN_TPL_ID || EMAILJS_TEMPLATE_ID;
    const [c, a] = await Promise.allSettled([
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, clientPayload),
      emailjs.send(EMAILJS_SERVICE_ID, adminTpl,              adminPayload),
    ]);

    if (c.status === "rejected" || a.status === "rejected") {
      console.error("EmailJS error:", c, a);
      toast.error("Email non envoyé (voir console)");
    } else {
      toast.success("Emails envoyés ✅");
    }
  }

  // Réservation
  async function handleBooking(e) {
    e.preventDefault();
    if (!name || !phone || !startISO || !email) {
      toast.error("Nom, téléphone, e-mail et créneau sont requis.");
      return;
    }
    const start = parseISO(startISO);
    const end   = addMinutes(start, durationMin);

    const docId = `${date}_${time}_${service}`;
    const ref = doc(collection(db, "bookings"), docId);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (snap.exists()) throw new Error("Ce créneau est déjà pris.");
        tx.set(ref, {
          name, email, phone, service,
          start: Timestamp.fromDate(start),
          end:   Timestamp.fromDate(end),
          notes: message || "",
          status: "confirmed",
          createdAt: Timestamp.now(),
          duration: durationMin,
          price: service === "cupping" ? 50 : null,
          reimbursable: service === "cupping" ? false : true,
        });
      });

      // MAJ locale
      setBooked((prev) => {
        const copy = { ...prev };
        const dk = dayKey(start);
        const tk = timeKey(start);
        if (!copy[dk]) copy[dk] = new Set();
        copy[dk].add(tk);
        return copy;
      });

      await sendEmails({ start });
      toast.success("Réservation enregistrée ✅");
    } catch (err) {
      toast.error(err.message || "Erreur inconnue");
    }
  }

  // Barre date
  function DateBar() {
    return (
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-xl bg-white/70 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
          onClick={() => setFocusIndex((i) => Math.max(0, i - 1))}
          title="Jour précédent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {days.map((d, i) => {
              const isActive = i === focusIndex;
              return (
                <button
                  key={dayKey(d.date)}
                  onClick={() => setFocusIndex(i)}
                  className={`px-3 py-2 rounded-full text-sm ring-1 transition ${
                    isActive
                      ? "bg-teal-600 text-white ring-teal-700 shadow-sm"
                      : "bg-white/70 backdrop-blur ring-slate-200 hover:bg-white"
                  }`}
                  title={format(d.date, "EEEE d MMM", { locale: fr })}
                >
                  <div className="font-medium">{format(d.date, "EEE", { locale: fr })}</div>
                  <div className="text-xs opacity-80 -mt-0.5">{format(d.date, "d MMM", { locale: fr })}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="p-2 rounded-xl bg-white/70 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
          onClick={() => setFocusIndex((i) => Math.min(days.length - 1, i + 1))}
          title="Jour suivant"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  function DayCard({ day, slots, index }) {
    const dk = dayKey(day);
    const taken = booked[dk] || new Set();
    const isClosed = slots.length === 0;

    return (
      <div
        ref={(el) => (itemRefs.current[index] = el)}
        className="snap-start min-w-[320px] max-w-[420px] shrink-0"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="rounded-2xl overflow-hidden bg-white/70 backdrop-blur ring-1 ring-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200/70 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                {format(day, "EEEE", { locale: fr })}
              </div>
              <div className="font-semibold">{format(day, "d MMM yyyy", { locale: fr })}</div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs ${
              isClosed ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"
            }`}>
              {isClosed ? "Fermé" : "Ouvert"}
            </div>
          </div>

          <div className="p-4">
            {isClosed ? (
              <div className="text-slate-500 text-sm">Aucun créneau</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => {
                  const tk = timeKey(s);
                  const disabled = taken.has(tk);
                  return (
                    <button
                      key={tk}
                      onClick={() => !disabled && pickSlot(day, s)}
                      disabled={disabled}
                      className={`px-4 py-2 rounded-full text-sm ring-1 transition ${
                        disabled
                          ? "bg-slate-100 text-slate-400 ring-slate-200 cursor-not-allowed line-through"
                          : "bg-white hover:bg-teal-50 ring-slate-200 hover:ring-teal-400 shadow-sm"
                      }`}
                      title={disabled ? "Déjà réservé" : "Choisir ce créneau"}
                    >
                      {format(s, "HH:mm")}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function DaysScroller() {
    return (
      <div className="relative">
        <div className="mt-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
          <div className="flex gap-4 pb-2" style={{ scrollSnapType: "x mandatory" }}>
            {days.map(({ date: d, slots }, i) => (
              <DayCard key={dayKey(d)} day={d} slots={slots} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-slate-50">
      <Toaster richColors position="top-center" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-100 grid place-items-center ring-1 ring-teal-200">
              <Stethoscope className="h-5 w-5 text-teal-700" />
            </div>
            <span className="font-semibold tracking-tight">PhysioBorn</span>
          </div>
          <a href="#rdv" className="btn btn-primary text-sm">
            <Calendar className="h-4 w-4" /> RDV
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 ring-1 ring-teal-200/60">
            <Sparkles className="h-3.5 w-3.5" /> Votre cabinet de kinésithérapie dans la région du centre
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
            Prenez soin de votre corps, <span className="text-teal-700">simplement</span>
          </h1>
          <p className="mt-4 text-slate-600">
            Réservez votre séance en quelques clics. Créneaux en ligne, suivi personnalisé, ambiance chaleureuse.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 mt-12">
          {/* DISPONIBILITÉS */}
          <div id="rdv" className="space-y-4">
            <SectionTitle
              icon={Calendar}
              title="Disponibilités"
              subtitle={
                nextAvailable
                  ? `Prochaine dispo : ${format(nextAvailable.slot, "EEE d MMM 'à' HH:mm", { locale: fr })}`
                  : `Aucune disponibilité sur ${LOOKAHEAD_DAYS} jours`
              }
            />

            {nextAvailable && (
              <div className="mt-2">
                <button
                  className="px-3 py-1.5 rounded-full text-sm bg-teal-600 text-white ring-1 ring-teal-700 hover:bg-teal-700"
                  onClick={() => setFocusIndex(nextAvailable.index)}
                >
                  Aller à la prochaine dispo
                </button>
              </div>
            )}

            <DateBar />
            <DaysScroller />
          </div>

          {/* FORMULAIRE */}
          <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm p-5">
            <div className="pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="h-5 w-5 text-teal-600" /> Confirmer votre rendez-vous
              </div>
              <p className="text-slate-600 text-sm mt-1">
                Durée : {durationMin} min — {SERVICE_MAP[service]?.label}
              </p>
              {service === "cupping" && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Cupping : <strong>50 €</strong> — <strong>acte non remboursable</strong>.
                </div>
              )}
            </div>

            <form id="booking-form" onSubmit={handleBooking} className="grid gap-4">
              <input className="input" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} required />
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="input" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="input" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <select className="select" value={service} onChange={(e) => setService(e.target.value)}>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
              <textarea className="textarea" placeholder="Message (optionnel)" value={message} onChange={(e) => setMessage(e.target.value)} />
              <button type="submit" className="btn btn-primary">Confirmer le rendez-vous</button>
            </form>
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" className="container mx-auto py-16 px-0">
          <SectionTitle icon={Stethoscope} title="Nos services" subtitle="Ce que nous proposons" />
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.id} className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm hover:shadow-md transition">
                <div className="p-5 border-b border-slate-200">
                  <div className="text-lg font-semibold">{s.label}</div>
                  {s.id === "cupping" ? (
                    <p className="mt-1 text-sm font-medium text-red-700">
                      50 € — non remboursable
                    </p>
                  ) : (
                    <p className="text-slate-600 text-sm">Approche personnalisée selon vos besoins.</p>
                  )}
                  <p className="text-slate-600 text-sm mt-1">Durée indicative : {s.duration} min</p>
                </div>
                <div className="p-5">
                  <ul className="text-sm text-slate-600 space-y-2">
                    {s.details.map((d, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-teal-600" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT + INFOS */}
        <section id="contact" className="container mx-auto py-16 px-0">
          <SectionTitle icon={Mail} title="Nous écrire" subtitle="Question rapide ?" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200">
                <div className="text-lg font-semibold">Infos & accès</div>
                <p className="text-slate-600 text-sm">Transports, stationnement</p>
              </div>
              <div className="p-5 text-sm text-slate-600 space-y-2">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +32 483/54.50.42</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {CLINIC_EMAIL}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Rue Sault à Sault 22,7141 Carnières</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200">
                <div className="flex items-center gap-2 text-lg font-semibold"><Clock className="h-5 w-5 text-teal-600" /> Horaires</div>
                <p className="text-slate-600 text-sm mt-1">Flexibles selon disponibilités</p>
              </div>
              <div className="p-5 text-sm space-y-1">
                <div>Lun–Ven : 8:00 – 12:00 / 14:00 – 20:30</div>

              </div>
            </div>
          </div>
        </section>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
  <div className="container py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
    <div className="text-slate-600">© {new Date().getFullYear()} PhysioBorn — HAMACHE Dalya. Tous droits réservés.</div>
    <div className="flex items-center gap-4">
      <a
        href="https://www.instagram.com/physioborn?igsh=MXhnZmdqb3hnYW1xZA=="
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
        aria-label="Instagram PhysioBorn"
      >
        Instagram
      </a>
      <a
        href="https://www.facebook.com/share/1CDLJ3EuXD/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
        aria-label="Facebook PhysioBorn"
      >
        Facebook
      </a>
    </div>
  </div>
</footer>
    </div>
  );
}
