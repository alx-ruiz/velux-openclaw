export async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return { skipped: true };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: process.env.SENDGRID_FROM_EMAIL || 'noreply@velux.local' },
      subject,
      content: [{ type: 'text/plain', value: text }]
    })
  });

  return { ok: res.ok, status: res.status };
}
