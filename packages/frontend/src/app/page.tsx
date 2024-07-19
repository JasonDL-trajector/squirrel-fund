"use client"

import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import Navbar from "@/components/Navbar";

function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status here and update `isAuthenticated` accordingly
    Auth.currentAuthenticatedUser()
      .then(() => {
        setIsAuthenticated(true)
        window.location.href = '/home';
      })
      .catch(() => {
        setIsAuthenticated(false);
        window.location.href = '/login';
      });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-center h-full">
          {isAuthenticated ? (
            <>
              <p>Redirecting to home... </p>
            </>
          ) : (
            <p>Redirecting to login...</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Main;
