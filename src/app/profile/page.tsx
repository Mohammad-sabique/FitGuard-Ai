"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">User Health Profile</h1>

        <ProfileForm onSubmit={setProfileData} />

        {profileData && (
          <div className="mt-8 bg-slate-900 p-6 rounded-lg">
            <h2 className="font-semibold mb-3">Saved Profile Data</h2>
            <pre className="text-sm text-slate-400">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}