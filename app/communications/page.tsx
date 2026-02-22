import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function CommunicationsPage() {
  const { data: messages } = await supabaseAdmin
    .from('sms_log')
    .select(`
      *,
      customers (first_name, last_name, phone)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Communications</h1>
      <div className="card space-y-3">
        {(messages ?? []).map((m: any) => (
          <div key={m.id} className="border-b pb-2 last:border-0 text-sm">
            <p className="font-medium">
              {m.customers?.first_name || ''} {m.customers?.last_name || ''}{' '}
              {m.customers?.phone ? `(${m.customers.phone})` : ''} • SMS •{' '}
              {m.direction || 'outbound'}
            </p>
            <p className="text-slate-600">{m.body || m.message_body || '—'}</p>
          </div>
        ))}
        {(messages ?? []).length === 0 && (
          <p className="text-sm text-slate-500">No messages logged yet.</p>
        )}
      </div>
    </div>
  );
}
