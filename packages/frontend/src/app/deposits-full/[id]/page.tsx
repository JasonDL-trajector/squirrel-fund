'use client'

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchUser, fetchDepositById, updateDeposit } from '@/lib/API';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';


const DepositDetailPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { id } = params;
  const [name, setName] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(1);
  const [depositDate, setDepositDate] = useState('');
  const [depositNote, setDepositNote] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUser(setName);
  }, []);

  useEffect(() => {
    const fetchDeposit = async () => {
      const data = await fetchDepositById(id);
      setDepositAmount(data.depositAmount);
      setDepositDate(data.depositDate);
      setDepositNote(data.depositNote);
      setLoading(false);
    };
    fetchDeposit();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        await updateDeposit(id, { name, depositAmount, depositNote, depositDate });
        toast({
          title: 'Deposit Updated',
          description: 'Your deposit has been updated successfully.',
          duration: 2000,
        });
    } catch (error) {
        console.error('Error updating deposit:', error);
    }
};

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">View Deposit</h2>
          <Link
            href="/deposits-full"
            className="text-sm font-medium hover:underline"
            prefetch={false}
          >
            Back to History
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="max-w-md mx-auto mt-0 scale-90 md:scale-100">
            <CardHeader>
              <CardTitle>Deposit Details</CardTitle>
              <CardDescription>
                View or edit the deposit details.
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
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
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
                  value={depositDate}
                  onChange={(e) => setDepositDate(e.target.value)}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
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
                  Submit Deposit
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

export default DepositDetailPage;