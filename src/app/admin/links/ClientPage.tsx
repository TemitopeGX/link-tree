"use client";

import dynamic from "next/dynamic";

const AdminLinksContent = dynamic(() => import("./AdminLinksContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-black/40 rounded-xl animate-pulse" />
    </div>
  ),
});

export default function ClientPage() {
  return <AdminLinksContent />;
}
