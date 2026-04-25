import type { Metadata } from 'next';
import { Orbitron, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'AI Game Scene Builder — Generate 3D Worlds with Claude AI',
  description:
    'Describe your game scene in natural language and watch AI generate a live interactive 3D world using Three.js and Claude AI. Built by Cloudexify.',
  keywords: ['AI', '3D', 'game', 'scene builder', 'Three.js', 'Claude', 'Anthropic'],
  authors: [{ name: 'Cloudexify', url: 'https://cloudexify.site' }],
  openGraph: {
    title: 'AI Game Scene Builder',
    description: 'Generate interactive 3D game scenes with AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
