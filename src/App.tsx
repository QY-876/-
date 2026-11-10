import React, { useEffect, useRef, useState } from 'react';
import {
  DialogueBubble,
  Drink,
  DrunkState,
  Guest,
  LiveActivityLog,
  NightSettlementData,
  Relationship,
  RumorRecord,
  TavernStoryEvent,
  TavernUpgrade,
} from './types/game';
import {
  DIALOGUE_LIBRARY,
  INITIAL_DRINKS,
  INITIAL_GUESTS,
  INITIAL_RELATIONSHIPS,
  STORY_EVENTS,
  TAVERN_UPGRADES,
} from './data/tavernData';
import {
  CHARACTER_ACTION_POOLS,
  INTER_CHARACTER_BANTER,
  TableBanter,
} from './data/interactionsData';
import {
  generateCombinatorialAction,
  getCharacterFarewell,
  getRelationshipTier,
  getTierLabel,
} from './utils/sentenceTemplates';
import { tavernAudio } from './utils/audio';
import { SEAT_COORDS, TavernCanvas } from './components/TavernCanvas';
import { GuestPanel } from './components/GuestPanel';
import { LiveActivityFeed } from './components/LiveActivityFeed';
import { RumorBookModal } from './components/RumorBookModal';
import { GuestCompendiumModal } from './components/GuestCompendiumModal';
import { CharacterCreatorModal } from './components/CharacterCreatorModal';
import { TavernUpgradeModal } from './components/TavernUpgradeModal';
import { StoryCutsceneModal } from './components/StoryCutsceneModal';
import { NightSettlementModal } from './components/NightSettlementModal';
import { DailyTravelModal } from './components/DailyTravelModal';
import { DirectorLogModal } from './components/DirectorLogModal';
import { runDndDirectorEngine } from './utils/directorEngine';
import {
  INITIAL_SOUVENIRS,
  INITIAL_TRAVEL_ENTRIES,
  generateCustomGuestTravel,
} from './data/characterTravelData';
import { DirectorOutput } from './types/game';
import {
  BookOpen,
  CloudRain,
  Coins,
  Compass,
  FastForward,
  FileText,
  Flame,
  Hammer,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';

const STORAGE_KEY = 'last_round_tavern_save_v2';

export default function App() {
  // --- Tavern Main States ---
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.guests) {
          return parsed.guests.map((g: Guest) => ({
            ...g,
            status: {
              ...g.status,
              hasDepartedTonight: g.status.hasDepartedTonight ?? false,
            },
          }));
        }
      }
    } catch {}
    return INITIAL_GUESTS;
  });

  const [drinks, setDrinks] = useState<Drink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.drinks) return parsed.drinks;
      }
    } catch {}
    return INITIAL_DRINKS;
  });

  const [upgrades, setUpgrades] = useState<TavernUpgrade[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.upgrades) return parsed.upgrades;
      }
    } catch {}
    return TAVERN_UPGRADES;
  });

  const [rumors, setRumors] = useState<RumorRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rumors) return parsed.rumors;
      }
    } catch {}
    return [];
  });

  const [relationships, setRelationships] = useState<Relationship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.relationships) return parsed.relationships;
      }
    } catch {}
    return INITIAL_RELATIONSHIPS;
  });

  const [storyEvents, setStoryEvents] = useState<TavernStoryEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storyEvents) return parsed.storyEvents;
      }
    } catch {}
    return STORY_EVENTS;
  });

  const [directorLogs, setDirectorLogs] = useState<DirectorOutput[]>([]);
  const [travelEntries, setTravelEntries] = useState(INITIAL_TRAVEL_ENTRIES);
  const [unlockedSouvenirs, setUnlockedSouvenirs] = useState(INITIAL_SOUVENIRS);

  // Time & Economic State
  const [day, setDay] = useState<number>(1);
  const [timeMinutes, setTimeMinutes] = useState<number>(1080); // 18:00
  const [speed, setSpeed] = useState<0 | 1 | 2 | 4>(1);
  const [autoServe, setAutoServe] = useState<boolean>(false);
  const [gold, setGold] = useState<number>(36);
  const [weather, setWeather] = useState<'rain' | 'heavy_rain' | 'drizzle' | 'night_clear'>('rain');

  // Tonight's Running Financial Ledger
  const [nightExpenses, setNightExpenses] = useState<number>(0);
  const [nightIncome, setNightIncome] = useState<number>(0);
  const [nightTips, setNightTips] = useState<number>(0);
  const [nightGuestsServed, setNightGuestsServed] = useState<number>(1);
  const [nightRumorsFound, setNightRumorsFound] = useState<number>(0);

  // Audio Toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

  // Active UI & Modals
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>('mila');
  const [activeBubbles, setActiveBubbles] = useState<DialogueBubble[]>([]);
  const [activeCutscene, setActiveCutscene] = useState<TavernStoryEvent | null>(null);

  // Real-time Textual Activity Logs (屏幕下方实时动态，开局静谧入座)
  const [activityLogs, setActivityLogs] = useState<LiveActivityLog[]>([
    {
      id: 'log_init_1',
      timeStr: '18:00',
      guestName: '酒馆老板',
      type: 'system',
      text: '夜色降临，点燃壁炉玄武岩炉膛，窗外细雨蒙蒙，《最后一杯酒》正式开门营业。',
      tag: '营业开始',
      tagColor: 'bg-amber-900 text-amber-200',
    },
    {
      id: 'log_init_2',
      timeStr: '18:05',
      guestName: '米拉',
      guestId: 'mila',
      type: 'action',
      text: '半精灵吟游诗人背着旧琉特琴在窗边落座，抖落绿色外衣上的水渍，微笑着凝视炉火。',
      tag: '入座',
      tagColor: 'bg-emerald-950 text-emerald-300',
    },
  ]);

  // Modal Views
  const [showRumorBook, setShowRumorBook] = useState(false);
  const [showCompendium, setShowCompendium] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showTravelJournal, setShowTravelJournal] = useState(false);
  const [showDirectorHistory, setShowDirectorHistory] = useState(false);
  const [nightSettlementData, setNightSettlementData] = useState<NightSettlementData | null>(null);

  // Banner notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper to add activity log entry
  const addActivityLog = (
    guestName: string,
    text: string,
    type: LiveActivityLog['type'] = 'action',
    tag?: string,
    tagColor?: string,
    guestId?: string
  ) => {
    const newLog: LiveActivityLog = {
      id: `log_${Date.now()}_${Math.random()}`,
      timeStr: formatGameTime(timeMinutes),
      guestName,
      guestId,
      type,
      text,
      tag,
      tagColor,
    };
    setActivityLogs((prev) => [...prev.slice(-35), newLog]);
  };

  // --- Initial Mount Audio Init ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gold !== undefined) setGold(parsed.gold);
        if (parsed.day !== undefined) setDay(parsed.day);
        if (parsed.timeMinutes !== undefined) setTimeMinutes(parsed.timeMinutes);
      }
    } catch {}

    const onUserInteract = () => {
      tavernAudio.init();
      window.removeEventListener('click', onUserInteract);
    };
    window.addEventListener('click', onUserInteract);

    return () => {
      window.removeEventListener('click', onUserInteract);
    };
  }, []);

  // --- Auto-Save to localStorage ---
  useEffect(() => {
    const dataToSave = {
      guests,
      drinks,
      upgrades,
      rumors,
      relationships,
      storyEvents,
      gold,
      day,
      timeMinutes,
      lastSavedTimestamp: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {}
  }, [guests, drinks, upgrades, rumors, relationships, storyEvents, gold, day, timeMinutes]);

  // Audio toggles
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    tavernAudio.setSoundEnabled(next);
  };

  const toggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    tavernAudio.setMusicEnabled(next);
  };

  // Tavern capacity & fireplace upgrades
  const tableUpgrade = upgrades.find((u) => u.id === 'oak_table_expand');
  const maxCapacity = tableUpgrade && tableUpgrade.level >= 2 ? 5 : 3;
  const fireplaceLevel = upgrades.find((u) => u.id === 'fireplace_upgrade')?.level || 1;

  // --- Main Simulation Game Loop ---
  useEffect(() => {
    if (speed === 0) return;

    const intervalTime = 1000 / speed;

    const timer = setInterval(() => {
      setTimeMinutes((prev) => {
        const nextTime = prev + 1; // 1 second = 1 game minute

        // Night Closing Settlement Trigger at 02:00 (1560 minutes)
        if (nextTime >= 1560) {
          triggerNightSettlement();
          return 1560; // pause at 02:00 until player advances
        }
        return nextTime;
      });

      // 1. Guest Status: Natural Self-Drinking, Drunk Progression, and Action Pacing
      setGuests((currentGuests) => {
        return currentGuests.map((guest) => {
          if (!guest.status.isPresent || guest.status.seatIndex < 0) return guest;

          // (1) 客人自己喝酒也会增加醉酒度，同时减少杯中剩余酒水 (Self-drinking from their active drink)
          const currentDrink = drinks.find((d) => d.id === guest.status.currentDrinkId);
          let drunkDelta = 0;
          let drinkDecay = 0;

          if (guest.status.state < 4) {
            if (guest.status.currentDrinkId === 'spring_water' || guest.status.currentDrinkId === 'herbal_tea') {
              // Drinking spring water / herbal tea naturally cools down intoxication
              drunkDelta = -0.12;
              drinkDecay = 0.35;
            } else {
              // Drinking alcoholic brew: naturally sips and adds drunkenness over time
              const drinkPower = currentDrink ? currentDrink.alcoholPower : 14;
              const toleranceFactor = Math.max(0.3, 1 - guest.stats.alcoholTolerance / 200);
              // Adds ~0.15% to 0.30% per tick
              drunkDelta = (drinkPower * 0.012 + 0.10) * toleranceFactor;
              drinkDecay = 0.45; // ~2.5 to 3.5 minutes to finish one mug
            }
          }

          const nextDrunk = Math.max(0, Math.min(100, guest.status.drunkenness + drunkDelta));
          let nextRemaining = Math.max(0, (guest.status.drinkRemaining ?? 80) - drinkDecay);

          // 喝完一杯之后 (drinkRemaining <= 0): 依据离店概率掷骰，决定是离店还是再点一杯
          let chosenDrinkId = guest.status.currentDrinkId;
          let chosenDrinkName = guest.status.currentDrinkName;
          let triggeredLeaveOnEmpty = false;

          if (nextRemaining <= 0 && guest.status.state < 4) {
            const leaveRoll = Math.random();
            const currentLeaveProb = guest.status.leaveChance ?? 0.02;

            if (leaveRoll < currentLeaveProb * 1.5 || timeMinutes > 1500) {
              // 决定喝完离店
              triggeredLeaveOnEmpty = true;
            } else {
              // 决定再点一杯！随机选择常客喜好酒或酒馆解锁的经典普通酒品
              const availablePool = drinks.filter((d) => d.unlocked && d.id !== 'spring_water');
              const preferredPool = availablePool.filter((d) => guest.preferredDrinks.includes(d.id));
              const nextOrdered =
                preferredPool.length > 0 && Math.random() < 0.65
                  ? preferredPool[Math.floor(Math.random() * preferredPool.length)]
                  : availablePool[Math.floor(Math.random() * availablePool.length)] || drinks[1];

              chosenDrinkId = nextOrdered.id;
              chosenDrinkName = nextOrdered.name;
              nextRemaining = 100;

              // 客人再点一杯：扣除采购成本，玩家获得基础营收
              const billGain = Math.max(6, nextOrdered.cost + 2);
              setGold((prev) => prev + billGain);
              setNightIncome((prev) => prev + billGain);

              tavernAudio.playPour();

              addActivityLog(
                guest.name,
                `（意兴未尽，轻扣桌角）\n[再添佳酿] 喝尽了杯底残酒，意犹未尽地招手：“掌柜的，再满上一大杯【${nextOrdered.name}】！”（结算酒资 +${billGain} G）`,
                'drink',
                '续杯再斟',
                'bg-amber-950 text-amber-200',
                guest.id
              );
            }
          }

          let newState: DrunkState = 0;
          if (nextDrunk >= 85) newState = 4;
          else if (nextDrunk >= 60) newState = 3;
          else if (nextDrunk >= 40) newState = 2;
          else if (nextDrunk >= 20) newState = 1;

          // State transition narrative log
          if (newState !== guest.status.state) {
            const stateLabels = ['清醒', '微醺', '醉酒', '大醉', '不省人事'];
            const exp =
              newState === 4
                ? '双眼紧闭，呼吸深沉沉睡'
                : newState === 3
                  ? '满面潮红，眼波迷离'
                  : newState === 2
                    ? '面泛红晕，神色舒展'
                    : newState === 1
                      ? '眉宇舒缓，嘴角微翘'
                      : '神态清明，举止严谨';

            addActivityLog(
              guest.name,
              `（${exp}）\n[酒态渐变] 由【${stateLabels[guest.status.state]}】变为【${stateLabels[newState]}】。\n${
                newState === 4
                  ? '“呼……今晚……真是一场好梦……”（头枕在双臂上沉沉睡去）'
                  : newState === 3
                    ? '“拿酒来……我还能再喝三大杯！你们听我说……那年……”'
                    : newState === 1
                      ? '“呼……火光映在酒汤里真好看。”'
                      : ''
              }`,
              'drunk_change',
              '酒态渐变',
              'bg-purple-900 text-purple-200',
              guest.id
            );
          }

          // Expression update based on drunkenness & mood
          const expression =
            newState === 4
              ? '双目合阖，沉静安眠'
              : newState === 3
                ? '眼神迷离，脸颊绯红'
                : newState === 2
                  ? '若有所思，微笑端杯'
                  : newState === 1
                    ? '神色温和，自得其乐'
                    : '目光宁静，从容端坐';

          // (2) 角色动作触发: 动作和对话换行分开，神色用括号框住并前置
          let action = guest.status.currentAction;
          if (guest.status.actionTimer <= 0) {
            if (newState === 4) {
              action = 'sleeping';
            } else {
              const useCombo = Math.random() < 0.45 || !CHARACTER_ACTION_POOLS[guest.id];
              if (useCombo) {
                const combo = generateCombinatorialAction(guest);
                // Format: （神色）\n[动作] 动作内容
                const formattedActionText = `（${expression}）\n[${combo.tag}] ${combo.text}`;
                addActivityLog(
                  guest.name,
                  formattedActionText,
                  'action',
                  combo.tag,
                  'bg-stone-850 text-stone-300',
                  guest.id
                );
                action = 'idle';
              } else {
                const pool = CHARACTER_ACTION_POOLS[guest.id];
                const picked = pool[Math.floor(Math.random() * pool.length)];
                const formattedActionText = `（${expression}）\n[${picked.tag}] ${picked.text}`;
                addActivityLog(
                  guest.name,
                  formattedActionText,
                  'action',
                  picked.tag,
                  picked.tagColor,
                  guest.id
                );

                if (picked.tag.includes('琴') || picked.tag.includes('哼唱')) {
                  action = 'humming';
                } else if (picked.tag.includes('饮') || picked.tag.includes('酒')) {
                  action = 'drinking';
                } else if (picked.tag.includes('窗')) {
                  action = 'looking_window';
                } else {
                  action = 'idle';
                }
              }
            }
          }

          return {
            ...guest,
            status: {
              ...guest.status,
              drunkenness: nextDrunk,
              state: newState,
              currentDrinkId: chosenDrinkId,
              currentDrinkName: chosenDrinkName,
              drinkRemaining: nextRemaining,
              leaveChance: triggeredLeaveOnEmpty ? 0.99 : guest.status.leaveChance,
              currentAction: action,
              expression,
              actionTimer:
                guest.status.actionTimer <= 0
                  ? 45 + Math.floor(Math.random() * 35) // 45 to 80s pacing
                  : guest.status.actionTimer - 1,
            },
          };
        });
      });

      // 2. Guest Probabilistic Leave Execution (概率式离店判定，玩家不可见)
      setGuests((currentGuests) => {
        let anyLeft = false;
        const updated = currentGuests.map((g) => {
          if (!g.status.isPresent || g.status.seatIndex < 0) return g;

          // Base probability roll every second
          // Leave chance is increased when served alcohol, decreased when offered spring water
          // Late night after midnight (1440 min) slightly increases leave tendency
          let currentProb = g.status.leaveChance ?? 0.02;
          if (timeMinutes > 1440) currentProb += 0.015;
          if (g.status.state === 4) currentProb += 0.04; // Asleep guests leave sooner

          // Probabilistic departure roll (e.g. 0.005 ~ 0.03 chance each tick)
          const roll = Math.random();
          const shouldLeave = roll < currentProb * 0.04;

          if (shouldLeave) {
            anyLeft = true;
            // Settle tab + tips
            const baseTab = 14;
            const tipBonus = Math.max(3, Math.round(g.stats.mood * 0.16)) + g.stats.visitCount * 2;
            const totalBill = baseTab + tipBonus;

            setGold((prev) => prev + totalBill);
            setNightIncome((prev) => prev + baseTab);
            setNightTips((prev) => prev + tipBonus);

            tavernAudio.playCoin();

            // Retrieve character-specific farewell
            const farewell = getCharacterFarewell(g);
            const exp = g.status.expression || '目光温和';

            // Multi-line formatted bubble:
            // Line 1: （神色）
            // Line 2: [动作] 动作描述
            // Line 3: “台词内容”
            const formattedFarewellBubble = `（${exp}）\n[告别] 缓缓起身整理衣物\n“${farewell.quote}”`;

            setActiveBubbles((prev) => [
              ...prev.filter((b) => b.guestId !== g.id),
              {
                id: `farewell_${Date.now()}_${g.id}`,
                guestId: g.id,
                text: formattedFarewellBubble,
                type: 'chat',
                isCollectable: false,
                duration: 7,
                remainingTime: 7,
                createdAt: Date.now(),
              },
            ]);

            addActivityLog(
              g.name,
              `（${exp}）\n[告别离店] ${farewell.narrative}\n“${farewell.quote}”（结清酒资 +${totalBill} G）。`,
              'leave',
              '离店告别',
              'bg-rose-950 text-rose-300',
              g.id
            );

            showToast(`👋 【${g.name}】告别离店：“${farewell.quote.slice(0, 24)}...” (+${totalBill} G)`);

            // Mark hasDepartedTonight = true: guest will NOT re-enter for the rest of tonight
            return {
              ...g,
              status: {
                ...g.status,
                isPresent: false,
                seatIndex: -1,
                hasDepartedTonight: true,
                leaveTendency: 0,
              },
            };
          }
          return g;
        });

        return updated;
      });

      // 3. Guest Arrival Rotation (空位时间延长，陆续入场，且当夜已离店客人不再进入)
      if (Math.random() < 0.018) {
        setGuests((currentGuests) => {
          const occupiedSeatIndices = new Set(
            currentGuests.filter((g) => g.status.isPresent).map((g) => g.status.seatIndex)
          );

          // Find first open seat within maxCapacity
          let targetSeat = -1;
          for (let s = 0; s < maxCapacity; s++) {
            if (!occupiedSeatIndices.has(s)) {
              targetSeat = s;
              break;
            }
          }

          if (targetSeat !== -1) {
            // Find absent guests who have NOT departed tonight
            const absentGuests = currentGuests.filter(
              (g) => !g.status.isPresent && !g.status.hasDepartedTonight
            );
            if (absentGuests.length > 0) {
              const enteringGuest =
                absentGuests[Math.floor(Math.random() * absentGuests.length)];

              tavernAudio.playClink();

              addActivityLog(
                enteringGuest.name,
                `推开酒馆吱呀作响的厚重木门，抖落外衣上的夜雨，四顾之后在【${SEAT_COORDS[targetSeat].name}】落座。`,
                'arrive',
                '新客入座',
                'bg-emerald-950 text-emerald-300',
                enteringGuest.id
              );

              showToast(`🚪 【${enteringGuest.name}】冒雨推门步入酒馆，入座 ${SEAT_COORDS[targetSeat].name}`);
              setNightGuestsServed((c) => c + 1);

              // 随机化客人手中的酒水品类 (常客偏好优先，兼顾普通酒水)
              const unlockedDrinkPool = drinks.filter((d) => d.unlocked && d.id !== 'spring_water');
              const guestFavorites = unlockedDrinkPool.filter((d) => enteringGuest.preferredDrinks.includes(d.id));
              const randomDrink =
                guestFavorites.length > 0 && Math.random() < 0.7
                  ? guestFavorites[Math.floor(Math.random() * guestFavorites.length)]
                  : unlockedDrinkPool[Math.floor(Math.random() * unlockedDrinkPool.length)] || drinks[1];

              return currentGuests.map((g) =>
                g.id === enteringGuest.id
                  ? {
                      ...g,
                      stats: { ...g.stats, visitCount: g.stats.visitCount + 1 },
                      status: {
                        ...g.status,
                        isPresent: true,
                        seatIndex: targetSeat,
                        drunkenness: 6,
                        state: 0,
                        currentDrinkId: randomDrink.id,
                        currentDrinkName: randomDrink.name,
                        drinkRemaining: 70 + Math.floor(Math.random() * 30), // 70% to 100% full
                        leaveChance: 0.02,
                        hasDepartedTonight: false,
                        actionTimer: 40 + Math.floor(Math.random() * 25),
                        leaveTendency: 5,
                      },
                    }
                  : g
              );
            }
          }
          return currentGuests;
        });
      }

      // 4. Auto-Serve Mode (自动消耗采购金币并倒酒)
      if (autoServe) {
        setGuests((prev) => {
          let servedAny = false;
          let servedCost = 0;
          let servedGuestName = '';

          const updated = prev.map((g) => {
            if (!g.status.isPresent || g.status.seatIndex < 0) return g;
            // If sober/tipsy and we have gold, auto-serve malt ale (cost: 4G)
            if (g.status.drunkenness < 45 && gold >= 4 && !servedAny && Math.random() < 0.08) {
              servedAny = true;
              servedCost = 4;
              servedGuestName = g.name;

              return {
                ...g,
                status: {
                  ...g.status,
                  drunkenness: Math.min(100, g.status.drunkenness + 14),
                  state: (g.status.drunkenness + 14 >= 85
                    ? 4
                    : g.status.drunkenness + 14 >= 60
                      ? 3
                      : g.status.drunkenness + 14 >= 40
                        ? 2
                        : 1) as DrunkState,
                },
              };
            }
            return g;
          });

          if (servedAny) {
            setGold((c) => Math.max(0, c - servedCost));
            setNightExpenses((e) => e + servedCost);
            tavernAudio.playPour();
            addActivityLog(
              '酒保老查克',
              `自动为【${servedGuestName}】斟满一大杯新鲜麦芽黄啤（扣除酒水采购成本 -${servedCost} G）。`,
              'drink',
              '自动倒酒',
              'bg-amber-900 text-amber-200'
            );
          }
          return updated;
        });
      }

      // 5. Inter-Character Unique Banter & DND Director Multi-Round Conversation
      if (Math.random() < 0.045 && activeBubbles.length === 0) {
        // 50% chance to trigger DND Director Engine multi-round conversation, 50% classic banter
        const presentGuests = guests.filter((g) => g.status.isPresent && g.status.seatIndex >= 0);
        if (presentGuests.length >= 2 && Math.random() < 0.5) {
          const dirScene = runDndDirectorEngine(
            presentGuests,
            relationships,
            day,
            formatGameTime(timeMinutes),
            weather,
            activityLogs.map((l) => l.text).slice(-10)
          );

          if (dirScene) {
            setDirectorLogs((prev) => [dirScene, ...prev.slice(0, 49)]);

            // Log director round to live activity feed
            addActivityLog(
              '席间多轮闲谈',
              dirScene.summaryLog,
              'action',
              'DND闲谈',
              'bg-amber-950 text-amber-200'
            );

            // 同步更新好感度 (支持好感增加与降低)
            if (dirScene.affinityDeltas && dirScene.affinityDeltas.length > 0) {
              setRelationships((prev) =>
                prev.map((r) => {
                  const match = dirScene.affinityDeltas?.find(
                    (d) =>
                      (d.guestA === r.guestA && d.guestB === r.guestB) ||
                      (d.guestA === r.guestB && d.guestB === r.guestA)
                  );
                  if (match) {
                    const nextAffinity = Math.max(-100, Math.min(100, r.affinity + match.delta));
                    return {
                      ...r,
                      affinity: nextAffinity,
                    };
                  }
                  return r;
                })
              );
            }

            // Pop first speaker's round bubble formatted: （神色）\n[动作] 动作\n“台词”
            const r1 = dirScene.rounds[0];
            const speakerA = guests.find((g) => g.id === r1.speaker);
            if (speakerA) {
              const expA = speakerA.status.expression || '神色如常';
              const text1 = r1.line
                ? `（${expA}）\n[${r1.actionDesc || '举杯'}]\n“${r1.line}”`
                : `（${expA}）\n[${r1.actionDesc || '若有所思'}]`;

              const bubble1: DialogueBubble = {
                id: `dir_b1_${Date.now()}`,
                guestId: r1.speaker,
                text: text1,
                type: 'chat',
                isCollectable: false,
                duration: 8,
                remainingTime: 8,
                createdAt: Date.now(),
              };

              setActiveBubbles([bubble1]);

              // If Round 2 exists, trigger response bubble
              if (dirScene.rounds.length > 1) {
                setTimeout(() => {
                  const r2 = dirScene.rounds[1];
                  const speakerB = guests.find((g) => g.id === r2.speaker);
                  const expB = speakerB ? speakerB.status.expression || '神色自得' : '神色自得';
                  const text2 = r2.line
                    ? `（${expB}）\n[${r2.actionDesc || '应和'}]\n“${r2.line}”`
                    : `（${expB}）\n[${r2.actionDesc || '含笑'}]`;

                  const bubble2: DialogueBubble = {
                    id: `dir_b2_${Date.now()}`,
                    guestId: r2.speaker,
                    text: text2,
                    type: 'chat',
                    isCollectable: false,
                    duration: 8,
                    remainingTime: 8,
                    createdAt: Date.now(),
                  };
                  setActiveBubbles((prev) => [...prev.filter((b) => b.id !== bubble1.id), bubble2]);
                }, 4000);
              }
            }
          }
        } else {
          triggerInterCharacterBanter();
        }
      }

      // 6. Random Speech Bubble Spawner (降低出现概率至 ~3.5%，避免刷屏)
      if (Math.random() < 0.035 && activeBubbles.length < 2) {
        spawnRandomBubble();
      }

      // 7. Check Intertwined Story Events
      checkStoryTriggers();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [speed, autoServe, day, weather, fireplaceLevel, gold, timeMinutes, maxCapacity]);

  // Clean expired speech bubbles
  useEffect(() => {
    const bubbleTimer = setInterval(() => {
      setActiveBubbles((prev) =>
        prev
          .map((b) => ({ ...b, remainingTime: b.remainingTime - 1 }))
          .filter((b) => b.remainingTime > 0)
      );
    }, 1000);
    return () => clearInterval(bubbleTimer);
  }, []);

  // --- Trigger Night Closing Settlement (打烊清算) ---
  const triggerNightSettlement = () => {
    setSpeed(0); // Pause time
    tavernAudio.playPageTurn();

    const weathers: Array<'rain' | 'heavy_rain' | 'drizzle' | 'night_clear'> = [
      'rain',
      'heavy_rain',
      'drizzle',
      'night_clear',
    ];
    const nextW = weathers[Math.floor(Math.random() * weathers.length)];

    const netProfit = nightIncome + nightTips + nightRumorsFound * 5 - nightExpenses;

    setNightSettlementData({
      day,
      guestsServed: nightGuestsServed,
      drinkExpenses: nightExpenses,
      drinkIncome: nightIncome,
      tipsEarned: nightTips,
      rumorsFound: nightRumorsFound,
      netProfit,
      nextWeather: nextW,
    });
  };

  // --- Start Next Night (开启下一夜) ---
  const handleStartNextNight = () => {
    if (!nightSettlementData) return;

    setDay((d) => d + 1);
    setTimeMinutes(1080); // 18:00
    setWeather(nightSettlementData.nextWeather);

    // Reset night ledger counters
    setNightExpenses(0);
    setNightIncome(0);
    setNightTips(0);
    setNightRumorsFound(0);
    setNightGuestsServed(1);

    // Reset hasDepartedTonight = false for all guests, and start new night with 1 seated guest
    setGuests((currentGuests) =>
      currentGuests.map((g, idx) => ({
        ...g,
        status: {
          ...g.status,
          drunkenness: 0,
          state: 0,
          isPresent: idx === 0,
          seatIndex: idx === 0 ? 0 : -1,
          hasDepartedTonight: false,
          currentAction: 'idle',
          actionTimer: 45 + Math.floor(Math.random() * 20),
          leaveTendency: 5,
        },
      }))
    );

    setNightSettlementData(null);
    setSpeed(1); // Resume speed

    tavernAudio.playCollectRumor();

    addActivityLog(
      '系统',
      `第 ${day + 1} 夜营业开启（18:00），炉火重新升起，酒馆迎来了新的客人与故事。`,
      'system',
      '新夜开启',
      'bg-amber-900 text-amber-200'
    );

    showToast(`🌙 第 ${day + 1} 夜正式营业！窗外雨意更深，客人们已重新落座。`);
  };

  // --- Check Story Events ---
  const checkStoryTriggers = () => {
    if (activeCutscene) return;

    // 1. Mila & Paulin: The Lost Ballad
    const balladEvent = storyEvents.find((e) => e.id === 'event_the_lost_ballad');
    if (balladEvent && !balladEvent.completed) {
      const mila = guests.find((g) => g.id === 'mila');
      const paulin = guests.find((g) => g.id === 'paulin');
      if (
        mila &&
        mila.status.isPresent &&
        paulin &&
        paulin.status.isPresent &&
        mila.status.state >= 1 &&
        paulin.status.state >= 1
      ) {
        setActiveCutscene(balladEvent);
        return;
      }
    }

    // 2. Silas & Paulin: Cipher Seal
    const cipherEvent = storyEvents.find((e) => e.id === 'event_cipher_seal');
    if (cipherEvent && !cipherEvent.completed) {
      const silas = guests.find((g) => g.id === 'silas');
      const paulin = guests.find((g) => g.id === 'paulin');
      if (
        silas &&
        silas.status.isPresent &&
        paulin &&
        paulin.status.isPresent &&
        silas.status.state >= 1 &&
        paulin.status.state >= 2
      ) {
        setActiveCutscene(cipherEvent);
        return;
      }
    }

    // 3. Eileen & Bruno: Comrades Truce
    const truceEvent = storyEvents.find((e) => e.id === 'event_eileen_bruno_truce');
    if (truceEvent && !truceEvent.completed) {
      const eileen = guests.find((g) => g.id === 'eileen');
      const bruno = guests.find((g) => g.id === 'bruno');
      if (
        eileen &&
        eileen.status.isPresent &&
        bruno &&
        bruno.status.isPresent &&
        eileen.status.state >= 2 &&
        bruno.status.state >= 2
      ) {
        setActiveCutscene(truceEvent);
        return;
      }
    }
  };

  // --- Trigger Inter-Character Unique Banter (双人独特席间互动，受关系羁绊层级驱动) ---
  const triggerInterCharacterBanter = () => {
    const presentGuestIds = new Set(
      guests.filter((g) => g.status.isPresent && g.status.seatIndex >= 0).map((g) => g.id)
    );

    const TIER_ORDER: Record<string, number> = {
      stranger: 0,
      acquaintance: 1,
      friend: 2,
      confidant: 3,
    };

    const eligibleBanters = INTER_CHARACTER_BANTER.filter((b) => {
      if (!presentGuestIds.has(b.speakerA) || !presentGuestIds.has(b.speakerB)) return false;
      const gA = guests.find((g) => g.id === b.speakerA);
      const gB = guests.find((g) => g.id === b.speakerB);
      if (!gA || !gB) return false;

      if (b.minDrunkState !== undefined) {
        const meetsDrunk =
          gA.status.state >= b.minDrunkState || gB.status.state >= b.minDrunkState;
        if (!meetsDrunk) return false;
      }

      // Check current relationship tier between them
      const rel = relationships.find(
        (r) =>
          (r.guestA === b.speakerA && r.guestB === b.speakerB) ||
          (r.guestA === b.speakerB && r.guestB === b.speakerA)
      );
      const affinity = rel ? rel.affinity : 10;
      const currentTier = getRelationshipTier(affinity);

      if (b.requiredTier) {
        if (TIER_ORDER[currentTier] < TIER_ORDER[b.requiredTier]) {
          return false;
        }
      }
      return true;
    });

    if (eligibleBanters.length === 0) return;

    // Prioritize banter topics exactly matching current tier
    const exactTierBanters = eligibleBanters.filter((b) => {
      const rel = relationships.find(
        (r) =>
          (r.guestA === b.speakerA && r.guestB === b.speakerB) ||
          (r.guestA === b.speakerB && r.guestB === b.speakerA)
      );
      const currentTier = getRelationshipTier(rel ? rel.affinity : 10);
      return b.requiredTier === currentTier;
    });

    const candidatePool = exactTierBanters.length > 0 ? exactTierBanters : eligibleBanters;
    const chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const gA = guests.find((g) => g.id === chosen.speakerA);
    const gB = guests.find((g) => g.id === chosen.speakerB);
    if (!gA || !gB) return;

    const rel = relationships.find(
      (r) =>
        (r.guestA === chosen.speakerA && r.guestB === chosen.speakerB) ||
        (r.guestA === chosen.speakerB && r.guestB === chosen.speakerA)
    );
    const prevAffinity = rel ? rel.affinity : 10;
    const tier = getRelationshipTier(prevAffinity);
    const tierInfo = getTierLabel(tier);

    tavernAudio.playClink();

    // Log rich narrative interaction to LiveActivityFeed with relationship tier badge
    addActivityLog(
      `${gA.name} 与 ${gB.name}`,
      `【${tierInfo.label}】${chosen.logSummary}`,
      'action',
      tierInfo.label,
      tierInfo.color,
      gA.id
    );

    // 角色同桌之后，视发生的事件可能增加或者降低好感 (增进理解 +3~+4，口角分歧 -2~-3)
    const isTenseOrCold =
      chosen.logSummary.includes('冷淡') ||
      chosen.logSummary.includes('警戒') ||
      chosen.logSummary.includes('防备') ||
      chosen.logSummary.includes('龃龉') ||
      chosen.logSummary.includes('争执') ||
      (gA.status.state >= 3 && Math.random() < 0.35); // 醉酒胡言乱语也可能引发反感

    const affinityDelta = isTenseOrCold ? -3 : 4;
    const trustDelta = isTenseOrCold ? -1 : 2;

    setRelationships((prev) =>
      prev.map((r) => {
        if (
          (r.guestA === gA.id && r.guestB === gB.id) ||
          (r.guestA === gB.id && r.guestB === gA.id)
        ) {
          const nextAffinity = Math.max(-100, Math.min(100, r.affinity + affinityDelta));
          const oldTier = getRelationshipTier(r.affinity);
          const nextTier = getRelationshipTier(nextAffinity);
          if (nextTier !== oldTier) {
            const nextInfo = getTierLabel(nextTier);
            if (affinityDelta > 0) {
              showToast(`💖 【${gA.name}】与【${gB.name}】情谊更深，关系晋升为【${nextInfo.label}】！`);
            } else {
              showToast(`💔 【${gA.name}】与【${gB.name}】心生嫌隙，关系降为【${nextInfo.label}】。`);
            }
          }
          return {
            ...r,
            affinity: nextAffinity,
            trust: Math.max(0, Math.min(100, r.trust + trustDelta)),
          };
        }
        return r;
      })
    );

    // Tips from table atmosphere: 适度获取 (+2 G)，小幅提高金钱难度
    const atmosphereTip = isTenseOrCold ? 0 : 2;
    if (atmosphereTip > 0) {
      setGold((prev) => prev + atmosphereTip);
      setNightTips((prev) => prev + atmosphereTip);
    }

    // First bubble on Speaker A
    const bubble1: DialogueBubble = {
      id: `banter_${Date.now()}_1`,
      guestId: chosen.lines[0].speakerId,
      text: chosen.lines[0].text,
      type: 'chat',
      isCollectable: false,
      duration: 8,
      remainingTime: 8,
      createdAt: Date.now(),
    };

    setActiveBubbles([bubble1]);

    // Second response bubble on Speaker B after 3.5 seconds
    setTimeout(() => {
      const bubble2: DialogueBubble = {
        id: `banter_${Date.now()}_2`,
        guestId: chosen.lines[1].speakerId,
        text: chosen.lines[1].text,
        type: 'chat',
        isCollectable: false,
        duration: 9,
        remainingTime: 9,
        createdAt: Date.now(),
      };
      setActiveBubbles((prev) => [...prev.filter((b) => b.id !== bubble1.id), bubble2]);
    }, 3500);
  };

  // --- Spawn Speech Bubble (降低醉话频率，让醉话更有收集仪式感) ---
  const spawnRandomBubble = () => {
    const presentGuests = guests.filter((g) => g.status.isPresent && g.status.seatIndex >= 0);
    if (presentGuests.length === 0) return;

    const drunkGuests = presentGuests.filter((g) => g.status.state >= 1);
    const candidateGuests =
      drunkGuests.length > 0 && Math.random() < 0.75 ? drunkGuests : presentGuests;

    const randomGuest = candidateGuests[Math.floor(Math.random() * candidateGuests.length)];
    if (activeBubbles.some((b) => b.guestId === randomGuest.id)) return;

    const state = randomGuest.status.state;

    // Sober guests only have a small chance of a quiet ambient chat (not collectable)
    if (state === 0 && Math.random() > 0.25) return;

    const lines = DIALOGUE_LIBRARY[randomGuest.id]?.[state] || [
      '“……酒杯里倒映着火苗。”',
      '“这炉火真是舒服啊。”',
      '“呼……好酒。”',
    ];
    const text = lines[Math.floor(Math.random() * lines.length)];

    const isDrunkWord = state >= 1;
    const isSecretClue = state >= 2 && Math.random() < 0.35;

    const newBubble: DialogueBubble = {
      id: `bubble_${Date.now()}_${Math.random()}`,
      guestId: randomGuest.id,
      text,
      type: state === 4 ? 'sleep' : isSecretClue ? 'secret_clue' : isDrunkWord ? 'drunken_word' : 'chat',
      isCollectable: isDrunkWord || isSecretClue,
      duration: isSecretClue ? 20 : isDrunkWord ? 15 : 8,
      remainingTime: isSecretClue ? 20 : isDrunkWord ? 15 : 8,
      createdAt: Date.now(),
    };

    setActiveBubbles((prev) => [...prev, newBubble]);
  };

  // --- Serve Drink: Costs Tavern Gold (扣除采购金币，增加离店概率，更新当前饮品) ---
  const handleServeDrink = (guestId: string, drink: Drink) => {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) return;

    // Check if player has enough gold to purchase/pour this drink
    if (gold < drink.cost) {
      showToast(`⚠️ 金币不足！采购开启一壶【${drink.name}】需要花费 ${drink.cost} G！`);
      return;
    }

    // Deduct procurement cost from tavern treasury
    setGold((prev) => prev - drink.cost);
    setNightExpenses((prev) => prev + drink.cost);

    tavernAudio.playPour();
    setTimeout(() => tavernAudio.playClink(), 250);

    // Tip bonus if guest loves this drink
    const isPreferred = guest.preferredDrinks.includes(drink.id);
    const immediateTip = isPreferred ? 3 : 0;
    if (immediateTip > 0) {
      setGold((prev) => prev + immediateTip);
      setNightTips((prev) => prev + immediateTip);
    }

    const exp = isPreferred ? '眉开眼笑，目光泛彩' : '神态自若，从容颔首';

    // Formatted multi-line activity log
    addActivityLog(
      guest.name,
      `（${exp}）\n[端杯饮酒] 接过刚斟上的【${drink.name}】，惬意抿了一大口。\n“${
        isPreferred ? '“好酒！正合我的口味！”' : '“入口醇厚，驱散了今晚的夜寒。”'
      }”（花费采购成本 -${drink.cost} G${immediateTip > 0 ? '，额外打赏小费 +3 G' : ''}）。`,
      'drink',
      '呈上美酒',
      'bg-amber-950 text-amber-300',
      guest.id
    );

    // Increase drunkenness & mood, increase leaveChance (+0.045, max 0.40)
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== guestId) return g;
        const drunkInc = drink.alcoholPower * (1 - g.stats.alcoholTolerance / 180);
        const nextDrunk = Math.max(0, Math.min(100, g.status.drunkenness + drunkInc));

        let nextState: DrunkState = 0;
        if (nextDrunk >= 85) nextState = 4;
        else if (nextDrunk >= 60) nextState = 3;
        else if (nextDrunk >= 40) nextState = 2;
        else if (nextDrunk >= 20) nextState = 1;

        // Serving alcohol increases leave chance (每呈上一杯酒离店概率增加)
        const nextLeaveChance = Math.min(0.40, (g.status.leaveChance ?? 0.02) + 0.045);

        // Check if unlocked a secret
        const updatedSecrets = g.secrets.map((sec) => {
          if (!sec.unlocked && nextState >= sec.requiredDrunkState) {
            showToast(`✨ 【${g.name}】在醉意中吐露了深层心事，已收录进《酒馆轶闻录》！`);
            tavernAudio.playCollectRumor();

            const newRumor: RumorRecord = {
              id: `rumor_sec_${Date.now()}`,
              guestId: g.id,
              guestName: g.name,
              text: sec.text,
              category: 'secret',
              drunkStateName: nextState === 2 ? '醉酒' : '大醉',
              day,
              timeStr: formatGameTime(timeMinutes),
              isKeyClue: Boolean(sec.storyClue),
              isTrue: true,
              clueAnnotation: sec.storyClue,
              unlockedAt: Date.now(),
            };
            setRumors((r) => {
              if (r.some((item) => item.guestId === g.id && item.text === sec.text)) {
                return r;
              }
              return [newRumor, ...r];
            });
            setNightRumorsFound((c) => c + 1);

            return { ...sec, unlocked: true };
          }
          return sec;
        });

        return {
          ...g,
          secrets: updatedSecrets,
          stats: {
            ...g.stats,
            mood: Math.min(100, g.stats.mood + drink.moodBonus),
            familiarity: Math.min(100, g.stats.familiarity + 2),
          },
          status: {
            ...g.status,
            drunkenness: nextDrunk,
            state: nextState,
            currentDrinkId: drink.id,
            currentDrinkName: drink.name,
            leaveChance: nextLeaveChance,
            expression: exp,
            currentAction: 'drinking',
            actionTimer: 8,
          },
        };
      })
    );

    showToast(`🍺 为【${guest.name}】开桶倒上一壶 ${drink.name}（花费采购金币 -${drink.cost} G）`);
  };

  // --- Offer Free Spring Water (端来冰水离店概率减少，降低醉酒度，更新当前饮品) ---
  const handleOfferWater = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) return;

    tavernAudio.playPour();

    const exp = '神色舒缓，目光清亮';

    addActivityLog(
      guest.name,
      `（${exp}）\n[饮冰泉解渴] 接过老酒保端来的冰镇清泉，连饮数口，长舒一口气。\n“呼……清凉透彻，头脑清晰了不少。”`,
      'action',
      '饮冰泉醒酒',
      'bg-sky-950 text-sky-300',
      guest.id
    );

    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== guestId) return g;
        const nextDrunk = Math.max(0, g.status.drunkenness - 25);
        let nextState: DrunkState = 0;
        if (nextDrunk >= 85) nextState = 4;
        else if (nextDrunk >= 60) nextState = 3;
        else if (nextDrunk >= 40) nextState = 2;
        else if (nextDrunk >= 20) nextState = 1;

        // Offering water decreases leave chance (端来冰水离店概率减少)
        const nextLeaveChance = Math.max(0.005, (g.status.leaveChance ?? 0.02) - 0.06);

        return {
          ...g,
          stats: {
            ...g.stats,
            mood: Math.min(100, g.stats.mood + 8),
          },
          status: {
            ...g.status,
            drunkenness: nextDrunk,
            state: nextState,
            currentDrinkId: 'spring_water',
            currentDrinkName: '冰镇清泉',
            leaveChance: nextLeaveChance,
            expression: exp,
            currentAction: 'idle',
            actionTimer: 6,
          },
        };
      })
    );

    showToast(`💧 为【${guest.name}】端上一碗清冽泉水，醉意大大缓解，更愿多留片刻。`);
  };

  // --- Polite Manual Checkout / Leave (礼貌结账送客) ---
  const handleSettleAndLeave = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest || !guest.status.isPresent) return;

    const baseTab = 14;
    const tipBonus = Math.max(3, Math.round(guest.stats.mood * 0.16)) + guest.stats.visitCount * 2;
    const totalBill = baseTab + tipBonus;

    setGold((prev) => prev + totalBill);
    setNightIncome((prev) => prev + baseTab);
    setNightTips((prev) => prev + tipBonus);

    tavernAudio.playCoin();

    // Retrieve deep, character-specific farewell quote and narrative
    const farewell = getCharacterFarewell(guest);

    // Pop speech bubble on departing guest
    setActiveBubbles((prev) => [
      ...prev.filter((b) => b.guestId !== guest.id),
      {
        id: `farewell_${Date.now()}_${guest.id}`,
        guestId: guest.id,
        text: farewell.quote,
        type: 'chat',
        isCollectable: false,
        duration: 7,
        remainingTime: 7,
        createdAt: Date.now(),
      },
    ]);

    addActivityLog(
      guest.name,
      `${farewell.narrative} 礼貌结清今夜酒钱与小费（+${totalBill} G）。`,
      'leave',
      '离店告别',
      'bg-rose-950 text-rose-300',
      guest.id
    );

    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? {
              ...g,
              status: {
                ...g.status,
                isPresent: false,
                seatIndex: -1,
                hasDepartedTonight: true, // Will not re-enter tonight
                leaveTendency: 0,
              },
            }
          : g
      )
    );

    setSelectedGuestId(null);
    showToast(`👋 【${guest.name}】告别离店：“${farewell.quote.slice(0, 24)}...” (+${totalBill} G)`);
  };

  // --- Collect Bubble by Click ---
  const handleCollectBubble = (bubbleId: string) => {
    const bubble = activeBubbles.find((b) => b.id === bubbleId);
    if (!bubble) return;

    tavernAudio.playCollectRumor();

    const speaker = guests.find((g) => g.id === bubble.guestId);
    if (!speaker) return;

    // 检查是否已收录过该对话 (不要重复收录已被记录的对话)
    const alreadyRecorded = rumors.some(
      (r) => r.guestId === speaker.id && r.text.trim() === bubble.text.trim()
    );

    if (alreadyRecorded) {
      showToast(`📖 【${speaker.name}】的这段话此前已收录在册，无需重复抄录。`);
      setActiveBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
      return;
    }

    const newRumor: RumorRecord = {
      id: `rumor_${Date.now()}`,
      guestId: speaker.id,
      guestName: speaker.name,
      text: bubble.text,
      category: bubble.type === 'secret_clue' ? 'key_clue' : 'general',
      drunkStateName:
        speaker.status.state === 1
          ? '微醺'
          : speaker.status.state === 2
            ? '醉酒'
            : speaker.status.state === 3
              ? '大醉'
              : '入梦',
      day,
      timeStr: formatGameTime(timeMinutes),
      isKeyClue: bubble.type === 'secret_clue',
      isTrue: true,
      clueAnnotation: bubble.type === 'secret_clue' ? '关键剧情线索' : '日常酒桌醉话',
      unlockedAt: Date.now(),
    };

    setRumors((prev) => [newRumor, ...prev]);
    setNightRumorsFound((c) => c + 1);

    setGold((prev) => prev + 3); // 收益调整：每次收录获得 +3 G
    setGuests((prev) =>
      prev.map((g) =>
        g.id === speaker.id
          ? {
              ...g,
              stats: { ...g.stats, familiarity: Math.min(100, g.stats.familiarity + 2) },
            }
          : g
      )
    );

    addActivityLog(
      speaker.name,
      `刚才吐露的一番醉语心事：${bubble.text} 已被酒保悄悄记入《酒馆轶闻录》中。`,
      'action',
      '醉话收录',
      'bg-amber-900 text-amber-200',
      speaker.id
    );

    setActiveBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
    showToast(`📜 成功收录【${speaker.name}】的醉话到《酒馆轶闻录》 (+5 G)`);
  };

  // --- Buy Upgrade ---
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find((u) => u.id === upgradeId);
    if (!upgrade || gold < upgrade.cost || upgrade.level >= upgrade.maxLevel) return;

    tavernAudio.playCoin();
    setGold((prev) => prev - upgrade.cost);

    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === upgradeId) {
          return {
            ...u,
            level: u.level + 1,
            cost: Math.round(u.cost * 1.6),
          };
        }
        return u;
      })
    );

    if (upgradeId === 'oak_table_expand') {
      showToast('🎉 红橡酒桌扩建完成！新增中央酒桌与吧台席位，酒馆席位扩展至 5 位！');
      addActivityLog(
        '酒馆改造',
        '木匠工匠连夜送来了精制加长红橡木板与软皮高脚吧台凳，酒馆席位扩充至 5 席！',
        'system',
        '席位扩建',
        'bg-sky-950 text-sky-200'
      );
    } else if (upgradeId === 'cellar_license') {
      setDrinks((prev) =>
        prev.map((d) =>
          d.id === 'dwarf_stout' || d.id === 'starlight_wine' ? { ...d, unlocked: true } : d
        )
      );
      showToast('🍷 珍藏酒窖修缮成功！黑麦烈酒与星光夜光酒已上架出售！');
    } else {
      showToast(`🔨 ${upgrade.name} 升级成功！`);
    }
  };

  // --- Save Custom Character ---
  const handleSaveCustomGuest = (newGuest: Guest) => {
    const occupiedSeats = guests
      .filter((g) => g.status.isPresent)
      .map((g) => g.status.seatIndex);
    let openSeat = -1;
    for (let s = 0; s < maxCapacity; s++) {
      if (!occupiedSeats.includes(s)) {
        openSeat = s;
        break;
      }
    }

    const guestToSeat: Guest = {
      ...newGuest,
      status: {
        ...newGuest.status,
        isPresent: openSeat !== -1,
        seatIndex: openSeat,
      },
    };

    // 自动为自定义角色生成今日见闻手札与写生纪念品
    const customTravel = generateCustomGuestTravel(guestToSeat, day);
    setTravelEntries((prev) => [customTravel, ...prev]);

    setGuests((prev) => [...prev, guestToSeat]);
    setSelectedGuestId(guestToSeat.id);
    tavernAudio.playCoin();

    addActivityLog(
      newGuest.name,
      `新客人【${newGuest.name}】（${newGuest.title}）推门进入酒馆，正式成为常客名录的一员！白天的游历手札已载入《今日见闻》。`,
      'arrive',
      '自定入驻',
      'bg-amber-950 text-amber-300',
      newGuest.id
    );

    showToast(`🌟 欢迎新客人【${newGuest.name}】进入酒馆！已同步生成今日见闻手札。`);
  };

  // --- Complete Story Cutscene ---
  const handleCompleteCutscene = (event: TavernStoryEvent) => {
    setStoryEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, completed: true } : e))
    );

    if (event.keyClueReward) {
      setRumors((prev) => [event.keyClueReward!, ...prev]);
      setNightRumorsFound((c) => c + 1);
    }

    setActiveCutscene(null);
    setGold((prev) => prev + 25);
    tavernAudio.playCollectRumor();

    addActivityLog(
      '核心剧情大事件',
      `【${event.title}】圆满触发！客人们确认了关键线索，真相正浮出水面。`,
      'system',
      '主线剧情',
      'bg-amber-900 text-amber-200'
    );

    showToast(`📜 剧情大事件【${event.title}】圆满触发！线索已收入轶闻录 (+25 G)`);
  };

  // --- Reset Game (重置游戏) ---
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    setGuests(INITIAL_GUESTS);
    setDrinks(INITIAL_DRINKS);
    setUpgrades(TAVERN_UPGRADES);
    setRumors([]);
    setRelationships(INITIAL_RELATIONSHIPS);
    setStoryEvents(STORY_EVENTS);
    setDirectorLogs([]);
    setGold(32);
    setDay(1);
    setTimeMinutes(1080);
    setSpeed(1);
    setAutoServe(false);
    setNightExpenses(0);
    setNightIncome(0);
    setNightTips(0);
    setNightGuestsServed(1);
    setNightRumorsFound(0);
    setSelectedGuestId('mila');
    setActiveBubbles([]);
    setShowResetConfirm(false);

    tavernAudio.playPageTurn();
    showToast('🔄 游戏数据已全面重置！酒馆重回第一夜营业起点。');
  };

  const selectedGuest = guests.find((g) => g.id === selectedGuestId) || null;

  function formatGameTime(minutes: number) {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="border-b border-amber-950/80 bg-stone-900/90 backdrop-blur px-4 py-2 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-950 border border-amber-800/80 rounded-lg text-amber-400 shadow">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold font-serif text-amber-100 tracking-wider">
                最后一杯酒
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/50">
                THE LAST ROUND
              </span>
            </div>
            <p className="text-[11px] text-amber-300/60 hidden sm:block">
              慢节奏像素叙事酒馆 · 聆听客人的醉话与往事
            </p>
          </div>
        </div>

        {/* Center: Time, Weather & Economic Status */}
        <div className="flex items-center gap-3 sm:gap-6 bg-stone-950/80 px-4 py-1.5 rounded-xl border border-stone-800">
          {/* Day & Clock */}
          <div className="flex items-center gap-2 text-xs">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-amber-200">第 {day} 夜</span>
            <span className="text-stone-400 font-mono text-sm">
              {formatGameTime(timeMinutes)}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
              营业中
            </span>
          </div>

          {/* Weather */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-sky-300">
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span>
              {weather === 'heavy_rain'
                ? '暴雨雷鸣'
                : weather === 'rain'
                  ? '窗外细雨'
                  : weather === 'drizzle'
                    ? '夜风微雨'
                    : '月明夜静'}
            </span>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-800/40">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono">{gold} G</span>
          </div>
        </div>

        {/* Right Controls: Speed, Auto-serve & Audio */}
        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <div className="flex items-center bg-stone-800/80 rounded-lg p-0.5 border border-stone-700">
            <button
              onClick={() => setSpeed(speed === 0 ? 1 : 0)}
              className={`p-1.5 rounded text-xs transition-colors ${
                speed === 0 ? 'bg-amber-800 text-amber-100' : 'text-stone-400 hover:text-stone-200'
              }`}
              title={speed === 0 ? '继续营业' : '暂停时间'}
            >
              {speed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setSpeed(1)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                speed === 1 ? 'bg-amber-900/80 text-amber-200' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(2)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                speed === 2 ? 'bg-amber-900/80 text-amber-200' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => setSpeed(4)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                speed === 4 ? 'bg-amber-900/80 text-amber-200' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="4倍速快进"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto-Serve Button */}
          <button
            onClick={() => setAutoServe(!autoServe)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
              autoServe
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600/60 shadow'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
            }`}
            title="开启后老酒保将自主为客人采购倒酒与送水"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoServe ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">自动营业</span>
          </button>

          {/* Audio Toggles */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? 'bg-amber-950 text-amber-300 border-amber-800/60'
                : 'bg-stone-800 text-stone-500 border-stone-700'
            }`}
            title="环境音效开关 (炉火与窗雨)"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Game Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-lg border border-red-900/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:text-red-100 text-xs transition-colors"
            title="重置游戏进度 (重新开始第一夜)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-950/95 border-2 border-amber-600/80 text-amber-100 px-4 py-2 rounded-xl text-xs font-medium shadow-2xl backdrop-blur animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row p-3 gap-3 max-w-[1500px] w-full mx-auto">
        {/* Left / Center Area: Canvas + Seated Strip + Live Activity Feed */}
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          {/* Tavern Canvas with dynamic table capacity */}
          <TavernCanvas
            guests={guests}
            selectedGuestId={selectedGuestId}
            activeBubbles={activeBubbles}
            onSelectGuest={(id) => setSelectedGuestId(id)}
            onCollectBubble={handleCollectBubble}
            weather={weather}
            fireplaceLevel={fireplaceLevel}
            maxCapacity={maxCapacity}
            onOpenUpgrade={() => setShowUpgrades(true)}
          />

          {/* Seated Guests Avatars Strip */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-400 shrink-0 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                座客 ({guests.filter((g) => g.status.isPresent).length}/{maxCapacity}):
              </span>
              <div className="flex items-center gap-2">
                {guests
                  .filter((g) => g.status.isPresent)
                  .map((g) => {
                    const isSelected = selectedGuestId === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGuestId(g.id)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-xs ${
                          isSelected
                            ? 'bg-amber-950 border-amber-600 text-amber-200 ring-2 ring-amber-500/30'
                            : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px]"
                          style={{ backgroundColor: g.appearance.outfitColor }}
                        >
                          {g.name.charAt(0)}
                        </div>
                        <span className="font-medium">{g.name}</span>
                        <span className="text-[10px] text-amber-400">
                          {Math.round(g.status.drunkenness)}%
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {maxCapacity < 5 && (
              <button
                onClick={() => setShowUpgrades(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 flex items-center gap-1 transition-colors"
              >
                <Hammer className="w-3 h-3" /> 升级酒桌扩建席位 (3/5)
              </button>
            )}
          </div>

          {/* Real-time Textual Activity Log Feed (屏幕下方实时更新的行为文字) */}
          <LiveActivityFeed
            logs={activityLogs}
            onSelectGuest={(id) => setSelectedGuestId(id)}
          />
        </div>

        {/* Right Area: Selected Guest Action Panel */}
        <div className="w-full lg:w-96 shrink-0">
          <GuestPanel
            guest={selectedGuest}
            availableDrinks={drinks}
            gold={gold}
            relationships={relationships}
            allGuests={guests}
            onClose={() => setSelectedGuestId(null)}
            onServeDrink={handleServeDrink}
            onOfferWater={handleOfferWater}
            onSettleAndLeave={handleSettleAndLeave}
          />
        </div>
      </main>

      {/* Bottom Sticky Toolbar Navigation */}
      <footer className="border-t border-amber-950/80 bg-stone-900/90 backdrop-blur py-2 px-4 sticky bottom-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-around sm:justify-center gap-2 sm:gap-6">
          <button
            onClick={() => setShowTravelJournal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-bold transition-all shadow-md hover:scale-105"
            title="查看客人白天的旅行明信片手札与特产纪念品（类似《旅行青蛙》）"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>今日见闻手札</span>
          </button>

          <button
            onClick={() => setShowDirectorHistory(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition-all shadow hover:scale-105"
            title="查看DND闲谈导演多轮对谈与动作记忆日志"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>闲谈导演记事</span>
          </button>

          <button
            onClick={() => setShowRumorBook(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition-all shadow-md hover:scale-105"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>《酒馆轶闻录》</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-900 text-amber-300 border border-amber-700">
              {rumors.length}
            </span>
          </button>

          <button
            onClick={() => setShowCompendium(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition-all shadow hover:scale-105"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>客人图鉴</span>
          </button>

          <button
            onClick={() => setShowCreator(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition-all shadow hover:scale-105"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>自定客人</span>
          </button>

          <button
            onClick={() => setShowUpgrades(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition-all shadow hover:scale-105"
          >
            <Hammer className="w-4 h-4 text-amber-400" />
            <span>酒馆升级</span>
          </button>
        </div>
      </footer>

      {/* --- Modals --- */}
      {/* Daily Travel Postcard & Souvenirs Modal (类似《旅行青蛙》见闻手札) */}
      <DailyTravelModal
        isOpen={showTravelJournal}
        onClose={() => setShowTravelJournal(false)}
        guests={guests}
        travelEntries={travelEntries}
        unlockedSouvenirs={unlockedSouvenirs}
      />

      {/* DND Director Dialogue & Action History Log */}
      <DirectorLogModal
        isOpen={showDirectorHistory}
        onClose={() => setShowDirectorHistory(false)}
        logs={directorLogs}
        guests={guests}
        relationships={relationships}
      />

      {/* Rumor Journal */}
      <RumorBookModal
        isOpen={showRumorBook}
        onClose={() => setShowRumorBook(false)}
        rumors={rumors}
      />

      {/* Guest Compendium */}
      <GuestCompendiumModal
        isOpen={showCompendium}
        onClose={() => setShowCompendium(false)}
        guests={guests}
        relationships={relationships}
      />

      {/* Character Creator */}
      <CharacterCreatorModal
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onSaveCharacter={handleSaveCustomGuest}
        existingGuests={guests}
      />

      {/* Tavern Upgrades */}
      <TavernUpgradeModal
        isOpen={showUpgrades}
        onClose={() => setShowUpgrades(false)}
        upgrades={upgrades}
        gold={gold}
        onBuyUpgrade={handleBuyUpgrade}
      />

      {/* Night End Transition Ledger (打烊清算与夜色交替) */}
      <NightSettlementModal
        isOpen={Boolean(nightSettlementData)}
        data={nightSettlementData}
        currentGold={gold}
        onStartNextNight={handleStartNextNight}
      />

      {/* Story Event Cutscene */}
      {activeCutscene && (
        <StoryCutsceneModal
          event={activeCutscene}
          guests={guests}
          onComplete={handleCompleteCutscene}
        />
      )}

      {/* Reset Game Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border-2 border-red-900/80 rounded-2xl p-6 text-stone-200 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-lg font-bold font-serif text-red-200">
                确定要重置全部酒馆经营进度吗？
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              此操作将清除所有保存的酒馆数据，包括已结交的角色羁绊、解锁的秘密与轶闻录、珍藏酒窖升级以及金币累积，将酒馆完全还原至第一夜营业的起始状态。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold transition-colors"
              >
                取消保留
              </button>
              <button
                onClick={handleResetGame}
                className="px-4 py-2 bg-red-900/80 hover:bg-red-800 border border-red-600/80 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                确认重置重开
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
