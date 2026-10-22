import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const target = 'data/words.json';

function validate(text) {
    let words;
    try { words = JSON.parse(text); } catch { throw new Error('Vocabulary is not valid JSON.'); }
    if (!Array.isArray(words) || words.length === 0 || words.some(row =>
        !row || !Number.isSafeInteger(row.id) || row.id <= 0 ||
        ['word', 'meaning', 'lesson'].some(key => typeof row[key] !== 'string' || !row[key].trim())
    ) || new Set(words.map(row => row.id)).size !== words.length) {
        throw new Error('Vocabulary must contain unique positive IDs and non-empty word, meaning, lesson strings.');
    }
    return words.length;
}

async function prepare() {
    const key = process.env.SUPABASE_BUILD_SECRET_KEY;
    // Vercel must download on every build, even when a previous JSON is cached.
    if (process.env.VERCEL !== '1' && !key) {
        await access(target).catch(() => { throw new Error('Missing data/words.json. Convert local workbooks or configure Storage credentials.'); });
        console.log(`Using ${validate(await readFile(target, 'utf8'))} local vocabulary entries.`);
        return;
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || !key) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_BUILD_SECRET_KEY for the build.');
    if (new URL(url).protocol !== 'https:') throw new Error('The Storage project URL must use HTTPS.');
    const supabase = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: { fetch: (input, init) => fetch(input, {
            ...init, signal: AbortSignal.timeout(30_000), redirect: 'error', cache: 'no-store',
        }) },
    });
    const { data, error } = await supabase.storage.from('vocabulary').download('words.json');
    if (error || !data) throw new Error('Cannot download vocabulary/words.json. Check the bucket, file, and build key.');
    const text = await data.text();
    const count = validate(text);
    await mkdir('data', { recursive: true });
    await writeFile(`${target}.tmp`, text, 'utf8');
    await rename(`${target}.tmp`, target);
    console.log(`Downloaded ${count} vocabulary entries from private Storage.`);
}

try {
    await prepare();
} catch (error) {
    console.error('Vocabulary preparation failed:', error.message);
    process.exitCode = 1;
}
