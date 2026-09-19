import { useState, useEffect, useRef, useCallback } from 'react';
import { FastForward, RotateCcw } from 'lucide-react';
import FlowerBouquet from './FlowerBouquet';

interface NotebookLetterProps {
  onRestartAll?: () => void;
}

const letterParagraphs = [
  "So i been through a-lot this year…i failed in high school and my grandpa died and my hair got Alopecia ( that weird spot in the back ) but i'm not here to play victim i know u have more problems than me , I'm writing this message just to thank u cuz u were with me and u asked me how i was and u didn't got mad or bothered cuz of my weird messages and I'm sorry cuz i texted ur friend that time i'm still embarrassed tbh so yeah I'm thankful for all of it ur so sweet and kind",
  "Also i wanna thank u for ur likes to my comments and stories maybe to u it's nothing but it's a big thing for me it's like i exist and there's actually someone who care , u make me feel i'm alive",
  "Thx sorry it's long message i know but yeah. U don't have to reply or anything",
];

export default function NotebookLetter({ onRestartAll }: NotebookLetterProps) {
  const [revealedIndices, setRevealedIndices] = useState<{ [key: string]: boolean }>({});
  const [showHeart, setShowHeart] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);
  const [startDrawingBouquet, setStartDrawingBouquet] = useState(false);

  const timeoutsRef = useRef<number[]>([]);
  const bouquetAnchorRef = useRef<HTMLDivElement>(null);

  // Flattened words list with paragraph and word indices
  const allWords = useRef<Array<{ key: string; text: string }>>(
    letterParagraphs.flatMap((p, pIdx) =>
      p.split(' ').map((word, wIdx) => ({
        key: `${pIdx}-${wIdx}`,
        text: word,
      }))
    )
  ).current;

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const triggerBouquetDrawing = useCallback(() => {
    setStartDrawingBouquet(true);
    // Smoothly scroll down so the flower bouquet drawing is centered in view
    setTimeout(() => {
      bouquetAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  }, []);

  const finishRevealing = useCallback(() => {
    setIsRevealing(false);
    clearAllTimeouts();

    const allRevealed: { [key: string]: boolean } = {};
    allWords.forEach((w) => {
      allRevealed[w.key] = true;
    });
    setRevealedIndices(allRevealed);
    setShowHeart(true);

    // Trigger flower bouquet drawing
    setTimeout(() => {
      triggerBouquetDrawing();
    }, 400);
  }, [allWords, clearAllTimeouts, triggerBouquetDrawing]);

  const startAnimation = useCallback(() => {
    clearAllTimeouts();
    setRevealedIndices({});
    setShowHeart(false);
    setStartDrawingBouquet(false);
    setIsRevealing(true);

    let cumulativeDelay = 150;

    allWords.forEach((wordObj, index) => {
      let delay = 75;
      if (wordObj.text.includes('…') || wordObj.text.includes('.')) {
        delay = 200;
      } else if (wordObj.text.includes(',')) {
        delay = 120;
      }

      cumulativeDelay += delay;

      const t = window.setTimeout(() => {
        setRevealedIndices((prev) => ({ ...prev, [wordObj.key]: true }));

        // Last word reached
        if (index === allWords.length - 1) {
          const heartT = window.setTimeout(() => {
            setShowHeart(true);
            setIsRevealing(false);

            // User prompt requirement:
            // "لما توصل للاخير ابيك تبدا ترسم بوكيه زهور و تحته مكتوب here’s a little gift"
            // Wait a brief emotional pause on the heart, then begin drawing the bouquet!
            const bouquetT = window.setTimeout(() => {
              triggerBouquetDrawing();
            }, 800);
            timeoutsRef.current.push(bouquetT);
          }, 350);
          timeoutsRef.current.push(heartT);
        }
      }, cumulativeDelay);

      timeoutsRef.current.push(t);
    });
  }, [allWords, clearAllTimeouts, triggerBouquetDrawing]);

  useEffect(() => {
    startAnimation();
    return () => clearAllTimeouts();
  }, [startAnimation, clearAllTimeouts]);

  return (
    <div className="w-full max-w-2xl mx-auto relative transition-all duration-700 pb-16">
      {/* Real notebook paper container */}
      <div
        id="paper-sheet"
        className="relative w-full bg-[#13151e] rounded-lg border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_-10px_rgba(99,102,241,0.14)] px-8 sm:px-12 md:px-16 pt-14 pb-12 overflow-hidden transition-transform duration-500"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          transform: 'rotate(-0.25deg)',
        }}
      >
        {/* Top Washi Tape */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-700/60 backdrop-blur-sm border-x-2 border-dashed border-white/20 shadow-md z-20 pointer-events-none"
          style={{ transform: 'translateX(-50%) rotate(1deg)' }}
        />

        {/* Left Pink/Red Margin Rule */}
        <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-[1.5px] bg-rose-500/35 shadow-[0_0_8px_rgba(244,63,94,0.3)] pointer-events-none" />

        {/* Lined Notebook Paper Content */}
        <div
          className="relative min-h-[380px] pl-4 sm:pl-6 text-slate-100"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 37px, rgba(255,255,255,0.045) 37px, rgba(255,255,255,0.045) 38px)',
            backgroundPosition: '0 18px',
            lineHeight: '38px',
          }}
        >
          {letterParagraphs.map((paragraph, pIdx) => {
            const words = paragraph.split(' ');
            const isLastParagraph = pIdx === letterParagraphs.length - 1;

            return (
              <p key={pIdx} className="mb-7 last:mb-3">
                {words.map((word, wIdx) => {
                  const key = `${pIdx}-${wIdx}`;
                  const isRevealed = Boolean(revealedIndices[key]);

                  return (
                    <span
                      key={key}
                      className={`inline-block mr-[0.3em] font-['Caveat',cursive] text-2xl sm:text-3xl font-semibold tracking-wide text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                        isRevealed
                          ? 'opacity-100 blur-0 translate-y-0'
                          : 'opacity-0 blur-md translate-y-1.5'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}

                {/* Heart at the very end of the letter */}
                {isLastParagraph && (
                  <span
                    className={`inline-block ml-2 text-rose-400 text-2xl align-middle transition-all duration-500 ${
                      showHeart
                        ? 'opacity-100 scale-100 blur-0 animate-pulse drop-shadow-[0_0_10px_rgba(251,113,133,0.7)]'
                        : 'opacity-0 scale-50 blur-md pointer-events-none'
                    }`}
                  >
                    ♥
                  </span>
                )}
              </p>
            );
          })}

          {/* Anchor where the user prompt says:
              "لما توصل للاخير ابيك تبدا ترسم بوكيه زهور و تحته مكتوب here’s a little gift" */}
          <div ref={bouquetAnchorRef} className="w-full pt-4">
            {startDrawingBouquet && (
              <div className="border-t border-white/[0.06] mt-6 pt-4 animate-in fade-in zoom-in-95 duration-700">
                <FlowerBouquet
                  autoStart={true}
                  onReplay={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    startAnimation();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notebook Toolbar Controls */}
      <div className="w-full flex items-center justify-end gap-3 mt-4 px-2">
        {isRevealing ? (
          <button
            onClick={finishRevealing}
            id="btn-skip-animation"
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-all duration-200 shadow-sm"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip animation</span>
          </button>
        ) : (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              startAnimation();
            }}
            id="btn-replay-animation"
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-all duration-200 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay letter</span>
          </button>
        )}

        {onRestartAll && (
          <button
            onClick={onRestartAll}
            className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-slate-500 hover:text-slate-300 transition-colors"
            title="Start from envelope"
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
