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

export function WheelSkeleton() {
    return (
        <div className="relative flex flex-col items-center">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div
                    className="w-0 h-0 relative"
                    style={{
                        borderLeft: "20px solid transparent",
                        borderRight: "20px solid transparent",
                        borderTop: "35px solid hsl(var(--primary))",
                    }}
                />
            </div>

            {/* Wheel */}
            <Skeleton className="w-[320px] h-[320px] rounded-full border-4 mt-2" />

            {/* Count */}
            <Skeleton className="h-4 w-24 mt-4" />
        </div>
    )
}

export function SlotSkeleton() {
    return (
        <div className="relative">
             <div className="relative overflow-hidden rounded-2xl border-4 bg-card/50">
                 <div className="h-[300px] flex items-center justify-center px-8 py-16">
                     <Skeleton className="h-16 w-3/4 max-w-sm rounded-lg" />
                 </div>
                 {/* Center line */}
                 <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-24 border-y-2 opacity-50 pointer-events-none" />
             </div>
             <Skeleton className="h-6 w-32 mx-auto mt-6" />
        </div>
    )
}

export function GridSkeleton() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {Array.from({ length: 10 }).map((_, i) => (
                     <Skeleton key={i} className="h-20 rounded-xl" />
                 ))}
             </div>
        </div>
    )
}

export function CardsSkeleton() {
    return (
        <div className="relative flex flex-col items-center">
            <div className="relative w-64 h-80">
                 {/* Stack effect */}
                 <div className="absolute inset-0 rounded-2xl border-2 transform translate-x-4 translate-y-4 rotate-2 opacity-30 bg-primary/10 border-primary/40" />
                 <div className="absolute inset-0 rounded-2xl border-2 transform translate-x-2 translate-y-2 rotate-1 opacity-50 bg-primary/10 border-primary/40" />

                 {/* Main Card */}
                 <div className="absolute inset-0 rounded-2xl border-4 flex items-center justify-center p-6 bg-card">
                     <Skeleton className="h-8 w-3/4" />
                 </div>
            </div>
            <Skeleton className="h-6 w-32 mt-8" />
        </div>
    )
}

export function BoxSkeleton() {
    return (
        <div className="relative">
             <Skeleton className="h-[350px] w-full rounded-2xl border-2" />
             <Skeleton className="h-6 w-32 mx-auto mt-6" />
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

                        {/* Visualization Placeholder */}
                        <div className="w-full max-w-2xl h-[300px] flex items-center justify-center">
                           <SlotSkeleton />
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
