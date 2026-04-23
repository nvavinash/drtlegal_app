import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Scale,
  RefreshCw,
  ChevronRight,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  X,
  User,
  BookOpen,
} from "lucide-react";
import {
  getCommissionerList,
  getNextCommissioner,
  initCommissionerQueue,
} from "@/api/commissioners";

export default function Commissioners() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" | "editor" | "member" | null

  const isAdmin = role === "admin";
  const isEditorOrAdmin = role === "admin" || role === "editor";

  const [commissioners, setCommissioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedCommissioner, setSelectedCommissioner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ── Fetch list ───────────────────────────────────────────────────────────
  const fetchList = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getCommissionerList(token);
      setCommissioners(data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load commissioner list.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // ── Get Next Commissioner ─────────────────────────────────────────────────
  const handleGetNext = async () => {
    setActionLoading(true);
    setError("");
    try {
      const next = await getNextCommissioner(token);
      setSelectedCommissioner(next);
      setShowModal(true);
      await fetchList();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get next commissioner.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reset / Init Queue ────────────────────────────────────────────────────
  const handleResetQueue = async () => {
    if (!window.confirm("Reset the commissioner queue? This will re-initialize from scratch.")) return;
    setActionLoading(true);
    setError("");
    try {
      const res = await initCommissionerQueue(token);
      showSuccess(res.message || "Queue initialized successfully.");
      await fetchList();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset queue.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Assigned count for progress bar ──────────────────────────────────────
  const totalInQueue = commissioners.filter((c) => c.inQueue).length;
  const assignedCount = commissioners.filter((c) => c.assigned).length;
  const cyclePercent = totalInQueue > 0 ? Math.round((assignedCount / totalInQueue) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                Advocate Commissioner List
              </h1>
            </div>
            <p className="text-zinc-500 text-sm font-medium ml-1">
              Only COP-eligible members · Sorted by experience (highest first) · Fair rotation cycle
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {isAdmin && (
              <Button
                onClick={handleResetQueue}
                disabled={actionLoading}
                variant="outline"
                className="border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-xl gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {actionLoading ? "Processing..." : "Reset Queue"}
              </Button>
            )}
            {isEditorOrAdmin && (
              <Button
                onClick={handleGetNext}
                disabled={actionLoading}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2 px-6 shadow-lg shadow-primary/20"
              >
                <ChevronRight className="w-4 h-4" />
                {actionLoading ? "Assigning..." : "Get Next Commissioner"}
              </Button>
            )}
          </div>
        </div>

        {/* ── Feedback banners ───────────────────────────────────────────── */}
        {error && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* ── Cycle Progress Card ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-zinc-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">COP Members</p>
                <p className="text-2xl font-extrabold text-zinc-900">{commissioners.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Assigned</p>
                <p className="text-2xl font-extrabold text-zinc-900">{assignedCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Cycle Progress</p>
                <p className="text-2xl font-extrabold text-zinc-900">{cyclePercent}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress bar */}
        {totalInQueue > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1.5">
              <span>Rotation Progress</span>
              <span>{assignedCount} / {totalInQueue} assigned</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-700"
                style={{ width: `${cyclePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Main Table ─────────────────────────────────────────────────── */}
        <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-zinc-50 p-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Commissioner Rotation Queue</CardTitle>
                <CardDescription className="text-sm font-medium">
                  Members sorted by experience (highest first). Each member is selected once per cycle.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-24 text-zinc-400 font-medium">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-zinc-300" />
                Loading commissioner list...
              </div>
            ) : commissioners.length === 0 ? (
              <div className="text-center py-24 px-8">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-zinc-600 font-bold mb-1">No COP Members Found</h3>
                <p className="text-zinc-400 text-sm">
                  No members have COP status enabled yet. Enable COP for members via the Admin Panel.
                </p>
                {isAdmin && (
                  <Button
                    onClick={handleResetQueue}
                    className="mt-6 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
                    disabled={actionLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Initialize Queue
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="border-zinc-50">
                    <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400 w-8">
                      #
                    </TableHead>
                    <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Name
                    </TableHead>
                    <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Enrollment No.
                    </TableHead>
                    <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Experience
                    </TableHead>
                    <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      COP
                    </TableHead>
                    <TableHead className="pr-8 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissioners.map((c, idx) => {
                    const isHighlighted = selectedCommissioner && c._id === selectedCommissioner._id;
                    return (
                      <TableRow
                        key={c._id}
                        className={`border-zinc-50 transition-colors ${
                          isHighlighted
                            ? "bg-primary/5 border-l-4 border-l-primary"
                            : c.assigned
                            ? "bg-zinc-50/60 opacity-70"
                            : "hover:bg-zinc-50/30"
                        }`}
                      >
                        {/* Order */}
                        <TableCell className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-400">
                            {c.inQueue ? c.queueOrder + 1 : "—"}
                          </span>
                        </TableCell>

                        {/* Name */}
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isHighlighted
                                  ? "bg-primary text-white"
                                  : "bg-zinc-100 text-zinc-600"
                              }`}
                            >
                              {c.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className={`font-semibold text-sm ${isHighlighted ? "text-primary" : "text-zinc-900"}`}>
                              {c.name}
                              {isHighlighted && (
                                <span className="ml-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                                  CURRENT
                                </span>
                              )}
                            </span>
                          </div>
                        </TableCell>

                        {/* Enrollment No */}
                        <TableCell className="py-4 font-mono text-xs text-zinc-600">
                          {c.enrollmentNumber || "—"}
                        </TableCell>

                        {/* Experience */}
                        <TableCell className="py-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <Scale className="w-3 h-3" />
                            {c.experience > 0 ? `${c.experience} yr${c.experience === 1 ? "" : "s"}` : "< 1 yr"}
                          </span>
                        </TableCell>

                        {/* COP */}
                        <TableCell className="py-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            COP ✓
                          </span>
                        </TableCell>

                        {/* Assignment Status */}
                        <TableCell className="pr-8 py-4 text-right">
                          {!c.inQueue ? (
                            <span className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              Not in Queue
                            </span>
                          ) : c.assigned ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" />
                              Assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* ── Role info footer ───────────────────────────────────────────── */}
        {!isEditorOrAdmin && token && (
          <p className="text-center text-xs text-zinc-400 font-medium mt-6">
            You are viewing as <span className="font-bold">{role || "guest"}</span>. Contact an admin for access to commissioner actions.
          </p>
        )}
        {!token && (
          <div className="text-center mt-6">
            <p className="text-sm text-zinc-500 mb-3">Login to manage commissioner assignments.</p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-primary text-white hover:bg-primary/90 rounded-xl"
            >
              Admin Login
            </Button>
          </div>
        )}
      </div>

      {/* ── Next Commissioner Modal ─────────────────────────────────────── */}
      {showModal && selectedCommissioner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-white relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-black">
                    {selectedCommissioner.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                    Next Commissioner Assigned
                  </p>
                  <h2 className="text-2xl font-extrabold leading-tight">
                    {selectedCommissioner.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                    Enrollment No.
                  </p>
                  <p className="font-bold text-zinc-900 font-mono text-sm">
                    {selectedCommissioner.enrollmentNumber || "—"}
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                    Experience
                  </p>
                  <p className="font-bold text-zinc-900 text-sm">
                    {selectedCommissioner.experience > 0
                      ? `${selectedCommissioner.experience} years`
                      : "< 1 year"}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">
                    COP Status
                  </p>
                  <p className="font-bold text-emerald-700 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Eligible — Commissioner of Practice
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setShowModal(false)}
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl py-6 font-bold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
