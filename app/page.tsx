import { db, ensureSchema } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  ensureSchema();

  const metrics = {
    customers: db.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number },
    jobs: db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count: number },
    openJobs: db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status IN ('lead','scheduled','in_progress')").get() as { count: number },
    revenue: db.prepare("SELECT IFNULL(SUM(amount_cents),0) as cents FROM payments WHERE status='succeeded'").get() as { cents: number }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Velux Operations Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><p className="text-sm text-slate-500">Customers</p><p className="text-2xl font-bold">{metrics.customers.count}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Jobs</p><p className="text-2xl font-bold">{metrics.jobs.count}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Open Jobs</p><p className="text-2xl font-bold">{metrics.openJobs.count}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Collected</p><p className="text-2xl font-bold">${(metrics.revenue.cents / 100).toFixed(2)}</p></div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">SMS-first workflow</h2>
        <ol className="list-decimal ml-5 text-sm space-y-1">
          <li>Capture inbound lead via phone/SMS</li>
          <li>Create customer + quote</li>
          <li>Collect 20% deposit to confirm booking</li>
          <li>Send reminders and service updates by SMS</li>
          <li>Collect 80% balance at completion</li>
        </ol>
      </div>
    </div>
  );
}
