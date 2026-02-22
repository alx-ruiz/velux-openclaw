import { db, ensureSchema } from '@/lib/db';

export default function PaymentsPage() {
  ensureSchema();
  const payments = db.prepare(`
    SELECT p.*, j.service_type, c.first_name, c.last_name
    FROM payments p
    JOIN jobs j ON j.id = p.job_id
    JOIN customers c ON c.id = j.customer_id
    ORDER BY p.id DESC
    LIMIT 50
  `).all() as any[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-2">Customer</th><th className="p-2">Type</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b last:border-0"><td className="p-2">{p.first_name} {p.last_name}</td><td className="p-2">{p.payment_type}</td><td className="p-2">${(p.amount_cents/100).toFixed(2)}</td><td className="p-2">{p.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
