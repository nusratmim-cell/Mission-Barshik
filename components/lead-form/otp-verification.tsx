"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { motion } from "framer-motion"
import { OTPInput } from "@/components/lead-form/otp-input"

import { otpSchema, type OtpInput } from "@/lib/validations/lead-form"
import { 
  verifyOTP, 
  sendOTP, 
  getStoredFormData, 
  getStoredToken, 
  maskPhoneNumber,
  clearStoredData
} from "@/lib/api/otp"

interface OTPVerificationProps {
  classId: string
}

export function OTPVerification({ classId }: OTPVerificationProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Load stored data on mount
  useEffect(() => {
    const storedData = getStoredFormData()
    const storedToken = getStoredToken()

    if (!storedData || !storedToken) {
      // Redirect back to form if no data found
      router.push(`/class/${classId}`)
      return
    }

    setFormData(storedData)
    setToken(storedToken)
  }, [classId, router])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  async function onSubmit(data: OtpInput) {
    if (!token || !formData) return

    setIsLoading(true)
    setApiError(null)

    try {
      const response = await verifyOTP(token, data.otp, {
        class: formData.classId,
        name: formData.name,
        group: formData.group,
        phone: formData.phone, // Added for CRM processing
      })

      if (response.success) {
        // Clear stored data (except what we might need for success page if any)
        // Actually, we should keep it until success page loads or clear it there
        // For now, let's clear it on the success page
        
        // Redirect to success page, carrying the group so the success screen
        // can link straight to that group's Drive subfolder.
        const successUrl = formData.group
          ? `/class/${classId}/success?group=${encodeURIComponent(formData.group)}`
          : `/class/${classId}/success`
        router.push(successUrl)
      } else {
        setApiError(response.error || "ওটিপি সঠিক নয়। আবার চেষ্টা করুন।")
      }
    } catch (error) {
      setApiError("একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendOTP() {
    if (!formData || countdown > 0) return

    setIsResending(true)
    setApiError(null)

    try {
      const response = await sendOTP(formData.phone)

      if (response.success) {
        setCountdown(60) // 60 seconds cooldown
        // Update token if a new one is returned (though usually same flow)
        // In a real app, we might need to update the stored token
      } else {
        setApiError(response.error || "ওটিপি পুনরায় পাঠাতে সমস্যা হয়েছে।")
      }
    } catch (error) {
      setApiError("নেটওয়ার্ক সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।")
    } finally {
      setIsResending(false)
    }
  }

  if (!formData) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-shikho-primary" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto border-shikho-border shadow-card">
        <CardHeader>
          <Button
            variant="ghost"
            className="w-fit p-0 h-auto mb-2 text-shikho-muted hover:text-shikho-primary hover:bg-transparent"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            পেছনে যাও
          </Button>
          <CardTitle className="text-xl font-bold text-center text-shikho-heading font-baloo">
            ওটিপি ভেরিফিকেশন
          </CardTitle>
          <p className="text-center text-shikho-muted text-sm mt-2 font-hind">
            আমরা তোমার <span className="font-bold">{maskPhoneNumber(formData.phone)}</span> নম্বরে একটি ৪ সংখ্যার কোড পাঠিয়েছি
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <OTPInput
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {apiError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 font-hind text-center"
                >
                  {apiError}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  variant="cta"
                  className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      যাচাই করা হচ্ছে...
                    </>
                  ) : (
                    "যাচাই করো"
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-sm text-shikho-muted font-hind mb-2">
                  কোড পাননি?
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="text-shikho-primary p-0 h-auto font-hind"
                  onClick={handleResendOTP}
                  disabled={isResending || countdown > 0}
                >
                  {isResending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : countdown > 0 ? (
                    `পুনরায় পাঠাও (${countdown}s)`
                  ) : (
                    "পুনরায় পাঠাও"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}