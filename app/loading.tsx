export default function Loading() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* 1. 상단 바 스켈레톤 */}
            <div className="sticky top-0 z-50 w-full h-16 bg-white border-b border-gray-200 mb-6" />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* 2. 제목 스켈레톤 */}
                <div className="h-10 w-64 bg-gray-300 rounded-lg animate-pulse mb-8 mx-auto" />

                {/* 3. 카드 그리드 스켈레톤 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* 가짜 카드 8개 생성 */}
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-full h-64 bg-gray-200 rounded-xl animate-pulse shadow-sm border border-gray-300 relative"
                        >
                            {/* 카드 내부 텍스트 흉내 */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
                                <div className="h-6 bg-gray-300 rounded mb-4 w-full" />
                                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}