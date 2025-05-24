"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [hasCopied])

  const copyToClipboard = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setHasCopied(true)
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      })
    }
  }, [text, toast])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={copyToClipboard}
    >
      {hasCopied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">Copy message</span>
    </Button>
  )
} 