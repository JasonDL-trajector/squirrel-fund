'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Auth, API } from 'aws-amplify';
import { WithdrawType } from '@/types/withdraw';
import { BalanceType } from '@/types/balance';
import { useToast } from '@/components/ui/use-toast';

export default function WithdrawPage() {
  const [name, setName] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawNote, setWithdrawNote] = useState('');
  const [withdrawDate, setWithdrawDate] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setName(user.attributes.name || '');
        console.log('User name:', user.attributes.name);

        const fetchBalance = async () => {
          try {
            const response = await API.get('deposit', `/balance`, {});
            const sortedBalances = response.sort(
              (
                a: { balanceDate: string | number | Date },
                b: { balanceDate: string | number | Date }
              ) =>
                new Date(b.balanceDate).getTime() -
                new Date(a.balanceDate).getTime()
            );

            if (sortedBalances.length > 0 && sortedBalances[0].balanceAmount) {
              setBalance(sortedBalances[0].balanceAmount);
            } else {
              console.error('No balance returned from API');
              setBalance(0);
            }
          } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance(0);
          }
        };

        fetchBalance();
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const createWithdrawal = async (withdraw: WithdrawType) => {
    try {
      const response = await API.post('deposit', `/withdraw`, {
        body: withdraw,
      });
      console.log('Withdrawal created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      throw error;
    }
  };

  const createBalance = async (balance: BalanceType) => {
    try {
      const response = await API.post('deposit', `/balance`, {
        body: balance,
      });
      console.log('Balance created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating balance:', error);
      throw error;
    }
  };

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
    // Allow only digits and limit to 5 characters
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
          <Card className="max-w-md mx-auto mt-10">
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
                  type="text" // Change to text to control input
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
