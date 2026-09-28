import type { Metadata } from 'next';
import { Lora, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SourceDrawer from '@/components/layout/SourceDrawer';
import ResearchAssistantWidget from '@/components/assistant/ResearchAssistantWidget';
import { SourceDrawerProvider } from '@/context/SourceDrawerContext';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PLF Research Intelligence | A Living Knowledge Base for Precision Livestock Farming',
  description: 'Evidence-driven research portal exploring technologies, bio-responses, empirical validations, historical timelines, and unresolved research questions in Precision Livestock Farming (PLF).',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${sourceSans3.variable} scroll-smooth`}>
      <body className={`${sourceSans3.className} font-sans min-h-screen flex flex-col bg-sand-50 dark:bg-forest-900 text-slate-900 dark:text-slate-100 antialiased`}>
        <SourceDrawerProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <SourceDrawer />
          <ResearchAssistantWidget />
        </SourceDrawerProvider>
      </body>
    </html>
  );
}
