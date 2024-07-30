'use client';
import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { s3Download, s3Upload } from '@/lib/awsLib';
import { fetchUser } from '@/lib/API';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const SettingsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dailyDeposit, setDailyDeposit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profilePictureKey, setProfilePictureKey] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchUser(setName);
        setProfilePictureKey(user.attributes['custom:profilePictureKey']);
        setDailyDeposit(user.attributes['custom:dailyDeposit']);

        const pictureUrl = await s3Download(
          user.attributes['custom:profilePictureKey']
        );
        setProfilePictureUrl(pictureUrl);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await fetchUser(setName);
      await Auth.updateUserAttributes(user, { name });
      await Auth.updateUserAttributes(user, {
        'custom:dailyDeposit': dailyDeposit,
      });

      if (file) {
        const sanitizedUserName = name.replace(/\s+/g, '_');
        const fileName = `${sanitizedUserName}-${file.name}`;
        const pictureKey = await s3Upload(file, fileName);
        await Auth.updateUserAttributes(user, {
          'custom:profilePictureKey': pictureKey,
        });
        const pictureUrl = await s3Download(pictureKey);
        setProfilePictureUrl(pictureUrl);
      }

      toast({
        title: 'Settings Updated',
        description: 'Your settings have been updated successfully.',
        duration: 5000,
      });

      router.push('/home');
    } catch (error) {
      console.error('Error updating settings:', error);
      setError('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <Link
            href="/home"
            className="text-sm font-medium hover:underline"
            prefetch={false}
          >
            Back to Dashboard
          </Link>
        </div>
        <Card className="max-w-md mx-auto mt-10">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your name and avatar.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}

              {profilePictureUrl ? (
                <div className="mt-4 flex justify-center">
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-32 h-32 md:w-48 md:h-48"
                    style={{ borderRadius: '50%' }}
                  />
                </div>
              ) : (
                <div className="mt-4 flex justify-center">
                  <img
                    src={
                      'https://static.vecteezy.com/system/resources/previews/019/879/186/original/user-icon-on-transparent-background-free-png.png'
                    }
                    alt="Profile"
                    className="w-32 h-32 md:w-48 md:h-48"
                    style={{ borderRadius: '50%' }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="file">Avatar:</label>
                <Input
                  type="file"
                  id="file"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                  accept="image/*"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name">Name:</label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name">Daily Deposit:</label>
                <Input
                  type="text"
                  id="dailyDeposit"
                  value={dailyDeposit}
                  onChange={(e) => setDailyDeposit(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="mt-4 relative flex flex-end"
              >
                {loading ? 'Updating...' : 'Submit'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default SettingsPage;
