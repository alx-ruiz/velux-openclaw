import { supabase } from '@/lib/supabase';

export default async function CommunicationsPage() {
  const { data: messages } = await supabase.from('sms_log').select('*').order('id', { ascending: false }).limit(100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Communications</h1>
      <div className="card space-y-3">
        {(messages ?? []).map((m: any) => (
          <div key={m.id} className="border-b pb-2 last:border-0 text-sm">
            <p className="font-medium">{m.customer_phone} • SMS • {m.direction || 'outbound'}</p>
            <p>{m.body || m.message_body}</p>
          </div>
        ))}
        {(messages ?? []).length === 0 && <p className="text-sm">No messages logged yet.</p>}
      </div>
    </div>
  );
}
