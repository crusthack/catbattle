import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    icons:{
      icon: "https://i.namu.wiki/i/M6AE8KgdUiL4hPvu8foaiuoQhAg4irefljwcQwO6AMrLqF3N1g-x9fov0mU6Q4wwTeeepQzVT-yw4_qUs_0pfYaxE69UzDs6tbU9riaYER2lvO_nHhxzKNssBW1ZbE7JcZW4SIT4jaup6K8P2kk7hQ.webp"
  },
  title: "냥코대전쟁 DB",
  description: "냥코대전쟁 데이터 조회 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navigation />
        <main className="min-h-screen container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
