import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DealList } from "../components/skill-swap/deals/deal-list"
import { completedDeals, createdDeals } from "../data/mock-deals"
import { Handshake, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
    {
        title: 'Deals',
        href: '/deals',
    },
];

export default function Deals() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Deals" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-5xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">My Deals</h1>
              <Button className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Create New Deal
              </Button>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-background border rounded-lg mb-6">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Active & Pending
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Handshake className="w-5 h-5" />
                    Deals I've Created
                  </h2>
                  <DealList deals={createdDeals.filter((deal) => deal.status === "active" || deal.status === "pending")} />
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Handshake className="w-5 h-5" />
                    Completed Deals
                  </h2>
                  <DealList deals={completedDeals} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
