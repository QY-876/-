import { DailyTravelEntry, Guest, SouvenirItem } from '../types/game';

export const INITIAL_SOUVENIRS: SouvenirItem[] = [
  {
    id: 'souvenir_rose_bookmark',
    name: '风干野月季花签',
    description: '在旧风息磨坊水车石阶旁采摘的淡粉色野月季，压平在琴谱间，带着清淡草木香。',
    iconName: 'Flower2',
    rarity: 'common',
    acquiredDate: 1,
    acquiredLocation: '风息磨坊水车畔',
    guestId: 'mila',
  },
  {
    id: 'souvenir_copper_ore',
    name: '粗粝黄铜矿原石',
    description: '从灰岩矿脉塌方碎石断层中亲手敲落的原石，切面泛着星点金黄的针状结晶。',
    iconName: 'Gem',
    rarity: 'uncommon',
    acquiredDate: 1,
    acquiredLocation: '灰岩矿脉探勘残洞',
    guestId: 'paulin',
  },
  {
    id: 'souvenir_sundial_ruler',
    name: '微雕星象黄铜刻尺',
    description: '法师高塔天顶日晷台边遗落的古旧铜标尺，刻有第三纪元的二十八宿角偏距。',
    iconName: 'Compass',
    rarity: 'rare',
    acquiredDate: 1,
    acquiredLocation: '法师高塔天顶日晷台',
    guestId: 'silas',
  },
  {
    id: 'souvenir_pine_resin',
    name: '天然雪松脂香球',
    description: '从百年冷杉伤口处凝结的一团晶莹琥珀色松脂，在掌心揉搓能散发驱寒清香。',
    iconName: 'TreePine',
    rarity: 'common',
    acquiredDate: 1,
    acquiredLocation: '黑松林雪线瞭望哨',
    guestId: 'eileen',
  },
  {
    id: 'souvenir_lucky_horseshoe',
    name: '磨光的幸运小马蹄铁',
    description: '驿站小枣红马换下的一只旧马蹄铁，布鲁诺用粗砂纸细细打磨得锃亮光滑。',
    iconName: 'Shield',
    rarity: 'common',
    acquiredDate: 1,
    acquiredLocation: '西区驿站马厩',
    guestId: 'bruno',
  },
];

export const INITIAL_TRAVEL_ENTRIES: DailyTravelEntry[] = [
  // --- Mila ---
  {
    id: 'travel_mila_1',
    guestId: 'mila',
    guestName: '米拉',
    day: 1,
    timeOfDay: '午后',
    location: '风息磨坊水车畔',
    title: '水车青苔与蓝顶雀',
    storyText: '午后阳光斜照，在年久失修的风息磨坊前，水车慢悠悠地转着，溅起细碎的水雾。我在被阳光晒暖的旧石阶上弹了一会儿琉特琴，一只蓝顶山雀落在了琴轴上，歪着小脑袋听完了整段《林冠微光》的舒缓小节。',
    sketchType: 'windmill',
    souvenir: INITIAL_SOUVENIRS[0],
    moodSummary: '神清气爽，琴音通透',
    dialogueHook: '今天下午在旧风息磨坊那儿，水车转得真安静，水汽里全都是青苔与野花香。',
    unlocked: true,
  },
  {
    id: 'travel_mila_2',
    guestId: 'mila',
    guestName: '米拉',
    day: 2,
    timeOfDay: '黄昏',
    location: '白桦林古石碑基座',
    title: '石碑上被青苔覆盖的五度音程',
    storyText: '在绿荫谷与落羽沼泽交界的白桦林里，发现了一座半倾倒在灌木丛中的古代誓约碑。用手帕拭去青苔后，基座背面居然刻有五组古风信音阶！我小心翼翼地取出羊皮纸用炭笔拓印了下来，指尖似乎感受到了多年前琴师刻石时的温度。',
    sketchType: 'stream_rose',
    souvenir: {
      id: 'souvenir_rubbing_fragment',
      name: '银黎拓印残卷',
      description: '用细炭粉在羊皮纸上拓印下的古代琴符痕迹，泛着淡淡的松烟气味。',
      iconName: 'Scroll',
      rarity: 'rare',
      acquiredDate: 2,
      acquiredLocation: '白桦林古石碑基座',
      guestId: 'mila',
    },
    moodSummary: '怀念母亲，心潮微澜',
    dialogueHook: '白桦林里那块残碑……上面的琴符刻痕，真的和我母亲琴盒里的暗纹一模一样。',
    unlocked: false,
  },
  {
    id: 'travel_mila_3',
    guestId: 'mila',
    guestName: '米拉',
    day: 3,
    timeOfDay: '正午',
    location: '镇中心集市杂货旧铺',
    title: '尘封书箱里的金色银杏叶',
    storyText: '在集市老商贩的樟木旧书箱深处翻找，居然淘到了一卷残损但装订牢固的古歌谣手稿。翻开封皮，里面夹着一片早已风干发脆的金黄银杏叶，叶柄上系着细细的红丝绳，不知道是哪位远行客留下的思念。',
    sketchType: 'market',
    souvenir: {
      id: 'souvenir_ginkgo_leaf',
      name: '干制金杏叶书签',
      description: '叶脉完整清晰的古银杏标本，系着褪色的红绳。',
      iconName: 'Sparkles',
      rarity: 'common',
      acquiredDate: 3,
      acquiredLocation: '镇中心集市杂货旧铺',
      guestId: 'mila',
    },
    moodSummary: '宁静欣喜，收获满满',
    dialogueHook: '今天在集市杂货堆里翻到了一卷老旧乐谱封皮，还带着淡淡的旧木与干花香。',
    unlocked: false,
  },

  // --- Paulin ---
  {
    id: 'travel_paulin_1',
    guestId: 'paulin',
    guestName: '波林',
    day: 1,
    timeOfDay: '清晨',
    location: '灰岩矿脉探勘残洞',
    title: '碎石堆下敲出的黄铜断层',
    storyText: '清早披着旧皮袄、提着小地质锤和矿镐去旧坑道敲打。在塌方碎石底下刨了足足半个时辰，终于敲出一块沉甸甸的黄铜矿石原石！断口闪着针状金属光芒，是矮人秘传的高温淬火极品助熔料。',
    sketchType: 'forge_ruins',
    souvenir: INITIAL_SOUVENIRS[1],
    moodSummary: '痛快爽利，手发微痒',
    dialogueHook: '老子今天早上去灰岩矿坑转悠了一圈，还真从断层里刨出了两块带铜花的硬料！',
    unlocked: true,
  },
  {
    id: 'travel_paulin_2',
    guestId: 'paulin',
    guestName: '波林',
    day: 2,
    timeOfDay: '午后',
    location: '城郊废弃的铁匠铺老水磨',
    title: '三十年不锈的矮人冷锻铁砧',
    storyText: '去查看三十年前一位族兄留下的荒废铁匠铺。风箱虽然早已腐朽，但那尊两百磅的重型冷锻铁砧依然横卧在石台上，钢面平整如镜，毫无锈痕！老子伸手拍了拍它，就像拍在多年老友坚实的肩膀上。',
    sketchType: 'forge_ruins',
    souvenir: {
      id: 'souvenir_anvil_washer',
      name: '微缩冷锻铁垫圈',
      description: '经受过数万次锻打的古矮人淬火垫片，拿在手里冰凉沉重。',
      iconName: 'Hammer',
      rarity: 'uncommon',
      acquiredDate: 2,
      acquiredLocation: '城郊废弃的铁匠铺老水磨',
      guestId: 'paulin',
    },
    moodSummary: '感慨万千，铁血依旧',
    dialogueHook: '城郊那间荒废了几十年的老铁砧，钢面硬得连风雨都咬不动，真想生把火把风箱修好！',
    unlocked: false,
  },

  // --- Silas ---
  {
    id: 'travel_silas_1',
    guestId: 'silas',
    guestName: '西拉斯',
    day: 1,
    timeOfDay: '清晨',
    location: '法师高塔天顶日晷台',
    title: '拂晓时分第七星轨的微小离轴',
    storyText: '清晨趁着高塔巡夜魔偶换岗的空档，悄悄顺着螺旋石梯溜上了高塔露天观测台。东方初露鱼肚白时，第一缕晨曦掠过铜制日晷针，在星盘第七象限投下一道幽紫的微弱折射光芒，计算得出的空间张力与导师失踪前的记录完全吻合！',
    sketchType: 'ancient_tower',
    souvenir: INITIAL_SOUVENIRS[2],
    moodSummary: '神经紧绷但无比狂喜',
    dialogueHook: '今天破晓时天顶石台的日晷刻度……第七象限的偏角比古书上记载的整整偏移了两度。',
    unlocked: true,
  },
  {
    id: 'travel_silas_2',
    guestId: 'silas',
    guestName: '西拉斯',
    day: 2,
    timeOfDay: '黄昏',
    location: '黑松林阴湿小径',
    title: '幽光苔藓与白羽猫头鹰的注视',
    storyText: '下午去林地阴湿处采集誊写高阶法阵所需的荧光苔藓。正蹲在树根旁小心切取时，头顶突然传来翅膀轻扑声——一只白羽猫头鹰悄无声息地落在了松枝上，一金一银的异色瞳孔静静俯视着我，并在我起身后留下一支脱落的硬羽。',
    sketchType: 'stream_rose',
    souvenir: {
      id: 'souvenir_owl_feather',
      name: '异色瞳猫头鹰羽管',
      description: '带有微弱魔力波动的白猫头鹰翎羽，可直接当作高阶抄卷羽毛笔。',
      iconName: 'Feather',
      rarity: 'rare',
      acquiredDate: 2,
      acquiredLocation: '黑松林阴湿小径',
      guestId: 'silas',
    },
    moodSummary: '神秘敬畏，思维敏捷',
    dialogueHook: '黑松林里新长出了一大片幽光真菌，在没有火把的夜色下居然能隐约照亮半圈脚印。',
    unlocked: false,
  },

  // --- Eileen ---
  {
    id: 'travel_eileen_1',
    guestId: 'eileen',
    guestName: '艾琳',
    day: 1,
    timeOfDay: '正午',
    location: '黑松林雪线瞭望哨',
    title: '冷杉树皮上的雪狼三爪印',
    storyText: '踩着没过马靴的湿冷初雪深入冷杉林，在一截断裂的枯木旁发现了雪狼一家三口巡游留下的新爪印。母狼在树皮上留下了蹭毛气味标记，北境雪山深处的兽群正在快速南迁，这意味着暴风雪即将覆盖整个山隘。',
    sketchType: 'snow_forest',
    souvenir: INITIAL_SOUVENIRS[3],
    moodSummary: '敏锐警觉，弓不离手',
    dialogueHook: '今天在雪线边上看到了新鲜的白狼掌印，这绝不是单纯的觅食……山里的兽群有些慌躁。',
    unlocked: true,
  },
  {
    id: 'travel_eileen_2',
    guestId: 'eileen',
    guestName: '艾琳',
    day: 2,
    timeOfDay: '午后',
    location: '冻结浅滩古战场乱石堆',
    title: '冰层下起出的三十年前旧箭簇',
    storyText: '溯溪而上巡逻，在浅滩薄冰下剔出了一枚覆满锈壳的铁箭簇。那是当年灰岩堡北征斥候队专用的三棱倒钩箭……抚摸着上面依稀可辨的狼首刻印，仿佛又听见了当年暴风雪中呼啸的警箭风声。',
    sketchType: 'snow_forest',
    souvenir: {
      id: 'souvenir_ancient_arrowhead',
      name: '三棱倒钩铁箭镞标本',
      description: '北境战役残留的三棱倒钩箭，尖端被岁月磨损，但杀气犹存。',
      iconName: 'Zap',
      rarity: 'uncommon',
      acquiredDate: 2,
      acquiredLocation: '冻结浅滩古战场乱石堆',
      guestId: 'eileen',
    },
    moodSummary: '肃杀孤寂，旧伤隐痛',
    dialogueHook: '河滩融雪下的旧箭镞……那是三十年前北征军团制式的三棱箭，沉在沙石里冰冷刺骨。',
    unlocked: false,
  },

  // --- Bruno ---
  {
    id: 'travel_bruno_1',
    guestId: 'bruno',
    guestName: '布鲁诺',
    day: 1,
    timeOfDay: '午后',
    location: '西区驿站马厩',
    title: '小枣红马与新换的平口铁掌',
    storyText: '今天帮镇上驿站照料四匹从北山道运麦回来的驮马。一匹毛色油亮的小枣红马马掌里嵌了石子，我握着它的大腿弯，顺顺当当地把石子剔出，换了副磨平的软铁掌。小家伙舒服地打了个响鼻，用温暖的大鼻子不停拱我身上的皮肩甲。',
    sketchType: 'stable',
    souvenir: INITIAL_SOUVENIRS[4],
    moodSummary: '踏实舒坦，暖意融融',
    dialogueHook: '驿站那匹小红马今天懂事得很，修马蹄时一声没吭，还蹭了我一肩膀的草料末子。',
    unlocked: true,
  },
  {
    id: 'travel_bruno_2',
    guestId: 'bruno',
    guestName: '布鲁诺',
    day: 2,
    timeOfDay: '清晨',
    location: '河畔石桥倾覆货车旁',
    title: '单肩顶起千斤粮车与热苹果干',
    storyText: '南来的一队行商马车在烂泥坑里折了轴辕。两个年轻水手拉扯不下，我脱下重板甲，用右肩死死顶住车辕底杠，吼了一声硬生生将满载麦谷的车厢顶出了泥沟。带队的老大娘非塞给我半包自晒的苹果干，咬一口甜得直浸肺腑。',
    sketchType: 'market',
    souvenir: {
      id: 'souvenir_dried_apple',
      name: '商队自晒甜苹果干',
      description: '厚切苹果片晒制的干粮，带着浓郁的金冠苹果蜜香，是行脚老兵的最爱。',
      iconName: 'Coffee',
      rarity: 'common',
      acquiredDate: 2,
      acquiredLocation: '河畔石桥倾覆货车旁',
      guestId: 'bruno',
    },
    moodSummary: '老当益壮，心中畅快',
    dialogueHook: '上午帮一队南来的商贩把翻倒的马车顶出泥坑，大娘非塞给我半包自晒的甜苹果干，真顶饱。',
    unlocked: false,
  },
];

/**
 * 根据自定义角色的性格、职业与背景故事，动态生成今日见闻手札与写生卡片
 */
export function generateCustomGuestTravel(guest: Guest, day: number): DailyTravelEntry {
  const isCaster = guest.occupation.includes('法师') || guest.occupation.includes('学者') || guest.occupation.includes('术士');
  const isWarrior = guest.occupation.includes('骑士') || guest.occupation.includes('战士') || guest.occupation.includes('游侠') || guest.occupation.includes('铁匠');
  const isNature = guest.race.includes('精灵') || guest.occupation.includes('德鲁伊') || guest.occupation.includes('诗人') || guest.personality.includes('好奇');

  const sketchType = isCaster ? 'ancient_tower' : isWarrior ? 'forge_ruins' : isNature ? 'windmill' : 'market';
  const times: Array<'清晨' | '正午' | '午后' | '黄昏'> = ['清晨', '正午', '午后', '黄昏'];
  const timeOfDay = times[(day + guest.name.length) % times.length];

  let location = '雾凇小镇外的旧石桥';
  let title = '漫步近郊的见闻碎影';
  let storyText = `${guest.name}踏着微湿的石板路，在小镇周边漫步。`;
  let mood = '心绪平和，若有所思';
  let hook = '今天在镇外转了一圈，呼吸了新鲜空气，整个人都舒展了。';

  const traits = guest.personality.join('、');

  if (isCaster) {
    location = '迷雾高地的风蚀残塔';
    title = `追寻古代印记的${timeOfDay}`;
    storyText = `清早带着写生板与羊皮纸前去废弃石塔勘察。凭借${traits}的心性，在背阴的砖缝间发现了一枚微弱发光的结晶石碎片。空气中似乎还残留着淡淡的以太微粒，令法杖顶端的微光轻轻跃动。`;
    mood = '若有所悟，学术沉醉';
    hook = `今天在镇外残塔边研究了半天古旧阵法纹路，当真收获不小。`;
  } else if (isWarrior) {
    location = '古松林畔的旧练兵坡';
    title = `磨砺刃锋的${timeOfDay}巡礼`;
    storyText = `身披轻甲沿着林地雪线巡视。展现出${traits}的特质，在林风呼啸之中整顿兵刃，并顺手将一只被旧捕兽夹困住的山兔救出、包扎了后腿。站在高坡上眺望酒馆的缕缕炊烟，心中多了一份守护的笃定。`;
    mood = '筋骨舒展，意志沉稳';
    hook = `今天在后山巡了一趟，风很大，但松林间格外宁静，活动了下手脚真舒服。`;
  } else {
    location = '风息溪畔的水车磨坊';
    title = `水声潺潺的${timeOfDay}漫步`;
    storyText = `踏着落满碎叶的溪畔碎石小径闲逛。${guest.name}带着${traits}的神采，在水车旁听着泉水激石的声音，采下了一束带清晨露水的野山薄荷，放在手心轻嗅，连日来的疲惫都烟消云散了。`;
    mood = '轻松惬意，自得其乐';
    hook = `今天沿着小溪走了好远，溪水清亮得很，还摘了些新鲜的薄荷叶。`;
  }

  // 融合背景故事的一两句细节
  if (guest.background && guest.background.length > 5) {
    storyText += ` 想起往日“${guest.background.slice(0, 36)}...”，今夜在这座小酒馆里坐下，别有一番安心。`;
  }

  const souvenir: SouvenirItem = {
    id: `souvenir_${guest.id}_${day}`,
    name: isCaster ? '泛光星蚀石碎块' : isWarrior ? '雕花旧磨刀石' : '风干野薄荷花束',
    description: `由【${guest.name}】在${location}漫步探奇时亲手拾获并珍藏的见闻纪念物。`,
    iconName: isCaster ? 'Gem' : isWarrior ? 'Hammer' : 'Flower2',
    rarity: 'uncommon',
    acquiredDate: day,
    acquiredLocation: location,
    guestId: guest.id,
  };

  return {
    id: `travel_${guest.id}_day_${day}`,
    guestId: guest.id,
    guestName: guest.name,
    day,
    timeOfDay,
    location,
    title,
    storyText,
    sketchType,
    souvenir,
    moodSummary: mood,
    dialogueHook: hook,
    unlocked: true,
  };
}
