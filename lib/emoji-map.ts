// Comprehensive emoji mapping for PedaStudio flashcards
// 500+ words covering Grade 1-5 Balbharati English vocabulary
// Used by both scan/flashcard generation and lesson plan flashcard generation

export const emojiMap: Record<string, string> = {
  // === BODY PARTS ===
  // Each body part gets a unique, visually distinct emoji
  head: "\uD83D\uDDE3\uFE0F", face: "\uD83D\uDE42", shoulders: "\uD83E\uDD37", eyes: "\uD83D\uDC40", eye: "\uD83D\uDC41\uFE0F",
  ears: "\uD83D\uDC42", ear: "\uD83D\uDC42", nose: "\uD83D\uDC43", mouth: "\uD83D\uDC44", teeth: "\uD83E\uDDB7", tooth: "\uD83E\uDDB7",
  hand: "\u270B", hands: "\uD83D\uDE4C", fingers: "\u270C\uFE0F", finger: "\u261D\uFE0F", thumb: "\uD83D\uDC4D",
  feet: "\uD83E\uDDB6", foot: "\uD83E\uDDB6", toes: "\uD83E\uDDB6", leg: "\uD83E\uDDB5", legs: "\uD83E\uDDB5",
  hair: "\uD83D\uDC87", neck: "\uD83E\uDDE3", chin: "\uD83E\uDDD4", cheek: "\uD83D\uDE0A", tongue: "\uD83D\uDC45",
  heart: "\u2764\uFE0F", brain: "\uD83E\uDDE0", bones: "\uD83E\uDDB4", body: "\uD83D\uDEB6", skin: "\u270B",
  palm: "\uD83E\uDD1A", wrist: "\u231A", elbow: "\uD83D\uDCAA", knee: "\uD83E\uDDB5", stomach: "\uD83E\uDD30",
  arm: "\uD83D\uDCAA", arms: "\uD83D\uDCAA", back: "\uD83D\uDEB6", chest: "\uD83D\uDEB6",

  // === FAMILY & PEOPLE ===
  mother: "\uD83D\uDC69", mom: "\uD83D\uDC69", mummy: "\uD83D\uDC69", mama: "\uD83D\uDC69",
  father: "\uD83D\uDC68", dad: "\uD83D\uDC68", papa: "\uD83D\uDC68", daddy: "\uD83D\uDC68",
  sister: "\uD83D\uDC67", brother: "\uD83D\uDC66",
  grandmother: "\uD83D\uDC75", grandma: "\uD83D\uDC75", granny: "\uD83D\uDC75", nani: "\uD83D\uDC75",
  grandfather: "\uD83D\uDC74", grandpa: "\uD83D\uDC74", grandad: "\uD83D\uDC74", nana: "\uD83D\uDC74",
  family: "\uD83D\uDC6A", baby: "\uD83D\uDC76", child: "\uD83E\uDDD2", children: "\uD83D\uDC6B",
  boy: "\uD83D\uDC66", girl: "\uD83D\uDC67", man: "\uD83D\uDC68", woman: "\uD83D\uDC69",
  friend: "\uD83E\uDD1D", friends: "\uD83D\uDC6B", people: "\uD83D\uDC65", person: "\uD83E\uDDD1",
  king: "\uD83E\uDD34", queen: "\uD83D\uDC51", prince: "\uD83E\uDD34", princess: "\uD83D\uDC78",

  // === PROFESSIONS ===
  teacher: "\uD83D\uDC69\u200D\uD83C\uDFEB", doctor: "\uD83D\uDC69\u200D\u2695\uFE0F", nurse: "\uD83D\uDC69\u200D\u2695\uFE0F",
  farmer: "\uD83D\uDC68\u200D\uD83C\uDF3E", police: "\uD83D\uDC6E", policeman: "\uD83D\uDC6E", policewoman: "\uD83D\uDC6E",
  driver: "\uD83D\uDE97", cook: "\uD83D\uDC69\u200D\uD83C\uDF73", chef: "\uD83D\uDC68\u200D\uD83C\uDF73",
  soldier: "\uD83D\uDC82", postman: "\uD83D\uDCEE", firefighter: "\uD83D\uDC68\u200D\uD83D\uDE92",
  pilot: "\uD83D\uDC68\u200D\u2708\uFE0F", astronaut: "\uD83D\uDC68\u200D\uD83D\uDE80",
  scientist: "\uD83D\uDC68\u200D\uD83D\uDD2C", artist: "\uD83D\uDC68\u200D\uD83C\uDFA8",
  singer: "\uD83C\uDFA4", dancer: "\uD83D\uDC83", actor: "\uD83C\uDFAD", actress: "\uD83C\uDFAD",
  sailor: "\u26F5", tailor: "\uD83E\uDEA1", conductor: "\uD83D\uDE8C",

  // === ANIMALS ===
  cat: "\uD83D\uDC31", kitty: "\uD83D\uDC31", kitten: "\uD83D\uDC31", pussy: "\uD83D\uDC31",
  dog: "\uD83D\uDC36", puppy: "\uD83D\uDC36", pup: "\uD83D\uDC36",
  cow: "\uD83D\uDC04", buffalo: "\uD83D\uDC03", bull: "\uD83D\uDC02", ox: "\uD83D\uDC02",
  goat: "\uD83D\uDC10", sheep: "\uD83D\uDC11", lamb: "\uD83D\uDC11",
  horse: "\uD83D\uDC34", donkey: "\uD83D\uDEA3", pony: "\uD83D\uDC34",
  pig: "\uD83D\uDC37", tiger: "\uD83D\uDC2F", lion: "\uD83E\uDD81",
  elephant: "\uD83D\uDC18", deer: "\uD83E\uDD8C", bear: "\uD83D\uDC3B",
  zebra: "\uD83E\uDD93", giraffe: "\uD83E\uDD92", fox: "\uD83E\uDD8A", wolf: "\uD83D\uDC3A",
  monkey: "\uD83D\uDC12", gorilla: "\uD83E\uDD8D", rabbit: "\uD83D\uDC30", bunny: "\uD83D\uDC30",
  mouse: "\uD83D\uDC2D", mice: "\uD83D\uDC2D", rat: "\uD83D\uDC00", hamster: "\uD83D\uDC39",
  squirrel: "\uD83D\uDC3F\uFE0F", camel: "\uD83D\uDC2B", hippo: "\uD83E\uDD9B",
  frog: "\uD83D\uDC38", tortoise: "\uD83D\uDC22", turtle: "\uD83D\uDC22",
  snake: "\uD83D\uDC0D", lizard: "\uD83E\uDD8E", chameleon: "\uD83E\uDD8E", crocodile: "\uD83D\uDC0A",
  ant: "\uD83D\uDC1C", bee: "\uD83D\uDC1D", bug: "\uD83D\uDC1B", butterfly: "\uD83E\uDD8B",
  ladybug: "\uD83D\uDC1E", spider: "\uD83D\uDD77\uFE0F", insect: "\uD83D\uDC1B",
  snail: "\uD83D\uDC0C", caterpillar: "\uD83D\uDC1B", grasshopper: "\uD83E\uDD97",
  whale: "\uD83D\uDC33", dolphin: "\uD83D\uDC2C", shark: "\uD83E\uDD88",
  fish: "\uD83D\uDC1F", octopus: "\uD83D\uDC19", crab: "\uD83E\uDD80",
  hare: "\uD83D\uDC07", bat: "\uD83E\uDD87",

  // === BIRDS ===
  bird: "\uD83D\uDC26", crow: "\uD83D\uDC26\u200D\u2B1B", sparrow: "\uD83D\uDC26",
  eagle: "\uD83E\uDD85", peacock: "\uD83E\uDD9A", pigeon: "\uD83D\uDD4A\uFE0F",
  owl: "\uD83E\uDD89", parrot: "\uD83E\uDD9C", crane: "\uD83E\uDDA9",
  duck: "\uD83E\uDD86", hen: "\uD83D\uDC14", rooster: "\uD83D\uDC13", chick: "\uD83D\uDC24", chicken: "\uD83D\uDC14",
  swan: "\uD83E\uDDA2", flamingo: "\uD83E\uDDA9", penguin: "\uD83D\uDC27",

  // === FRUITS ===
  apple: "\uD83C\uDF4E", mango: "\uD83E\uDD6D", banana: "\uD83C\uDF4C",
  orange: "\uD83C\uDF4A", grapes: "\uD83C\uDF47", watermelon: "\uD83C\uDF49",
  strawberry: "\uD83C\uDF53", cherry: "\uD83C\uDF52", peach: "\uD83C\uDF51",
  pear: "\uD83C\uDF50", lemon: "\uD83C\uDF4B", pineapple: "\uD83C\uDF4D",
  coconut: "\uD83E\uDD65", guava: "\uD83C\uDF4F", fruit: "\uD83C\uDF53",
  plum: "\uD83C\uDF51", melon: "\uD83C\uDF48",

  // === VEGETABLES ===
  carrot: "\uD83E\uDD55", potato: "\uD83E\uDD54", tomato: "\uD83C\uDF45",
  corn: "\uD83C\uDF3D", brinjal: "\uD83C\uDF46", eggplant: "\uD83C\uDF46",
  onion: "\uD83E\uDDC5", garlic: "\uD83E\uDDC4", mushroom: "\uD83C\uDF44",
  pumpkin: "\uD83C\uDF83", cabbage: "\uD83E\uDD6C", lettuce: "\uD83E\uDD6C",
  peas: "\uD83E\uDED4", beans: "\uD83E\uDED8", spinach: "\uD83E\uDD6C",
  cauliflower: "\uD83E\uDD66", cucumber: "\uD83E\uDD52", pepper: "\uD83C\uDF36\uFE0F",
  vegetable: "\uD83E\uDD6C", vegetables: "\uD83E\uDD6C",

  // === FOOD & DRINK ===
  rice: "\uD83C\uDF5A", bread: "\uD83C\uDF5E", roti: "\uD83E\uDED3", chapati: "\uD83E\uDED3",
  milk: "\uD83E\uDD5B", cheese: "\uD83E\uDDC0", butter: "\uD83E\uDDC8", egg: "\uD83E\uDD5A",
  cake: "\uD83C\uDF82", cookie: "\uD83C\uDF6A", biscuit: "\uD83C\uDF6A", chocolate: "\uD83C\uDF6B",
  ice: "\uD83E\uDDCA", candy: "\uD83C\uDF6C", pizza: "\uD83C\uDF55",
  soup: "\uD83C\uDF72", tea: "\u2615", coffee: "\u2615", juice: "\uD83E\uDDC3",
  water: "\uD83D\uDCA7", food: "\uD83C\uDF7D\uFE0F", breakfast: "\uD83E\uDD5E", lunch: "\uD83C\uDF71", dinner: "\uD83C\uDF7D\uFE0F",
  sugar: "\uD83C\uDF6C", salt: "\uD83E\uDDC2", honey: "\uD83C\uDF6F", jam: "\uD83C\uDF53",
  pancake: "\uD83E\uDD5E", sandwich: "\uD83E\uDD6A", pie: "\uD83E\uDD67",
  sweets: "\uD83C\uDF6C", lemonade: "\uD83C\uDF4B", recipe: "\uD83D\uDCD6",

  // === HOME & FURNITURE ===
  house: "\uD83C\uDFE0", home: "\uD83C\uDFE0", hut: "\uD83D\uDED6",
  room: "\uD83C\uDFE0", bedroom: "\uD83D\uDECF\uFE0F", kitchen: "\uD83C\uDF73", bathroom: "\uD83D\uDEC1",
  door: "\uD83D\uDEAA", window: "\uD83E\uDE9F", roof: "\uD83C\uDFE0", wall: "\uD83E\uDDF1",
  floor: "\uD83C\uDFE0", stairs: "\uD83E\uDE9C", garden: "\uD83C\uDF3B",
  chair: "\uD83E\uDE91", table: "\uD83E\uDE91", desk: "\uD83E\uDE91", bench: "\uD83E\uDE91",
  bed: "\uD83D\uDECF\uFE0F", sofa: "\uD83D\uDECB\uFE0F", cupboard: "\uD83D\uDCE6", shelf: "\uD83D\uDCDA",
  fan: "\uD83C\uDF2C\uFE0F", lamp: "\uD83D\uDCA1", light: "\uD83D\uDCA1", bulb: "\uD83D\uDCA1",
  television: "\uD83D\uDCFA", clock: "\uD83D\uDD50", mirror: "\uD83E\uDE9E",
  vase: "\uD83C\uDFFA", dustbin: "\uD83D\uDDD1\uFE0F", bucket: "\uD83E\uDEA3",
  key: "\uD83D\uDD11", lock: "\uD83D\uDD12",

  // === SCHOOL ===
  school: "\uD83C\uDFEB", classroom: "\uD83C\uDFEB",
  book: "\uD83D\uDCDA", books: "\uD83D\uDCDA", notebook: "\uD83D\uDCD3", library: "\uD83D\uDCDA",
  pen: "\uD83D\uDD8A\uFE0F", pencil: "\u270F\uFE0F", chalk: "\uD83D\uDD8D\uFE0F", crayon: "\uD83D\uDD8D\uFE0F",
  eraser: "\uD83E\uDEE7", ruler: "\uD83D\uDCCF", scissors: "\u2702\uFE0F",
  bag: "\uD83C\uDF92", blackboard: "\uD83D\uDCDD", board: "\uD83D\uDCDD",
  calendar: "\uD83D\uDCC5", computer: "\uD83D\uDCBB", bell: "\uD83D\uDD14",
  exam: "\uD83D\uDCDD", test: "\uD83D\uDCDD", homework: "\uD83D\uDCDD",
  alphabet: "\uD83D\uDD24", letter: "\uD83D\uDD24", word: "\uD83D\uDCDD",
  tiffin: "\uD83C\uDF71", uniform: "\uD83D\uDC54",

  // === ACTIONS / VERBS ===
  run: "\uD83C\uDFC3", running: "\uD83C\uDFC3",
  walk: "\uD83D\uDEB6", walking: "\uD83D\uDEB6",
  jump: "\uD83E\uDD38", jumping: "\uD83E\uDD38",
  swim: "\uD83C\uDFCA", swimming: "\uD83C\uDFCA",
  fly: "\uD83E\uDD85", flying: "\uD83E\uDD85",
  climb: "\uD83E\uDDD7", climbing: "\uD83E\uDDD7",
  dance: "\uD83D\uDC83", dancing: "\uD83D\uDC83",
  sing: "\uD83C\uDFA4", singing: "\uD83C\uDFA4",
  clap: "\uD83D\uDC4F", clapping: "\uD83D\uDC4F",
  read: "\uD83D\uDCDA", reading: "\uD83D\uDCDA",
  write: "\u270D\uFE0F", writing: "\u270D\uFE0F",
  draw: "\uD83C\uDFA8", drawing: "\uD83C\uDFA8", paint: "\uD83C\uDFA8",
  play: "\u26BD", playing: "\u26BD",
  eat: "\uD83C\uDF7D\uFE0F", eating: "\uD83C\uDF7D\uFE0F",
  drink: "\uD83E\uDD64", drinking: "\uD83E\uDD64",
  sleep: "\uD83D\uDE34", sleeping: "\uD83D\uDE34",
  sit: "\uD83E\uDE91", sitting: "\uD83E\uDE91",
  stand: "\uD83E\uDDD1", standing: "\uD83E\uDDD1",
  cry: "\uD83D\uDE22", crying: "\uD83D\uDE22",
  laugh: "\uD83D\uDE02", laughing: "\uD83D\uDE02", smile: "\uD83D\uDE0A",
  cooking: "\uD83D\uDC69\u200D\uD83C\uDF73",
  wash: "\uD83E\uDDFC", clean: "\uD83E\uDDF9", sweep: "\uD83E\uDDF9",
  throw: "\uD83E\uDD3E", catch: "\uD83E\uDD3E", kick: "\u26BD",
  pull: "\uD83E\uDDD1", push: "\uD83E\uDDD1",
  hop: "\uD83D\uDC38", skip: "\uD83E\uDD38", bounce: "\uD83C\uDFC0",
  bark: "\uD83D\uDC15", meow: "\uD83D\uDC31",
  nod: "\uD83D\uDE42", wave: "\uD83D\uDC4B", stamp: "\uD83E\uDDB6",
  mix: "\uD83E\uDD44", stir: "\uD83E\uDD44", pour: "\uD83E\uDED7", bake: "\uD83C\uDF5E",
  blow: "\uD83C\uDF2C\uFE0F", bend: "\uD83E\uDDD1", turn: "\uD83D\uDD04",
  look: "\uD83D\uDC40", listen: "\uD83D\uDC42", touch: "\u270B", smell: "\uD83D\uDC43",
  open: "\uD83D\uDCE4", close: "\uD83D\uDCE5", stop: "\uD83D\uDED1", go: "\uD83D\uDFE2",
  help: "\uD83E\uDD1D", share: "\uD83E\uDD1D", give: "\uD83C\uDF81", take: "\u270B",
  find: "\uD83D\uDD0D", hide: "\uD83D\uDE48", seek: "\uD83D\uDD0D",
  grow: "\uD83C\uDF31", plant: "\uD83C\uDF31", dig: "\u26CF\uFE0F",
  buy: "\uD83D\uDED2", sell: "\uD83C\uDFEA",

  // === WEATHER & NATURE ===
  sun: "\u2600\uFE0F", sunny: "\u2600\uFE0F", sunshine: "\u2600\uFE0F",
  moon: "\uD83C\uDF19", star: "\u2B50", stars: "\u2B50",
  cloud: "\u2601\uFE0F", cloudy: "\u2601\uFE0F", clouds: "\u2601\uFE0F",
  rain: "\uD83C\uDF27\uFE0F", rainy: "\uD83C\uDF27\uFE0F", shower: "\uD83C\uDF27\uFE0F",
  wind: "\uD83C\uDF2C\uFE0F", windy: "\uD83C\uDF2C\uFE0F",
  storm: "\u26C8\uFE0F", stormy: "\u26C8\uFE0F", thunder: "\u26A1", lightning: "\u26A1",
  snow: "\u2744\uFE0F", snowy: "\u2744\uFE0F",
  rainbow: "\uD83C\uDF08", fog: "\uD83C\uDF2B\uFE0F", foggy: "\uD83C\uDF2B\uFE0F",
  hot: "\uD83C\uDF21\uFE0F", cold: "\u2744\uFE0F", warm: "\u2600\uFE0F", cool: "\uD83C\uDF2C\uFE0F",
  weather: "\u26C5", summer: "\u2600\uFE0F", winter: "\u2744\uFE0F", spring: "\uD83C\uDF38", autumn: "\uD83C\uDF42",
  tree: "\uD83C\uDF33", trees: "\uD83C\uDF32", leaf: "\uD83C\uDF43", leaves: "\uD83C\uDF42",
  flower: "\uD83C\uDF3B", flowers: "\uD83C\uDF3A", rose: "\uD83C\uDF39", lotus: "\uD83C\uDF38", jasmine: "\uD83C\uDF3C",
  sunflower: "\uD83C\uDF3B", marigold: "\uD83C\uDF3B",
  bud: "\uD83C\uDF39", bloom: "\uD83C\uDF3A", petal: "\uD83C\uDF38", petals: "\uD83C\uDF38",
  seed: "\uD83C\uDF31", seeds: "\uD83C\uDF31", root: "\uD83C\uDF3F", stem: "\uD83C\uDF3F",
  grass: "\uD83C\uDF3F", bush: "\uD83C\uDF33", jungle: "\uD83C\uDF34", forest: "\uD83C\uDF32",
  river: "\uD83C\uDFDE\uFE0F", lake: "\uD83C\uDFDE\uFE0F", pond: "\uD83C\uDFDE\uFE0F", ocean: "\uD83C\uDF0A", sea: "\uD83C\uDF0A",
  mountain: "\u26F0\uFE0F", mountains: "\uD83C\uDFD4\uFE0F", hill: "\u26F0\uFE0F",
  rock: "\uD83E\uDEA8", sand: "\uD83C\uDFD6\uFE0F", beach: "\uD83C\uDFD6\uFE0F",
  sky: "\uD83C\uDF24\uFE0F", earth: "\uD83C\uDF0D", nature: "\uD83C\uDF3F",
  field: "\uD83C\uDF3E", farm: "\uD83C\uDF3E", crop: "\uD83C\uDF3E", crops: "\uD83C\uDF3E",
  soil: "\uD83E\uDEB4", mud: "\uD83E\uDEB4", dust: "\uD83C\uDF2B\uFE0F",
  nest: "\uD83E\uDEB9", web: "\uD83D\uDD78\uFE0F", hole: "\uD83D\uDD73\uFE0F",

  // === PLACES ===
  village: "\uD83C\uDFE1", city: "\uD83C\uDFD9\uFE0F", town: "\uD83C\uDFD8\uFE0F",
  market: "\uD83C\uDFEA", shop: "\uD83C\uDFEA", store: "\uD83C\uDFEA",
  hospital: "\uD83C\uDFE5", park: "\uD83C\uDFDE\uFE0F", zoo: "\uD83E\uDD81",
  temple: "\uD83D\uDED5", church: "\u26EA", mosque: "\uD83D\uDD4C",
  road: "\uD83D\uDEE3\uFE0F", bridge: "\uD83C\uDF09", path: "\uD83D\uDEE4\uFE0F",
  country: "\uD83C\uDF0D", world: "\uD83C\uDF0D", space: "\uD83C\uDF0C",
  desert: "\uD83C\uDFDC\uFE0F", island: "\uD83C\uDFDD\uFE0F",

  // === VEHICLES & TRANSPORT ===
  car: "\uD83D\uDE97", bus: "\uD83D\uDE8C", train: "\uD83D\uDE86", truck: "\uD83D\uDE9A",
  bicycle: "\uD83D\uDEB2", bike: "\uD83D\uDEB2", scooter: "\uD83D\uDEF5", auto: "\uD83D\uDEFA",
  aeroplane: "\u2708\uFE0F", airplane: "\u2708\uFE0F", plane: "\u2708\uFE0F",
  boat: "\u26F5", ship: "\uD83D\uDEA2", rocket: "\uD83D\uDE80",
  ambulance: "\uD83D\uDE91", tractor: "\uD83D\uDE9C",
  wheel: "\u2699\uFE0F", wheels: "\u2699\uFE0F", helmet: "\u26D1\uFE0F",
  ticket: "\uD83C\uDFAB", seat: "\uD83D\uDCBA",

  // === COLOURS ===
  red: "\uD83D\uDD34", blue: "\uD83D\uDD35", green: "\uD83D\uDFE2",
  yellow: "\uD83D\uDFE1", purple: "\uD83D\uDFE3",
  white: "\u26AA", black: "\u26AB", brown: "\uD83D\uDFE4",
  pink: "\uD83C\uDF38", indigo: "\uD83D\uDD35", violet: "\uD83D\uDFE3",
  colour: "\uD83C\uDF08", colors: "\uD83C\uDF08", colours: "\uD83C\uDF08",

  // === EMOTIONS ===
  happy: "\uD83D\uDE0A", sad: "\uD83D\uDE22", angry: "\uD83D\uDE20",
  scared: "\uD83D\uDE28", surprised: "\uD83D\uDE32", tired: "\uD83D\uDE29",
  excited: "\uD83E\uDD29", worried: "\uD83D\uDE1F", brave: "\uD83D\uDCAA",
  kind: "\uD83D\uDC96", love: "\u2764\uFE0F", gentle: "\uD83D\uDC96",
  proud: "\uD83D\uDE0A", shy: "\uD83D\uDE33", naughty: "\uD83D\uDE08",
  honest: "\uD83D\uDC4D", clever: "\uD83E\uDDE0", foolish: "\uD83E\uDD21",
  lazy: "\uD83D\uDE34", hardworking: "\uD83D\uDCAA", generous: "\uD83C\uDF81",
  joyful: "\uD83D\uDE04", beautiful: "\uD83C\uDF3A", pretty: "\uD83C\uDF38",

  // === FESTIVALS & CELEBRATIONS ===
  festival: "\uD83C\uDF89", celebrate: "\uD83C\uDF89", celebration: "\uD83C\uDF89",
  birthday: "\uD83C\uDF82", party: "\uD83C\uDF88",
  gift: "\uD83C\uDF81", present: "\uD83C\uDF81",
  candle: "\uD83D\uDD6F\uFE0F", lights: "\uD83C\uDF86", fireworks: "\uD83C\uDF86",
  flag: "\uD83C\uDFF3\uFE0F", medal: "\uD83C\uDFC5", trophy: "\uD83C\uDFC6",

  // === TIME ===
  morning: "\uD83C\uDF05", afternoon: "\u2600\uFE0F", evening: "\uD83C\uDF06", night: "\uD83C\uDF03",
  today: "\uD83D\uDCC5", tomorrow: "\uD83D\uDCC5", yesterday: "\uD83D\uDCC5",
  week: "\uD83D\uDCC5", month: "\uD83D\uDCC5", year: "\uD83D\uDCC5",
  day: "\u2600\uFE0F", hour: "\uD83D\uDD50", minute: "\u23F1\uFE0F",

  // === SPORTS & GAMES ===
  ball: "\u26BD", cricket: "\uD83C\uDFCF",
  football: "\u26BD", basketball: "\uD83C\uDFC0",
  game: "\uD83C\uDFAE", race: "\uD83C\uDFC3", match: "\uD83C\uDFC6",
  swing: "\uD83D\uDE9D", slide: "\uD83D\uDEDD", seesaw: "\uD83D\uDE9D",

  // === NUMBERS (as words) ===
  one: "1\uFE0F\u20E3", two: "2\uFE0F\u20E3", three: "3\uFE0F\u20E3",
  four: "4\uFE0F\u20E3", five: "5\uFE0F\u20E3", six: "6\uFE0F\u20E3",
  seven: "7\uFE0F\u20E3", eight: "8\uFE0F\u20E3", nine: "9\uFE0F\u20E3", ten: "\uD83D\uDD1F",

  // === CLOTHING ===
  shoes: "\uD83D\uDC5F", shoe: "\uD83D\uDC5F", hat: "\uD83E\uDDE2", cap: "\uD83E\uDDE2",
  coat: "\uD83E\uDDE5", shirt: "\uD83D\uDC54", dress: "\uD83D\uDC57",
  umbrella: "\u2602\uFE0F", raincoat: "\uD83E\uDDE5", mittens: "\uD83E\uDDE4", gloves: "\uD83E\uDDE4",
  scarf: "\uD83E\uDDE3", socks: "\uD83E\uDDE6", glasses: "\uD83D\uDC53",

  // === MUSIC & ARTS ===
  music: "\uD83C\uDFB5", song: "\uD83C\uDFA4", melody: "\uD83C\uDFB6",
  drum: "\uD83E\uDD41", guitar: "\uD83C\uDFB8", piano: "\uD83C\uDFB9",
  art: "\uD83C\uDFA8", picture: "\uD83D\uDDBC\uFE0F", photo: "\uD83D\uDCF7",

  // === MISCELLANEOUS ===
  money: "\uD83D\uDCB0", coin: "\uD83E\uDE99", wallet: "\uD83D\uDC5B",
  map: "\uD83D\uDDFA\uFE0F", compass: "\uD83E\uDDED",
  telescope: "\uD83D\uDD2D", microscope: "\uD83D\uDD2C",
  fire: "\uD83D\uDD25", smoke: "\uD83D\uDCA8",
  telephone: "\uD83D\uDCDE", phone: "\uD83D\uDCF1", mobile: "\uD83D\uDCF1",
  message: "\uD83D\uDCE9", envelope: "\u2709\uFE0F",
  sticks: "\uD83E\uDEB5", bundle: "\uD83E\uDEB5",
  net: "\uD83E\uDD4D", rope: "\uD83E\uDE62", string: "\uD83E\uDDF5",
  arrow: "\uD83C\uDFF9", bow: "\uD83C\uDFF9", sword: "\u2694\uFE0F",
  crown: "\uD83D\uDC51", ring: "\uD83D\uDC8D",
  magic: "\u2728", dream: "\uD83D\uDCAD", wish: "\uD83C\uDF1F",
  surprise: "\uD83C\uDF81", adventure: "\uD83E\uDDED",
  planet: "\uD83E\uDE90", mars: "\uD83D\uDD34",

  // === LANGUAGES & SUBJECTS (prevent false matching) ===
  marathi: "\uD83D\uDCDD", hindi: "\uD83D\uDCDD", english: "\uD83D\uDCDD", urdu: "\uD83D\uDCDD",
  gujarati: "\uD83D\uDCDD", kannada: "\uD83D\uDCDD", bengali: "\uD83D\uDCDD", telugu: "\uD83D\uDCDD",
  tamil: "\uD83D\uDCDD", sindhi: "\uD83D\uDCDD", sanskrit: "\uD83D\uDCDD",
  maths: "\uD83D\uDCDD", mathematics: "\uD83D\uDCDD", science: "\uD83D\uDD2C", history: "\uD83D\uDCDC",
  geography: "\uD83C\uDF0D", grammar: "\uD83D\uDCDD",

  // === GRAMMAR TERMS ===
  noun: "\uD83D\uDCDD", verb: "\uD83D\uDCDD", adjective: "\uD83D\uDCDD", pronoun: "\uD83D\uDCDD",
  singular: "\uD83D\uDCDD", plural: "\uD83D\uDCDD", tense: "\uD83D\uDCDD",
  sentence: "\uD83D\uDCDD", paragraph: "\uD83D\uDCDD", vowel: "\uD83D\uDCDD", consonant: "\uD83D\uDCDD",
};

// Lookup function with smart matching
export function getEmoji(word: string): string {
  const w = word.toLowerCase().trim();

  // Direct match
  if (emojiMap[w]) return emojiMap[w];

  // Remove trailing s/es/ing/ed for base form
  const bases = [
    w.replace(/s$/, ""),
    w.replace(/es$/, ""),
    w.replace(/ing$/, ""),
    w.replace(/ed$/, ""),
    w.replace(/ies$/, "y"),
    w.replace(/ful$/, ""),
    w.replace(/ly$/, ""),
    w.replace(/er$/, ""),
    w.replace(/est$/, ""),
  ];
  for (const b of bases) {
    if (b !== w && b.length > 1 && emojiMap[b]) return emojiMap[b];
  }

  // Word-boundary partial match — only match if the key is a complete word within the input
  // e.g. "sunflower" matches "sun" and "flower", but "marathi" does NOT match "rat"
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (key.length < 3) continue; // skip very short keys (at, in, go, etc.) for partial matching
    // Check if key appears as a whole word or at word boundaries
    const keyRegex = new RegExp(`\\b${key}\\b|^${key}|${key}$`);
    if (keyRegex.test(w)) return emoji;
    // Check if the input word exactly matches a portion of a longer key
    // e.g. "rain" matches "rainbow" key — but only if input is shorter
    if (w.length >= 3 && key.startsWith(w) && w.length >= key.length * 0.6) return emoji;
  }

  // Add common language/subject names that should NOT match animal emojis
  const noMatch = new Set(["marathi", "hindi", "english", "urdu", "gujarati", "kannada", 
    "bengali", "telugu", "tamil", "sindhi", "arabic", "french", "german", "spanish",
    "maths", "mathematics", "science", "history", "geography", "grammar",
    "singular", "plural", "masculine", "feminine", "tense", "present", "vowel", "consonant",
    "paragraph", "sentence", "adjective", "pronoun", "conjunction", "preposition",
    "comprehension", "composition", "punctuation", "alphabetical", "syllable"]);
  if (noMatch.has(w)) return "\uD83D\uDCCC";

  // Category fallback based on common patterns
  if (w.match(/colour|color/)) return "\uD83C\uDF08";
  if (w.match(/animal|pet/)) return "\uD83D\uDC3E";
  if (w.match(/food|meal|snack/)) return "\uD83C\uDF7D\uFE0F";
  if (w.match(/game|sport/)) return "\u26BD";
  if (w.match(/place|land/)) return "\uD83C\uDFDE\uFE0F";

  return "\uD83D\uDCCC"; // pin as default
}
