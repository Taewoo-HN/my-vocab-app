import { supabase } from '@/utils/supabase';

export async function getWordsByLesson(lesson: string) {
    const { data, error } = await supabase
        .from('wordlist') // 네 테이블 이름
        .select('*')
        .eq('lesson', lesson)
        .order('id', { ascending: true });

    if (error) {
        console.error('Fetch error:', error);
        return [];
    }
    return data;
}

export async function getDistinctLessons(): Promise<string[]> {
    // 1. wordlist 테이블에서 'lesson' 컬럼만 싹 다 가져와
    const { data, error } = await supabase
        .from('wordlist')
        .select('lesson')
        .order('lesson', { ascending: true }); // 정렬해서 가져오면 더 좋지

    if (error) {
        console.error('Lesson Fetch Error:', error);
        return [];
    }

    const uniqueLessons = Array.from(new Set(data.map((item) => item.lesson)));

    return uniqueLessons;
}