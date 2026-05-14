import "./globals.css";

export const metadata = {
  title: "AIssistant",
  description: "Multi-bank personal finance assistant demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
