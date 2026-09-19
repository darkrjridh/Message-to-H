import { useState } from 'react';
import StarBackground from './components/StarBackground';
import IntroScreen from './components/IntroScreen';
import NotebookLetter from './components/NotebookLetter';
import type { ScreenState } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('intro');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleProceedToLetter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('letter');
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 550);
  };

  const handleRestartToEnvelope = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('intro');
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-start items-center relative overflow-x-hidden py-10 px-4">
      {/* Background with floating twinkling stars */}
      <StarBackground />

      {/* Main Content Area */}
      <main className="w-full max-w-3xl relative z-10 my-auto">
        <div
          className={`transition-all duration-500 ease-out ${
            isTransitioning ? 'opacity-0 scale-95 -translate-y-3 blur-sm' : 'opacity-100 scale-100 translate-y-0 blur-0'
          }`}
        >
          {screen === 'intro' && (
            <IntroScreen onProceed={handleProceedToLetter} />
          )}

          {screen === 'letter' && (
            <NotebookLetter onRestartAll={handleRestartToEnvelope} />
          )}
        </div>
      </main>
    </div>
  );
}
