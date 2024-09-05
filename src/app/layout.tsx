import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";

export const metadata = {
  title: "Avalos",
  description: "Agente de pagos procesados y no procesados de los canales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
