import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Project, ProjectStatus } from '@/types';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        service_type: 'Website Development',
        budget: ''
    });

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/');
            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projects/', newProject);
            toast.success('Project request submitted successfully');
            setIsCreateOpen(false);
            setNewProject({ title: '', description: '', service_type: 'Website Development', budget: '' });
            fetchProjects();
        } catch (error) {
            toast.error('Failed to create project');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.user.first_name || user?.user.username}</p>
                    </div>
                    <div className="flex gap-4">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button>+ New Project Request</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleCreateSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Create Project Request</DialogTitle>
                                        <DialogDescription>
                                            Submit a new work request to the admin.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Project Title</Label>
                                            <Input
                                                id="title"
                                                value={newProject.title}
                                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="service">Service Type</Label>
                                            <Select
                                                value={newProject.service_type}
                                                onValueChange={(val) => setNewProject({ ...newProject, service_type: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Logo & Branding">Logo & Branding</SelectItem>
                                                    <SelectItem value="Website Development">Website Development</SelectItem>
                                                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                                                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                                    <SelectItem value="SEO">SEO</SelectItem>
                                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={newProject.description}
                                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="budget">Budget (Optional)</Label>
                                            <Input
                                                id="budget"
                                                type="number"
                                                value={newProject.budget}
                                                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                                                placeholder="Expected budget"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Submit Request</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" onClick={logout}>Logout</Button>
                    </div>
                </div>

                {/* Project List */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Messages</h2>
                    <p className="text-gray-500 mb-4">Chat with the Admin team.</p>
                    <Button variant="secondary" onClick={() => window.location.href = '/client/messages'}>Open Chat</Button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <h2 className="text-xl font-semibold text-gray-800">Your Projects</h2>
                    {isLoading ? (
                        <p>Loading projects...</p>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">You haven't submitted any projects yet.</p>
                            <Button variant="secondary" onClick={() => setIsCreateOpen(true)}>Create First Project</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Card key={project.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{project.title}</CardTitle>
                                            <span className={`text-xs px-2 py-1 rounded-full ${project.status === ProjectStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                                                project.status === ProjectStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                                                    project.status === ProjectStatus.REJECTED ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <CardDescription>{project.service_type}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            Created: {new Date(project.created_at).toLocaleDateString()}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
