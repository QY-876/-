import React from 'react';
import { Drink, Guest, Relationship } from '../types/game';
import { getRelationshipTier, getTierLabel } from '../utils/sentenceTemplates';
import {
  Beer,
  Coins,
  DoorOpen,
  Droplets,
  Flame,
  Heart,
  LogOut,
  Sparkles,
  User,
  Users,
  Wine,
  X,
  Zap,
} from 'lucide-react';

interface GuestPanelProps {
  guest: Guest | null;
  availableDrinks: Drink[];
  gold: number;
  relationships?: Relationship[];
  allGuests?: Guest[];
  onClose: () => void;
  onServeDrink: (guestId: string, drink: Drink) => void;
  onOfferWater: (guestId: string) => void;
  onSettleAndLeave: (guestId: string) => void;
}

const DRUNK_LABELS = [
  { label: '清醒', desc: '神志清晰，言谈谨慎', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40' },
  { label: '微醺', desc: '心情愉悦，渐入佳境', color: 'bg-amber-900/60 text-amber-300 border-amber-500/40' },
  { label: '醉酒', desc: '言语增多，回忆泛起', color: 'bg-orange-900/60 text-orange-300 border-orange-500/40' },
  { label: '大醉', desc: '情绪失控，吐露深层秘密', color: 'bg-red-900/60 text-red-300 border-red-500/40' },
  { label: '不省人事', desc: '趴桌深眠，含糊梦呓', color: 'bg-purple-900/60 text-purple-300 border-purple-500/40' },
];

export const GuestPanel: React.FC<GuestPanelProps> = ({
  guest,
  availableDrinks,
  gold,
  relationships = [],
  allGuests = [],
  onClose,
  onServeDrink,
  onOfferWater,
  onSettleAndLeave,
}) => {
  if (!guest) return null;

  const drunkInfo = DRUNK_LABELS[guest.status.state] || DRUNK_LABELS[0];
  const waterDrink = availableDrinks.find((d) => d.id === 'spring_water');
  const leaveVal = Math.round(guest.status.leaveTendency ?? 0);

  // Find relationships for this guest
  const guestRelationships = allGuests
    .filter((g) => g.id !== guest.id)
    .map((other) => {
      const rel = relationships.find(
        (r) =>
          (r.guestA === guest.id && r.guestB === other.id) ||
          (r.guestA === other.id && r.guestB === guest.id)
      );
      const affinity = rel ? rel.affinity : 10;
      const tier = getRelationshipTier(affinity);
      const tierInfo = getTierLabel(tier);
      return {
        other,
        rel,
        affinity,
        tier,
        tierInfo,
      };
    });

  const getDrinkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Beer':
        return <Beer className="w-4 h-4 text-amber-400" />;
      case 'Wine':
        return <Wine className="w-4 h-4 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-red-400" />;
      default:
        return <Droplets className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="bg-stone-900/95 border-2 border-amber-900/80 rounded-xl p-4 text-stone-200 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-stone-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border-2 border-amber-700/60 flex items-center justify-center text-xl font-bold shadow-inner"
            style={{ backgroundColor: guest.appearance.outfitColor }}
          >
            {guest.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-amber-200">{guest.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                {guest.title}
              </span>
              {guest.isCustom && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-700/50">
                  自定角色
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {guest.race} · {guest.age}岁 · {guest.occupation}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-100 p-1 rounded-md hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Personality & Status Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {guest.personality.map((tag, i) => (
          <span
            key={i}
            className="text-[11px] px-2 py-0.5 rounded bg-stone-800/80 text-amber-300/90 border border-amber-900/40"
          >
            #{tag}
          </span>
        ))}
        <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${drunkInfo.color}`}>
          状态: {drunkInfo.label} ({drunkInfo.desc})
        </span>
      </div>

      {/* Active Drink Currently Consuming (当前在喝什么酒与酒量剩余) */}
      <div className="bg-stone-950/80 p-2.5 rounded-lg border border-amber-900/50 mb-3 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-950 border border-amber-800/60">
              {guest.status.currentDrinkId === 'spring_water' || guest.status.currentDrinkId === 'herbal_tea' ? (
                <Droplets className="w-4 h-4 text-sky-400" />
              ) : guest.status.currentDrinkId?.includes('wine') || guest.status.currentDrinkId?.includes('cider') ? (
                <Wine className="w-4 h-4 text-rose-400" />
              ) : guest.status.currentDrinkId?.includes('dragon') || guest.status.currentDrinkId?.includes('juniper') || guest.status.currentDrinkId?.includes('stout') ? (
                <Flame className="w-4 h-4 text-orange-400" />
              ) : guest.status.currentDrinkId?.includes('aurora') || guest.status.currentDrinkId?.includes('starlight') ? (
                <Sparkles className="w-4 h-4 text-purple-400" />
              ) : (
                <Beer className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block">席前杯中酒水 (Active Drink)：</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-200">
                  {guest.status.currentDrinkName || '淡麦芽黄啤'}
                </span>
                <span className="text-[10px] text-stone-400">
                  {guest.status.currentDrinkId === 'spring_water' ? '(清泉醒神)' : '(微温自酌)'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-amber-500/80 block">状态神情</span>
            <span className="text-xs text-amber-300 font-serif">
              {guest.status.expression || (guest.status.state === 0 ? '神色宁静' : guest.status.state === 1 ? '面泛红晕' : '醉眼微酣')}
            </span>
          </div>
        </div>

        {/* 酒水剩余刻度 (玩家可视化看到还剩多少) */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-stone-400 flex items-center gap-1">
              杯中剩余:
            </span>
            <span className="font-mono font-bold text-amber-300">
              {Math.max(0, Math.round(guest.status.drinkRemaining ?? 80))}%
            </span>
          </div>
          <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, guest.status.drinkRemaining ?? 80))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 mt-1">
            <span>
              {(guest.status.drinkRemaining ?? 80) > 60
                ? '刚斟上不久，大半杯'
                : (guest.status.drinkRemaining ?? 80) > 20
                  ? '杯中渐浅，慢慢品酌'
                  : (guest.status.drinkRemaining ?? 80) > 0
                    ? '仅剩杯底残酒，即将饮尽'
                    : '已饮尽杯底！正考虑再点或告辞'}
            </span>
            <span>喝完自动掷骰再点或离店</span>
          </div>
        </div>
      </div>

      {/* Drunkenness Bar & Mood */}
      <div className="grid grid-cols-2 gap-3 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-stone-400 flex items-center gap-1">
              <Beer className="w-3.5 h-3.5 text-amber-500" /> 醉酒度
            </span>
            <span className="font-semibold text-amber-300">{Math.round(guest.status.drunkenness)}%</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, guest.status.drunkenness)}%`,
                backgroundColor:
                  guest.status.state === 0
                    ? '#22c55e'
                    : guest.status.state === 1
                      ? '#eab308'
                      : guest.status.state === 2
                        ? '#f97316'
                        : guest.status.state === 3
                          ? '#ef4444'
                          : '#8b5cf6',
              }}
            />
          </div>
          <p className="text-[10px] text-stone-500 mt-1">自酌中 · 酒量耐受: {guest.stats.alcoholTolerance}</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-stone-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> 心情好感
            </span>
            <span className="font-semibold text-rose-300">{Math.round(guest.stats.mood)}</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${Math.max(5, (guest.stats.mood + 100) / 2)}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-500 mt-1">来店历史: {guest.stats.visitCount} 次</p>
        </div>
      </div>

      {/* Guest Status Atmospheric Observation (概率离店机制，对玩家完全隐藏数值) */}
      <div className="bg-stone-950/60 p-2.5 rounded-lg border border-stone-800 mb-3">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-stone-400 flex items-center gap-1">
            <DoorOpen className="w-3.5 h-3.5 text-amber-500" /> 客人留坐状态
          </span>
          <span className="text-[11px] text-amber-300/80 font-serif">
            {guest.status.state === 4
              ? '沉眠深憩（唤醒后将结账）'
              : guest.status.currentDrinkId === 'spring_water'
                ? '清泉在手 · 留坐惬意'
                : '酌饮畅谈 · 沉浸今夜'}
          </span>
        </div>
        <div className="p-1.5 rounded bg-stone-900/70 border border-stone-800 text-[11px] text-stone-300 flex items-center justify-between">
          <span className="italic text-stone-400 font-serif">
            {guest.status.state === 4
              ? '（呼吸平缓，枕着双臂陷入沉睡，偶有呓语）'
              : guest.status.state >= 2
                ? '（面色微酡，酒杯在手中轻轻摇晃，沉思往昔）'
                : '（目光宁静地望着壁炉中噼啪作响的木柴，暂无去意）'}
          </span>
          <button
            onClick={() => onSettleAndLeave(guest.id)}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5 underline transition-colors shrink-0 ml-2"
            title="结算当前客人的酒水与小费，空出座位供其他客人入座"
          >
            <LogOut className="w-3 h-3" /> 礼貌结账送客
          </button>
        </div>
        <p className="text-[10px] text-stone-500 mt-1">
          ✦ 呈上烈酒将加快客人微醺离席，奉上冰镇清泉可舒缓心绪、挽留长叙。
        </p>
      </div>

      {/* Background Story */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-stone-400 mb-1 flex items-center gap-1">
          <User className="w-3 h-3 text-amber-600" /> 角色背景
        </h4>
        <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/40 p-2 rounded border border-stone-800/80 font-serif">
          {guest.background}
        </p>
      </div>

      {/* Secret Clues Progress */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-stone-400 mb-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 隐秘心事 ({guest.secrets.filter((s) => s.unlocked).length}/{guest.secrets.length})
        </h4>
        <div className="space-y-1">
          {guest.secrets.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-1.5 rounded text-[11px] border ${
                sec.unlocked
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : 'bg-stone-950/50 border-stone-800 text-stone-500'
              }`}
            >
              {sec.unlocked ? (
                <div>
                  <span className="font-bold text-amber-300">✦ 秘密 {idx + 1}：</span>
                  {sec.text}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>🔒 隐秘往事 #{idx + 1}</span>
                  <span className="text-[10px] text-amber-500/70">
                    需: {DRUNK_LABELS[sec.requiredDrunkState].label}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Bonds & Friendship (酒桌羁绊与话题系统) */}
      {guestRelationships.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-stone-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> 酒桌羁绊 & 关系话题
            </span>
            <span className="text-[10px] text-stone-500">不同关系触发不同话题</span>
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
            {guestRelationships.map(({ other, affinity, tier, tierInfo }) => {
              const isOtherPresent = other.status.isPresent;
              return (
                <div
                  key={other.id}
                  className="bg-stone-950/50 border border-stone-800/80 rounded-lg p-2 text-[11px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-stone-200">{other.name}</span>
                      {isOtherPresent && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                          同席中
                        </span>
                      )}
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border font-medium ${tierInfo.color}`}>
                      {tierInfo.label} ({affinity}/100)
                    </span>
                  </div>

                  {/* Affinity Progress Bar */}
                  <div className="w-full bg-stone-800 h-1 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(5, affinity))}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-stone-400 line-clamp-1">
                    {tier === 'confidant'
                      ? '💬 话题：宿命誓约、遗迹残卷、生死托付'
                      : tier === 'friend'
                        ? '💬 话题：往昔险境、战友玩笑、重组冒险队'
                        : tier === 'acquaintance'
                          ? '💬 话题：旅途小调、兵刃手艺、边境雪情'
                          : '💬 话题：雨夜避雨、炉火寒暄、谨慎试探'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drink Serving Actions (扣除酒馆采购金币) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-semibold text-amber-300 flex items-center gap-1">
            <Beer className="w-3.5 h-3.5 text-amber-400" /> 呈上佳酿 (需花费酒馆采购金币)：
          </h4>
          <span className="text-[10px] text-stone-400">
            现有金币: <span className="text-amber-400 font-bold font-mono">{gold}G</span>
          </span>
        </div>

        {guest.status.state === 4 ? (
          <div className="bg-purple-950/50 border border-purple-800/60 p-2.5 rounded-lg text-center">
            <p className="text-xs text-purple-200 mb-1.5">
              该客人已醉倒深眠，无法再饮酒。
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => onOfferWater(guest.id)}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium transition-all shadow"
              >
                端来醒酒冰泉
              </button>
              <button
                onClick={() => onSettleAndLeave(guest.id)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded text-xs font-medium transition-all"
              >
                唤醒并结账送客
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {/* Quick Water Button */}
            {waterDrink && (
              <button
                onClick={() => onOfferWater(guest.id)}
                className="flex items-center justify-between p-2 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 text-left transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-sky-200">冰镇清泉</div>
                    <div className="text-[10px] text-sky-400">醒脑解醉 (-22%)</div>
                  </div>
                </div>
                <span className="text-[11px] text-stone-400">免费</span>
              </button>
            )}

            {/* Other unlocked drinks */}
            {availableDrinks
              .filter((d) => d.id !== 'spring_water' && d.unlocked)
              .map((drink) => {
                const isPreferred = guest.preferredDrinks.includes(drink.id);
                const canAfford = gold >= drink.cost;
                return (
                  <button
                    key={drink.id}
                    onClick={() => canAfford && onServeDrink(guest.id, drink)}
                    disabled={!canAfford}
                    title={!canAfford ? '金币不足以采购开桶此酒' : `花费 ${drink.cost}G 采购并呈给客人`}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                      !canAfford
                        ? 'opacity-40 bg-stone-900 border-stone-800 cursor-not-allowed'
                        : isPreferred
                          ? 'bg-amber-950/50 hover:bg-amber-900/70 border-amber-600/60 shadow'
                          : 'bg-stone-800/60 hover:bg-stone-750 border-stone-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getDrinkIcon(drink.iconName)}
                      <div className="truncate">
                        <div className="text-xs font-medium text-amber-100 flex items-center gap-1">
                          {drink.name}
                          {isPreferred && <span className="text-[9px] text-amber-400">★爱喝</span>}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          +{drink.alcoholPower}% 醉意
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-400 shrink-0 ml-1">
                      -{drink.cost}G
                    </span>
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
