import { supabase } from '@/lib/supabase';

export default async function PaymentsPage() {
  const { data: payments } = await supabase.from('invoices').select('*').order('id', { ascending: false }).limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="p-2">Customer</th><th className="p-2">Type</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
          <tbody>
            {(payments ?? []).map((p: any) => (
              <tr key={p.id} className="border-b last:border-0"><td className="p-2">{p.first_name || ''} {p.last_name || ''}</td><td className="p-2">{p.payment_type || 'payment'}</td><td className="p-2">${((p.amount_cents || 0)/100).toFixed(2)}</td><td className="p-2">{p.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
