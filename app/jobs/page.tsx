import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const { data: jobs } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      customers (first_name, last_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Jobs</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Customer</th>
              <th className="p-2">Service</th>
              <th className="p-2">Status</th>
              <th className="p-2">Quote</th>
              <th className="p-2">Deposit / Balance</th>
            </tr>
          </thead>
          <tbody>
            {(jobs ?? []).map((j: any) => (
              <tr key={j.id} className="border-b last:border-0">
                <td className="p-2">
                  {j.customers?.first_name || ''} {j.customers?.last_name || ''}
                </td>
                <td className="p-2">{j.service_type}</td>
                <td className="p-2">{j.status}</td>
                <td className="p-2">${((j.quoted_amount_cents || 0) / 100).toFixed(2)}</td>
                <td className="p-2">
                  ${((j.deposit_amount_cents || 0) / 100).toFixed(2)} /{' '}
                  ${((j.balance_amount_cents || 0) / 100).toFixed(2)}
                </td>
              </tr>
            ))}
            {(jobs ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-slate-500 text-center">
                  No jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
