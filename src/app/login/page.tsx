import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex-grow pt-24 pb-8 md:pt-32 md:pb-12 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-container to-surface min-h-[calc(100vh-4rem)]">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(#343dff 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.1 }}
      ></div>
      
      <div className="w-[calc(100%-2rem)] max-w-md mx-auto bg-surface-dim border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10 flex flex-col">
        {/* Title Bar */}
        <div className="bg-primary px-3 md:px-4 py-2 border-b-4 border-black flex justify-between items-center">
          <span className="font-headline font-black text-white text-sm md:text-xl tracking-wide uppercase">LOGIN.EXE</span>
          <div className="flex space-x-1 md:space-x-2">
            <Link href="/" className="w-5 h-5 md:w-6 md:h-6 bg-secondary border-2 border-black flex items-center justify-center text-white text-xs font-bold shrink-0 cursor-pointer hover:bg-[#FFFF00] hover:text-black hover:-translate-y-0.5 transition-transform active:translate-y-0.5">X</Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 flex flex-col space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-headline font-black text-4xl text-primary uppercase italic drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] meme-stroke tracking-tighter">WEIRDOS ONLY</h1>
            <p className="font-label text-sm font-bold uppercase text-on-surface">Enter your credentials to access the vault</p>
          </div>

          <form className="flex flex-col space-y-4">
            <div className="space-y-1">
              <label className="font-headline font-black uppercase text-sm">USERNAME OR EMAIL</label>
              <input type="text" className="w-full bg-white border-4 border-black p-3 font-label font-bold text-black focus:outline-none focus:ring-0 focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform focus:translate-y-1 focus:translate-x-1 focus:shadow-none" placeholder="ILoveMemes69" required />
            </div>
            
            <div className="space-y-1 flex flex-col">
              <div className="flex justify-between items-end">
                <label className="font-headline font-black uppercase text-sm">PASSWORD</label>
                <a href="#" className="font-label text-[10px] uppercase font-bold text-primary hover:underline">Forgot?</a>
              </div>
              <input type="password" className="w-full bg-white border-4 border-black p-3 font-label font-bold text-black focus:outline-none focus:ring-0 focus:border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform focus:translate-y-1 focus:translate-x-1 focus:shadow-none" placeholder="••••••••" required />
            </div>

            <button type="submit" className="mt-4 w-full bg-tertiary text-white font-headline font-black text-2xl px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase italic tracking-tighter cursor-pointer">
              LOG IN
            </button>
            
            <div className="flex items-center gap-4 py-2">
               <div className="flex-1 border-t-4 border-black border-dashed"></div>
               <span className="font-headline font-black text-sm uppercase">OR</span>
               <div className="flex-1 border-t-4 border-black border-dashed"></div>
            </div>

            <button type="button" className="w-full bg-white text-black font-headline font-black text-xl px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-surface-container-high hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase italic tracking-tighter flex items-center justify-center gap-3 cursor-pointer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              CONTINUE WITH GOOGLE
            </button>
          </form>

          <div className="pt-4 border-t-4 border-black text-center border-dashed">
            <p className="font-label text-xs font-bold uppercase mb-2">DON'T HAVE AN ACCOUNT?</p>
            <Link href="/signup" className="text-secondary font-black uppercase hover:underline decoration-4 underline-offset-2">JOIN THE RESISTANCE</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
