import { useEffect, useState } from 'react';
import { DepositType } from '@/types/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckIcon } from '@radix-ui/react-icons';
import { getWeek } from '../../lib/utils';
import { fetchDeposits } from '@/lib/API';

const TabularSummary = () => {
  const [deposits, setDeposits] = useState<DepositType[]>([]);

  useEffect(() => {
    fetchDeposits(setDeposits);
  }, []);

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Tabular Summary</CardTitle>
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
                {getWeek().map((date, index) => {
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
        </CardContent>
      </Card>
    </>
  );
};

export default TabularSummary;
