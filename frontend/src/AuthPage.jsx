
import { useState } from "react";
import { supabase } from "./supabase";
import { Compass, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

function AuthPage({ initialMode = "signin", onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isSignUp = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          setSuccess("Account created successfully!");
        } else {
          setSuccess(
            "Account created! Please check your email and verify your account before signing in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#788590] hover:text-[#243b53] mb-8"
        >
          <ArrowLeft size={17} />
          Back to METRIX
        </button>

        <div className="bg-white border border-[#e9e8e2] rounded-[24px] p-7 md:p-9 shadow-sm">

          <div className="flex items-center gap-3 mb-9">
            <div className="w-12 h-12 rounded-2xl bg-[#243b53] text-white flex items-center justify-center">
              <Compass size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-[0.12em] text-[#243b53]">
                METRIX
              </h1>
              <p className="text-[10px] uppercase tracking-[0.13em] text-[#82909c]">
                Intelligent City Planning
              </p>
            </div>
          </div>

          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#82988d]">
            {isSignUp ? "Join METRIX" : "Welcome back"}
          </p>

          <h2 className="serif-heading text-3xl md:text-4xl text-[#243b53] mt-3">
            {isSignUp ? "Create your account." : "Sign in to METRIX."}
          </h2>

          <p className="text-sm text-[#84909a] mt-3 leading-6">
            {isSignUp
              ? "Create an account to explore your planning workspace."
              : "Continue exploring places and planning possibilities."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-[#536779] mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full bg-[#f8f8f5] border border-[#e8e8e1] rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#dce8e2]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#536779] mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-[#f8f8f5] border border-[#e8e8e1] rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#dce8e2]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#536779] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full bg-[#f8f8f5] border border-[#e8e8e1] rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#dce8e2]"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-[#536779] mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-[#f8f8f5] border border-[#e8e8e1] rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#dce8e2]"
                />
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-[#536d68] bg-[#edf4ef] rounded-lg p-3">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="soft-button w-full py-4 flex items-center justify-center gap-3 text-sm font-medium disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isSignUp ? "Create account" : "Sign in"}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-[#efeee9] mt-8 pt-6 text-center">
            <p className="text-sm text-[#84909a]">
              {isSignUp
                ? "Already have an account?"
                : "New to METRIX?"}
              {" "}
              <button
                type="button"
                onClick={() => {
                  setMode(isSignUp ? "signin" : "signup");
                  setError("");
                  setSuccess("");
                }}
                className="font-semibold text-[#536d82] hover:text-[#243b53]"
              >
                {isSignUp ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>

        </div>

        <p className="text-center text-[10px] text-[#a0a7aa] mt-7 tracking-wide">
          METRIX · Think ahead. Plan smarter.
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
