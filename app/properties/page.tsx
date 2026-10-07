import { Suspense } from "react";
import Listing from "@/components/Listing";
export const metadata = { title: "Properties — HomeNest" };
export default function Page() { return <Suspense><Listing /></Suspense>; }
