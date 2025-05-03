"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CheckCircle, MessageSquare, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MediaDisplay } from "./media-display"
import { TagList } from "./tag-list"
import { ExchangeBadges } from "./exchange-badges"
import type { Deal } from "@/types/skill-swap"

interface DealCardProps {
  deal: Deal
}

export function DealCard({ deal }: DealCardProps) {
  // Function to get status badge color
  const getStatusColor = (status: Deal["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={deal.partner.avatar || "/placeholder.svg"} alt={deal.partner.name} />
              <AvatarFallback>{deal.partner.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{deal.partner.name}</div>
              <div className="text-xs text-muted-foreground">{deal.partner.skill}</div>
            </div>
          </div>

          <Badge className={getStatusColor(deal.status)} variant="outline">
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          </Badge>
        </div>

        <CardTitle className="text-lg mt-2">{deal.title}</CardTitle>
        <ExchangeBadges offering={deal.offering} seeking={deal.seeking} />
      </CardHeader>

      <CardContent className="pb-2">
        <CardDescription className="text-sm mb-3">{deal.description}</CardDescription>
        <MediaDisplay image={deal.image} video={null} />

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Started: {formatDate(deal.startDate)}</span>
          </div>

          {deal.completionDate && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Completed: {formatDate(deal.completionDate)}</span>
            </div>
          )}
        </div>

        <TagList tags={deal.tags} />
      </CardContent>

      <CardFooter className="py-3 px-6 flex justify-between border-t">
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>Message Partner</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {deal.status === "active" && <DropdownMenuItem>Mark as Completed</DropdownMenuItem>}
            {deal.status === "pending" && <DropdownMenuItem>Cancel Deal</DropdownMenuItem>}
            {deal.status === "completed" && <DropdownMenuItem>Leave Feedback</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
