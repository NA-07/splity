import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Splity</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The easiest way to split expenses with friends, roommates, or groups.
          Track spending, settle up, and keep everyone happy.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">Sign In</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">Split Expenses</h3>
            <p className="text-sm text-muted-foreground">
              Easily split bills, rent, and shared expenses with friends
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">Track Groups</h3>
            <p className="text-sm text-muted-foreground">
              Create groups for trips, apartments, or any shared activities
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-2">Settle Up</h3>
            <p className="text-sm text-muted-foreground">
              See who owes what and settle balances with ease
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
