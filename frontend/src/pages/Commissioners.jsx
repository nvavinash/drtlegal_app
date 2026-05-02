import { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Award,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Scale,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import { getCopMembersPublic } from "@/api/commissioners";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const APPOINTED_COLORS = {
  "DRT-1 RO1": "bg-blue-50 text-blue-700 border border-blue-200",
  "DRT-1 RO2": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "DRT-2 RO1": "bg-violet-50 text-violet-700 border border-violet-200",
  "DRT-2 RO2": "bg-purple-50 text-purple-700 border border-purple-200",
};

function AppointedBadge({ value }) {
  if (!value) return null;
  const cls = APPOINTED_COLORS[value] || "bg-zinc-100 text-zinc-600";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {value}
    </span>
  );
}

/* Mobile card layout */
function MobileCard({ m, idx }) {
  const assigned = !!m.assignment;
  return (
    <div
      className={`bg-white border rounded-2xl p-4 shadow-sm ${assigned ? "border-emerald-100" : "border-zinc-100"}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${assigned ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}
        >
          {idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-zinc-900 text-sm truncate">{m.name}</p>
          <p className="text-xs text-zinc-500">
            {m.experience > 0 ? `${m.experience} yrs` : "< 1 yr"} experience
          </p>
        </div>
        {assigned ? (
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" /> Assigned
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-zinc-50 text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <Clock className="w-3 h-3" /> In Queue
          </span>
        )}
      </div>
      {assigned && (
        <div className="flex flex-wrap gap-2 items-center mt-2 pt-2 border-t border-zinc-50">
          <AppointedBadge value={m.assignment.appointedBy} />
          <span className="font-mono text-xs text-zinc-600 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
            {m.assignment.rcNumber}
          </span>
          <span className="text-[10px] text-zinc-400 flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />{" "}
            {fmtDate(m.assignment.assignedDate)}
          </span>
        </div>
      )}
      {!assigned && m.enrollmentNumber && (
        <p className="text-xs text-zinc-400 font-mono mt-1">
          #{m.enrollmentNumber}
        </p>
      )}
    </div>
  );
}

export default function Commissioners() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  // const isEditorOrAdmin = role === "editor" || role === "admin";
  const isEditorOrAdmin = role === "editor";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filter, setFilter] = useState("all"); // "all" | "assigned" | "pending"

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCopMembersPublic();
      setMembers(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load commissioner list.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assignedCount = members.filter((m) => !!m.assignment).length;
  const pendingCount = members.length - assignedCount;

  const filtered = members.filter((m) => {
    if (filter === "assigned") return !!m.assignment;
    if (filter === "pending") return !m.assignment;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                Advocate Commissioners List
              </h1>
            </div>
            <p className="text-zinc-500 text-sm font-medium ml-1">
              All COP-approved members · Sorted by experience · DRT Advocates
              Association Hyderabad
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={load}
              variant="outline"
              className="border-zinc-200 rounded-xl gap-2 text-zinc-700"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            {isEditorOrAdmin && (
              <Button
                onClick={() => navigate("/commissioner-panel")}
                className="bg-primary text-white hover:bg-primary/90 rounded-xl gap-2"
              >
                <ChevronRight className="w-4 h-4" /> Manage
              </Button>
            )}
          </div>
        </div>

        {/* ── Error ───────────────────────────────────────────────── */}
        {error && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* ── Stats ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white border-zinc-100 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Total COP
                </p>
                <p className="text-2xl font-extrabold text-zinc-900">
                  {members.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-zinc-100 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Assigned
                </p>
                <p className="text-2xl font-extrabold text-zinc-900">
                  {assignedCount}
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
                  Pending
                </p>
                <p className="text-2xl font-extrabold text-zinc-900">
                  {pendingCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Filter Tabs ──────────────────────────────────────────── */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "all", label: `All (${members.length})` },
            { key: "assigned", label: `Assigned (${assignedCount})` },
            { key: "pending", label: `In Queue (${pendingCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                filter === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-zinc-50 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  Commissioner Rotation List
                </CardTitle>
                <CardDescription className="text-sm">
                  {filtered.length} member{filtered.length !== 1 ? "s" : ""}{" "}
                  shown · Sorted by experience (highest first)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-24 text-zinc-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-zinc-300" />
                Loading commissioner list...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 px-8">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-zinc-600 font-bold mb-1">
                  No Members Found
                </h3>
                <p className="text-zinc-400 text-sm">
                  {filter === "assigned"
                    ? "No assignments have been made yet."
                    : filter === "pending"
                      ? "All COP members have been assigned."
                      : "No COP-approved members found."}
                </p>
              </div>
            ) : isMobile ? (
              /* Mobile: card layout */
              <div className="p-4 space-y-3">
                {filtered.map((m, i) => (
                  <MobileCard key={m._id} m={m} idx={i} />
                ))}
              </div>
            ) : (
              /* Desktop: table */
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="border-zinc-50">
                    <TableHead className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400 w-10">
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
                      Appointed By
                    </TableHead>
                    <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      RC Number
                    </TableHead>
                    <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Date
                    </TableHead>
                    <TableHead className="pr-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((m, idx) => {
                    const assigned = !!m.assignment;
                    return (
                      <TableRow
                        key={m._id}
                        className={`border-zinc-50 transition-colors ${assigned ? "hover:bg-emerald-50/30" : "hover:bg-zinc-50/40 opacity-75"}`}
                      >
                        <TableCell className="px-6 py-4">
                          <span className="text-xs font-bold text-zinc-400">
                            {idx + 1}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${assigned ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}
                            >
                              {m.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm text-zinc-900">
                              {m.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-mono text-xs text-zinc-500">
                          {m.enrollmentNumber || "—"}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <Scale className="w-3 h-3" />
                            {m.experience > 0
                              ? `${m.experience} yr${m.experience !== 1 ? "s" : ""}`
                              : "< 1 yr"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          {assigned ? (
                            <AppointedBadge value={m.assignment.appointedBy} />
                          ) : (
                            <span className="text-zinc-300 text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 font-mono text-xs text-zinc-600">
                          {assigned ? (
                            m.assignment.rcNumber
                          ) : (
                            <span className="text-zinc-300">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-xs text-zinc-500">
                          {assigned ? (
                            fmtDate(m.assignment.assignedDate)
                          ) : (
                            <span className="text-zinc-300">—</span>
                          )}
                        </TableCell>
                        <TableCell className="pr-6 py-4">
                          {assigned ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> Assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <Clock className="w-3 h-3" /> In Queue
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

        {/* ── Footer ──────────────────────────────────────────────── */}
        {!token && (
          <div className="text-center mt-8">
            <p className="text-sm text-zinc-500 mb-3">
              Recovery Officers login required to manage commissioner
              assignments.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-primary text-white hover:bg-primary/90 rounded-xl"
            >
              Recovery Officer Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
