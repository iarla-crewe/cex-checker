import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exchange Scout | Quartz",
  description: "Find the lowest fees and best exchange prices for CEXs in real time, with Quartz's Exchange Scout",
  icons: {
    icon: "/favicon.ico"
  },
  openGraph: {
    title: "Exchange Scout | Quartz",
    description: "Find the lowest fees and best exchange prices for CEXs in real time,  with Quartz's Exchange Scout",
    url: "https://app.quartzpay.io/",
    siteName: "Quartz",
    images: [
      {
        url: "https://uploads-ssl.webflow.com/65707af0f4af991289bbd432/6651dc3631f17b55708010fe_ExchangeScoutOpenGraph.jpg",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
