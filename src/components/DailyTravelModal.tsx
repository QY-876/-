import React, { useState } from 'react';
import { DailyTravelEntry, Guest, SouvenirItem } from '../types/game';
import {
  BookOpen,
  Calendar,
  Compass,
  Feather,
  Flower2,
  Gem,
  Hammer,
  MapPin,
  Scroll,
  Shield,
  Sparkles,
  TreePine,
  X,
  Zap,
} from 'lucide-react';

interface DailyTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  travelEntries: DailyTravelEntry[];
  unlockedSouvenirs: SouvenirItem[];
}

export const DailyTravelModal: React.FC<DailyTravelModalProps> = ({
  isOpen,
  onClose,
  guests,
  travelEntries,
  unlockedSouvenirs,
}) => {
  const [selectedGuestId, setSelectedGuestId] = useState<string>('mila');
  const [activeTab, setActiveTab] = useState<'journal' | 'souvenirs'>('journal');

  if (!isOpen) return null;

  const currentGuest = guests.find((g) => g.id === selectedGuestId) || guests[0];
  const guestEntries = travelEntries.filter((e) => e.guestId === currentGuest.id);

  const getSouvenirIcon = (name: string) => {
    switch (name) {
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-rose-400" />;
      case 'Gem':
        return <Gem className="w-5 h-5 text-amber-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5 text-emerald-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-amber-500" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5 text-amber-300" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-sky-400" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-orange-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-red-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  const getSketchArt = (type: string) => {
    switch (type) {
      case 'windmill':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-b from-sky-900/60 via-emerald-950/40 to-stone-900 border border-emerald-700/40 p-4 flex flex-col justify-end shadow-inner">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-3 right-3 text-emerald-400/80 font-mono text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/40">
              风息磨坊 · 水车石阶
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-3xl">🌾</span>
              <div>
                <p className="text-xs font-bold text-emerald-200">阳光洒落水车，溅起青苔与野花香</p>
                <p className="text-[10px] text-stone-300">蓝顶山雀在琉特琴轴上静静倾听旋律</p>
              </div>
            </div>
          </div>
        );
      case 'forge_ruins':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-b from-amber-950/70 via-stone-900 to-stone-950 border border-amber-700/40 p-4 flex flex-col justify-end shadow-inner">
            <div className="absolute top-3 right-3 text-amber-400/80 font-mono text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
              灰岩断层 · 矮人旧砧
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-3xl">⚒️</span>
              <div>
                <p className="text-xs font-bold text-amber-200">三十年风雨不蚀的冷锻钢面</p>
                <p className="text-[10px] text-stone-300">地质锤敲落带铜花的粗粝原石</p>
              </div>
            </div>
          </div>
        );
      case 'ancient_tower':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-b from-indigo-950/80 via-purple-950/50 to-stone-900 border border-indigo-700/40 p-4 flex flex-col justify-end shadow-inner">
            <div className="absolute top-3 right-3 text-indigo-400/80 font-mono text-[10px] bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-600/40">
              天顶日晷台 · 星轨偏角
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-3xl">📜</span>
              <div>
                <p className="text-xs font-bold text-indigo-200">拂晓第一缕晨曦投射下的微弱紫芒</p>
                <p className="text-[10px] text-stone-300">计算出第七星轨与导师密信暗纹的共振</p>
              </div>
            </div>
          </div>
        );
      case 'snow_forest':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 via-sky-950/50 to-stone-950 border border-sky-700/40 p-4 flex flex-col justify-end shadow-inner">
            <div className="absolute top-3 right-3 text-sky-400/80 font-mono text-[10px] bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/40">
              黑松林雪线 · 狼踪古战场
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-3xl">🐺</span>
              <div>
                <p className="text-xs font-bold text-sky-200">白狼一家巡行留下的梅花爪印</p>
                <p className="text-[10px] text-stone-300">冰封浅滩下带狼首印的三棱倒钩旧箭簇</p>
              </div>
            </div>
          </div>
        );
      case 'stable':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-b from-amber-950/60 via-stone-900 to-stone-950 border border-amber-800/40 p-4 flex flex-col justify-end shadow-inner">
            <div className="absolute top-3 right-3 text-amber-400/80 font-mono text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/40">
              西区驿站 · 暖草马厩
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-3xl">🐴</span>
              <div>
                <p className="text-xs font-bold text-amber-200">亲昵拱着皮护甲的小枣红马</p>
                <p className="text-[10px] text-stone-300">剔出碎石、打磨得锃亮平滑的旧马掌</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-b from-stone-850 to-stone-950 border border-stone-700/40 p-4 flex flex-col justify-end shadow-inner">
            <div className="flex items-center gap-2 z-10">
              <span className="text-3xl">🗺️</span>
              <div>
                <p className="text-xs font-bold text-stone-200">城镇近郊的静谧漫步手札</p>
                <p className="text-[10px] text-stone-400">收集到的回忆正等待在酒桌上与故人重述</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border-4 border-amber-950/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-900/60 rounded-xl border border-amber-600/50 text-amber-300 shadow">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-amber-100">
                  角色今日见闻手记
                </h2>
              </div>
              <p className="text-xs text-amber-300/70 mt-0.5">
                翻阅客人们白天在荒野、小镇与遗迹中漫游的日常奇遇、写生留影与带回的小物件
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

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-stone-950/70 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'journal'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600/60 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Feather className="w-3.5 h-3.5 text-amber-400" />
              <span>旅行日记手札 ({travelEntries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('souvenirs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'souvenirs'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-600/60 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>纪念品收藏架 ({unlockedSouvenirs.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-400 hidden sm:block">
            今日白天见闻将成为今晚酒馆闲谈的生动素材
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === 'journal' ? (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Character Select Bar */}
            <div className="w-full md:w-56 border-r border-stone-800 bg-stone-950/50 p-3 space-y-2 overflow-y-auto shrink-0">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 px-1">
                常客游历名录
              </p>
              {guests.map((g) => {
                const isSelected = g.id === currentGuest.id;
                const count = travelEntries.filter((e) => e.guestId === g.id).length;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGuestId(g.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-950/80 border-amber-600 text-amber-200 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-850'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow"
                        style={{ backgroundColor: g.appearance.outfitColor }}
                      >
                        {g.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate">{g.name}</p>
                        <p className="text-[10px] text-stone-400 truncate">{g.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-400/90 font-mono">
                      {count}篇
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Illustrated Journal Cards */}
            <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-stone-900 via-stone-925 to-stone-950 space-y-5">
              {guestEntries.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  <p className="text-sm">该角色今日静坐歇息，暂无新的野外见闻记录。</p>
                </div>
              ) : (
                guestEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-800/60 transition-colors"
                  >
                    {/* Header: Time, Location & Title */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50 font-bold">
                            第 {entry.day} 日 · {entry.timeOfDay}
                          </span>
                          <span className="text-xs text-stone-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            {entry.location}
                          </span>
                        </div>
                        <h3 className="text-base font-bold font-serif text-amber-100 mt-1">
                          《{entry.title}》
                        </h3>
                      </div>

                      <div className="text-[11px] text-stone-400 bg-stone-900/80 px-2.5 py-1 rounded-full border border-stone-800">
                        今日心绪: <span className="text-amber-300">{entry.moodSummary}</span>
                      </div>
                    </div>

                    {/* Illustrated Sketch Banner */}
                    {getSketchArt(entry.sketchType)}

                    {/* Story Narrative */}
                    <p className="text-xs text-stone-300 leading-relaxed font-serif bg-stone-900/60 p-3.5 rounded-xl border border-stone-800/60 shadow-inner">
                      “{entry.storyText}”
                    </p>

                    {/* Souvenir Badge & Tavern Hook */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Left: Souvenir */}
                      {entry.souvenir && (
                        <div className="flex items-start gap-3 bg-amber-950/30 border border-amber-800/50 p-2.5 rounded-xl">
                          <div className="p-2 rounded-lg bg-stone-900 border border-amber-700/40 shrink-0">
                            {getSouvenirIcon(entry.souvenir.iconName)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-amber-200">
                                {entry.souvenir.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-900 text-amber-300 border border-amber-700">
                                纪念品
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">
                              {entry.souvenir.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Right: Tonight's Tavern Conversation Hook */}
                      <div className="bg-indigo-950/30 border border-indigo-800/50 p-2.5 rounded-xl flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1 mb-0.5">
                          <Sparkles className="w-3 h-3 text-indigo-400" /> 今夜酒桌闲谈钩子：
                        </span>
                        <p className="text-[11px] text-stone-300 italic line-clamp-2">
                          “{entry.dialogueHook}”
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Souvenirs Shelf Showcase */
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-stone-900 to-stone-950">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  已收藏的旅行纪念品与写生拓本 ({unlockedSouvenirs.length})
                </h3>
                <span className="text-xs text-stone-500">
                  挂机时角色外出会持续搜集各地特色物产与遗迹信物
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {unlockedSouvenirs.map((item) => (
                  <div
                    key={item.id}
                    className="bg-stone-950/70 border border-amber-900/40 hover:border-amber-600/70 p-3.5 rounded-xl shadow transition-all hover:scale-[1.02] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-400">
                          {getSouvenirIcon(item.iconName)}
                        </div>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded border font-medium ${
                            item.rarity === 'rare'
                              ? 'bg-purple-950 text-purple-300 border-purple-700'
                              : item.rarity === 'uncommon'
                                ? 'bg-amber-950 text-amber-300 border-amber-700'
                                : 'bg-stone-850 text-stone-300 border-stone-700'
                          }`}
                        >
                          {item.rarity === 'rare' ? '珍稀信物' : item.rarity === 'uncommon' ? '精巧标本' : '常物小件'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-amber-100">{item.name}</h4>
                      <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500">
                      <span>采集于: {item.acquiredLocation}</span>
                      <span>第 {item.acquiredDate} 日</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
