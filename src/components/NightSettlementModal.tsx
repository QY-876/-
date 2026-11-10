import React from 'react';
import { NightSettlementData } from '../types/game';
import { CloudRain, Coins, Moon, Sparkles, Sun, TrendingUp, Users, Wine } from 'lucide-react';

interface NightSettlementModalProps {
  isOpen: boolean;
  data: NightSettlementData | null;
  currentGold: number;
  onStartNextNight: () => void;
}

export const NightSettlementModal: React.FC<NightSettlementModalProps> = ({
  isOpen,
  data,
  currentGold,
  onStartNextNight,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-4 border-amber-950 rounded-2xl shadow-2xl p-6 text-stone-200">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-amber-900/60 pb-3 mb-4">
          <div className="p-2.5 bg-amber-950 rounded-xl border border-amber-700/60 text-amber-300">
            <Moon className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-amber-100">
              第 {data.day} 夜 · 打烊账目结算
            </h3>
            <p className="text-xs text-amber-300/70">
              深夜两点的钟声敲响，酒客散去，老酒保拨动算盘清点今夜账目
            </p>
          </div>
        </div>

        {/* Narrative Preamble */}
        <p className="text-xs text-stone-400 italic mb-4 bg-stone-950/50 p-3 rounded-lg border border-stone-800 leading-relaxed font-serif">
          炉膛里的火焰渐渐转为暗红余烬，窗外的雨声若有若无。老酒保擦干了最后一只陶杯，记下今夜客人们说过的胡话与故事。
        </p>

        {/* Financial Breakdown Table */}
        <div className="space-y-2 bg-stone-950/70 p-3.5 rounded-xl border border-stone-800 mb-4 text-xs">
          <div className="flex justify-between items-center text-stone-300">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Users className="w-3.5 h-3.5 text-sky-400" /> 今夜接待客人人次
            </span>
            <span className="font-bold text-stone-200">{data.guestsServed} 位</span>
          </div>

          <div className="flex justify-between items-center text-stone-300">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Wine className="w-3.5 h-3.5 text-rose-400" /> 斟酒开桶成本支出
            </span>
            <span className="font-bold text-rose-400">-{data.drinkExpenses} G</span>
          </div>

          <div className="flex justify-between items-center text-stone-300">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> 客人离店酒水结账
            </span>
            <span className="font-bold text-amber-300">+{data.drinkIncome} G</span>
          </div>

          <div className="flex justify-between items-center text-stone-300">
            <span className="flex items-center gap-1.5 text-stone-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 满意小费与轶闻奖励
            </span>
            <span className="font-bold text-emerald-400">
              +{data.tipsEarned + data.rumorsFound * 5} G
            </span>
          </div>

          <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-sm">
            <span className="font-bold text-amber-200">今夜营业净结余：</span>
            <span
              className={`font-bold font-mono ${
                data.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {data.netProfit >= 0 ? `+${data.netProfit}` : data.netProfit} G
            </span>
          </div>
        </div>

        {/* Current Total Gold */}
        <div className="flex items-center justify-between p-3 bg-amber-950/40 rounded-xl border border-amber-900/50 mb-4 text-xs">
          <span className="text-stone-300">酒馆金库现有存金：</span>
          <span className="text-base font-bold text-amber-300 flex items-center gap-1 font-mono">
            <Coins className="w-4 h-4 text-amber-400" /> {currentGold} G
          </span>
        </div>

        {/* Next Weather Forecast */}
        <div className="flex items-center gap-2 text-xs text-sky-300 bg-sky-950/30 p-2.5 rounded-lg border border-sky-900/40 mb-5">
          <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            明日天气预报：
            {data.nextWeather === 'heavy_rain'
              ? '狂风暴雨（客人更渴望热酒与暖炉）'
              : data.nextWeather === 'rain'
                ? '绵绵夜雨（适宜小酌深谈）'
                : data.nextWeather === 'drizzle'
                  ? '微风薄雨'
                  : '晴朗月夜（夜游旅人增多）'}
          </span>
        </div>

        {/* Start Next Night Button */}
        <button
          onClick={onStartNextNight}
          className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 text-sm font-bold rounded-xl shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          打扫酒馆 · 开启第 {data.day + 1} 夜营业 (18:00)
        </button>
      </div>
    </div>
  );
};
