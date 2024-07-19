"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Auth, API } from "aws-amplify";
import { DepositType } from "@/types/deposit";

export default function DepositPage() {
  const [name, setName] = useState('');
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositNote, setDepositNote] = useState("");
  const [depositDate, setDepositDate] = useState(""); // New state for deposit date
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setName(user.attributes.name || ""); // Ensure name is set to an empty string if undefined
        console.log("User name:", user.attributes.name);

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
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const createDeposit = async (deposit: DepositType) => {
    try {
      const response = await API.post("deposit", `/deposit`, {
        body: deposit,
      });
      console.log("Deposit created successfully:", response);
      return response; // Return the response for further handling if needed
    } catch (error) {
      console.error("Error creating deposit:", error);
      throw error; // Rethrow the error to be caught in handleSubmit
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await createDeposit({ name, depositAmount, depositNote, depositDate });
      router.push('/home');
    } catch (err) {
      console.error("Error creating deposit:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and limit to 5 characters
    if (/^\d{0,5}$/.test(value)) {
      setDepositAmount(Number(value));
    }
  };

  const newBalance = balance !== null ? balance + depositAmount : depositAmount;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Make a Deposit</h2>
          <Link href="/home" className="text-sm font-medium hover:underline" prefetch={false}>
            Back to Dashboard
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>New Deposit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="amount">Deposit Amount</Label>
                <Input
                  id="amount"
                  type="text" // Change to text to control input
                  value={depositAmount}
                  onChange={handleDepositAmountChange}
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Deposit Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={depositDate}
                  onChange={(e) => setDepositDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Deposit Note</Label>
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
                  <div className="text-2xl font-bold">P{balance !== null ? balance : 'Loading...'}</div>
                </div>
                <div className="space-y-2">
                  <Label>New Balance</Label>
                  <div className="text-2xl font-bold">P{balance !== null ? balance + depositAmount : 'Loading...'}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push('/home')}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Deposit"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
      <Footer />
    </div>
  );
}