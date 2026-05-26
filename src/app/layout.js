import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "HireVision AI | Smart Interview & Hiring Platform",
  description: "Revolutionizing Hiring with AI-Powered Smart Interviews",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text-dark selection:bg-primary/20">
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
