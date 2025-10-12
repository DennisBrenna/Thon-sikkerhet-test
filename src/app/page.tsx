import MatrixRain from "@/components/MatrixRain";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Matrix-bakgrunn */}
      <MatrixRain opacity={0.6} fontSize={18} fps={50} />

      {/* Overlay-innhold */}
      <div className="text-center px-6">
        <p className="text-4xl md:text-6xl font-extrabold text-green-400 tracking-wide drop-shadow-lg">
          Du har nå blitt hacket. Viktig! ikke scan random QR-koder.
          <p>For å fjerne viruset kontakt Halvor</p>
        </p>
      </div>
    </main>
  );
}
