"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import InstallSimulation from "@/components/InstallSimulation";

type Props = {
  campaign?: string;
};

export default function RedeemFlow({ campaign = "godis" }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showSim, setShowSim] = useState(true);
  const [redeemed, setRedeemed] = useState(false);
  const [submitting, setSubmitting] = useState(true);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const nameValid = name.trim().length >= 2;
  const canSubmit = nameValid && emailValid && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!canSubmit) return;

  setSubmitting(true);

  // lagre midlertidig i sessionStorage slik at /hacked kan lese dem
  try {
    sessionStorage.setItem("redeem_name", name.trim());
    sessionStorage.setItem("redeem_email", email.trim().toLowerCase());
  } catch (err) {
    console.warn("Kunne ikke skrive til sessionStorage", err);
  }

  // start den falske installasjons-animasjonen
  setShowSim(true);
};

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 shadow-lg rounded-2xl p-6">
        {!redeemed ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center">
              Gratulerer — du vant!
            </h1>
            <p className="mt-2 text-center text-neutral-600">
              Fyll inn navn og e-post for å løse inn <span className="font-medium">gratis godis</span>.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Navn
                </label>
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-neutral-300 px-3 outline-none focus:ring-2 focus:ring-black/10 text-neutral-900"
                  placeholder="Ola Nordmann"
                  required
                />
                {!nameValid && name.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">Skriv inn fullt navn.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  E-post
                </label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-neutral-300 px-3 outline-none focus:ring-2 focus:ring-black/10 text-neutral-900"
                  placeholder="ola@example.com"
                  required
                />
                {!emailValid && email.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">Ugyldig e-postadresse.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-12 rounded-xl bg-black text-white font-semibold disabled:opacity-40 active:scale-[0.99] transition"
              >
                {submitting ? "Starter …" : "løs inn"}
              </button>

              <p className="text-[11px] text-neutral-500 text-center">
                Kampanje: <span className="font-medium">{campaign}</span>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-neutral-900 text-center">Innløst 🎉</h2>
            <p className="mt-2 text-center text-neutral-600">
              Godiset er reservert. Vis denne siden i kassen for å hente.
            </p>
            <Link href="/" className="mt-6 block text-center text-sm text-neutral-700 underline">
              Gå tilbake til forsiden
            </Link>
          </>
        )}
      </div>

      {/* Falsk installasjon etter innsending */}
      {showSim && (
        <InstallSimulation
          showOncePerSession={false}
          minDurationMs={2000}
          onFinish={() => {
            setShowSim(false);
            setRedeemed(true);
            setSubmitting(false);
          }}
        />
      )}
    </main>
  );
}
