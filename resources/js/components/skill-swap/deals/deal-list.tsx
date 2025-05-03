import { DealCard } from "./deal-card"
import type { Deal } from "@/types/skill-swap"

interface DealListProps {
  deals: Deal[]
}

export function DealList({ deals }: DealListProps) {
  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  )
}
