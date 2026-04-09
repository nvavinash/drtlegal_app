import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Scale, LogOut, Users } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Fetch users securely
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout(); // auto logout on unauthorized
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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

        {/* Users Table Card */}
        <Card className="bg-card border-border">
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
      </main>
    </div>
  );
}
