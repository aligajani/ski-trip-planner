"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { resetToTestMode } from "@/lib/reset-test-mode";
import { toast } from "sonner";

export function ResetTestButton() {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to reset the database to test mode? This will:\n\n" +
      "• Clear all destination selections from trips\n" +
      "• Clear all destination votes from participants\n" +
      "• Clear all hotel selections from participants\n" +
      "• Clear all room selections from participants\n\n" +
      "This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsResetting(true);
    
    try {
      const result = await resetToTestMode();
      
      if (result.success) {
        toast.success(result.message || "Database reset successfully!");
      } else {
        toast.error(result.error || "Failed to reset database");
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleReset}
      disabled={isResetting}
      className="flex items-center gap-2"
    >
      {isResetting ? (
        <RotateCcw className="w-4 h-4 animate-spin" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      {isResetting ? "Resetting..." : "Reset to Test Mode"}
    </Button>
  );
}
