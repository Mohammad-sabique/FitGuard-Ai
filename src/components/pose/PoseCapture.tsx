"use client";

import { useState } from "react";
import { PoseSummary } from "@/types";

export function PoseCapture({ onSummary }: { onSummary: (data: PoseSummary) => void }) {
  const simulate = () => {
    const mock: PoseSummary = {
      formScore: Math.floor(Math.random() * 40) + 60,
      issues: ["knee_valgus"],
    };
    onSummary(mock);
  };

  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold">Pose Analysis</h2>
      <button onClick={simulate} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
        Simulate Pose Capture
      </button>
    </div>
  );
}