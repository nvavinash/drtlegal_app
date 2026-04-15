import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Scale, LogOut, Users, Video, Save, CheckCircle } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [virtualLinks, setVirtualLinks] = useState({ drat_link: "", drt1_link: "", drt2_link: "" });
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchVirtualLinks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/virtual");
        setVirtualLinks({
          drat_link: res.data.drat_link || "",
          drt1_link: res.data.drt1_link || "",
          drt2_link: res.data.drt2_link || "",
        });
      } catch (err) {
        console.error("Failed to fetch virtual links", err);
      }
    };

    fetchUsers();
    fetchVirtualLinks();
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
      const token = localStorage.getItem("token");
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">Legal Association Admin</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-secondary-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-secondary-foreground mt-1 text-sm">Manage your association members and system access.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Users className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Virtual Links Form */}
          <Card className="lg:col-span-1 bg-card border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Meeting Links</CardTitle>
              </div>
              <CardDescription>Update monthly hearing links for DRAT, DRT-1 and DRT-2.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateLinks} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-600">DRAT (Appellate Tribunal) Link</label>
                  <input
                    type="url"
                    className="w-full p-2.5 bg-background border border-amber-200 rounded-md text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    placeholder="https://dratchennai.webex.com/..."
                    value={virtualLinks.drat_link}
                    onChange={(e) => setVirtualLinks({ ...virtualLinks, drat_link: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">DRT-1 Link</label>
                  <input
                    type="url"
                    className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="https://zoom.us/j/..."
                    value={virtualLinks.drt1_link}
                    onChange={(e) => setVirtualLinks({ ...virtualLinks, drt1_link: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">DRT-2 Link</label>
                  <input
                    type="url"
                    className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="https://meet.google.com/..."
                    value={virtualLinks.drt2_link}
                    onChange={(e) => setVirtualLinks({ ...virtualLinks, drt2_link: e.target.value })}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={updating}
                  className="w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors py-5"
                >
                  {updating ? "Saving..." : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Links
                    </>
                  )}
                </Button>
                {status && (
                  <div className={`flex items-center gap-2 text-sm justify-center font-medium ${status.includes('Error') ? 'text-destructive' : 'text-emerald-600'}`}>
                    {!status.includes('Error') && <CheckCircle className="w-4 h-4" />}
                    {status}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Table stays here but with span */}
          <Card className="lg:col-span-2 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Registered Members</CardTitle>
            <CardDescription>A list of all users and administrators within the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-secondary-foreground text-sm">Loading data...</div>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-background/50">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[300px]">Email Address</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id} className="border-border hover:bg-background/50 transition-colors">
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.role === 'admin' 
                                ? 'bg-primary/20 text-primary border border-primary/20' 
                                : 'bg-secondary/20 text-secondary-foreground border border-secondary/20'
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-secondary-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-secondary-foreground">
                          No users found. Ensure the seed script has been run.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
