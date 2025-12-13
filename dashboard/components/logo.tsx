"use client"

import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className = "w-16 h-16", width = 64, height = 64 }: LogoProps) {
  const [basePath, setBasePath] = useState("")

  useEffect(() => {
    // Get basePath from window location in production
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      if (path.startsWith("/StablePay-MerchantDashboard")) {
        setBasePath("/StablePay-MerchantDashboard")
      }
    }
  }, [])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/StablePay.svg`}
      alt="StablePay Logo"
      width={width}
      height={height}
      className={`${className} object-contain`}
    />
  )
}
