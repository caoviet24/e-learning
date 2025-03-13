import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClassDetailLoading() {
    return (
        <div className="container py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main content loading skeleton */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-9" />
                                <Skeleton className="h-9 w-9" />
                                <Skeleton className="h-9 w-9" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((n) => (
                                    <Skeleton key={n} className="aspect-video rounded-lg" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chat sidebar loading skeleton */}
                <Card className="h-[calc(100vh-6rem)]">
                    <CardHeader>
                        <Skeleton className="h-6 w-16" />
                    </CardHeader>
                    <CardContent className="flex flex-col h-full">
                        <div className="flex-1 space-y-4 mb-4">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
