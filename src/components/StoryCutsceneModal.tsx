import React, { useState } from 'react';
import { Guest, TavernStoryEvent } from '../types/game';
import { ChevronRight, Sparkles, X } from 'lucide-react';

interface StoryCutsceneModalProps {
  event: TavernStoryEvent | null;
  guests: Guest[];
  onComplete: (event: TavernStoryEvent) => void;
}

export const StoryCutsceneModal: React.FC<StoryCutsceneModalProps> = ({
  event,
  guests,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  if (!event) return null;

  const currentDialogue = event.dialogueChain[step];
  const speaker = guests.find((g) => g.id === currentDialogue?.speakerId);
  const isLast = step >= event.dialogueChain.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete(event);
      setStep(0);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-stone-900 border-4 border-amber-950 rounded-2xl shadow-2xl p-6 text-stone-200 overflow-hidden flex flex-col">
        {/* Event Title Banner */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-900/60">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-serif text-amber-100">{event.title}</h3>
          </div>
          <span className="text-xs text-amber-400/80 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
            剧情演进
          </span>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-stone-400 mb-6 italic leading-relaxed bg-stone-950/40 p-3 rounded-lg border border-stone-800">
          {event.description}
        </p>

        {/* Dialogue Box */}
        {currentDialogue && speaker && (
          <div className="bg-stone-950/80 p-5 rounded-xl border border-amber-900/50 mb-6 flex gap-4 items-start shadow-inner">
            <div
              className="w-14 h-14 rounded-xl border-2 border-amber-700/80 flex items-center justify-center text-xl font-bold shrink-0 shadow-lg"
              style={{ backgroundColor: speaker.appearance.outfitColor }}
            >
              {speaker.name.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-amber-200 text-sm">{speaker.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                  {speaker.title}
                </span>
              </div>
              <p className="text-sm text-stone-200 font-serif leading-relaxed">
                {currentDialogue.text}
              </p>
            </div>
          </div>
        )}

        {/* Stepper Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-stone-500">
            第 {step + 1} / {event.dialogueChain.length} 幕
          </span>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                解锁关键线索并收录
              </>
            ) : (
              <>
                继续倾听
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
