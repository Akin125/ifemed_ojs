"use client";

import { useState } from "react";
import { registerUserAction } from "./actions";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerUserAction(formData);

    if (result.success) {
      setMessage({ type: "success", text: result.message || "Registration successful!" });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: "error", text: result.error || "Registration failed" });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">User Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md border">
        {message && (
          <div className={`p-4 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="givenName" className="block text-sm font-medium mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="givenName"
            name="givenName"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="familyName" className="block text-sm font-medium mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="familyName"
            name="familyName"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={6}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
