import { google } from 'googleapis';

function getAuth() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar']
  });
}

export async function createCalendarEvent(summary: string, startISO: string, endISO: string, description?: string) {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) return { skipped: true };

  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  return calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
    requestBody: {
      summary,
      description,
      start: { dateTime: startISO },
      end: { dateTime: endISO }
    }
  });
}
