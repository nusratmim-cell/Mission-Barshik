"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
}

export function OTPInput({
  value,
  onChange,
  length = 4,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (isNaN(Number(newValue))) return

    const newOtp = value.split("")
    newOtp[index] = newValue.substring(newValue.length - 1)
    const combinedOtp = newOtp.join("")
    onChange(combinedOtp)

    // Move to next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    onChange(pastedData)
    
    // Focus the last filled input or the next empty one
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="flex gap-4 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-xl font-bold rounded-[8px] border border-shikho-border bg-white focus:outline-none focus:ring-2 focus:ring-shikho-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-baloo transition-all",
            value[index] ? "border-shikho-primary bg-shikho-cta-light/20" : ""
          )}
        />
      ))}
    </div>
  )
}