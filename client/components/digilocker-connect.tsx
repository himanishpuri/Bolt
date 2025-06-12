"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lock, Loader2 } from "lucide-react"

interface DigilockerConnectProps {
  onSuccess: (data: DigilockerData) => void
  onError: (error: string) => void
  buttonText?: string
  className?: string
}

export interface DigilockerData {
  aadhaarNumber: string
  panNumber: string
  name: string
  verified: boolean
}

export function DigilockerConnect({
  onSuccess,
  onError,
  buttonText = "Connect to DigiLocker",
  className = "",
}: DigilockerConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)

    try {
      // Simulate DigiLocker connection
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate random Aadhaar and PAN numbers for demo
      const randomAadhaar = Array(12)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
        .join("")
      const randomPAN = `${Array(5)
        .fill(0)
        .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
        .join("")}${Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
        .join("")}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`

      // Set DigiLocker data
      const digilockerData: DigilockerData = {
        aadhaarNumber: randomAadhaar,
        panNumber: randomPAN,
        name: "Demo User", // This would come from DigiLocker in a real implementation
        verified: true,
      }

      onSuccess(digilockerData)
    } catch (err) {
      onError("Failed to connect to DigiLocker. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleConnect}
      disabled={isConnecting}
      className={`w-full bg-blue-600 hover:bg-blue-700 ${className}`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting to DigiLocker...
        </>
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  )
}
