import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { AppProvider } from '@/context/app-context';
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Ghana Must Go',
  description: 'Your all-in-one app for rides, dispatch, food, and more.',
  manifest: '/manifest.json',
  icons: { 
    icon: '/icon.svg',
    apple: '/icons/icon-192x192.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#003300" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <AppProvider>
          <Header />
          <main className="flex-grow bg-background">{children}</main>
          <Footer />
          <Toaster />
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
