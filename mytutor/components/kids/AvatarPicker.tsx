"use client";

const AVATARS = [
  { id: "1", emoji: "🦁", name: "Leo the Lion" },
  { id: "2", emoji: "🐸", name: "Froggy" },
  { id: "3", emoji: "🐼", name: "Panda" },
  { id: "4", emoji: "🐧", name: "Penny Penguin" },
  { id: "5", emoji: "🐬", name: "Dory" },
  { id: "6", emoji: "🦋", name: "Flutter" },
  { id: "7", emoji: "🦊", name: "Firefox" },
  { id: "8", emoji: "🐉", name: "Dino" },
];

interface AvatarPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((av) => (
        <button
          key={av.id}
          type="button"
          onClick={() => onSelect(av.id)}
          className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200 ${
            selected === av.id
              ? "border-purple-400 bg-purple-900/30 scale-110 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              : "border-blue-800/40 bg-white/5 hover:border-purple-500/60 hover:scale-105"
          }`}
          aria-label={av.name}
        >
          <span className="text-4xl leading-none">{av.emoji}</span>
          <span className="text-xs text-blue-200 truncate w-full text-center">{av.name.split(" ")[0]}</span>
        </button>
      ))}
    </div>
  );
}

export function AvatarDisplay({ avatarId, size = "md" }: { avatarId: string; size?: "sm" | "md" | "lg" }) {
  const av = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
  const sizes = { sm: "text-2xl", md: "text-4xl", lg: "text-7xl" };
  return <span className={sizes[size]}>{av.emoji}</span>;
}

export { AVATARS };
