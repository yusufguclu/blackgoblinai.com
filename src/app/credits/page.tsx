import { getUserCredits, CREDIT_PACKAGES } from "@/lib/credits";
import Link from "next/link";
import PurchaseButton from "./PurchaseButton";

export const metadata = {
  title: "Buy Credits — Memelord.com",
  description: "Fuel your meme machine. Buy credits to generate unlimited AI chaos.",
};

export default async function CreditsPage() {
  const credits = await getUserCredits();

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-10 md:py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="font-headline font-black text-5xl md:text-7xl uppercase italic text-primary drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] meme-stroke leading-none">
          FUEL YOUR<br />MEME MACHINE
        </h1>
        <p className="mt-4 font-headline font-bold text-lg md:text-xl bg-secondary text-white inline-block px-6 py-2 border-2 border-black brutal-shadow-sm uppercase">
          BUY CREDITS. MAKE CHAOS. REPEAT.
        </p>

        {/* Current Balance */}
        {credits !== null && (
          <div className="mt-8 inline-flex items-center gap-3 bg-[#FFFF00] border-4 border-black px-6 py-3 brutal-shadow">
            <span className="material-symbols-outlined text-black text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              toll
            </span>
            <div className="text-left">
              <div className="text-xs font-bold uppercase text-black/60">YOUR BALANCE</div>
              <div className="font-headline font-black text-3xl text-black leading-none">
                {credits} <span className="text-lg">CREDITS</span>
              </div>
            </div>
          </div>
        )}

        {credits === null && (
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-block bg-primary text-white font-headline font-black text-xl px-8 py-3 border-4 border-black brutal-shadow hover:scale-105 transition-transform uppercase italic"
            >
              LOGIN TO BUY CREDITS
            </Link>
          </div>
        )}
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {CREDIT_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex flex-col border-4 border-black bg-surface-container-lowest brutal-shadow transition-transform hover:-translate-y-2 ${
              pkg.popular ? "md:-translate-y-4 md:hover:-translate-y-6 ring-4 ring-[#FFFF00]" : ""
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FFFF00] text-black font-headline font-black text-sm px-6 py-1 border-2 border-black brutal-shadow-sm uppercase whitespace-nowrap z-10">
                ⚡ MOST POPULAR ⚡
              </div>
            )}

            {/* Card Header */}
            <div
              className={`p-6 border-b-4 border-black text-center ${
                pkg.popular
                  ? "bg-primary text-white"
                  : pkg.id === "ultra"
                  ? "bg-tertiary text-white"
                  : "bg-secondary-container text-on-secondary-container"
              }`}
            >
              <h2 className="font-headline font-black text-3xl uppercase italic drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                {pkg.name}
              </h2>
              <p className="mt-1 text-sm font-bold uppercase opacity-80">{pkg.description}</p>
            </div>

            {/* Price */}
            <div className="p-6 text-center border-b-4 border-black bg-surface-container-low">
              <div className="font-headline font-black text-6xl text-primary leading-none">
                {pkg.priceDisplay}
              </div>
              <div className="mt-1 font-bold text-sm uppercase text-on-surface-variant">
                {pkg.credits} CREDITS
              </div>
              <div className="mt-1 text-xs font-bold text-on-surface-variant opacity-60">
                ${(pkg.price / pkg.credits / 100).toFixed(2)} per credit
              </div>
            </div>

            {/* Perks */}
            <div className="p-6 flex-grow">
              <ul className="space-y-3">
                {pkg.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-bold text-sm uppercase">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="p-6 pt-0">
              <PurchaseButton packageId={pkg.id} packageName={pkg.name} credits={pkg.credits} isLoggedIn={credits !== null} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container border-4 border-black p-4 brutal-shadow-sm text-center">
          <span className="material-symbols-outlined text-primary text-3xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <h3 className="font-headline font-black uppercase text-sm">INSTANT DELIVERY</h3>
          <p className="text-xs mt-1 text-on-surface-variant font-medium">Credits added to your account immediately</p>
        </div>
        <div className="bg-surface-container border-4 border-black p-4 brutal-shadow-sm text-center">
          <span className="material-symbols-outlined text-secondary text-3xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            all_inclusive
          </span>
          <h3 className="font-headline font-black uppercase text-sm">NEVER EXPIRES</h3>
          <p className="text-xs mt-1 text-on-surface-variant font-medium">Your credits stay forever. Use 'em anytime.</p>
        </div>
        <div className="bg-surface-container border-4 border-black p-4 brutal-shadow-sm text-center">
          <span className="material-symbols-outlined text-tertiary text-3xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
          <h3 className="font-headline font-black uppercase text-sm">SECURE CHECKOUT</h3>
          <p className="text-xs mt-1 text-on-surface-variant font-medium">256-bit encryption. We don't store your card.</p>
        </div>
      </div>

      {/* FAQ Mini Section */}
      <div className="mt-12 bg-primary-container border-4 border-black p-6 md:p-8 brutal-shadow">
        <h2 className="font-headline font-black text-2xl uppercase italic text-on-primary-container mb-4 border-b-4 border-black pb-2">
          FREQUENTLY ASKED (but nobody reads this)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-headline font-black uppercase text-sm text-primary">What is a credit?</h3>
            <p className="text-sm font-medium mt-1 text-on-surface">1 credit = 1 AI generation. Upload a photo, pick a style, and watch the chaos unfold.</p>
          </div>
          <div>
            <h3 className="font-headline font-black uppercase text-sm text-primary">Do credits expire?</h3>
            <p className="text-sm font-medium mt-1 text-on-surface">Nope. Your credits stay in your account until you use them. We're not that evil.</p>
          </div>
          <div>
            <h3 className="font-headline font-black uppercase text-sm text-primary">Can I get a refund?</h3>
            <p className="text-sm font-medium mt-1 text-on-surface">All sales are final. But seriously, you're gonna use them all in 5 minutes anyway.</p>
          </div>
          <div>
            <h3 className="font-headline font-black uppercase text-sm text-primary">How do free credits work?</h3>
            <p className="text-sm font-medium mt-1 text-on-surface">New accounts get 3 free credits to start. Go wild. Then come back for more.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
