import React, { useRef, useEffect } from 'react';
import { LiveActivityLog } from '../types/game';
import { Activity, Clock, Sparkles } from 'lucide-react';

interface LiveActivityFeedProps {
  logs: LiveActivityLog[];
  onSelectGuest?: (guestId: string) => void;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ logs, onSelectGuest }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when new log comes in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-stone-900/95 border-2 border-amber-900/40 rounded-xl p-3.5 shadow-xl">
      <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
            酒馆实时见闻动态 (Live Tavern Activity)
          </h3>
        </div>
        <span className="text-[10px] text-stone-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> 随时间与行为实时更新 · 点击行可选中角色
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-52 sm:max-h-60 overflow-y-auto space-y-2 pr-1.5 text-xs select-text scroll-smooth"
      >
        {logs.length === 0 ? (
          <p className="text-stone-500 text-xs italic py-2 text-center">
            夜幕初启，客人们刚刚落座，酒馆正在酝酿今晚的故事……
          </p>
        ) : (
          logs.map((log) => {
            const isClickable = Boolean(log.guestId && onSelectGuest);
            return (
              <div
                key={log.id}
                onClick={() => {
                  if (log.guestId && onSelectGuest) {
                    onSelectGuest(log.guestId);
                  }
                }}
                className={`flex items-start gap-2.5 p-1.5 rounded-lg border transition-all ${
                  isClickable ? 'cursor-pointer hover:bg-stone-800/80 hover:border-stone-700' : ''
                } ${
                  log.type === 'drink'
                    ? 'bg-amber-950/20 border-amber-900/40 text-amber-100'
                    : log.type === 'leave'
                      ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                      : log.type === 'arrive'
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                        : log.type === 'drunk_change'
                          ? 'bg-purple-950/20 border-purple-900/40 text-purple-200'
                          : 'bg-stone-950/40 border-stone-850 text-stone-300'
                }`}
              >
                {/* Time Badge */}
                <span className="font-mono text-[10px] text-stone-400 shrink-0 mt-0.5">
                  [{log.timeStr}]
                </span>

                {/* Tag Pill */}
                {log.tag && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-medium shrink-0 mt-0.5 ${
                      log.tagColor || 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {log.tag}
                  </span>
                )}

                {/* Speaker Name */}
                <span className="font-bold text-amber-300 shrink-0 mt-0.5">{log.guestName}</span>

                {/* Action & Dialogue Narrative (换行呈现神色、动作与台词) */}
                <div className="flex-1 leading-relaxed text-[11px] font-serif whitespace-pre-line">
                  {log.text}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
