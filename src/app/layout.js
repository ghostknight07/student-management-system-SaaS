import "./globals.css";
import { Gabarito } from "next/font/google";

const gabarito = Gabarito({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Studify",
  description: "A student management app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${gabarito.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
