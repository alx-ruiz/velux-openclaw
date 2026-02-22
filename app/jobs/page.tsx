import { db, ensureSchema } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function JobsPage() {
  ensureSchema();
  const jobs = db.prepare(`
    SELECT j.*, c.first_name, c.last_name
    FROM jobs j
    JOIN customers c ON c.id = j.customer_id
    ORDER BY j.id DESC
    LIMIT 50
  `).all() as any[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Jobs</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-2">Customer</th><th className="p-2">Service</th><th className="p-2">Status</th><th className="p-2">Quote</th><th className="p-2">Deposit/Balance</th></tr></thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} className="border-b last:border-0">
                <td className="p-2">{j.first_name} {j.last_name}</td>
                <td className="p-2">{j.service_type}</td>
                <td className="p-2">{j.status}</td>
                <td className="p-2">${(j.quoted_amount_cents/100).toFixed(2)}</td>
                <td className="p-2">${(j.deposit_amount_cents/100).toFixed(2)} / ${(j.balance_amount_cents/100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
