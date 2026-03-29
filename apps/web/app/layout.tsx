import './globals.css';
import { Barlow_Condensed, Barlow } from "next/font/google";
import { AuthProvider } from '../hooks/useAuth';
import { NotificationProvider } from '../contexts/NotificationContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SmoothScroll from '../components/SmoothScroll';

const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow-condensed" });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" });

export const metadata = {
  title: 'NiveshIQ | AI Financial Mentor',
  description: 'Experience Cinematic Financial Intelligence. NiveshIQ uses advanced AI to analyze your portfolio, legal documents, and taxes.',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${barlowCondensed.variable} ${barlow.variable} bg-[#0A0F1E] text-white font-barlow`}>
        <SmoothScroll>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_NOT_SET"}>
            <AuthProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}