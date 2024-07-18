"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CartesianGrid, XAxis, Line, LineChart, Bar, BarChart } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"

export function Navbar() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SquirrelIcon className="w-6 h-6" />
          <h1 className="text-xl font-bold">Squirrel Fund</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <UserIcon className="w-6 h-6" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="w-6 h-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Welcome back, Jason!</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Add a Deposit
            </Button>

            <Button variant="outline" size="sm">
              Withdraw
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Fund Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <LinechartChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Automatic Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <BarchartChart className="aspect-[9/4]" />
            </CardContent>
          </Card>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6 space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Fund Goal</h2>
              <p className="text-muted-foreground text-sm">Set a target to save towards</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">P5,000</p>
              <p className="text-muted-foreground text-sm">Current Fund balance</p>
            </div>
            <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center">
              <p className="text-2xl font-bold">75%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Automatic Deposits</h2>
              <p className="text-muted-foreground text-sm">Customize your Deposit settings</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">P50</p>
              <p className="text-muted-foreground text-sm">Deposit amount per day</p>
            </div>
            <div className="bg-muted rounded-full flex items-center justify-center px-2 py-2">
              <p className="text-2xl font-bold px-5">Daily</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500 rotate-180" />
                <div>
                  <p className="text-sm font-medium">Deposit to Fund</p>
                  <p className="text-xs text-muted-foreground">July 15, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500 rotate-180" />
                <div>
                  <p className="text-sm font-medium">Deposit to Fund</p>
                  <p className="text-xs text-muted-foreground">July 8, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500 rotate-180" />
                <div>
                  <p className="text-sm font-medium">Deposit to Fund</p>
                  <p className="text-xs text-muted-foreground">July 1, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Withdraw from Fund</p>
                  <p className="text-xs text-muted-foreground">July 2, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
              <div className="grid grid-cols-[25px_1fr_50px] items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <ArrowDownIcon className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Withdraw from Fund</p>
                  <p className="text-xs text-muted-foreground">July 9, 2023</p>
                </div>
                <p className="text-sm font-medium text-right">P50</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-card border-t py-4 px-6 flex justify-between items-center mx-40">
        <Button variant="ghost" size="icon" className="w-max px-5">
          <HomeIcon className="w-6 h-6" label="Home" />
        </Button>

      
          <Button variant="ghost" size="icon" className="w-max px-5">
            <PieChartIcon className="w-6 h-6" />
          </Button>
     

        <Button variant="ghost" size="icon" className="w-max px-5">
          <SettingsIcon className="w-6 h-6" />
        </Button>
      </footer>
    </div>
  )
}

function ArrowDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}


function BarchartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "#334155",
          },
        }}
        className="min-h-[300px]"
      >
        <BarChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}


function HomeIcon(props: any) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div>
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <div>
        <p>Home</p>
      </div>
      
    </div>
  )
}


function LinechartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "#334155",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}


function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function PieChartIcon(props: any) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div>
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      </div>

      <div>
        <p>Analytics</p>
      </div>
    </div>
  )
}


function SettingsIcon(props: any) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div>
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>

      <div>
        <p>Settings</p>
      </div>
    </div>
  )
}


function SquirrelIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.236 22a3 3 0 0 0-2.2-5" />
      <path d="M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4" />
      <path d="M18 13h.01" />
      <path d="M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10" />
    </svg>
  )
}


function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}


function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
