import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Briefcase, User, Bell } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(null);
  const [developer, setDeveloper] = useState<any>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      const res = await fetch(`${API_URL}/developers/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();

      setProfile(data.profile);
      setDeveloper(data.developer);
      setAvailableProjects(data.availableProjects);
      setMyApplications(data.myApplications);
    } catch (err) {
      toast.error("Failed to load dashboard");
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (projectId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) throw new Error("Already applied");

      toast.success("Application submitted!");
      loadDashboard();
    } catch (err: any) {
      toast.error(err.message || "Failed to apply");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Complete Developer Profile</CardTitle>
              <CardDescription>
                Finish your profile to access dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/developer-register")}
                className="w-full"
              >
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Developer Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Welcome back, {profile?.full_name}
          </p>

          <Tabs defaultValue="projects">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="projects">
                <Briefcase className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="applications">
                <Bell className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* PROJECTS */}
            <TabsContent value="projects">
              {availableProjects.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    No projects available
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {availableProjects.map((p) => (
                    <Card key={p.id}>
                      <CardHeader>
                        <CardTitle>{p.title}</CardTitle>
                        <CardDescription>{p.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-between">
                        <Badge>{p.category}</Badge>
                        <Button onClick={() => handleApply(p.id)}>
                          Apply
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* APPLICATIONS */}
            <TabsContent value="applications">
              {myApplications.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    No applications yet
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {myApplications.map((a) => (
                    <Card key={a.id}>
                      <CardHeader>
                        <CardTitle>{a.project.title}</CardTitle>
                        <Badge>{a.status}</Badge>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* PROFILE */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{developer.bio}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeveloperDashboard;
