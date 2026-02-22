import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const { data: payments } = await supabaseAdmin
    .from('invoices')
    .select(`
      *,
      bookings (service_type, customers (first_name, last_name))
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Customer</th>
              <th className="p-2">Service</th>
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(payments ?? []).map((p: any) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-2">
                  {p.bookings?.customers?.first_name || ''}{' '}
                  {p.bookings?.customers?.last_name || ''}
                </td>
                <td className="p-2">{p.bookings?.service_type || '—'}</td>
                <td className="p-2">{p.payment_type || 'payment'}</td>
                <td className="p-2">${((p.amount_cents || 0) / 100).toFixed(2)}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      p.status === 'succeeded'
                        ? 'bg-green-100 text-green-700'
                        : p.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {(payments ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-slate-500 text-center">
                  No payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
