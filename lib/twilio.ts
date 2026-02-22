import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSms(to: string, body: string) {
  if (!twilioClient) return { skipped: true };
  return twilioClient.messages.create({
    from: process.env.TWILIO_FROM_NUMBER,
    to,
    body
  });
}
