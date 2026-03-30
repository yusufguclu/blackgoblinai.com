import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Alert Banner */}
      <section className="bg-stripes h-12 flex items-center justify-center overflow-hidden border-b-4 border-black">
        <div className="whitespace-nowrap flex gap-12 animate-marquee py-2">
          <span className="text-white font-black italic font-headline uppercase tracking-widest text-xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            !!!ATTENTION - STOP SUCKING!!! MAKE UNLIMITED AI MEMES AND EDITS !!!ATTENTION - STOP SUCKING!!! MAKE UNLIMITED AI MEMES AND EDITS
          </span>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-6 relative md:sticky md:top-28 z-10">
          <div className="bg-tertiary-container border-4 border-black p-6 brutal-shadow">
            <h2 className="font-headline font-black text-2xl uppercase italic text-on-tertiary-container mb-6 border-b-4 border-black pb-2">fRee meMe toOlS</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 bg-primary border-2 border-black"></div>
                <span className="font-bold uppercase text-sm group-hover:text-primary transition-colors">Unlimited AI meme edits</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 bg-secondary border-2 border-black"></div>
                <span className="font-bold uppercase text-sm group-hover:text-secondary transition-colors">AI meme generator</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 bg-tertiary border-2 border-black"></div>
                <span className="font-bold uppercase text-sm group-hover:text-tertiary transition-colors">Deep fried video fx</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-4 h-4 bg-on-background border-2 border-black"></div>
                <span className="font-bold uppercase text-sm group-hover:translate-x-1 transition-transform">Vintage troll templates</span>
              </li>
            </ul>
            <button className="w-full mt-8 bg-primary text-white font-headline font-black text-xl py-3 border-4 border-black brutal-shadow hover:scale-105 transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none uppercase italic">TRY FREE</button>
          </div>
          {/* Ad/Mini-Banner */}
          <div className="bg-secondary-container border-4 border-black p-4 rotate-1 brutal-shadow-sm">
            <p className="font-headline font-bold text-center uppercase leading-tight text-on-secondary-container">
              BUY MEMECOINS ON <span className="bg-[#FFFF00] text-black px-1">fEebAy</span> TODAY! NO FEES*
            </p>
            <div className="mt-2 text-[8px] text-center opacity-70">*FEES ACTUALLY 100%</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="md:col-span-9 space-y-10">
          {/* Hero Section */}
          <section className="relative bg-surface-container-low border-4 border-black p-1 brutal-shadow overflow-hidden">
            <div className="bg-primary-container p-4 md:p-8 min-h-[300px] md:min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 border-8 border-dashed border-primary opacity-20 rotate-12"></div>
              <div className="absolute bottom-4 right-10 flex gap-2">
                <div className="w-12 h-12 bg-[#FFFF00] border-4 border-black brutal-shadow-sm"></div>
                <div className="w-12 h-12 bg-secondary border-4 border-black brutal-shadow-sm"></div>
              </div>
              <h1 className="font-headline font-black text-5xl md:text-8xl text-primary leading-none uppercase italic drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] meme-stroke relative z-10">
                MEME<br />LORDS<br />ONLY.
              </h1>
              <p className="font-headline font-bold text-lg sm:text-2xl md:text-3xl bg-secondary text-white inline-block px-4 py-1 mt-6 border-2 border-black brutal-shadow-sm relative z-10 max-w-lg">
                THE WORLD'S #1 REPOSITORY OF CHAOTIC DIGITAL ARTIFACTS
              </p>
              <div className="mt-10 flex flex-wrap gap-4 relative z-10">
                <button className="bg-tertiary text-white font-headline font-black text-sm px-4 py-3 sm:text-2xl sm:px-10 sm:py-4 border-4 border-black brutal-shadow hover:bg-tertiary-fixed-dim hover:-translate-y-1 transition-all uppercase italic w-full sm:w-auto">MAKE AI MEMES</button>
                <button className="bg-white text-black font-headline font-black text-sm px-4 py-3 sm:text-2xl sm:px-10 sm:py-4 border-4 border-black brutal-shadow hover:bg-surface-container-high hover:-translate-y-1 transition-all uppercase italic w-full sm:w-auto">EXPLORE fEebAy</button>
              </div>
            </div>
          </section>

          {/* Card Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Link href="/create/bust-down" className="bg-surface-container-lowest border-4 border-black flex flex-col brutal-shadow hover:-translate-y-2 transition-transform group cursor-pointer block">
              <div className="aspect-square border-b-4 border-black bg-surface-dim overflow-hidden relative">
                <img alt="Meme Preview" className="w-full h-full object-cover filter contrast-125 saturate-150" data-alt="dramatic surreal statue head with neon lighting and high contrast aesthetic glitch art style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-PBvpFsgGpw86KGXAKG39-cGebsboIZINyvTDKsbrmM7R5cyHhcXhDZhfF5Hs1EuVEcfbSIhI-D45EgCU4IFjG5yiNPKHb66myRt2VVjy4LkMhhhG_Na0iJXzwtY4yJVeppgADv0olLLfHQh5kT4E0_4TaKHr3ioDdRboIgTBl88o1uj3jFsFMFEHCPO0LPRqmJx9ab-1hdIfxvzKk5E9g_T6UegXi0pgA4ti0o1-mlz9zF2WLJ4sTyILBO3fhgn-NAHEKnljI5L3" />
                <div className="absolute top-2 left-2 bg-secondary text-white font-bold text-[10px] px-2 py-1 uppercase border border-black">TRENDING</div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-headline font-black text-2xl uppercase italic text-primary leading-tight group-hover:underline">Bust Down Filter</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed flex-grow text-on-surface">Deep fry your selfies until they become unrecognizable digital pulp. 100% AI processed.</p>
                <button className="mt-6 w-full bg-[#FFFF00] text-black font-headline font-black py-3 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase italic">TRY FREE -&gt;</button>
              </div>
            </Link>
            {/* Card 2 */}
            <Link href="/create/gigachad" className="bg-surface-container-lowest border-4 border-black flex flex-col brutal-shadow hover:-translate-y-2 transition-transform group cursor-pointer block">
              <div className="aspect-square border-b-4 border-black bg-surface-dim overflow-hidden relative">
                <img alt="Gigachad Preview" className="w-full h-full object-cover filter contrast-150 brightness-110" data-alt="muscular powerful warrior figure in dramatic shadow lighting with epic cinematic composition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtuQWOW6oexgmDYwRLTeCBjLlYx5W0HraPe1atUjsrtbVi4EBGmrjROmZ1zQ4qEkIECWtmE5mOlh4DZWjlaN7C2RPvh0vtVMNfWLfAtu6K_O04jPEaE6CdPUnqz0xEEKlZ1DDXBVQieSW7lq2QxOwqO9tHs0XcFZS1zyvkifz_hc5DmAkqmHL32uNumURHGO8HZCeiQe5LTSrci0esTfkxVl3J40_y-SwE7mdTicSING0w9uKVchD3BAd6Rz0XJ3Zo7PbBTtVQP-Vy" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-headline font-black text-2xl uppercase italic text-primary leading-tight group-hover:underline">Gigachad Meme Maker</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed flex-grow text-on-surface">Automatically insert your face onto the ultimate peak performance physique. No gym required.</p>
                <button className="mt-6 w-full bg-[#FFFF00] text-black font-headline font-black py-3 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase italic">TRY FREE -&gt;</button>
              </div>
            </Link>
            {/* Card 3 */}
            <Link href="/create/face-swap" className="bg-surface-container-lowest border-4 border-black flex flex-col brutal-shadow hover:-translate-y-2 transition-transform group cursor-pointer block">
              <div className="aspect-square border-b-4 border-black bg-surface-dim overflow-hidden relative">
                <img alt="Face Swap Preview" className="w-full h-full object-cover filter grayscale hue-rotate-90" data-alt="surreal digital face manipulation with kaleidoscopic patterns and vibrant experimental colors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw8QtVF4NC11XiPVZNCxu328N1xygUL2mmqRKfTnW-ivaAXcTsOAGhd62R_EunvgYMEiiRq-3ZCQqkTuQcwja5PH_zNJlfa84AujdLPuBktS3k4WhKA1HNwkQtsJjkbNuCJGiQhi2186jmcXIpkqkFbcK-WCO6dlnQxUc1FG4sPVA_5oLo_Rdzk7mjXvVUQLGeLs4ym1N7GEcqyim-03zQU0dXlSzHd4oqfc3_M1WUUx4yVkt5AArIb4dlY8jOl7U3484PFdYT1Yvj" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-headline font-black text-2xl uppercase italic text-primary leading-tight group-hover:underline">JD Vance Face Swap</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed flex-grow text-on-surface">Swap faces with political figures for maximum engagement and community guidelines violations.</p>
                <button className="mt-6 w-full bg-[#FFFF00] text-black font-headline font-black py-3 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase italic">TRY FREE -&gt;</button>
              </div>
            </Link>
          </section>

          {/* Bottom Banner */}
          <section className="bg-[#343dff] border-4 border-black p-6 md:p-8 brutal-shadow relative overflow-hidden flex flex-col text-center md:text-left">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2px)", backgroundSize: "20px 20px" }}></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
              <div>
                <h2 className="font-headline font-black text-3xl md:text-4xl text-[#FFFF00] uppercase italic tracking-tighter meme-stroke">UNLIMITED POWER</h2>
                <p className="text-white font-bold uppercase mt-2 text-sm md:text-base">JOIN 420,000+ MEMELORDS MAKING THE WEB WEIRD AGAIN.</p>
              </div>
              <button className="w-full lg:w-auto whitespace-nowrap bg-secondary text-white font-headline font-black text-xl md:text-2xl px-6 py-3 md:px-12 md:py-4 border-4 border-black brutal-shadow hover:skew-x-2 transition-all uppercase italic">jOiN tHe rEvoLuTiOn</button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
