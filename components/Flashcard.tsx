'use client';

import { useState } from 'react';

interface FlashcardProps {
    word: string;
    meaning: string;
    lesson?: string;
}

export default function Flashcard({ word, meaning, lesson }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        // 1. Scene (Perspective Container)
        // perspective-1000: 3D 원근감을 줌. 이게 없으면 그냥 납작하게 찌그러짐.
        <div
            className="w-full h-64 cursor-pointer group [perspective:1000px]"
            onClick={handleFlip}
        >
            {/* 2. Card Inner (The rotating part) */}
            <div
                className={`
          relative w-full h-full transition-all duration-500 
          [transform-style:preserve-3d] 
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
            >
                {/* 3. Front Face (Word) */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-white border-2 border-blue-500 rounded-xl shadow-lg [backface-visibility:hidden]">
                    <h2 className="text-3xl font-bold text-gray-800">{word}</h2>
                    <p className="mt-4 text-sm text-gray-400">Click to see meaning</p>
                    {lesson && <span className="absolute top-4 left-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{lesson}</span>}
                </div>

                {/* 4. Back Face (Meaning) */}
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-blue-500 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-2xl font-semibold text-center px-4">{meaning}</p>
                    <p className="mt-4 text-sm text-blue-200">Click to flip back</p>
                </div>
            </div>
        </div>
    );
}