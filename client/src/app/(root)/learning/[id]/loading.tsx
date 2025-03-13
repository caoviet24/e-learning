export default function Loading() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <div className="w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Player Section Loading */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="aspect-video mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="w-2/3 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Lesson List Section Loading */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-slate-900"
                >
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}