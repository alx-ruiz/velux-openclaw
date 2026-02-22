import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [{ count: customers }, { count: jobs }, { count: openJobs }, { data: paidInvoices }] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['lead', 'scheduled', 'in_progress']),
    supabase.from('invoices').select('amount_cents').eq('status', 'succeeded'),
  ]);

  const revenueCents = (paidInvoices ?? []).reduce((sum: number, p: any) => sum + (p.amount_cents || 0), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Velux Operations Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><p className="text-sm text-slate-500">Customers</p><p className="text-2xl font-bold">{customers ?? 0}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Jobs</p><p className="text-2xl font-bold">{jobs ?? 0}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Open Jobs</p><p className="text-2xl font-bold">{openJobs ?? 0}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Collected</p><p className="text-2xl font-bold">${(revenueCents / 100).toFixed(2)}</p></div>
      </div>
    </div>
  );
}
