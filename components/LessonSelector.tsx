'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';

// [수정] 이제 부모로부터 lessons 목록을 선물 받는다.
interface LessonSelectorProps {
    lessons: string[];
}

export default function LessonSelector({ lessons }: LessonSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL에 lesson이 없으면, 목록의 첫 번째 놈을 기본값으로 삼아.
    // 만약 목록도 비어있으면 그냥 빈 문자열.
    const currentLesson = searchParams.get('lesson') || (lessons.length > 0 ? lessons[0] : '');

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLesson = e.target.value;
        router.push(`/?lesson=${newLesson}`, { scroll: false });
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 mb-6 shadow-sm flex justify-between items-center transition-all">
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
                HeNa's Vocab
            </span>

            <div className="flex items-center w-full sm:w-auto justify-end">
                <label htmlFor="lesson-select" className="mr-3 text-sm font-semibold text-gray-600">
                    Select:
                </label>

                {/* 데이터가 없으면 로딩 중이거나 에러난 거임 */}
                {lessons.length > 0 ? (
                    <select
                        id="lesson-select"
                        value={currentLesson}
                        onChange={handleChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm cursor-pointer min-w-[150px]"
                    >
                        {lessons.map((lesson) => (
                            <option key={lesson} value={lesson}>
                                {lesson}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="text-sm text-red-500 font-bold">No Lessons Found</span>
                )}
            </div>
        </nav>
    );
}