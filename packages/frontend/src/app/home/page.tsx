"use client";

import React, { useState, useEffect } from 'react';
import LinechartChart from "@/components/ui/Linechart";
import { ArrowDownIcon } from "@/components/ui/ArrowDownIcon";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Auth, API } from "aws-amplify";
import { useRouter } from 'next/navigation';

export default function Main() {
  const apiEndpoint = process.env.API_URL;
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await Auth.currentAuthenticatedUser();
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
      // Fetch balance only if authenticated
      const fetchBalance = async () => {
        try {
          const response = await API.get("deposit", `/balance/061957e0-4527-11ef-a542-5d46de72592c`, {});
          console.log("response", response);
          if (response && response.balanceAmount) {
            setBalance(response.balanceAmount);
          } else {
            console.error("No balance returned from API");
            setBalance(0);
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance(0);
        }
      };

      fetchBalance();
    }
  }, [isAuthenticated, router, apiEndpoint]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading indicator while checking authentication
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Welcome back, Jason!</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/deposit')} size="sm">
              Add a Deposit
            </Button>
            <Button variant="outline" size="sm">
              Withdraw
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Fund Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <LinechartChart className="aspect-[9/4]" /> */}
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Automatic Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <BarchartChart className="aspect-[9/4]" /> */}
            </CardContent>
          </Card>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6 space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Fund Goal</h2>
              <p className="text-muted-foreground text-sm">Set a target to save towards</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">P{balance !== null ? balance : 'Loading...'}</p>
              <p className="text-muted-foreground text-sm">Current Fund balance</p>
            </div>
            <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center">
              <p className="text-2xl font-bold">75%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Automatic Deposits</h2>
              <p className="text-muted-foreground text-sm">Customize your Deposit settings</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">P50</p>
              <p className="text-muted-foreground text-sm">Deposit amount per day</p>
            </div>
            <div className="bg-muted rounded-full flex items-center justify-center px-2 py-2">
              <p className="text-2xl font-bold px-5">Daily</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500 rotate-180" />
                <div>
                  <p className="text-sm font-medium">Deposit to Fund</p>
                  <p className="text-xs text-muted-foreground">July 15, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500 rotate-180" />
                <div>
                  <p className="text-sm font-medium">Deposit to Fund</p>
                  <p className="text-xs text-muted-foreground">July 8, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500 rotate-180" />
                <div>
                  <p className="text-sm font-medium">Deposit to Fund</p>
                  <p className="text-xs text-muted-foreground">July 1, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Withdraw from Fund</p>
                  <p className="text-xs text-muted-foreground">July 2, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Withdraw from Fund</p>
                  <p className="text-xs text-muted-foreground">July 9, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
