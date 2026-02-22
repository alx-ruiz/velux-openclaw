import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const { data: events } = await supabaseAdmin
    .from('bookings')
    .select(`
      id, service_type, scheduled_start, scheduled_end,
      customers (first_name, last_name)
    `)
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
              <p className="font-medium">
                {e.service_type} —{' '}
                {e.customers?.first_name || ''} {e.customers?.last_name || ''}
              </p>
              <p>
                {e.scheduled_start} → {e.scheduled_end || 'TBD'}
              </p>
            </li>
          ))}
          {(events ?? []).length === 0 && (
            <li className="text-slate-500">No scheduled jobs yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
