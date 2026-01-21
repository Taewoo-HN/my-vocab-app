import { supabase } from '@/utils/supabase';

export async function getWordsByLesson(lesson: string) {
    // 캐싱을 방지하고 매번 최신 데이터를 가져오고 싶다면 옵션 추가 가능
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