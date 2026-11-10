import React from 'react';
import { TavernUpgrade } from '../types/game';
import { Coins, Flame, Hammer, Music, Sparkles, Users, X } from 'lucide-react';

interface TavernUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  upgrades: TavernUpgrade[];
  gold: number;
  onBuyUpgrade: (upgradeId: string) => void;
}

export const TavernUpgradeModal: React.FC<TavernUpgradeModalProps> = ({
  isOpen,
  onClose,
  upgrades,
  gold,
  onBuyUpgrade,
}) => {
  if (!isOpen) return null;

  const getUpgradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-sky-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'Music':
        return <Music className="w-5 h-5 text-emerald-400" />;
      default:
        return <Hammer className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-stone-900 border-4 border-amber-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/50 rounded-lg border border-amber-700/50 text-amber-300">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-amber-100">
                酒馆装潢与设施升级
              </h2>
              <p className="text-xs text-amber-300/70">
                添置炉火木料、扩展红橡酒桌与珍藏酒窖，吸引更多远方旅人
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950 border border-amber-700/50 rounded-full text-amber-300 text-sm font-bold shadow-inner">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{gold} G</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upgrade Cards List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-stone-900 to-stone-950">
          {upgrades.map((up) => {
            const isMaxed = up.level >= up.maxLevel;
            const canAfford = gold >= up.cost;

            return (
              <div
                key={up.id}
                className="p-4 rounded-xl border border-stone-800 bg-stone-950/60 flex items-center justify-between gap-4 transition-all hover:border-stone-700"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 shrink-0">
                    {getUpgradeIcon(up.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-amber-200 text-sm">{up.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                        等级: {up.level} / {up.maxLevel}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1 max-w-lg leading-relaxed">
                      {up.description}
                    </p>
                    <p className="text-xs text-emerald-400 mt-1.5 font-medium">
                      ✦ 效果: {up.effectText}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isMaxed ? (
                    <span className="px-3.5 py-1.5 rounded-lg bg-stone-800 text-stone-500 text-xs font-medium border border-stone-700 block">
                      已达满级
                    </span>
                  ) : (
                    <button
                      onClick={() => onBuyUpgrade(up.id)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 shadow-amber-950/40'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" /> 升级 ({up.cost} G)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
