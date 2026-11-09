import Link from "next/link";
import { Activity, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-blue-700 text-white"><Activity size={21} /></span>
            <span className="text-xl font-bold tracking-tight text-slate-950">care<span className="text-blue-700">point</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">A thoughtful approach to everyday healthcare. Clear information, convenient access and care centered around people.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Explore</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-500">
            <Link href="/departments" className="hover:text-blue-700">Departments</Link>
            <Link href="/doctors" className="hover:text-blue-700">Our doctors</Link>
            <Link href="/about" className="hover:text-blue-700">About CarePoint</Link>
            <Link href="/faq" className="hover:text-blue-700">FAQs</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Get in touch</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-500">
            <Link href="/contact" className="inline-flex items-center gap-2 hover:text-blue-700">Contact us <ArrowUpRight size={14} /></Link>
            <Link href="/privacy" className="hover:text-blue-700">Privacy policy</Link>
            <Link href="/terms" className="hover:text-blue-700">Terms and conditions</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5">
        <p className="mx-auto max-w-7xl px-5 text-xs leading-5 text-slate-400 sm:px-8">© {new Date().getFullYear()} CarePoint. Portfolio demonstration only. Not a real healthcare provider; no clinical services or real appointments are offered.</p>
      </div>
    </footer>
  );
}
