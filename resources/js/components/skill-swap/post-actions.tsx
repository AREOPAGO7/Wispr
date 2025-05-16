"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle, MessageCircle, Repeat2, Handshake, Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { router } from "@inertiajs/react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { route } from "ziggy-js"

interface PostActionsProps {
  swap: {
    id: number;
    uid: string;
    // ... other swap properties
  };
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

export function PostActions({ swap, ...props }: PostActionsProps) {
  const [showDealDialog, setShowDealDialog] = useState(false)

  const handleMakeDeal = () => {
    router.post(route('deals.store', { swap: swap.uid }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setShowDealDialog(false)
      },
    })
  }

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 cursor-pointer ${props.isLiked ? "text-[#FF6F00] hover:text-[#FF6F00]" : ""}`} 
                onClick={props.onLike}
              >
                <ArrowUpCircle className="h-6 w-6" />
                <span>{props.likes}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Like</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 cursor-pointer ${props.isDisliked ?  "text-[#FF0000] hover:text-[#FF0000]" : ""}`} 
                onClick={props.onDislike}
              >
                <ArrowDownCircle className="h-6 w-6" />
                <span>{props.dislikes}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dislike</TooltipContent>
          </Tooltip>

          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 cursor-pointer"
            onClick={props.onCommentClick}
          >
            <MessageCircle className="h-6 w-6" />
            <span>{props.comments}</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 cursor-pointer ${props.isReposted ? "text-[#00FF00] hover:text-[#00FF00]" : ""}`} 
                onClick={props.onRepost}
              >
                <Repeat2 className="h-6 w-6" />
                <span>{props.reposts}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Repost</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
            onClick={() => setShowDealDialog(true)}
          >
            <Handshake className="h-6 w-6" />
            <span>Make Deal</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Share2 className="h-6 w-6" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Deal</DialogTitle>
            <DialogDescription>
              Are you sure you want to make a deal for this skill swap? This will notify the other user and start the deal process.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDealDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakeDeal}>
              Confirm Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
