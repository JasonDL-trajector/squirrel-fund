import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DepositType } from '@/types/types';
import { ArrowDownIcon } from '@/components/ui/ArrowDownIcon';
import { formatDateTime } from '../../lib/utils';
import { fetchDeposits } from '@/lib/API';

const RecentDeposits = () => {
  const [deposits, setDeposits] = useState<DepositType[]>([]);

  useEffect(() => {
    fetchDeposits(setDeposits);
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Deposits</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {deposits.slice(0, 5).map((deposit) => (
            <div
              key={deposit.depositId}
              className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
            >
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
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default RecentDeposits;
