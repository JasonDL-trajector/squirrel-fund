'use client';

import { useEffect, useState } from 'react';
import { WithdrawType } from '@/types/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDateTime } from '../../lib/utils';
import { fetchWithdrawals } from '@/lib/API';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon } from '../ui/ArrowDownIcon';
import Link from 'next/link';

const ITEMS_PER_PAGE = 7;

const WithdrawalsFull = () => {
  const [withdrawals, setWithdrawal] = useState<WithdrawType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(withdrawals.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchWithdrawals(setWithdrawal);
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

  const currentWithdrawals = withdrawals
    .slice()
    .sort(
      (a, b) =>
        new Date(b.withdrawDate).getTime() - new Date(a.withdrawDate).getTime()
    )
    .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawals</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {currentWithdrawals.map((withdraw) => (
            <Link
              key={withdraw.withdrawId}
              href={`/withdraws-full/${withdraw.withdrawId}`}
            >
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0 cursor-pointer">
                <ArrowDownIcon
                  className="w-5 h-5 text-green-500"
                  stroke="red"
                />
                <div className="mt-3">
                  <p className="text-sm font-medium">
                    <b>{withdraw.name}</b> - {withdraw.withdrawNote}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(withdraw.withdrawDate)}
                  </p>
                </div>
                <p className="text-sm font-medium text-right">
                  ₱{withdraw.withdrawAmount}
                </p>
              </div>
              <hr />
            </Link>
          ))}
          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              variant={currentPage === 0 ? 'outline' : 'default'}
            >
              Previous
            </Button>
            <span className="mx-4 text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              variant={currentPage === totalPages - 1 ? 'outline' : 'default'}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WithdrawalsFull;
