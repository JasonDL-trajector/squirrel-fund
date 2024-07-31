'use client'

import { useEffect, useState } from 'react';
import { DepositType } from '@/types/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckIcon } from '@radix-ui/react-icons';
import { getAllDays } from '../../lib/utils';
import { fetchDeposits } from '@/lib/API';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 7;

const TabularFull = () => {
  const [deposits, setDeposits] = useState<DepositType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(getAllDays().length / ITEMS_PER_PAGE);

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

  const currentDays = getAllDays()
    .slice()
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

  return (
    <>
      <Card className="max-w-3xl mx-auto mt-10">
        <CardHeader>
          <CardTitle>Deposit Table</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="border-b">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      <p className="text-sm font-medium">Date</p>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      <p className="text-sm font-medium">jay</p>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      <p className="text-sm font-medium">ely</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentDays.map((date, index) => {
                  const jasonDeposit = deposits.find(
                    (deposit) =>
                      new Date(deposit.depositDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                        }
                      ) === date && deposit.name === 'jay'
                  );
                  const elyDeposit = deposits.find(
                    (deposit) =>
                      new Date(deposit.depositDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                        }
                      ) === date && deposit.name === 'ely'
                  );

                  return (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <p className="text-sm font-medium">{date}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {jasonDeposit ? <CheckIcon color="green" /> : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {elyDeposit ? <CheckIcon color="green" /> : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

export default TabularFull;