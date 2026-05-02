import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  RefreshCw,
  History,
  ListOrdered,
  Download,
} from "lucide-react";
import {
  getNext,
  getHistory,
  getEligibleList,
  assignCommissioner,
  resetQueue,
} from "@/api/commissioners";

const APPOINTED_BY = ["DRT-1 RO1", "DRT-1 RO2", "DRT-2 RO1", "DRT-2 RO2"];

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function Badge({ children, color = "zinc" }) {
  const colors = {
    zinc: "bg-zinc-100 text-zinc-600",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    primary: "bg-primary/10 text-primary border border-primary/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export default function CommissionerPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";
  const isEditor = role === "editor";

  // Redirect non-staff
  useEffect(() => {
    if (!token || (!isAdmin && !isEditor)) navigate("/login");
  }, [token, isAdmin, isEditor, navigate]);

  const [next, setNext] = useState(null);
  const [history, setHistoryData] = useState([]);
  const [eligible, setEligible] = useState({
    members: [],
    pointer: 0,
    total: 0,
    cycleCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ appointedBy: "", rcNumber: "" });

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 5000);
  };
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 6000);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [n, h, e] = await Promise.all([
        getNext(token),
        getHistory(token),
        getEligibleList(token),
      ]);
      setNext(n);
      setHistoryData(h);
      setEligible(e);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403)
        navigate("/login");
      else showError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleAssign = async () => {
    if (!form.appointedBy) return showError("Please select Appointed By.");
    if (!form.rcNumber.trim()) return showError("Please enter RC Number.");
    setAssigning(true);
    setError("");
    try {
      const res = await assignCommissioner(token, form);
      showSuccess(
        `✅ ${res.message}${res.cycleReset ? " — New cycle started!" : ""}`,
      );
      setForm({ appointedBy: "", rcNumber: "" });
      await loadAll();
    } catch (err) {
      showError(err.response?.data?.message || "Assignment failed.");
    } finally {
      setAssigning(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset queue pointer to the beginning? This does NOT delete assignment history.",
      )
    )
      return;
    setResetting(true);
    try {
      const res = await resetQueue(token);
      showSuccess(res.message);
      await loadAll();
    } catch (err) {
      showError(err.response?.data?.message || "Reset failed.");
    } finally {
      setResetting(false);
    }
  };

  // CSV Export
  // const exportCSV = () => {
  //   const rows = [
  //     [
  //       "Name",
  //       "Experience",
  //       "Appointed By",
  //       "RC Number",
  //       "Date",
  //       "Assigned By",
  //     ],
  //   ];
  //   history.forEach((a) => {
  //     rows.push([
  //       a.name,
  //       `${a.experience} yrs`,
  //       a.appointedBy,
  //       a.rcNumber,
  //       fmtDate(a.assignedDate),
  //       a.assignedByEmail || "",
  //     ]);
  //   });
  //   const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `commissioner_history_${Date.now()}.csv`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  const exportExcel = () => {
    // Step 1: Prepare data (same as your rows)
    const rows = [
      [
        "Name",
        "Experience",
        "Appointed By",
        "RC Number",
        "Date",
        "Assigned By",
      ],
    ];

    history.forEach((a) => {
      rows.push([
        a.name,
        `${a.experience} yrs`,
        a.appointedBy,
        a.rcNumber,
        fmtDate(a.assignedDate),
        a.assignedByEmail || "",
      ]);
    });

    // Step 2: Convert to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Step 3: Optional column width (better UI)
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
    ];

    // Step 4: Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commissioners");

    // Step 5: Download file
    XLSX.writeFile(workbook, `commissioner_history_${Date.now()}.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-24 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                Commissioner Panel
              </h1>
            </div>
            <p className="text-zinc-500 text-sm ml-1">
              {isEditor ? "Editor" : "Admin"} • Cycle #{eligible.cycleCount + 1}{" "}
              • {eligible.total} eligible members
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {isAdmin && (
              <Button
                onClick={handleReset}
                disabled={resetting}
                variant="outline"
                className="border-zinc-200 rounded-xl gap-2 text-zinc-700"
              >
                <RotateCcw className="w-4 h-4" />
                {resetting ? "Resetting..." : "Reset Queue"}
              </Button>
            )}
            {/* <Button
              onClick={exportCSV}
              variant="outline"
              className="border-zinc-200 rounded-xl gap-2 text-zinc-700"
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button> */}

            <Button
              onClick={exportExcel}
              variant="outline"
              className="border-red-200 rounded-xl gap-2 text-zinc-700"
            >
              <Download className="w-4 h-4" /> Export Excel
            </Button>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT: Assignment Form ──────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Section 1: Current Assignment */}
            <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary to-primary/80 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-black">
                    {next?.current?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                      Next Commissioner
                    </p>
                    <h2 className="text-2xl font-extrabold leading-tight">
                      {next?.current?.name || "No eligible member"}
                    </h2>
                    {next?.current && (
                      <p className="text-white/80 text-xs mt-0.5">
                        {next.current.experience > 0
                          ? `${next.current.experience} yrs experience`
                          : "< 1 yr experience"}{" "}
                        • Queue position {(next.pointer ?? 0) + 1}/{next.total}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Appointed By <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.appointedBy}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, appointedBy: e.target.value }))
                    }
                    className="w-full h-11 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  >
                    <option value="">— Select DRT/RO —</option>
                    {APPOINTED_BY.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    RC Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={form.rcNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, rcNumber: e.target.value }))
                    }
                    placeholder="e.g. RC/2024/001"
                    className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-sm"
                  />
                </div>

                <Button
                  onClick={handleAssign}
                  disabled={assigning || !next?.current}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 gap-2"
                >
                  <ChevronRight className="w-5 h-5" />
                  {assigning ? "Assigning..." : "Assign Commissioner"}
                </Button>

                {!next?.current && (
                  <p className="text-center text-xs text-zinc-400">
                    No COP-approved members found. Please approve COP members
                    via Admin Panel.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Section 3: History */}
            <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-zinc-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-zinc-400" />
                    <CardTitle className="text-base font-bold">
                      Recent Assignments
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">Last 20</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {history.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 text-sm">
                    No assignments yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-zinc-50/60">
                        <TableRow className="border-zinc-50">
                          <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Name
                          </TableHead>
                          <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Exp
                          </TableHead>
                          <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Appointed By
                          </TableHead>
                          <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                            RC No.
                          </TableHead>
                          <TableHead className="pr-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((a) => (
                          <TableRow
                            key={a._id}
                            className="border-zinc-50 hover:bg-zinc-50/40"
                          >
                            <TableCell className="px-6 py-3 font-semibold text-sm text-zinc-900">
                              {a.name}
                            </TableCell>
                            <TableCell className="py-3 text-xs text-zinc-500">
                              {a.experience}yr
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge color="blue">{a.appointedBy}</Badge>
                            </TableCell>
                            <TableCell className="py-3 font-mono text-xs text-zinc-600">
                              {a.rcNumber}
                            </TableCell>
                            <TableCell className="pr-6 py-3 text-xs text-zinc-500">
                              {fmtDate(a.assignedDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT: Queue Preview ────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white border-zinc-100 shadow-sm rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Eligible
                    </p>
                    <p className="text-xl font-extrabold text-zinc-900">
                      {eligible.total}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-zinc-100 shadow-sm rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Cycle
                    </p>
                    <p className="text-xl font-extrabold text-zinc-900">
                      #{eligible.cycleCount + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section 2: Queue Preview */}
            <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl overflow-hidden flex-1">
              <CardHeader className="border-b border-zinc-50 px-6 py-4">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-zinc-400" />
                  <CardTitle className="text-base font-bold">
                    Queue Preview
                  </CardTitle>
                </div>
                <CardDescription className="text-xs mt-1">
                  Next 5 after current
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {/* Current */}
                {next?.current && (
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5">
                    <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">
                      {next.current.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-primary truncate">
                        {next.current.name}
                      </p>
                      <p className="text-[10px] text-primary/60 font-medium">
                        {next.current.experience}yr • CURRENT
                      </p>
                    </div>
                  </div>
                )}
                {/* Next 5 preview */}
                {(next?.nextPreview || []).map((m, i) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2"
                  >
                    <div className="w-7 h-7 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 2}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-zinc-700 truncate">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {m.experience}yr experience
                      </p>
                    </div>
                  </div>
                ))}
                {!next?.current && (
                  <p className="text-center text-xs text-zinc-400 py-4">
                    No eligible members.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
