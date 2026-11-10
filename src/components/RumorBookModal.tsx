import React, { useState } from 'react';
import { RumorRecord } from '../types/game';
import { BookOpen, CheckCircle, HelpCircle, Sparkles, Tag, X } from 'lucide-react';

interface RumorBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  rumors: RumorRecord[];
}

export const RumorBookModal: React.FC<RumorBookModalProps> = ({
  isOpen,
  onClose,
  rumors,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'key' | 'secret' | 'relationship'>('all');
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filter rumors
  const filteredRumors = rumors.filter((r) => {
    if (activeTab === 'key' && !r.isKeyClue) return false;
    if (activeTab === 'secret' && r.category !== 'secret') return false;
    if (activeTab === 'relationship' && r.category !== 'relationship') return false;
    if (selectedCharacterFilter !== 'all' && r.guestId !== selectedCharacterFilter) return false;
    return true;
  });

  // Calculate story clues progress
  const totalKeyClues = 6;
  const collectedKeyClues = rumors.filter((r) => r.isKeyClue).length;
  const progressPercent = Math.min(100, Math.round((collectedKeyClues / totalKeyClues) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-stone-900 border-4 border-amber-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Book Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/50 rounded-lg border border-amber-700/50 text-amber-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-amber-100 tracking-wide">
                《酒馆轶闻录》
              </h2>
              <p className="text-xs text-amber-300/70">
                记录客人们在炉火与麦酒之间吐露的隐秘心声与大陆传奇
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Clue Progress Banner */}
        <div className="px-6 py-2.5 bg-amber-950/40 border-b border-amber-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-stone-300 font-medium">
              主线故事线：【失落的民谣与银黎远征队】
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-300">
              线索完成度: {collectedKeyClues} / {totalKeyClues} ({progressPercent}%)
            </span>
            <div className="w-28 bg-stone-800 h-2 rounded-full overflow-hidden border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2 bg-stone-950 border-b border-stone-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              全部随笔 ({rumors.length})
            </button>
            <button
              onClick={() => setActiveTab('key')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'key'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              📜 关键线索 ({rumors.filter((r) => r.isKeyClue).length})
            </button>
            <button
              onClick={() => setActiveTab('secret')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'secret'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🔒 个人往事 ({rumors.filter((r) => r.category === 'secret').length})
            </button>
            <button
              onClick={() => setActiveTab('relationship')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'relationship'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🤝 羁绊互动 ({rumors.filter((r) => r.category === 'relationship').length})
            </button>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-gradient-to-b from-stone-900 to-stone-950">
          {filteredRumors.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-stone-600 mx-auto mb-3 opacity-60" />
              <p className="text-stone-400 text-sm">暂未收集到此类轶闻</p>
              <p className="text-stone-600 text-xs mt-1">
                在酒馆中招待客人，点击客人头顶闪烁的酒杯气泡，即可将其记录在此。
              </p>
            </div>
          ) : (
            filteredRumors.map((rumor) => (
              <div
                key={rumor.id}
                className={`p-4 rounded-xl border transition-all ${
                  rumor.isKeyClue
                    ? 'bg-amber-950/40 border-amber-700/60 shadow-lg shadow-amber-950/20'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-200 text-sm">
                      【{rumor.guestName}】
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      酒意：{rumor.drunkStateName}
                    </span>
                    {rumor.isKeyClue && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 核心剧情线索
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">
                    第 {rumor.day} 夜 · {rumor.timeStr}
                  </span>
                </div>

                <p className="text-stone-200 text-sm leading-relaxed font-serif bg-stone-950/50 p-3 rounded-lg border border-stone-800/80">
                  {rumor.text}
                </p>

                {/* Clue Annotation */}
                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
                  <div className="text-stone-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>{rumor.clueAnnotation || '日常观察与随性对话'}</span>
                  </div>

                  {rumor.isKeyClue && (
                    <span className="text-amber-300/90 flex items-center gap-1 font-medium text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                      <Sparkles className="w-3 h-3 text-amber-400" /> 已载入酒馆核心轶闻
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
