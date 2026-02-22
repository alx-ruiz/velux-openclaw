import { db, ensureSchema } from '@/lib/db';

export default function CommunicationsPage() {
  ensureSchema();
  const messages = db.prepare(`
    SELECT m.*, c.first_name, c.last_name
    FROM communications m
    JOIN customers c ON c.id = m.customer_id
    ORDER BY m.id DESC
    LIMIT 100
  `).all() as any[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Communications</h1>
      <div className="card space-y-3">
        {messages.map(m => (
          <div key={m.id} className="border-b pb-2 last:border-0 text-sm">
            <p className="font-medium">{m.first_name} {m.last_name} • {m.channel.toUpperCase()} • {m.direction}</p>
            <p>{m.body}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm">No messages logged yet.</p>}
      </div>
    </div>
  );
}
