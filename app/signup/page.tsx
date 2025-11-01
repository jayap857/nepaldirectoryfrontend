"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const { signup, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    phone_number: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted"); // DEBUG
    console.log("Form data:", formData); // DEBUG

    setError("");
    setSubmitting(true);

    // Client-side validation
    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setSubmitting(false);
      return;
    }

    try {
      console.log("Calling signup..."); // DEBUG
      const res = await signup(formData);
      console.log("Signup result:", res); // DEBUG
      
      if (res.success) {
        console.log("Signup successful, redirecting..."); // DEBUG
        router.push("/login?registered=true");
      } else {
        console.log("Signup failed:", res.message); // DEBUG
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error caught:", err); // DEBUG
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+977-XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={8}
            />
            <p className="text-gray-500 text-xs mt-1">
              At least 8 characters
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm Password *
            </label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
        {/* Debug helper - dev only */}
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-2">Debug: API Connectivity Test</h3>
          <p className="text-xs text-gray-500 mb-2">Performs a raw fetch to the backend register endpoint and logs detailed info to console.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
                const url = `${base}/register/`;
                console.log('Debug fetch to', url);
                try {
                  const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: 'dbg_user', email: 'dbg@example.com', password: 'Testpass123!', password_confirm: 'Testpass123!' }),
                  });
                  const text = await res.text();
                  console.log('Fetch response status', res.status, res.statusText);
                  try { console.log('Fetch response JSON:', JSON.parse(text)); } catch(e) { console.log('Fetch response text:', text); }
                  alert(`Fetch status: ${res.status} - see console for details`);
                } catch (err) {
                  console.error('Debug fetch error:', err);
                  alert('Debug fetch failed — see console for details');
                }
              }}
              className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Test API Connectivity
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('axios baseURL:', (window as any).__NEXT_DATA__?.env || process.env.NEXT_PUBLIC_API_BASE_URL || 'unknown');
                alert('Check console for axios baseURL / env values');
              }}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Show Env
            </button>
          </div>
        </div>
    </div>
  );
}