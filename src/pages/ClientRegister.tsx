import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const ClientRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    industry: "",
    projectTitle: "",
    projectDescription: "",
    category: "",
    budget: "",
    deadline: "",
  });

  const categories = [
    "Website Development",
    "Web Applications",
    "Mobile Apps",
    "Digital Marketing",
    "Personal Adviser",
    "E-commerce Solutions",
    "Branding",
    "Logo Designing",
    "Promotion",
    "SEO Services",
    "Consulting Services",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔹 SEND DATA TO YOUR BACKEND API
      const response = await fetch("http://localhost:5000/api/clients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      toast.success("Registration successful!");
      navigate("/client-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl">Join as a Client</CardTitle>
              <CardDescription>
                Create your profile and start posting projects
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ACCOUNT INFO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Password *</Label>
                      <Input
                        type="password"
                        minLength={6}
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* COMPANY INFO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Industry</Label>
                      <Input
                        value={formData.industry}
                        onChange={(e) =>
                          setFormData({ ...formData, industry: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* PROJECT INFO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">First Project (Optional)</h3>

                  <Input
                    placeholder="Project Title"
                    value={formData.projectTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, projectTitle: e.target.value })
                    }
                  />

                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
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

                  <Textarea
                    rows={4}
                    placeholder="Project description"
                    value={formData.projectDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectDescription: e.target.value,
                      })
                    }
                  />
                </div>

                <Button className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Register as Client"}
                </Button>

                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => navigate("/auth")}
                  >
                    Login
                  </span>
                </p>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientRegister;
