'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  fetchUser,
  fetchBalance,
  createWithdrawal,
  createBalance,
} from '@/lib/API';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function WithdrawPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawNote, setWithdrawNote] = useState('');
  const [withdrawDate, setWithdrawDate] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      fetchUser(setName);
      fetchBalance(setBalance);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const newBalanceAmount =
      balance !== null ? balance - withdrawAmount : withdrawAmount;

    try {
      await createWithdrawal({
        name,
        withdrawAmount,
        withdrawNote,
        withdrawDate,
      });
      await createBalance({
        balanceAmount: newBalanceAmount,
        balanceDate: withdrawDate,
      });

      toast({
        title: 'Withdrawal Submitted',
        description: 'Your withdrawal has been submitted successfully.',
        duration: 5000,
      });
      router.push('/home');
    } catch (err) {
      console.error('Error creating withdrawal:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setWithdrawAmount(Number(value));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Withdraw Funds</h2>
          <Link
            href="/home"
            className="text-sm font-medium hover:underline"
            prefetch={false}
          >
            Back to Dashboard
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Card className="max-w-md mx-auto scale-90">
            <CardHeader>
              <CardTitle>New Withdrawal</CardTitle>
              <CardDescription>
                Fill out the form below to request a withdrawal from your
                squirrel fund.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-5">
              {error && <p className="text-red-500">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  value={withdrawAmount}
                  onChange={handleWithdrawAmountChange}
                  required
                  placeholder="Enter amount"
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  placeholder="Enter a note"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Label>Current Balance</Label>
                  <div className="text-2xl font-bold">
                    ₱{balance !== null ? balance : 'Loading...'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Balance</Label>
                  <div className="text-2xl font-bold">
                    ₱
                    {balance !== null ? balance - withdrawAmount : 'Loading...'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push('/home')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Withdrawal'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
      <Footer />
    </div>
  );
}
