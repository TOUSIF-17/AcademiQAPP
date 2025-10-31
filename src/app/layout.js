import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import DevtoolsBlocker from './DevtoolsBlocker';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});
export const metadata = {
  title: "AcademiQ - AI-Driven Faculty Analytics and Research Platform",
  description: "Transform academic research with AI-powered summarization, faculty analytics, and institutional insights. Manage publications, track research impact, and enhance academic visibility.",
  keywords: ["AcademiQ", "Academic Research", "AI Summarization", "Faculty Analytics", "Research Publications", "TextRank", "BART", "Higher Education"],
  authors: [{
    name: "AcademiQ Team"
  }],
  icons: {
    icon: ["/favicon.ico", "/logo.png"],
    shortcut: "/logo.png",
    apple: "/logo.png"
  },
  openGraph: {
    title: "AcademiQ - AI-Driven Academic Platform",
    description: "Transform academic research with AI-powered summarization and faculty analytics",
    url: "https://academiq.example.com",
    siteName: "AcademiQ",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AcademiQ - AI-Driven Academic Platform",
    description: "Transform academic research with AI-powered summarization and faculty analytics"
  }
};
export default function RootLayout({
  children
}) {
  return /*#__PURE__*/React.createElement("html", {
    lang: "en",
    suppressHydrationWarning: true
  }, /*#__PURE__*/React.createElement("body", {
    className: `${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`
  }, /*#__PURE__*/React.createElement(DevtoolsBlocker, null), children, /*#__PURE__*/React.createElement(Toaster, null)));
}

