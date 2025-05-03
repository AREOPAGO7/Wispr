import { Badge } from "@/components/ui/badge"

interface PostTagsProps {
  tags: string[]
}

export function PostTags({ tags }: PostTagsProps) {
  if (!tags.length) return null

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
