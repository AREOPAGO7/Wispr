"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpCircle, MessageCircle, Repeat2, Handshake, Share2 } from "lucide-react"
import { router } from "@inertiajs/react"

interface PostActionsProps {
  likes: number
  comments: number
  reposts: number
  isLiked: boolean
  isReposted: boolean
  onLike: () => void
  onRepost: () => void
  onCommentClick: () => void
}

export function PostActions({ 
  likes, 
  comments, 
  reposts, 
  isLiked, 
  isReposted, 
  onLike, 
  onRepost,
  onCommentClick 
}: PostActionsProps) {
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${isLiked ? "text-primary" : ""}`} 
          onClick={onLike}
        >
          <ArrowUpCircle className="h-6 w-6" />
          <span>{isLiked ? likes + 1 : likes}</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={onCommentClick}
        >
          <MessageCircle className="h-6 w-6" />
          <span>{comments}</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${isReposted ? "text-primary" : ""}`} 
          onClick={onRepost}
        >
          <Repeat2 className="h-6 w-6" />
          <span>{isReposted ? reposts + 1 : reposts}</span>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary">
          <Handshake className="h-6 w-6" />
          <span>Make Deal</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Share2 className="h-6 w-6" />
          <span className="sr-only">Share</span>
        </Button>
      </div>
    </div>
  )
}
