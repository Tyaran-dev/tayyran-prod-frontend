export default function ArticleLoading() {
  return (
    <div className="bg-blog-bg min-h-screen pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-[60vh] min-h-[400px] max-h-[600px] bg-gray-200 rounded-b-[40px] mb-12 relative overflow-hidden">
        <div className="absolute bottom-12 left-0 right-0">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="h-4 w-32 bg-white/30 rounded mb-6"></div>
            <div className="h-6 w-24 bg-white/30 rounded-full mb-6"></div>
            <div className="h-12 md:h-16 w-3/4 bg-white/30 rounded-lg mb-8"></div>
            <div className="h-10 w-full max-w-md bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Content Skeleton */}
          <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
            <div className="h-8 w-1/2 bg-gray-200 rounded-md mb-8"></div>
            
            <div className="space-y-4 mb-10">
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded-md"></div>
            </div>

            <div className="h-64 w-full bg-gray-200 rounded-xl mb-10"></div>

            <div className="h-6 w-1/3 bg-gray-200 rounded-md mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div className="h-[300px] w-full bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-6 w-1/2 bg-gray-200 rounded-md mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
              </div>
            </div>
            
            <div className="h-[400px] w-full bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-6 w-1/2 bg-gray-200 rounded-md mb-6"></div>
              <div className="flex gap-4 mb-4">
                <div className="h-20 w-20 shrink-0 bg-gray-200 rounded-xl"></div>
                <div className="flex flex-col w-full gap-2">
                  <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 bg-gray-200 rounded-xl"></div>
                <div className="flex flex-col w-full gap-2">
                  <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
