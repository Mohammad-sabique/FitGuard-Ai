"use client";

import { useState } from "react";
import { FoodEstimate } from "@/types";

export function FoodEstimator({ onEstimate }: { onEstimate: (data: FoodEstimate) => void }) {
  const simulate = () => {
    const mock: FoodEstimate = {
      label: "Pizza",
      calories: Math.floor(Math.random() * 800) + 200,
      confidence: 0.85,
    };
    onEstimate(mock);
  };

  return (
    <div className="border p-4 rounded mt-4">
      <h2 className="font-semibold">Food Analysis</h2>
      <button onClick={simulate} className="bg-green-600 text-white px-4 py-2 mt-2 rounded">
        Simulate Food Scan
      </button>
    </div>
  );
}