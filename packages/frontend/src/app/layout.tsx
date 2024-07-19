import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "@/components/AmplifyProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Squirrel Fund",
  description: "Squirrel Fund",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
         <script
          dangerouslySetInnerHTML={{
            __html: `
              window.global = window;
              var exports = {};
            `,
          }}
        />
      </head>
      <body className={inter.className}>

        <div className="flex flex-col h-screen bg-background">  
          <AmplifyProvider>
            {children}
          </AmplifyProvider>
        </div>
      
      </body>
    </html>
  );
}
