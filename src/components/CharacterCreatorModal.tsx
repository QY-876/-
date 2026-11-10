import React, { useEffect, useRef, useState } from 'react';
import { Guest, GuestAppearance } from '../types/game';
import { Palette, Sparkles, UserPlus, X } from 'lucide-react';

interface CharacterCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCharacter: (guest: Guest) => void;
  existingGuests: Guest[];
}

const SKIN_COLORS = ['#fde68a', '#fed7aa', '#fef08a', '#fbcfe8', '#e2e8f0', '#92400e'];
const HAIR_COLORS = [
  '#78350f', // Brown
  '#b91c1c', // Fiery Red
  '#1e293b', // Midnight Black
  '#e2e8f0', // Silver White
  '#f59e0b', // Golden
  '#6366f1', // Arcane Indigo
  '#10b981', // Emerald
  '#ec4899', // Pinkish
];
const OUTFIT_COLORS = ['#10b981', '#475569', '#6366f1', '#059669', '#dc2626', '#d97706', '#3b82f6'];

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveCharacter,
  existingGuests,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [age, setAge] = useState<number>(25);
  const [race, setRace] = useState<string>('人类');
  const [occupation, setOccupation] = useState<string>('流浪剑士');
  const [background, setBackground] = useState('');
  const [secret, setSecret] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['豪爽', '重诺']);
  const [boundRelation, setBoundRelation] = useState<{ targetId: string; type: string }>({
    targetId: 'mila',
    type: 'friend',
  });

  // Appearance
  const [appearance, setAppearance] = useState<GuestAppearance>({
    bodyType: 'human',
    skinColor: SKIN_COLORS[0],
    hairStyle: 'short',
    hairColor: HAIR_COLORS[0],
    faceFeature: 'clean',
    outfit: 'ranger_leather',
    outfitColor: OUTFIT_COLORS[0],
    accessory: 'none',
  });

  // Preview Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, 160, 200);
      ctx.imageSmoothingEnabled = false;

      // Pedestal
      ctx.fillStyle = '#291e17';
      ctx.fillRect(20, 160, 120, 16);
      ctx.fillStyle = '#1c130d';
      ctx.fillRect(15, 172, 130, 8);

      const x = 80;
      const y = 150;
      const breathY = Math.sin(tick * 0.06) * 1.5;
      const isDwarf = appearance.bodyType === 'dwarf';
      const yOff = isDwarf ? 10 : 0;

      ctx.save();
      ctx.translate(x, y);

      // Pants
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-12, -20 + breathY + yOff, 9, 20);
      ctx.fillRect(3, -20 + breathY + yOff, 9, 20);

      // Boots
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-14, -2 + yOff, 11, 6);
      ctx.fillRect(3, -2 + yOff, 11, 6);

      // Outfit Torso
      ctx.fillStyle = appearance.outfitColor;
      ctx.fillRect(-18, -50 + breathY + yOff, 36, 32);

      // Belt
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-18, -24 + breathY + yOff, 36, 5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-4, -24 + breathY + yOff, 8, 5);

      // Cloak
      if (appearance.accessory === 'cloak') {
        ctx.fillStyle = '#065f46';
        ctx.fillRect(-22, -50 + breathY + yOff, 6, 36);
        ctx.fillRect(16, -50 + breathY + yOff, 6, 36);
      }

      // Head
      ctx.fillStyle = appearance.skinColor;
      ctx.fillRect(-14, -76 + breathY + yOff, 28, 26);

      // Elf ears
      if (appearance.bodyType === 'elf') {
        ctx.fillStyle = appearance.skinColor;
        ctx.fillRect(-18, -70 + breathY + yOff, 4, 8);
        ctx.fillRect(14, -70 + breathY + yOff, 4, 8);
      }

      // Hair
      ctx.fillStyle = appearance.hairColor;
      if (appearance.hairStyle === 'short') {
        ctx.fillRect(-15, -82 + breathY + yOff, 30, 10);
        ctx.fillRect(-16, -76 + breathY + yOff, 4, 12);
      } else if (appearance.hairStyle === 'long' || appearance.hairStyle === 'braid') {
        ctx.fillRect(-15, -82 + breathY + yOff, 30, 10);
        ctx.fillRect(-17, -76 + breathY + yOff, 5, 30);
        ctx.fillRect(12, -76 + breathY + yOff, 5, 30);
      } else if (appearance.hairStyle === 'wizard_hat') {
        ctx.fillStyle = '#4338ca';
        ctx.fillRect(-20, -82 + breathY + yOff, 40, 6);
        ctx.fillRect(-12, -98 + breathY + yOff, 24, 16);
        ctx.fillRect(-6, -112 + breathY + yOff, 12, 14);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-10, -84 + breathY + yOff, 20, 3);
      }

      // Feather Hat
      if (appearance.accessory === 'feather_hat') {
        ctx.fillStyle = '#065f46';
        ctx.fillRect(-16, -83 + breathY + yOff, 32, 6);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(8, -96 + breathY + yOff, 6, 16);
      }

      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, -66 + breathY + yOff, 4, 5);
      ctx.fillRect(4, -66 + breathY + yOff, 4, 5);

      // Beard / Glasses / Scar
      if (appearance.faceFeature === 'beard_red') {
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(-14, -60 + breathY + yOff, 28, 20);
      } else if (appearance.faceFeature === 'beard_gray') {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-12, -60 + breathY + yOff, 24, 18);
      } else if (appearance.faceFeature === 'glasses') {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-10, -68 + breathY + yOff, 7, 7);
        ctx.strokeRect(3, -68 + breathY + yOff, 7, 7);
      } else if (appearance.faceFeature === 'scar') {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-6, -72 + breathY + yOff, 3, 10);
      }

      // Hand holding mug
      ctx.fillStyle = '#78350f';
      ctx.fillRect(16, -38 + breathY + yOff, 10, 12);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(16, -42 + breathY + yOff, 10, 4);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [appearance, isOpen]);

  if (!isOpen) return null;

  const handleTraitToggle = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else {
      if (selectedTraits.length < 4) {
        setSelectedTraits([...selectedTraits, trait]);
      }
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || '神秘旅人';
    const finalTitle = title.trim() || '漫游者';
    const finalBg =
      background.trim() || '一名在风雨之夜推开酒馆大门的流浪者，身上带着未知的故事。';
    const finalSecret =
      secret.trim() || '我曾在无名冰谷看到过一座刻有古代矮人徽记与精灵星轨的巨型石碑……';

    const newGuest: Guest = {
      id: `custom_${Date.now()}`,
      name: finalName,
      title: finalTitle,
      age: Number(age) || 28,
      race,
      occupation,
      personality: selectedTraits.length > 0 ? selectedTraits : ['沉着', '健谈'],
      preferredDrinks: ['malt_ale', 'honey_mead'],
      dislikedDrinks: [],
      background: finalBg,
      secrets: [
        {
          id: `secret_${Date.now()}_1`,
          text: `“你不知道……${finalSecret}”`,
          requiredDrunkState: 2,
          unlocked: false,
          storyClue: `${finalName}透露的隐秘线索。`,
        },
        {
          id: `secret_${Date.now()}_2`,
          text: `“我和【${existingGuests.find((g) => g.id === boundRelation.targetId)?.name || '酒馆客人'}】早就认识……这背后的渊源三天三夜也说不完！”`,
          requiredDrunkState: 3,
          unlocked: false,
          storyClue: `${finalName}与酒馆伙伴的宿命羁绊。`,
        },
      ],
      appearance,
      stats: {
        alcoholTolerance: 55,
        mood: 60,
        caution: 50,
        familiarity: 20,
        visitCount: 1,
      },
      status: {
        drunkenness: 5,
        state: 0,
        seatIndex: -1, // will be assigned to next open seat
        isPresent: true,
        currentAction: 'idle',
        actionTimer: 0,
        leaveTendency: 15,
        leaveChance: 0.02,
        currentDrinkId: 'malt_ale',
        currentDrinkName: '淡麦芽黄啤',
        drinkRemaining: 90,
        expression: '从容端坐，目光宁静',
      },
      isCustom: true,
    };

    onSaveCharacter(newGuest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border-4 border-amber-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/50 rounded-lg border border-amber-700/50 text-amber-300">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-amber-100">
                自定义客人创建器
              </h2>
              <p className="text-xs text-amber-300/70">
                塑造独一无二的像素旅人，让其步入酒馆与原著角色交织命运
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {/* Left: Pixel Avatar Preview */}
          <div className="w-full md:w-56 shrink-0 flex flex-col items-center">
            <div className="p-3 bg-stone-950 border-2 border-amber-800/60 rounded-xl shadow-inner mb-3">
              <canvas
                ref={canvasRef}
                width={160}
                height={200}
                className="block select-none"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="text-center w-full">
              <p className="font-bold text-amber-200 text-sm">{name || '神秘旅人'}</p>
              <p className="text-xs text-stone-400 mt-0.5">{title || '漫游者'}</p>
              <div className="mt-2 text-[11px] text-amber-400/80 bg-stone-950/80 p-2 rounded border border-stone-800">
                ✦ 实时像素渲染预览
              </div>
            </div>
          </div>

          {/* Right: Controls & Details */}
          <div className="flex-1 space-y-4">
            {/* Step 1: Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-stone-950/50 p-3.5 rounded-xl border border-stone-800">
              <div>
                <label className="block text-xs text-stone-400 mb-1">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="如: 艾德蒙"
                  className="w-full bg-stone-800 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">称号</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="如: 孤影斥候"
                  className="w-full bg-stone-800 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">种族</label>
                <select
                  value={race}
                  onChange={(e) => {
                    setRace(e.target.value);
                    if (e.target.value === '山地矮人') {
                      setAppearance((p) => ({ ...p, bodyType: 'dwarf' }));
                    } else if (e.target.value === '高等精灵' || e.target.value === '半精灵') {
                      setAppearance((p) => ({ ...p, bodyType: 'elf' }));
                    } else {
                      setAppearance((p) => ({ ...p, bodyType: 'human' }));
                    }
                  }}
                  className="w-full bg-stone-800 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="人类">人类</option>
                  <option value="半精灵">半精灵</option>
                  <option value="高等精灵">高等精灵</option>
                  <option value="山地矮人">山地矮人</option>
                  <option value="半身人">半身人</option>
                  <option value="提夫林">提夫林</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">职业</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="流浪剑士">流浪剑士</option>
                  <option value="吟游诗人">吟游诗人</option>
                  <option value="游侠斥候">游侠斥候</option>
                  <option value="占星学徒">占星学徒</option>
                  <option value="圣武士">圣武士</option>
                  <option value="盗贼潜行者">盗贼潜行者</option>
                  <option value="铁匠学徒">铁匠学徒</option>
                  <option value="古董商人">古董商人</option>
                </select>
              </div>
            </div>

            {/* Step 2: Appearance Customizer */}
            <div className="bg-stone-950/50 p-3.5 rounded-xl border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> 像素外观组合系统
              </h4>

              {/* Hairstyle & Face Feature */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">发型</label>
                  <select
                    value={appearance.hairStyle}
                    onChange={(e) => setAppearance({ ...appearance, hairStyle: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded p-1.5 text-xs"
                  >
                    <option value="short">利落短发</option>
                    <option value="long">披肩长发</option>
                    <option value="braid">精灵编发</option>
                    <option value="wizard_hat">高尖法师帽</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">面部特征</label>
                  <select
                    value={appearance.faceFeature}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        faceFeature: e.target.value as GuestAppearance['faceFeature'],
                      })
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded p-1.5 text-xs"
                  >
                    <option value="clean">清秀无暇</option>
                    <option value="beard_red">赤红大胡子</option>
                    <option value="beard_gray">沧桑长白须</option>
                    <option value="glasses">炼金铜眼镜</option>
                    <option value="scar">战伤疤痕</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">服饰风格</label>
                  <select
                    value={appearance.outfit}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        outfit: e.target.value as GuestAppearance['outfit'],
                      })
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded p-1.5 text-xs"
                  >
                    <option value="ranger_leather">游侠皮甲</option>
                    <option value="bard_tunic">诗人束腰外衣</option>
                    <option value="smith_apron">铁匠皮围裙</option>
                    <option value="mage_robe">法师符文袍</option>
                    <option value="plate_armor">重装护身甲</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">特殊配饰</label>
                  <select
                    value={appearance.accessory}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        accessory: e.target.value as GuestAppearance['accessory'],
                      })
                    }
                    className="w-full bg-stone-800 border border-stone-700 rounded p-1.5 text-xs"
                  >
                    <option value="none">无配饰</option>
                    <option value="feather_hat">羽毛阔檐帽</option>
                    <option value="cloak">防风旅人斗篷</option>
                    <option value="locket">秘银吊坠</option>
                  </select>
                </div>
              </div>

              {/* Skin & Hair color palettes */}
              <div className="flex flex-wrap gap-4 pt-1">
                <div>
                  <span className="text-[11px] text-stone-400 block mb-1">肤色选择：</span>
                  <div className="flex gap-1.5">
                    {SKIN_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setAppearance({ ...appearance, skinColor: c })}
                        className={`w-5 h-5 rounded-full border ${
                          appearance.skinColor === c ? 'ring-2 ring-amber-400 border-white' : 'border-stone-700'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 block mb-1">发色选择：</span>
                  <div className="flex gap-1.5">
                    {HAIR_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setAppearance({ ...appearance, hairColor: c })}
                        className={`w-5 h-5 rounded-full border ${
                          appearance.hairColor === c ? 'ring-2 ring-amber-400 border-white' : 'border-stone-700'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 block mb-1">服饰主色：</span>
                  <div className="flex gap-1.5">
                    {OUTFIT_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setAppearance({ ...appearance, outfitColor: c })}
                        className={`w-5 h-5 rounded-full border ${
                          appearance.outfitColor === c ? 'ring-2 ring-amber-400 border-white' : 'border-stone-700'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Personality Traits */}
            <div className="bg-stone-950/50 p-3.5 rounded-xl border border-stone-800">
              <label className="block text-xs font-bold text-amber-300 mb-2">
                性格特质 (最多选4项)：
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  '豪爽',
                  '重诺',
                  '健谈',
                  '傲慢',
                  '温柔',
                  '狡猾',
                  '多虑',
                  '怀旧',
                  '戒备',
                  '伤痕累累',
                  '孤傲',
                  '贪杯',
                ].map((trait) => {
                  const isSelected = selectedTraits.includes(trait);
                  return (
                    <button
                      type="button"
                      key={trait}
                      onClick={() => handleTraitToggle(trait)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                        isSelected
                          ? 'bg-amber-900 text-amber-200 border-amber-500'
                          : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Background Story & Deep Drunken Secret */}
            <div className="bg-stone-950/50 p-3.5 rounded-xl border border-stone-800 space-y-3">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  人物背景故事：
                </label>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="曾经失去队友的流浪猎手，不再轻易相信任何人，却经常坐在壁炉角落默默擦拭自己的旧皮甲……"
                  rows={2}
                  className="w-full bg-stone-800 border border-stone-700 rounded p-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  大醉时吐露的心底秘密 (醉话收集核心)：
                </label>
                <textarea
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="我曾在北境的雪崩现场捡到过一块带血的星辰徽章，三十年来我一直藏在怀里……"
                  rows={2}
                  className="w-full bg-stone-800 border border-stone-700 rounded p-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Step 5: Relationship Binding */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  与酒馆现有角色的羁绊宿命：
                </label>
                <div className="flex gap-2">
                  <select
                    value={boundRelation.targetId}
                    onChange={(e) =>
                      setBoundRelation({ ...boundRelation, targetId: e.target.value })
                    }
                    className="flex-1 bg-stone-800 border border-stone-700 rounded p-1.5 text-xs text-stone-200"
                  >
                    {existingGuests.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.title})
                      </option>
                    ))}
                  </select>

                  <select
                    value={boundRelation.type}
                    onChange={(e) =>
                      setBoundRelation({ ...boundRelation, type: e.target.value })
                    }
                    className="w-32 bg-stone-800 border border-stone-700 rounded p-1.5 text-xs text-stone-200"
                  >
                    <option value="friend">至交好友</option>
                    <option value="comrade">昔日战友</option>
                    <option value="rival">宿命宿敌</option>
                    <option value="stranger">初次相遇</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 text-xs font-bold transition-all shadow-lg shadow-amber-950/40 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> 邀请入驻酒馆
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
