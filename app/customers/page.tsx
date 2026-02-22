import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const { data: customers } = await supabaseAdmin
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {(customers ?? []).map((c: any) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="p-2">
                  {c.first_name} {c.last_name}
                </td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.email || '—'}</td>
                <td className="p-2">{c.address}</td>
              </tr>
            ))}
            {(customers ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-slate-500 text-center">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
