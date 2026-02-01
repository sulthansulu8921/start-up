import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Payment, Profile, UserRole } from '@/types';

const Treasury = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPayoutOpen, setIsPayoutOpen] = useState(false);
    const [newPayout, setNewPayout] = useState({
        payee: '', amount: ''
    });

    const fetchData = async () => {
        try {
            const [payRes, userRes] = await Promise.all([
                api.get('/payments/'),
                api.get('/users/')
            ]);
            setPayments(payRes.data);
            setUsers(userRes.data);
        } catch (error) {
            toast.error("Failed to load treasury data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreatePayout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/payments/', {
                payee: newPayout.payee,
                amount: newPayout.amount,
                payment_type: 'Payout',
                status: 'Paid', // Admin payouts are immediate for now
                payer: undefined // handled by backend as current user (Admin)
            });
            toast.success("Payout recorded successfully");
            setIsPayoutOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to record payout");
        }
    };

    const developers = users.filter(u => u.role === UserRole.DEVELOPER && u.is_approved);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">WMT Treasury</h1>
                <Dialog open={isPayoutOpen} onOpenChange={setIsPayoutOpen}>
                    <DialogTrigger asChild>
                        <Button>Record Payout</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleCreatePayout}>
                            <DialogHeader>
                                <DialogTitle>Record Developer Payout</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Developer</Label>
                                    <Select onValueChange={(val) => setNewPayout({ ...newPayout, payee: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Developer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {developers.map(dev => (
                                                <SelectItem key={dev.user.id} value={String(dev.user.id)}>
                                                    {dev.user.username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount ($)</Label>
                                    <Input type="number" value={newPayout.amount} onChange={(e) => setNewPayout({ ...newPayout, amount: e.target.value })} required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Record Payout</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Payer</TableHead>
                                <TableHead>Payee</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : payments.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.payment_type === 'Incoming' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {p.payment_type}
                                        </span>
                                    </TableCell>
                                    <TableCell>{p.payer_name || 'System'}</TableCell>
                                    <TableCell>{p.payee_name || 'System'}</TableCell>
                                    <TableCell className="font-bold">${p.amount}</TableCell>
                                    <TableCell>{p.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Treasury;
