import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginPage";

export const metadata = {
  title: "Admin Login",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <AdminLoginPage />
    </Suspense>
  );
}
