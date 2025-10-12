"use client";

import { useEffect, useState } from "react";
import MatrixRain from "@/components/MatrixRain";

export default function HackedPage() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const n = sessionStorage.getItem("redeem_name");
      const e = sessionStorage.getItem("redeem_email");
      setName(n);
      setEmail(e);
    } catch (err) {
      console.warn("Kunne ikke lese sessionStorage", err);
    }
  }, []);

  // fallback hvis ikke funnet
  const displayName = name && name.length > 0 ? name : "deres bruker";
  const displayEmail = email && email.length > 0 ? email : "ukjent e-post";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Matrix-bakgrunn */}
      <MatrixRain opacity={0.06} fontSize={18} fps={50} />

      {/* Overlay-innhold */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-xl bg-black/40 p-6 rounded-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-400 tracking-wide drop-shadow-lg">
            Hei {displayName}, du har blitt hacket 💀
          </h1>

          <p className="mt-4 text-green-200/90 text-base md:text-lg">
            Vi har nå tilgang til din epost:{" "}
            <span className="font-mono text-sm text-green-100">
              {displayEmail}
            </span>
          </p>
          <div className="mt-6 border border-green-500/60 rounded-xl p-4 bg-black/80">
            <p className="text-green-200/80 text-sm leading-relaxed">
              Dette kunne vært en falsk QR-kode. Vær forsiktig med hvilke lenker
              du klikker på, og hvilke apper du laster ned.
              <br />
              Om du vil lese mer om sikkerhetstips kan du finne dem på{" "}
              <span className="font-semibold text-green-300">Viva Engage </span>
               under: <span className="italic">sikkerhet og personvern</span>.
              <br />
              <span className="font-medium text-green-400">
                Hilsen Thon IT Sikkerhet
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
