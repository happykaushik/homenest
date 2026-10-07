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
      <body className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
            <Link href="/" className="font-display text-xl font-semibold text-pine">HomeNest</Link>
            <div className="hidden gap-6 text-sm md:flex"><Link href="/properties?purpose=sale">Buy</Link><Link href="/properties?purpose=rent">Rent</Link><Link href="/sell-property">Sell</Link><Link href="/properties">Properties</Link></div>
            <AuthNav />
          </nav>
        </header>
        <div className="flex-1">{children}</div>
       <footer className="bg-ink text-white/70">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between">
      <Link href="/" className="font-display text-lg text-white">HomeNest</Link>
      <nav className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/properties?purpose=sale">Buy</Link>
        <Link href="/properties?purpose=rent">Rent</Link>
        <Link href="/sell-property">Sell</Link>
        <Link href="/properties">Properties</Link>
        <Link href="/favorites">Saved</Link>
      </nav>
      <p>© 2026 HomeNest. All rights reserved.</p>
    </div>
  </footer>
      </body>
    </html>
  );
}
