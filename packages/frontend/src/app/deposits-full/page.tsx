'use client'

import React from 'react'
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Footer from '@/components/Footer';
import DepositsFull from '@/components/deposits/DepositsFull';

const DepositsFullPage = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
    <Navbar />
    <main className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">History</h2>
        <Link
          href="/home"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Back to Dashboard
        </Link>
      </div>
     {/* DEPOSITS FULL COMPONENT*/}
     <DepositsFull />
    </main>
    <Footer />
  </div>
  )
}

export default DepositsFullPage