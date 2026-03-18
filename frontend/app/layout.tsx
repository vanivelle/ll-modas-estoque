import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Estoque Universal',
  description: 'Controle de estoque multi-tenant',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
