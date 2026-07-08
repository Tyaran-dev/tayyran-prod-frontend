export default function BlogLoading() {
  return (
    <div className="bg-blog-bg min-h-screen pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-b-[40px] mb-12" />

      {/* Tabs Skeleton */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex gap-4 justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Featured Post Skeleton */}
      <div className="container mx-auto px-4 mb-16">
        <div className="w-full h-[450px] md:h-[500px] bg-gray-200 rounded-[20px]" />
      </div>

      {/* Grid Skeleton */}
      <div className="container mx-auto px-4 mb-16">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 h-full flex flex-col">
              <div className="h-56 bg-gray-200 w-full shrink-0" />
              <div className="p-6 flex flex-col grow">
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded-md w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-6" />
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                  <div className="h-10 w-24 bg-gray-200 rounded-full" />
                  <div className="h-8 w-16 bg-gray-200 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
