"use client";
import Footer from "../login/footer";
import PanelPrincipal from "./PanelPrincipal";
//theme

const layoutStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh", // Esto hace que el contenedor principal tenga al menos el alto de la pantalla
};

const contentStyle = {
  flex: 1, // Esto hace que el contenido ocupe todo el espacio disponible, empujando el Footer hacia abajo
};

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <section style={layoutStyle}>
      {/* Include shared UI here e.g., a header or sidebar */}
      <nav></nav>
      <div style={contentStyle} className="mb-8">
        <PanelPrincipal />
        {children}
      </div>
      <Footer />
    </section>
  );
}
