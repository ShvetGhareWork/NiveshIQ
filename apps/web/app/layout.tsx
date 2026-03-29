import './globals.css';
import { Barlow_Condensed, Barlow } from "next/font/google";
import { AuthProvider } from '../hooks/useAuth';
import { NotificationProvider } from '../contexts/NotificationContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}