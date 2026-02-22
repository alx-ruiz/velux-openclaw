import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const { data: jobs } = await supabase.from('bookings').select('*').order('id', { ascending: false }).limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Jobs</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-2">Customer</th><th className="p-2">Service</th><th className="p-2">Status</th><th className="p-2">Quote</th><th className="p-2">Deposit/Balance</th></tr></thead>
          <tbody>
            {(jobs ?? []).map((j: any) => (
              <tr key={j.id} className="border-b last:border-0">
                <td className="p-2">{j.first_name || ''} {j.last_name || ''}</td>
                <td className="p-2">{j.service_type}</td>
                <td className="p-2">{j.status}</td>
                <td className="p-2">${((j.quoted_amount_cents || 0) / 100).toFixed(2)}</td>
                <td className="p-2">${((j.deposit_amount_cents || 0) / 100).toFixed(2)} / ${((j.balance_amount_cents || 0) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
