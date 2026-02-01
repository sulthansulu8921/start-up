import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>{user?.user.username} (Super Admin)</span>
                    <Button variant="outline" onClick={logout}>Logout</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow text-gray-900">
                    <h2 className="text-xl font-semibold mb-4">User Management</h2>
                    <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/admin/users'}>Manage Users</Button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-gray-900">
                    <h2 className="text-xl font-semibold mb-4">Projects & Tasks</h2>
                    <Button variant="secondary" className="w-full mb-2" onClick={() => window.location.href = '/admin/projects'}>View Projects</Button>
                    <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/admin/applications'}>View Applications</Button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-gray-900">
                    <h2 className="text-xl font-semibold mb-4">WMT (Treasury)</h2>
                    <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/admin/treasury'}>View Payments</Button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-gray-900">
                    <h2 className="text-xl font-semibold mb-4">Communication</h2>
                    <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/admin/messages'}>Messages</Button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
