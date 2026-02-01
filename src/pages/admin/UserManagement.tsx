import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Profile, UserRole } from '@/types';

const UserManagement = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await api.patch(`/users/${id}/`, { is_approved: true });
            toast.success("Developer approved");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to approve developer");
        }
    };

    const deleteUser = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}/`);
            toast.success("User deleted");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>{u.user.username}</TableCell>
                                    <TableCell>{u.role}</TableCell>
                                    <TableCell>
                                        {u.role === UserRole.DEVELOPER ? (
                                            u.is_approved ? <span className="text-green-600 font-bold">Approved</span> : <span className="text-yellow-600 font-bold">Pending</span>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="flex gap-2">
                                        {u.role === UserRole.DEVELOPER && !u.is_approved && (
                                            <Button size="sm" onClick={() => handleApprove(u.id)}>Approve</Button>
                                        )}
                                        <Button size="sm" variant="destructive" onClick={() => deleteUser(u.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagement;
