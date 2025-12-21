export const COLOR_MAP: Record<string, { selected: string; hover: string }> = {
  gray: {
    selected: "bg-gray-500 text-white border-gray-500",
    hover: "hover:bg-gray-100 hover:border-gray-400",
  },
  red: {
    selected: "bg-red-500 text-white border-red-500",
    hover: "hover:bg-red-100 hover:border-red-400",
  },
  orange: {
    selected: "bg-orange-500 text-white border-orange-500",
    hover: "hover:bg-orange-100 hover:border-orange-400",
  },
  yellow: {
    selected: "bg-yellow-500 text-white border-yellow-500",
    hover: "hover:bg-yellow-100 hover:border-yellow-400",
  },
  green: {
    selected: "bg-green-500 text-white border-green-500",
    hover: "hover:bg-green-100 hover:border-green-400",
  },
  blue: {
    selected: "bg-blue-500 text-white border-blue-500",
    hover: "hover:bg-blue-100 hover:border-blue-400",
  },
  purple: {
    selected: "bg-purple-500 text-white border-purple-500",
    hover: "hover:bg-purple-100 hover:border-purple-400",
  },
  sky: {
    selected: "bg-sky-500 text-white border-sky-500",
    hover: "hover:bg-sky-100 hover:border-sky-400",
  },
  slate: {
    selected: "bg-slate-500 text-white border-slate-500",
    hover: "hover:bg-slate-100 hover:border-slate-400",
  },
  stone: {
    selected: "bg-stone-400 text-white border-stone-400",
    hover: "hover:bg-stone-100 hover:border-stone-400",
  },
  black: {
    selected: "bg-black text-white border-black",
    hover: "hover:bg-zinc-100 hover:border-zinc-400",
  },
  emerald: {
    selected: "bg-emerald-600 text-white border-emerald-600",
    hover: "hover:bg-emerald-100 hover:border-emerald-400",
  },
  "blue-900": {
    selected: "bg-blue-900 text-white border-blue-900",
    hover: "hover:bg-blue-100 hover:border-blue-400",
  },
};

export const RARITY_COLOR_MAP: Record<string, string> = {
  기본: "bg-gray-400 text-white",
  EX: "bg-yellow-300 text-black",
  레어: "bg-blue-500 text-white",
  슈퍼레어: "bg-green-500 text-white",
  울트라슈퍼레어: "bg-red-600 text-white",
  레전드레어: "bg-purple-800 text-white",
};

export const TARGET_COLOR_MAP: Record<string, string> = {
  Red: "bg-red-500 text-white",
  Floating: "bg-green-500 text-white",
  Black: "bg-black text-white",
  Metal: "bg-slate-400 text-white",
  Angel: "bg-yellow-300 text-black",
  Alien: "bg-sky-400 text-white",
  Zombie: "bg-purple-600 text-white",
  Relic: "bg-emerald-700 text-white",
  Demon: "bg-blue-900 text-white",
  White: "bg-stone-400 text-black",
};

export function getColorClasses(color: string, isSelected: boolean): string {
  const c = COLOR_MAP[color] ?? COLOR_MAP.gray;
  return isSelected ? c.selected : `bg-white border-gray-300 ${c.hover}`;
}

export function getRarityColor(rarity: string): string {
  return RARITY_COLOR_MAP[rarity] ?? "bg-gray-300 text-black";
}

export function getTargetColor(target: string): string {
  return TARGET_COLOR_MAP[target] ?? "bg-gray-200 text-gray-600";
}

export function getEffectColor(_effect: string): string {
  return "bg-gray-200 text-gray-600";
}

export default {
  COLOR_MAP,
  RARITY_COLOR_MAP,
  TARGET_COLOR_MAP,
  getColorClasses,
  getRarityColor,
  getTargetColor,
  getEffectColor,
};
