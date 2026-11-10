import React, { useEffect, useRef, useState } from 'react';
import { DialogueBubble, Guest } from '../types/game';

interface TavernCanvasProps {
  guests: Guest[];
  selectedGuestId: string | null;
  activeBubbles: DialogueBubble[];
  onSelectGuest: (id: string) => void;
  onCollectBubble: (bubbleId: string) => void;
  weather: 'rain' | 'heavy_rain' | 'drizzle' | 'night_clear';
  fireplaceLevel: number;
  maxCapacity: number;
  onOpenUpgrade?: () => void;
}

// Seat positions in world coordinates (800 x 420 virtual resolution)
export const SEAT_COORDS = [
  { x: 190, y: 260, tableX: 235, tableY: 275, name: '窗边木桌 A (席位1)' }, // Seat 0 (Mila)
  { x: 280, y: 260, tableX: 235, tableY: 275, name: '窗边木桌 B (席位2)' }, // Seat 1 (Paulin)
  { x: 420, y: 260, tableX: 470, tableY: 275, name: '中央酒桌 A (席位3)' }, // Seat 2 (Silas)
  { x: 520, y: 260, tableX: 470, tableY: 275, name: '中央酒桌 B (扩建席位4)' }, // Seat 3 (Eileen / Unlocked at level 2)
  { x: 640, y: 245, tableX: 680, tableY: 260, name: '吧台高脚凳 (扩建席位5)' }, // Seat 4 (Bruno / Unlocked at level 2)
];

export const TavernCanvas: React.FC<TavernCanvasProps> = ({
  guests,
  selectedGuestId,
  activeBubbles,
  onSelectGuest,
  onCollectBubble,
  weather,
  fireplaceLevel,
  maxCapacity,
  onOpenUpgrade,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredGuestId, setHoveredGuestId] = useState<string | null>(null);
  const [hoveredSeatIndex, setHoveredSeatIndex] = useState<number | null>(null);

  // Particle systems
  const rainDropsRef = useRef<Array<{ x: number; y: number; speed: number; len: number }>>([]);
  const embersRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }>>([]);
  const musicNotesRef = useRef<Array<{ x: number; y: number; vy: number; life: number; char: string; alpha: number }>>([]);
  const floatingTextsRef = useRef<Array<{ id: string; x: number; y: number; text: string; color: string; life: number }>>([]);

  // Initialize particles once
  useEffect(() => {
    // Rain
    const rain: Array<{ x: number; y: number; speed: number; len: number }> = [];
    for (let i = 0; i < 45; i++) {
      rain.push({
        x: Math.random() * 260 + 50,
        y: Math.random() * 150 + 40,
        speed: 3 + Math.random() * 4,
        len: 8 + Math.random() * 8,
      });
    }
    rainDropsRef.current = rain;

    // Embers
    const embers: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }> = [];
    for (let i = 0; i < 25; i++) {
      embers.push({
        x: 720 + Math.random() * 30 - 15,
        y: 280 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.8 - Math.random() * 1.5,
        life: Math.random() * 50,
        maxLife: 40 + Math.random() * 40,
        size: 1.5 + Math.random() * 2,
      });
    }
    embersRef.current = embers;
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const W = 800;
      const H = 420;

      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = false;

      // 1. Cozy Tavern Background
      // Dark timber wall
      ctx.fillStyle = '#1c130d';
      ctx.fillRect(0, 0, W, H);

      // Wooden horizontal planks
      ctx.fillStyle = '#261b14';
      for (let y = 0; y < 290; y += 22) {
        ctx.fillRect(0, y, W, 2);
      }

      // Wooden beams
      ctx.fillStyle = '#180e08';
      ctx.fillRect(0, 0, W, 14); // ceiling beam
      ctx.fillRect(160, 0, 16, 290);
      ctx.fillRect(360, 0, 16, 290);
      ctx.fillRect(580, 0, 18, 290);

      // Floor (warm flagstone / dark polished oak)
      const floorGrad = ctx.createLinearGradient(0, 280, 0, H);
      floorGrad.addColorStop(0, '#2e1c12');
      floorGrad.addColorStop(1, '#190d07');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 280, W, H - 280);

      // Floor plank lines
      ctx.fillStyle = '#130a05';
      ctx.fillRect(0, 280, W, 3);
      for (let x = 30; x < W; x += 65) {
        ctx.fillRect(x, 280, 2, H - 280);
      }

      // 2. Large Arched Stained Leaded Glass Window (Rain outside)
      const winX = 60;
      const winY = 40;
      const winW = 100;
      const winH = 130;

      // Outer window brick arch
      ctx.fillStyle = '#110b08';
      ctx.fillRect(winX - 6, winY - 6, winW + 12, winH + 12);

      // Outside night sky (dark rainy stormy indigo)
      const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      skyGrad.addColorStop(0, '#090e1d');
      skyGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(winX, winY, winW, winH);

      // Distant dark pine mountains silhouette through rain
      ctx.fillStyle = '#060a14';
      ctx.beginPath();
      ctx.moveTo(winX, winY + 90);
      ctx.lineTo(winX + 35, winY + 65);
      ctx.lineTo(winX + 70, winY + 80);
      ctx.lineTo(winX + winW, winY + 55);
      ctx.lineTo(winX + winW, winY + winH);
      ctx.lineTo(winX, winY + winH);
      ctx.fill();

      // Rain animation inside window
      if (weather !== 'night_clear') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1;
        rainDropsRef.current.forEach((drop) => {
          if (drop.x >= winX && drop.x <= winX + winW && drop.y >= winY && drop.y <= winY + winH) {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x - 1, drop.y + drop.len);
            ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > winY + winH) {
              drop.y = winY + Math.random() * 10;
              drop.x = winX + Math.random() * winW;
            }
          }
        });
      }

      // Window panes & wooden frame grid
      ctx.strokeStyle = '#2b1a10';
      ctx.lineWidth = 3;
      ctx.strokeRect(winX, winY, winW, winH);
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.moveTo(winX + winW / 2 - 1, winY + winH / 2);
      ctx.lineTo(winX + winW / 2 + 1, winY + winH / 2);
      ctx.stroke();

      // Window sill & tiny candle
      ctx.fillStyle = '#3c2417';
      ctx.fillRect(winX - 8, winY + winH, winW + 16, 8);
      // Small candle on sill
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(winX + 16, winY + winH - 10, 4, 10);
      ctx.fillStyle = tick % 8 > 4 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(winX + 16, winY + winH - 14, 4, 4);

      // 3. Shelves & Bottles Behind Counter
      const shelfY = 80;
      ctx.fillStyle = '#2d1b11';
      ctx.fillRect(380, shelfY, 180, 6);
      ctx.fillRect(380, shelfY + 45, 180, 6);

      // Bottles on shelves
      const bottleColors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];
      for (let i = 0; i < 9; i++) {
        const bx = 390 + i * 18;
        ctx.fillStyle = bottleColors[i % bottleColors.length];
        ctx.fillRect(bx, shelfY - 14, 8, 14);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(bx + 2, shelfY - 18, 4, 4);
      }
      for (let i = 0; i < 9; i++) {
        const bx = 392 + i * 18;
        ctx.fillStyle = bottleColors[(i + 3) % bottleColors.length];
        ctx.fillRect(bx, shelfY + 45 - 12, 7, 12);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(bx + 1, shelfY + 45 - 15, 5, 3);
      }

      // Wooden barrel in corner
      ctx.fillStyle = '#452b1b';
      ctx.fillRect(380, shelfY + 54, 42, 55);
      ctx.fillStyle = '#1e1008';
      ctx.fillRect(380, shelfY + 64, 42, 3);
      ctx.fillRect(380, shelfY + 95, 42, 3);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(376, shelfY + 76, 5, 5); // tap

      // 4. Fireplace on the Right Side
      const fpX = 690;
      const fpY = 160;
      const fpW = 90;
      const fpH = 120;

      // Hearth Stone Arch
      ctx.fillStyle = '#262626';
      ctx.fillRect(fpX - 10, fpY, fpW + 20, fpH);
      ctx.fillStyle = '#404040';
      // Bricks
      for (let by = fpY; by < fpY + fpH; by += 15) {
        for (let bx = fpX - 10; bx < fpX + fpW + 10; bx += 22) {
          ctx.strokeStyle = '#171717';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, 20, 14);
        }
      }

      // Fireplace opening
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(fpX, fpY + 30, fpW, fpH - 30);

      // Fireplace Mantelpiece & Shelf
      ctx.fillStyle = '#3a2012';
      ctx.fillRect(fpX - 16, fpY - 8, fpW + 32, 12);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(fpX + 15, fpY - 24, 60, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(fpX + 42, fpY - 29, 6, 14);

      // Fireplace Logs
      ctx.fillStyle = '#451a03';
      ctx.fillRect(fpX + 12, fpY + fpH - 16, 66, 12);

      // Roaring Animated Flames
      const flamePulse = Math.sin(tick * 0.2) * 4;
      const flameHeight = 35 + flamePulse + fireplaceLevel * 6;

      // Outer Red flame
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(fpX + 15, fpY + fpH - 14);
      ctx.lineTo(fpX + 35, fpY + fpH - 14 - flameHeight);
      ctx.lineTo(fpX + 45, fpY + fpH - 25);
      ctx.lineTo(fpX + 60, fpY + fpH - 14 - flameHeight * 0.9);
      ctx.lineTo(fpX + 75, fpY + fpH - 14);
      ctx.fill();

      // Inner Yellow flame
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(fpX + 26, fpY + fpH - 14);
      ctx.lineTo(fpX + 42, fpY + fpH - 14 - flameHeight * 0.7);
      ctx.lineTo(fpX + 50, fpY + fpH - 20);
      ctx.lineTo(fpX + 62, fpY + fpH - 14 - flameHeight * 0.65);
      ctx.lineTo(fpX + 68, fpY + fpH - 14);
      ctx.fill();

      // White-hot core
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fpX + 38, fpY + fpH - 22, 14, 10);

      // Embers rising from fire
      embersRef.current.forEach((emb) => {
        ctx.fillStyle = emb.life > emb.maxLife * 0.5 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(emb.x, emb.y, emb.size, emb.size);

        emb.x += emb.vx;
        emb.y += emb.vy;
        emb.life += 1;

        if (emb.life > emb.maxLife || emb.y < fpY) {
          emb.life = 0;
          emb.x = fpX + 25 + Math.random() * 40;
          emb.y = fpY + fpH - 16;
          emb.vy = -0.8 - Math.random() * 1.5;
        }
      });

      // Warm Fireplace Light Overlay
      const fireGlow = ctx.createRadialGradient(
        fpX + 45,
        fpY + fpH - 20,
        15,
        fpX + 45,
        fpY + fpH - 20,
        220 + flamePulse * 10
      );
      fireGlow.addColorStop(0, 'rgba(251, 146, 60, 0.28)');
      fireGlow.addColorStop(0.5, 'rgba(234, 88, 12, 0.12)');
      fireGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fireGlow;
      ctx.fillRect(0, 0, W, H);

      // Hanging Brass Lanterns
      const drawLantern = (lx: number, ly: number) => {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lx, 10);
        ctx.lineTo(lx, ly);
        ctx.stroke();

        ctx.fillStyle = '#78350f';
        ctx.fillRect(lx - 7, ly, 14, 18);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lx - 5, ly + 3, 10, 12);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(lx - 2, ly + 7, 4, 5);

        const lanternGlow = ctx.createRadialGradient(lx, ly + 9, 4, lx, ly + 9, 100);
        lanternGlow.addColorStop(0, 'rgba(254, 240, 138, 0.18)');
        lanternGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = lanternGlow;
        ctx.beginPath();
        ctx.arc(lx, ly + 9, 100, 0, Math.PI * 2);
        ctx.fill();
      };
      drawLantern(235, 60);
      drawLantern(470, 60);

      // 5. Bar Counter & Tables
      // Main Counter (on the right)
      ctx.fillStyle = '#3a2012';
      ctx.fillRect(580, 220, 110, 70);
      ctx.fillStyle = '#543019';
      ctx.fillRect(576, 216, 118, 8); // polished counter edge
      // Old tavern beer taps
      ctx.fillStyle = '#d97706';
      ctx.fillRect(600, 198, 6, 18);
      ctx.fillRect(620, 198, 6, 18);
      ctx.fillRect(597, 194, 12, 4);
      ctx.fillRect(617, 194, 12, 4);

      // Tables Drawing Function
      const drawTable = (tx: number, ty: number, tw: number, isExpanded = false) => {
        // Table top
        ctx.fillStyle = isExpanded ? '#4a2818' : '#422415';
        ctx.fillRect(tx - tw / 2, ty, tw, 10);
        ctx.fillStyle = isExpanded ? '#6c3b22' : '#5c331e';
        ctx.fillRect(tx - tw / 2 - 2, ty - 2, tw + 4, 4);

        if (isExpanded) {
          // Inlaid golden wood grain edge for upgraded table
          ctx.fillStyle = '#d97706';
          ctx.fillRect(tx - tw / 2, ty + 1, tw, 1.5);
        }

        // Legs
        ctx.fillStyle = '#24140c';
        ctx.fillRect(tx - tw / 2 + 6, ty + 10, 6, 25);
        ctx.fillRect(tx + tw / 2 - 12, ty + 10, 6, 25);
        if (tw > 100) {
          ctx.fillRect(tx - 3, ty + 10, 6, 25); // middle leg for large table
        }

        // Candle on table
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(tx - 2, ty - 12, 4, 10);
        ctx.fillStyle = tick % 10 > 5 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(tx - 2, ty - 16, 4, 4);

        // Candle glow
        const cGlow = ctx.createRadialGradient(tx, ty - 12, 2, tx, ty - 12, 45);
        cGlow.addColorStop(0, 'rgba(254, 243, 199, 0.22)');
        cGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cGlow;
        ctx.beginPath();
        ctx.arc(tx, ty - 12, 45, 0, Math.PI * 2);
        ctx.fill();

        // Drink mug / chalice on table
        ctx.fillStyle = '#5c2b09';
        ctx.fillRect(tx + 12, ty - 9, 9, 9); // tankard body
        ctx.fillStyle = '#a16207';
        ctx.fillRect(tx + 20, ty - 7, 3, 5); // handle
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(tx + 12, ty - 11, 9, 3); // frothy foam
      };

      // Table 1 (Window Table, Seats 0 & 1): Always 2 seats
      drawTable(235, 275, 110);

      // Table 2 (Center Table, Seats 2 & 3):
      if (maxCapacity >= 5) {
        drawTable(470, 275, 135, true); // Expanded Red Oak Table
      } else {
        drawTable(420, 275, 75, false); // Initial Single-seater Table
      }

      // 5.5 Draw Active Drink Mugs for each seated guest
      guests.forEach((g) => {
        if (!g.status.isPresent || g.status.seatIndex < 0) return;
        const seat = SEAT_COORDS[g.status.seatIndex];
        if (!seat) return;
        const drinkX = seat.tableX + (g.status.seatIndex % 2 === 0 ? -12 : 14);
        const drinkY = seat.tableY - 10;

        const dId = g.status.currentDrinkId || 'malt_ale';
        if (dId === 'spring_water') {
          // Clay bowl of fresh cool water
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(drinkX, drinkY + 1, 9, 6);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(drinkX - 1, drinkY + 6, 11, 2);
        } else if (dId.includes('starlight') || dId.includes('aurora')) {
          // Glowing mystical chalice
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(drinkX + 1, drinkY - 1, 7, 7);
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(drinkX + 3, drinkY + 6, 3, 4);
          ctx.fillStyle = '#f3e8ff';
          ctx.fillRect(drinkX + 2, drinkY - 2, 5, 2);
        } else if (dId.includes('dragon') || dId.includes('dwarf')) {
          // Heavy dark iron tankard
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(drinkX, drinkY, 10, 8);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(drinkX + 1, drinkY - 2, 8, 3);
        } else if (dId.includes('cider') || dId.includes('wine')) {
          // Ruby glass goblet
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(drinkX + 2, drinkY, 6, 6);
          ctx.fillStyle = '#fb7185';
          ctx.fillRect(drinkX + 4, drinkY + 6, 2, 4);
        } else {
          // Oak Beer Mug
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(drinkX, drinkY, 9, 8);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(drinkX, drinkY - 2, 9, 3);
        }
      });

      // Check occupied seats
      const occupiedSeats = new Set<number>();
      guests.forEach((g) => {
        if (g.status.isPresent && g.status.seatIndex >= 0) {
          occupiedSeats.add(g.status.seatIndex);
        }
      });

      // 6. Draw Empty Chairs or Locked Seat Placeholders
      // Seats 0, 1, 2 are always unlocked
      for (let s = 0; s < 3; s++) {
        if (!occupiedSeats.has(s)) {
          drawEmptyChair(ctx, SEAT_COORDS[s].x, SEAT_COORDS[s].y, `席位 ${s + 1}`);
        }
      }

      // Seat 3: Unlocked if maxCapacity >= 5
      if (maxCapacity >= 5) {
        if (!occupiedSeats.has(3)) {
          drawEmptyChair(ctx, SEAT_COORDS[3].x, SEAT_COORDS[3].y, '扩建席位 4');
        }
      } else {
        // Locked Seat 3: Draw wooden expansion sign
        drawLockedSeat(ctx, SEAT_COORDS[3].x, SEAT_COORDS[3].y, '待扩建席位 4');
      }

      // Seat 4: Bar Stool at (640, 245)
      if (maxCapacity >= 5) {
        // Unlocked Bar Stool
        ctx.fillStyle = '#831843'; // Velvet red cushion
        ctx.fillRect(632, 253, 20, 6);
        ctx.fillStyle = '#22130b'; // stool leg
        ctx.fillRect(640, 259, 4, 25);
        ctx.fillStyle = '#d97706'; // brass ring
        ctx.fillRect(636, 270, 12, 3);

        if (!occupiedSeats.has(4)) {
          ctx.font = '9px sans-serif';
          ctx.fillStyle = '#a8a29e';
          ctx.textAlign = 'center';
          ctx.fillText('吧台空席', 642, 298);
        }
      } else {
        // Locked Bar Stool
        ctx.fillStyle = '#22130b';
        ctx.fillRect(638, 255, 8, 25);
        drawLockedSeat(ctx, 642, 248, '需扩建解锁');
      }

      // 7. Render Character Pixel Sprites
      guests.forEach((guest) => {
        if (!guest.status.isPresent || guest.status.seatIndex < 0) return;
        const seat = SEAT_COORDS[guest.status.seatIndex];
        if (!seat) return;

        const isHovered = hoveredGuestId === guest.id;
        const isSelected = selectedGuestId === guest.id;

        // Draw character sprite
        drawPixelCharacter(ctx, guest, seat.x, seat.y, tick, isHovered, isSelected);

        // Humming / musical notes animation for bard
        if (guest.status.currentAction === 'humming' && Math.random() < 0.08) {
          musicNotesRef.current.push({
            x: seat.x + (Math.random() * 20 - 10),
            y: seat.y - 45,
            vy: -0.6 - Math.random() * 0.5,
            life: 0,
            char: Math.random() > 0.5 ? '♪' : '♫',
            alpha: 1,
          });
        }
      });

      // Animate Music Notes
      ctx.font = 'bold 13px sans-serif';
      musicNotesRef.current.forEach((n) => {
        ctx.fillStyle = `rgba(251, 191, 36, ${n.alpha})`;
        ctx.fillText(n.char, n.x, n.y);
        n.y += n.vy;
        n.life += 1;
        n.alpha = Math.max(0, 1 - n.life / 60);
      });
      musicNotesRef.current = musicNotesRef.current.filter((n) => n.life < 60);

      // 8. Render Floating Speech Bubbles
      activeBubbles.forEach((bubble) => {
        const speaker = guests.find((g) => g.id === bubble.guestId);
        if (!speaker || !speaker.status.isPresent || speaker.status.seatIndex < 0) return;
        const seat = SEAT_COORDS[speaker.status.seatIndex];
        if (!seat) return;

        drawSpeechBubble(ctx, bubble, seat.x, seat.y - 58, tick);
      });

      // 9. Floating Texts / Rewards
      floatingTextsRef.current.forEach((ft) => {
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(ft.text, ft.x, ft.y);
        ft.y -= 0.5;
        ft.life += 1;
      });
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.life < 50);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [guests, selectedGuestId, activeBubbles, hoveredGuestId, weather, fireplaceLevel, maxCapacity]);

  // Handle canvas mouse move for interactive hover cursor & seat detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 420 / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Check if hovering over any guest
    let foundGuestId: string | null = null;
    let foundSeatIdx: number | null = null;

    guests.forEach((guest) => {
      if (!guest.status.isPresent || guest.status.seatIndex < 0) return;
      const seat = SEAT_COORDS[guest.status.seatIndex];
      if (!seat) return;

      if (
        mouseX >= seat.x - 25 &&
        mouseX <= seat.x + 25 &&
        mouseY >= seat.y - 50 &&
        mouseY <= seat.y + 20
      ) {
        foundGuestId = guest.id;
      }
    });

    // Check seat hover
    SEAT_COORDS.forEach((seat, idx) => {
      if (
        mouseX >= seat.x - 25 &&
        mouseX <= seat.x + 25 &&
        mouseY >= seat.y - 45 &&
        mouseY <= seat.y + 20
      ) {
        foundSeatIdx = idx;
      }
    });

    setHoveredGuestId(foundGuestId);
    setHoveredSeatIndex(foundSeatIdx);
  };

  // Handle canvas click to select guest, collect bubble, or unlock upgrade
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 420 / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // 1. First check if clicked on any active speech bubble
    for (const bubble of activeBubbles) {
      const speaker = guests.find((g) => g.id === bubble.guestId);
      if (!speaker || !speaker.status.isPresent || speaker.status.seatIndex < 0) continue;
      const seat = SEAT_COORDS[speaker.status.seatIndex];
      if (!seat) continue;

      const bubbleY = seat.y - 58;
      if (
        mouseX >= seat.x - 70 &&
        mouseX <= seat.x + 70 &&
        mouseY >= bubbleY - 40 &&
        mouseY <= bubbleY + 10
      ) {
        onCollectBubble(bubble.id);
        onSelectGuest(speaker.id);
        return;
      }
    }

    // 2. Check if clicked on guest or chair
    for (const guest of guests) {
      if (!guest.status.isPresent || guest.status.seatIndex < 0) continue;
      const seat = SEAT_COORDS[guest.status.seatIndex];
      if (!seat) continue;

      if (
        mouseX >= seat.x - 28 &&
        mouseX <= seat.x + 28 &&
        mouseY >= seat.y - 55 &&
        mouseY <= seat.y + 25
      ) {
        onSelectGuest(guest.id);
        return;
      }
    }

    // 3. Check if clicked on locked seats (3 or 4) to prompt upgrade
    if (maxCapacity < 5) {
      const seat3 = SEAT_COORDS[3];
      const seat4 = SEAT_COORDS[4];
      if (
        (mouseX >= seat3.x - 28 && mouseX <= seat3.x + 28 && mouseY >= seat3.y - 45 && mouseY <= seat3.y + 25) ||
        (mouseX >= seat4.x - 28 && mouseX <= seat4.x + 28 && mouseY >= seat4.y - 45 && mouseY <= seat4.y + 25)
      ) {
        if (onOpenUpgrade) {
          onOpenUpgrade();
        }
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border-4 border-amber-950 bg-stone-950 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={800}
        height={420}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredGuestId(null);
          setHoveredSeatIndex(null);
        }}
        className="w-full h-auto cursor-pointer block select-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

// --- Empty Chair Drawing ---
function drawEmptyChair(ctx: CanvasRenderingContext2D, x: number, y: number, name: string) {
  ctx.save();
  ctx.translate(x, y);

  // Chair Back
  ctx.fillStyle = '#3a2012';
  ctx.fillRect(-10, -38, 20, 24);
  ctx.fillStyle = '#4f2b18';
  ctx.fillRect(-8, -36, 16, 20);

  // Seat Cushion
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-11, -14, 22, 6);

  // Legs
  ctx.fillStyle = '#22130b';
  ctx.fillRect(-9, -8, 4, 10);
  ctx.fillRect(5, -8, 4, 10);

  // Empty Seat Label
  ctx.font = '9px sans-serif';
  ctx.fillStyle = '#a8a29e';
  ctx.textAlign = 'center';
  ctx.fillText(name, 0, 16);

  ctx.restore();
}

// --- Locked Seat Placeholder (Prompt Table Expansion) ---
function drawLockedSeat(ctx: CanvasRenderingContext2D, x: number, y: number, label: string) {
  ctx.save();
  ctx.translate(x, y);

  // Sawhorse / Construction Staging
  ctx.fillStyle = '#291e17';
  ctx.fillRect(-12, -18, 24, 4);
  ctx.fillRect(-10, -14, 4, 16);
  ctx.fillRect(6, -14, 4, 16);

  // Wooden Plaque
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-22, -38, 44, 18);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1;
  ctx.strokeRect(-22, -38, 44, 18);

  ctx.font = 'bold 8px sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.fillText('待扩建', 0, -26);

  ctx.font = '8px sans-serif';
  ctx.fillStyle = '#78716c';
  ctx.fillText('点击升级', 0, 14);

  ctx.restore();
}

// --- Custom Pixel Character Renderer ---
function drawPixelCharacter(
  ctx: CanvasRenderingContext2D,
  guest: Guest,
  x: number,
  y: number,
  tick: number,
  isHovered: boolean,
  isSelected: boolean
) {
  ctx.save();

  // Subtle breathing / idle sway
  const isSleeping = guest.status.state === 4;
  const isTipsy = guest.status.state >= 1 && guest.status.state < 4;
  const sway = isTipsy ? Math.sin(tick * 0.08 + x) * 1.5 : 0;
  const breathY = Math.sin(tick * 0.05 + x) * 1;

  ctx.translate(x + sway, y);

  // Selection / Hover Halo Glow
  if (isSelected || isHovered) {
    ctx.strokeStyle = isSelected ? '#fbbf24' : '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(-18, -48, 36, 52);

    if (isSelected) {
      // Golden corner brackets
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-20, -50, 6, 2);
      ctx.fillRect(-20, -50, 2, 6);
      ctx.fillRect(14, -50, 6, 2);
      ctx.fillRect(18, -50, 2, 6);
    }
  }

  // Shadow under chair
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const app = guest.appearance;
  const isDwarf = app.bodyType === 'dwarf';
  const yOffset = isDwarf ? 6 : 0;

  if (isSleeping) {
    // Slumped forward onto table
    ctx.fillStyle = app.outfitColor;
    ctx.fillRect(-12, -20 + yOffset, 24, 18);

    ctx.fillStyle = app.skinColor;
    ctx.fillRect(-10, -28 + yOffset, 20, 14);

    ctx.fillStyle = app.hairColor;
    ctx.fillRect(-11, -31 + yOffset, 22, 6);

    ctx.fillStyle = '#451a03';
    ctx.fillRect(-6, -23 + yOffset, 4, 1);
    ctx.fillRect(2, -23 + yOffset, 4, 1);

    const zOffset = (tick * 0.5) % 30;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('Z', 8 + zOffset * 0.2, -32 - zOffset);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('z', 13 + zOffset * 0.2, -40 - zOffset);
  } else {
    // Upright Seated Character
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8, -10 + breathY + yOffset, 6, 12);
    ctx.fillRect(2, -10 + breathY + yOffset, 6, 12);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-9, 0 + yOffset, 7, 4);
    ctx.fillRect(2, 0 + yOffset, 7, 4);

    ctx.fillStyle = app.outfitColor;
    ctx.fillRect(-11, -28 + breathY + yOffset, 22, 18);

    ctx.fillStyle = '#78350f';
    ctx.fillRect(-11, -12 + breathY + yOffset, 22, 3);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-2, -12 + breathY + yOffset, 4, 3);

    if (app.accessory === 'cloak') {
      ctx.fillStyle = '#065f46';
      ctx.fillRect(-14, -28 + breathY + yOffset, 4, 20);
      ctx.fillRect(10, -28 + breathY + yOffset, 4, 20);
    }

    ctx.fillStyle = app.skinColor;
    ctx.fillRect(-3, -31 + breathY + yOffset, 6, 4);

    ctx.fillStyle = app.skinColor;
    ctx.fillRect(-8, -44 + breathY + yOffset, 16, 14);

    if (app.bodyType === 'elf') {
      ctx.fillStyle = app.skinColor;
      ctx.fillRect(-11, -40 + breathY + yOffset, 3, 4);
      ctx.fillRect(8, -40 + breathY + yOffset, 3, 4);
    }

    ctx.fillStyle = app.hairColor;
    if (app.hairStyle === 'short') {
      ctx.fillRect(-9, -47 + breathY + yOffset, 18, 6);
      ctx.fillRect(-9, -44 + breathY + yOffset, 3, 6);
    } else if (app.hairStyle === 'braid' || app.hairStyle === 'long') {
      ctx.fillRect(-9, -47 + breathY + yOffset, 18, 6);
      ctx.fillRect(-10, -43 + breathY + yOffset, 3, 16);
      ctx.fillRect(7, -43 + breathY + yOffset, 3, 16);
    } else if (app.hairStyle === 'wizard_hat') {
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(-12, -47 + breathY + yOffset, 24, 4);
      ctx.fillRect(-7, -56 + breathY + yOffset, 14, 9);
      ctx.fillRect(-4, -64 + breathY + yOffset, 8, 8);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-6, -48 + breathY + yOffset, 12, 2);
    }

    if (app.accessory === 'feather_hat') {
      ctx.fillStyle = '#065f46';
      ctx.fillRect(-10, -48 + breathY + yOffset, 20, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(4, -56 + breathY + yOffset, 4, 10);
    }

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -39 + breathY + yOffset, 2, 3);
    ctx.fillRect(3, -39 + breathY + yOffset, 2, 3);

    if (app.faceFeature === 'glasses') {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(-6, -40 + breathY + yOffset, 4, 4);
      ctx.strokeRect(2, -40 + breathY + yOffset, 4, 4);
      ctx.beginPath();
      ctx.moveTo(-2, -38 + breathY + yOffset);
      ctx.lineTo(2, -38 + breathY + yOffset);
      ctx.stroke();
    }

    if (app.faceFeature === 'scar') {
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-4, -43 + breathY + yOffset, 2, 5);
    }

    if (app.faceFeature === 'beard_red') {
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-8, -35 + breathY + yOffset, 16, 12);
      ctx.fillRect(-5, -23 + breathY + yOffset, 10, 4);
    } else if (app.faceFeature === 'beard_gray') {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-7, -35 + breathY + yOffset, 14, 10);
    }

    if (guest.status.state >= 1) {
      const blushOpacity = guest.status.state === 1 ? '0.4' : guest.status.state === 2 ? '0.7' : '0.9';
      ctx.fillStyle = `rgba(244, 63, 94, ${blushOpacity})`;
      ctx.fillRect(-7, -36 + breathY + yOffset, 3, 2);
      ctx.fillRect(4, -36 + breathY + yOffset, 3, 2);
    }

    if (app.outfit === 'bard_tunic') {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-10, -22 + breathY + yOffset, 12, 10);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-12, -26 + breathY + yOffset, 4, 14);
    } else {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(8, -22 + breathY + yOffset, 6, 7);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(8, -24 + breathY + yOffset, 6, 2);
    }
  }

  // Name label
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isSelected ? '#fbbf24' : '#e2e8f0';
  ctx.fillText(guest.name, 0, 16);

  // Drunk Pill
  const drunkColor =
    guest.status.state === 0
      ? '#22c55e'
      : guest.status.state === 1
        ? '#eab308'
        : guest.status.state === 2
          ? '#f97316'
          : guest.status.state === 3
            ? '#ef4444'
            : '#8b5cf6';
  ctx.fillStyle = drunkColor;
  ctx.fillRect(-12, 20, 24, 3);

  ctx.restore();
}

// --- Speech Bubble Renderer ---
function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  bubble: DialogueBubble,
  x: number,
  y: number,
  tick: number
) {
  ctx.save();

  const bob = Math.sin(tick * 0.08 + x) * 2;
  const by = y + bob;

  const isDrunkWord = bubble.type === 'drunken_word';
  const isKeyClue = bubble.type === 'secret_clue';

  // Split lines by newline if formatted with expressions or multi-line text
  const rawLines = bubble.text.split('\n').filter((l) => l.trim().length > 0);
  const displayLines = rawLines.length > 0 ? rawLines : [bubble.text];

  ctx.font = '11px sans-serif';
  let maxW = 120;
  displayLines.forEach((l) => {
    const m = ctx.measureText(l);
    if (m.width > maxW) maxW = m.width;
  });

  const bw = Math.min(260, Math.max(130, maxW + 28));
  const lineHeight = 14;
  const bh = Math.max(28, displayLines.length * lineHeight + 12);
  const bx = x - bw / 2;

  ctx.fillStyle = isKeyClue ? '#451a03' : isDrunkWord ? '#291b12' : '#1e293b';
  ctx.strokeStyle = isKeyClue ? '#fbbf24' : isDrunkWord ? '#f59e0b' : '#94a3b8';
  ctx.lineWidth = isKeyClue ? 2 : 1.5;

  ctx.beginPath();
  ctx.roundRect(bx, by - bh, bw, bh, 6);
  ctx.fill();
  ctx.stroke();

  // Bubble tail pointing to character head
  ctx.fillStyle = isKeyClue ? '#451a03' : isDrunkWord ? '#291b12' : '#1e293b';
  ctx.beginPath();
  ctx.moveTo(x - 5, by);
  ctx.lineTo(x + 5, by);
  ctx.lineTo(x, by + 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const iconEmoji =
    bubble.type === 'secret_clue'
      ? '📜'
      : bubble.type === 'drunken_word'
        ? '🍺'
        : bubble.type === 'sleep'
          ? '💤'
          : '💬';

  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(iconEmoji, bx + 6, by - bh + 14);

  // Render each line
  displayLines.forEach((lineText, idx) => {
    const textY = by - bh + 14 + idx * lineHeight;
    let truncated = lineText;
    if (ctx.measureText(truncated).width > bw - 32) {
      while (ctx.measureText(truncated + '…').width > bw - 32 && truncated.length > 1) {
        truncated = truncated.slice(0, -1);
      }
      truncated += '…';
    }

    if (truncated.startsWith('（') || truncated.startsWith('(')) {
      ctx.fillStyle = '#94a3b8'; // subtle expression color
      ctx.font = 'italic 10px sans-serif';
    } else if (truncated.startsWith('[') || truncated.startsWith('【')) {
      ctx.fillStyle = '#fbbf24'; // action highlight
      ctx.font = 'bold 10px sans-serif';
    } else {
      ctx.fillStyle = isKeyClue ? '#fef08a' : '#f8fafc';
      ctx.font = '11px sans-serif';
    }

    ctx.fillText(truncated, bx + 22, textY);
  });

  if (bubble.isCollectable) {
    ctx.fillStyle = tick % 10 > 5 ? '#f59e0b' : '#fbbf24';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('✦点此收集', bx + bw - 44, by - 6);
  }

  ctx.restore();
}
