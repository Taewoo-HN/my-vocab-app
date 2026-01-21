import { getWordsByLesson } from '@/app/actions/getWords';
import Flashcard from '@/components/Flashcard';

export default async function Home() {
  const words = await getWordsByLesson('Lesson 1');

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">천재(소) 영어 단어 리스트</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {words.map((item: any) => (
          <Flashcard
            key={item.id}
            word={item.word}
            meaning={item.meaning}
            lesson={item.lesson}
          />
        ))}
      </div>
    </main>
  );
}