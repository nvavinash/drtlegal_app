import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Scale, 
  LogOut, 
  Users, 
  Video, 
  Save, 
  CheckCircle, 
  Calendar, 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Clock,
  MapPin,
  Image as ImageIcon,
  Check,
  Ban,
  Eye,
  ChevronDown,
  ChevronUp,
  Award
} from "lucide-react";
import axios from "axios";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/api/events";
import { getAllMembersAdmin, updateMember, deleteMember, downloadMemberPdf } from "@/api/members";
import { format, parseISO } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members"); // members, links, events
  const [users, setUsers] = useState([]);
  const [memberApplications, setMemberApplications] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberFilter, setMemberFilter] = useState("all"); // all | Pending | Approved | Rejected
  const [expandedMember, setExpandedMember] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [virtualLinks, setVirtualLinks] = useState({ 
    drat_link: "", drt1_link: "", drt2_link: "", upi_id: "", upi_payee: "" 
  });
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");

  // Event Form State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "event"
  });
  const [pdfFile, setPdfFile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, linksRes, eventsData] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/virtual`),
          getEvents()
        ]);

        setUsers(usersRes.data);
        setVirtualLinks({
          drat_link: linksRes.data.drat_link || "",
          drt1_link: linksRes.data.drt1_link || "",
          drt2_link: linksRes.data.drt2_link || "",
          upi_id: linksRes.data.upi_id || "",
          upi_payee: linksRes.data.upi_payee || "",
        });
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch member applications when tab is active
  useEffect(() => {
    if (activeTab === "members" && token) {
      fetchMemberApplications();
    }
  }, [activeTab]);

  const fetchMemberApplications = async () => {
    setMembersLoading(true);
    try {
      const data = await getAllMembersAdmin(token);
      setMemberApplications(data);
    } catch (err) {
      console.error("Failed to fetch member applications", err);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleMemberStatus = async (id, newStatus) => {
    try {
      await updateMember(id, { status: newStatus }, token);
      setMemberApplications((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error("Failed to update member status", err);
      alert("Failed to update status. Try again.");
    }
  };

  const handleCopToggle = async (id, currentCop) => {
    try {
      await updateMember(id, { copStatus: !currentCop }, token);
      setMemberApplications((prev) =>
        prev.map((m) => (m._id === id ? { ...m, copStatus: !currentCop } : m))
      );
    } catch (err) {
      console.error("Failed to toggle COP status", err);
      alert("Failed to update COP status. Try again.");
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Delete this member application permanently?")) return;
    try {
      await deleteMember(id, token);
      setMemberApplications((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete member", err);
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await downloadMemberPdf(id, token);
    } catch (err) {
      console.error("Failed to download PDF", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const filteredApplications = memberFilter === "all"
    ? memberApplications
    : memberApplications.filter((m) => m.status === memberFilter);

  const statusBadge = (s) => {
    const map = {
      Pending:  "bg-amber-50 text-amber-700 border border-amber-200",
      Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      Rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    };
    return map[s] ?? "bg-zinc-100 text-zinc-600";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleUpdateLinks = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/virtual`, 
        { settings: virtualLinks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("Settings updated successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Failed to update links", err);
      setStatus("Error updating settings.");
    } finally {
      setUpdating(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append("title", eventFormData.title);
      fd.append("description", eventFormData.description);
      fd.append("date", eventFormData.date);
      fd.append("type", eventFormData.type);
      if (pdfFile) {
        fd.append("pdf", pdfFile);
      }

      if (editingEvent) {
        await updateEvent(editingEvent._id, fd, token);
      } else {
        await createEvent(fd, token);
      }
      const updatedEvents = await getEvents();
      setEvents(updatedEvents);
      setIsEventModalOpen(false);
      resetEventForm();
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Error saving event. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id, token);
        setEvents(events.filter(e => e._id !== id));
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description || "",
      date: event.date ? format(parseISO(event.date), "yyyy-MM-dd") : "",
      type: event.type || "event"
    });
    setPdfFile(null);
    setIsEventModalOpen(true);
  };

  const resetEventForm = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      description: "",
      date: "",
      type: "event"
    });
    setPdfFile(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border bg-white sticky top-24 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900">Admin Panel</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-zinc-500 hover:text-rose-600 transition-colors">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pt-32 pb-10 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Dashboard</h1>
            <p className="text-zinc-500 mt-1 text-sm font-medium">Manage association data and events from one place.</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border border-zinc-200 shadow-sm self-start">
            <button
              onClick={() => setActiveTab("members")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "members" ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "text-zinc-500 hover:bg-zinc-50"}`}
            >
              <Users size={16} /> Members
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "links" ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "text-zinc-500 hover:bg-zinc-50"}`}
            >
              <Video size={16} /> Meeting Links
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "events" ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "text-zinc-500 hover:bg-zinc-50"}`}
            >
              <Calendar size={16} /> Events
            </button>
          </div>
        </div>

        {/* Members Tab */}
        {activeTab === "members" && (
          <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-zinc-50 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold">Membership Applications</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    Review and approve/reject incoming membership applications.
                  </CardDescription>
                </div>
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                  {["all", "Pending", "Approved", "Rejected"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setMemberFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        memberFilter === f
                          ? "bg-white shadow text-zinc-900 border border-zinc-200"
                          : "text-zinc-400 hover:text-zinc-700"
                      }`}
                    >
                      {f === "all" ? `All (${memberApplications.length})` : `${f} (${memberApplications.filter(m => m.status === f).length})`}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {membersLoading ? (
                <div className="text-center py-20 text-zinc-400 font-medium">Loading applications...</div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-20 text-zinc-400 font-medium">No applications found.</div>
              ) : (
                <Table>
                  <TableHeader className="bg-zinc-50/50">
                    <TableRow className="border-zinc-50">
                      <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Applicant</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Enrollment No.</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Contact</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Membership</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Payment</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">COP</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</TableHead>
                      <TableHead className="pr-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((m) => (
                      <>
                        <TableRow key={m._id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                          <TableCell className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200">
                                {m.photo ? (
                                  <img src={`${import.meta.env.VITE_API_URL}${m.photo}`} alt={m.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                    {m.name?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-zinc-900 text-sm">{m.name}</div>
                                <div className="text-xs text-zinc-400">{m.gender || "—"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 font-mono text-xs text-zinc-600">{m.enrollmentNumber || "—"}</TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm text-zinc-700">{m.phone}</div>
                            <div className="text-xs text-zinc-400">{m.email || "—"}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{m.membershipType || "NORMAL"}</span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-xs text-zinc-700 font-medium">₹{m.amountPaid || "—"}</div>
                            <div className="text-xs text-zinc-400 font-mono truncate max-w-[100px]">{m.transactionNumber || "—"}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            {m.copStatus ? (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                COP ✓
                              </span>
                            ) : (
                              <span className="bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge(m.status)}`}>
                              {m.status}
                            </span>
                          </TableCell>
                          <TableCell className="pr-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setExpandedMember(expandedMember === m._id ? null : m._id)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
                                title="View Details"
                              >
                                {expandedMember === m._id ? <ChevronUp size={15} /> : <Eye size={15} />}
                              </button>
                              <button
                                onClick={() => handleDownloadPdf(m._id)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition"
                                title="Download PDF Form"
                              >
                                <Save size={15} />
                              </button>
                              {m.status !== "Approved" && (
                                <button
                                  onClick={() => handleMemberStatus(m._id, "Approved")}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                                  title="Approve"
                                >
                                  <Check size={15} />
                                </button>
                              )}
                              {m.status !== "Rejected" && (
                                <button
                                  onClick={() => handleMemberStatus(m._id, "Rejected")}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 transition"
                                  title="Reject"
                                >
                                  <Ban size={15} />
                                </button>
                              )}
                              <button
                                onClick={() => handleCopToggle(m._id, m.copStatus)}
                                className={`h-8 w-8 flex items-center justify-center rounded-lg transition ${
                                  m.copStatus
                                    ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                                    : "text-zinc-300 hover:text-amber-500 hover:bg-amber-50"
                                }`}
                                title={m.copStatus ? "Disable COP" : "Enable COP"}
                              >
                                <Award size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(m._id)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg text-rose-400 hover:bg-rose-50 transition"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {/* Expanded row */}
                        {expandedMember === m._id && (
                          <TableRow className="bg-zinc-50/50 border-zinc-100">
                            <TableCell colSpan={8} className="px-8 py-5">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><span className="text-xs text-zinc-400 block">Address</span><span className="text-zinc-700">{m.address || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">State</span><span className="text-zinc-700">{m.state || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">DOB</span><span className="text-zinc-700">{m.dob || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">Blood Group</span><span className="text-zinc-700">{m.bloodGroup || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">Enrollment Date</span><span className="text-zinc-700">{m.enrollmentDate || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">Membership Date</span><span className="text-zinc-700">{m.membershipDate || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">Membership Fee</span><span className="text-zinc-700">₹{m.membershipFee || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">Payment Time</span><span className="text-zinc-700">{m.paymentTime || "—"}</span></div>
                                <div className="col-span-2"><span className="text-xs text-zinc-400 block">Transaction No.</span><span className="font-mono text-zinc-700">{m.transactionNumber || "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">Applied</span><span className="text-zinc-700">{m.createdAt ? format(parseISO(m.createdAt), 'MMM d, yyyy') : "—"}</span></div>
                                <div><span className="text-xs text-zinc-400 block">COP Status</span><span className={`font-bold ${m.copStatus ? 'text-amber-600' : 'text-zinc-400'}`}>{m.copStatus ? 'Enabled ✓' : 'Disabled'}</span></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Meeting Links Tab */}
        {activeTab === "links" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl">
              <CardHeader className="p-8 border-b border-zinc-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <Video className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Settings & Links</CardTitle>
                </div>
                <CardDescription className="text-sm font-medium">Update the virtual hearing links and payment integration settings.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdateLinks} className="space-y-6">
                  <div className="border-b border-zinc-100 pb-4 mb-4">
                    <h3 className="text-sm font-bold text-zinc-900 mb-4">Virtual Hearing Links</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">DRAT (Appellate Tribunal) Link</label>
                        <input
                          type="url"
                          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-zinc-300"
                          placeholder="https://..."
                          value={virtualLinks.drat_link}
                          onChange={(e) => setVirtualLinks({ ...virtualLinks, drat_link: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">DRT-1 Link</label>
                          <input
                            type="url"
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all placeholder:text-zinc-300"
                            placeholder="https://..."
                            value={virtualLinks.drt1_link}
                            onChange={(e) => setVirtualLinks({ ...virtualLinks, drt1_link: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">DRT-2 Link</label>
                          <input
                            type="url"
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all placeholder:text-zinc-300"
                            placeholder="https://..."
                            value={virtualLinks.drt2_link}
                            onChange={(e) => setVirtualLinks({ ...virtualLinks, drt2_link: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pb-4">
                    <h3 className="text-sm font-bold text-zinc-900 mb-4">UPI Payment Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">UPI ID</label>
                        <input
                          type="text"
                          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all placeholder:text-zinc-300"
                          placeholder="e.g. 8299177208@upi"
                          value={virtualLinks.upi_id}
                          onChange={(e) => setVirtualLinks({ ...virtualLinks, upi_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Payee Name</label>
                        <input
                          type="text"
                          className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all placeholder:text-zinc-300"
                          placeholder="e.g. Avinash"
                          value={virtualLinks.upi_payee}
                          onChange={(e) => setVirtualLinks({ ...virtualLinks, upi_payee: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={updating}
                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all py-7 rounded-2xl font-bold text-base shadow-lg shadow-zinc-200"
                  >
                    {updating ? "Saving Changes..." : (
                      <>
                        <Save className="w-5 h-5 mr-2" /> Update All Links
                      </>
                    )}
                  </Button>
                  {status && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm justify-center font-bold animate-in fade-in slide-in-from-top-2 ${status.includes('Error') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {!status.includes('Error') && <CheckCircle className="w-5 h-5" />}
                      {status}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-8">
            <Card className="bg-white border-zinc-100 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-zinc-50 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Event/Notice Management</CardTitle>
                    <CardDescription className="text-sm font-medium">Create and manage upcoming activities and seminars.</CardDescription>
                  </div>
                  <Button 
                    onClick={() => { resetEventForm(); setIsEventModalOpen(true); }}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create Event/Notice
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-20 text-zinc-400 font-medium">Loading events...</div>
                ) : (
                  <Table>
                    <TableHeader className="bg-zinc-50/50">
                      <TableRow className="border-zinc-50">
                        <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Event/Notice Info</TableHead>
                        <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Date</TableHead>
                        <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Type</TableHead>
                        <TableHead className="pr-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.length > 0 ? (
                        events.map((event) => (
                          <TableRow key={event._id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                            <TableCell className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div>
                                  <div className="font-bold text-zinc-900">{event.title}</div>
                                  <div className="text-xs text-zinc-400 font-medium">
                                    {event.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-6">
                              <div className="text-sm font-bold text-zinc-900">{event.date ? format(parseISO(event.date), 'MMM d, yyyy') : "—"}</div>
                            </TableCell>
                            <TableCell className="py-6">
                              <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {event.type}
                              </span>
                            </TableCell>
                            <TableCell className="pr-8 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => openEditModal(event)}
                                  className="h-9 w-9 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteEvent(event._id)}
                                  className="h-9 w-9 p-0 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-20 text-zinc-400 font-medium">No events/notices created yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">{editingEvent ? 'Edit Item' : 'Create New Item'}</h2>
                <p className="text-sm text-zinc-500 font-medium">Fill in the details for your new Event or Notice.</p>
              </div>
              <button onClick={() => setIsEventModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Event/Notice Title</label>
                  <input
                    required
                    type="text"
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    placeholder="e.g. Annual Legal Seminar"
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Date</label>
                    <input
                      required
                      type="date"
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Type</label>
                    <select
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      value={eventFormData.type}
                      onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}
                    >
                      <option value="event">Event</option>
                      <option value="notice">Notice</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Description</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all resize-none"
                    placeholder="Provide details about the event or notice..."
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">PDF Document (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="w-full pl-4 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all cursor-pointer"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  {editingEvent?.pdf && !pdfFile && (
                    <p className="text-xs text-zinc-500 mt-1">Current File: {editingEvent.pdf.split('/').pop()}</p>
                  )}
                </div>

                <div className="pt-4 pb-8">
                  <Button 
                    type="submit" 
                    disabled={updating}
                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-7 rounded-2xl font-bold text-base shadow-xl shadow-zinc-200 transition-all"
                  >
                    {updating ? "Saving Event..." : (editingEvent ? "Save Changes" : "Create Event")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
