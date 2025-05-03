"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PostAuthor } from "./post-author"
import { PostMedia } from "./post-media"
import { PostTags } from "./post-tags"
import { SkillBadges } from "./skill-badges"
import { PostActions } from "./post-actions"
import type { Post } from "../../types/skill-swap"

interface SkillSwapPostProps {
  post: Post
  isLiked: boolean
  isReposted: boolean
  isSaved: boolean
  onLike: () => void
  onRepost: () => void
  onSave: () => void
}

export function SkillSwapPost({ post, isLiked, isReposted, isSaved, onLike, onRepost, onSave }: SkillSwapPostProps) {
  return (
    <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <PostAuthor author={post.author} timePosted={post.timePosted} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSave}>{isSaved ? "Unsave" : "Save"} post</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Hide</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
        <SkillBadges offering={post.offering} seeking={post.seeking} />
      </CardHeader>

      <CardContent className="pb-2">
        <CardDescription className="text-sm mb-3">{post.description}</CardDescription>
        <PostMedia image={post.image} video={post.video} />
        <PostTags tags={post.tags} />
      </CardContent>

      <Separator />

      <CardFooter className="py-2 px-6 flex justify-between">
        <PostActions
          likes={post.likes}
          comments={post.comments}
          reposts={post.reposts}
          isLiked={isLiked}
          isReposted={isReposted}
          onLike={onLike}
          onRepost={onRepost}
        />
      </CardFooter>
    </Card>
  )
}
