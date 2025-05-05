import { PostCard } from "./post-card"

interface PostListProps {
    posts: Array<{
        id: number;
        uid: string;
        title: string;
        description: string;
        offering: string;
        seeking: string;
        image: string | null;
        video: string | null;
        status: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            avatar: string | null;
        };
        tags: Array<{
            id: number;
            name: string;
        }>;
        likes_count: number;
        reposts_count: number;
        saves_count: number;
        interactions: Array<{
            liked: boolean;
            reposted: boolean;
            saved: boolean;
        }>;
    }>;
    likedPosts: number[];
    repostedPosts: number[];
    savedPosts: number[];
    onLike: (id: number) => void;
    onRepost: (id: number) => void;
    onSave: (id: number) => void;
}

export function PostList({ posts, likedPosts, repostedPosts, savedPosts, onLike, onRepost, onSave }: PostListProps) {
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                offering={post.offering}
                seeking={post.seeking}
                image={post.image}
                video={post.video}
                author={{
                  name: post.user.name,
                  avatar: post.user.avatar
                }}
                tags={post.tags.map(tag => tag.name)}
                likes={post.likes_count}
                reposts={post.reposts_count}
                saves={post.saves_count}
                timePosted={post.created_at}
                isLiked={likedPosts.includes(post.id)}
                isReposted={repostedPosts.includes(post.id)}
                isSaved={savedPosts.includes(post.id)}
                onLike={() => onLike(post.id)}
                onRepost={() => onRepost(post.id)}
                onSave={() => onSave(post.id)} comments={[]}                />
            ))}
        </div>
    )
}
