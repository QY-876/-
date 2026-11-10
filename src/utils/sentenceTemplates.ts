import { Guest, RelationshipTier } from '../types/game';

/**
 * Returns the friendship / relationship tier based on numerical affinity.
 */
export function getRelationshipTier(affinity: number): RelationshipTier {
  if (affinity >= 85) return 'confidant';
  if (affinity >= 60) return 'friend';
  if (affinity >= 30) return 'acquaintance';
  return 'stranger';
}

export function getTierLabel(tier: RelationshipTier): { label: string; color: string; desc: string } {
  switch (tier) {
    case 'confidant':
      return {
        label: '生死之交',
        color: 'bg-rose-950 text-rose-300 border-rose-700/60',
        desc: '倾心相托，生死相随，无话不谈的宿命伙伴',
      };
    case 'friend':
      return {
        label: '莫逆好友',
        color: 'bg-amber-950 text-amber-300 border-amber-700/60',
        desc: '谈笑风生，互知彼此往事与酒桌习性',
      };
    case 'acquaintance':
      return {
        label: '初识熟客',
        color: 'bg-indigo-950 text-indigo-300 border-indigo-700/60',
        desc: '彼此面熟，偶尔搭话寒暄，试探彼此背景',
      };
    default:
      return {
        label: '偶遇过客',
        color: 'bg-stone-850 text-stone-300 border-stone-700/60',
        desc: '仅在酒馆打过照面，言谈谨慎拘谨',
      };
  }
}

/**
 * Returns a deeply in-character farewell quote when leaving the tavern.
 */
export function getCharacterFarewell(guest: Guest): { quote: string; narrative: string } {
  const isDrunk = guest.status.state >= 2;

  switch (guest.id) {
    case 'mila':
      if (isDrunk) {
        return {
          quote: '“呜……头好轻飘飘的……妈妈的残曲，我今晚似乎又想通了两小节旋律……波林大叔，别忘了我们的约定，明晚见啦……”',
          narrative: '半精灵吟游诗人微晃着身子将琉特琴小心收入琴囊，朝炉火边的众人挥了挥手，踩着轻快的醉步踏入雨幕。',
        };
      }
      return {
        quote: '“夜深了呢，琴弦在潮湿的夜风里也需要归囊休眠了。多谢你的温热蜂蜜甜酿，老酒保，愿明天的风带来好消息！”',
        narrative: '米拉站起身，仔细拉好绣有绿叶纹饰的风衣扣，将赏钱整齐叠在杯盘旁，轻盈推门告别。',
      };

    case 'paulin':
      if (isDrunk) {
        return {
          quote: '“（重重一拍桌子，摇摇晃晃站起）老子没醉！克劳德……你小子明天最好在老子的梦里说清楚！酒钱在桌角，一子儿不少！明晚老子再来！”',
          narrative: '矮人铁匠大师大着舌头粗声吼道，把一把磨光发亮的铜银币按在桌上，迈开沉重敦实的短腿大步走出店门。',
        };
      }
      return {
        quote: '“雨势见小了，老子得回铺子里给淬火炉封火温胚了。多出来的几枚小费留着换把牢靠点的实木长椅吧，明晚给我留一整桶黑麦！”',
        narrative: '波林收好铁手套，拍了拍红胡子上的麦沫，向老酒保投来一个赞许的眼神，迎着夜风离店。',
      };

    case 'silas':
      if (isDrunk) {
        return {
          quote: '“（面颊通红，推正滑落的眼镜）星图……星图的引力透镜正在闭合……我必须在药劲过去前，把刚才想通的公式抄录在羊皮卷上……谢、谢谢您的酒水，我得回塔了……”',
          narrative: '年轻法师脚步踉跄但神情异常兴奋，怀抱羊皮笔记如获至宝，顶着法师尖帽匆匆推门钻入夜色。',
        };
      }
      return {
        quote: '“法师高塔后半夜会有巡夜导师查房……若是被发现擅自溜下山小酌，下周的符文实验课就惨了。感谢您的安静角落与清冽泉水，晚安。”',
        narrative: '西拉斯将桌上散落的星轨炭笔一一收纳进皮套，彬彬有礼地向酒保欠身行礼后踏出门外。',
      };

    case 'eileen':
      return {
        quote: '“后半夜林区边缘的雪狼会出来逡巡猎食，我该回北哨所换岗了。门别反锁，荒原猎人永远只认窗里的炉火与手中的硬弓。走了。”',
        narrative: '艾琳把兜帽深压至鼻梁，只露出一双鹰隼般敏锐的眸子，身形如孤狼般轻盈无声地融入夜雨之中。',
      };

    case 'bruno':
      return {
        quote: '“（按着桌角稳稳立起身躯，右膝传来熟悉的轻微咔哒声）热酒下肚，老膝盖总算不酸疼了。镇上马厩的几匹小马驹该喂二茬干草了，明天傍晚老子再来捧场。”',
        narrative: '重装老兵整肃好腰间皮带，在桌上排开擦得发亮的铜币，魁梧的身躯推门走向街尾马厩。',
      };

    default:
      // Custom guests tailored to their personalities
      if (guest.personality.includes('傲慢')) {
        return {
          quote: '“哼，今晚的酒品勉强配得上本人的品味。这是赏钱，不必找零了，明晚可别让我失望。”',
          narrative: `【${guest.name}】拂了拂衣袍，留下沉甸甸的赏金，昂然步出酒馆。`,
        };
      } else if (guest.personality.includes('豪爽')) {
        return {
          quote: '“哈哈哈！痛快！好久没喝得这么尽兴了！老酒保，明晚可得备足好酒等我！”',
          narrative: `【${guest.name}】把空酒杯倒扣在桌上以示喝净，大笑着阔步推门离店。`,
        };
      } else if (guest.personality.includes('戒备')) {
        return {
          quote: '“夜雾越来越浓了，不宜久留。酒钱付清，告辞。”',
          narrative: `【${guest.name}】握紧防身短刃，低头警觉地环视一圈后快速闪入街巷。`,
        };
      }
      return {
        quote: '“多谢老板款待，今夜的炉火很温暖，改日有空再来畅饮。”',
        narrative: `【${guest.name}】结清酒水账目，向酒保致谢后缓缓踏入夜雨。`,
      };
  }
}

// Modular combinatorial components for dynamic text synthesis
const MOOD_PREFIXES = [
  '托着下巴，若有所思地',
  '目光流转在跳跃的火苗上，神情平和地',
  '眼神中带着一丝风尘仆仆的倦意，但嘴角含笑地',
  '静静听着窗棂上敲击的连绵雨滴，微微动容地',
  '端着陶杯轻摇琥珀色的酒水，指尖感受着陶土余温地',
  '深吸了一口弥漫在空气中的麦芽香与松木清香，惬意地',
];

const THEMATIC_TOPICS = [
  '回想起多年前第一次踏上这片荒原大陆时的情景',
  '想起旅途中偶遇的那座长满幽蓝月光草的废弃古代石廊',
  '暗自琢磨着明天行囊里还需要补给多少干粮与火石',
  '对酒馆壁炉里玄武岩散发出的恒温热浪感到格外舒心',
  '默默打量着挂在吧台横梁上的风干野草与铜酒壶',
];

/**
 * Generates an assembled, atmospheric narrative sentence.
 */
export function generateCombinatorialAction(guest: Guest): { text: string; tag: string } {
  const prefix = MOOD_PREFIXES[Math.floor(Math.random() * MOOD_PREFIXES.length)];
  const topic = THEMATIC_TOPICS[Math.floor(Math.random() * THEMATIC_TOPICS.length)];

  return {
    text: `${prefix}${topic}。`,
    tag: '举止神态',
  };
}
