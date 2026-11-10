import { ActionTemplate, DialogueTemplate, DndIntent, DndTopic } from '../types/game';

// 8 意图 × 12 话题 DND 纯白名单对话模板库
export const DND_DIALOGUE_TEMPLATES: DialogueTemplate[] = [
  // --- 1. GREET (招呼) ---
  {
    id: 'dlg_greet_weather_stranger',
    intent: 'greet',
    topic: 'weather',
    relationshipStage: 'stranger',
    tone: '礼貌客气',
    lines: [
      '“这位朋友，也是被外头这阵暴雨逼进酒馆的吧？”',
      '“雨天路滑，靠炉火这边的长凳还有空位，请自便。”',
      '“夜雨越来越急了，幸好这儿门扉够厚实。”',
    ],
    weight: 12,
  },
  {
    id: 'dlg_greet_food_acq',
    intent: 'greet',
    topic: 'food',
    relationshipStage: 'acquaintance',
    tone: '随和热络',
    lines: [
      '“你来得正好，老酒保刚开了一桶新酿的麦芽酒，泡沫正丰呢。”',
      '“看你的杯子快空了，今晚不尝尝温热的野蜂蜜甜酿吗？”',
      '“坐这边吧，就着烤火炉，麦酒下肚才够暖和。”',
    ],
    weight: 14,
  },
  {
    id: 'dlg_greet_recent_intimate',
    intent: 'greet',
    topic: 'recent_event',
    relationshipStage: 'intimate',
    tone: '熟稔欣慰',
    lines: [
      '“你总算来了！我刚还在想，今天下午在镇外的见闻得找你好好聊聊。”',
      '“快烤烤手！今天一整天没见着你，马厩和林道那边还安生吧？”',
      '“还是老位置！空杯子我都替你备好了，就等你的酒话下酒呢。”',
    ],
    weight: 16,
  },

  // --- 2. COMPLAIN (抱怨) ---
  {
    id: 'dlg_complain_weather_stranger',
    intent: 'complain',
    topic: 'weather',
    relationshipStage: 'stranger',
    tone: '叹气牢骚',
    lines: [
      '“这阴雨下了整整三天，靴子底下的泥巴重得像灌了铅。”',
      '“再这么湿冷下去，地窖里码好的柴火都要发霉了。”',
      '“北风刮得窗棂直响，连蜡烛火苗都晃个不停。”',
    ],
    weight: 10,
  },
  {
    id: 'dlg_complain_fatigue_acq',
    intent: 'complain',
    topic: 'fatigue',
    relationshipStage: 'acquaintance',
    tone: '无奈酸痛',
    lines: [
      '“一到这种湿气重的天气，旧伤口就跟被针扎一样隐隐发酸。”',
      '“今天在外头走了大半天，两个肩膀被皮背带勒得生疼。”',
      '“上了年纪就是不中用，连挥几十下铁锤手腕都发僵。”',
    ],
    weight: 12,
  },
  {
    id: 'dlg_complain_work_intimate',
    intent: 'complain',
    topic: 'work',
    relationshipStage: 'intimate',
    tone: '亲近吐槽',
    lines: [
      '“你是不知道，今天那帮新兵连最基本的齿轮咬合都弄不明白。”',
      '“抄录星轨公式抄到手指抽筋，导师还嫌我墨水用得太快。”',
      '“林子里的盗猎夹子清了一批又冒出一批，真让人头疼。”',
    ],
    weight: 15,
  },

  // --- 3. INVITE (邀请) ---
  {
    id: 'dlg_invite_food_acq',
    intent: 'invite',
    topic: 'food',
    relationshipStage: 'acquaintance',
    tone: '慷慨大方',
    lines: [
      '“来，碰个杯！这壶酒算我的，就当庆贺今晚没在泥坑里摔跟头。”',
      '“分你半块商队带回的干果脯，就着麦酒嚼特别有韧劲。”',
      '“往炉火这边挪两寸，这陶盆里的炭火烧得正旺。”',
    ],
    weight: 14,
  },
  {
    id: 'dlg_invite_goal_intimate',
    intent: 'invite',
    topic: 'goal',
    relationshipStage: 'intimate',
    tone: '郑重试探',
    lines: [
      '“等这次北境的暴风雪停了，跟我去废矿坑探探路，敢不敢？”',
      '“我翻出了旧图纸上的标记，明天清晨，我们一起去白桦林瞧瞧？”',
      '“路上有个照应，总好过一个人在荒原上硬挨暴风雪。”',
    ],
    weight: 16,
  },

  // --- 4. GOSSIP (八卦) ---
  {
    id: 'dlg_gossip_rumor_stranger',
    intent: 'gossip',
    topic: 'rumor',
    relationshipStage: 'stranger',
    tone: '压低嗓音',
    lines: [
      '“听说镇公所贴出了告示，北面山隘的巡逻队又失联了两支……”',
      '“刚才过路的商贩说，南边的运粮车队在半道上被霜狼逼退了。”',
      '“城西那口百年枯井，昨夜有人听见井底下有水流倒灌的声音。”',
    ],
    weight: 11,
  },
  {
    id: 'dlg_gossip_character_acq',
    intent: 'gossip',
    topic: 'character',
    relationshipStage: 'acquaintance',
    tone: '好奇窃语',
    lines: [
      '“你看角落里那位游侠，一进门就挑背光的死角坐，手从不离弓。”',
      '“那位年轻法师整晚都在翻星盘，听说他导师失踪前寄了怪信。”',
      '“老铁匠脖子上那枚微缩挂饰，好像藏着当年银黎冒险队的暗纹。”',
    ],
    weight: 13,
  },

  // --- 5. COMFORT (安慰) ---
  {
    id: 'dlg_comfort_fatigue_acq',
    intent: 'comfort',
    topic: 'fatigue',
    relationshipStage: 'acquaintance',
    tone: '真挚关切',
    lines: [
      '“先喝口热泉水顺顺气，伤处别吹过道里的穿堂阴风。”',
      '“别硬撑着，我这儿有北境带来的鹿筋热膏，待会儿抹一点在关节上。”',
      '“今夜在这酒馆里好生睡一宿，凡事等天亮雪停了再琢磨。”',
    ],
    weight: 14,
  },
  {
    id: 'dlg_comfort_mood_intimate',
    intent: 'comfort',
    topic: 'mood',
    relationshipStage: 'intimate',
    tone: '柔和坚定',
    lines: [
      '“过去的事怨不得你……若换作别人，当年根本走不出那片冻土。”',
      '“只要琴还在、刀没钝，我们总能把失散的人一个一个找回来。”',
      '“喝了这杯，我的盾永远在你身前立着，塌不下来。”',
    ],
    weight: 18,
  },

  // --- 6. BRAG (炫耀) ---
  {
    id: 'dlg_brag_work_acq',
    intent: 'brag',
    topic: 'work',
    relationshipStage: 'acquaintance',
    tone: '自豪张扬',
    lines: [
      '“老子年轻时单手抡八十磅的锻锤，连战八天八夜，连火星都没溅出半粒！”',
      '“这把硬弓用的是极北雪角鹿的角筋，百步开外能射穿三寸厚的橡木盾。”',
      '“整个法师学院，能在三年内默记两百组高阶星轨符文的只有我一个。”',
    ],
    weight: 12,
  },
  {
    id: 'dlg_brag_recent_intimate',
    intent: 'brag',
    topic: 'recent_event',
    relationshipStage: 'intimate',
    tone: '畅快大笑',
    lines: [
      '“今天河边那辆陷进泥潭的粮车，我连板甲都没穿，单肩就给它顶回了石子路！”',
      '“今天下午在旧磨坊前弹琴，连水车上的蓝顶山雀都听得不肯飞走。”',
      '“今天一上午拆了盗猎者三个钢夹子，一个也没逃过我的眼睛！”',
    ],
    weight: 15,
  },

  // --- 7. APOLOGIZE (道歉) ---
  {
    id: 'dlg_apologize_gold_acq',
    intent: 'apologize',
    topic: 'gold',
    relationshipStage: 'acquaintance',
    tone: '略带尴尬',
    lines: [
      '“抱歉，今天手头有点紧，这壶酒还得劳烦你先垫上几个铜子儿。”',
      '“刚才不小心碰翻了你的酒杯，我立刻让老酒保再添满一满杯。”',
      '“我这粗嗓门没吓着你吧？在矿坑待久了习惯吼着说话。”',
    ],
    weight: 9,
  },

  // --- 8. FAREWELL (告别) ---
  {
    id: 'dlg_farewell_weather_stranger',
    intent: 'farewell',
    topic: 'weather',
    relationshipStage: 'stranger',
    tone: '礼貌告退',
    lines: [
      '“雨势见小了，我也该回客栈歇息了。诸位晚安。”',
      '“酒足饭饱，多谢这方温暖炉火，明晚有缘再会。”',
      '“夜深路黑，告辞了，愿外头的月色能照亮各位的前路。”',
    ],
    weight: 11,
  },
  {
    id: 'dlg_farewell_goal_intimate',
    intent: 'farewell',
    topic: 'goal',
    relationshipStage: 'intimate',
    tone: '深沉相托',
    lines: [
      '“回去把行囊收拾齐整，明早公鸡打鸣时，我在老城门边等你。”',
      '“酒钱搁在桌角了。照看好你自己，明晚老时间见！”',
      '“走了！不管明天风雪多大，答应过你的事，老子绝不食言。”',
    ],
    weight: 15,
  },
];

// 8 类 DND 纯动作独立通道模板库
export const DND_ACTION_TEMPLATES: ActionTemplate[] = [
  // --- 1. ITEM (道具检视/保养) ---
  {
    id: 'act_item_shield',
    type: 'item',
    phase: 'standalone',
    descriptions: [
      '取出粗棉布，就着灯光细细擦拭重钢盾牌中央的兽爪凹痕。',
      '用指腹轻轻摩挲盾面旧划痕，检查包铁边缘是否松动。',
      '将重盾稳稳倚靠在脚边桌腿旁，发出沉闷的金属磕碰声。',
    ],
    tag: '检视重盾',
    tagColor: 'bg-stone-850 text-stone-300',
    weight: 15,
  },
  {
    id: 'act_item_grimoire',
    type: 'item',
    phase: 'standalone',
    descriptions: [
      '从袍内暗袋取出泛黄的羊皮星盘，借着烛火微调黄道刻度。',
      '用浸着蓝墨水的细羽笔，在法术书空白页沙沙补录一行微型符文。',
      '小心翼翼地将导师的密信折叠平整，收纳进防水皮套内。',
    ],
    tag: '研读星卷',
    tagColor: 'bg-indigo-950 text-indigo-300',
    weight: 14,
  },
  {
    id: 'act_item_lute',
    type: 'item',
    phase: 'standalone',
    descriptions: [
      '指尖在琉特琴第四品位轻轻滑过，调正丝弦在潮湿空气中的泛音。',
      '双手轻抱琴身，用袖口拂去琴轴上沾染的几颗透明雨珠。',
      '拨弄出一串清脆如山泉跌落的短音符，随即按弦止住余响。',
    ],
    tag: '轻拨丝弦',
    tagColor: 'bg-emerald-950 text-emerald-300',
    weight: 16,
  },
  {
    id: 'act_item_dagger',
    type: 'item',
    phase: 'standalone',
    descriptions: [
      '抽出精钢猎刃，用涂抹了柏油的麂皮由护手至刀尖利落拭过。',
      '指甲在箭袋羽毛间轻轻掠过，确认三棱箭羽未被夜雨打湿。',
      '将剔骨小匕插回鹿皮短鞘，卡簧发出一记极其细微的清脆咔嗒声。',
    ],
    tag: '拭抹刃器',
    tagColor: 'bg-stone-900 text-stone-300',
    weight: 13,
  },
  {
    id: 'act_item_pendant',
    type: 'item',
    phase: 'standalone',
    descriptions: [
      '粗茧的大手捏紧了挂在脖颈上的微缩铁砧吊坠，目光注视火膛。',
      '从腰包摸出一块粗糙的磨刀石，顺着腰间短斧的开刃处轻蹭两下。',
      '把沉重的铁手套掷在桌上，活动着十根泛红起茧的短粗指节。',
    ],
    tag: '摩挲信物',
    tagColor: 'bg-amber-950 text-amber-300',
    weight: 15,
  },

  // --- 2. ENVIRONMENT (环境互动) ---
  {
    id: 'act_env_hearth',
    type: 'environment',
    phase: 'standalone',
    descriptions: [
      '提起火钳探入壁炉，将烧红的松木炭块往炉心聚了聚，火星微溅。',
      '伸出冻得有些发僵的双手靠近壁炉玄武岩罩，缓缓哈了一口暖气。',
      '转头凝视被风雨敲打得嘎吱作响的彩色琉璃窗，眼神若有所思。',
    ],
    tag: '拨火暖手',
    tagColor: 'bg-orange-950 text-orange-300',
    weight: 18,
  },

  // --- 3. SOCIAL (社交敬意) ---
  {
    id: 'act_social_toast',
    type: 'social',
    phase: 'pre_line',
    descriptions: [
      '端起沉甸甸的木杯向身侧同桌微微一晃致意。',
      '用粗厚的大手在红橡木桌面上连扣两下以示赞许。',
      '双手捧着温热的陶杯，微笑着向对方侧耳倾听。',
    ],
    tag: '举杯致意',
    tagColor: 'bg-amber-900 text-amber-200',
    weight: 16,
  },

  // --- 4. STATE (身体生理状态) ---
  {
    id: 'act_state_fatigue',
    type: 'state',
    phase: 'standalone',
    descriptions: [
      '反手用力按揉着右肩与老膝盖的旧伤，骨骼发出细微的闷响。',
      '摘下铜丝眼镜揉了揉略显酸胀的鼻梁，长长舒了一口疲惫的浊气。',
      '揉了揉被雨雾打湿的发梢，把领口纽扣扣紧了一些防风。',
    ],
    tag: '揉按伤骨',
    tagColor: 'bg-stone-850 text-stone-400',
    weight: 14,
  },

  // --- 5. EMOTION (情绪微表情) ---
  {
    id: 'act_emotion_laugh',
    type: 'emotion',
    phase: 'post_line',
    descriptions: [
      '用长袖掩着嘴角，忍不住发出一串银铃般的细碎浅笑。',
      '红胡须在嘴角咧开一个豪爽的弧度，喉咙里发出洪亮的闷笑。',
      '嘴角勾起一丝不易察觉的浅淡弧度，眼中冰霜初现消融。',
    ],
    tag: '莞尔释怀',
    tagColor: 'bg-rose-950 text-rose-300',
    weight: 14,
  },

  // --- 6. RELATION (亲密伙伴互动) ---
  {
    id: 'act_relation_ointment',
    type: 'relation',
    phase: 'pre_line',
    descriptions: [
      '默默将一盒散发着松脂薄荷香气的兽脂热膏推到同桌手边。',
      '把装有清凉泉水的水碗往对方方向推近了半寸。',
      '伸手拍了拍对方覆满铁甲的肩头，目光里满是老战友的笃定。',
    ],
    tag: '推膏关切',
    tagColor: 'bg-indigo-950 text-indigo-300',
    weight: 12,
  },

  // --- 7. NONVERBAL (纯动作替代回应) ---
  {
    id: 'act_nonverbal_nod',
    type: 'nonverbal',
    phase: 'substitute',
    descriptions: [
      '没有说话，只是默默仰头猛灌了一大口麦酒，而后重重一抹嘴角。',
      '神情平静地微微颔首，目光移向壁炉深处跳动的橙红火苗。',
      '隔着昏黄的烛光凝视对方良久，而后赞许地举杯一饮而尽。',
    ],
    tag: '默契饮尽',
    tagColor: 'bg-stone-900 text-stone-200',
    weight: 15,
  },
];
