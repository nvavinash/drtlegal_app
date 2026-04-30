import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  X,
  Search,
  Download,
  Trash2,
  IndianRupee,
  CalendarDays,
  Filter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { getTransactions, getSummary, addTransaction, deleteTransaction } from "../api/ledger";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Export transactions as CSV
const exportCSV = (transactions) => {
  const headers = ["Date", "Name", "Type", "Amount", "Description", "Payment Mode", "Transaction ID"];
  const rows = transactions.map((t) => [
    fmtDate(t.date),
    `"${t.name}"`,
    t.type,
    t.amount,
    `"${t.description}"`,
    t.paymentMode || "",
    t.transactionId || "",
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ledger_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Summary Card ────────────────────────────────────────────────────────────
const SummaryCard = ({ title, value, icon: Icon, colorClass, bgClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: "easeOut" }}
    className={`relative overflow-hidden rounded-2xl p-6 ${bgClass} shadow-sm border border-white/60`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">{title}</p>
        <p className={`text-3xl font-extrabold tracking-tight ${colorClass}`}>
          ₹{fmt(value)}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-white/70 shadow`}>
        <Icon size={22} />
      </div>
    </div>
    {/* decorative blob */}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-current" />
  </motion.div>
);

// ─── Add Transaction Modal ───────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  type: "credit",
  amount: "",
  description: "",
  paymentMode: "",
  transactionId: "",
  date: new Date().toISOString().split("T")[0],
};

const AddModal = ({ onClose, onSave, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  const field = (id, label, type = "text", placeholder = "") => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition ${
          errors[id] ? "border-red-400" : "border-zinc-200"
        }`}
      />
      {errors[id] && <span className="text-xs text-red-500">{errors[id]}</span>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-800">Add Transaction</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="sm:col-span-2">{field("name", "Name / Party", "text", "e.g. Ravi Kumar")}</div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Type</label>
            <div className="flex gap-3">
              {["credit", "debit"].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={() => setForm({ ...form, type: t })}
                    className="accent-primary"
                  />
                  <span
                    className={`text-sm font-semibold capitalize ${
                      t === "credit" ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount */}
          {field("amount", "Amount (₹)", "number", "0.00")}

          {/* Description */}
          <div className="sm:col-span-2">{field("description", "Description", "text", "e.g. Monthly expenses")}</div>

          {/* Payment Mode */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Payment Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
              className="border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">— Select —</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank Transfer</option>
            </select>
          </div>

          {/* Transaction ID */}
          {field("transactionId", "Transaction ID (optional)", "text", "UTR / Ref No.")}

          {/* Date */}
          <div className="sm:col-span-2">{field("date", "Date", "date")}</div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-lg">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`rounded-lg text-white ${
                form.type === "credit"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? "Saving…" : "Add Entry"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const Ledger = () => {
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalCredit: 0, totalDebit: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [txns, sum] = await Promise.all([getTransactions(token), getSummary(token)]);
      setTransactions(txns);
      setSummary(sum);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ledger data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { setError("Please log in to view the ledger."); setLoading(false); return; }
    fetchData();
  }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      await addTransaction(
        {
          name: form.name,
          type: form.type,
          amount: Number(form.amount),
          description: form.description,
          paymentMode: form.paymentMode,
          transactionId: form.transactionId,
          date: form.date,
        },
        token
      );
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id, token);
      fetchData();
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  };

  // Apply client-side filters
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || t.type === typeFilter;
      const d = new Date(t.date);
      const matchStart = !startDate || d >= new Date(startDate);
      const matchEnd = !endDate || d <= new Date(endDate + "T23:59:59");
      return matchSearch && matchType && matchStart && matchEnd;
    });
  }, [transactions, search, typeFilter, startDate, endDate]);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Financial Ledger
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Track all credits, debits, and running balance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => exportCSV(filtered)}
              className="rounded-xl flex items-center gap-2 text-sm"
              disabled={filtered.length === 0}
            >
              <Download size={15} />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowModal(true)}
              className="rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2 text-sm px-5"
            >
              <Plus size={16} />
              Add Transaction
            </Button>
          </div>
        </motion.div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <SummaryCard
            title="Total Credit"
            value={summary.totalCredit}
            icon={TrendingUp}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            delay={0}
          />
          <SummaryCard
            title="Total Debit"
            value={summary.totalDebit}
            icon={TrendingDown}
            colorClass="text-red-500"
            bgClass="bg-red-50"
            delay={0.1}
          />
          <SummaryCard
            title="Net Balance"
            value={summary.balance}
            icon={Wallet}
            colorClass={summary.balance >= 0 ? "text-blue-600" : "text-orange-500"}
            bgClass={summary.balance >= 0 ? "bg-blue-50" : "bg-orange-50"}
            delay={0.2}
          />
        </div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-zinc-100 shadow-sm px-5 py-4 mb-6 flex flex-wrap gap-3 items-center"
        >
          <Filter size={16} className="text-zinc-400 shrink-0" />

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search name or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-zinc-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm border border-zinc-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-zinc-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm border border-zinc-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {(search || typeFilter !== "all" || startDate || endDate) && (
            <button
              onClick={() => { setSearch(""); setTypeFilter("all"); setStartDate(""); setEndDate(""); }}
              className="text-xs text-zinc-500 hover:text-red-500 underline transition"
            >
              Clear
            </button>
          )}
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20 text-zinc-400 text-sm gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading transactions…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
              <IndianRupee size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No transactions found.</p>
              {!error && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-3 text-primary text-sm underline hover:no-underline"
                >
                  Add first entry
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {["Date", "Name", "Type", "Amount (₹)", "Description", "Mode", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filtered.map((t, i) => (
                    <motion.tr
                      key={t._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-zinc-50/70 transition-colors group"
                    >
                      <td className="px-5 py-3 text-zinc-500 whitespace-nowrap">
                        {fmtDate(t.date)}
                      </td>
                      <td className="px-5 py-3 font-medium text-zinc-800 max-w-[160px] truncate">
                        {t.name}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            t.type === "credit"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {t.type === "credit" ? (
                            <TrendingUp size={11} />
                          ) : (
                            <TrendingDown size={11} />
                          )}
                          {t.type}
                        </span>
                      </td>
                      <td
                        className={`px-5 py-3 font-bold tabular-nums ${
                          t.type === "credit" ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {t.type === "debit" ? "−" : "+"}₹{fmt(t.amount)}
                      </td>
                      <td className="px-5 py-3 text-zinc-600 max-w-[200px] truncate">
                        {t.description}
                      </td>
                      <td className="px-5 py-3 text-zinc-500 whitespace-nowrap">
                        {t.paymentMode ? (
                          <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs font-medium">
                            {t.paymentMode}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-zinc-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Row count footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-100 text-xs text-zinc-400 flex justify-between">
              <span>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
              <span>
                Showing {filtered.length} of {transactions.length}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <AddModal onClose={() => setShowModal(false)} onSave={handleSave} loading={saving} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ledger;
