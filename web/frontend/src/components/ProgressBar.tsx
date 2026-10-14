"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return <Progress value={progress} className="w-[60%]" />
}
