import './globals.css';
import { Barlow_Condensed, Barlow } from "next/font/google";
import { AuthProvider } from '../hooks/useAuth';

const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow-condensed" });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" });

export const metadata = {
  title: 'NiveshIQ | AI Financial Mentor',
  description: 'Experience Cinematic Financial Intelligence. NiveshIQ uses advanced AI to analyze your portfolio, legal documents, and taxes.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${barlowCondensed.variable} ${barlow.variable} bg-[#0A0F1E] text-white font-barlow`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}