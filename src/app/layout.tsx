import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "উম্মাহর জাগরণে করনীয় শীর্ষক সেমিনার ২০২৫ | Narsingdi | Seminar Registration",
  description:
    "উম্মাহর জাগরণে করনীয় শীর্ষক সেমিনার ২০২৫ (নরসিংদী)-এ অংশগ্রহণ করুন। নিবন্ধনের জন্য ফর্ম পূরণ করুন । আসন সংখ্যা সীমিত!",
  keywords: [
    "উম্মাহর জাগরণ",
    "সেমিনার ২০২৫",
    "ইসলামিক ইভেন্ট",
    "বাংলাদেশ",
    "নরসিংদী",
    "Narsingdi",
    "ইসলামী সেমিনার",
    "Bkash Payment",
    "Nagad Payment",
    "Seminar Registration",
    "Islamic Event Bangladesh",
    "Dhaka Seminar",
    "Motivational Seminar",
    "Narsingdi Event",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
