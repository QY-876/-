export type DrunkState = 0 | 1 | 2 | 3 | 4; 
// 0: 清醒 (Sober)
// 1: 微醺 (Tipsy)
// 2: 醉酒 (Inebriated)
// 3: 大醉 (Drunk)
// 4: 不省人事 (Passed Out)

export interface GuestAppearance {
  bodyType: 'human' | 'elf' | 'dwarf' | 'halfling';
  skinColor: string;
  hairStyle: string; // 'short' | 'long' | 'curly' | 'bald' | 'braid' | 'ponytail' | 'wizard_hat' | 'hood'
  hairColor: string;
  faceFeature: 'clean' | 'beard_red' | 'beard_gray' | 'glasses' | 'scar' | 'freckles';
  outfit: 'bard_tunic' | 'smith_apron' | 'mage_robe' | 'ranger_leather' | 'plate_armor' | 'noble_vest';
  outfitColor: string;
  accessory: 'none' | 'feather_hat' | 'eyepatch' | 'locket' | 'cloak' | 'flute';
}

export interface GuestStats {
  alcoholTolerance: number; // 0-100 (affects how fast drunk builds up)
  mood: number; // -100 to 100
  caution: number; // 0-100 (high caution means needs more drunk to reveal secrets)
  familiarity: number; // 0-100 (increases with each visit/interaction)
  visitCount: number;
}

export interface GuestStatus {
  drunkenness: number; // 0-100
  state: DrunkState;
  seatIndex: number; // 0 to 4 (-1 if outside)
  isPresent: boolean;
  hasDepartedTonight?: boolean; // If departed, will not re-enter for the rest of tonight
  currentAction: 'idle' | 'drinking' | 'humming' | 'sleeping' | 'quarreling' | 'looking_window' | 'talking';
  actionTimer: number;
  leaveChance: number; // 隐秘离店概率 (0.01 to 0.40)，每上一杯酒增加，端水减少，对玩家完全隐藏
  currentDrinkId: string; // 角色当前在喝的酒水 ID
  currentDrinkName: string; // 角色当前在喝的酒水名称
  drinkRemaining: number; // 当前酒水还剩多少 (0-100%)，喝完后掷骰离店或再点一杯
  expression?: string; // 角色当前的神态/表情 (用括号框住并前置)
  leaveTendency?: number;
}

export type RelationshipTier = 'stranger' | 'acquaintance' | 'friend' | 'confidant';

// DND System Intent & Topic Types (第一版 8 意图 × 12 话题)
export type DndIntent =
  | 'greet'       // 招呼
  | 'complain'    // 抱怨
  | 'invite'      // 邀请
  | 'gossip'      // 八卦
  | 'comfort'     // 安慰
  | 'brag'        // 炫耀
  | 'apologize'   // 道歉
  | 'farewell';   // 告别

export type DndTopic =
  | 'weather'       // 天气
  | 'food'          // 食物/酒水
  | 'work'          // 工作/生计
  | 'fatigue'       // 疲劳/伤患
  | 'character'     // 某角色
  | 'recent_event'  // 最近事件/游历
  | 'festival'      // 节日/庆典
  | 'location'      // 地点/遗迹
  | 'goal'          // 目标/誓约
  | 'gold'          // 金钱/花销
  | 'mood'          // 心情/思绪
  | 'rumor';        // 传闻/秘闻

// DND 动作系统独立通道 (8 类动作通道与 4 种表现位)
export type ActionType =
  | 'state'         // 状态 (揉太阳穴、哈气暖手)
  | 'social'        // 社交 (举杯致意、拍桌)
  | 'emotion'       // 情绪 (叹气、掩面失笑)
  | 'relation'      // 关系 (递上热膏、碰杯)
  | 'environment'   // 环境 (望窗听雨、挑动炉火)
  | 'item'          // 道具 (擦拭短匕、调音、翻看星盘)
  | 'group'         // 群体 (同桌哄笑、同声敬酒)
  | 'nonverbal';    // 非语言回应 (微微颔首、沉默耸肩)

export type ActionPhase = 'standalone' | 'pre_line' | 'post_line' | 'substitute';

export interface DialogueTemplate {
  id: string;
  intent: DndIntent;
  topic: DndTopic;
  relationshipStage: 'stranger' | 'acquaintance' | 'intimate';
  tone: string;
  lines: string[];
  slots?: string[];
  cooldownDays?: number;
  weight: number;
}

export interface ActionTemplate {
  id: string;
  type: ActionType;
  phase: ActionPhase;
  descriptions: string[];
  tag: string;
  tagColor: string;
  weight: number;
}

export interface DirectorRound {
  roundIndex: number;
  speaker: string;
  target?: string;
  channel: 'dialogue' | 'action' | 'mixed' | 'silence';
  intent?: DndIntent;
  topic?: DndTopic;
  templateId?: string;
  line?: string;
  actionId?: string;
  actionDesc?: string;
  actionPhase?: ActionPhase;
  effectsSuggested?: {
    relation?: Record<string, number>;
    mood?: Record<string, number>;
  };
  memory?: string;
  requestCheck?: string | null;
}

export interface DirectorOutput {
  id: string;
  sceneId: string;
  day: number;
  timeStr: string;
  rounds: DirectorRound[];
  silence: boolean;
  notes?: string;
  summaryLog: string;
  affinityDeltas?: { guestA: string; guestB: string; delta: number }[];
}

// 《旅行青蛙》式：角色今日游历见闻手记与纪念品
export interface SouvenirItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  rarity: 'common' | 'uncommon' | 'rare';
  acquiredDate: number;
  acquiredLocation: string;
  guestId: string;
}

export interface DailyTravelEntry {
  id: string;
  guestId: string;
  guestName: string;
  day: number;
  timeOfDay: '清晨' | '正午' | '午后' | '黄昏';
  location: string;
  title: string;
  storyText: string;
  sketchType: 'windmill' | 'snow_forest' | 'ancient_tower' | 'stream_rose' | 'forge_ruins' | 'stable' | 'market';
  souvenir?: SouvenirItem;
  moodSummary: string;
  dialogueHook: string; // 晚上在酒馆闲谈时可自然引用的今日话题
  unlocked: boolean;
}

export interface Guest {
  id: string;
  name: string;
  title: string;
  age: number;
  race: string;
  occupation: string;
  classType?: 'bard' | 'fighter' | 'wizard' | 'ranger' | 'cleric' | 'rogue';
  languages?: string[];
  spellsKnown?: string[];
  voice?: string;
  taboos?: string[];
  knowledgeLimits?: string[];
  preferredActions?: string[];
  personality: string[];
  preferredDrinks: string[]; // drink IDs
  dislikedDrinks: string[];
  background: string;
  memories?: string[];
  todayTravel?: DailyTravelEntry[];
  secrets: {
    id: string;
    text: string;
    requiredDrunkState: DrunkState;
    unlocked: boolean;
    storyClue?: string;
  }[];
  appearance: GuestAppearance;
  stats: GuestStats;
  status: GuestStatus;
  isCustom?: boolean;
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  cost: number; // Tavern serving price earned
  alcoholPower: number; // Drunk increase (negative for water)
  moodBonus: number;
  tasteCategory: 'refreshing' | 'ale' | 'sweet' | 'strong' | 'mystic' | 'legendary';
  iconName: string;
  color: string;
  unlocked: boolean;
  unlockCost?: number;
}

export interface DialogueBubble {
  id: string;
  guestId: string;
  speakerName?: string;
  text: string;
  actionDesc?: string;
  type: 'chat' | 'drunken_word' | 'secret_clue' | 'event' | 'conflict' | 'romance' | 'sleep' | 'director_round';
  isCollectable: boolean;
  collected?: boolean;
  duration: number; // seconds to display
  remainingTime: number;
  createdAt: number;
  storyArcId?: string;
  targetGuestId?: string;
  roundIndex?: number;
}

export interface RumorRecord {
  id: string;
  guestId: string;
  guestName: string;
  text: string;
  category: 'general' | 'secret' | 'relationship' | 'key_clue';
  drunkStateName: string;
  day: number;
  timeStr: string;
  storyArcId?: string;
  isKeyClue: boolean;
  isTrue: boolean;
  clueAnnotation?: string;
  verified?: boolean;
  unlockedAt: number;
}

export interface Relationship {
  id: string;
  guestA: string;
  guestB: string;
  type: 'friend' | 'stranger' | 'comrade' | 'lover' | 'rival' | 'relative';
  affinity: number; // -100 to 100
  trust: number; // 0 to 100
  memories: string[];
  unlockedEvents: string[];
  lastTopicDate?: Record<string, number>; // Topic cooldown tracker
}

export interface TavernStoryEvent {
  id: string;
  title: string;
  participants: string[];
  description: string;
  dialogueChain: {
    speakerId: string;
    text: string;
    action?: string;
  }[];
  keyClueReward?: RumorRecord;
  completed: boolean;
}

export interface TavernUpgrade {
  id: string;
  name: string;
  category: 'furnishing' | 'capacity' | 'cellar' | 'ambience';
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  icon: string;
  effectText: string;
}

export interface LiveActivityLog {
  id: string;
  timeStr: string;
  guestId?: string;
  guestName: string;
  type: 'action' | 'drink' | 'leave' | 'arrive' | 'drunk_change' | 'system' | 'director_scene';
  text: string;
  tag?: string;
  tagColor?: string;
  directorDetails?: DirectorOutput;
}

export interface NightSettlementData {
  day: number;
  guestsServed: number;
  drinkExpenses: number;
  drinkIncome: number;
  tipsEarned: number;
  rumorsFound: number;
  netProfit: number;
  nextWeather: 'rain' | 'heavy_rain' | 'drizzle' | 'night_clear';
}


