"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Trash2, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  getStoredFormData, 
  getStoredToken, 
  clearStoredData, 
  isDebugModeEnabled 
} from "@/lib/api/otp"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Only run on client and if debug mode is enabled
  useEffect(() => {
    setMounted(true)
    
    // Update data when pathname changes (page navigation)
    const updateData = () => {
      setFormData(getStoredFormData())
      setToken(getStoredToken())
    }
    
    updateData()
    
    // Listen for storage changes
    window.addEventListener('storage', updateData)
    return () => window.removeEventListener('storage', updateData)
  }, [pathname])

  if (!mounted || !isDebugModeEnabled()) return null

  const handleClearStorage = () => {
    clearStoredData()
    setFormData(null)
    setToken(null)
    router.refresh()
  }

  const getClassId = () => {
    const match = pathname.match(/\/class\/([^\/]+)/)
    return match ? match[1] : null
  }

  const classId = getClassId()

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="border-2 border-yellow-400 shadow-xl bg-yellow-50/95 backdrop-blur-sm">
        <CardHeader className="p-3 pb-0">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-yellow-600" />
              <CardTitle className="text-sm font-bold text-yellow-800">Debug Mode</CardTitle>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-yellow-600" />
            ) : (
              <ChevronUp className="h-4 w-4 text-yellow-600" />
            )}
          </div>
        </CardHeader>
        
        {isOpen && (
          <CardContent className="p-3 space-y-3 text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-yellow-800">Current Page:</p>
              <code className="block bg-white p-1 rounded border border-yellow-200 truncate">
                {pathname}
              </code>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-yellow-800">Stored Token:</p>
              <code className="block bg-white p-1 rounded border border-yellow-200 truncate" title={token || "None"}>
                {token ? `${token.substring(0, 20)}...` : "None"}
              </code>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-yellow-800">Form Data:</p>
              <pre className="block bg-white p-1 rounded border border-yellow-200 overflow-auto max-h-32">
                {formData ? JSON.stringify(formData, null, 2) : "None"}
              </pre>
            </div>

            <div className="pt-2 border-t border-yellow-200 flex flex-col gap-2">
              <div className="flex gap-2">
                {classId && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs flex-1 bg-white border-yellow-300 hover:bg-yellow-100"
                      onClick={() => router.push(`/class/${classId}/verify`)}
                    >
                      Go to Verify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs flex-1 bg-white border-yellow-300 hover:bg-yellow-100"
                      onClick={() => router.push(`/class/${classId}/success`)}
                    >
                      Go to Success
                    </Button>
                  </>
                )}
              </div>
              
              <Button 
                size="sm" 
                variant="destructive" 
                className="h-7 text-xs w-full"
                onClick={handleClearStorage}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Clear Storage
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}