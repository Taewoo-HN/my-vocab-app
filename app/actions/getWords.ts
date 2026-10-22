import { getSupabase } from '@/utils/supabase';
import localWords from '@/data/words.json';

interface Word {
    id: number;
    word: string;
    meaning: string;
    lesson: string;
}

function selectLesson(lessons: string[], requestedLesson?: string) {
    return requestedLesson && lessons.includes(requestedLesson)
        ? requestedLesson
        : lessons[0] || '';
}

export async function getLessonData(requestedLesson?: string) {
    try {
        const supabase = getSupabase();
        if (supabase) {
            // Bound the whole lookup so an unavailable server cannot stall the page.
            const signal = AbortSignal.timeout(5000);
            const { data, error } = await supabase.from('wordlist')
                .select('lesson').order('lesson', { ascending: true }).abortSignal(signal);
            if (error) throw error;
            const lessons = Array.from(new Set((data ?? []).map(item => item.lesson as string)));
            const selectedLesson = selectLesson(lessons, requestedLesson);
            const { data: words, error: wordsError } = await supabase.from('wordlist')
                .select('*').eq('lesson', selectedLesson).order('id', { ascending: true })
                .abortSignal(signal).returns<Word[]>();
            if (wordsError) throw wordsError;
            return { lessons, selectedLesson, words: words ?? [], source: 'supabase' as const };
        }
    } catch {
        console.warn('Vocabulary lookup failed; using local vocabulary.');
    }
    const lessons = Array.from(new Set(localWords.map(item => item.lesson)));
    const selectedLesson = selectLesson(lessons, requestedLesson);
    const words: Word[] = localWords.filter(item => item.lesson === selectedLesson)
        .sort((a, b) => a.id - b.id);
    return { lessons, selectedLesson, words, source: 'local' as const };
}
