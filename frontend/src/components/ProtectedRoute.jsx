import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 size={32} className="text-[#1E008D] animate-spin" />
      </div>
    );
  }
  if (!user) {
    // Remember intended destination so post-login we can return
    try {
      sessionStorage.setItem("pmm_post_login", location.pathname + location.search);
    } catch {}
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
