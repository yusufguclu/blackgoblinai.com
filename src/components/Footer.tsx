export default function Footer() {
  return (
    <footer className="bg-[#026e00] dark:bg-[#026e00] w-full py-8 px-4 flex flex-col md:flex-row items-center justify-around gap-4 border-t-4 border-black mt-12">
      <div className="text-lg font-black text-white font-headline uppercase italic text-center">MEMELORD INDUSTRIES</div>
      <div className="font-['Lexend'] text-xs md:text-sm font-bold uppercase text-white text-center">©1996 MEMELORD INDUSTRIES - BEST VIEWED IN NETSCAPE 4.0</div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-['Lexend'] text-xs md:text-sm font-bold uppercase">
        <a className="text-white hover:skew-x-2 hover:text-[#c00100]" href="#">AbOuT</a>
        <a className="text-white hover:skew-x-2 hover:text-[#c00100]" href="#">pRiVaCy</a>
        <span className="text-[#FFFF00]">vIsItOr cOuNtEr: 00042069</span>
      </div>
    </footer>
  );
}
