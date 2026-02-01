import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Task, TaskStatus, Project, ProjectStatus } from '@/types';

const DeveloperDashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]); // New state for projects
    const [myApplications, setMyApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // State for submission
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<number | null>(null);
    const [submissionLink, setSubmissionLink] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskRes, projectRes, appRes] = await Promise.all([
                    api.get('/tasks/'), // backend filters by assigned_to for Devs
                    api.get('/projects/'), // Assuming this endpoint fetches projects
                    api.get('/applications/')
                ]);
                setTasks(taskRes.data);
                setProjects(projectRes.data);
                setMyApplications(appRes.data);
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        if (user?.is_approved) fetchData();
    }, [user]);

    const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/`, { status: newStatus });
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
            toast.success("Task status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;
        try {
            await api.patch(`/tasks/${selectedTask}/`, {
                status: TaskStatus.READY_FOR_REVIEW, // Or Completed, but Review implies Admin check
                submission_git_link: submissionLink
            });
            setTasks(tasks.map(t => t.id === selectedTask ? {
                ...t,
                status: TaskStatus.READY_FOR_REVIEW,
                submission_git_link: submissionLink
            } : t));
            toast.success("Work submitted successfully");
            setIsSubmitModalOpen(false);
            setSubmissionLink('');
        } catch (error) {
            toast.error("Failed to submit work");
        }
    };

    const openSubmissionModal = (taskId: number) => {
        setSelectedTask(taskId);
        setIsSubmitModalOpen(true);
    };

    const handleApply = async (projectId: number) => {
        try {
            await api.post('/applications/', { project: projectId });
            toast.success("Application submitted successfully. Wait for Admin approval.");
            const appRes = await api.get('/applications/');
            setMyApplications(appRes.data);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data[0]) {
                toast.error(error.response.data[0]);
            } else {
                toast.error("Failed to apply for project. You may have already applied.");
            }
        }
    };

    const getApplicationStatus = (projectId: number) => {
        const app = myApplications.find(a => a.project === projectId);
        return app ? app.status : null;
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* ... header ... */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Developer Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user?.user.username}</span>
                    <Button variant="outline" onClick={logout}>Logout</Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6 text-gray-900">
                <h2 className="text-xl font-semibold mb-2">Status: {user?.is_approved ? <span className="text-green-600">Approved</span> : <span className="text-yellow-600">Pending Approval</span>}</h2>
                {!user?.is_approved && <p className="text-yellow-600">You cannot access tasks until Admin approves your profile.</p>}
            </div>

            {/* Submission Modal */}
            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Work</DialogTitle>
                        <DialogDescription>Provide the Git repository link for your work.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmission}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="submissionLink">Git Repository Link</Label>
                                <Input
                                    id="submissionLink"
                                    placeholder="https://github.com/username/repo"
                                    value={submissionLink}
                                    onChange={(e) => setSubmissionLink(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Submit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {user?.is_approved && (
                <div className="space-y-8">
                    {/* Messages Link */}
                    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow text-gray-900">
                        <h2 className="text-xl font-semibold">Messages</h2>
                        <Button onClick={() => window.location.href = '/developer/messages'}>Open Chat</Button>
                    </div>

                    {/* Assigned Tasks Section */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Assigned Tasks</h2>
                        {loading ? <p>Loading...</p> : tasks.length === 0 ? (
                            <p className="text-gray-500">No tasks assigned yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tasks.map(task => (
                                    <Card key={task.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">{task.title}</CardTitle>
                                                <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'}>{task.status}</Badge>
                                            </div>
                                            <CardDescription>Project: {task.project_title}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                                            <div className="flex justify-between items-center text-sm mb-4">
                                                <span>Deadline: {task.deadline}</span>
                                                <span className="font-bold text-green-600">${task.budget}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.READY_FOR_REVIEW && (
                                                    <Button size="sm" onClick={() => openSubmissionModal(task.id)}>Submit Work</Button>
                                                )}
                                                {task.status === TaskStatus.ASSIGNED && (
                                                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(task.id, TaskStatus.IN_PROGRESS)}>Start Working</Button>
                                                )}
                                                {task.status === TaskStatus.READY_FOR_REVIEW && (
                                                    <Badge>In Review</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Available Projects Section */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Approved Projects</h2>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {projects.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No active projects available to view.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {projects.map(project => {
                                                const appStatus = getApplicationStatus(project.id);
                                                return (
                                                    <tr key={project.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{project.title}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{project.client_name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{project.service_type}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{project.deadline || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                {project.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {appStatus ? (
                                                                <Badge variant={appStatus === 'Approved' ? 'default' : 'secondary'}>
                                                                    Applied: {appStatus}
                                                                </Badge>
                                                            ) : (
                                                                <Button size="sm" onClick={() => handleApply(project.id)}>Apply</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeveloperDashboard;
