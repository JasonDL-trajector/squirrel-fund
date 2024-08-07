import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import AmplifyProvider from '@/components/AmplifyProvider';
import { Toaster } from '@/components/ui/toaster';

const roboto = Roboto({ subsets: ['greek'], weight: '400' });

export const metadata: Metadata = {
  title: 'Squirrel Fund',
  description: 'Squirrel Fund',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <meta name="theme-color" content="#111827" />
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
