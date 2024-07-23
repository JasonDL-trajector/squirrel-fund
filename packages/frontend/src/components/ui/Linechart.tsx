import { CartesianGrid, XAxis, Line, LineChart } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "../ui/chart"
import { BalanceType } from "@/types/balance";

const LinechartChart = ({ data, className } : { data : BalanceType[], className?: string }) => {

  const transformedData = data.map(item => ({
    date: new Date(item.balanceDate).toLocaleString('en-US', { month: 'long', day: 'numeric'}),
    balance: item.balanceAmount,
  }));

  return (
    <div>
      <ChartContainer
        config={{
          balance: {
            label: "Balance",
            color: "#334155",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={transformedData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value} // Display the formatted date
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="balance" type="natural" stroke="var(--color-balance)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export default LinechartChart