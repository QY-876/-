import { RelationshipTier } from '../types/game';

export interface TableBanter {
  id: string;
  speakerA: string;
  speakerB: string;
  requiredTier?: RelationshipTier; // 'stranger' | 'acquaintance' | 'friend' | 'confidant'
  minDrunkState?: number; // minimum drunk level of at least one speaker
  lines: [
    { speakerId: string; text: string; action?: string },
    { speakerId: string; text: string; action?: string },
  ];
  logSummary: string;
}

export const INTER_CHARACTER_BANTER: TableBanter[] = [
  // ==========================================
  // --- Mila & Paulin ---
  // ==========================================
  // Stranger tier (偶遇过客: 0-29)
  {
    id: 'banter_mila_paulin_stranger',
    speakerA: 'mila',
    speakerB: 'paulin',
    requiredTier: 'stranger',
    lines: [
      { speakerId: 'mila', text: '“这位矮人大叔，您也是为了躲避外头的暴风雨才进来的吗？这间酒馆的炉火真让人安心呢。”' },
      { speakerId: 'paulin', text: '“哼，老子是来喝酒的，不是来避雨的！不过……这玄武岩砌的壁炉，砌砖手法确实有矮人工匠的硬朗底子。”' },
    ],
    logSummary: '米拉礼貌地同身侧的矮人铁匠搭话，波林虽嘴硬却赞许了酒馆壁炉的扎实质地。',
  },
  // Acquaintance tier (初识熟客: 30-59)
  {
    id: 'banter_mila_paulin_acq_1',
    speakerA: 'mila',
    speakerB: 'paulin',
    requiredTier: 'acquaintance',
    lines: [
      { speakerId: 'mila', text: '“波林大叔，你那柄八十磅的锻锤到底有多沉呀？我两只手都提不起来呢！”' },
      { speakerId: 'paulin', text: '“哈！小丫头少小瞧矮人，老子年轻时单手抡它八天八夜，比你拨弄琴弦还利落！”' },
    ],
    logSummary: '米拉好奇打听矮人锻锤的份量，波林自豪地吹嘘起当年在铁砧前连战八夜的辉煌战绩。',
  },
  {
    id: 'banter_mila_paulin_acq_2',
    speakerA: 'mila',
    speakerB: 'paulin',
    requiredTier: 'acquaintance',
    minDrunkState: 1,
    lines: [
      { speakerId: 'mila', text: '“（调皮地弹奏一段欢快的矮人矿工小调）波林大叔，给这个节拍配个跺脚怎么样？”' },
      { speakerId: 'paulin', text: '“（铁鞋重重磕击地板）咚！咚！……咳，节拍不错，比王城那些娘娘腔的宫廷舞曲顺耳多了！”' },
    ],
    logSummary: '米拉弹起轻快的矿坑小调，波林忍不住用厚重的铁靴在石砖地板上踏出沉稳节拍。',
  },
  // Friend tier (莫逆好友: 60-84)
  {
    id: 'banter_mila_paulin_friend',
    speakerA: 'paulin',
    speakerB: 'mila',
    requiredTier: 'friend',
    minDrunkState: 1,
    lines: [
      { speakerId: 'paulin', text: '“小丫头，你喝酒别光顾着喝那甜得发腻的蜂蜜浆，矮人黑麦烈酒才能把胆量和心肺烧热！”' },
      { speakerId: 'mila', text: '“唔……我上次抿了一小口，舌头足足麻了半个下午！那根本是融化的铁水嘛！不过……大叔喝醉时说话最温柔了。”' },
    ],
    logSummary: '波林大力向米拉推销黑麦烈酒的硬汉滋味，米拉笑着揭穿矮人面冷心热的醉态。',
  },
  // Confidant tier (生死之交: 85-100)
  {
    id: 'banter_mila_paulin_confidant',
    speakerA: 'mila',
    speakerB: 'paulin',
    requiredTier: 'confidant',
    minDrunkState: 2,
    lines: [
      { speakerId: 'mila', text: '“波林大叔……我母亲留下的半截残谱背面，画着一枚带有暗纹瑕疵的星辰徽记……和你脖子上挂着的一模一样。”' },
      { speakerId: 'paulin', text: '“（铁手颤抖，红胡子剧烈抽搐）……你、你说什么？！那是老子三十年前亲手打给银黎探险队队长的誓约之徽！你……你是艾瑞莉娅的孩子？！”' },
    ],
    logSummary: '米拉向波林吐露母亲残谱背面的徽记暗纹，波林震惊认出这正是自己苦等三十年的生死誓约信物。',
  },

  // ==========================================
  // --- Paulin & Silas ---
  // ==========================================
  // Stranger tier (偶遇过客: 0-29)
  {
    id: 'banter_paulin_silas_stranger',
    speakerA: 'paulin',
    speakerB: 'silas',
    requiredTier: 'stranger',
    lines: [
      { speakerId: 'paulin', text: '“喂，戴眼镜的小法师，你身上一股子硫磺和蓝墨水味，是刚从高塔跑出来透气的吧？”' },
      { speakerId: 'silas', text: '“呃……您好，矮人先生。我在做古代星轨勘测……打扰到您的话，我把图纸收小一些。”' },
    ],
    logSummary: '波林指出年轻学徒身上的法术药剂气味，西拉斯略显拘谨地将星盘和羊皮纸往内侧收了收。',
  },
  // Acquaintance tier (初识熟客: 30-59)
  {
    id: 'banter_paulin_silas_acq',
    speakerA: 'paulin',
    speakerB: 'silas',
    requiredTier: 'acquaintance',
    lines: [
      { speakerId: 'paulin', text: '“小子，你整天对着那张破星图瞅什么？能瞅出哪座深山峡谷里藏着秘银矿脉么？”' },
      { speakerId: 'silas', text: '“波林大师，这是古代第四星轨图，不过……第三象限确实记录了一处古陨铁天火坠落的经纬度。”' },
    ],
    logSummary: '波林调侃少年法师整天看星图，西拉斯腼腆解释星轨图中确实记载着罕见古陨铁的坠落坐标。',
  },
  // Friend tier (莫逆好友: 60-84)
  {
    id: 'banter_paulin_silas_friend',
    speakerA: 'silas',
    speakerB: 'paulin',
    requiredTier: 'friend',
    minDrunkState: 1,
    lines: [
      { speakerId: 'silas', text: '“波林大师，您腰带上的微缩铁砧挂饰……在占星术的透镜下，居然隐隐泛着冰蓝色的抗魔光晕呢。”' },
      { speakerId: 'paulin', text: '“好小子，眼光贼毒！那是老子用北海深渊玄铁亲手淬火打造的护符，能挡三次法术反噬！回头给你小子也敲个小号的！”' },
    ],
    logSummary: '西拉斯透过镜片察觉波林护身符的非凡附魔，老铁匠赞许年轻学徒的毒辣眼光并许诺赠礼。',
  },
  // Confidant tier (生死之交: 85-100)
  {
    id: 'banter_paulin_silas_confidant',
    speakerA: 'silas',
    speakerB: 'paulin',
    requiredTier: 'confidant',
    minDrunkState: 2,
    lines: [
      { speakerId: 'silas', text: '“波林大师……导师失踪前寄出的密信火漆上，留下的正是您当年独创的‘星辰飞锤’暗纹，他一直在寻找你们当年没能踏入的深谷！”' },
      { speakerId: 'paulin', text: '“（一拳重重砸在桌角，泪水夺眶而出）法斯托斯那老混球……老子就猜到他没死！只要有这星图和老子的锻锤，踏平雪山也要把那老家伙拉出来喝一杯！”' },
    ],
    logSummary: '西拉斯揭晓失踪导师与矮人宗师的旧日盟约，两位故人后继者誓言携手探寻雪山深谷。',
  },

  // ==========================================
  // --- Silas & Mila ---
  // ==========================================
  // Stranger tier (偶遇过客: 0-29)
  {
    id: 'banter_silas_mila_stranger',
    speakerA: 'silas',
    speakerB: 'mila',
    requiredTier: 'stranger',
    lines: [
      { speakerId: 'silas', text: '“那……那个，米拉小姐，您的琴声真轻柔，连我推算星轨公式时的偏头痛都缓解了许多。”' },
      { speakerId: 'mila', text: '“（甜甜一笑）能帮上忙真是太好啦，看书累了的话，来杯温热蜂蜜水暖暖手吧。”' },
    ],
    logSummary: '西拉斯有些局促地感谢米拉琴音带来的安宁，米拉温和鼓励法师劳逸结合。',
  },
  // Acquaintance tier (初识熟客: 30-59)
  {
    id: 'banter_silas_mila_acq',
    speakerA: 'silas',
    speakerB: 'mila',
    requiredTier: 'acquaintance',
    lines: [
      { speakerId: 'silas', text: '“米拉小姐，您刚才琉特琴第三品位的音颤，居然引发了清泉杯口水面的完美同心圆微振……”' },
      { speakerId: 'mila', text: '“哇！真的吗？母亲说过，只要歌声足够纯净真挚，连周围的风和水流都会随之起舞呢。”' },
    ],
    logSummary: '西拉斯用法术共振原理解析米拉的琴音，米拉微笑着回忆母亲关于歌声抚慰万物的教导。',
  },
  // Friend tier (莫逆好友: 60-84)
  {
    id: 'banter_silas_mila_friend',
    speakerA: 'mila',
    speakerB: 'silas',
    requiredTier: 'friend',
    minDrunkState: 1,
    lines: [
      { speakerId: 'mila', text: '“西拉斯，法师塔里是不是每个人都整天板着脸呀？你笑起来明明挺好看的嘛！”' },
      { speakerId: 'silas', text: '“（脸庞瞬间涨红，急忙低头推眼镜）咳……导师平时很严厉，规定每天必须背诵两百组符文公式……”' },
    ],
    logSummary: '米拉打趣西拉斯笑起来很好看，年轻法师顿时满面通红慌乱地调整眼镜。',
  },
  // Confidant tier (生死之交: 85-100)
  {
    id: 'banter_silas_mila_confidant',
    speakerA: 'mila',
    speakerB: 'silas',
    requiredTier: 'confidant',
    minDrunkState: 2,
    lines: [
      { speakerId: 'mila', text: '“西拉斯……要是真的找到了极北的被遗忘遗迹，你愿意用星轨术替我照亮被黑暗笼罩的祭坛之路吗？”' },
      { speakerId: 'silas', text: '“（神情无比庄重，握紧星盘）只要有你在身边唱歌……哪怕面对高阶禁咒与无尽暗夜，我一步也不会后退。”' },
    ],
    logSummary: '米拉询问极北探险之行的意愿，年轻法师以星轨之名庄重许下守护诺言。',
  },

  // ==========================================
  // --- Eileen & Bruno ---
  // ==========================================
  // Stranger tier (偶遇过客: 0-29)
  {
    id: 'banter_eileen_bruno_stranger',
    speakerA: 'bruno',
    speakerB: 'eileen',
    requiredTier: 'stranger',
    lines: [
      { speakerId: 'bruno', text: '“这位游侠女士……您的靴子上沾着北方冷杉的松针，北境雪线的积雪已经漫过小腿了吧？”' },
      { speakerId: 'eileen', text: '“（冷淡地瞥了一眼）眼力不错，大个子。不想找麻烦的话，管好自己的酒杯。”' },
    ],
    logSummary: '布鲁诺凭老兵直觉询问北境雪情，艾琳目光凌厉而谨慎地保持着距离。',
  },
  // Acquaintance tier (初识熟客: 30-59)
  {
    id: 'banter_eileen_bruno_acq',
    speakerA: 'bruno',
    speakerB: 'eileen',
    requiredTier: 'acquaintance',
    lines: [
      { speakerId: 'bruno', text: '“艾琳，今晚这窗外的阴雨连绵……你的右踝骨还在隐隐作痛吗？我这里有北境带来的鹿筋热膏。”' },
      { speakerId: 'eileen', text: '“少操心我，大个子。管好你自己的瘸腿，雨天别整晚坐在靠风的过道口。”' },
    ],
    logSummary: '布鲁诺默默拿出伤膏关切艾琳的风湿旧疾，艾琳嘴上冷硬却出言提醒他避开过道穿堂风。',
  },
  // Friend tier (莫逆好友: 60-84)
  {
    id: 'banter_eileen_bruno_friend',
    speakerA: 'eileen',
    speakerB: 'bruno',
    requiredTier: 'friend',
    minDrunkState: 1,
    lines: [
      { speakerId: 'eileen', text: '“当年在霜林山谷……你那面盾牌如果再偏两寸，整条左臂就废了。你当时到底在想什么？”' },
      { speakerId: 'bruno', text: '“（仰头猛灌一口麦酒）在想什么？老子当时只知道，要是队长没了，我们剩下的三个人谁也走不出白毛风。”' },
    ],
    logSummary: '艾琳提及当年霜谷伏击生死一线的瞬间，布鲁诺眼神坚定地表示护住队长是卫士的天职。',
  },
  // Confidant tier (生死之交: 85-100)
  {
    id: 'banter_eileen_bruno_confidant',
    speakerA: 'bruno',
    speakerB: 'eileen',
    requiredTier: 'confidant',
    minDrunkState: 2,
    lines: [
      { speakerId: 'bruno', text: '“艾琳，等这次北行的暴风雪消停了……咱俩重新组个小队去边境接委托，敢不敢？老子这面盾牌，还能替你挡一辈子冷箭。”' },
      { speakerId: 'eileen', text: '“（低头，嘴角泛起久违的笑意，眼眶微红）……少肉麻了。先把这杯烈酒干了，明天我替你把马厩的草料也翻晒一遍。”' },
    ],
    logSummary: '布鲁诺在浓烈酒意中提议余生重组小队，艾琳放下多年的防备，两人碰杯重立誓言。',
  },

  // ==========================================
  // --- Bruno & Paulin ---
  // ==========================================
  {
    id: 'banter_bruno_paulin_acq',
    speakerA: 'paulin',
    speakerB: 'bruno',
    requiredTier: 'acquaintance',
    lines: [
      { speakerId: 'paulin', text: '“重装老兵，把你那面被霜兽抓出深槽的重盾拿来给老子瞧瞧。这包铁的手艺……是灰岩堡的工匠吧？”' },
      { speakerId: 'bruno', text: '“波林大师目光如炬！当年入伍花了我足足四个月薪饷，在北方替我挡下过不知道多少次獠牙利爪。”' },
    ],
    logSummary: '波林端详布鲁诺伤痕累累的黑铁重盾并点评其锻造出处，两位老兵因百战兵刃惺惺相惜。',
  },
  {
    id: 'banter_bruno_paulin_friend',
    speakerA: 'bruno',
    speakerB: 'paulin',
    requiredTier: 'friend',
    minDrunkState: 1,
    lines: [
      { speakerId: 'bruno', text: '“波林老哥，你手底下打造的盾牌……真的能抗住成年山地巨熊的正面撼地一击吗？”' },
      { speakerId: 'paulin', text: '“巨熊算个屁！只要老子淬火时加两把黑石粉，连红龙喷出的火焰硫磺都能硬顶三个呼吸！”' },
    ],
    logSummary: '布鲁诺与波林就重盾锻造与抗击极限畅谈痛饮，酒桌上豪情四溢。',
  },

  // ==========================================
  // --- Mila & Eileen ---
  // ==========================================
  {
    id: 'banter_mila_eileen_acq',
    speakerA: 'mila',
    speakerB: 'eileen',
    requiredTier: 'acquaintance',
    lines: [
      { speakerId: 'mila', text: '“艾琳姐姐，你斗篷边缘缀着的那枚白狼犬齿真威武，是在极北荒原亲手捕获的战利品吗？”' },
      { speakerId: 'eileen', text: '“（指尖掠过狼齿，眼神柔和）……不是捕获的。那年暴雪它掉进冰窟，我用麻绳拉了它上来，分了半块干粮；这是它自然老死前留给我的。”' },
    ],
    logSummary: '米拉好奇打量艾琳的狼牙护符，冷峻游侠罕见地道出一段冰原荒野人与雪狼相伴的往事。',
  },
  {
    id: 'banter_mila_eileen_friend',
    speakerA: 'eileen',
    speakerB: 'mila',
    requiredTier: 'friend',
    minDrunkState: 1,
    lines: [
      { speakerId: 'eileen', text: '“米拉，北方荒原没有会唱歌的花草，只有撕心裂肺的暴风雪。但你的歌……让我想起小时候母亲在炉火旁哼过的睡前小谣。”' },
      { speakerId: 'mila', text: '“（眼角含笑）那我就每晚多唱一段，艾琳姐姐，让炉火把北风所有的冷意都赶走。”' },
    ],
    logSummary: '艾琳向米拉袒露琴声勾起的童年温馨记忆，米拉温声承诺为游侠驱散荒原寒意。',
  },

  // ==========================================
  // --- Silas & Eileen ---
  // ==========================================
  {
    id: 'banter_silas_eileen_acq',
    speakerA: 'silas',
    speakerB: 'eileen',
    requiredTier: 'acquaintance',
    lines: [
      { speakerId: 'silas', text: '“艾琳女士，听闻您经常深入北境雪线，那里的古代冰川遗迹……真的常年被极光帷幕笼罩吗？”' },
      { speakerId: 'eileen', text: '“极光美丽，但往往伴随着雪崩和冻土裂谷。小法师，到了极北之地，指南针和你的星盘都会失灵，唯有风雪声不会说谎。”' },
    ],
    logSummary: '西拉斯向游侠请教极北遗迹的极光景观，艾琳郑重告诫荒原求生的残酷生存法则。',
  },
];

// Rich individual action narrative descriptions for each character
export const CHARACTER_ACTION_POOLS: Record<
  string,
  Array<{ text: string; tag: string; tagColor: string }>
> = {
  mila: [
    {
      text: '指尖在琉特琴的丝弦上轻柔滑过，调谐着泛音，让琴弦沉浸在温暖的麦酒香气里。',
      tag: '调音试弦',
      tagColor: 'bg-emerald-950 text-emerald-300',
    },
    {
      text: '双手托腮，静静倾听着窗外连绵的细雨敲击在石窗台上，眉宇间流露出对南方故乡的眷念。',
      tag: '凭窗聆雨',
      tagColor: 'bg-teal-950 text-teal-300',
    },
    {
      text: '取出压在行囊底部的羊皮纸乐谱草稿，就着蜡烛的微光，用羽毛笔添上几串泛音音符。',
      tag: '谱写残卷',
      tagColor: 'bg-amber-950 text-amber-300',
    },
    {
      text: '轻轻晃动着陶杯里温热的蜂蜜暖酒，看着金黄色的酒液在烛光中泛出蜜糖色的微晕。',
      tag: '轻晃酒杯',
      tagColor: 'bg-amber-900 text-amber-200',
    },
    {
      text: '被邻座矮人老爹粗声大气的吹嘘逗乐，用长袖掩着嘴角，发出银铃般的细碎浅笑。',
      tag: '掩面轻笑',
      tagColor: 'bg-emerald-900 text-emerald-200',
    },
    {
      text: '揉了揉略显干涩的双眼，轻轻吹灭自己桌角烧短的一截小蜡烛，重新换上一支新蜡烛。',
      tag: '剪烛添火',
      tagColor: 'bg-stone-850 text-stone-300',
    },
  ],
  paulin: [
    {
      text: '用布满老茧和烫伤疤痕的拇指，反复摩挲着颈间微缩的小铁砧坠饰，眼神望向壁炉深处。',
      tag: '摩挲信物',
      tagColor: 'bg-amber-950 text-amber-300',
    },
    {
      text: '厚实的铁手套指节在红橡木桌上敲击出三长两短的沉重节奏，那是矮人铁匠铺独有的锻造行令。',
      tag: '指节扣桌',
      tagColor: 'bg-stone-850 text-stone-300',
    },
    {
      text: '大嘴一张，呼的一声吹飞了木杯顶端厚达两指的金黄麦沫，泡沫星星点点落在红胡须上。',
      tag: '吹开麦沫',
      tagColor: 'bg-amber-900 text-amber-200',
    },
    {
      text: '反手揉了揉因三十年前暴风雪落下的右肩旧伤，骨骼发出令人牙酸的轻微咔嗒闷响。',
      tag: '揉按伤骨',
      tagColor: 'bg-stone-900 text-stone-400',
    },
    {
      text: '眯缝着一只眼，暗暗打量挂在吧台墙上的那柄陈年双刃斧，从钢纹上辨认当年老铁匠的折叠锻数。',
      tag: '审视兵刃',
      tagColor: 'bg-stone-800 text-stone-300',
    },
    {
      text: '提起沉重的铁杯，仰头将一大口冰凉浓烈的黑麦烈酒灌入喉中，舒服地发出悠长的叹息。',
      tag: '痛饮烈浆',
      tagColor: 'bg-orange-950 text-orange-300',
    },
  ],
  silas: [
    {
      text: '小心翼翼地从法袍内侧暗袋里取出铜制黄道星盘，借助壁炉的火光微调着天顶第三象限的偏角。',
      tag: '校准星盘',
      tagColor: 'bg-indigo-950 text-indigo-300',
    },
    {
      text: '手指顺着导师信函折角的焦黑边缘轻轻划过，嘴里无声地默念着防潮与防窥的古老符文咒言。',
      tag: '密语抚封',
      tagColor: 'bg-purple-950 text-purple-300',
    },
    {
      text: '端起老酒保端上的清泉水，就着杯口小心抿了一口，冰冽的泉水让因占星而紧绷的神经慢慢平复。',
      tag: '细品冰泉',
      tagColor: 'bg-sky-950 text-sky-300',
    },
    {
      text: '神情紧张地推了推滑落到鼻尖上的铜丝眼镜，警惕地扫了一眼推门而入的陌生旅人。',
      tag: '正推镜架',
      tagColor: 'bg-stone-850 text-stone-300',
    },
    {
      text: '在桌角摊开一本写满古精灵字符的日记簿，用浸着蓝墨水的钢笔在空白处沙沙记录着今夜的心得。',
      tag: '笔记沉思',
      tagColor: 'bg-indigo-900 text-indigo-200',
    },
  ],
  eileen: [
    {
      text: '从腰间皮鞘中抽出精钢剔骨短匕，用涂抹了岩柏油的细棉布，一丝不苟地擦拭着锋刃上的细微水汽。',
      tag: '拭抹寒刃',
      tagColor: 'bg-emerald-950 text-emerald-300',
    },
    {
      text: '每当酒馆木门被外面的寒风刮得嘎吱作响，她的右手便会习惯性地按上箭袋旁的硬弓弓臂。',
      tag: '警惕凝眸',
      tagColor: 'bg-stone-900 text-stone-300',
    },
    {
      text: '拉紧了兜帽边沿，把半张覆着浅疤的清冷脸庞藏进阴影里，只留一双锋锐如鹰的眸子注视着火塘。',
      tag: '敛容避光',
      tagColor: 'bg-stone-950 text-stone-400',
    },
    {
      text: '默默从皮囊中取出一块风干鹿肉脯，就着微苦的麦酒慢慢咀嚼，神色沉静而孤傲。',
      tag: '独饮嚼脯',
      tagColor: 'bg-amber-950 text-amber-300',
    },
  ],
  bruno: [
    {
      text: '伸出蒲扇般的大手，用力揉捏着右膝盖那道半尺长的撕裂旧创，湿冷的雨气让旧伤泛起隐隐阵痛。',
      tag: '揉抚创痕',
      tagColor: 'bg-stone-900 text-stone-400',
    },
    {
      text: '粗厚的大手在立于脚边的重钢盾牌中央反复拂过，盾面上那道被巨霜兽利齿撕咬出的深坑依然触目惊心。',
      tag: '摩挲重盾',
      tagColor: 'bg-stone-850 text-stone-300',
    },
    {
      text: '低头借着灯光，用骨针和涂了蜂蜡的麻线穿过马靴断裂的扣带，熟练利落地打了个死结。',
      tag: '缝缀皮具',
      tagColor: 'bg-stone-800 text-stone-300',
    },
    {
      text: '悄悄抬起眼帘，隔着昏黄的烛光望向角落里的艾琳，确认她安好无恙后，嘴角浮起一抹欣慰的笑意。',
      tag: '暗中顾盼',
      tagColor: 'bg-rose-950 text-rose-300',
    },
  ],
};
