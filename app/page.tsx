import { getWordsByLesson, getDistinctLessons } from '@/app/actions/getWords';
import Flashcard from '@/components/Flashcard';
import LessonSelector from '@/components/LessonSelector';

import { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 동적으로 메타데이터 생성하기
export async function generateMetadata(
  { searchParams }: Props,
): Promise<Metadata> {
  // searchParams 기다리기 (Next.js 15)
  const params = await searchParams;
  const lesson = (params.lesson as string) || "Home";

  return {
    title: lesson, // 결과: "Lesson 1 | Rick's Vocab" (layout.tsx 템플릿 적용됨)
    description: `Study words from ${lesson}`,
  }
}

// [중요 1] searchParams 타입을 Promise로 감싸야 해!
interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: HomeProps) {
  // [중요 2] props.searchParams를 먼저 await로 기다려서 껍질을 까야 해.
  const searchParams = await props.searchParams;

  const lessons = await getDistinctLessons();
  const defaultLesson = lessons.length > 0 ? lessons[0] : 'Lesson 1';

  // [중요 3] 이제 껍질 깐 searchParams에서 lesson을 꺼낸다.
  const selectedLesson = (searchParams.lesson as string) || defaultLesson;

  const words = await getWordsByLesson(selectedLesson);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <LessonSelector lessons={lessons} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Vocabulary Lab
          </h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            Current Lesson: <span className="text-blue-600 font-bold">{selectedLesson}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {words.length > 0 ? (
            words.map((item: any) => (
              <Flashcard
                key={item.id}
                word={item.word}
                meaning={item.meaning}
                lesson={item.lesson}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-lg font-medium text-gray-900">No words found</h3>
              <p className="mt-1 text-gray-500">
                '{selectedLesson}'은(는) 텅 비어있어.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}