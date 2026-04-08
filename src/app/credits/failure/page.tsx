import Link from "next/link";

export const metadata = {
  title: "Payment Failed — Memelord.com",
  description: "Your payment could not be processed.",
};

export default function PaymentFailurePage() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-16 md:py-24 text-center">
      {/* Failure Container */}
      <div className="bg-error-container border-4 border-black p-8 md:p-12 brutal-shadow relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #ba1a1a 0, #ba1a1a 10px, transparent 10px, transparent 20px)",
          }}
        />

        {/* Error Icon */}
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-error border-4 border-black brutal-shadow-sm flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-white text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              error
            </span>
          </div>

          <h1 className="font-headline font-black text-4xl md:text-6xl uppercase italic text-on-error-container drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)] meme-stroke leading-none">
            PAYMENT<br />FAILED
          </h1>

          <div className="mt-6 bg-secondary text-white font-headline font-black text-lg md:text-xl px-6 py-3 border-2 border-black brutal-shadow-sm inline-block uppercase">
            YOUR CARD WAS NOT CHARGED
          </div>

          <p className="mt-6 font-bold text-sm uppercase text-on-error-container opacity-80">
            Something went wrong during payment. No money was taken from your account. Please try again.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/credits"
              className="bg-primary text-white font-headline font-black text-xl px-8 py-4 border-4 border-black brutal-shadow hover:scale-105 transition-transform uppercase italic"
            >
              TRY AGAIN →
            </Link>
            <Link
              href="/"
              className="bg-white text-black font-headline font-black text-xl px-8 py-4 border-4 border-black brutal-shadow hover:scale-105 transition-transform uppercase italic"
            >
              GO HOME
            </Link>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="mt-8 bg-surface-container border-4 border-black p-4 brutal-shadow-sm">
        <p className="text-xs font-bold uppercase text-on-surface-variant">
          Common reasons: insufficient funds, 3D Secure failed, card declined. If the issue persists, try a different card or contact your bank.
        </p>
      </div>
    </main>
  );
}
