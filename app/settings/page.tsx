export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="card text-sm space-y-2">
        <p>Configure integrations using environment variables.</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Stripe: payment intents + webhook verification</li>
          <li>Twilio: SMS send/receive</li>
          <li>SendGrid: email notices</li>
          <li>Google Calendar: schedule sync</li>
          <li>S3: media uploads</li>
        </ul>
      </div>
    </div>
  );
}
