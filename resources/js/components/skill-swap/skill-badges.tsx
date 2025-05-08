import { Badge } from "@/components/ui/badge"

interface SkillBadgesProps {
  offering: string
  seeking: string
}

export function SkillBadges({ offering, seeking }: SkillBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 py-1">
        Offering: {offering}
      </Badge>
      <Badge variant="outline" className="bg-secondary/10 hover:bg-secondary/20 py-1">
        Seeking: {seeking}
      </Badge>
    </div>
  )
}
