"use client"

import Image from "next/image"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className = "w-16 h-16", width = 64, height = 64 }: LogoProps) {
  return (
    <Image
      src="/StablePay.svg"
      alt="StablePay Logo"
      width={width}
      height={height}
      className={`${className} object-contain`}
      priority
    />
  )
}
