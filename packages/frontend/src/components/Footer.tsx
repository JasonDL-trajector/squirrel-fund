import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { HomeIcon, FilePlusIcon, FileMinusIcon } from '@radix-ui/react-icons';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Deposit', path: '/deposit' },
    { name: 'Home', path: '/home' },
    { name: 'Withdraw', path: '/withdraw' },
  ];

  return (
    <footer className="border-t py-4 px-6 flex justify-around items-center w-full">
      {tabs.map(({ name, path }) => (
        <Button
          key={name}
          variant={pathname === path ? 'default' : 'ghost'}
          onClick={() => router.push(path)}
          className={`flex-1 h-full text-center gap-x-3 scale-90 ${
            pathname === path ? 'font-normal' : 'text-gray-700'
          }`}
        >
          {path === '/home' ? (
            <HomeIcon className="w-4 h-4 md:w-6 md:h-6" />
          ) : path === '/deposit' ? (
            <FilePlusIcon className="w-4 h-4 md:w-6 md:h-6" />
          ) : path === '/withdraw' ? (
            <FileMinusIcon className="w-4 h-4 md:w-6 md:h-6" />
          ) : null}
          {name} {/* Display the tab name */}
        </Button>
      ))}
    </footer>
  );
};

export default Footer;
