'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth, fetchBalance } from '@/lib/API';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TabularSummary from '@/components/tabular-summary/TabularSummary';
import BalanceHistory from '@/components/balance-history/BalanceHistory';
import RecentDeposits from '@/components/deposits/RecentDeposits';
import RecentWithdrawals from '@/components/withdrawals/RecentWithdrawals';
import Bills from '@/components/Bills';
import Link from 'next/link';

export default function Main() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [dailyDeposit, setDailyDeposit] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    checkAuth(setName, setDailyDeposit, setIsAuthenticated);
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      console.log('Not an authenticated user, redirecting to login');
      router.push('/login');
    } else if (isAuthenticated === true) {
      console.log('Authenticated User');
      fetchBalance(setBalance);
    }
  }, [isAuthenticated, router]);

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
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow">
              <p className="text-4xl font-bold">
                ₱{balance !== null ? balance : 'Loading...'}
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
    </>
  );
}
