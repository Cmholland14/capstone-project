import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Premium Wool Products - New Zealand Quality",
  description: "Discover luxurious handcrafted wool products made from 100% pure New Zealand wool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SimpleAuthProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </SimpleAuthProvider>
      </body>
    </html>
  );
}
