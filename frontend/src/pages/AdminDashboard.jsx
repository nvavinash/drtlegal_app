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
  Image as ImageIcon
} from "lucide-react";
import axios from "axios";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/api/events";
import { format, parseISO } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members"); // members, links, events
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [virtualLinks, setVirtualLinks] = useState({ drat_link: "", drt1_link: "", drt2_link: "" });
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");

  // Event Form State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    imageUrl: "",
    category: "Other",
    details: ""
  });

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
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/virtual"),
          getEvents()
        ]);

        setUsers(usersRes.data);
        setVirtualLinks({
          drat_link: linksRes.data.drat_link || "",
          drt1_link: linksRes.data.drt1_link || "",
          drt2_link: linksRes.data.drt2_link || "",
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUpdateLinks = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus("");
    try {
      await axios.post("http://localhost:5000/api/admin/virtual", 
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
      if (editingEvent) {
        await updateEvent(editingEvent._id, eventFormData, token);
      } else {
        await createEvent(eventFormData, token);
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
      date: format(parseISO(event.date), "yyyy-MM-dd"),
      time: event.time || "",
      location: event.location || "",
      imageUrl: event.imageUrl || "",
      category: event.category || "Other",
      details: event.details || ""
    });
    setIsEventModalOpen(true);
  };

  const resetEventForm = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      imageUrl: "",
      category: "Other",
      details: ""
    });
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Registered Members</CardTitle>
                  <CardDescription className="text-sm font-medium">A list of all users and administrators within the platform.</CardDescription>
                </div>
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl px-6">
                  <Plus className="w-4 h-4 mr-2" /> Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-20 text-zinc-400 font-medium">Loading members data...</div>
              ) : (
                <Table>
                  <TableHeader className="bg-zinc-50/50">
                    <TableRow className="border-zinc-50">
                      <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Role</TableHead>
                      <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Joined Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                          <TableCell className="px-8 py-6 font-bold text-zinc-900">{user.email}</TableCell>
                          <TableCell className="py-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              user.role === 'admin' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="py-6 text-zinc-500 font-medium">
                            {format(parseISO(user.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-20 text-zinc-400">No members found.</TableCell>
                      </TableRow>
                    )}
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
                  <CardTitle className="text-xl font-bold">Meeting Links</CardTitle>
                </div>
                <CardDescription className="text-sm font-medium">Update the virtual hearing links that appear on the homepage.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdateLinks} className="space-y-6">
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
                    <CardTitle className="text-xl font-bold">Event Management</CardTitle>
                    <CardDescription className="text-sm font-medium">Create and manage upcoming activities and seminars.</CardDescription>
                  </div>
                  <Button 
                    onClick={() => { resetEventForm(); setIsEventModalOpen(true); }}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create Event
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
                        <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Event Info</TableHead>
                        <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Date & Time</TableHead>
                        <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-zinc-400">Category</TableHead>
                        <TableHead className="pr-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.length > 0 ? (
                        events.map((event) => (
                          <TableRow key={event._id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                            <TableCell className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                {event.imageUrl ? (
                                  <img src={event.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                ) : (
                                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                                    <ImageIcon size={20} />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-zinc-900">{event.title}</div>
                                  <div className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                                    <MapPin size={10} /> {event.location}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-6">
                              <div className="text-sm font-bold text-zinc-900">{format(parseISO(event.date), 'MMM d, yyyy')}</div>
                              <div className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                                <Clock size={10} /> {event.time}
                              </div>
                            </TableCell>
                            <TableCell className="py-6">
                              <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {event.category}
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
                          <TableCell colSpan={4} className="text-center py-20 text-zinc-400 font-medium">No events created yet.</TableCell>
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
                <h2 className="text-2xl font-bold text-zinc-900">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                <p className="text-sm text-zinc-500 font-medium">Fill in the details to schedule association activities.</p>
              </div>
              <button onClick={() => setIsEventModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Event Title</label>
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
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Time</label>
                    <input
                      required
                      type="text"
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      placeholder="e.g. 10:00 AM - 1:00 PM"
                      value={eventFormData.time}
                      onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Location</label>
                    <input
                      required
                      type="text"
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      placeholder="e.g. High Court Hall, Hyderabad"
                      value={eventFormData.location}
                      onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Category</label>
                    <select
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      value={eventFormData.category}
                      onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                    >
                      <option value="Seminar">Seminar</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Conference">Conference</option>
                      <option value="Social">Social</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Short Description</label>
                  <textarea
                    required
                    rows="2"
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all resize-none"
                    placeholder="Brief overview for the card list..."
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Detailed Information (Optional)</label>
                  <textarea
                    rows="4"
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all resize-none"
                    placeholder="Full details that appear on the event page..."
                    value={eventFormData.details}
                    onChange={(e) => setEventFormData({ ...eventFormData, details: e.target.value })}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Image URL (Optional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                    <input
                      type="url"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      placeholder="https://images.unsplash.com/..."
                      value={eventFormData.imageUrl}
                      onChange={(e) => setEventFormData({ ...eventFormData, imageUrl: e.target.value })}
                    />
                  </div>
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
