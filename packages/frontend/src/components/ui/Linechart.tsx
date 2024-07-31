import { CartesianGrid, XAxis, Line, LineChart } from 'recharts';
import { ChartTooltipContent, ChartTooltip, ChartContainer } from '../ui/chart';
import { BalanceType } from '@/types/types';

const LinechartChart = ({
  data,
  className,
}: {
  data: BalanceType[];
  className?: string;
}) => {
  const transformedData = data.map((item) => ({
    date: new Date(item.balanceDate).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
    }),
    balance: item.balanceAmount,
  }));

  return (
    <div className={className}>
      <ChartContainer
        config={{
          balance: {
            label: 'Balance',
            color: 'green',
          },
        }}
      >
        <LineChart
          width={500} // Set a fixed width or use a percentage
          height={300} // Set a fixed height
          data={transformedData}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} className="mt-10" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value} // Display the formatted date
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="balance"
            type="natural"
            stroke="var(--color-balance)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default LinechartChart;
