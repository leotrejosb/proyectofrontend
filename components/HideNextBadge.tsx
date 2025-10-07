"use client";

import { useEffect } from "react";

export function HideNextBadge() {
  useEffect(() => {
    const badge = document.querySelector('[data-next-badge="true"]');
    if (badge) badge.remove();
  }, []);

  return null;
}
