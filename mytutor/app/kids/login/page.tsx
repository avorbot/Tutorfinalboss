"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KidsLayout } from "@/components/kids/KidsLayout";
import { AvatarPicker } from "@/components/kids/AvatarPicker";

export default function KidsLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"avatar" | "pin">("avatar");
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePinDigit(digit: string) {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) submitLogin(next);
    }
  }

  function clearPin() { setPin(""); setError(""); }

  async function submitLogin(finalPin: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/kids/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: selectedAvatar, pin: finalPin }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Wrong PIN!"); setPin(""); setLoading(false); return; }
      router.push("/kids/dashboard");
    } catch {
      setError("Something went wrong. Try again!");
      setPin(""); setLoading(false);
    }
  }

  return (
    <KidsLayout>
      <div className="flex flex-col items-center px-4 py-8 min-h-[80vh] justify-center">
        {step === "avatar" ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <h2 className="text-4xl font-black text-white text-center mb-2">Who are you?</h2>
            <p className="text-blue-300 text-center mb-8 text-lg">Pick your character!</p>
            <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("pin")}
              className="w-full mt-8 py-5 rounded-3xl text-2xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                boxShadow: "0 0 25px rgba(139,92,246,0.5)",
              }}
            >
              That&apos;s me! →
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full max-w-xs text-center"
          >
            <div className="text-8xl mb-4">
              {["🦁","🐸","🐼","🐧","🐬","🦋","🦊","🐉"][parseInt(selectedAvatar) - 1]}
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Enter your PIN</h2>
            <p className="text-blue-300 mb-8">4 secret numbers 🔐</p>

            {/* PIN dots */}
            <div className="flex justify-center gap-4 mb-8">
              {[0,1,2,3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: pin.length > i ? 1.2 : 1 }}
                  className="w-5 h-5 rounded-full border-2"
                  style={{
                    background: pin.length > i ? "#8b5cf6" : "transparent",
                    borderColor: pin.length > i ? "#8b5cf6" : "rgba(139,92,246,0.4)",
                    boxShadow: pin.length > i ? "0 0 15px #8b5cf6" : "none",
                  }}
                />
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-red-400 font-bold text-lg mb-4"
              >
                ❌ {error}
              </motion.div>
            )}

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {["1","2","3","4","5","6","7","8","9"].map((d) => (
                <motion.button
                  key={d}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePinDigit(d)}
                  disabled={loading || pin.length >= 4}
                  className="w-20 h-20 mx-auto rounded-2xl text-3xl font-black text-white"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "2px solid rgba(139,92,246,0.3)",
                  }}
                >
                  {d}
                </motion.button>
              ))}
              <div />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePinDigit("0")}
                disabled={loading || pin.length >= 4}
                className="w-20 h-20 mx-auto rounded-2xl text-3xl font-black text-white"
                style={{ background: "rgba(255,255,255,0.1)", border: "2px solid rgba(139,92,246,0.3)" }}
              >
                0
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearPin}
                className="w-20 h-20 mx-auto rounded-2xl text-2xl font-bold text-red-400"
                style={{ background: "rgba(255,0,0,0.08)", border: "2px solid rgba(239,68,68,0.3)" }}
              >
                ✗
              </motion.button>
            </div>

            <button onClick={() => { setStep("avatar"); setPin(""); setError(""); }}
              className="text-sm text-blue-400 hover:text-white transition-colors mt-2">
              ← Back
            </button>
          </motion.div>
        )}
      </div>
    </KidsLayout>
  );
}
