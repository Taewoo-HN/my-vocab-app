'use client';

import { useState } from 'react';

interface FlashcardProps {
    word: string;
    meaning: string;
    lesson?: string;
}

export default function Flashcard({ word, meaning, lesson }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // 말하는 중인지 체크

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // [핵심] TTS 재생 함수
    const handleSpeak = (e: React.MouseEvent) => {
        // 1. 중요! 버튼 눌렀을 때 카드가 뒤집히지 않게 막는다.
        e.stopPropagation();

        // 2. 브라우저가 지원하는지 확인 (혹시 모를 IE 사용자를 위해... 없겠지만)
        if (!('speechSynthesis' in window)) {
            alert("네 브라우저는 말을 못 해, 모티.");
            return;
        }

        // 3. 말하기 설정
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US'; // 영어(미국) 설정. 영국 발음 원하면 'en-GB'
        utterance.rate = 1.0; // 속도 (0.1 ~ 10)
        utterance.pitch = 1.0; // 톤 (0 ~ 2)

        // 말하기 시작/끝 상태 관리 (아이콘 애니메이션용)
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        // 기존에 떠들던 게 있으면 취소하고 새로 말해
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div
            className="w-full h-64 cursor-pointer group [perspective:1000px]"
            onClick={handleFlip}
        >
            <div
                className={`
          relative w-full h-full transition-all duration-500 
          [transform-style:preserve-3d] 
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
            >
                {/* --- [앞면] --- */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-white border-2 border-blue-500 rounded-xl shadow-lg [backface-visibility:hidden]">

                    {/* [추가] 스피커 버튼 (우측 상단) */}
                    <button
                        onClick={handleSpeak}
                        className={`
              absolute top-3 right-3 p-2 rounded-full 
              hover:bg-gray-100 transition-colors z-10
              ${isSpeaking ? 'text-blue-600 animate-pulse' : 'text-gray-400'}
            `}
                        title="Listen to pronunciation"
                    >
                        {/* 스피커 SVG 아이콘 */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                    </button>

                    <h2 className="text-3xl font-bold text-gray-800">{word}</h2>
                    <p className="mt-4 text-sm text-gray-400">Click card to see meaning</p>

                    {lesson && (
                        <span className="absolute top-4 left-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {lesson}
                        </span>
                    )}
                </div>

                {/* --- [뒷면] --- */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-blue-500 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-2xl font-semibold text-center px-4">{meaning}</p>
                    <p className="mt-4 text-sm text-blue-200">Click to flip back</p>
                </div>
            </div>
        </div>
    );
}