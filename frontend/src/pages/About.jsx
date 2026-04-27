import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Users,
  Scale,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Shield,
} from "lucide-react";

// ────────────────────────────────────────────────
// Year-wise data: President & Secretary since 1998
// Edit names here as required
// ────────────────────────────────────────────────
const leadershipHistory = [
  {
    year: "2026 – 2027",
    president: "Sri. N V SUBBA RAJU",
    secretary: "Sri. V. RAVINDER",
  },
  {
    year: "2025 – 2026",
    president: "Sri. T. VIJAY KUMAR",
    secretary: "Sri. T. SRIDHAR REDDY",
  },
  {
    year: "2024 – 2025",
    president: "Sri. G.K.DESHPANDE",
    secretary: "Sri. D. RAGHAVULU",
  },
  {
    year: "2023 – 2024",
    president: "Sri. B. SANJAY KUMAR",
    secretary: "Sri. T. SRIDHAR",
  },
  {
    year: "2020 – 2023",
    president: "Sri. K. BUCHI BABU",
    secretary: "Sri. B. SANJAY KUMAR",
  },
  {
    year: "2013 – 2020",
    president: "Sri. B. S. PRASAD",
    secretary: "Sri.B. SRINIVAS REDDY",
  },
  {
    year: "2012 – 2013",
    president: "Sri. R. MURLIDHAR",
    secretary: "Sri. B. SRINIVAS REDDY",
  },
];

// ─── Stats ───────────────────────────────────────
const stats = [
  { icon: <Calendar size={28} />, label: "Established", value: "2012" },
  { icon: <Users size={28} />, label: "Active Members", value: "500+" },
  { icon: <Scale size={28} />, label: "Cases Handled", value: "10,000+" },
  { icon: <Award size={28} />, label: "Years of Service", value: "12+" },
];

// ─── Timeline Row ────────────────────────────────
const TimelineRow = ({ item, index }) => {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.03 }}
      className={`relative flex items-center gap-0 ${
        isEven ? "flex-row" : "flex-row-reverse"
      } mb-6`}
    >
      {/* Card */}
      <div
        className={`w-[calc(50%-2rem)] ${
          isEven ? "pr-6 text-right" : "pl-6 text-left"
        }`}
      >
        <div className="inline-block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-zinc-100 p-5 w-full max-w-sm">
          {/* Year badge */}
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest">
            {item.year}
          </span>
          {/* President */}
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-shrink-0 mt-0.5">
              <Star size={14} className="text-amber-500" />
            </div>
            <div className={`text-left`}>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                President
              </p>
              <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                {item.president}
              </p>
            </div>
          </div>
          {/* Secretary */}
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <Shield size={14} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Secretary
              </p>
              <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                {item.secretary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Center dot */}
      <div className="relative z-10 flex-shrink-0 w-16 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-primary border-4 border-white shadow-md ring-2 ring-primary/30" />
      </div>

      {/* Empty spacer */}
      <div className="w-[calc(50%-2rem)]" />
    </motion.div>
  );
};

// ─── TABLE VIEW (mobile) ─────────────────────────
const TableView = () => (
  <div className="overflow-x-auto rounded-2xl shadow-md border border-zinc-100 bg-white">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-primary text-white">
          <th className="py-3 px-4 text-left font-bold tracking-wider text-xs uppercase">
            Period
          </th>
          <th className="py-3 px-4 text-left font-bold tracking-wider text-xs uppercase">
            President
          </th>
          <th className="py-3 px-4 text-left font-bold tracking-wider text-xs uppercase">
            Secretary
          </th>
        </tr>
      </thead>
      <tbody>
        {leadershipHistory.map((item, idx) => (
          <motion.tr
            key={item.year}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03 }}
            className={`border-b border-zinc-100 hover:bg-primary/5 transition-colors ${
              idx % 2 === 0 ? "bg-zinc-50/50" : "bg-white"
            }`}
          >
            <td className="py-3 px-4">
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                {item.year}
              </span>
            </td>
            <td className="py-3 px-4 font-semibold text-zinc-800 uppercase text-xs">
              {item.president}
            </td>
            <td className="py-3 px-4 font-semibold text-zinc-800 uppercase text-xs">
              {item.secretary}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── MAIN PAGE ───────────────────────────────────
const About = () => {
  const [viewMode, setViewMode] = useState("table"); // "timeline" | "table"

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-red-50/30">
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Pill label */}
            <span className="inline-block bg-primary/10 text-primary text-xl font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
              Regd No. 999/2012
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-6 leading-tight tracking-tighter">
              About <span className="text-primary">DRT Advocates</span>
              <br />
              Association Hyderabad
            </h1>
            <p className="text-zinc-500 text-lg max-w-3xl mx-auto leading-relaxed">
              Established in 2012, the DRT Advocates Association Hyderabad has
              been a beacon of legal excellence, championing the cause of debt
              recovery and financial justice for over two decades. We represent
              the interests of advocates practising before the Debt Recovery
              Tribunals of Hyderabad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-zinc-100 p-6 text-center group transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {s.icon}
              </div>
              <p className="text-3xl font-black text-zinc-900 tracking-tight">
                {s.value}
              </p>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-1">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Our Mission",
              color: "from-primary/5 to-red-50",
              border: "border-primary/20",
              icon: <Scale size={24} className="text-primary" />,
              text: "To provide a unified platform for advocates practising before the DRT, facilitating professional growth, legal aid, and advocacy for an equitable debt recovery system.",
            },
            {
              title: "Our Vision",
              color: "from-amber-50 to-orange-50",
              border: "border-amber-200",
              icon: <Star size={24} className="text-amber-500" />,
              text: "To be the most respected bar association in the Debt Recovery Tribunal domain, setting benchmarks in legal excellence, ethical practice, and member welfare across Telangana and Andhra Pradesh.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl border ${card.border} p-8`}
            >
              <div className="flex items-center gap-3 mb-4">
                {card.icon}
                <h3 className="text-xl font-black text-zinc-900">
                  {card.title}
                </h3>
              </div>
              <p className="text-zinc-600 leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Leadership History ── */}
      <section className="container mx-auto px-6 pb-24">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
              Historical Record
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4 tracking-tighter">
              Presidents &amp; Secretaries
              <span className="text-primary"> Since 2012</span>
            </h2>
            <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full mb-5" />
            <p className="text-zinc-500 max-w-xl mx-auto">
              A proud legacy of dedicated leadership guiding our association
              year after year.
            </p>
          </motion.div>

          {/* Toggle buttons */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setViewMode("table")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-md"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                viewMode === "timeline"
                  ? "bg-primary text-white shadow-md"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TableView />
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative hidden md:block"
            >
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent -translate-x-1/2" />
              <div className="pt-4">
                {leadershipHistory.map((item, idx) => (
                  <TimelineRow key={item.year} item={item} index={idx} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: always show table even in timeline mode */}
        {viewMode === "timeline" && (
          <div className="md:hidden mt-4">
            <p className="text-center text-zinc-400 text-sm mb-4">
              Timeline view is best on desktop. Showing table below.
            </p>
            <TableView />
          </div>
        )}
      </section>
    </div>
  );
};

export default About;
