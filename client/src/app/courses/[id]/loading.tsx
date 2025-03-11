export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="w-2/3 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-4/6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>

              <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-6" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>

              <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="w-1/2 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
              <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                    <div className="w-1/2 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}