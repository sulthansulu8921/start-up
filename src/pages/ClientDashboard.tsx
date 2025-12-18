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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, FolderOpen, Plus, Users } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
  });

  const categories = [
    "Website Development",
    "Web Applications",
    "Mobile Apps",
    "Digital Marketing",
    "E-commerce Solutions",
    "Branding",
    "SEO Services",
    "Consulting Services",
  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    loadDashboard();
  }, []);

  // ================= LOAD DASHBOARD =================
  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/client/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setProfile(data.profile);
      setClient(data.client);
      setMyProjects(data.projects || []);
      setLoading(false);
    } catch (err) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/auth");
    }
  };

  // ================= CREATE PROJECT =================
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });

      if (!res.ok) throw new Error("Failed to create project");

      toast.success("Project created successfully!");
      setDialogOpen(false);
      setProjectForm({
        title: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
      });

      loadDashboard();
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Client Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name}
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Post a project to hire developers
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      required
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={projectForm.category}
                      onValueChange={(value) =>
                        setProjectForm({ ...projectForm, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      required
                      rows={4}
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Budget"
                      value={projectForm.budget}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          budget: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="date"
                      value={projectForm.deadline}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button className="w-full" type="submit">
                    Create Project
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="projects">
            <TabsList className="grid grid-cols-2 max-w-md">
              <TabsTrigger value="projects">
                <FolderOpen className="h-4 w-4 mr-2" />
                My Projects
              </TabsTrigger>
              <TabsTrigger value="applications">
                <Users className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6 space-y-4">
              {myProjects.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No projects yet
                  </CardContent>
                </Card>
              ) : (
                myProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Category: {project.category}</p>
                      <p>Applications: {project.applications?.length || 0}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Applications view (backend ready)
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

export default ClientDashboard;
