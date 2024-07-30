'use client';

import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
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
import { validateRegisterForm } from '@/lib/utils';
import Navbar from '@/components/Navbar';

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newUser, setNewUser] = useState<null | String>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  }

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signUp({
        username: email,
        password,
      });
      setNewUser(email);
      toast({
        title: 'Signup Successful',
        description: 'Please check your email for the confirmation code.',
        duration: 5000,
      });
    } catch (error: any) {
      if (error.code === 'UsernameExistsException') {
        try {
          await Auth.resendSignUp(email);
          toast({
            title: 'Already registered',
            description: 'Please check your email for the confirmation code.',
            duration: 5000,
          });
          setNewUser(email);
        } catch (resendError: any) {
          alert('An error occurred. Please try again.');
          console.error(resendError.message);
        }
      } else {
        alert('Signup failed');
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(newUser as string, confirmationCode);
      toast({
        title: 'Confirmation Successful',
        description: 'You can now sign in.',
        duration: 5000,
      });
      router.push('/login');
    } catch (error: any) {
      alert('Confirmation failed');
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Confirm Signup</CardTitle>
          <CardDescription>
            Enter the confirmation code sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmationCode">Confirmation Code</Label>
            <Input
              id="confirmationCode"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter the confirmation code"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" onClick={() => setNewUser(null)}>
            Back
          </Button>
          <Button
            type="submit"
            variant="link"
            disabled={!validateConfirmationForm()}
          >
            Verify
          </Button>
          <div className="text-center">
            <span>Have an account? </span>
            <Button variant="link" onClick={() => router.push('/login')}>
              Login
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  function renderForm() {
    return (
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your details to create an account.
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-end gap-2">
          <div className="flex flex-row space-x-3 relative right-0">
            <Button variant="outline" onClick={() => router.push('/login')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!validateRegisterForm(email, password, confirmPassword)}
            >
              Sign Up
            </Button>
          </div>
          <div className="mt-5 flex gap-x-2 items-center">
            <span>Have an account? </span>
            <a href="/login">Login</a>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-center h-full">
          <form
            onSubmit={
              newUser === null ? handleSignup : handleConfirmationSubmit
            }
          >
            {newUser === null ? renderForm() : renderConfirmationForm()}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;
