import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send } from "lucide-react"
import { useState } from "react"

interface MessageInputProps {
  onSend: (content: string) => void
  onFileUpload: (file: File) => void
}

export function MessageInput({ onSend, onFileUpload }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button type="button" variant="ghost" size="icon">
          <Paperclip className="h-4 w-4" />
        </Button>
      </label>
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
} 