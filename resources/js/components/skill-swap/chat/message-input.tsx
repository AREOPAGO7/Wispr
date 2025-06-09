import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, X } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface MessageInputProps {
  onSend: (content: string) => void
  onFileUpload: (file: File) => Promise<void>
}

export function MessageInput({ onSend, onFileUpload }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !previewUrl) || isUploading) return
    
    try {
      setIsUploading(true)
      if (previewUrl) {
        // If there's a preview, it means we're uploading a file
        await onFileUpload(fileInputRef.current?.files?.[0] as File)
        setPreviewUrl(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else if (message.trim()) {
        // Otherwise, send a text message
        onSend(message)
        setMessage("")
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB')
      return
    }

    // Check if it's an image or other file type
    const isImage = file.type.startsWith('image/')
    
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // For non-image files, upload immediately
      onFileUpload(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removePreview = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full bg-background">
      {previewUrl && (
        <div className="relative p-3 border-b border-border bg-muted/30">
          <div className="relative inline-block group">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 max-w-xs rounded-md object-cover shadow-sm"
            />
            <button
              type="button"
              onClick={removePreview}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground hover:bg-destructive/90 transition-colors"
              aria-label="Remove preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border">
        <div className="relative flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="pr-12 min-h-[40px]"
            disabled={isUploading}
          />
          <input
            type="file"
            ref={fileInputRef}
            id="file-upload"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <label 
              htmlFor="file-upload" 
              className={`cursor-pointer rounded-full p-2 transition-colors ${isUploading ? 'text-muted-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
              title={isUploading ? 'Uploading...' : 'Attach file'}
            >
              {isUploading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <>
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </>
              )}
            </label>
          </div>
        </div>
        <Button 
          type="submit" 
          size="icon" 
          disabled={(!message.trim() && !previewUrl) || isUploading}
          className="h-10 w-10"
        >
          {isUploading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  )
} 