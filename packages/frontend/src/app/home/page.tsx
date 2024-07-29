'use client';

import React, { useState, useEffect } from 'react';
import LinechartChart from '@/components/ui/Linechart';
import { ArrowDownIcon } from '@/components/ui/ArrowDownIcon';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Auth, API } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import { DepositType } from './../../types/deposit';
import { WithdrawType } from './../../types/withdraw';
import { CheckIcon } from '@radix-ui/react-icons';

export default function Main() {
  const apiEndpoint = process.env.API_URL;
  const router = useRouter();

  const [name, setName] = useState('');
  const [dailyDeposit, setDailyDeposit] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [deposits, setDeposits] = useState<DepositType[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawType[]>([]);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [billDates, setBillDates] = useState<string[]>([]);
  const [newBillDate, setNewBillDate] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setName(user.attributes.name || '');
        setDailyDeposit(
          user.attributes['custom:dailyDeposit']
            ? parseFloat(user.attributes['custom:dailyDeposit'])
            : 0
        );
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      console.log('Not an authenticated user, redirecting to login');
      router.push('/login');
    } else if (isAuthenticated === true) {
      console.log('Authenticated User');

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

      const fetchDeposits = async () => {
        try {
          const response = await API.get('deposit', `/deposit`, {});
          const sortedDeposits = response.sort(
            (
              a: { depositDate: string | number | Date },
              b: { depositDate: string | number | Date }
            ) =>
              new Date(b.depositDate).getTime() -
              new Date(a.depositDate).getTime()
          );
          setDeposits(sortedDeposits);
        } catch (error) {
          console.error('Error fetching deposits:', error);
        }
      };

      const fetchWithdrawals = async () => {
        try {
          const response = await API.get('deposit', `/withdraw`, {});
          const sortedWithdrawals = response.sort(
            (
              a: { withdrawDate: string | number | Date },
              b: { withdrawDate: string | number | Date }
            ) =>
              new Date(b.withdrawDate).getTime() -
              new Date(a.withdrawDate).getTime()
          );
          setWithdrawals(sortedWithdrawals);
        } catch (error) {
          console.error('Error fetching withdrawals:', error);
        }
      };

      const fetchBalanceHistory = async () => {
        try {
          const response = await API.get('deposit', `/balance`, {});
          const sortedBalanceHistory = response.sort(
            (
              a: { balanceDate: string | number | Date },
              b: { balanceDate: string | number | Date }
            ) =>
              new Date(a.balanceDate).getTime() -
              new Date(b.balanceDate).getTime()
          );
          console.log(sortedBalanceHistory);
          setBalanceHistory(sortedBalanceHistory);
        } catch (error) {
          console.error('Error fetching balance history:', error);
        }
      };

      fetchBalance();
      fetchDeposits();
      fetchWithdrawals();
      fetchBalanceHistory();
    }
  }, [isAuthenticated, router, apiEndpoint]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const getWeek = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );

    const dates = [];
    for (
      let d = new Date(sevenDaysAgo);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d)); // Create a new Date object to avoid mutating the original
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
    }; // Options for desired format
    return dates.map((date) => date.toLocaleDateString('en-US', options)); // Return dates in "Month Day" format
  };

  const handleAddBillDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBillDate) {
      setBillDates([...billDates, newBillDate]);
      setNewBillDate('');
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Welcome back, {name}!
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <hr />
            <CardContent className="mt-5">
              <LinechartChart className="aspect-[9/4]" data={balanceHistory} />
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Tabular Summary</CardTitle>
            </CardHeader>
            <hr />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="border-b">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center justify-center">
                          <p className="text-sm font-medium">Date</p>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center justify-center">
                          <p className="text-sm font-medium">jay</p>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center justify-center">
                          <p className="text-sm font-medium">ely</p>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getWeek().map((date, index) => {
                      const jasonDeposit = deposits.find(
                        (deposit) =>
                          new Date(deposit.depositDate).toLocaleDateString(
                            'en-US',
                            { month: 'long', day: 'numeric' }
                          ) === date && deposit.name === 'jay'
                      );
                      const elyDeposit = deposits.find(
                        (deposit) =>
                          new Date(deposit.depositDate).toLocaleDateString(
                            'en-US',
                            { month: 'long', day: 'numeric' }
                          ) === date && deposit.name === 'ely'
                      );

                      return (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <p className="text-sm font-medium">{date}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {jasonDeposit ? (
                                <CheckIcon color="green" />
                              ) : null}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              {elyDeposit ? <CheckIcon color="green" /> : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Recent Deposits</CardTitle>
            </CardHeader>
            <hr />
            <CardContent>
              {deposits.slice(0, 5).map((deposit) => (
                <div
                  key={deposit.depositId}
                  className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <ArrowDownIcon
                    className="w-5 h-5 text-green-500 rotate-180"
                    stroke="green"
                  />
                  <div className="mt-3">
                    <p className="text-sm font-medium">
                      {deposit.name} - {deposit.depositNote}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(deposit.depositDate)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-right">
                    ₱{deposit.depositAmount}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Withdrawals</CardTitle>
            </CardHeader>
            <hr />
            <CardContent>
              {withdrawals.slice(0, 5).map((withdrawal) => (
                <div
                  key={withdrawal.withdrawId}
                  className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <ArrowDownIcon
                    className="w-5 h-5 text-blue-500"
                    stroke="red"
                  />
                  <div className="mt-3">
                    <p className="text-sm font-medium">
                      {withdrawal.name} - {withdrawal.withdrawNote}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(withdrawal.withdrawDate)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-right">
                    ₱{withdrawal.withdrawAmount}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bills</CardTitle>
            </CardHeader>
            <hr />
            <CardContent>
              <form
                onSubmit={handleAddBillDate}
                className="flex flex-col space-y-4"
              >
                <input
                  type="date"
                  value={newBillDate}
                  onChange={(e) => setNewBillDate(e.target.value)}
                  className="border rounded p-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded p-2"
                >
                  Add Bill Date
                </button>
              </form>
              <ul className="mt-4">
                {billDates.map((date, index) => (
                  <li key={index} className="border-b py-2">
                    {new Date(date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
