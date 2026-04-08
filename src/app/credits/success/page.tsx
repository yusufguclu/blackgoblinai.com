import Link from "next/link";

export const metadata = {
  title: "Payment Successful — Memelord.com",
  description: "Your credits have been added!",
};

export default function PaymentSuccessPage() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-16 md:py-24 text-center">
      {/* Success Animation Container */}
      <div className="bg-tertiary-container border-4 border-black p-8 md:p-12 brutal-shadow relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #026e00 2px, transparent 2px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Check Icon */}
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-tertiary border-4 border-black brutal-shadow-sm flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-white text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>

          <h1 className="font-headline font-black text-4xl md:text-6xl uppercase italic text-on-tertiary-container drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)] meme-stroke leading-none">
            PAYMENT<br />SUCCESSFUL!
          </h1>

          <div className="mt-6 bg-[#FFFF00] text-black font-headline font-black text-xl md:text-2xl px-6 py-3 border-2 border-black brutal-shadow-sm inline-block uppercase">
            CREDITS ADDED TO YOUR ACCOUNT ⚡
          </div>

          <p className="mt-6 font-bold text-sm uppercase text-on-tertiary-container opacity-80">
            Your credits have been added instantly. Time to make some memes!
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-primary text-white font-headline font-black text-xl px-8 py-4 border-4 border-black brutal-shadow hover:scale-105 transition-transform uppercase italic"
            >
              START CREATING →
            </Link>
            <Link
              href="/credits"
              className="bg-white text-black font-headline font-black text-xl px-8 py-4 border-4 border-black brutal-shadow hover:scale-105 transition-transform uppercase italic"
            >
              VIEW BALANCE
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Message */}
      <div className="mt-8 bg-surface-container border-4 border-black p-4 brutal-shadow-sm">
        <p className="text-xs font-bold uppercase text-on-surface-variant">
          A receipt has been sent to your email. If you don&apos;t see credits in your account within 5 minutes, contact support.
        </p>
      </div>
    </main>
  );
}
