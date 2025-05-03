import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { FilterTabs } from "./components/skill-swap/filter-tabs"
import { PostList } from "./components/skill-swap/post-list"
import { mockPosts } from "./data/mock-posts"

export default function SkillSwapHome() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [repostedPosts, setRepostedPosts] = useState<number[]>([])
  const [savedPosts, setSavedPosts] = useState<number[]>([])

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  const handleRepost = (postId: number) => {
    if (repostedPosts.includes(postId)) {
      setRepostedPosts(repostedPosts.filter((id) => id !== postId))
    } else {
      setRepostedPosts([...repostedPosts, postId])
    }
  }

  const handleSave = (postId: number) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter((id) => id !== postId))
    } else {
      setSavedPosts([...savedPosts, postId])
    }
  }

  // Sort posts for different tabs
  const hotPosts = [...mockPosts]
  const newPosts = [...mockPosts].sort((a, b) => a.id - b.id)
  const topPosts = [...mockPosts].sort((a, b) => b.likes - a.likes)

  return (
    <ThemeProvider defaultTheme="light" storageKey="skill-swap-theme">
      <div className="w-full max-w-4xl mx-auto p-4">
        <FilterTabs
          hotContent={
            <PostList
              posts={hotPosts}
              likedPosts={likedPosts}
              repostedPosts={repostedPosts}
              savedPosts={savedPosts}
              onLike={handleLike}
              onRepost={handleRepost}
              onSave={handleSave}
            />
          }
          newContent={
            <PostList
              posts={newPosts}
              likedPosts={likedPosts}
              repostedPosts={repostedPosts}
              savedPosts={savedPosts}
              onLike={handleLike}
              onRepost={handleRepost}
              onSave={handleSave}
            />
          }
          topContent={
            <PostList
              posts={topPosts}
              likedPosts={likedPosts}
              repostedPosts={repostedPosts}
              savedPosts={savedPosts}
              onLike={handleLike}
              onRepost={handleRepost}
              onSave={handleSave}
            />
          }
        />
      </div>
    </ThemeProvider>
  )
}
