export interface LocationOption {
  id: string;
  label: string;
  cities: string[];
}

export const locationOptions: LocationOption[] = [
  { id: "london", label: "London", cities: ["london"] },
  {
    id: "north",
    label: "The North",
    cities: ["manchester", "leeds", "liverpool", "newcastle", "sheffield"],
  },
  { id: "midlands", label: "Midlands", cities: ["birmingham", "nottingham"] },
  {
    id: "scotland_ni",
    label: "Scotland & NI",
    cities: ["glasgow", "edinburgh", "belfast"],
  },
  {
    id: "south_west_wales",
    label: "South West & Wales",
    cities: ["bristol", "bath", "cardiff"],
  },
  { id: "rural_hidden_gems", label: "Rural & Hidden Gems", cities: [] },
];

export const mainCities: string[] = [
  "london",
  "manchester",
  "leeds",
  "liverpool",
  "birmingham",
  "nottingham",
  "glasgow",
  "edinburgh",
  "belfast",
  "bristol",
  "bath",
  "cardiff",
  "sheffield",
  "newcastle",
];
