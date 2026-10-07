import "./globals.css";
import Link from "next/link";
import AuthNav from "@/components/AuthNav";
import { Fraunces, DM_Sans } from "next/font/google";
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
export const metadata = { title: "HomeNest — Property in Gujarat", description: "Buy, rent and sell homes, plots and commercial space across Gujarat." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dm.variable}`}>
      <body>
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
            <Link href="/" className="font-display text-xl font-semibold text-pine">HomeNest</Link>
            <div className="hidden gap-6 text-sm md:flex"><Link href="/properties?purpose=sale">Buy</Link><Link href="/properties?purpose=rent">Rent</Link><Link href="/sell-property">Sell</Link><Link href="/properties">Properties</Link></div>
            <AuthNav />
          </nav>
        </header>
        {children}
        <footer className="bg-ink px-5 py-10 text-sm text-white/70"><div className="mx-auto max-w-7xl">© 2026 HomeNest · Gandhinagar, Gujarat</div></footer>
      </body>
    </html>
  );
}
