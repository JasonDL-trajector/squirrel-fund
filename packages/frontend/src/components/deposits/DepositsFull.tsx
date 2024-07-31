'use client'

import { useEffect, useState } from 'react';
import { DepositType } from '@/types/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDateTime } from '../../lib/utils';
import { fetchDeposits } from '@/lib/API';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon } from '../ui/ArrowDownIcon';
import Link from 'next/link';

const ITEMS_PER_PAGE = 7;

const DepositsFull = () => {
  const [deposits, setDeposits] = useState<DepositType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(deposits.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchDeposits(setDeposits);
  }, []);
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentDeposits = deposits
    .slice()
    .sort((a, b) => new Date(b.depositDate).getTime() - new Date(a.depositDate).getTime())
    .slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Deposits</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {currentDeposits.map((deposit) => (
            <Link key={deposit.depositId} href={`/deposits-full/${deposit.depositId}`}>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0 cursor-pointer">
                <ArrowDownIcon
                  className="w-5 h-5 text-green-500 rotate-180"
                  stroke="green"
                />
                <div className="mt-3">
                  <p className="text-sm font-medium">
                    {deposit.name} - {deposit.depositNote}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(deposit.depositDate)}
                  </p>
                </div>
                <p className="text-sm font-medium text-right">
                  ₱{deposit.depositAmount}
                </p>
              </div>
              <hr />
            </Link>
            
          ))}
          <div className="flex items-center justify-between mt-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 0} variant={currentPage === 0 ? 'outline' : 'default'}>
              Previous
            </Button>
            <span className="mx-4 text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1} variant={currentPage === totalPages - 1 ? 'outline' : 'default'}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default DepositsFull;