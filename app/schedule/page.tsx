import { supabase } from '@/lib/supabase';

export default async function SchedulePage() {
  const { data: events } = await supabase
    .from('bookings')
    .select('id, service_type, scheduled_start, scheduled_end, first_name, last_name')
    .not('scheduled_start', 'is', null)
    .order('scheduled_start', { ascending: true })
    .limit(30);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <div className="card">
        <ul className="space-y-2 text-sm">
          {(events ?? []).map((e: any) => (
            <li key={e.id} className="border-b pb-2 last:border-0">
              <p className="font-medium">{e.service_type} — {e.first_name || ''} {e.last_name || ''}</p>
              <p>{e.scheduled_start} → {e.scheduled_end || 'TBD'}</p>
            </li>
          ))}
          {(events ?? []).length === 0 && <li>No scheduled jobs yet.</li>}
        </ul>
      </div>
    </div>
  );
}
