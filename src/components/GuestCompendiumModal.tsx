import React, { useState } from 'react';
import { Guest, Relationship } from '../types/game';
import { getRelationshipTier, getTierLabel } from '../utils/sentenceTemplates';
import { Heart, Shield, Sparkles, Users, Wine, X } from 'lucide-react';

interface GuestCompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  relationships: Relationship[];
}

export const GuestCompendiumModal: React.FC<GuestCompendiumModalProps> = ({
  isOpen,
  onClose,
  guests,
  relationships,
}) => {
  const [selectedId, setSelectedId] = useState<string>(guests[0]?.id || 'mila');

  if (!isOpen) return null;

  const currentGuest = guests.find((g) => g.id === selectedId) || guests[0];

  // Find relationships involving current guest
  const currentRelations = relationships.filter(
    (r) => r.guestA === currentGuest.id || r.guestB === currentGuest.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-stone-900 border-4 border-amber-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/50 rounded-lg border border-amber-700/50 text-amber-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-amber-100">
                客人图鉴与群像档案
              </h2>
              <p className="text-xs text-amber-300/70">
                阅览所有踏入酒馆的常客、过客与自定英雄的生平档案与人物关系网
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

        {/* Content Body: Left sidebar of guests + Right detail profile */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Guest List */}
          <div className="w-full md:w-64 border-r border-stone-800 bg-stone-950/60 overflow-y-auto p-3 space-y-2 shrink-0">
            {guests.map((g) => {
              const isSelected = g.id === currentGuest.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedId(g.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-600/80 shadow-md'
                      : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-850'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow shrink-0"
                    style={{ backgroundColor: g.appearance.outfitColor }}
                  >
                    {g.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-stone-200 truncate">
                        {g.name}
                      </span>
                      {g.status.isPresent ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="在店中" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-stone-600 shrink-0" title="离店在外" />
                      )}
                    </div>
                    <p className="text-xs text-stone-400 truncate">{g.title}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Profile Details */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-stone-900 to-stone-950 space-y-5">
            {/* Top Overview */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-serif font-bold text-amber-200">
                    {currentGuest.name}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/50">
                    {currentGuest.title}
                  </span>
                  {currentGuest.status.isPresent ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      当前在酒馆中 (席位 #{currentGuest.status.seatIndex + 1})
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                      在外游历
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  种族：{currentGuest.race} · 年龄：{currentGuest.age}岁 · 职业：
                  {currentGuest.occupation} · 来店次数：{currentGuest.stats.visitCount} 次
                </p>
              </div>
            </div>

            {/* Personality & Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
                <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 性格特质
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentGuest.personality.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-stone-800 text-amber-200 border border-stone-700"
                    >
                      #{p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
                <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5" /> 饮酒与生理属性
                </h4>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">酒量耐受度：</span>
                    <span className="font-semibold text-amber-300">
                      {currentGuest.stats.alcoholTolerance} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">心防戒备度：</span>
                    <span className="font-semibold text-stone-300">
                      {currentGuest.stats.caution} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">酒馆熟悉度：</span>
                    <span className="font-semibold text-emerald-400">
                      {currentGuest.stats.familiarity} / 100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Biography */}
            <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <h4 className="text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> 生平小传
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed font-serif">
                {currentGuest.background}
              </p>
            </div>

            {/* Relationship Web */}
            <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> 人物羁绊与交友话题网
                </span>
                <span className="text-[10px] text-stone-500 font-normal">关系越深，聊的话题越隐秘</span>
              </h4>
              {currentRelations.length === 0 ? (
                <p className="text-xs text-stone-500">
                  该角色目前暂无明确记录的复杂交际，正在酒馆中探索人际羁绊。
                </p>
              ) : (
                <div className="space-y-2">
                  {currentRelations.map((rel) => {
                    const otherId = rel.guestA === currentGuest.id ? rel.guestB : rel.guestA;
                    const otherGuest = guests.find((g) => g.id === otherId);
                    const tier = getRelationshipTier(rel.affinity);
                    const tierInfo = getTierLabel(tier);
                    return (
                      <div
                        key={rel.id}
                        className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-200">
                              与【{otherGuest?.name || otherId}】
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${tierInfo.color}`}>
                              {tierInfo.label}
                            </span>
                          </div>
                          <div className="text-stone-400 text-[11px]">
                            羁绊亲密度: <span className="text-rose-400 font-bold font-mono">{rel.affinity}</span> / 100
                          </div>
                        </div>

                        {/* Affinity bar */}
                        <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(5, rel.affinity))}%` }}
                          />
                        </div>

                        <p className="text-[11px] text-stone-400">
                          {tier === 'confidant'
                            ? '💬 解锁话题：古遗迹秘辛、生死之托、封印与誓约'
                            : tier === 'friend'
                              ? '💬 解锁话题：过往生死战斗、互相调侃、重组冒险小队'
                              : tier === 'acquaintance'
                                ? '💬 解锁话题：各自手艺、南方乐谣、北境防线与旧日轶事'
                                : '💬 解锁话题：避雨寒暄、酒馆名气打听、小心翼翼的初识试探'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Unlocked Secrets Progress */}
            <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 角色隐秘篇章 (
                {currentGuest.secrets.filter((s) => s.unlocked).length} / {currentGuest.secrets.length} 已解开)
              </h4>
              <div className="space-y-2">
                {currentGuest.secrets.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-2.5 rounded-lg border text-xs ${
                      sec.unlocked
                        ? 'bg-amber-950/40 border-amber-800/60 text-amber-200 font-serif'
                        : 'bg-stone-900/40 border-stone-800 text-stone-500'
                    }`}
                  >
                    {sec.unlocked ? (
                      <div>
                        <div className="text-amber-400 font-bold mb-1">
                          ✦ 秘密篇章 #{idx + 1}
                        </div>
                        <div>{sec.text}</div>
                      </div>
                    ) : (
                      <div>🔒 密语 #{idx + 1} 尚未解开 (在酒馆中使其饮酒达相应深度方可听到)</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
