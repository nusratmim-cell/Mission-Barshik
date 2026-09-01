"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Sparkles, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Confetti } from "@/components/ui/confetti"
import { getClassConfig, getDriveUrl } from "@/lib/config/classes"
import { clearStoredData, getStoredFormData } from "@/lib/api/otp"

interface SuccessScreenProps {
  classId: string
  /** Selected group, for classes where hasGroup is true. */
  group?: string
}

export function SuccessScreen({ classId, group }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)
  // Falls back to the stored form data when the query string has no group,
  // so a direct hit on this URL still resolves the right folder.
  const [resolvedGroup, setResolvedGroup] = useState<string | undefined>(group)
  const classConfig = getClassConfig(classId)

  useEffect(() => {
    if (!group) {
      const stored = getStoredFormData()
      if (stored?.group) setResolvedGroup(stored.group)
    }
    // Clear stored data on mount as the flow is complete
    clearStoredData()
  }, [group])

  const driveUrl = getDriveUrl(classId, resolvedGroup)

  if (!classConfig) {
    return <div>Invalid Class ID</div>
  }

  const handleCopy = async () => {
    try {
      if (!driveUrl) return
      await navigator.clipboard.writeText(driveUrl)
      setCopied(true)
      setShowToast(true)
      setTimeout(() => {
        setCopied(false)
        setShowToast(false)
      }, 2500)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleOpenDrive = () => {
    if (!driveUrl) return
    window.open(driveUrl, '_blank')
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Confetti />
      
      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span className="font-medium text-sm font-hind">লিংক কপি হয়েছে! ✨</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2 
        }}
      >
        <Card className="border-shikho-border shadow-card overflow-hidden relative">
          {/* Gradient decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-shikho-primary via-shikho-cta to-shikho-primary animate-gradient-x" />
          
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold text-shikho-cta font-baloo mb-2">
                🎉 তোমার রিসোর্স রেডি
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-shikho-primary to-shikho-cta rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
              <div className="relative bg-white border-2 border-dashed border-shikho-primary/30 rounded-xl p-6 text-center">
                <p className="text-sm text-shikho-muted mb-2 font-medium font-hind">তোমার রিসোর্স</p>
                <h2 className="text-xl font-bold text-shikho-primary font-baloo mb-4">
                  {classConfig.resourceTitleBn}
                </h2>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    className="w-full bg-shikho-primary hover:bg-shikho-primary-hover text-white h-12 text-lg rounded-[8px] shadow-lg hover:shadow-xl transition-all duration-300 font-baloo"
                    onClick={handleOpenDrive}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    ড্রাইভ ওপেন করো
                  </Button>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}