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
        dislikes_count: number;
        reposts_count: number;
        saves_count: number;
        isLiked: boolean;
        isDisliked: boolean;
        isReposted: boolean;
        isSaved: boolean;
        comments: Array<{
            id: number;
            content: string;
            created_at: string;
            user: {
                id: number;
                name: string;
                avatar: string | null;
            };
        }>;
    }>;
    onLike: (id: number) => void;
    onDislike: (id: number) => void;
    onRepost: (id: number) => void;
    onSave: (id: number) => void;
}

export function PostList({ posts, onLike, onDislike, onRepost, onSave }: PostListProps) {
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard
                key={post.id}
                id={post.id}
                uid={post.uid}
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
                dislikes={post.dislikes_count}
                reposts={post.reposts_count}
                saves={post.saves_count}
                timePosted={post.created_at}
                isLiked={post.isLiked}
                isDisliked={post.isDisliked}
                isReposted={post.isReposted}
                isSaved={post.isSaved}
                onLike={() => onLike(post.id)}
                onDislike={() => onDislike(post.id)}
                onRepost={() => onRepost(post.id)}
                onSave={() => onSave(post.id)} 
                comments={post.comments} 
                />
            ))}
        </div>
    )
}
