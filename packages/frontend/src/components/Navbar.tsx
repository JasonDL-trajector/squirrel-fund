'use client';

import { Button } from './ui/button';
import { SquirrelIcon } from './ui/SquirrelIcon';
import { UserIcon } from './ui/UserIcon';
import { MenuIcon } from './ui/MenuIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { SettingsIcon } from './ui/SettingsIcon';
import { LogOutIcon } from 'lucide-react';
import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { s3Download } from '@/lib/awsLib';
import Image from 'next/image';

const Navbar = () => {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const picture = user.attributes['custom:profilePictureKey'];
        const pictureUrl = await s3Download(picture);
        setName(user.attributes.name || '');
        setProfilePictureUrl(pictureUrl);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  });

  async function handleLogout() {
    try {
      await Auth.signOut();
      setIsAuthenticated(false);
      router.push('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Error signing out: ', error);
      router.push('/login'); // Redirect to login in case of error
    }
  }

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SquirrelIcon className="w-6 h-6" />
        <h1 className="text-xl font-bold">Squirrel Fund</h1>
      </div>
      {isAuthenticated && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {profilePictureUrl ? (
              <Image
                src={profilePictureUrl}
                alt="Profile"
                className="w-8 h-8"
                style={{ borderRadius: '50%' }}
              />
            ) : (
              <Image
                src={
                  'https://static.vecteezy.com/system/resources/previews/019/879/186/original/user-icon-on-transparent-background-free-png.png'
                }
                alt="Profile"
                className="w-8 h-8"
                style={{ borderRadius: '50%' }}
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background mt-3">
            <DropdownMenuItem asChild className="w-full">
              <div className="flex items-center gap-2">
                {profilePictureUrl ? (
                  <Image
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-8 h-8"
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <Image
                    src={
                      'https://static.vecteezy.com/system/resources/previews/019/879/186/original/user-icon-on-transparent-background-free-png.png'
                    }
                    alt="Profile"
                    className="w-8 h-8"
                    style={{ borderRadius: '50%' }}
                  />
                )}
                <span className="font-semibold">{name}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="w-full">
              <Button
                variant="ghost"
                className="flex gap-2 justify-start"
                onClick={() => router.push('/settings')}
              >
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="w-full">
              <Button
                className="flex gap-2 justify-start"
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Navbar;
