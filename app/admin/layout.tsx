import { Suspense } from "react";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Admin CMS — Yopa Pitra R.",
  description: "Content Management Dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="admin-area"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f5f5f5",
      }}
    >
      <Suspense fallback={<aside style={{ width: "260px", background: "#0c0c0c" }} />}>
        <Sidebar />
      </Suspense>
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          background: "#0d0d0d",
        }}
      >
        {children}
      </main>
    </div>
  );
}
