import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title:"Examnation System",
  description: "Examnation System is a platform for conducting online exams and assessments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className}antialiased `}
      >
        {children}
        <Toaster duration={2000} richColors position="bottom-right" />
      </body>
    </html>
  );
}
