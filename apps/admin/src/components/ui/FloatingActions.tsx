"use client";

import { FloatingAssistant } from "@/components/shared/FloatingAssistant";

/**
 * Legacy FloatingActions forwarded to the unified FloatingAssistant component
 * to guarantee a single consistent assistant across all pages.
 */
export function FloatingActions() {
  return <FloatingAssistant />;
}

export default FloatingActions;
