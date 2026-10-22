import { getLessonData } from '@/app/actions/getWords';
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
  const params = await searchParams;
  const lesson = (params.lesson as string) || "Home";

  return {
    title: lesson,
    description: `Study words from ${lesson}`,
  }
}


interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;

  const requestedLesson = typeof searchParams.lesson === 'string' ? searchParams.lesson : undefined;
  const { lessons, selectedLesson, words, source } = await getLessonData(requestedLesson);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <LessonSelector lessons={lessons} selectedLesson={selectedLesson} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Vocabulary Lab
          </h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            Current Lesson: <span className="text-blue-600 font-bold">{selectedLesson}</span>
          </p>
          {source === 'local' && (
            <p role="status" className="mt-3 text-sm text-amber-700">
              YBM 중등·고등 로컬 단어 데이터를 사용 중입니다.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {words.length > 0 ? (
            words.map((item) => (
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
                &apos;{selectedLesson}&apos;은(는) 텅 비어있어.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
