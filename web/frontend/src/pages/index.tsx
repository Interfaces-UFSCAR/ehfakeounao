import React from "react";
import { FormsAuth } from "@/components/FormsAuth";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function HomePage() {
  return (
    <div>
      <FormsAuth />
      <SpeedInsights />
    </div>
  )
}
