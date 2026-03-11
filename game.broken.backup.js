const SAVE_KEY = "hf_mvp_save_v1";

const DIFF_SCALE = {
  easy: 0.85,
  normal: 1,
  hard: 1.3,
};

const MERC_POOL = [
  { id: "m1", name: "???덉씠釉?, rank: "?좎엯", contract: 320, atk: 12, def: 5, hp: 90, speed: 18, ability: "湲곕룞 ?ш꺽", roleClass: "由ъ퐯", rangeClass: "以묒썝嫄곕━", attribute: "?먭린", team: "寃뚰떚??, classType: "由ъ퐯", color: "#ffd84f", weaponType: "carbine", abilityIcon: "dash" },
  { id: "m2", name: "由ъ븘 蹂?, rank: "以묎툒", contract: 520, atk: 16, def: 8, hp: 100, speed: 16, ability: "?꾩닠 ?μ쟾", roleClass: "?쒗룷??, rangeClass: "?먭굅由?, attribute: "?곕쭑", team: "寃뚰떚??, classType: "?쒗룷??, color: "#2f2f2f", weaponType: "rifle", abilityIcon: "reload" },
  { id: "m3", name: "移쇰━ ?ㅽ넠", rank: "踰좏뀒??, contract: 900, atk: 25, def: 12, hp: 130, speed: 14, ability: "遺꾨끂 ??컻", roleClass: "踰꾩꽌而?, rangeClass: "洹쇱쨷嫄곕━", attribute: "?뚯씠", team: "寃뚰떚??, classType: "踰꾩꽌而?, color: "#ff4f4f", weaponType: "shotgun", abilityIcon: "rage" },
];

const MERC_LOADOUT_POOL = [
  "媛뺥솕 ?쇱씠??+ ?꾩닠 議곕겮",
  "以묓삎 ?룰굔 + 諛섏쓳 ?κ컩",
  "?먮꼫吏 移대퉰 + 誘쇱꺽 ?덊듃",
  "?덉씪 ?쇱뒪??+ ?ㅻ뱶 踰⑦듃",
];

const QUEST_TITLE_POOL = [
  "?붿〈 ?쒕줎 ?뚰깢",
  "?곌뎄 肄붿뼱 ?뚯닔",
  "?좎쟻 吏???듬줈 ?뺣낫",
  "?쏀깉??蹂닿툒??李⑤떒",
  "?쇰궃誘??몄쐞",
  "媛먯뿼 援ъ뿭 ?뺥솕",
  "?곗씠??釉붾옓諛뺤뒪 ?덊솚",
  "?κ컩 ?섏넚???뚭눼",
  "?ㅽ뿕泥??ы쉷",
  "?듭떊 以묎퀎湲?蹂듦뎄",
  "嫄곗젏 諛⑹뼱",
  "?뺤같? 援ъ“",
];

const RANGE_META = {
  洹쇨굅由? { color: "#ff4f4f" },
  洹쇱쨷嫄곕━: { color: "#ffd84f" },
  以묎굅由? { color: "#62d965" },
  以묒썝嫄곕━: { color: "#56a8ff" },
  ?먭굅由? { color: "#b775ff" },
};

const CLASS_META = {
  ?ㅽ렂?? { icon: "./assets/icons/class-offenser.svg", mark: "寃" },
  ?뷀렂?? { icon: "./assets/icons/class-defenser.svg", mark: "諛⑺뙣" },
  ?ㅼ빱誘몄뀛: { icon: "./assets/icons/class-skirmisher.svg", mark: "?좊컻" },
  踰꾩꽌而? { icon: "./assets/icons/class-berserker.svg", mark: "?띾떒?꾨겮" },
  ?댁뙏?? { icon: "./assets/icons/class-assassin.svg", mark: "?띾떒寃" },
  ?댁뜲?? { icon: "./assets/icons/class-assault.svg", mark: "?띾쾭?대윭" },
  由ъ퐯: { icon: "./assets/icons/class-recon.svg", mark: "?뚮굹" },
  ?쒗룷?? { icon: "./assets/icons/class-supporter.svg", mark: "吏?≪씠" },
  硫붾뵓: { icon: "./assets/icons/class-medic.svg", mark: "??옄媛" },
  ?ㅽ룓?? { icon: "./assets/icons/class-special.svg", mark: "蹂? },
};

const ATTRIBUTE_META = {
  ?뚯씠: { color: "#ff4f4f", effect: "吏???붿뿼 ?쇳빐, ?붿긽 ????怨듦꺽??媛먯냼" },
  ?먭린: { color: "#ffd84f", effect: "?꾧꺽 ?곗뇙, ?꾩쟻 ??EMP(?λ퉬/?ㅽ궗 遊됱뇙)" },
  鍮숆껐: { color: "#8ad9ff", effect: "?댁냽 ??? ?꾩쟻 ???됯컖(?됰룞 遺덇?)" },
  ?곗꽦: { color: "#5ddf70", effect: "吏???곗꽦 ?쇳빐, ?듯빐(?뚮났 李⑤떒)" },
  ?띿븬: { color: "#a2ff67", effect: "媛뺥븳 ?됰갚, 留ㅼ슦 吏㏃? 怨듦꺽 痍⑥냼" },
  ?섎깋: { color: "#4f9dff", effect: "怨듦꺽???≪닔???앹〈 ?뚮났" },
  泥좉컩: { color: "#8b5a3b", effect: "?ㅻ뱶/諛⑹뼱 臾댁떆 愿?? },
  珥덈뒫: { color: "#c0a2ff", effect: "留덈젰 寃뚯씠吏 ?뚮え 媛뺥솕, ?뺣쪧??議곗쥌/諛移섍린" },
  ?뚰뙆: { color: "#ff9f47", effect: "吏㏃? ?뺤? + ?뚮룞 ?꾩뿼" },
  以묐젰: { color: "#b775ff", effect: "以묐젰?뚮줈 ???뚯뼱?밴?" },
  ?ш킅: { color: "#f3f3f3", effect: "怨듭냽/怨듦꺽 ?쏀솕, ?뺣쪧 湲곗젅 + 異붽? ?쇳빐" },
  ?곕쭑: { color: "#2f2f2f", effect: "諛⑹뼱 ??? ?뺣쪧 ?붾쭑 + ?꾧뎔 移섑솗/?뚮났 利앷?" },
  臾쇰━: { color: "#9a9a9a", effect: "?뱀닔?④낵 ?놁쓬, 湲곕낯 ?ㅽ꺈 ?곗쐞" },
};

const TEAM_EFFECTS = {
  議곕뵒?? "?숈씪 ? 2???댁긽 異쒓꺽 ??移섎챸? ?뺣쪧 +8%, 怨듦꺽??+6%",
  ?덊븯?? "?숈씪 ? 2???댁긽 異쒓꺽 ???ㅽ궗 媛??+10%, ?뚮났??+12%",
  寃뚰떚?? "?숈씪 ? 2???댁긽 異쒓꺽 ???쇳빐 利앺룺 +9%, 愿??+8%",
  ?섎━硫섑깉: "?숈씪 ? 2???댁긽 異쒓꺽 ???띿꽦 異뺤쟻??+18%",
  ?ㅻ━吏?? "?숈씪 ? 2???댁긽 異쒓꺽 ??怨듦꺽/諛⑹뼱/泥대젰 +5%",
};

const ROLE_ORDER = ["?ㅽ렂??, "?뷀렂??, "?ㅼ빱誘몄뀛", "踰꾩꽌而?, "?댁뙏??, "?댁뜲??, "由ъ퐯", "?쒗룷??, "硫붾뵓", "?ㅽ룓??];
const RANGE_ORDER = ["洹쇨굅由?, "洹쇱쨷嫄곕━", "以묎굅由?, "以묒썝嫄곕━", "?먭굅由?];
const ATTR_ORDER = ["?뚯씠", "?먭린", "鍮숆껐", "?곗꽦", "?띿븬", "?섎깋", "泥좉컩", "珥덈뒫", "?뚰뙆", "以묐젰", "?ш킅", "?곕쭑", "臾쇰━"];

const ZODIAC_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Ophiuchus",
];
const SHEMHAM_NAMES = [
  "Vehuiah","Jeliel","Sitael","Elemiah","Mahasiah","Lelahel","Achaiah","Cahetel","Haziel","Aladiah","Lauviah","Hahaiah",
  "Iezalel","Mebahel","Hariel","Hakamiah","Lauviah2","Caliel","Leuviah","Pahaliah","Nelchael","Yeiayel","Melahel","Haheuiah",
  "Nith-Haiah","Haaiah","Yerathel","Seheiah","Reiyel","Omael","Lecabel","Vasariah","Yehuiah","Lehahiah","Chavakiah","Menadel",
  "Aniel","Haamiah","Rehael","Ieiazel","Hahahel","Mikael","Veuliah","Yelahiah","Sealiah","Ariel","Asaliah","Mihael",
  "Vehuel","Daniel","Hahasiah","Imamiah","Nanael","Nithael","Mebahiah","Poyel","Nemamiah","Yeialel","Harahel","Mitzrael",
  "Umabel","Iah-Hel","Anauel","Mehiel","Damabiah","Manakel","Eyael","Habuhiah","Rochel","Jabamiah","Haiaiel","Mumiah",
];
const GOETIA_NAMES = [
  "Bael","Agares","Vassago","Samigina","Marbas","Valefor","Amon","Barbatos","Paimon","Buer","Gusion","Sitri",
  "Beleth","Leraje","Eligos","Zepar","Botis","Bathin","Sallos","Purson","Marax","Ipos","Aim","Naberius",
  "Glasya-Labolas","Bune","Ronove","Berith","Astaroth","Forneus","Foras","Asmoday","Gaap","Furfur","Marchosias","Stolas",
  "Phenex","Halphas","Malphas","Raum","Focalor","Vepar","Sabnock","Shax","Vine","Bifrons","Vual","Haagenti",
  "Crocell","Furcas","Balam","Alloces","Camio","Murmur","Orobas","Gremory","Ose","Amy","Orias","Vapula",
  "Zagan","Valac","Andras","Flauros","Andrealphus","Cimejes","Amdusias","Belial","Decarabia","Seere","Dantalion","Andromalius",
];

const ORIGINAL_28_NAMES = [
  "?꾨Ⅴ??,
  "踰⑤씪",
  "移댁씪濡?,
  "?몃씪?",
  "猷⑤???,
  "諛쒗꽣",
  "?덉뭅",
  "?쒕줈??,
  "?대━??,
  "移대줎",
  "誘몃씪伊?,
  "?꾨???,
  "?덉씤",
  "蹂쇳듃",
  "?ㅻⅤ移?,
  "由곕뱶",
  "?먮떒",
  "?쒖삩",
  "?뚮씪",
  "?섏엫",
  "?몃컮",
  "媛??,
  "釉붾젅?댁쫰",
  "?붾씪",
  "踰좎뒪??,
  "?꾩?瑜?,
  "?щ줈??,
  "?곕???,
];

const NAME_PRON_MAP = {
  Aries: "?꾨━?먯뒪",
  Taurus: "??곕（??,
  Gemini: "?쒕???,
  Cancer: "罹붿꽌",
  Leo: "?덉삤",
  Virgo: "踰꾧퀬",
  Libra: "由щ툕??,
  Scorpio: "?ㅼ퐳?쇱삤",
  Sagittarius: "?덉??뚮━?댁뒪",
  Capricorn: "罹먰봽由ъ퐯",
  Aquarius: "?꾩퓼?꾨━?댁뒪",
  Pisces: "?뚯씠?쒖뒪",
  Ophiuchus: "?ㅽ뵾?곗퓼??,
};

function koreanizeLatinToken(token) {
  const exact = NAME_PRON_MAP[token];
  if (exact) return exact;
  let s = token.toLowerCase();
  const rules = [
    ["ph", "??],
    ["th", "??],
    ["ch", "移?],
    ["sh", "??],
    ["qu", "荑?],
    ["ck", "??],
    ["tion", "??],
    ["sion", "??],
    ["ia", "?댁븘"],
    ["io", "?댁삤"],
    ["ea", "?댁븘"],
    ["ee", "??],
    ["oo", "??],
    ["ou", "?꾩슦"],
    ["au", "?꾩슦"],
  ];
  rules.forEach(([a, b]) => {
    s = s.replaceAll(a, b);
  });
  const map = {
    a: "??,
    b: "釉?,
    c: "??,
    d: "??,
    e: "??,
    f: "??,
    g: "洹?,
    h: "??,
    i: "??,
    j: "??,
    k: "??,
    l: "瑜?,
    m: "誘",
    n: "??,
    o: "??,
    p: "??,
    q: "荑?,
    r: "瑜?,
    s: "??,
    t: "??,
    u: "??,
    v: "釉?,
    w: "??,
    x: "?ъ뒪",
    y: "??,
    z: "利?,
    "-": "-",
    "2": "2",
  };
  let out = "";
  for (const ch of s) out += map[ch] || ch;
  return out.replaceAll("??, "").replace(/\s+/g, " ").trim();
}

function koreanizeName(name) {
  if (/[媛-??/.test(name)) return name;
  return name
    .split(/(\-|\s)/)
    .map((part) => (/^[A-Za-z0-9]+$/.test(part) ? koreanizeLatinToken(part) : part))
    .join("");
}

function classTemplate(roleClass) {
  const map = {
    ?ㅽ렂?? { atk: 28, def: 9, hp: 135, speed: 14, weaponType: "rifle" },
    ?뷀렂?? { atk: 18, def: 20, hp: 190, speed: 10, weaponType: "blade" },
    ?ㅼ빱誘몄뀛: { atk: 22, def: 7, hp: 110, speed: 20, weaponType: "carbine" },
    踰꾩꽌而? { atk: 25, def: 12, hp: 150, speed: 13, weaponType: "shotgun" },
    ?댁뙏?? { atk: 26, def: 8, hp: 115, speed: 19, weaponType: "blade" },
    ?댁뜲?? { atk: 23, def: 14, hp: 145, speed: 16, weaponType: "carbine" },
    由ъ퐯: { atk: 20, def: 10, hp: 118, speed: 17, weaponType: "rifle" },
    ?쒗룷?? { atk: 16, def: 11, hp: 125, speed: 15, weaponType: "rifle" },
    硫붾뵓: { atk: 14, def: 10, hp: 120, speed: 15, weaponType: "rifle" },
    ?ㅽ룓?? { atk: 21, def: 12, hp: 130, speed: 15, weaponType: "carbine" },
  };
  return map[roleClass] || map.?ㅽ렂??
}

function classAbility(roleClass) {
  const map = {
    ?ㅽ렂?? "吏???⑥씪 吏묒쨷 ?붾젰",
    ?뷀렂?? "?꾨컻 + 蹂댄샇留??꾧컻",
    ?ㅼ빱誘몄뀛: "怨좎냽 ?뚰뵾 + 援먮?",
    踰꾩꽌而? "愿묓룺/?섑샇 ?꾪솚",
    ?댁뙏?? "????뚯엯 + 湲됱뒿",
    ?댁뜲?? "?뚯쭊 異⑷꺽 + ?寃??곌퀎",
    由ъ퐯: "?뺤같/?먯? + ?몄텧 ?쒖떇",
    ?쒗룷?? "?꾧뎔 踰꾪봽 + ???붾쾭??,
    硫붾뵓: "?뚮났/?뺥솕/?ъ깮 媛뺥솕",
    ?ㅽ룓?? "蹂듭젣/?뚰솚/?⑥젙/?붾젅?ы듃/?댄궧/諛섏궗",
  };
  return map[roleClass] || "?꾩닠 ?꾧컻";
}

function getPrimaryAttribute(attributeText) {
  const raw = attributeText || "臾쇰━";
  return raw.split("/")[0];
}

function getAttributeColor(attributeText) {
  const a = getPrimaryAttribute(attributeText);
  return ATTRIBUTE_META[a]?.color || "#9a9a9a";
}

function attributeForIndex(i) {
  if (i % 17 === 0) return `${ATTR_ORDER[i % ATTR_ORDER.length]}/${ATTR_ORDER[(i + 3) % ATTR_ORDER.length]}`;
  return ATTR_ORDER[i % ATTR_ORDER.length];
}

function abilityIconForClass(roleClass) {
  const map = { ?ㅽ렂?? "scope", ?뷀렂?? "guard", ?ㅼ빱誘몄뀛: "dash", 踰꾩꽌而? "rage", ?댁뙏?? "dash", ?댁뜲?? "guard", 由ъ퐯: "scope", ?쒗룷?? "reload", 硫붾뵓: "reload", ?ㅽ룓?? "rage" };
  return map[roleClass] || "scope";
}

function createUnitSpec({ name, team, unitType, index }) {
  const roleClass = ROLE_ORDER[index % ROLE_ORDER.length];
  const rangeClass = RANGE_ORDER[index % RANGE_ORDER.length];
  const attribute = attributeForIndex(index);
  const base = classTemplate(roleClass);
  const attrBase = attribute.split("/")[0];
  const attrColor = ATTRIBUTE_META[attrBase]?.color || "#9a9a9a";
  const isPhysical = attrBase === "臾쇰━";
  const displayName = koreanizeName(name);
  return {
    id: `${team}-${name}`.replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase() + `-${index}`,
    sourceId: `${team}-${index}`,
    name: displayName,
    unitType,
    team,
    teamEffect: TEAM_EFFECTS[team] || "?놁쓬",
    roleClass,
    rangeClass,
    classType: roleClass,
    attribute,
    color: attrColor,
    atk: base.atk + (isPhysical ? 3 : 0) + (unitType === "hero" ? 1 : 0),
    def: base.def + (isPhysical ? 2 : 0),
    hp: base.hp + (isPhysical ? 16 : 0),
    speed: base.speed + (attrBase === "?띿븬" || attrBase === "?곕쭑" ? 1 : 0),
    ability: `${classAbility(roleClass)} / ${ATTRIBUTE_META[attrBase]?.effect || "?띿꽦 ?④낵 ?놁쓬"}`,
    abilityIcon: abilityIconForClass(roleClass),
    weaponType: base.weaponType,
    level: 1,
    canUseDefense: ["?뷀렂??, "?댁뜲??, "踰꾩꽌而?, "?ㅽ룓??].includes(roleClass),
    equippedMelee: null,
    equippedFirearm: null,
    equippedDefense: null,
    equippedGears: [],
    randomLoadout: unitType === "merc" ? MERC_LOADOUT_POOL[index % MERC_LOADOUT_POOL.length] : null,
    deployed: false,
  };
}

function createInitialRoster() {
  const heroes = [];
  const mercs = [];
  ZODIAC_NAMES.forEach((name, i) => heroes.push(createUnitSpec({ name, team: "議곕뵒??, unitType: "hero", index: i })));
  SHEMHAM_NAMES.forEach((name, i) => heroes.push(createUnitSpec({ name, team: "?덊븯??, unitType: "hero", index: i + 20 })));
  GOETIA_NAMES.forEach((name, i) => mercs.push(createUnitSpec({ name, team: "寃뚰떚??, unitType: "merc", index: i + 40 })));
  ATTR_ORDER.forEach((attr, i) => {
    mercs.push(
      createUnitSpec({
        name: `Elemental-${attr}`,
        team: "?섎━硫섑깉",
        unitType: "merc",
        index: i + 80,
      }),
    );
  });
  for (let i = 0; i < ORIGINAL_28_NAMES.length; i += 1) {
    const unitType = i % 2 === 0 ? "hero" : "merc";
    const name = ORIGINAL_28_NAMES[i];
    const unit = createUnitSpec({
      name,
      team: "?ㅻ━吏??,
      unitType,
      index: i + 120,
    });
    unit.ability = `${unit.ability} / ?꾩슜 ?꾨줈?좎퐳-${String((i % 25) + 1).padStart(2, "0")}`;
    if (unitType === "hero") heroes.push(unit);
    else mercs.push(unit);
  }
  if (heroes[0]) heroes[0].deployed = true;
  if (heroes[1]) heroes[1].deployed = true;
  return { heroes, mercs };
}

const MELEE_TYPES = [
  { key: "?곌굅", range: 1.4, atk: 6, aspd: 1.35, pattern: "遺梨꾧섦", trait: "吏㏃? ?ш굅由?鍮좊Ⅸ ?고?" },
  { key: "?뚮뱶", range: 1.8, atk: 8, aspd: 1.0, pattern: "遺梨꾧섦", trait: "洹좏삎??洹쇱젒" },
  { key: "痢좊컮?댄뿨??, range: 2.2, atk: 12, aspd: 0.7, pattern: "遺梨꾧섦", trait: "怨듦꺽 以??쇨꺽 諛⑹뼱 ?먯젙" },
  { key: "釉붾젅?대뱶", range: 1.7, atk: 7, aspd: 1.05, pattern: "遺梨꾧섦", trait: "移섎챸? ?뺣쪧 ?곸듅" },
  { key: "?ㅽ뵾??, range: 2.4, atk: 7, aspd: 1.2, pattern: "吏곸꽑 李뚮Ⅴ湲?, trait: "湲??ш굅由?鍮좊Ⅸ 李뚮Ⅴ湲? },
  { key: "?쒖뒪", range: 2.6, atk: 13, aspd: 0.72, pattern: "吏곸꽑 李뚮Ⅴ湲?, trait: "怨듦꺽 以?諛⑹뼱 ?먯젙(諛⑹뼱 臾댁옣 荑?臾댁떆)" },
  { key: "硫붿씠??, range: 1.8, atk: 10, aspd: 0.78, pattern: "遺梨꾧섦", trait: "?됰갚 遺?? },
  { key: "?대㉧", range: 2.3, atk: 14, aspd: 0.62, pattern: "遺梨꾧섦", trait: "媛뺥븳 ?됰갚/諛⑹뼱 ?먯젙 ?놁쓬" },
  { key: "??, range: 2.8, atk: 8, aspd: 0.68, pattern: "愿묒뿭 ?좏삎", trait: "湲??ш굅由??됰갚" },
  { key: "?ъ씠利?, range: 3.2, atk: 15, aspd: 0.6, pattern: "媛덇퀬由????곌퀎", trait: "?뚯뼱?ㅺ린 + 諛移섍린" },
];

const FIREARM_TYPES = [
  { key: "SG", range: 1.9, atk: 12, aspd: 0.75, trait: "?뺤궛 ???됰갚" },
  { key: "AR", range: 3.0, atk: 8, aspd: 1.0, trait: "洹좏삎???먮룞?뚯킑" },
  { key: "SMG", range: 2.4, atk: 6, aspd: 1.35, trait: "怨좎뿰??洹쇱쨷嫄곕━" },
  { key: "LMG", range: 3.3, atk: 7, aspd: 1.12, trait: "吏?띿궗寃⑺삎" },
  { key: "DMR", range: 3.8, atk: 10, aspd: 0.82, trait: "以묒썝嫄곕━ ?뺣??ш꺽" },
  { key: "SR", range: 4.7, atk: 14, aspd: 0.55, trait: "?먭굅由?怨좏솕?? },
  { key: "RL", range: 4.2, atk: 16, aspd: 0.45, trait: "?좊룄/??컻?? },
];

const DEFENSE_TYPES = [
  { key: "踰꾪겢??, block: 9, radius: 1.2, cd: 3.2, trait: "吏㏃? 荑⑦??? },
  { key: "?쇱슫??, block: 12, radius: 1.6, cd: 4.4, trait: "洹좏삎??諛⑹뼱" },
  { key: "??, block: 18, radius: 2.0, cd: 6.1, trait: "怨좊갑??湲?荑? },
  { key: "??, block: 14, radius: 2.6, cd: 5.5, trait: "?踰붿쐞 蹂댄샇" },
  { key: "?ㅼ퓼??, block: 11, radius: 1.6, cd: 4.8, trait: "諛⑹뼱 ?깃났 ??移섎챸? ?곸듅" },
  { key: "?ㅽ똿媛??, block: 10, radius: 1.4, cd: 4.9, trait: "諛⑹뼱 + 洹쇱젒 ?寃? },
  { key: "嫄댁떎??, block: 10, radius: 1.4, cd: 5.0, trait: "諛⑹뼱 + ?먭굅由??ъ궗泥? },
  { key: "?낆냼釉?, block: 10, radius: 1.5, cd: 5.1, trait: "諛⑹뼱 ?깃났 ???뚮났" },
];

const GEAR_TYPES = [
  { key: "硫붾뵒??, atk: 0, def: 0, hp: 18, speed: 0, cdr: 0.02, trait: "?꾪닾 以??뚮났??利앷?" },
  { key: "?뚯썙紐⑤뱢", atk: 5, def: 0, hp: 0, speed: 0, cdr: 0, trait: "怨듦꺽??利앺룺" },
  { key: "媛뺥솕?뚮젅?댄듃", atk: 0, def: 6, hp: 12, speed: -0.3, cdr: 0, trait: "諛⑹뼱??泥대젰 ?곸듅" },
  { key: "遺?ㅽ꽣?덉쫰", atk: 0, def: 0, hp: 0, speed: 2.2, cdr: 0, trait: "?대룞?띾룄 ?곸듅" },
  { key: "荑⑤쭅肄붿뼱", atk: 0, def: 0, hp: 0, speed: 0, cdr: 0.08, trait: "?ㅽ궗 荑⑦???媛먯냼" },
  { key: "?꾩닠?쇱꽌", atk: 2, def: 1, hp: 0, speed: 1.0, cdr: 0, trait: "?먯?/?뺣? 蹂댁“" },
  { key: "由ъ빱踰꾨━??, atk: 0, def: 2, hp: 10, speed: 0, cdr: 0.03, trait: "?쇳빐 ???뚮났" },
];

function createItemIcon(label, bg = "#2a3e5a", fg = "#fff") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect width='96' height='96' rx='12' fill='${bg}'/><text x='48' y='56' text-anchor='middle' font-size='16' font-weight='700' fill='${fg}' font-family='Segoe UI'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createWeaponCatalog() {
  const out = [];
  let id = 1;
  const mkStats = [0.88, 0.96, 1, 1.08, 1.16];
  const mkName = ["I", "II", "III", "IV", "V"];

  const pushWeapon = (base, category, idx) => {
    const mult = mkStats[idx];
    out.push({
      id: `wp-${id++}`,
      itemKind: "weapon",
      slotType: category,
      name: `${base.key}-${mkName[idx]}`,
      mainType: "臾닿린",
      subType: `${category}/${base.key}`,
      category,
      weaponType: base.key,
      icon: createItemIcon(base.key, category === "melee" ? "#4b334f" : category === "firearm" ? "#2d4d5f" : "#4a3f2b"),
      atk: Math.round(base.atk * mult),
      def: 0,
      hp: 0,
      speed: 0,
      range: Number((base.range * (0.94 + idx * 0.03)).toFixed(2)),
      attackSpeed: Number((base.aspd * (1 + (idx - 2) * 0.04)).toFixed(2)),
      block: base.block ? Math.round(base.block * mult) : 0,
      blockRadius: base.radius || 0,
      cooldown: base.cd ? Number((base.cd * (1.06 - idx * 0.03)).toFixed(2)) : 0,
      trait: base.trait,
      description: `${base.key} 怨꾩뿴 ${mkName[idx]}?? ${base.trait}`,
    });
  };

  MELEE_TYPES.forEach((m) => { for (let i = 0; i < 5; i += 1) pushWeapon(m, "melee", i); });
  FIREARM_TYPES.forEach((m) => { for (let i = 0; i < 5; i += 1) pushWeapon(m, "firearm", i); });
  DEFENSE_TYPES.forEach((m) => { for (let i = 0; i < 5; i += 1) pushWeapon(m, "defense", i); });
  return out;
}

function createGearCatalog() {
  const out = [];
  let id = 1;
  const mkStats = [0.9, 0.97, 1.03];
  const mkName = ["A", "B", "C"];
  GEAR_TYPES.forEach((g) => {
    for (let i = 0; i < mkStats.length; i += 1) {
      const m = mkStats[i];
      out.push({
        id: `gr-${id++}`,
        itemKind: "gear",
        slotType: "gear",
        name: `${g.key}-${mkName[i]}`,
        mainType: "?λ퉬",
        subType: g.key,
        category: "gear",
        icon: createItemIcon(g.key, "#2f5a3a"),
        atk: Math.round(g.atk * m),
        def: Math.round(g.def * m),
        hp: Math.round(g.hp * m),
        speed: Number((g.speed * m).toFixed(1)),
        cdr: Number((g.cdr * m).toFixed(2)),
        trait: g.trait,
        description: `${g.key} ?λ퉬. ${g.trait}`,
      });
    }
  });
  return out;
}

function createStarterInventory() {
  const wp = createWeaponCatalog();
  const gr = createGearCatalog();
  const onePerSubtype = [];
  const pick = (arr, pred) => arr.find(pred);
  MELEE_TYPES.forEach((t) => onePerSubtype.push(pick(wp, (x) => x.weaponType === t.key && x.name.endsWith("-III"))));
  FIREARM_TYPES.forEach((t) => onePerSubtype.push(pick(wp, (x) => x.weaponType === t.key && x.name.endsWith("-III"))));
  DEFENSE_TYPES.forEach((t) => onePerSubtype.push(pick(wp, (x) => x.weaponType === t.key && x.name.endsWith("-III"))));
  GEAR_TYPES.forEach((t) => onePerSubtype.push(pick(gr, (x) => x.subType === t.key && x.name.endsWith("-B"))));
  return [...onePerSubtype.filter(Boolean)];
}

function parseItemTier(item) {
  if (!item?.name) return 3;
  if (item.name.includes("-V")) return 5;
  if (item.name.includes("-IV")) return 4;
  if (item.name.includes("-III")) return 3;
  if (item.name.includes("-II")) return 2;
  if (item.name.includes("-I")) return 1;
  if (item.name.includes("-C")) return 3;
  if (item.name.includes("-B")) return 2;
  if (item.name.includes("-A")) return 1;
  return 3;
}

function firearmForRange(rangeClass) {
  if (rangeClass === "洹쇨굅由?) return "SG";
  if (rangeClass === "洹쇱쨷嫄곕━") return "SMG";
  if (rangeClass === "以묎굅由?) return "AR/LMG";
  if (rangeClass === "以묒썝嫄곕━") return "DMR";
  if (rangeClass === "?먭굅由?) return "SR";
  return "AR";
}

function meleeForRole(roleClass) {
  if (roleClass === "?ㅽ렂??) return "?뚮뱶";
  if (roleClass === "?뷀렂??) return "硫붿씠??;
  if (roleClass === "?ㅼ빱誘몄뀛") return "?곌굅";
  if (roleClass === "踰꾩꽌而?) return "?대㉧";
  if (roleClass === "?댁뙏??) return "釉붾젅?대뱶";
  if (roleClass === "?댁뜲??) return "?쒖뒪";
  if (roleClass === "由ъ퐯") return "?ㅽ뵾??;
  if (roleClass === "?쒗룷??) return "??;
  if (roleClass === "硫붾뵓") return "?ㅽ뵾??;
  return "?ъ씠利?;
}

function defenseForRole(roleClass) {
  if (roleClass === "?뷀렂??) return "??;
  if (roleClass === "?댁뜲??) return "?쇱슫??;
  if (roleClass === "踰꾩꽌而?) return "?ㅽ똿媛??;
  if (roleClass === "?ㅽ룓??) return "??;
  return "踰꾪겢??;
}

function createItemIconLoadout(slotType, unit) {
  const wp = createWeaponCatalog();
  if (slotType === "melee") {
    const key = meleeForRole(unit.roleClass || unit.classType);
    const base = wp.find((x) => x.slotType === "melee" && x.weaponType === key && x.name.endsWith("-III"));
    return base ? { ...base, id: `${base.id}-${unit.id}-m` } : null;
  }
  if (slotType === "firearm") {
    const key = firearmForRange(unit.rangeClass);
    const targetType = key === "AR/LMG" ? (unit.roleClass === "?ㅽ렂?? ? "LMG" : "AR") : key;
    const base = wp.find((x) => x.slotType === "firearm" && x.weaponType === targetType && x.name.endsWith("-III"));
    return base ? { ...base, id: `${base.id}-${unit.id}-f` } : null;
  }
  const key = defenseForRole(unit.roleClass || unit.classType);
  const base = wp.find((x) => x.slotType === "defense" && x.weaponType === key && x.name.endsWith("-III"));
  return base ? { ...base, id: `${base.id}-${unit.id}-d` } : null;
}

function createDefaultGearForUnit(unit) {
  const gears = createGearCatalog();
  let base = null;
  if (unit.roleClass === "硫붾뵓") base = gears.find((g) => g.subType === "硫붾뵒??);
  else if (unit.roleClass === "?쒗룷??) base = gears.find((g) => g.subType === "荑⑤쭅肄붿뼱");
  else if (unit.roleClass === "?뷀렂??) base = gears.find((g) => g.subType === "媛뺥솕?뚮젅?댄듃");
  else if (unit.roleClass === "?ㅼ빱誘몄뀛" || unit.roleClass === "?댁뙏??) base = gears.find((g) => g.subType === "遺?ㅽ꽣?덉쫰");
  else base = gears.find((g) => g.subType === "?뚯썙紐⑤뱢");
  const b = base || gears[0];
  return b ? { ...b, id: `${b.id}-${unit.id}-g` } : null;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDuration(ms) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function createNormalQuest(counter) {
  const stars = randInt(1, 10);
  const title = QUEST_TITLE_POOL[randInt(0, QUEST_TITLE_POOL.length - 1)];
  return {
    id: `q-${counter}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    stars,
    rewardCredit: 120 + stars * 90,
    rewardResource: 60 + stars * 35,
  };
}

function createEmergencyQuest(counter) {
  const stars = randInt(6, 10);
  const title = `湲닿툒: ${QUEST_TITLE_POOL[randInt(0, QUEST_TITLE_POOL.length - 1)]}`;
  const durationMin = randInt(30, 360);
  const now = Date.now();
  return {
    id: `eq-${counter}-${now}`,
    title,
    stars,
    rewardCredit: 500 + stars * 220,
    rewardResource: 250 + stars * 95,
    expiresAt: now + durationMin * 60 * 1000,
  };
}

function makeInitialState() {
  const initialRoster = createInitialRoster();
  const starterInventory = createStarterInventory();
  return {
    credits: 1200,
    resources: 450,
    power: 140,
    settings: {
      sound: true,
      language: "ko",
      difficulty: "normal",
      godMode: false,
      infinite: false,
    },
    heroes: initialRoster.heroes,
    mercs: initialRoster.mercs,
    planets: [
      {
        id: "p1",
        name: "?ㅼ삤 ?뚮씪",
        color: "#4f8ef7",
        x: 180,
        y: 200,
        traits: "?꾩떆???먰뿀, ?믪? ?ы솕 ?뚯닔??,
        enemies: "?쒕줎, 媛깅떒, 寃쎈퉬 AI",
        rewards: "?щ젅?? 遺??,
        regions: [
          { id: "p1-r1", name: "肄붿뼱 吏援?, difficulty: 1, restored: false },
          { id: "p1-r2", name: "?곸링 援ъ뿭", difficulty: 2, restored: false },
          { id: "p1-r3", name: "怨듭뾽 吏?", difficulty: 3, restored: false },
        ],
      },
      {
        id: "p2",
        name: "諛붿떎 ?щ쭑",
        color: "#da9f4a",
        x: 560,
        y: 300,
        traits: "紐⑤옒 ??뭾, ?꾩빟 ?뚮え 利앷?",
        enemies: "?щ쭑 ?쏀깉?? 以묒옣媛??쇱닔",
        rewards: "?ш? 愿묐Ъ, 怨좉툒 ?먯썝",
        regions: [
          { id: "p2-r1", name: "遺됱? ?묎끝", difficulty: 2, restored: false },
          { id: "p2-r2", name: "?좎쟻 踰숈빱", difficulty: 3, restored: false },
          { id: "p2-r3", name: "?앹쁺 ?됱썝", difficulty: 4, restored: false },
        ],
      },
      {
        id: "p3",
        name: "?꾩씠???꾨줎??,
        color: "#74d3ff",
        x: 1040,
        y: 520,
        traits: "???吏?, ?대룞 ?띾룄 ???,
        enemies: "鍮숆껐 ?앹껜, ?ㅽ뿕泥?,
        rewards: "?됯컖 肄붿뼱, ?꾩꽕 ?щ즺",
        regions: [
          { id: "p3-r1", name: "鍮숉븯 湲곗?", difficulty: 3, restored: false },
          { id: "p3-r2", name: "鍮숆껐 ?숆뎬", difficulty: 4, restored: false },
          { id: "p3-r3", name: "洹뱀? 肄붿뼱", difficulty: 5, restored: false },
        ],
      },
      {
        id: "p4",
        name: "?댄겢由쎌뒪 ?뺢굅??,
        color: "#b57bff",
        x: 1360,
        y: 180,
        traits: "?곗＜ ?뺢굅?? ?섎━??諛吏?,
        enemies: "?⑸퀝?? ?ㅻ뱶 蹂묎린",
        rewards: "?꾩꽕 臾닿린 ?꾨㈃, 嫄곗븸 ?щ젅??,
        regions: [
          { id: "p4-r1", name: "?멸낸 留?, difficulty: 4, restored: false },
          { id: "p4-r2", name: "?곌뎄 援ы쉷", difficulty: 5, restored: false },
          { id: "p4-r3", name: "以묒븰 諛섏쓳濡?, difficulty: 6, restored: false },
        ],
      },
    ],
    selectedPlanetId: null,
    selectedRegionId: null,
    baseTab: "hq",
    hqView: "quests",
    hqSelectedHeroId: initialRoster.heroes[0]?.id || null,
    hqSelectedItemId: null,
    selectedItemDetailId: null,
    selectedUnitDetailId: null,
    hqReserveFilter: { roleClass: "all", attribute: "all", rangeClass: "all" },
    rosterVersion: 4,
    questCounter: 1,
    quests: [],
    emergencyQuest: null,
    factoryLevel: 1,
    powerPlantLevel: 1,
    hangarShips: [
      { id: "ship-1", name: "HF-?뷀?", capacity: 12, unlocked: true },
      { id: "ship-2", name: "HF-?꾨━源?, capacity: 18, unlocked: false },
      { id: "ship-3", name: "HF-罹먮━??, capacity: 24, unlocked: false },
    ],
    activeShipId: "ship-1",
    inventory: starterInventory,
    capturedVillains: [],
    planetView: {
      tx: -120,
      ty: -160,
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return makeInitialState();
    const parsed = JSON.parse(raw);
    return { ...makeInitialState(), ...parsed };
  } catch (e) {
    return makeInitialState();
  }
}

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

const state = loadState();

const ui = {
  screens: {
    main: document.getElementById("screen-main"),
    sortie: document.getElementById("screen-sortie"),
    base: document.getElementById("screen-base"),
    settings: document.getElementById("screen-settings"),
    mission: document.getElementById("screen-mission"),
  },
  creditText: document.getElementById("creditText"),
  resourceText: document.getElementById("resourceText"),
  powerText: document.getElementById("powerText"),
  selectedPlanetText: document.getElementById("selectedPlanetText"),
  regionList: document.getElementById("regionList"),
  baseContent: document.getElementById("baseContent"),
  baseMap: document.getElementById("baseMap"),
  baseInfoName: document.getElementById("baseInfoName"),
  baseInfoDesc: document.getElementById("baseInfoDesc"),
  baseInfoUse: document.getElementById("baseInfoUse"),
  facilityModal: document.getElementById("facilityModal"),
  facilityTitle: document.getElementById("facilityTitle"),
  emergencyToast: document.getElementById("emergencyToast"),
  emergencyToastTimer: document.getElementById("emergencyToastTimer"),
  unitDetailModal: document.getElementById("unitDetailModal"),
  unitDetailTitle: document.getElementById("unitDetailTitle"),
  unitDetailBody: document.getElementById("unitDetailBody"),
  itemDetailModal: document.getElementById("itemDetailModal"),
  itemDetailTitle: document.getElementById("itemDetailTitle"),
  itemDetailBody: document.getElementById("itemDetailBody"),
  planetModal: document.getElementById("planetModal"),
  planetTrack: document.getElementById("planetTrack"),
  planetViewport: document.getElementById("planetViewport"),
  planetInfoName: document.getElementById("planetInfoName"),
  planetInfoTraits: document.getElementById("planetInfoTraits"),
  planetInfoEnemies: document.getElementById("planetInfoEnemies"),
  planetInfoRewards: document.getElementById("planetInfoRewards"),
  planetInfoRestore: document.getElementById("planetInfoRestore"),
  missionTitle: document.getElementById("missionTitle"),
  missionInfo: document.getElementById("missionInfo"),
  missionHud: document.getElementById("missionHud"),
  canvas: document.getElementById("gameCanvas"),
  mainMenuHelp: document.getElementById("mainMenuHelp"),
};

const MAIN_MENU_DEFAULT_HELP = {
  title: "異쒓꺽",
  desc: "?됱꽦怨?吏??쓣 ?좏깮???꾨Т???ㅼ뼱媛묐땲?? ?꾪닾?먯꽌 ?밸━?섎㈃ 吏???섎났??吏꾪뻾?⑸땲??",
};

const FACILITY_INFO = {
  hq: {
    name: "蹂몃?",
    desc: "?섏뒪?? 湲닿툒 ?섏뒪???뺤씤怨?異쒓꺽 ?몄썝/?λ퉬 ?몄꽦???대떦?⑸땲??",
    use: "?대┃ ???몄썝 ?곹깭瑜?蹂寃쏀븯怨?異쒓꺽 ?몄꽦??愿由ы븷 ???덉뒿?덈떎.",
  },
  factory: {
    name: "怨듭옣",
    desc: "臾닿린/?λ퉬 ?앹궛怨??곌뎄瑜?吏꾪뻾?섎뒗 ?듭떖 ?앹궛 ?쒖꽕?낅땲??",
    use: "?대┃ ??怨듭옣 ?낃렇?덉씠?쒖? ?곌뎄 ?⑥쑉 ?뺤씤??媛?ν빀?덈떎.",
  },
  plant: {
    name: "諛쒖쟾??,
    desc: "湲곗? ?댁쁺???꾩슂???먯썝怨??꾨젰???앹궛?⑸땲??",
    use: "?대┃ ??諛쒖쟾???앹궛臾??섎졊??媛?ν빀?덈떎.",
  },
  market: {
    name: "留덉폆",
    desc: "?좎엯 ?덉뼱濡??⑸퀝, 臾닿린, ?λ퉬, ?먯썝??嫄곕옒?⑸땲??",
    use: "?대┃ ???⑸퀝 怨꾩빟怨?怨꾩빟 ?댁?(80% ?섍툒)瑜?吏꾪뻾?????덉뒿?덈떎.",
  },
  black: {
    name: "釉붾옓 留덉폆",
    desc: "怨좎꽦???몃젰/?꾩꽕湲??λ퉬瑜?鍮꾩떬 媛寃⑹뿉 嫄곕옒?⑸땲??",
    use: "?대┃ ???꾨━誘몄뾼 援щℓ? 泥댄룷 鍮뚮윴 ?먮ℓ媛 媛?ν빀?덈떎.",
  },
  hangar: {
    name: "寃⑸궔怨?,
    desc: "?곗＜?좉낵 硫붿뭅瑜??뺣퉬?섍퀬 異쒓꺽 ?湲??곹깭瑜?愿由ы빀?덈떎.",
    use: "?대┃ ??寃⑸궔怨??곹깭瑜??뺤씤?⑸땲??",
  },
  prison: {
    name: "?섍컧??,
    desc: "泥댄룷??鍮뚮윴???섍컧?섍퀬 泥섎━(嫄곕옒/?앸갑)?⑸땲??",
    use: "?대┃ ???섍컧 鍮뚮윴 ?꾪솴???뺤씤?섍퀬 泥섎━?????덉뒿?덈떎.",
  },
};

function updateTopbar() {
  if (state.settings.infinite) {
    ui.creditText.textContent = "?щ젅?? INF";
    ui.resourceText.textContent = "?먯썝: INF";
    ui.powerText.textContent = "?꾨젰: INF";
    return;
  }
  ui.creditText.textContent = `?щ젅?? ${Math.floor(state.credits)}`;
  ui.resourceText.textContent = `?먯썝: ${Math.floor(state.resources)}`;
  ui.powerText.textContent = `?꾨젰: ${Math.floor(state.power)}`;
}

function showScreen(name) {
  Object.values(ui.screens).forEach((node) => node.classList.remove("active"));
  ui.screens[name].classList.add("active");
  if (name === "sortie") renderSortie();
  if (name === "base") renderBase();
  if (name !== "base" && ui.facilityModal && !ui.facilityModal.classList.contains("hidden")) {
    closeFacilityModal();
  }
  if (name === "settings") syncSettingsForm();
}

function getPlanetById(id) {
  return state.planets.find((p) => p.id === id) || null;
}

function getRegionById(planet, regionId) {
  return planet.regions.find((r) => r.id === regionId) || null;
}

function getRestoreRate(planet) {
  const restored = planet.regions.filter((r) => r.restored).length;
  return restored / planet.regions.length;
}

function setPlanetInfo(planet) {
  const rate = Math.round(getRestoreRate(planet) * 100);
  ui.planetInfoName.textContent = planet.name;
  ui.planetInfoTraits.textContent = `?뱀쭠: ${planet.traits}`;
  ui.planetInfoEnemies.textContent = `?? ${planet.enemies}`;
  ui.planetInfoRewards.textContent = `蹂댁긽: ${planet.rewards}`;
  ui.planetInfoRestore.textContent = `?섎났瑜? ${rate}%`;
}

function renderSortie() {
  const planet = getPlanetById(state.selectedPlanetId);
  ui.selectedPlanetText.textContent = `?좏깮 ?됱꽦: ${planet ? planet.name : "?놁쓬"}`;
  ui.regionList.innerHTML = "";
  if (!planet) {
    ui.regionList.innerHTML = `<div class="base-card">?됱꽦??癒쇱? ?좏깮?섏꽭??</div>`;
    return;
  }
  planet.regions.forEach((region) => {
    const selected = state.selectedRegionId === region.id ? "selected" : "";
    const restored = region.restored ? "restored" : "";
    const rate = Math.round(getRestoreRate(planet) * 100);
    const bonusText =
      rate >= 100
        ? "?됱꽦 ?꾩쟾 ?섎났: ??????쏀솕, ?쒖꽕 ?ㅼ닔 ?깆옣"
        : rate > 0
          ? "遺遺??섎났: ?대떦 吏???몄쓽?쒖꽕 ?쇰? ?깆옣"
          : "?몄쓽?쒖꽕 ?놁쓬";
    const div = document.createElement("div");
    div.className = `region-item ${selected} ${restored}`;
    div.innerHTML = `
      <div>
        <strong>${region.name}</strong>
        <div>?쒖씠?? ${region.difficulty} / ?곹깭: ${region.restored ? "?섎났 ?꾨즺" : "誘몄닔蹂?}</div>
        <div>${bonusText}</div>
      </div>
      <div>
        <button data-select-region="${region.id}">?좏깮</button>
      </div>
    `;
    ui.regionList.appendChild(div);
  });
}

function renderPlanetNodes() {
  ui.planetTrack.innerHTML = "";
  state.planets.forEach((planet) => {
    const node = document.createElement("button");
    node.className = "planet-node";
    node.style.left = `${planet.x}px`;
    node.style.top = `${planet.y}px`;
    node.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,.28), ${planet.color})`;
    node.textContent = planet.name;
    if (state.selectedPlanetId === planet.id) node.classList.add("selected");

    node.addEventListener("mouseenter", () => setPlanetInfo(planet));
    node.addEventListener("click", () => {
      state.selectedPlanetId = planet.id;
      state.selectedRegionId = planet.regions[0]?.id || null;
      saveState();
      renderPlanetNodes();
      renderSortie();
    });
    ui.planetTrack.appendChild(node);
  });
  applyPlanetTransform();
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function applyPlanetTransform() {
  const viewportRect = ui.planetViewport.getBoundingClientRect();
  const trackW = 1700;
  const trackH = 980;
  const minX = viewportRect.width - trackW;
  const minY = viewportRect.height - trackH;
  state.planetView.tx = clamp(state.planetView.tx, minX, 0);
  state.planetView.ty = clamp(state.planetView.ty, minY, 0);
  ui.planetTrack.style.transform = `translate(${state.planetView.tx}px, ${state.planetView.ty}px)`;
}

function openPlanetModal() {
  ui.planetModal.classList.remove("hidden");
  renderPlanetNodes();
  const planet = getPlanetById(state.selectedPlanetId) || state.planets[0];
  if (planet) setPlanetInfo(planet);
}

function closePlanetModal() {
  ui.planetModal.classList.add("hidden");
  saveState();
}

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let baseTx = 0;
let baseTy = 0;

ui.planetViewport.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  baseTx = state.planetView.tx;
  baseTy = state.planetView.ty;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  state.planetView.tx = baseTx + dx;
  state.planetView.ty = baseTy + dy;
  applyPlanetTransform();
});

window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  saveState();
});

ui.planetViewport.addEventListener("mouseleave", () => {
  if (!isDragging) return;
  isDragging = false;
  saveState();
});

const mission = {
  running: false,
  rafId: null,
  lastTime: 0,
  elapsed: 0,
  player: null,
  enemies: [],
  effects: [],
  regionId: null,
  planetId: null,
};

function pushFx(kind, data = {}, life = 0.25) {
  mission.effects.push({ kind, ...data, life });
}

function getNearestEnemy(p) {
  let nearest = null;
  let dist = Infinity;
  mission.enemies.forEach((e) => {
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d < dist) {
      dist = d;
      nearest = e;
    }
  });
  return { nearest, dist };
}

function applyKnockback(target, fromX, fromY, force) {
  const dx = target.x - fromX;
  const dy = target.y - fromY;
  const m = Math.hypot(dx, dy) || 1;
  target.x += (dx / m) * force;
  target.y += (dy / m) * force;
  target.x = clamp(target.x, 20, 880);
  target.y = clamp(target.y, 20, 480);
}

function rollCrit(p) {
  const bonus = (p.critBonusStacks || 0) * 0.15;
  const chance = Math.min(0.6, (p.critChance || 0.1) + bonus);
  return Math.random() < chance;
}

function dealDamageToEnemy(enemy, baseDamage, p) {
  const crit = rollCrit(p);
  const dmg = crit ? Math.round(baseDamage * 1.6) : baseDamage;
  enemy.hp -= Math.max(1, dmg);
}

function performMeleeAttack(p, target) {
  const type = p.meleeType || "?뚮뱶";
  p.attackingMeleeType = type;
  p.attackMotionUntil = mission.elapsed + (type === "?곌굅" ? 0.18 : type === "?대㉧" ? 0.34 : 0.28);
  p.lastMeleeAt = mission.elapsed;
  const range = p.meleeRangePx;
  const base = p.meleeDamage;
  const meleeFx = {
    ?곌굅: { life: 0.1, width: 2, scale: 0.42 },
    ?뚮뱶: { life: 0.15, width: 3, scale: 0.5 },
    痢좊컮?댄뿨?? { life: 0.2, width: 4, scale: 0.62 },
    釉붾젅?대뱶: { life: 0.13, width: 3, scale: 0.48 },
    ?ㅽ뵾?? { life: 0.12, width: 2, scale: 0.56 },
    ?쒖뒪: { life: 0.14, width: 3, scale: 0.62 },
    硫붿씠?? { life: 0.18, width: 4, scale: 0.58 },
    ?대㉧: { life: 0.22, width: 5, scale: 0.68 },
    ?? { life: 0.2, width: 3, scale: 0.78 },
    ?ъ씠利? { life: 0.2, width: 4, scale: 0.72 },
  }[type] || { life: 0.14, width: 3, scale: 0.5 };
  const mfx = p.meleeFxScale || 1;
  pushFx(
    "melee-swing",
    { x: p.x, y: p.y, r: Math.max(26, range * meleeFx.scale * mfx), color: p.attrColor || "#ffd48a", width: meleeFx.width * mfx, type },
    meleeFx.life * (0.95 + (mfx - 1) * 0.8),
  );

  if (["?곌굅", "?뚮뱶", "痢좊컮?댄뿨??, "釉붾젅?대뱶", "硫붿씠??, "?대㉧", "??].includes(type)) {
    const hitR = type === "?? ? range * 1.1 : range * 0.9;
    mission.enemies.forEach((e) => {
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      if (d <= hitR) {
        dealDamageToEnemy(e, base, p);
        if (["硫붿씠??, "?대㉧", "??].includes(type)) applyKnockback(e, p.x, p.y, type === "?대㉧" ? 45 : 30);
      }
    });
    return;
  }

  if (type === "?ㅽ뵾?? || type === "?쒖뒪") {
    if (target) {
      pushFx(
        "stab-line",
        { x1: p.x, y1: p.y, x2: target.x, y2: target.y, color: p.attrColor || "#ffdfb8", width: (type === "?쒖뒪" ? 4 : 3) * mfx },
        (type === "?쒖뒪" ? 0.16 : 0.12) * (0.95 + (mfx - 1) * 0.8),
      );
      dealDamageToEnemy(target, type === "?쒖뒪" ? Math.round(base * 1.12) : base, p);
      applyKnockback(target, p.x, p.y, type === "?쒖뒪" ? 36 : 14);
    }
    return;
  }

  if (type === "?ъ씠利?) {
    if (target) {
      const hookRange = p.scytheHookRangePx || 300;
      const d = Math.hypot(target.x - p.x, target.y - p.y);
      if (d <= hookRange) {
        pushFx("hook-line", { x1: p.x, y1: p.y, x2: target.x, y2: target.y, color: p.attrColor || "#8fe6ff", width: 4 * mfx }, 0.2 * (0.95 + (mfx - 1) * 0.8));
        target.x += (p.x - target.x) * 0.45;
        target.y += (p.y - target.y) * 0.45;
      }
      dealDamageToEnemy(target, Math.round(base * 1.18), p);
      applyKnockback(target, p.x, p.y, 52);
    }
  }
}

function performFirearmAttack(p, target) {
  if (!target) return;
  const type = p.firearmType || "AR";
  const base = p.firearmDamage;
  const shotFx = {
    SG: { life: 0.07, width: 3 },
    AR: { life: 0.09, width: 2 },
    SMG: { life: 0.06, width: 2 },
    LMG: { life: 0.1, width: 2.5 },
    DMR: { life: 0.12, width: 3 },
    SR: { life: 0.14, width: 3.8 },
    RL: { life: 0.12, width: 3.2 },
  }[type] || { life: 0.09, width: 2 };
  const ffx = p.firearmFxScale || 1;
  pushFx(
    "shot-line",
    { x1: p.x, y1: p.y, x2: target.x, y2: target.y, color: p.attrColor || "#cde8ff", width: shotFx.width * ffx, type },
    shotFx.life * (0.95 + (ffx - 1) * 0.8),
  );
  if (type === "SG") {
    dealDamageToEnemy(target, base, p);
    applyKnockback(target, p.x, p.y, 24);
    const extra = mission.enemies.find((e) => e.id !== target.id && Math.hypot(e.x - target.x, e.y - target.y) < 70);
    if (extra) {
      pushFx("shot-line", { x1: p.x, y1: p.y, x2: extra.x, y2: extra.y, color: p.attrColor || "#cde8ff", width: 2.2 * ffx, type }, 0.07 * (0.95 + (ffx - 1) * 0.8));
      dealDamageToEnemy(extra, Math.round(base * 0.6), p);
      applyKnockback(extra, p.x, p.y, 16);
    }
    return;
  }
  if (type === "LMG") {
    dealDamageToEnemy(target, base, p);
    const extra = mission.enemies.find((e) => e.id !== target.id && Math.hypot(e.x - target.x, e.y - target.y) < 55);
    if (extra) dealDamageToEnemy(extra, Math.round(base * 0.5), p);
    return;
  }
  if (type === "RL") {
    pushFx("explosion", { x: target.x, y: target.y, r: 94 * ffx, color: p.attrColor || "#ffb060", type }, 0.22 * (0.95 + (ffx - 1) * 0.8));
    mission.enemies.forEach((e) => {
      const d = Math.hypot(e.x - target.x, e.y - target.y);
      if (d < 92) dealDamageToEnemy(e, Math.round(base * (1 - d / 120)), p);
    });
    return;
  }
  dealDamageToEnemy(target, base, p);
}

const keyState = {};
window.addEventListener("keydown", (e) => (keyState[e.key.toLowerCase()] = true));
window.addEventListener("keyup", (e) => (keyState[e.key.toLowerCase()] = false));

function startMission() {
  const planet = getPlanetById(state.selectedPlanetId);
  if (!planet) {
    alert("?됱꽦???좏깮?섏꽭??");
    return;
  }
  const region = getRegionById(planet, state.selectedRegionId);
  if (!region) {
    alert("吏??쓣 ?좏깮?섏꽭??");
    return;
  }

  const restoreRate = getRestoreRate(planet);
  const allRestored = restoreRate >= 1;
  let enemyCount = 3 + region.difficulty * 2;
  enemyCount = Math.round(enemyCount * DIFF_SCALE[state.settings.difficulty]);
  enemyCount = Math.round(enemyCount * (1 - restoreRate * 0.4));
  if (allRestored) enemyCount = Math.round(enemyCount * 0.7);
  if (region.restored) enemyCount = Math.round(enemyCount * 0.75);
  enemyCount = Math.max(1, enemyCount);

  const enemyHp = Math.round((28 + region.difficulty * 10) * DIFF_SCALE[state.settings.difficulty]);
  const deployed = getAllUnits().filter((u) => u.deployed);
  if (!deployed.length) {
    alert("異쒓꺽 ?몄썝 ??뿉??理쒖냼 1紐낆쓣 異쒓꺽 諛곗튂?섏꽭??");
    return;
  }
  const teamCounts = getTeamCounts(deployed);
  const deployedStats = deployed.map((u) => calculateUnitStatsWithTeam(u, teamCounts));
  const sumAtk = deployedStats.reduce((a, s) => a + s.atk, 0);
  const sumDef = deployedStats.reduce((a, s) => a + s.def, 0);
  const sumHp = deployedStats.reduce((a, s) => a + s.hp, 0);
  const avgSpeed = deployedStats.reduce((a, s) => a + s.speed, 0) / deployedStats.length;
  const leader = deployed[0];
  const leaderMelee = leader.equippedMelee || createItemIconLoadout("melee", leader);
  const leaderFirearm = leader.equippedFirearm || createItemIconLoadout("firearm", leader);
  const leaderDefense = leader.canUseDefense ? (leader.equippedDefense || createItemIconLoadout("defense", leader)) : null;
  mission.player = {
    x: 450,
    y: 250,
    r: 14,
    hp: Math.round(70 + sumHp * 0.85),
    maxHp: Math.round(70 + sumHp * 0.85),
    speed: Math.round(145 + avgSpeed * 4.6),
    attack: Math.round(10 + sumAtk * 0.65),
    defense: Math.round(sumDef * 0.45),
    color: deployed[0]?.color || "#4dd0e1",
    attrPrimary: getPrimaryAttribute(leader.attribute),
    attrColor: getAttributeColor(leader.attribute),
    weaponType: deployed[0]?.weaponType || "rifle",
    meleeType: leaderMelee?.weaponType || "?뚮뱶",
    firearmType: leaderFirearm?.weaponType || "AR",
    meleeRangePx: Math.round((leaderMelee?.range || 1.8) * 62),
    firearmRangePx: Math.round((leaderFirearm?.range || 3.0) * 62),
    scytheHookRangePx: Math.round((leaderMelee?.range || 2.8) * 124),
    meleeDamage: Math.max(4, Math.round((leaderMelee?.atk || 8) + sumAtk * 0.22)),
    firearmDamage: Math.max(4, Math.round((leaderFirearm?.atk || 8) + sumAtk * 0.26)),
    meleeCd: Math.max(0.18, 0.85 / (leaderMelee?.attackSpeed || 1)),
    firearmCd: Math.max(0.2, 0.95 / (leaderFirearm?.attackSpeed || 1)),
    meleeTier: parseItemTier(leaderMelee),
    firearmTier: parseItemTier(leaderFirearm),
    defenseTier: parseItemTier(leaderDefense),
    meleeFxScale: 1 + (parseItemTier(leaderMelee) - 3) * 0.12,
    firearmFxScale: 1 + (parseItemTier(leaderFirearm) - 3) * 0.12,
    defenseFxScale: 1 + (parseItemTier(leaderDefense) - 3) * 0.12,
    defenseType: leaderDefense?.weaponType || "",
    defenseBlock: leaderDefense?.block || 0,
    defenseCooldown: leaderDefense?.cooldown || 0,
    defenseCdLeft: 0,
    critChance: 0.1 + (leaderMelee?.weaponType === "釉붾젅?대뱶" ? 0.08 : 0),
    critBonusStacks: 0,
    critBonusUntil: 0,
    attackMotionUntil: 0,
    attackingMeleeType: "",
    attackCd: 0,
  };
  mission.enemies = [];
  for (let i = 0; i < enemyCount; i += 1) {
    mission.enemies.push({
      id: `${Date.now()}-${i}`,
      x: 60 + Math.random() * 780,
      y: 50 + Math.random() * 400,
      r: 12,
      hp: enemyHp,
      speed: 65 + Math.random() * 35,
      touchCd: 0,
    });
  }

  mission.running = true;
  mission.lastTime = performance.now();
  mission.elapsed = 0;
  mission.regionId = region.id;
  mission.planetId = planet.id;
  mission.effects = [];
  ui.missionTitle.textContent = `${planet.name} - ${region.name}`;
  ui.missionInfo.textContent = `??${enemyCount}湲?異쒗쁽. ?꾨㈇?쒗궎硫?吏??쓣 ?섎났?⑸땲??`;
  showScreen("mission");
  mission.rafId = requestAnimationFrame(loopMission);
}

function loopMission(ts) {
  if (!mission.running) return;
  const dt = Math.min(0.033, (ts - mission.lastTime) / 1000);
  mission.lastTime = ts;
  mission.elapsed += dt;
  updateMission(dt);
  drawMission();
  mission.rafId = requestAnimationFrame(loopMission);
}

function updateMission(dt) {
  const p = mission.player;
  let mx = 0;
  let my = 0;
  if (keyState.w) my -= 1;
  if (keyState.s) my += 1;
  if (keyState.a) mx -= 1;
  if (keyState.d) mx += 1;
  const mag = Math.hypot(mx, my) || 1;
  p.x += (mx / mag) * p.speed * dt;
  p.y += (my / mag) * p.speed * dt;
  p.x = clamp(p.x, 20, 880);
  p.y = clamp(p.y, 20, 480);

  p.attackCd -= dt;
  p.defenseCdLeft = Math.max(0, p.defenseCdLeft - dt);
  if (p.critBonusUntil > 0 && mission.elapsed > p.critBonusUntil) {
    p.critBonusStacks = 0;
    p.critBonusUntil = 0;
  }
  if (p.attackCd <= 0 && mission.enemies.length > 0) {
    const { nearest, dist } = getNearestEnemy(p);
    if (nearest && dist <= p.meleeRangePx) {
      performMeleeAttack(p, nearest);
      p.attackCd = p.meleeCd;
    } else if (nearest && dist <= p.firearmRangePx) {
      performFirearmAttack(p, nearest);
      p.attackCd = p.firearmCd;
    }
  }

  mission.enemies.forEach((e) => {
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const m = Math.hypot(dx, dy) || 1;
    e.x += (dx / m) * e.speed * dt;
    e.y += (dy / m) * e.speed * dt;
    e.touchCd -= dt;
    const touch = Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r;
    if (touch && e.touchCd <= 0) {
      if (!state.settings.godMode) {
        let damage = Math.max(1, 8 - p.defense);
        let blocked = false;
        if (p.attackMotionUntil > mission.elapsed && ["?쒖뒪", "痢좊컮?댄뿨??].includes(p.attackingMeleeType)) {
          blocked = true;
          damage = Math.round(damage * 0.2);
          p.lastBlockAt = mission.elapsed;
          pushFx("parry-flash", { x: p.x, y: p.y, r: 26, color: p.attrColor || "#fff2b0" }, 0.14);
        } else if (p.defenseType && p.defenseCdLeft <= 0) {
          blocked = true;
          damage = Math.max(0, damage - p.defenseBlock);
          p.defenseCdLeft = p.defenseCooldown;
          p.lastBlockAt = mission.elapsed;
          const angle = Math.atan2(e.y - p.y, e.x - p.x);
          const dfx = p.defenseFxScale || 1;
          pushFx(
            "shield-burst",
            { x: p.x, y: p.y, r: (p.defenseType === "?? ? 76 : 44) * dfx, color: p.attrColor || "#8cd3ff", dtype: p.defenseType, angle, width: 2 + dfx },
            0.2 * (0.95 + (dfx - 1) * 0.8),
          );
          if (p.defenseType === "?낆냼釉?) p.hp = Math.min(p.maxHp, p.hp + 10);
          if (p.defenseType === "?ㅽ똿媛??) e.hp -= 8;
          if (p.defenseType === "嫄댁떎??) {
            const n = mission.enemies.find((x) => x.id !== e.id);
            if (n) n.hp -= 6;
          }
          if (p.defenseType === "?ㅼ퓼??) {
            p.critBonusStacks = Math.min(2, (p.critBonusStacks || 0) + 1);
            p.critBonusUntil = mission.elapsed + 6;
          }
        }
        p.hp -= damage;
        if (blocked) {
          // Small pushback feedback when a block/parry succeeds.
          applyKnockback(e, p.x, p.y, 18);
        }
      }
      e.touchCd = 0.6;
    }
  });

  for (let i = mission.enemies.length - 1; i >= 0; i -= 1) {
    if (mission.enemies[i].hp <= 0) {
      if (Math.random() < 0.2) {
        state.capturedVillains.push({
          id: `v-${Date.now()}-${i}`,
          name: "泥댄룷??鍮뚮윴",
          value: 220 + Math.floor(Math.random() * 180),
        });
      }
      mission.enemies.splice(i, 1);
    }
  }

  for (let i = mission.effects.length - 1; i >= 0; i -= 1) {
    mission.effects[i].life -= dt;
    if (mission.effects[i].life <= 0) mission.effects.splice(i, 1);
  }

  ui.missionHud.textContent = `HP ${Math.max(0, Math.floor(p.hp))}/${p.maxHp} | ?⑥? ??${mission.enemies.length} | 洹쇱젒 ${p.meleeType} / 珥앷린 ${p.firearmType} | 諛⑹뼱荑?${p.defenseCdLeft.toFixed(1)}s`;

  if (p.hp <= 0) endMission(false, "?덉뼱濡쒓? ?곕윭議뚯뒿?덈떎.");
  if (mission.enemies.length === 0) endMission(true, "吏???섎났 ?꾨즺");
}

function drawMission() {
  const ctx = ui.canvas.getContext("2d");
  ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);

  const p = mission.player;
  const weaponMap = { rifle: "??, carbine: "??, shotgun: "??, blade: "?? };
  ctx.fillStyle = p.color || "#4dd0e1";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Segoe UI";
  ctx.fillText(weaponMap[p.weaponType] || "??, p.x + 14, p.y + 4);

  ctx.strokeStyle = "rgba(77,208,225,.35)";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.firearmRangePx || 220, 0, Math.PI * 2);
  ctx.stroke();

  if (p.defenseType === "??) {
    ctx.strokeStyle = p.defenseCdLeft <= 0 ? (p.attrColor || "#7cd8ff") : "rgba(124, 216, 255, 0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  mission.effects.forEach((fx) => {
    const alpha = Math.max(0, Math.min(1, fx.life / 0.25));
    if (fx.kind === "shot-line" || fx.kind === "hook-line" || fx.kind === "stab-line") {
      ctx.strokeStyle = fx.color || "#cde8ff";
      ctx.globalAlpha = alpha;
      ctx.lineWidth = fx.width || (fx.kind === "hook-line" ? 3 : 2);
      ctx.beginPath();
      ctx.moveTo(fx.x1, fx.y1);
      ctx.lineTo(fx.x2, fx.y2);
      ctx.stroke();
      // trailing afterimage
      ctx.globalAlpha = alpha * 0.38;
      ctx.lineWidth = Math.max(1, (fx.width || 2) - 1);
      ctx.beginPath();
      ctx.moveTo(fx.x1 - 2, fx.y1 - 2);
      ctx.lineTo(fx.x2 - 2, fx.y2 - 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
    }
    if (fx.kind === "melee-swing" || fx.kind === "parry-flash" || fx.kind === "explosion") {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = fx.color || "#ffd48a";
      ctx.fillStyle = fx.color || "#ffd48a";
      if (fx.kind === "explosion") {
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, fx.r * (1 - alpha * 0.4), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.lineWidth = fx.width || 2;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, fx.r * (1 + (1 - alpha) * 0.3), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
    }
    if (fx.kind === "shield-burst") {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = fx.color || "#8cd3ff";
      ctx.fillStyle = fx.color || "#8cd3ff";
      const a = fx.angle || 0;
      const drawArc = (r, spread, width = 3) => {
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, r, a - spread, a + spread);
        ctx.stroke();
      };
      if (fx.dtype === "踰꾪겢??) drawArc(26, 0.45, 3);
      else if (fx.dtype === "?쇱슫??) drawArc(34, 0.65, 3);
      else if (fx.dtype === "??) {
        ctx.save();
        ctx.translate(fx.x, fx.y);
        ctx.rotate(a);
        ctx.fillRect(20, -26, 10, 52);
        ctx.restore();
      } else if (fx.dtype === "??) {
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, 76 * (1 + (1 - alpha) * 0.1), 0, Math.PI * 2);
        ctx.stroke();
      } else if (fx.dtype === "?ㅼ퓼??) {
        drawArc(34, 0.65, 3);
        ctx.globalAlpha = alpha * 0.5;
        drawArc(42, 0.72, 2);
      } else if (fx.dtype === "?ㅽ똿媛??) {
        drawArc(30, 0.6, 3);
        ctx.beginPath();
        ctx.moveTo(fx.x + Math.cos(a) * 30, fx.y + Math.sin(a) * 30);
        ctx.lineTo(fx.x + Math.cos(a) * 44, fx.y + Math.sin(a) * 44);
        ctx.stroke();
      } else if (fx.dtype === "嫄댁떎??) {
        drawArc(30, 0.6, 3);
        ctx.beginPath();
        ctx.arc(fx.x + Math.cos(a) * 40, fx.y + Math.sin(a) * 40, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (fx.dtype === "?낆냼釉?) {
        drawArc(32, 0.65, 3);
        ctx.globalAlpha = alpha * 0.45;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, 16 + (1 - alpha) * 18, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        drawArc(32, 0.6, 3);
      }
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
    }
  });

  mission.enemies.forEach((e) => {
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function endMission(success, reason) {
  if (!mission.running) return;
  mission.running = false;
  if (mission.rafId) cancelAnimationFrame(mission.rafId);

  const planet = getPlanetById(mission.planetId);
  const region = planet ? getRegionById(planet, mission.regionId) : null;

  if (success && planet && region) {
    region.restored = true;
    const baseCredit = 240 + region.difficulty * 110;
    const baseResource = 90 + region.difficulty * 45;
    const rate = getRestoreRate(planet);
    const bonus = 1 + rate * 0.4;
    if (!state.settings.infinite) {
      state.credits += Math.round(baseCredit * bonus);
      state.resources += Math.round(baseResource * bonus);
    }
    state.power += 20 + state.powerPlantLevel * 5;
    alert(`${reason}\n蹂댁긽 ?띾뱷 ?꾨즺`);
  } else {
    alert(`?꾨Т ?ㅽ뙣: ${reason}`);
  }
  trySpawnEmergencyQuest();
  updateEmergencyQuestStatus();
  saveState();
  updateTopbar();
  showScreen("sortie");
}

function setBaseInfo(facilityId) {
  const info = FACILITY_INFO[facilityId];
  if (!info) return;
  ui.baseInfoName.textContent = info.name;
  ui.baseInfoDesc.textContent = info.desc;
  ui.baseInfoUse.textContent = info.use;
}

function ensureQuestState() {
  if (!Array.isArray(state.quests)) state.quests = [];
  if (typeof state.questCounter !== "number") state.questCounter = 1;
  if (!state.hqView) state.hqView = "quests";
  while (state.quests.length < 10) {
    state.quests.push(createNormalQuest(state.questCounter));
    state.questCounter += 1;
  }
  if (state.quests.length > 10) state.quests = state.quests.slice(0, 10);
}

function ensureRosterState() {
  const catalog = createInitialRoster();
  const allNow = [...(state.heroes || []), ...(state.mercs || [])];
  const needBootstrap = !state.rosterVersion || state.rosterVersion < 4 || allNow.length < 180;

  if (needBootstrap) {
    const heroMap = new Map((state.heroes || []).map((u) => [u.id, u]));
    const mercMap = new Map((state.mercs || []).map((u) => [u.id, u]));
    catalog.heroes.forEach((u) => {
      if (!heroMap.has(u.id)) heroMap.set(u.id, u);
    });
    catalog.mercs.forEach((u) => {
      if (!mercMap.has(u.id)) mercMap.set(u.id, u);
    });
    state.heroes = [...heroMap.values()];
    state.mercs = [...mercMap.values()];

    // Normalize original roster size to exactly 28 created units.
    const catalogOriginalHeroIds = new Set(catalog.heroes.filter((u) => u.team === "?ㅻ━吏??).map((u) => u.id));
    const catalogOriginalMercIds = new Set(catalog.mercs.filter((u) => u.team === "?ㅻ━吏??).map((u) => u.id));
    const nonOriginalHeroes = state.heroes.filter((u) => u.team !== "?ㅻ━吏??);
    const nonOriginalMercs = state.mercs.filter((u) => u.team !== "?ㅻ━吏??);
    const fixedOriginalHeroes = state.heroes.filter((u) => catalogOriginalHeroIds.has(u.id));
    const fixedOriginalMercs = state.mercs.filter((u) => catalogOriginalMercIds.has(u.id));
    const missingOriginalHeroes = catalog.heroes.filter((u) => u.team === "?ㅻ━吏?? && !fixedOriginalHeroes.some((x) => x.id === u.id));
    const missingOriginalMercs = catalog.mercs.filter((u) => u.team === "?ㅻ━吏?? && !fixedOriginalMercs.some((x) => x.id === u.id));
    state.heroes = [...nonOriginalHeroes, ...fixedOriginalHeroes, ...missingOriginalHeroes];
    state.mercs = [...nonOriginalMercs, ...fixedOriginalMercs, ...missingOriginalMercs];
    if (!state.heroes.some((h) => h.deployed)) {
      if (state.heroes[0]) state.heroes[0].deployed = true;
      if (state.heroes[1]) state.heroes[1].deployed = true;
    }
    if (!state.hqSelectedHeroId || !state.heroes.some((h) => h.id === state.hqSelectedHeroId)) {
      state.hqSelectedHeroId = state.heroes[0]?.id || null;
    }
    state.rosterVersion = 4;
  }
  state.heroes = state.heroes.map((h, idx) => ({
    unitType: "hero",
    def: 6,
    speed: 15,
    ability: "湲곕낯 ?꾩닠",
    classType: "?덉뼱濡?,
    color: "#7dc4ff",
    weaponType: "rifle",
    abilityIcon: "scope",
    level: 1,
    canUseDefense: ["?뷀렂??, "?댁뜲??, "踰꾩꽌而?, "?ㅽ룓??].includes(h.roleClass || h.classType),
    equippedMelee: null,
    equippedFirearm: null,
    equippedDefense: null,
    equippedGears: [],
    deployed: idx < 2,
    ...h,
  }));
  state.mercs = state.mercs.map((m) => ({
    unitType: "merc",
    def: 4,
    speed: 14,
    ability: "?꾩옣 ???,
    classType: "?⑸퀝",
    color: "#a7ffa4",
    weaponType: "carbine",
    abilityIcon: "dash",
    level: 1,
    canUseDefense: ["?뷀렂??, "?댁뜲??, "踰꾩꽌而?, "?ㅽ룓??].includes(m.roleClass || m.classType),
    equippedMelee: null,
    equippedFirearm: null,
    equippedDefense: null,
    equippedGears: [],
    randomLoadout: MERC_LOADOUT_POOL[randInt(0, MERC_LOADOUT_POOL.length - 1)],
    deployed: false,
    ...m,
  }));
  if (!state.hqSelectedHeroId || !state.heroes.some((h) => h.id === state.hqSelectedHeroId)) {
    state.hqSelectedHeroId = state.heroes[0]?.id || null;
  }
  // Backfill for older saves.
  state.heroes.forEach((h) => {
    if (!h.roleClass) h.roleClass = "?ㅽ렂??;
    if (!h.rangeClass) h.rangeClass = "以묎굅由?;
    if (!h.classType || h.classType === "?덉뼱濡?) h.classType = h.roleClass;
    if (!h.attribute) h.attribute = "臾쇰━";
    if (!h.teamEffect && h.team) h.teamEffect = TEAM_EFFECTS[h.team] || "?놁쓬";
    if (h.name && !/[媛-??/.test(h.name)) h.name = koreanizeName(h.name);
  });
  state.mercs.forEach((m) => {
    if (!m.roleClass) m.roleClass = "?ㅼ빱誘몄뀛";
    if (!m.rangeClass) m.rangeClass = "以묒썝嫄곕━";
    if (!m.classType || m.classType === "?⑸퀝") m.classType = m.roleClass;
    if (!m.attribute) m.attribute = "臾쇰━";
    if (!m.teamEffect && m.team) m.teamEffect = TEAM_EFFECTS[m.team] || "?놁쓬";
    if (m.name && !/[媛-??/.test(m.name)) m.name = koreanizeName(m.name);
  });
  if (!Array.isArray(state.inventory)) state.inventory = [];
  state.inventory = state.inventory.map((it) => ({
    itemKind: it.itemKind || it.type || "gear",
    mainType: it.mainType || (it.type === "weapon" ? "臾닿린" : "?λ퉬"),
    subType: it.subType || (it.type === "weapon" ? "legacy" : "legacy"),
    slotType: it.slotType || (it.type === "weapon" ? "firearm" : "gear"),
    icon: it.icon || createItemIcon(it.name?.slice(0, 3) || "?꾩씠??, "#435069"),
    cdr: it.cdr || 0,
    ...it,
  }));
  if (state.inventory.length < 15) {
    const starter = createStarterInventory();
    const has = new Set(state.inventory.map((x) => x.id));
    starter.forEach((it) => {
      if (!has.has(it.id)) state.inventory.push(it);
    });
  }

  const migrateLegacySlots = (u) => {
    if (u.equippedWeapon) {
      if (!u.equippedFirearm) u.equippedFirearm = u.equippedWeapon;
      u.equippedWeapon = null;
    }
    if (u.equippedGear) {
      if (!Array.isArray(u.equippedGears)) u.equippedGears = [];
      if (u.equippedGears.length < 2) u.equippedGears.push(u.equippedGear);
      u.equippedGear = null;
    }
    if (!u.equippedMelee) u.equippedMelee = createItemIconLoadout("melee", u);
    if (!u.equippedFirearm) u.equippedFirearm = createItemIconLoadout("firearm", u);
    if (u.canUseDefense && !u.equippedDefense) u.equippedDefense = createItemIconLoadout("defense", u);
    if (!Array.isArray(u.equippedGears)) u.equippedGears = [];
    if (u.equippedGears.length === 0) u.equippedGears.push(createDefaultGearForUnit(u));
  };
  state.heroes.forEach(migrateLegacySlots);
  state.mercs.forEach(migrateLegacySlots);
  if (!state.hqReserveFilter) state.hqReserveFilter = { roleClass: "all", attribute: "all", rangeClass: "all" };
  if (!Array.isArray(state.hangarShips) || state.hangarShips.length === 0) {
    state.hangarShips = [{ id: "ship-1", name: "HF-?뷀?", capacity: 12, unlocked: true }];
  }
  if (!state.activeShipId || !state.hangarShips.some((s) => s.id === state.activeShipId && s.unlocked)) {
    const firstUnlocked = state.hangarShips.find((s) => s.unlocked);
    state.activeShipId = firstUnlocked ? firstUnlocked.id : state.hangarShips[0].id;
  }
}

function unitMatchesReserveFilter(unit) {
  const f = state.hqReserveFilter || { roleClass: "all", attribute: "all", rangeClass: "all" };
  if (f.roleClass !== "all" && unit.roleClass !== f.roleClass) return false;
  if (f.rangeClass !== "all" && unit.rangeClass !== f.rangeClass) return false;
  if (f.attribute !== "all" && !(unit.attribute || "").includes(f.attribute)) return false;
  return true;
}

function getClassMarkImage(unit) {
  const role = unit.roleClass || unit.classType;
  return CLASS_META[role]?.icon || "./assets/icons/class-default.svg";
}

function getAbilityImage(unit) {
  const map = {
    scope: "./assets/icons/ability-scope.svg",
    guard: "./assets/icons/ability-guard.svg",
    dash: "./assets/icons/ability-dash.svg",
    reload: "./assets/icons/ability-reload.svg",
    rage: "./assets/icons/ability-rage.svg",
  };
  return map[unit.abilityIcon] || "./assets/icons/ability-default.svg";
}

function getPortraitImage(unit) {
  const weaponMap = { rifle: "??, carbine: "??, shotgun: "??, blade: "?? };
  const symbol = weaponMap[unit.weaponType] || "??;
  const fill = unit.color || "#9fb2c7";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>
    <rect width='96' height='96' rx='14' fill='#132338'/>
    <circle cx='40' cy='48' r='23' fill='${fill}' stroke='#ffffff88' stroke-width='2'/>
    <text x='72' y='54' text-anchor='middle' font-size='20' fill='#fff' font-family='Segoe UI'>${symbol}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getAllUnits() {
  return [...state.heroes, ...state.mercs];
}

function getUnitById(id) {
  return getAllUnits().find((u) => u.id === id) || null;
}

function getActiveShip() {
  return state.hangarShips.find((s) => s.id === state.activeShipId) || state.hangarShips[0];
}

function getDeployCapacity() {
  const ship = getActiveShip();
  return ship?.capacity || 12;
}

function getReserveCapacity() {
  const owned = getAllUnits().length;
  return Math.max(50, Math.ceil(owned / 5) * 5);
}

function getTeamCounts(units) {
  const counts = {};
  units.forEach((u) => {
    if (!u.team) return;
    counts[u.team] = (counts[u.team] || 0) + 1;
  });
  return counts;
}

function isTeamEffectActive(unit, teamCounts) {
  if (!unit.team) return false;
  return (teamCounts[unit.team] || 0) >= 2;
}

function moveUnitDeployment(unitId, toDeployed) {
  const unit = getUnitById(unitId);
  if (!unit) return;
  unit.deployed = !!toDeployed;
}

function getItemById(itemId) {
  return state.inventory.find((it) => it.id === itemId) || null;
}

function getHeroById(heroId) {
  return state.heroes.find((h) => h.id === heroId) || null;
}

function getEquippedItemById(itemId) {
  for (const h of state.heroes) {
    const list = [h.equippedMelee, h.equippedFirearm, h.equippedDefense, ...(h.equippedGears || [])].filter(Boolean);
    const found = list.find((x) => x.id === itemId);
    if (found) return found;
  }
  return null;
}

function calculateUnitStats(unit) {
  let atk = unit.atk || 0;
  let def = unit.def || 0;
  let hp = unit.hp || 0;
  let speed = unit.speed || 0;
  const add = (it) => {
    if (!it) return;
    atk += it.atk || 0;
    def += it.def || 0;
    hp += it.hp || 0;
    speed += it.speed || 0;
  };
  add(unit.equippedMelee);
  add(unit.equippedFirearm);
  add(unit.equippedDefense);
  (unit.equippedGears || []).forEach(add);

  const firearm = unit.equippedFirearm;
  if (firearm && firearm.slotType === "firearm" && firearm.weaponType !== "RL") {
    const wanted = firearmForRange(unit.rangeClass);
    if (wanted === "AR/LMG") {
      if (["AR", "LMG"].includes(firearm.weaponType)) atk = Math.round(atk * 1.22);
      else atk = Math.round(atk * 0.88);
    } else if (firearm.weaponType === wanted) {
      atk = Math.round(atk * 1.25);
    } else {
      atk = Math.round(atk * 0.86);
    }
  }

  const defenseCd = unit.equippedDefense?.cooldown || 0;
  const cdr = Math.min(0.35, (unit.equippedGears || []).reduce((a, g) => a + (g.cdr || 0), 0));
  return { atk, def, hp, speed, defenseCd: Number((defenseCd * (1 - cdr)).toFixed(2)) };
}

function calculateUnitStatsWithTeam(unit, teamCounts) {
  const s = calculateUnitStats(unit);
  if (!isTeamEffectActive(unit, teamCounts)) return s;
  if (unit.team === "議곕뵒??) return { ...s, atk: Math.round(s.atk * 1.06), speed: Math.round(s.speed * 1.08) };
  if (unit.team === "?덊븯??) return { ...s, hp: Math.round(s.hp * 1.12), speed: Math.round(s.speed * 1.1) };
  if (unit.team === "寃뚰떚??) return { ...s, atk: Math.round(s.atk * 1.09), def: Math.round(s.def * 1.08) };
  if (unit.team === "?섎━硫섑깉") return { ...s, atk: Math.round(s.atk * 1.08), hp: Math.round(s.hp * 1.08) };
  return s;
}

function equipItemToHero(heroId, itemId) {
  const hero = getHeroById(heroId);
  const item = getItemById(itemId);
  if (!hero || !item) return;
  if (item.slotType === "melee") {
    if (hero.equippedMelee) state.inventory.push(hero.equippedMelee);
    hero.equippedMelee = item;
  } else if (item.slotType === "firearm") {
    if (hero.equippedFirearm) state.inventory.push(hero.equippedFirearm);
    hero.equippedFirearm = item;
  } else if (item.slotType === "defense") {
    if (!hero.canUseDefense) {
      alert("???좊떅? 諛⑹뼱 臾댁옣???μ갑?????놁뒿?덈떎.");
      return;
    }
    if (hero.equippedDefense) state.inventory.push(hero.equippedDefense);
    hero.equippedDefense = item;
  } else {
    if (!Array.isArray(hero.equippedGears)) hero.equippedGears = [];
    if (hero.equippedGears.length >= 2) {
      state.inventory.push(hero.equippedGears.shift());
    }
    hero.equippedGears.push(item);
  }
  state.inventory = state.inventory.filter((it) => it.id !== item.id);
}

function unequipFromHero(heroId, slotKey) {
  const hero = getHeroById(heroId);
  if (!hero) return;
  if (slotKey === "equippedGears") {
    if (!hero.equippedGears?.length) return;
    hero.equippedGears.forEach((g) => state.inventory.push(g));
    hero.equippedGears = [];
    return;
  }
  if (!hero[slotKey]) return;
  state.inventory.push(hero[slotKey]);
  hero[slotKey] = null;
}

function getHeroSlotItem(hero, slotKey) {
  if (!hero) return null;
  if (slotKey === "melee") return hero.equippedMelee || null;
  if (slotKey === "firearm") return hero.equippedFirearm || null;
  if (slotKey === "defense") return hero.equippedDefense || null;
  if (slotKey === "gear1") return hero.equippedGears?.[0] || null;
  if (slotKey === "gear2") return hero.equippedGears?.[1] || null;
  return null;
}

function setHeroSlotItem(hero, slotKey, item) {
  if (!hero) return;
  if (slotKey === "melee") hero.equippedMelee = item || null;
  else if (slotKey === "firearm") hero.equippedFirearm = item || null;
  else if (slotKey === "defense") hero.equippedDefense = item || null;
  else if (slotKey === "gear1") {
    if (!Array.isArray(hero.equippedGears)) hero.equippedGears = [];
    hero.equippedGears[0] = item || null;
  } else if (slotKey === "gear2") {
    if (!Array.isArray(hero.equippedGears)) hero.equippedGears = [];
    hero.equippedGears[1] = item || null;
  }
}

function slotPlaceholderIcon(slotKey) {
  if (slotKey === "melee") return createItemIcon("洹쇱젒", "#4b334f");
  if (slotKey === "firearm") return createItemIcon("珥앷린", "#2d4d5f");
  if (slotKey === "defense") return createItemIcon("諛⑹뼱", "#4a3f2b");
  return createItemIcon("?λ퉬", "#2f5a3a");
}

function renderHeroEquipMini(hero) {
  const slots = [
    { key: "melee", item: hero.equippedMelee },
    { key: "firearm", item: hero.equippedFirearm },
    { key: "defense", item: hero.canUseDefense ? hero.equippedDefense : null, disabled: !hero.canUseDefense },
    { key: "gear1", item: hero.equippedGears?.[0] || null },
    { key: "gear2", item: hero.equippedGears?.[1] || null },
  ];
  return `<div class="equip-mini-row">
    ${slots
      .map((s) => {
        if (s.disabled) return `<span class="equip-mini disabled">-</span>`;
        const src = s.item?.icon || slotPlaceholderIcon(s.key);
        const alt = s.item?.name || s.key;
        return `<span class="equip-mini"><img src="${src}" alt="${alt}" title="${alt}"/></span>`;
      })
      .join("")}
  </div>`;
}

function unequipHeroSlot(heroId, slotKey) {
  const hero = getHeroById(heroId);
  if (!hero) return;
  const current = getHeroSlotItem(hero, slotKey);
  if (!current) return;
  state.inventory.push(current);
  setHeroSlotItem(hero, slotKey, null);
  if (Array.isArray(hero.equippedGears)) {
    hero.equippedGears = hero.equippedGears.filter(Boolean);
  }
}

function itemFitsSlot(item, slotKey, hero) {
  if (!item || !slotKey || !hero) return false;
  if (slotKey === "melee") return item.slotType === "melee";
  if (slotKey === "firearm") return item.slotType === "firearm";
  if (slotKey === "defense") return item.slotType === "defense" && hero.canUseDefense;
  if (slotKey === "gear1" || slotKey === "gear2") return item.slotType === "gear";
  return false;
}

function clearEquipHighlights() {
  ui.baseContent.querySelectorAll(".slot-highlight").forEach((el) => el.classList.remove("slot-highlight"));
  ui.baseContent.querySelectorAll(".item-highlight").forEach((el) => el.classList.remove("item-highlight"));
}

function applyEquipHighlightsForItem(itemId) {
  clearEquipHighlights();
  const item = getItemById(itemId);
  const hero = getHeroById(state.hqSelectedHeroId);
  if (!item || !hero) return;
  ui.baseContent.querySelectorAll("[data-equip-slot]").forEach((slotEl) => {
    const slotKey = slotEl.getAttribute("data-equip-slot");
    const heroId = slotEl.getAttribute("data-hero-id");
    const targetHero = getHeroById(heroId || state.hqSelectedHeroId);
    if (slotKey && targetHero && itemFitsSlot(item, slotKey, targetHero)) {
      slotEl.classList.add("slot-highlight");
    }
  });
}

function applyInventoryHighlight() {
  clearEquipHighlights();
  const inv = ui.baseContent.querySelector(".inventory-drop");
  if (inv) inv.classList.add("item-highlight");
}

function equipItemToHeroSlot(heroId, itemId, slotKey) {
  const hero = getHeroById(heroId);
  const item = getItemById(itemId);
  if (!hero || !item) return;
  if (!itemFitsSlot(item, slotKey, hero)) {
    alert("?대떦 ?щ’???μ갑?????녿뒗 ?꾩씠?쒖엯?덈떎.");
    return;
  }
  const old = getHeroSlotItem(hero, slotKey);
  if (old) state.inventory.push(old);
  setHeroSlotItem(hero, slotKey, item);
  state.inventory = state.inventory.filter((it) => it.id !== item.id);
  if (Array.isArray(hero.equippedGears)) {
    hero.equippedGears = hero.equippedGears.filter(Boolean);
  }
}

function openUnitDetail(unitId) {
  const unit = getUnitById(unitId);
  if (!unit || !ui.unitDetailModal) return;
  state.selectedUnitDetailId = unitId;
  const s = calculateUnitStats(unit);
  const deployed = getAllUnits().filter((u) => u.deployed);
  const teamCounts = getTeamCounts(deployed);
  const teamActive = isTeamEffectActive(unit, teamCounts);
  const rangeColor = RANGE_META[unit.rangeClass]?.color || "#9a9a9a";
  if (ui.unitDetailTitle) ui.unitDetailTitle.textContent = `${unit.name} ?곸꽭 ?뺣낫`;
  if (ui.unitDetailBody) {
    ui.unitDetailBody.innerHTML = `
      <div class="base-card">
        <div>遺꾨쪟: ${unit.unitType === "merc" ? "?⑸퀝" : "?덉뼱濡?} / ??븷援? ${unit.roleClass || unit.classType || "-"}</div>
        <div>?ш굅由? <span class="range-chip" style="background:${rangeColor}">${unit.rangeClass || "-"}</span></div>
        <div>?띿꽦: ${unit.attribute || "臾쇰━"} (${ATTRIBUTE_META[(unit.attribute || "臾쇰━").split("/")[0]]?.effect || "-"})</div>
        <div>?덈꺼: ${unit.level || 1}</div>
        <div>怨듦꺽??${s.atk} / 諛⑹뼱??${s.def} / 泥대젰 ${s.hp} / ?ㅽ뵾??${s.speed}</div>
        <div>怨좎쑀 ?λ젰: ${unit.ability || "-"}</div>
      </div>
      <div class="base-card">
        <strong>?</strong>
        <div>${unit.team || "臾댁냼??}</div>
        <div>?명듃 ?④낵: ${unit.teamEffect || "?놁쓬"}</div>
        <div>?꾩옱 諛쒕룞 ?곹깭: ${teamActive ? "諛쒕룞 以? : "鍮꾪솢??媛숈? ? 2???댁긽 異쒓꺽 ?꾩슂)"}</div>
      </div>
      <div class="base-card">
        <strong>?μ갑 ?뺣낫</strong>
        ${
          unit.unitType === "hero"
            ? `<div>洹쇱젒: ${unit.equippedMelee?.name || "?놁쓬"}</div>
               <div>珥앷린: ${unit.equippedFirearm?.name || "?놁쓬"}</div>
               <div>諛⑹뼱: ${unit.equippedDefense?.name || "?놁쓬"}</div>
               <div>?λ퉬1: ${unit.equippedGears?.[0]?.name || "?놁쓬"}</div>
               <div>?λ퉬2: ${unit.equippedGears?.[1]?.name || "?놁쓬"}</div>`
            : `<div>洹쇱젒: ${unit.equippedMelee?.name || "-"}</div>
               <div>珥앷린: ${unit.equippedFirearm?.name || "-"}</div>
               <div>諛⑹뼱: ${unit.equippedDefense?.name || "-"}</div>
               <div>?쒕뜡 ?λ퉬 ?명듃: ${unit.randomLoadout || "-"}</div>`
        }
      </div>
    `;
  }
  const upBtn = document.getElementById("unitUpgradeBtn");
  if (upBtn) {
    const cost = 180 + (unit.level || 1) * 120;
    upBtn.textContent = `媛뺥솕 (${cost} ?щ젅??`;
    upBtn.disabled = false;
  }
  ui.unitDetailModal.classList.remove("hidden");
}

function closeUnitDetail() {
  if (!ui.unitDetailModal) return;
  ui.unitDetailModal.classList.add("hidden");
}

function openItemDetail(itemId) {
  const item = getItemById(itemId) || getEquippedItemById(itemId);
  if (!item || !ui.itemDetailModal) return;
  state.selectedItemDetailId = itemId;
  if (ui.itemDetailTitle) ui.itemDetailTitle.textContent = `${item.name} ?뺣낫`;
  if (ui.itemDetailBody) {
    ui.itemDetailBody.innerHTML = `
      <div class="base-card">
        <div>遺꾨쪟: ${item.mainType || (item.itemKind === "weapon" ? "臾닿린" : "?λ퉬")} - ${item.subType || "-"}</div>
        <div>怨?${item.atk || 0} / 諛?${item.def || 0} / 泥?${item.hp || 0} / ??${item.speed || 0}</div>
        ${item.range ? `<div>?ш굅由? ${item.range}</div>` : ""}
        ${item.attackSpeed ? `<div>怨듦꺽 ?띾룄: ${item.attackSpeed}</div>` : ""}
        ${item.block ? `<div>諛⑹뼱?? ${item.block} / 踰붿쐞: ${item.blockRadius || 0} / 荑? ${item.cooldown || 0}s</div>` : ""}
        ${item.cdr ? `<div>?ㅽ궗 荑⑦???媛먯냼: ${Math.round(item.cdr * 100)}%</div>` : ""}
        <div>?뱀쭠: ${item.trait || "-"}</div>
        <div>${item.description || ""}</div>
      </div>
    `;
  }
  ui.itemDetailModal.classList.remove("hidden");
}

function closeItemDetail() {
  if (!ui.itemDetailModal) return;
  ui.itemDetailModal.classList.add("hidden");
}

function upgradeUnit(unitId) {
  const unit = getUnitById(unitId);
  if (!unit) return;
  const level = unit.level || 1;
  const cost = 180 + level * 120;
  if (!spendCredits(cost)) {
    alert("?щ젅??遺議?);
    return;
  }
  unit.level = level + 1;
  unit.atk += 2;
  unit.def += 1;
  unit.hp += 10;
  unit.speed += 0.5;
  updateTopbar();
  openUnitDetail(unitId);
}

function addRewards(credit, resource, ratio = 1) {
  if (state.settings.infinite) return;
  state.credits += Math.round(credit * ratio);
  state.resources += Math.round(resource * ratio);
}

function replaceQuestById(id) {
  const idx = state.quests.findIndex((q) => q.id === id);
  if (idx < 0) return;
  state.quests[idx] = createNormalQuest(state.questCounter);
  state.questCounter += 1;
}

function completeQuestById(id) {
  const q = state.quests.find((x) => x.id === id);
  if (!q) return;
  addRewards(q.rewardCredit, q.rewardResource, 1);
  replaceQuestById(id);
  updateTopbar();
}

function rerollQuestById(id) {
  const q = state.quests.find((x) => x.id === id);
  if (!q) return;
  const cost = 120 + q.stars * 45;
  if (!spendCredits(cost)) {
    alert("?щ젅??遺議?);
    return;
  }
  replaceQuestById(id);
  updateTopbar();
}

function completeEmergencyQuest() {
  if (!state.emergencyQuest) return;
  addRewards(state.emergencyQuest.rewardCredit, state.emergencyQuest.rewardResource, 1);
  state.emergencyQuest = null;
  updateTopbar();
}

function trySpawnEmergencyQuest() {
  if (state.emergencyQuest) return;
  if (Math.random() < 0.35) {
    state.emergencyQuest = createEmergencyQuest(state.questCounter);
    state.questCounter += 1;
  }
}

function updateEmergencyQuestStatus() {
  if (!state.emergencyQuest) {
    if (ui.emergencyToast) ui.emergencyToast.classList.add("hidden");
    return;
  }
  const remain = state.emergencyQuest.expiresAt - Date.now();
  if (remain <= 0) {
    addRewards(state.emergencyQuest.rewardCredit, state.emergencyQuest.rewardResource, 0.3);
    state.emergencyQuest = null;
    updateTopbar();
    saveState();
    if (ui.emergencyToast) ui.emergencyToast.classList.add("hidden");
    if (!ui.facilityModal.classList.contains("hidden") && state.baseTab === "hq" && state.hqView === "quests") {
      renderFacilityContent("hq");
    }
    return;
  }
  if (ui.emergencyToast) ui.emergencyToast.classList.remove("hidden");
  if (ui.emergencyToastTimer) {
    ui.emergencyToastTimer.textContent = `?⑥? ?쒓컙: ${formatDuration(remain)}`;
  }
}

function renderFacilityContent(tab) {
  let html = "";
  if (tab === "hq") {
    const squad = [...state.heroes, ...state.mercs];
    html += `<div class="row">
      <button data-hq-view="quests" ${state.hqView === "quests" ? "disabled" : ""}>?섏뒪??/button>
      <button data-hq-view="squad" ${state.hqView === "squad" ? "disabled" : ""}>異쒓꺽 ?몄썝</button>
      <button data-hq-view="gear" ${state.hqView === "gear" ? "disabled" : ""}>?λ퉬 諛?臾닿린</button>
    </div>`;

    if (state.hqView === "quests") {
      html += `<div class="base-card"><strong>?섏뒪??愿由?/strong><div>?쇰컲 ?섏뒪??10媛쒓? ?좎??섎ŉ, ?꾨즺 ?????섏뒪?멸? 利됱떆 蹂댁땐?⑸땲??</div></div>`;
      if (state.emergencyQuest) {
        const remain = Math.max(0, state.emergencyQuest.expiresAt - Date.now());
        html += `<div class="base-card quest-emergency">
          <strong>湲닿툒 ?섏뒪??(理쒖슦??</strong>
          <div>${state.emergencyQuest.title}</div>
          <div>?쒖씠?? ${"??.repeat(state.emergencyQuest.stars)} (${state.emergencyQuest.stars}??</div>
          <div>蹂댁긽: ?щ젅??${state.emergencyQuest.rewardCredit} / ?먯썝 ${state.emergencyQuest.rewardResource}</div>
          <div>?⑥? ?쒓컙: ${formatDuration(remain)}</div>
          <button data-action="complete-emergency">湲닿툒 ?섏뒪???꾨즺 泥섎━</button>
        </div>`;
      }
      html += `<div class="quest-list">`;
      state.quests.forEach((q, idx) => {
        const cost = 120 + q.stars * 45;
        html += `<div class="base-card quest-card">
          <div><strong>${idx + 1}. ${q.title}</strong></div>
          <div>?쒖씠?? ${"??.repeat(q.stars)} (${q.stars}??</div>
          <div>蹂댁긽: ?щ젅??${q.rewardCredit} / ?먯썝 ${q.rewardResource}</div>
          <div class="row">
            <button data-action="complete-quest" data-id="${q.id}">?꾨즺</button>
            <button data-action="reroll-quest" data-id="${q.id}">援먯껜 (${cost} ?щ젅??</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    if (state.hqView === "squad") {
      const deployed = squad.filter((u) => u.deployed);
      const reserveAll = squad.filter((u) => !u.deployed);
      const reserve = reserveAll.filter(unitMatchesReserveFilter);
      const deployCap = getDeployCapacity();
      const reserveCap = getReserveCapacity();
      const card = (u) => {
        const rangeColor = RANGE_META[u.rangeClass]?.color || "#9a9a9a";
        return `<div class="unit-card" draggable="true" data-unit-id="${u.id}">
          <div class="card-q q-tl"><img src="${getClassMarkImage(u)}" alt="?대옒??留덊겕" /></div>
          <div class="card-q q-tr"><img src="${getPortraitImage(u)}" alt="?몄썝 ?대?吏" /></div>
          <div class="card-q q-bl"><img src="${getAbilityImage(u)}" alt="?λ젰 ?대?吏" /></div>
          <div class="card-q q-br">
            <strong>${u.name}</strong>
            <span>${u.unitType === "merc" ? "?⑸퀝" : "?덉뼱濡?}</span>
            <span class="range-pill" style="background:${rangeColor}">${u.rangeClass || "-"}</span>
            <span class="role-pill">${u.roleClass || "-"}</span>
          </div>
        </div>`;
      };
      const renderSlots = (units, cap) => {
        let slotHtml = "";
        for (let i = 0; i < cap; i += 1) {
          if (units[i]) slotHtml += `<div class="unit-slot filled">${card(units[i])}</div>`;
          else slotHtml += `<div class="unit-slot empty"></div>`;
        }
        return slotHtml;
      };
      html += `<div class="base-card"><strong>異쒓꺽 ?몄썝 諛곗튂</strong><div>移대뱶瑜??쒕옒洹명빐 諛곗튂?⑸땲?? 湲곕낯 ?щ’? 5x10?대ŉ, 蹂댁쑀 ?몄썝 援ъ뿭? ?몄썝 ?섏뿉 ?곕씪 ?뺤옣?⑸땲??</div></div>`;
      html += `<div class="base-card">
        <strong>蹂댁쑀 ?몄썝 遺꾨쪟</strong>
        <div class="row">
          <label>?대옒??/label>
          <select data-filter-key="roleClass">
            <option value="all" ${state.hqReserveFilter.roleClass === "all" ? "selected" : ""}>?꾩껜</option>
            ${ROLE_ORDER.map((r) => `<option value="${r}" ${state.hqReserveFilter.roleClass === r ? "selected" : ""}>${r}</option>`).join("")}
          </select>
          <label>?띿꽦</label>
          <select data-filter-key="attribute">
            <option value="all" ${state.hqReserveFilter.attribute === "all" ? "selected" : ""}>?꾩껜</option>
            ${ATTR_ORDER.map((a) => `<option value="${a}" ${state.hqReserveFilter.attribute === a ? "selected" : ""}>${a}</option>`).join("")}
          </select>
          <label>?ш굅由?/label>
          <select data-filter-key="rangeClass">
            <option value="all" ${state.hqReserveFilter.rangeClass === "all" ? "selected" : ""}>?꾩껜</option>
            ${RANGE_ORDER.map((r) => `<option value="${r}" ${state.hqReserveFilter.rangeClass === r ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </div>
      </div>`;
      html += `<div class="squad-layout">
        <div class="squad-zone" data-drop-zone="deployed">
          <h4>異쒓꺽 ?몄썝 (?쇱そ) ${deployed.length}/${deployCap} - ?곗＜?? ${getActiveShip().name}</h4>
          <div class="unit-scroll" data-scroll-zone="deployed">
            <div class="unit-grid">${renderSlots(deployed, deployCap)}</div>
          </div>
        </div>
        <div class="squad-zone" data-drop-zone="reserve">
          <h4>蹂댁쑀 ?몄썝 (?ㅻⅨ履? ?꾪꽣 ${reserve.length}紐?/ ?꾩껜 ${reserveAll.length}紐?/ ?щ’ ${reserveCap}</h4>
          <div class="unit-scroll" data-scroll-zone="reserve">
            <div class="unit-grid">${renderSlots(reserve, reserveCap)}</div>
          </div>
        </div>
      </div>`;
    }

    if (state.hqView === "gear") {
      const selectedHero = getHeroById(state.hqSelectedHeroId) || state.heroes[0];
      if (selectedHero) state.hqSelectedHeroId = selectedHero.id;
      const slotCard = (slotKey, label) => {
        const it = getHeroSlotItem(selectedHero, slotKey);
        const canDrop = slotKey !== "defense" || selectedHero?.canUseDefense;
        const dis = canDrop ? "" : " disabled-slot";
        if (!it) {
          return `<div class="equip-slot${dis}" data-equip-slot="${slotKey}" data-hero-id="${selectedHero?.id || ""}">
            <div class="slot-title">${label}</div>
            <div class="slot-empty">${canDrop ? "?쒕옒洹??μ갑" : "?μ갑 遺덇?"}</div>
          </div>`;
        }
        return `<div class="equip-slot filled${dis}" data-equip-slot="${slotKey}" data-hero-id="${selectedHero?.id || ""}">
          <div class="slot-title">${label}</div>
          <div class="equipped-item" draggable="true" data-equipped-id="${it.id}" data-hero-id="${selectedHero?.id || ""}" data-slot-key="${slotKey}">
            <img src="${it.icon}" alt="icon"/>
            <div><strong>${it.name}</strong><div>${it.mainType}/${it.subType}</div></div>
          </div>
        </div>`;
      };
      html += `<div class="base-card"><strong>?λ퉬 諛?臾닿린</strong><div>?덉뼱濡쒕뒗 洹쇱젒/珥앷린 2臾댁옣 + (媛?μ떆 諛⑹뼱臾댁옣) + ?λ퉬 2移몄쓣 ?ъ슜?⑸땲?? 移대뱶 ?대┃ ???뺣낫 ?뺤씤, ?쒕옒洹몃줈 諛곗튂 媛?ν빀?덈떎.</div></div>`;
      html += `<div class="gear-layout">
        <div class="base-card hero-slot-area" data-drop-hero="${state.hqSelectedHeroId || ""}">
          <h4>?덉뼱濡?紐⑸줉</h4>
          <div class="hero-grid">
            ${state.heroes
              .map((h) => {
                const selected = h.id === state.hqSelectedHeroId ? " selected-hero" : "";
                const s = calculateUnitStats(h);
                return `<button class="hero-select${selected}" data-action="select-hero" data-id="${h.id}">
                  <strong>${h.name}</strong>
                  <div>怨?${s.atk} / 諛?${s.def} / 泥?${s.hp} / ??${s.speed}</div>
                  <div>?λ젰: ${h.ability || "-"}</div>
                  ${renderHeroEquipMini(h)}
                </button>`;
              })
              .join("")}
          </div>
          <div class="row">
            <button data-action="unequip-melee" data-id="${state.hqSelectedHeroId}">洹쇱젒 ?댁젣</button>
            <button data-action="unequip-firearm" data-id="${state.hqSelectedHeroId}">珥앷린 ?댁젣</button>
            <button data-action="unequip-defense" data-id="${state.hqSelectedHeroId}">諛⑹뼱 ?댁젣</button>
            <button data-action="unequip-gears" data-id="${state.hqSelectedHeroId}">?λ퉬 ?댁젣</button>
          </div>
          <div class="equip-board">
            ${slotCard("melee", "洹쇱젒 臾댁옣")}
            ${slotCard("firearm", "珥앷린 臾댁옣")}
            ${slotCard("defense", "諛⑹뼱 臾댁옣")}
            ${slotCard("gear1", "?λ퉬 ?щ’ 1")}
            ${slotCard("gear2", "?λ퉬 ?щ’ 2")}
          </div>
        </div>
        <div class="base-card inventory-drop" data-drop-inventory="1">
          <h4>蹂댁쑀 ?λ퉬/臾닿린</h4>
          <div class="item-grid">
            ${
              state.inventory.length
                ? state.inventory
                    .map(
                      (it) => `<div class="item-card" draggable="true" data-item-id="${it.id}">
                  <div class="item-head"><img src="${it.icon || createItemIcon("IT")}" alt="item"/><strong>${it.name}</strong></div>
                  <div>${it.mainType || "-"} / ${it.subType || "-"}</div>
                  <div>怨?${it.atk || 0} 諛?${it.def || 0} 泥?${it.hp || 0} ??${it.speed || 0}</div>
                  <div class="row">
                    <button data-action="item-info" data-id="${it.id}">?뺣낫</button>
                    <button data-action="equip-item" data-id="${it.id}">${selectedHero ? selectedHero.name : "?덉뼱濡?} ?μ갑</button>
                  </div>
                  <div class="drag-tag" data-item-id="${it.id}">?쒕옒洹??μ갑</div>
                </div>`,
                    )
                    .join("")
                : `<div class="base-card">蹂댁쑀 ?몃깽?좊━媛 ?놁뒿?덈떎.</div>`
            }
          </div>
        </div>
      </div>`;
    }
  }
  if (tab === "factory") {
    html += `<div class="base-card"><strong>怨듭옣 Lv.${state.factoryLevel}</strong><div>臾닿린/?λ퉬 ?곌뎄 ?띾룄 +${state.factoryLevel * 8}%</div></div>`;
    html += `<button data-action="upgrade-factory">怨듭옣 ?낃렇?덉씠??(鍮꾩슜 ${state.factoryLevel * 500} ?щ젅??</button>`;
    html += `<div class="base-card">?앹궛 ?щ’(媛꾩냼??: 湲곕낯 ?λ퉬 1媛??앹궛 媛??/div>`;
  }
  if (tab === "plant") {
    html += `<div class="base-card"><strong>諛쒖쟾??Lv.${state.powerPlantLevel}</strong><div>?뺤궛 ???먯썝 +${
      120 * state.powerPlantLevel
    }, ?꾨젰 +${25 * state.powerPlantLevel}</div></div>`;
    html += `<button data-action="collect-plant">?앹궛臾??섎졊</button>`;
  }
  if (tab === "market") {
    html += `<div class="base-card"><strong>?좎엯/?⑸퀝 怨좎슜</strong></div>`;
    MERC_POOL.forEach((m) => {
      const hired = state.mercs.some((x) => x.sourceId === m.id);
      html += `<div class="base-card">${m.name} (${m.rank}) 怨꾩빟湲?${m.contract}
      <div>怨?${m.atk} / 諛?${m.def} / 泥?${m.hp} / ??${m.speed}</div>
      <div>怨좎쑀 ?λ젰: ${m.ability}</div>
      <button data-action="hire-merc" data-id="${m.id}" ${hired ? "disabled" : ""}>${hired ? "怨좎슜?? : "怨좎슜"}</button></div>`;
    });
    if (state.mercs.length) {
      html += `<div class="base-card"><strong>怨좎슜 以??⑸퀝</strong>`;
      state.mercs.forEach((m) => {
        const refund = Math.floor(m.contract * 0.8);
        html += `<div>${m.name} / 怨꾩빟湲?${m.contract} / ?댁? ?섍툒 ${refund}
        <button data-action="fire-merc" data-id="${m.id}">怨꾩빟 ?댁?</button></div>`;
      });
      html += `</div>`;
    }
  }
  if (tab === "black") {
    html += `<div class="base-card"><strong>釉붾옓 留덉폆 ?꾨━誘몄뾼</strong><div>踰좏뀒???몃젰, ?꾩꽕 ?λ퉬, 怨좉툒 ?먯썝 嫄곕옒</div></div>`;
    html += `<div class="base-card">?꾩꽕 臾닿린 ?⑦궎吏 - 2200 ?щ젅??<button data-action="buy-legend">援щℓ</button></div>`;
    html += `<div class="base-card"><strong>?ы쉷 鍮뚮윴 嫄곕옒</strong>`;
    if (!state.capturedVillains.length) html += `<div>?섍컧??鍮뚮윴???놁뒿?덈떎.</div>`;
    state.capturedVillains.forEach((v) => {
      html += `<div>${v.name} / ?쒖꽭 ${v.value}
      <button data-action="sell-villain" data-id="${v.id}">?먮ℓ</button></div>`;
    });
    html += `</div>`;
  }
  if (tab === "hangar") {
    html += `<div class="base-card"><strong>寃⑸궔怨?/strong><div>?좏깮???곗＜?좎쓽 ?섏슜 ?몄썝??異쒓꺽 ?몄썝 理쒕?移섍? ?⑸땲??</div></div>`;
    state.hangarShips.forEach((s) => {
      html += `<div class="base-card">
        <strong>${s.name}</strong>
        <div>理쒕? 異쒓꺽 ?몄썝: ${s.capacity}</div>
        <div>?곹깭: ${s.unlocked ? "?댁슜 媛?? : "誘명빐湲?}</div>
        <button data-action="select-ship" data-id="${s.id}" ${!s.unlocked || state.activeShipId === s.id ? "disabled" : ""}>
          ${state.activeShipId === s.id ? "?좏깮?? : "異쒓꺽 ?곗＜?좎쑝濡??좏깮"}
        </button>
      </div>`;
    });
  }
  if (tab === "prison") {
    html += `<div class="base-card"><strong>?섍컧??/strong></div>`;
    if (!state.capturedVillains.length) {
      html += `<div class="base-card">?꾩옱 ?섍컧 以묒씤 鍮뚮윴???놁뒿?덈떎.</div>`;
    } else {
      state.capturedVillains.forEach((v) => {
        html += `<div class="base-card">${v.name} / 紐멸컪 ${v.value}
        <button data-action="release-villain" data-id="${v.id}">?앸갑(?щ젅??+50)</button></div>`;
      });
    }
  }
  ui.baseContent.innerHTML = html;
}

function openFacilityModal(facilityId) {
  state.baseTab = facilityId;
  if (facilityId === "hq") state.hqView = "quests";
  const info = FACILITY_INFO[facilityId];
  if (info && ui.facilityTitle) ui.facilityTitle.textContent = info.name;
  renderFacilityContent(facilityId);
  ui.facilityModal.classList.remove("hidden");
}

function closeFacilityModal() {
  ui.facilityModal.classList.add("hidden");
  ui.baseContent.innerHTML = "";
  closeUnitDetail();
  closeItemDetail();
}

function renderBase() {
  setBaseInfo("hangar");
}

function spendCredits(cost) {
  if (state.settings.infinite) return true;
  if (state.credits < cost) return false;
  state.credits -= cost;
  return true;
}

function syncSettingsForm() {
  document.getElementById("soundToggle").checked = state.settings.sound;
  document.getElementById("languageSelect").value = state.settings.language;
  document.getElementById("difficultySelect").value = state.settings.difficulty;
  document.getElementById("godModeToggle").checked = state.settings.godMode;
  document.getElementById("infiniteToggle").checked = state.settings.infinite;
}

function setMainMenuHelp(title, desc) {
  if (!ui.mainMenuHelp) return;
  const h3 = ui.mainMenuHelp.querySelector("h3");
  const p = ui.mainMenuHelp.querySelector("p");
  if (h3) h3.textContent = title;
  if (p) p.textContent = desc;
}

function bindMainMenuHelp() {
  const menuButtons = document.querySelectorAll("#screen-main .menu button");
  menuButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      const title = btn.dataset.helpTitle || MAIN_MENU_DEFAULT_HELP.title;
      const desc = btn.dataset.helpDesc || MAIN_MENU_DEFAULT_HELP.desc;
      setMainMenuHelp(title, desc);
    });
    btn.addEventListener("focus", () => {
      const title = btn.dataset.helpTitle || MAIN_MENU_DEFAULT_HELP.title;
      const desc = btn.dataset.helpDesc || MAIN_MENU_DEFAULT_HELP.desc;
      setMainMenuHelp(title, desc);
    });
  });

  const menuWrap = document.querySelector("#screen-main .menu");
  if (menuWrap) {
    menuWrap.addEventListener("mouseleave", () => {
      setMainMenuHelp(MAIN_MENU_DEFAULT_HELP.title, MAIN_MENU_DEFAULT_HELP.desc);
    });
  }

  setMainMenuHelp(MAIN_MENU_DEFAULT_HELP.title, MAIN_MENU_DEFAULT_HELP.desc);
}

function bindEvents() {
  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.dataset.go));
  });

  document.getElementById("planetOpenBtn").addEventListener("click", openPlanetModal);
  document.getElementById("planetCloseBtn").addEventListener("click", closePlanetModal);
  document.getElementById("startMissionBtn").addEventListener("click", startMission);
  document.getElementById("retreatBtn").addEventListener("click", () => endMission(false, "泥좎닔"));

  ui.regionList.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const regionId = target.dataset.selectRegion;
    if (!regionId) return;
    state.selectedRegionId = regionId;
    saveState();
    renderSortie();
  });

  if (ui.baseMap) {
    ui.baseMap.querySelectorAll(".facility").forEach((facilityBtn) => {
      facilityBtn.addEventListener("mouseenter", () => {
        const facilityId = facilityBtn.dataset.facility;
        if (!facilityId) return;
        setBaseInfo(facilityId);
      });
      facilityBtn.addEventListener("focus", () => {
        const facilityId = facilityBtn.dataset.facility;
        if (!facilityId) return;
        setBaseInfo(facilityId);
      });
      facilityBtn.addEventListener("click", () => {
        const facilityId = facilityBtn.dataset.facility;
        if (!facilityId) return;
        setBaseInfo(facilityId);
        openFacilityModal(facilityId);
      });
    });
  }

  if (ui.facilityModal) {
    const closeBtn = document.getElementById("facilityCloseBtn");
    const exitBtn = document.getElementById("facilityExitBtn");
    if (closeBtn) closeBtn.addEventListener("click", closeFacilityModal);
    if (exitBtn) exitBtn.addEventListener("click", closeFacilityModal);
  }

  const udClose1 = document.getElementById("unitDetailCloseBtn");
  const udClose2 = document.getElementById("unitDetailCloseBtn2");
  const udUpgrade = document.getElementById("unitUpgradeBtn");
  const itemClose1 = document.getElementById("itemDetailCloseBtn");
  const itemClose2 = document.getElementById("itemDetailCloseBtn2");
  if (udClose1) udClose1.addEventListener("click", closeUnitDetail);
  if (udClose2) udClose2.addEventListener("click", closeUnitDetail);
  if (itemClose1) itemClose1.addEventListener("click", closeItemDetail);
  if (itemClose2) itemClose2.addEventListener("click", closeItemDetail);
  if (udUpgrade) {
    udUpgrade.addEventListener("click", () => {
      if (!state.selectedUnitDetailId) return;
      upgradeUnit(state.selectedUnitDetailId);
      renderFacilityContent(state.baseTab);
      saveState();
    });
  }

  ui.baseContent.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const hqView = target.dataset.hqView;
    if (hqView) {
      state.hqView = hqView;
      renderFacilityContent(state.baseTab);
      saveState();
      return;
    }
    const action = target.dataset.action;
    if (!action) return;
    const id = target.dataset.id;

    if (action === "complete-quest" && id) {
      completeQuestById(id);
    }

    if (action === "reroll-quest" && id) {
      rerollQuestById(id);
    }

    if (action === "complete-emergency") {
      completeEmergencyQuest();
      updateEmergencyQuestStatus();
    }

    if (action === "select-hero" && id) {
      state.hqSelectedHeroId = id;
    }

    if (action === "equip-item" && id) {
      if (!state.hqSelectedHeroId) {
        alert("?덉뼱濡쒕? 癒쇱? ?좏깮?섏꽭??");
      } else {
        equipItemToHero(state.hqSelectedHeroId, id);
      }
    }

    if (action === "item-info" && id) {
      openItemDetail(id);
    }

    if (action === "unequip-melee" && id) {
      unequipFromHero(id, "equippedMelee");
    }

    if (action === "unequip-firearm" && id) {
      unequipFromHero(id, "equippedFirearm");
    }

    if (action === "unequip-defense" && id) {
      unequipFromHero(id, "equippedDefense");
    }

    if (action === "unequip-gears" && id) {
      unequipFromHero(id, "equippedGears");
    }

    if (action === "toggle-deploy") {
      const all = [...state.heroes, ...state.mercs];
      const unit = all.find((x) => x.id === id);
      if (unit) unit.deployed = !unit.deployed;
    }

    if (action === "upgrade-factory") {
      const cost = state.factoryLevel * 500;
      if (!spendCredits(cost)) alert("?щ젅??遺議?);
      else state.factoryLevel += 1;
    }

    if (action === "collect-plant") {
      if (!state.settings.infinite) {
        state.resources += 120 * state.powerPlantLevel;
        state.power += 25 * state.powerPlantLevel;
      }
    }

    if (action === "select-ship" && id) {
      const ship = state.hangarShips.find((s) => s.id === id);
      if (ship && ship.unlocked) {
        state.activeShipId = ship.id;
        const deployCap = getDeployCapacity();
        const deployedUnits = getAllUnits().filter((u) => u.deployed);
        if (deployedUnits.length > deployCap) {
          for (let i = deployCap; i < deployedUnits.length; i += 1) {
            deployedUnits[i].deployed = false;
          }
        }
      }
    }

    if (action === "hire-merc") {
      const spec = MERC_POOL.find((m) => m.id === id);
      if (spec && !state.mercs.some((m) => m.sourceId === id)) {
        if (!spendCredits(spec.contract)) alert("?щ젅??遺議?);
        else {
          state.mercs.push({
            id: `merc-${Date.now()}`,
            sourceId: spec.id,
            name: spec.name,
            unitType: "merc",
            rank: spec.rank,
            contract: spec.contract,
            atk: spec.atk,
            def: spec.def,
            hp: spec.hp,
            speed: spec.speed,
            ability: spec.ability,
            roleClass: spec.roleClass,
            rangeClass: spec.rangeClass,
            attribute: spec.attribute,
            team: spec.team,
            teamEffect: TEAM_EFFECTS[spec.team] || "?놁쓬",
            classType: spec.classType,
            color: spec.color,
            weaponType: spec.weaponType,
            abilityIcon: spec.abilityIcon,
            level: 1,
            randomLoadout: MERC_LOADOUT_POOL[randInt(0, MERC_LOADOUT_POOL.length - 1)],
            deployed: false,
          });
        }
      }
    }

    if (action === "fire-merc") {
      const idx = state.mercs.findIndex((m) => m.id === id);
      if (idx >= 0) {
        const refund = Math.floor(state.mercs[idx].contract * 0.8);
        if (!state.settings.infinite) state.credits += refund;
        state.mercs.splice(idx, 1);
      }
    }

    if (action === "buy-legend") {
      if (!spendCredits(2200)) alert("?щ젅??遺議?);
      else state.inventory.push({ id: `lg-${Date.now()}`, name: "?꾩꽕 臾닿린 ?⑦궎吏" });
    }

    if (action === "sell-villain") {
      const idx = state.capturedVillains.findIndex((v) => v.id === id);
      if (idx >= 0) {
        if (!state.settings.infinite) state.credits += state.capturedVillains[idx].value;
        state.capturedVillains.splice(idx, 1);
      }
    }

    if (action === "release-villain") {
      const idx = state.capturedVillains.findIndex((v) => v.id === id);
      if (idx >= 0) {
        if (!state.settings.infinite) state.credits += 50;
        state.capturedVillains.splice(idx, 1);
      }
    }

    updateTopbar();
    renderFacilityContent(state.baseTab);
    saveState();
  });

  ui.baseContent.addEventListener("dragstart", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const equippedDrag = target.closest("[data-equipped-id]");
    if (equippedDrag) {
      const itemId = equippedDrag.dataset.equippedId;
      const heroId = equippedDrag.dataset.heroId;
      const slotKey = equippedDrag.dataset.slotKey;
      if (!itemId || !heroId || !slotKey) return;
      e.dataTransfer?.setData("text/equipped", JSON.stringify({ itemId, heroId, slotKey }));
      e.dataTransfer.effectAllowed = "move";
      applyInventoryHighlight();
      return;
    }
    const itemDrag = target.closest("[data-item-id]");
    if (itemDrag) {
      const itemId = itemDrag.dataset.itemId;
      if (!itemId) return;
      e.dataTransfer?.setData("text/item", itemId);
      e.dataTransfer.effectAllowed = "move";
      applyEquipHighlightsForItem(itemId);
      return;
    }
    const card = target.closest(".unit-card");
    if (!card) return;
    const unitId = card.dataset.unitId;
    if (!unitId) return;
    e.dataTransfer?.setData("text/plain", unitId);
    e.dataTransfer.effectAllowed = "move";
  });

  ui.baseContent.addEventListener("dragend", () => {
    clearEquipHighlights();
  });

  ui.baseContent.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest(".unit-card");
    if (!card) return;
    const unitId = card.dataset.unitId;
    if (!unitId) return;
    openUnitDetail(unitId);
  });

  ui.baseContent.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("button")) return;
    const equipped = target.closest("[data-equipped-id]");
    if (equipped) {
      const itemId = equipped.getAttribute("data-equipped-id");
      if (itemId) openItemDetail(itemId);
      return;
    }
    const card = target.closest(".item-card");
    if (!card) return;
    const infoBtn = card.querySelector("[data-action='item-info']");
    const itemId = infoBtn?.getAttribute("data-id");
    if (!itemId) return;
    openItemDetail(itemId);
  });

  ui.baseContent.addEventListener("dragover", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const zone = target.closest("[data-drop-zone]");
    const heroZone = target.closest(".hero-slot-area, .hero-select");
    const equipZone = target.closest("[data-equip-slot]");
    const invZone = target.closest("[data-drop-inventory]");
    if (!zone && !heroZone && !equipZone && !invZone) return;
    e.preventDefault();
  });

  ui.baseContent.addEventListener("drop", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const zone = target.closest("[data-drop-zone]");
    const itemId = e.dataTransfer?.getData("text/item");
    const equippedPayload = e.dataTransfer?.getData("text/equipped");

    if (equippedPayload) {
      e.preventDefault();
      let payload = null;
      try {
        payload = JSON.parse(equippedPayload);
      } catch (err) {
        payload = null;
      }
      if (payload) {
        const invDrop = target.closest("[data-drop-inventory]");
        if (invDrop) {
          unequipHeroSlot(payload.heroId, payload.slotKey);
          clearEquipHighlights();
          renderFacilityContent(state.baseTab);
          saveState();
          return;
        }
        const equipTarget = target.closest("[data-equip-slot]");
        if (equipTarget) {
          const heroId = equipTarget.getAttribute("data-hero-id");
          const slotKey = equipTarget.getAttribute("data-equip-slot");
          const fromHero = getHeroById(payload.heroId);
          const moved = fromHero ? getHeroSlotItem(fromHero, payload.slotKey) : null;
          if (heroId && slotKey && moved) {
            unequipHeroSlot(payload.heroId, payload.slotKey);
            // Move the same item into a new slot/hero.
            state.inventory.push(moved);
            equipItemToHeroSlot(heroId, moved.id, slotKey);
          }
          clearEquipHighlights();
          renderFacilityContent(state.baseTab);
          saveState();
          return;
        }
      }
    }

    if (itemId) {
      e.preventDefault();
      const equipTarget = target.closest("[data-equip-slot]");
      if (equipTarget) {
        const heroId = equipTarget.getAttribute("data-hero-id") || state.hqSelectedHeroId;
        const slotKey = equipTarget.getAttribute("data-equip-slot");
        if (heroId && slotKey) {
          equipItemToHeroSlot(heroId, itemId, slotKey);
          state.hqSelectedHeroId = heroId;
        }
      } else {
        const heroTarget = target.closest(".hero-select");
        const heroArea = target.closest(".hero-slot-area");
        const heroId = heroTarget?.dataset.id || heroArea?.dataset.dropHero || state.hqSelectedHeroId;
        if (heroId) {
          equipItemToHero(heroId, itemId);
          state.hqSelectedHeroId = heroId;
        }
      }
      renderFacilityContent(state.baseTab);
      saveState();
      clearEquipHighlights();
      return;
    }

    if (!zone) return;
    e.preventDefault();
    const unitId = e.dataTransfer?.getData("text/plain");
    if (!unitId) return;
    const to = zone.dataset.dropZone;
    if (to === "deployed") {
      const unit = getUnitById(unitId);
      if (unit?.deployed) {
        renderFacilityContent(state.baseTab);
        return;
      }
      const deployedCount = getAllUnits().filter((u) => u.deployed).length;
      if (deployedCount >= getDeployCapacity()) {
        alert("?꾩옱 ?곗＜???섏슜 ?몄썝??珥덇낵?덉뒿?덈떎.");
        return;
      }
      moveUnitDeployment(unitId, true);
    }
    if (to === "reserve") moveUnitDeployment(unitId, false);
    renderFacilityContent(state.baseTab);
    saveState();
    clearEquipHighlights();
  });

  ui.baseContent.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLSelectElement)) return;
    const key = target.dataset.filterKey;
    if (!key) return;
    if (!state.hqReserveFilter) state.hqReserveFilter = { roleClass: "all", attribute: "all", rangeClass: "all" };
    if (!["roleClass", "attribute", "rangeClass"].includes(key)) return;
    state.hqReserveFilter[key] = target.value;
    renderFacilityContent(state.baseTab);
    saveState();
  });

  ui.baseContent.addEventListener(
    "wheel",
    (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const pane = target.closest(".unit-scroll");
      if (!pane) return;
      e.preventDefault();
      pane.scrollTop += e.deltaY;
    },
    { passive: false },
  );

  document.getElementById("saveBtn").addEventListener("click", () => {
    applySettingsFromForm();
    saveState();
    updateTopbar();
    alert("????꾨즺");
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  });

  document.getElementById("exitBtn").addEventListener("click", () => {
    alert("??踰꾩쟾?먯꽌??李?醫낅즺瑜?吏?먰븯吏 ?딆뒿?덈떎.");
  });
}

function applySettingsFromForm() {
  state.settings.sound = document.getElementById("soundToggle").checked;
  state.settings.language = document.getElementById("languageSelect").value;
  state.settings.difficulty = document.getElementById("difficultySelect").value;
  state.settings.godMode = document.getElementById("godModeToggle").checked;
  state.settings.infinite = document.getElementById("infiniteToggle").checked;
}

function init() {
  bindEvents();
  bindMainMenuHelp();
  ensureQuestState();
  ensureRosterState();
  updateEmergencyQuestStatus();
  if (!state.selectedPlanetId && state.planets.length > 0) {
    state.selectedPlanetId = state.planets[0].id;
    state.selectedRegionId = state.planets[0].regions[0].id;
  }
  updateTopbar();
  renderSortie();
  renderBase();
  syncSettingsForm();
  showScreen("main");
  setInterval(() => {
    updateEmergencyQuestStatus();
    if (!ui.facilityModal.classList.contains("hidden") && state.baseTab === "hq" && state.hqView === "quests") {
      renderFacilityContent("hq");
    }
  }, 1000);
  setInterval(() => {
    saveState();
  }, 30000);
}

init();

