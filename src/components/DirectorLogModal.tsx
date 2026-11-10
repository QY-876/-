import React, { useState } from 'react';
import { DirectorOutput, Guest, Relationship } from '../types/game';
import {
  Beer,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { getRelationshipTier, getTierLabel } from '../utils/sentenceTemplates';

interface DirectorLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: DirectorOutput[];
  guests: Guest[];
  relationships: Relationship[];
}

export const DirectorLogModal: React.FC<DirectorLogModalProps> = ({
  isOpen,
  onClose,
  logs,
  guests,
  relationships,
}) => {
  const [filterGuestId, setFilterGuestId] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) => {
    if (filterGuestId !== 'all') {
      const hasGuest = l.rounds.some(
        (r) => r.speaker === filterGuestId || r.target === filterGuestId
      );
      if (!hasGuest) return false;
    }
    if (filterTopic !== 'all') {
      const hasTopic = l.rounds.some((r) => r.topic === filterTopic);
      if (!hasTopic) return false;
    }
    return true;
  });

  const getGuest = (id: string) => guests.find((g) => g.id === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border-4 border-amber-950/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-900/60 rounded-xl border border-amber-600/50 text-amber-300 shadow">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-amber-100">
                  酒馆闲谈与动作纪要
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50">
                  DND 挂机全记录 · 规则引擎驱动
                </span>
              </div>
              <p className="text-xs text-amber-300/70 mt-0.5">
                记录角色们在挂机期间产生的自然多轮闲谈、实体物理动作、关系好感变化与角色记忆
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

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-stone-950/70 border-b border-stone-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">角色筛选:</span>
            <select
              value={filterGuestId}
              onChange={(e) => setFilterGuestId(e.target.value)}
              className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">全部角色 ({guests.length})</option>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.title})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">话题筛选:</span>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">全部话题 (12类)</option>
              <option value="weather">天气/暴风雨</option>
              <option value="food">酒水/食物</option>
              <option value="fatigue">伤痛/疲劳</option>
              <option value="work">锻造/生计</option>
              <option value="recent_event">最近外出/游历</option>
              <option value="rumor">北境传闻/失联</option>
              <option value="goal">誓约/冒险目标</option>
            </select>
          </div>

          <div className="text-stone-500 text-[11px]">
            共收录 <span className="text-amber-400 font-bold">{filteredLogs.length}</span> 组酒桌多轮纪要
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-stone-900 via-stone-925 to-stone-950">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">暂未检索到符合条件的闲谈纪要。客人们入座后将自然开启交流。</p>
            </div>
          ) : (
            filteredLogs.map((scene) => (
              <div
                key={scene.id}
                className="bg-stone-950/80 border-2 border-stone-800 rounded-xl p-4 shadow-lg space-y-3 hover:border-amber-800/60 transition-colors"
              >
                {/* Scene Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> 第 {scene.day} 夜 · {scene.timeStr}
                    </span>
                    <span className="text-xs text-stone-300 font-medium">
                      {scene.summaryLog}
                    </span>
                  </div>

                  {scene.affinityDeltas && scene.affinityDeltas.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800/50 text-rose-300">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>同桌情谊加深 +{scene.affinityDeltas[0].delta}</span>
                    </div>
                  )}
                </div>

                {/* Multi-round Breakdown */}
                <div className="space-y-2.5 pl-2 border-l-2 border-amber-900/40">
                  {scene.rounds.map((round) => {
                    const speaker = getGuest(round.speaker);
                    const target = round.target ? getGuest(round.target) : null;
                    return (
                      <div
                        key={round.roundIndex}
                        className="bg-stone-900/60 border border-stone-800/70 rounded-lg p-2.5 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-200">
                              {speaker?.name || round.speaker}
                            </span>
                            {target && (
                              <span className="text-stone-500">
                                ➔ 对 {target.name}
                              </span>
                            )}
                            {round.intent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 border border-stone-700">
                                意图: {round.intent}
                              </span>
                            )}
                            {round.topic && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800/60">
                                话题: {round.topic}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-500">第 {round.roundIndex} 轮</span>
                        </div>

                        {/* Physical Action */}
                        {round.actionDesc && (
                          <div className="text-[11px] text-amber-300/80 flex items-center gap-1 italic">
                            <span className="text-amber-500">❖ [动作]</span>
                            <span>{round.actionDesc}</span>
                          </div>
                        )}

                        {/* Spoken Line */}
                        {round.line && (
                          <p className="text-stone-200 font-serif leading-relaxed pl-3 border-l border-amber-700/40">
                            {round.line}
                          </p>
                        )}

                        {/* Memory Written */}
                        {round.memory && (
                          <div className="text-[10px] text-indigo-300/80 flex items-center gap-1 pt-0.5">
                            <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span>生成角色记忆: {round.memory}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
