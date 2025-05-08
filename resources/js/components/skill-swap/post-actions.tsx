"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle, MessageCircle, Repeat2, Handshake, Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { router } from "@inertiajs/react"

interface PostActionsProps {
  likes: number
  dislikes: number
  comments: number
  reposts: number
  isLiked: boolean
  isDisliked: boolean
  isReposted: boolean
  onLike: () => void
  onDislike: () => void
  onRepost: () => void
  onCommentClick: () => void
}

export function PostActions({ 
  likes, 
  dislikes, 
  comments, 
  reposts, 
  isLiked, 
  isDisliked, 
  isReposted, 
  onLike, 
  onDislike, 
  onRepost,
  onCommentClick 
}: PostActionsProps) {
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 cursor-pointer ${isLiked ? "  bg-orange-400 hover:bg-orange-400" : ""}`} 
              onClick={onLike}
            >
              <ArrowUpCircle className="h-6 w-6" />
              <span>{likes}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Like</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 cursor-pointer ${isDisliked ?  "  bg-red-500 hover:bg-red-600" : ""}`} 
              onClick={onDislike}
            >
              <ArrowDownCircle className="h-6 w-6" />
              <span>{dislikes}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Dislike</TooltipContent>
        </Tooltip>

        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 cursor-pointer"
          onClick={onCommentClick}
        >
          <MessageCircle className="h-6 w-6" />
          <span>{comments}</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 cursor-pointer ${isReposted ? "  bg-green-500 hover:bg-green-600" : ""}`} 
          onClick={onRepost}
        >
          <Repeat2 className="h-6 w-6" />
          <span>{reposts}</span>
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
