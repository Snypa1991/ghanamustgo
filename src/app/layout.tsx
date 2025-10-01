import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code, Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/app-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const ptSans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-headline" });

export const metadata: Metadata = {
  title: "Ghana Must Go",
  description: "A super-app for all your needs",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#003300",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>)
{
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable} ${poppins.variable} ${ptSans.variable}`}>
      <AppProvider>
        <body className="font-sans">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </AppProvider>
    </html>
  );
}