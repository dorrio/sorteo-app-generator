import { Skeleton } from "@/components/ui/skeleton"

export function ParticipantListSkeleton() {
    return (
        <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 flex-1 rounded-md" />
                </div>
            ))}
        </div>
    )
}

export function HistoryListSkeleton() {
    return (
        <div className="space-y-3 pt-2">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
        </div>
    )
}

export function AppSkeleton() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Header Skeleton */}
            <header className="border-b border-border/50 h-[73px] flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <Skeleton className="w-24 h-9 rounded-md" />
                    </div>
                </div>
            </header>

            {/* Main Content Skeleton */}
            <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
                <div className="grid lg:grid-cols-[1fr,400px] gap-8 h-full">
                    {/* Left Column (Sorteo Area) */}
                    <div className="space-y-8 flex flex-col items-center">
                        {/* Title */}
                        <div className="space-y-4 w-full flex flex-col items-center mt-8">
                            <Skeleton className="h-16 w-3/4 max-w-lg rounded-lg" />
                            <Skeleton className="h-6 w-1/2 max-w-xs rounded-lg" />
                            <Skeleton className="h-8 w-32 rounded-full mt-4" />
                        </div>

                        {/* Slot Machine Placeholder */}
                        <div className="w-full max-w-2xl h-[300px] bg-muted/20 rounded-xl animate-pulse flex items-center justify-center">
                            <Skeleton className="w-20 h-20 rounded-full" />
                        </div>

                        {/* Button Placeholder */}
                        <Skeleton className="h-16 w-64 rounded-2xl" />
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">
                        {/* Participants Card */}
                        <div className="h-[400px] border border-border rounded-2xl p-6 space-y-4">
                            <Skeleton className="h-7 w-40 rounded-md" />
                            <ParticipantListSkeleton />
                        </div>

                        {/* History Card */}
                        <div className="h-[200px] border border-border rounded-2xl p-6 space-y-4">
                            <Skeleton className="h-7 w-32 rounded-md" />
                            <HistoryListSkeleton />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export function SlotSkeleton() {
    return (
        <div className="w-full max-w-2xl h-[300px] rounded-2xl bg-muted/20 animate-pulse border-4 border-muted/20 flex items-center justify-center">
             <Skeleton className="w-32 h-16 rounded-lg" />
        </div>
    )
}

export function WheelSkeleton() {
    return (
         <div className="flex flex-col items-center w-full">
             <div className="w-[320px] h-[320px] rounded-full border-4 border-muted/20 bg-muted/10 animate-pulse flex items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-muted/30" />
             </div>
              <Skeleton className="w-24 h-4 mt-4" />
         </div>
    )
}

export function GridSkeleton() {
     return (
        <div className="w-full max-w-6xl mx-auto p-4">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {[...Array(10)].map((_, i) => (
                     <Skeleton key={i} className="h-20 rounded-xl" />
                 ))}
             </div>
        </div>
     )
}

export function CardsSkeleton() {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-64 h-80">
                <Skeleton className="absolute inset-0 rounded-2xl bg-muted/30 rotate-3" />
                <Skeleton className="absolute inset-0 rounded-2xl bg-muted/30 -rotate-3" />
                <Skeleton className="absolute inset-0 rounded-2xl bg-muted border-4 border-background" />
            </div>
             <Skeleton className="w-24 h-4 mt-8" />
        </div>
    )
}

export function BoxSkeleton() {
    return (
        <div className="w-full h-[350px] rounded-2xl border-2 border-muted/20 bg-muted/10 animate-pulse flex items-center justify-center">
             <Skeleton className="w-16 h-16 rounded-full opacity-20" />
        </div>
    )
}
