import { SkillSwapPost } from "./post"
import type { Post } from "@/types/skill-swap"

interface PostListProps {
  posts: Post[]
  likedPosts: number[]
  repostedPosts: number[]
  savedPosts: number[]
  onLike: (postId: number) => void
  onRepost: (postId: number) => void
  onSave: (postId: number) => void
}

export function PostList({ posts, likedPosts, repostedPosts, savedPosts, onLike, onRepost, onSave }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <SkillSwapPost
          key={post.id}
          post={post}
          isLiked={likedPosts.includes(post.id)}
          isReposted={repostedPosts.includes(post.id)}
          isSaved={savedPosts.includes(post.id)}
          onLike={() => onLike(post.id)}
          onRepost={() => onRepost(post.id)}
          onSave={() => onSave(post.id)}
        />
      ))}
    </div>
  )
}
