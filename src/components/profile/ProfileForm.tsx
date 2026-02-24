"use client";

import { useState } from "react";

export function ProfileForm({ onSubmit }: any) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    medicalIssues: "",
    goal: "",
    dietPlan: "",
    workoutPlan: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input name="name" placeholder="Name"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <input name="age" placeholder="Age"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <input name="weight" placeholder="Weight (kg)"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <input name="height" placeholder="Height (cm)"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <textarea name="medicalIssues"
        placeholder="Medical Issues"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <textarea name="goal"
        placeholder="Fitness Goal"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <textarea name="dietPlan"
        placeholder="Current Diet Plan"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <textarea name="workoutPlan"
        placeholder="Current Workout Plan"
        onChange={handleChange}
        className="w-full p-3 bg-slate-800 rounded" />

      <button
        type="submit"
        className="bg-white text-black px-6 py-3 rounded font-semibold">
        Save Profile
      </button>
    </form>
  );
}