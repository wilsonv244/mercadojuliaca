"use client";
import PanelPrincipal from "./PanelPrincipal";
//theme

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>
      <PanelPrincipal />
      {children}
    </section>
  );
}
