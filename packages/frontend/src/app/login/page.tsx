'use client';

import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateLoginForm } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
        router.push('/home');
      } catch {
        setIsAuthenticated(false);
      }
    }

    checkAuthentication();
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log('Logging in...');
    event.preventDefault();

    try {
      await Auth.signIn(email, password);
      toast({
        title: 'Success',
        description: 'You have successfully logged in.',
        duration: 2000,
      });
      router.push('/home');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />

      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-center h-full">
          <form onSubmit={handleSubmit}>
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your Squirrel Fund account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col justify-end gap-2">
                <div className="flex flex-row space-x-3 relative right-0">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    type="submit"
                    // disabled={!validateLoginForm(email, password)}
                  >
                    Login
                  </Button>
                </div>

                <div className="mt-5 flex gap-x-2 items-center">
                  <span>Do not have an account? </span>
                  <a href="/register">Sign Up</a>
                </div>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
