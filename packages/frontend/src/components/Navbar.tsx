"use client"

import { Button } from "./ui/button";
import { SquirrelIcon } from "./ui/SquirrelIcon";
import { UserIcon } from "./ui/UserIcon";
import { MenuIcon } from "./ui/MenuIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { SettingsIcon } from "./ui/SettingsIcon";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { Auth } from "aws-amplify";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

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
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserIcon className="w-6 h-6" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button className="flex items-center gap-2" variant="ghost" onClick={handleLogout}>
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
