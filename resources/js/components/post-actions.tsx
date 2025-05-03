"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpCircle, MessageCircle, Repeat2, Handshake, Share2 } from "lucide-react"

interface PostActionsProps {
  likes: number
  comments: number
  reposts: number
  isLiked: boolean
  isReposted: boolean
  onLike: () => void
  onRepost: () => void
}

export function PostActions({ likes, comments, reposts, isLiked, isReposted, onLike, onRepost }: PostActionsProps) {
  return (
    <>
      <Button variant="ghost" size="sm" className={`gap-2 ${isLiked ? "text-primary" : ""}`} onClick={onLike}>
        <ArrowUpCircle className="h-4 w-4" />
        <span>{isLiked ? likes + 1 : likes}</span>
      </Button>

      <Button variant="ghost" size="sm" className="gap-2">
        <MessageCircle className="h-4 w-4" />
        <span>{comments}</span>
      </Button>

      <Button variant="ghost" size="sm" className={`gap-2 ${isReposted ? "text-primary" : ""}`} onClick={onRepost}>
        <Repeat2 className="h-4 w-4" />
        <span>{isReposted ? reposts + 1 : reposts}</span>
      </Button>

      <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary">
        <Handshake className="h-4 w-4" />
        <span>Make Deal</span>
      </Button>

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Share2 className="h-4 w-4" />
        <span className="sr-only">Share</span>
      </Button>
    </>
  )
}
