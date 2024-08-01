'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { checkAuth, fetchLatestBalance, fetchLatestBalanceAmount, updateBalance } from '@/lib/API';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TabularSummary from '@/components/tabular-summary/TabularSummary';
import BalanceHistory from '@/components/balance-history/BalanceHistory';
import RecentDeposits from '@/components/deposits/RecentDeposits';
import RecentWithdrawals from '@/components/withdrawals/RecentWithdrawals';
import Bills from '@/components/Bills';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BalanceType } from '@/types/types';

export default function Main() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [dailyDeposit, setDailyDeposit] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<BalanceType | null>(null);
  const [balanceId, setBalanceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBalance, setNewBalance] = useState<number | null>(null);
  const [balanceDate, setBalanceDate] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState<number | null>(null);

  useEffect(() => {
    checkAuth(setName, setDailyDeposit, setIsAuthenticated);
  }, []);

  useEffect(() => {
    console.log(process.env.REGION);
    console.log(process.env.BUCKET);
    console.log(process.env.USER_POOL_ID);
    console.log(process.env.USER_POOL_CLIENT_ID);
  });

  useEffect(() => {
    if (isAuthenticated === false) {
      console.log('Not an authenticated user, redirecting to login');
      router.push('/login');
    } else if (isAuthenticated === true) {
      console.log('Authenticated User');
      fetchLatestBalance(setBalance);
      fetchLatestBalanceAmount(setBalanceAmount);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (balance) {
      setNewBalance(balance.balanceAmount);
      setBalanceId(balance.balanceId || '');
      setBalanceDate(balance.balanceDate || '');
    }
  }, [balance]);

  const handleBalanceEdit = () => {
    if (balance) {
      setNewBalance(balance.balanceAmount);
      setBalanceId(balance.balanceId || '');
      setBalanceDate(balance.balanceDate);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBalance !== null && balanceId) {
      updateBalance(balanceId, { balanceAmount: newBalance, balanceDate: balanceDate })
        .then(() => {
          fetchLatestBalanceAmount(setBalanceAmount);
          setIsModalOpen(false);
          toast({
            title: 'Balance Updated',
            description: 'Your balance has been updated successfully.',
            duration: 2000,
          });
        })
        .catch((error) => console.error('Error updating balance:', error));
    } else {
      console.error('New balance or balance ID is null');
    }
};

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 ml-1">
          <h2 className="text-2xl font-bold text-left">Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BalanceHistory />
          <Link href="/tabular-full">
            <TabularSummary />
          </Link>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6 space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow" onClick={handleBalanceEdit}>
              <p className="text-4xl font-bold">
                ₱{balanceAmount !== null ? balanceAmount : 'Loading...'}
              </p>
              <p className="text-muted-foreground text-sm">
                Current Fund Balance
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow">
              <p className="text-4xl font-bold">
                ₱{dailyDeposit !== null ? dailyDeposit : 'Loading...'}
              </p>
              <p className="text-muted-foreground text-sm">
                Deposit Amount Per Day
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/deposits-full">
            <RecentDeposits />
          </Link>
          <Link href="/withdraws-full">
            <RecentWithdrawals />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6">
          <Bills />
        </div>
      </main>
      <Footer />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogOverlay className="DialogOverlay" />
        <DialogContent className="DialogContent">
          <DialogHeader>
            <DialogTitle className="font-semibold">Edit Current Balance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              type="number"
              placeholder="New Balance"
              value={newBalance !== null ? newBalance : ''}
              onChange={(e) => setNewBalance(Number(e.target.value))}
              className="p-2 border-black"
              required
            />
            <div className="flex justify-end mt-10">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="ml-2">
                Update Balance
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
