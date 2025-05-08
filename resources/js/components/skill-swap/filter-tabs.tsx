import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Sparkles, ArrowUpCircle, BookmarkPlus } from "lucide-react"
import type { ReactNode } from "react"

interface FilterTabsProps {
  hotContent: ReactNode
  newContent: ReactNode
  topContent: ReactNode
}

export function FilterTabs({ hotContent, newContent, topContent }: FilterTabsProps) {
  return (
    <Tabs defaultValue="hot" className="w-fit mb-6">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-background border rounded-lg">
          <TabsTrigger
            value="hot"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Hot
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Top
          </TabsTrigger>
        </TabsList>

        <Button variant="outline" className="gap-2">
          <BookmarkPlus className="w-4 h-4" />
          Saved Swaps
        </Button>
      </div>

      <TabsContent value="hot" className="mt-0">
        {hotContent}
      </TabsContent>

      <TabsContent value="new" className="mt-0">
        {newContent}
      </TabsContent>

      <TabsContent value="top" className="mt-0">
        {topContent}
      </TabsContent>
    </Tabs>
  )
}
