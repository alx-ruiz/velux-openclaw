import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Velux CRM',
  description: 'SMS-first detailing CRM'
};

const nav = [
  ['Dashboard', '/'],
  ['Customers', '/customers'],
  ['Jobs', '/jobs'],
  ['Schedule', '/schedule'],
  ['Payments', '/payments'],
  ['Comms', '/communications'],
  ['Settings', '/settings']
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center">
            <img src="/logo.svg" alt="Velux CRM" className="h-8 w-auto" />
            <nav className="flex gap-4 text-sm">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="text-slate-700 hover:text-velux-blue">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
