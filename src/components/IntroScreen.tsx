import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface IntroScreenProps {
  onProceed: () => void;
}

const introSentence = "Hello, today there's no questions or anything only little message from me";

export default function IntroScreen({ onProceed }: IntroScreenProps) {
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const words = introSentence.split(' ');

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setRevealedCount(current);
      if (current >= words.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowButtons(true);
        }, 300);
      }
    }, 110);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="w-full max-w-xl mx-auto text-center px-6 py-12 md:py-16 bg-[#12141d]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_35px_-5px_rgba(99,102,241,0.25)] transition-all duration-700">
      {/* Floating envelope icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 mb-7 shadow-lg shadow-black/40 animate-pulse">
        <Mail className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_12px_rgba(129,140,248,0.5)]" />
      </div>

      {/* Word-by-word reveal text */}
      <div className="min-h-[90px] flex items-center justify-center mb-8 px-2">
        <p className="text-xl md:text-2xl font-normal leading-relaxed text-slate-100 drop-shadow-sm">
          {words.map((word, idx) => {
            const isRevealed = idx < revealedCount;
            return (
              <span
                key={idx}
                className={`inline-block mr-[0.28em] transition-all duration-400 ${
                  isRevealed
                    ? 'opacity-100 blur-0 translate-y-0'
                    : 'opacity-0 blur-md translate-y-1.5'
                }`}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>

      {/* Action buttons */}
      <div
        className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-600 ${
          showButtons
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={onProceed}
          id="intro-btn-ok"
          className="cursor-pointer px-7 py-3 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/30 text-slate-200 hover:text-white font-medium text-base md:text-lg backdrop-blur-md shadow-md hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          (ok?)
        </button>
        <button
          onClick={onProceed}
          id="intro-btn-weird"
          className="cursor-pointer px-7 py-3 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/30 text-slate-200 hover:text-white font-medium text-base md:text-lg backdrop-blur-md shadow-md hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          ( don't be weird )
        </button>
      </div>
    </div>
  );
}
