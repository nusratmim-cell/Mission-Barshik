"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

import { leadFormSchema, type LeadFormInput } from "@/lib/validations/lead-form"
import { getClassConfig, GROUP_OPTIONS } from "@/lib/config/classes"
import { sendOTP, storeFormData } from "@/lib/api/otp"

interface LeadFormProps {
  classId: string
}

export function LeadForm({ classId }: LeadFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const classConfig = getClassConfig(classId)

  const form = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      classId: classId as any,
      group: undefined,
    },
    mode: "onChange",
  })

  async function onSubmit(data: LeadFormInput) {
    setIsLoading(true)
    setApiError(null)

    try {
      const response = await sendOTP(data.phone)

      if (response.success && response.token) {
        // Store data for next step
        storeFormData(response.token, {
          name: data.name,
          phone: data.phone,
          classId: data.classId,
          group: data.group,
        })

        // Redirect to verification page
        router.push(`/class/${classId}/verify`)
      } else {
        setApiError(response.error || "ওটিপি পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
      }
    } catch (error) {
      setApiError("একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  if (!classConfig) {
    return <div>Invalid Class ID</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto border-shikho-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-shikho-heading font-baloo">
            ক্লাস রিসোর্স পেতে তোমার কিছু তথ্য দাও
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-shikho-dark font-medium">নাম</FormLabel>
                      <FormControl>
                        <Input placeholder="তোমার নাম লিখো" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-shikho-dark font-medium">ফোন নম্বর</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <FormLabel className="text-shikho-dark font-medium">ক্লাস</FormLabel>
                <div className="flex h-12 w-full items-center rounded-[8px] border border-shikho-border bg-gray-50 px-3 text-base text-shikho-dark font-hind">
                  {classConfig.labelBn}
                </div>
              </motion.div>

              {classConfig.hasGroup && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-shikho-dark font-medium">গ্রুপ</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GROUP_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {apiError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 font-hind"
                >
                  {apiError}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                      অপেক্ষা করুন...
                    </>
                  ) : (
                    "পরবর্তী ধাপ"
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