import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = false;

import FID from "@/components/banners/FID";

export default function DevelopmentPage() {
  if(process.env.STATE === "development"){
    <FID/>
  }
}
