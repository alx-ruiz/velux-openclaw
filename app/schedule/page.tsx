import { db, ensureSchema } from '@/lib/db';

export default function SchedulePage() {
  ensureSchema();
  const events = db.prepare(`
    SELECT j.id, j.service_type, j.scheduled_start, j.scheduled_end, c.first_name, c.last_name
    FROM jobs j JOIN customers c ON c.id = j.customer_id
    WHERE j.scheduled_start IS NOT NULL
    ORDER BY j.scheduled_start ASC LIMIT 30
  `).all() as any[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <div className="card">
        <ul className="space-y-2 text-sm">
          {events.map(e => (
            <li key={e.id} className="border-b pb-2 last:border-0">
              <p className="font-medium">{e.service_type} — {e.first_name} {e.last_name}</p>
              <p>{e.scheduled_start} → {e.scheduled_end || 'TBD'}</p>
            </li>
          ))}
          {events.length === 0 && <li>No scheduled jobs yet.</li>}
        </ul>
      </div>
    </div>
  );
}
