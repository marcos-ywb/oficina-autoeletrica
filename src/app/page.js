"use client";
import React, { useEffect } from "react";

import LoginForm from "@/components/LoginForm";

export default function Home() {

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <LoginForm />
    </div>
  );
}
