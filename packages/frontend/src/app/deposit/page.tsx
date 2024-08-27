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
  fetchUserDailyDeposit,
  fetchLatestBalanceAmount,
  createDeposit,
  createBalance,
} from '@/lib/API';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { DatePicker } from '@/components/DatePicker';

export default function DepositPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositNote, setDepositNote] = useState('');
  const [depositDates, setDepositDates] = useState<string[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDailyDeposit(setName, setDepositAmount);
    fetchLatestBalanceAmount(setBalance);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const totalDepositAmount = depositAmount * depositDates.length;
    const newBalanceAmount =
      balance !== null ? balance + totalDepositAmount : totalDepositAmount;

    try {
      for (const date of depositDates) {
        await createDeposit({
          name,
          depositAmount,
          depositNote,
          depositDate: date,
        });
      }
      await createBalance({
        balanceAmount: newBalanceAmount,
        balanceDate: new Date().toISOString(),
      });
      toast({
        title: 'Deposits Submitted',
        description: 'Your deposits have been submitted successfully.',
        duration: 5000,
      });

      router.push('/home');
    } catch (err) {
      console.error('Error creating deposit:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Deposit Funds</h2>
          <Link
            href="/home"
            className="text-sm font-medium hover:underline"
            prefetch={false}
          >
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="max-w-md mx-auto mt-0 scale-90 md:scale-100">
            <CardHeader>
              <CardTitle>New Deposit</CardTitle>
              <CardDescription>
                Fill out the form below to submit deposits to your squirrel
                fund.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-5">
              {error && <p className="text-red-500">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label>Deposit Dates</Label>
                <DatePicker onChange={setDepositDates} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
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
                {depositAmount && depositDates.length ? (
                  <div className="space-y-2">
                    <Label>Plus</Label>
                    <div className="text-2xl font-bold">
                      <span>₱{depositAmount * depositDates.length}</span>
                    </div>
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label>New Balance</Label>
                  <div className="text-2xl font-bold">
                    ₱
                    {balance !== null
                      ? balance + depositAmount * depositDates.length
                      : 'Loading...'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push('/home')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Deposit'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
      <Footer />
    </div>
  );
}
