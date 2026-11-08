export type FlavorKey = "pistachio" | "strawberry" | "mango" | "blueberry";

export type Reveal = "circle" | "inset" | "diagonal" | "ellipse";

export interface Flavor {
  key: FlavorKey;
  index: string;
  name: string;
  italian: string;
  origin: string;
  coords: string;
  originLine: string;
  /** colour sampled from the product film's backdrop — the canvas stage sits on it seamlessly */
  stage: string;
  light: string;
  deep: string;
  ingredients: { name: string; note: string }[];
  ingredientsLine: string;
  notes: string[];
  captions: [string, string, string];
  price: string;
  reveal: Reveal;
}

export const FLAVORS: Flavor[] = [
  {
    key: "pistachio",
    index: "01",
    name: "Pistachio",
    italian: "Pistacchio",
    origin: "Bronte, Sicily",
    coords: "37.79°N — 14.83°E",
    originLine: "Grown in black volcanic soil on the slopes of Etna, harvested by hand every other year.",
    stage: "#a8b98c",
    light: "#d4e2b4",
    deep: "#2f5d29",
    ingredients: [
      { name: "Bronte pistachio", note: "stone-ground, 18%" },
      { name: "Whole milk", note: "from one farm" },
      { name: "Cane sugar", note: "barely" },
    ],
    ingredientsLine: "Three ingredients. Zero shortcuts.",
    notes: ["Toasted", "Buttery", "A little salty"],
    captions: ["A cup of quiet green.", "Then the crunch arrives.", "Finished with warm pistachio cream."],
    price: "€4.80",
    reveal: "circle",
  },
  {
    key: "strawberry",
    index: "02",
    name: "Strawberry",
    italian: "Fragola",
    origin: "Nemi, Lazio",
    coords: "41.72°N — 12.72°E",
    originLine: "Small, fierce strawberries from the crater-lake fields — picked at dawn, churned by noon.",
    stage: "#c46672",
    light: "#f7b3bf",
    deep: "#a3173a",
    ingredients: [
      { name: "Field strawberries", note: "42% fruit" },
      { name: "Lemon", note: "a squeeze" },
      { name: "Cane sugar", note: "just enough" },
    ],
    ingredientsLine: "More fruit than anything else.",
    notes: ["Bright", "Jammy", "Sun-warm"],
    captions: ["Pink, the honest way.", "Fresh-cut berries tumble in.", "A ribbon of slow-cooked coulis."],
    price: "€4.50",
    reveal: "inset",
  },
  {
    key: "mango",
    index: "03",
    name: "Mango",
    italian: "Mango",
    origin: "Ratnagiri, India",
    coords: "16.99°N — 73.31°E",
    originLine: "Alphonso mangoes, ripened on the branch until they smell like sunshine.",
    stage: "#dcaa62",
    light: "#ffd59a",
    deep: "#c64a1c",
    ingredients: [
      { name: "Alphonso mango", note: "55% pulp" },
      { name: "Lime zest", note: "for lift" },
      { name: "Cane sugar", note: "a whisper" },
    ],
    ingredientsLine: "Dairy-free. Nothing missing.",
    notes: ["Tropical", "Velvet", "Honeyed"],
    captions: ["Golden hour, in a cup.", "Cubes of ripe Alphonso.", "A glossy mango coulis pour."],
    price: "€4.60",
    reveal: "diagonal",
  },
  {
    key: "blueberry",
    index: "04",
    name: "Blueberry",
    italian: "Mirtillo",
    origin: "Trentino hills",
    coords: "46.07°N — 11.12°E",
    originLine: "Wild blueberries from misty mountain slopes, foraged when the fog lifts.",
    stage: "#9389c7",
    light: "#c9c1fb",
    deep: "#33227a",
    ingredients: [
      { name: "Wild blueberries", note: "38% fruit" },
      { name: "Mascarpone", note: "for silk" },
      { name: "Cane sugar", note: "softly" },
    ],
    ingredientsLine: "Small berries. Big colour.",
    notes: ["Wild", "Tart", "Creamy"],
    captions: ["Violet and velvet.", "A rain of wild berries.", "Dark berry compote, slowly."],
    price: "€4.70",
    reveal: "ellipse",
  },
];

export const img = (name: string, w: 1000 | 2000 = 2000) => `/img/${name}-${w}.webp`;
export const FRAME_COUNT = 190;
export const frameSrc = (flavor: FlavorKey, i: number) =>
  `/frames/${flavor}/${String(i + 1).padStart(4, "0")}.webp`;
