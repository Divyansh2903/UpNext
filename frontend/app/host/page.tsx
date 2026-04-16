"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HostRoutePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/host/auth");
  }, [router]);

  return null;
}
