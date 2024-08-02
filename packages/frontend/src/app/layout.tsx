import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import AmplifyProvider from '@/components/AmplifyProvider';
import { Toaster } from '@/components/ui/toaster';
import Favicon from './favicon.ico';
import AppleIcon from './apple-touch-icon.png';

const roboto = Roboto({ subsets: ['greek'], weight: '400' });

export const metadata: Metadata = {
  title: 'Squirrel Fund',
  description: 'Squirrel Fund',
  // icons: [{ rel: 'icon', url: Favicon.src }],
  icons: {
    icon: Favicon.src,
    apple: AppleIcon.src,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="./favicon.ico" sizes="any" />
      <link rel="apple-touch-icon" href="./apple-touch-icon.png" /> {/* Ensure this line is present */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.global = window;
              var exports = {};
            `,
          }}
        />
      </head>
      <body className={roboto.className}>
        <div className="flex flex-col h-screen bg-background">
          <AmplifyProvider>
            {children}
            <Toaster />
          </AmplifyProvider>
        </div>
      </body>
    </html>
  );
}
