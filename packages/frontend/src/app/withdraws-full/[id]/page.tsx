'use client'

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchUser, fetchWithdrawalById, updateWithdrawal } from '@/lib/API';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const WithdrawDetailPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { id } = params;
  const [name, setName] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1);
  const [withdrawDate, setWithdrawDate] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUser(setName);
  }, []);

  useEffect(() => {
    const fetchWithdrawal = async () => {
      const data = await fetchWithdrawalById(id);
      setWithdrawAmount(data.withdrawAmount);
      setWithdrawDate(data.withdrawDate);
      setWithdrawNote(data.withdrawNote);
      setLoading(false);
    };
    fetchWithdrawal();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        await updateWithdrawal(id, { name, withdrawAmount, withdrawDate, withdrawNote });
        toast({
          title: 'Withdrawal Updated',
          description: 'Your withdrawal has been updated successfully.',
          duration: 2000,
        });
        setIsEditing(false);
    } catch (error) {
        console.error('Error updating deposit:', error);
    }
};

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">View Withdrawal</h2>
          <Link
            href="/withdraws-full"
            className="text-sm font-medium hover:underline"
            prefetch={false}
          >
            Back to History
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="max-w-md mx-auto mt-0 scale-90 md:scale-100">
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
              <CardDescription>
                View or edit the withdrawal details.
              </CardDescription>

              {!isEditing && (
                <Button
                  type='button'
                  className="absolute top-4 right-4 scale-90 max-w-20" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  Edit
                </Button>
              )}

             
            </CardHeader>
            <CardContent className="space-y-4 mt-5">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  required
                  placeholder="Enter amount"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={withdrawDate}
                  onChange={(e) => setWithdrawDate(e.target.value)}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  placeholder="Enter a note"
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2">
                <Button type='button' variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Withdrawal
                </Button>
              </CardFooter>
            )}
          </Card>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default WithdrawDetailPage;