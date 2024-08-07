import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowDownIcon } from '@/components/ui/ArrowDownIcon';
import { WithdrawType } from '@/types/types';
import { formatDateTime } from '../../lib/utils';
import { fetchWithdrawals } from '@/lib/API';

const RecentWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawType[]>([]);

  useEffect(() => {
    fetchWithdrawals(setWithdrawals);
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawals</CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
          {withdrawals.slice(0, 5).map((withdrawal) => (
            <div
              key={withdrawal.withdrawId}
              className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <ArrowDownIcon className="w-5 h-5 text-blue-500" stroke="red" />
              <div className="mt-3">
                <p className="text-sm font-medium">
                  <b>{withdrawal.name}</b> - {withdrawal.withdrawNote}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(withdrawal.withdrawDate)}
                </p>
              </div>
              <p className="text-sm font-medium text-right">
                ₱{withdrawal.withdrawAmount}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default RecentWithdrawals;
