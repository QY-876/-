import {
  ActionTemplate,
  DialogueTemplate,
  DirectorOutput,
  DirectorRound,
  DndIntent,
  DndTopic,
  Guest,
  Relationship,
  RelationshipTier,
} from '../types/game';
import {
  DND_ACTION_TEMPLATES,
  DND_DIALOGUE_TEMPLATES,
} from '../data/dndDirectorTemplates';
import { getRelationshipTier } from './sentenceTemplates';

// Cooldown Tracker Cache
const templateTriggerHistory: string[] = []; // Last 10 template IDs triggered globally
const actorTopicCooldowns: Record<string, number> = {}; // key: `${actorA}_${actorB}_${topic}` => day
let consecutiveActionWithSpeechCount = 0;

// Blacklist validator for modern vocabulary (DND Immersion Hard Barrier)
const FORBIDDEN_MODERN_WORDS = [
  '手机', '系统', 'ok', 'OK', '打卡', '项目', '效率', '网络', '电脑',
  '程序', '数据', '界面', '代码', 'bug', 'Bug', 'BUG', '服务器', '微信',
  '外卖', '人工智能', 'ai', 'AI', '工作流', '考核', '绩效',
];

export function validateDndSpeech(text: string): boolean {
  const lower = text.toLowerCase();
  for (const word of FORBIDDEN_MODERN_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      return false;
    }
  }
  return true;
}

/**
 * Calculates candidate score based on section 3.4 formula:
 * score = 基础权重 + 情境相关度 + 关系匹配 + 情绪匹配 + 个性匹配 + 记忆相关 - 冷却惩罚
 */
function scoreTemplate(
  tpl: DialogueTemplate,
  actorA: Guest,
  actorB: Guest,
  currentStage: 'stranger' | 'acquaintance' | 'intimate',
  currentDay: number,
  weather: string,
  recentLines: string[]
): number {
  let score = tpl.weight;

  // 1. Relationship stage match
  if (tpl.relationshipStage === currentStage) {
    score += 15;
  } else if (
    (currentStage === 'intimate' && tpl.relationshipStage === 'acquaintance') ||
    (currentStage === 'acquaintance' && tpl.relationshipStage === 'stranger')
  ) {
    score += 6;
  } else {
    score -= 10;
  }

  // 2. Context relevance (weather, fatigue, recent event)
  if (tpl.topic === 'weather' && (weather.includes('rain') || weather.includes('storm'))) {
    score += 8;
  }
  if (tpl.topic === 'fatigue' && (actorA.stats.mood < 40 || actorB.stats.mood < 40)) {
    score += 10;
  }
  if (tpl.topic === 'recent_event' && (actorA.todayTravel?.length || actorB.todayTravel?.length)) {
    score += 12;
  }

  // 3. Personality match
  if (actorA.personality.includes('豪爽') && tpl.intent === 'invite') score += 6;
  if (actorA.personality.includes('戒备') && tpl.intent === 'complain') score += 5;
  if (actorA.personality.includes('感性') && tpl.intent === 'comfort') score += 7;

  // 4. Global cooldown penalty (same template within last 10 triggers)
  const recentIdx = templateTriggerHistory.indexOf(tpl.id);
  if (recentIdx !== -1) {
    score -= 30; // Heavy penalty
  }

  // 5. Actor-topic pair cooldown penalty (3 game days cooldown)
  const pairTopicKey = `${actorA.id}_${actorB.id}_${tpl.topic}`;
  const lastTriggeredDay = actorTopicCooldowns[pairTopicKey];
  if (lastTriggeredDay !== undefined && currentDay - lastTriggeredDay < 3) {
    score -= 25;
  }

  // 6. Recent line repetition penalty
  for (const l of tpl.lines) {
    if (recentLines.some((r) => r.includes(l.slice(1, 8)))) {
      score -= 35;
    }
  }

  return score;
}

/**
 * Orchestrates a compliant, multi-round DND dialogue & action scene
 */
export function runDndDirectorEngine(
  presentGuests: Guest[],
  relationships: Relationship[],
  day: number,
  timeStr: string,
  weather: string,
  recentLines: string[]
): DirectorOutput | null {
  if (presentGuests.length < 2) return null;

  // Pick primary initiator and responder from seated guests
  const speakerA = presentGuests[Math.floor(Math.random() * presentGuests.length)];
  const eligibleB = presentGuests.filter((g) => g.id !== speakerA.id);
  if (eligibleB.length === 0) return null;
  const speakerB = eligibleB[Math.floor(Math.random() * eligibleB.length)];

  // Find relationship affinity & stage
  const rel = relationships.find(
    (r) =>
      (r.guestA === speakerA.id && r.guestB === speakerB.id) ||
      (r.guestA === speakerB.id && r.guestB === speakerA.id)
  );
  const affinity = rel ? rel.affinity : 15;
  const tier: RelationshipTier = getRelationshipTier(affinity);
  const currentStage: 'stranger' | 'acquaintance' | 'intimate' =
    tier === 'confidant' || tier === 'friend'
      ? 'intimate'
      : tier === 'acquaintance'
        ? 'acquaintance'
        : 'stranger';

  // Check action throttle rule: consecutive 3 actions with speech forced to be pure action or silence
  const forcePureAction = consecutiveActionWithSpeechCount >= 3;

  if (forcePureAction) {
    consecutiveActionWithSpeechCount = 0; // reset throttle
    // Pick a pure nonverbal or environmental action
    const actionTpl =
      DND_ACTION_TEMPLATES.find((a) => a.type === 'nonverbal' || a.type === 'environment') ||
      DND_ACTION_TEMPLATES[0];
    const desc = actionTpl.descriptions[Math.floor(Math.random() * actionTpl.descriptions.length)];

    const round: DirectorRound = {
      roundIndex: 1,
      speaker: speakerA.id,
      target: speakerB.id,
      channel: 'action',
      actionId: actionTpl.id,
      actionDesc: desc,
      actionPhase: 'standalone',
      effectsSuggested: { relation: { [speakerB.id]: 1 } },
      memory: `${speakerA.name}与${speakerB.name}默契对视，各自举杯痛饮。`,
    };

    return {
      id: `dir_scene_${Date.now()}`,
      sceneId: `tavern_night_${day}`,
      day,
      timeStr,
      rounds: [round],
      silence: false,
      summaryLog: `【席间默契】${speakerA.name} ${desc}，同桌气氛温暖祥和。`,
      affinityDeltas: [{ guestA: speakerA.id, guestB: speakerB.id, delta: 1 }],
    };
  }

  // 1. Select template for Speaker A
  const scoredTemplates = DND_DIALOGUE_TEMPLATES.map((tpl) => ({
    tpl,
    score: scoreTemplate(tpl, speakerA, speakerB, currentStage, day, weather, recentLines),
  })).sort((a, b) => b.score - a.score);

  const bestCandidate = scoredTemplates[0];
  if (!bestCandidate || bestCandidate.score < -15) {
    // If no good template, fallback to calm action
    const actionTpl = DND_ACTION_TEMPLATES[Math.floor(Math.random() * DND_ACTION_TEMPLATES.length)];
    const desc = actionTpl.descriptions[Math.floor(Math.random() * actionTpl.descriptions.length)];
    return {
      id: `dir_scene_${Date.now()}`,
      sceneId: `tavern_night_${day}`,
      day,
      timeStr,
      rounds: [
        {
          roundIndex: 1,
          speaker: speakerA.id,
          target: speakerB.id,
          channel: 'action',
          actionId: actionTpl.id,
          actionDesc: desc,
          actionPhase: 'standalone',
        },
      ],
      silence: false,
      summaryLog: `${speakerA.name} ${desc}。`,
    };
  }

  const chosenTpl = bestCandidate.tpl;
  const rawLineA = chosenTpl.lines[Math.floor(Math.random() * chosenTpl.lines.length)];

  // Validate line
  if (!validateDndSpeech(rawLineA)) return null;

  // Pick companion action for Speaker A
  const actionA = DND_ACTION_TEMPLATES[Math.floor(Math.random() * DND_ACTION_TEMPLATES.length)];
  const actionDescA = actionA.descriptions[Math.floor(Math.random() * actionA.descriptions.length)];

  // 2. Formulate Response from Speaker B
  let lineB = '';
  let actionDescB = '';
  let intentB: DndIntent = 'comfort';

  // Responsive logic based on intent
  if (chosenTpl.intent === 'complain') {
    intentB = 'comfort';
    lineB =
      currentStage === 'intimate'
        ? '“老朋友，把这杯热酒闷了。天大的难处，明早酒醒了老子陪你扛。”'
        : '“放宽心，多烤烤火暖暖胃，在这酒馆里歇下便好。”';
    actionDescB = '伸手拍了拍木桌，推过一碗温热麦酒。';
  } else if (chosenTpl.intent === 'invite') {
    intentB = 'greet';
    lineB =
      currentStage === 'intimate'
        ? '“好！既然你开了口，明天天一亮，老城门不见不散！”'
        : '“多谢抬爱，难得今夜炉火正旺，这杯酒我干了！”';
    actionDescB = '爽快举杯相碰，酒沫微溅。';
  } else if (chosenTpl.intent === 'gossip') {
    intentB = 'gossip';
    lineB =
      currentStage === 'intimate'
        ? '“这件事我也隐隐听北境老兵提过……山里的封印怕是有变故。”'
        : '“荒原怪事年年有，喝完这杯各自小心便是。”';
    actionDescB = '警觉地环视了一圈四周的阴影，压低了嗓门。';
  } else if (chosenTpl.intent === 'brag') {
    intentB = 'greet';
    lineB =
      currentStage === 'intimate'
        ? '“哈哈哈！你当年那点勇力，酒馆里的老木梁都听出老茧了！”'
        : '“真不愧是百战身手，听得人热血沸腾。”';
    actionDescB = '摇头失笑，给对方空了的杯底再添了一小注烈酒。';
  } else {
    intentB = 'greet';
    lineB =
      currentStage === 'intimate'
        ? '“炉火正暖，今夜不论风雪，只管痛饮畅谈！”'
        : '“客气了，在这偏远小镇，同坐一桌就是缘分。”';
    actionDescB = '微微颔首，神情惬意自得。';
  }

  // 3. Optional Round 3 (Third actor observation / reaction)
  const thirdActors = presentGuests.filter((g) => g.id !== speakerA.id && g.id !== speakerB.id);
  const rounds: DirectorRound[] = [];

  // Round 1
  rounds.push({
    roundIndex: 1,
    speaker: speakerA.id,
    target: speakerB.id,
    channel: 'mixed',
    intent: chosenTpl.intent,
    topic: chosenTpl.topic,
    templateId: chosenTpl.id,
    line: rawLineA,
    actionId: actionA.id,
    actionDesc: actionDescA,
    actionPhase: 'pre_line',
    effectsSuggested: { relation: { [speakerB.id]: 2 } },
    memory: `${speakerA.name}与${speakerB.name}就【${chosenTpl.topic}】展开了交谈。`,
  });

  // Round 2
  rounds.push({
    roundIndex: 2,
    speaker: speakerB.id,
    target: speakerA.id,
    channel: 'mixed',
    intent: intentB,
    topic: chosenTpl.topic,
    line: lineB,
    actionDesc: actionDescB,
    actionPhase: 'post_line',
    effectsSuggested: { relation: { [speakerA.id]: 2 } },
    memory: `${speakerB.name}回应了${speakerA.name}关于【${chosenTpl.topic}】的话题。`,
  });

  // Round 3 (Third actor reaction with 40% probability)
  if (thirdActors.length > 0 && Math.random() < 0.4) {
    const actorC = thirdActors[0];
    const reactionC =
      actorC.personality.includes('豪爽')
        ? '在身侧仰头猛灌了一口烈酒，大声连赞好酒好话！'
        : actorC.personality.includes('腼腆')
          ? '借着烛光在笔记本空白页添了一笔记述，嘴角泛着浅笑。'
          : actorC.personality.includes('戒备')
            ? '指尖轻压在腰间短匕上，目光深邃地扫视了一眼窗外夜雨。'
            : '静静听着二人的对白，往壁炉里投了一小块干松木。';

    rounds.push({
      roundIndex: 3,
      speaker: actorC.id,
      channel: 'action',
      actionDesc: reactionC,
      actionPhase: 'standalone',
      effectsSuggested: { relation: { [speakerA.id]: 1, [speakerB.id]: 1 } },
      memory: `${actorC.name}在一旁静听了酒桌谈话。`,
    });
  }

  // Update Cooldowns and Throttle Tracking
  consecutiveActionWithSpeechCount++;
  templateTriggerHistory.unshift(chosenTpl.id);
  if (templateTriggerHistory.length > 10) templateTriggerHistory.pop();
  actorTopicCooldowns[`${speakerA.id}_${speakerB.id}_${chosenTpl.topic}`] = day;

  // Determine affinity delta: arguments/complaints or friction can decrease relationship (-2 to -4), while bonding increases it (+3 to +5)
  let affinityDelta = 3;
  if (chosenTpl.intent === 'complain') {
    affinityDelta = Math.random() < 0.4 ? -2 : 1;
  } else if (chosenTpl.intent === 'comfort' || chosenTpl.intent === 'invite') {
    affinityDelta = 4;
  } else if (chosenTpl.intent === 'brag') {
    affinityDelta = Math.random() < 0.35 ? -1 : 2;
  } else if (chosenTpl.intent === 'apologize') {
    affinityDelta = 3;
  }

  // Build high-level readable summary for activity feed & modal
  const summaryLog = `【${speakerA.name} 与 ${speakerB.name}】${speakerA.name}${actionDescA}，谈及【${chosenTpl.topic}】；${speakerB.name}${actionDescB}相迎。${
    affinityDelta > 0
      ? `两人相谈甚欢，席间羁绊加深（+${affinityDelta}）`
      : `观点分歧微生龃龉，气氛稍显尴尬（${affinityDelta}）`
  }。`;

  return {
    id: `dir_scene_${Date.now()}`,
    sceneId: `tavern_night_${day}`,
    day,
    timeStr,
    rounds,
    silence: false,
    summaryLog,
    affinityDeltas: [{ guestA: speakerA.id, guestB: speakerB.id, delta: affinityDelta }],
  };
}
