"use client";

import { DUMMY_USERS, User } from "@/lib/dummy-data";
import { useAuth } from "@/context/app-context";

export default function SwitchUserPage() {
  const { switchUserForTesting } = useAuth();

  const handleSwitchUser = (user: User) => {
    switchUserForTesting(user);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Switch User for Testing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_USERS.map((user) => (
          <button
            key={user.email}
            onClick={() => handleSwitchUser(user)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Switch to {user.role}
          </button>
        ))}
      </div>
    </div>
  );
}
