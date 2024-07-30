import { useState, useEffect } from 'react';
import { fetchBalanceHistory } from '@/lib/API';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LinechartChart from '@/components/ui/Linechart';

const BalanceHistory = () => {
  const [balanceHistory, setBalanceHistory] = useState([]);

  useEffect(() => {
    fetchBalanceHistory(setBalanceHistory);
  }, []);

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <hr />
        <CardContent className="mt-5">
          <LinechartChart className="aspect-[9/4]" data={balanceHistory} />
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceHistory;
