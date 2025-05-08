import { Badge } from "@/components/ui/badge"

interface PostTagsProps {
  tags: string[]
}

export function PostTags({ tags }: PostTagsProps) {
  if (!tags.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text- px-3 py-1">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
