const SAVE_KEY = "hf_mvp_save_v1";

const DIFF_SCALE = {
  easy: 0.85,
  normal: 1,
  hard: 1.3,
};

const MERC_POOL = [
  { id: "m1", name: "잭 레이븐", rank: "신입", contract: 320, atk: 12, def: 5, hp: 90, speed: 18, ability: "기동 사격", roleClass: "리콘", rangeClass: "중원거리", attribute: "자기", team: "게티아", classType: "리콘", color: "#ffd84f", weaponType: "carbine", abilityIcon: "dash" },
  { id: "m2", name: "리아 본", rank: "중급", contract: 520, atk: 16, def: 8, hp: 100, speed: 16, ability: "전술 장전", roleClass: "서포터", rangeClass: "원거리", attribute: "연막", team: "게티아", classType: "서포터", color: "#2f2f2f", weaponType: "rifle", abilityIcon: "reload" },
  { id: "m3", name: "칼리 스톤", rank: "베테랑", contract: 900, atk: 25, def: 12, hp: 130, speed: 14, ability: "분노 폭발", roleClass: "버서커", rangeClass: "근중거리", attribute: "소이", team: "게티아", classType: "버서커", color: "#ff4f4f", weaponType: "shotgun", abilityIcon: "rage" },
];

const MERC_LOADOUT_POOL = [
  "강화 라이플 + 전술 조끼",
  "중형 샷건 + 반응 장갑",
  "에너지 카빈 + 민첩 슈트",
  "레일 피스톨 + 실드 벨트",
];

const QUEST_TITLE_POOL = [
  "잔존 드론 소탕",
  "연구 코어 회수",
  "유적 지하 통로 확보",
  "약탈단 보급선 차단",
  "피난민 호위",
  "감염 구역 정화",
  "데이터 블랙박스 탈환",
  "장갑 수송선 파괴",
  "실험체 포획",
  "통신 중계기 복구",
  "거점 방어",
  "정찰대 구조",
];

const RANGE_META = {
  근거리: { color: "#ff4f4f" },
  근중거리: { color: "#ffd84f" },
  중거리: { color: "#62d965" },
  중원거리: { color: "#56a8ff" },
  원거리: { color: "#b775ff" },
};

const CLASS_META = {
  오펜서: { icon: "./assets/icons/class-offenser.svg", mark: "검" },
  디펜서: { icon: "./assets/icons/class-defenser.svg", mark: "방패" },
  스커미셔: { icon: "./assets/icons/class-skirmisher.svg", mark: "신발" },
  버서커: { icon: "./assets/icons/class-berserker.svg", mark: "쌍단도끼" },
  어쌔신: { icon: "./assets/icons/class-assassin.svg", mark: "쌍단검" },
  어썰트: { icon: "./assets/icons/class-assault.svg", mark: "쌍버클러" },
  리콘: { icon: "./assets/icons/class-recon.svg", mark: "소나" },
  서포터: { icon: "./assets/icons/class-supporter.svg", mark: "지팡이" },
  메딕: { icon: "./assets/icons/class-medic.svg", mark: "십자가" },
  스폐셜: { icon: "./assets/icons/class-special.svg", mark: "별" },
};

const ATTRIBUTE_META = {
  소이: { color: "#ff4f4f", effect: "지속 화염 피해, 화상 시 적 공격력 감소" },
  자기: { color: "#ffd84f", effect: "전격 연쇄, 누적 시 EMP(장비/스킬 봉쇄)" },
  빙결: { color: "#8ad9ff", effect: "이속 저하, 누적 시 냉각(행동 불가)" },
  산성: { color: "#5ddf70", effect: "지속 산성 피해, 융해(회복 차단)" },
  풍압: { color: "#a2ff67", effect: "강한 넉백, 매우 짧은 공격 취소" },
  수냉: { color: "#4f9dff", effect: "공격력 흡수형 생존 회복" },
  철갑: { color: "#8b5a3b", effect: "실드/방어 무시 관통" },
  초능: { color: "#c0a2ff", effect: "마력 게이지 소모 강화, 확률적 조종/밀치기" },
  음파: { color: "#ff9f47", effect: "짧은 정지 + 파동 전염" },
  중력: { color: "#b775ff", effect: "중력파로 적 끌어당김" },
  섬광: { color: "#f3f3f3", effect: "공속/공격 약화, 확률 기절 + 추가 피해" },
  연막: { color: "#2f2f2f", effect: "방어 저하, 확률 암막 + 아군 치확/회복 증가" },
  물리: { color: "#9a9a9a", effect: "특수효과 없음, 기본 스탯 우위" },
};

const TEAM_EFFECTS = {
  조디악: "동일 팀 2인 이상 출격 시 치명타 확률 +8%, 공격력 +6%",
  셈하프: "동일 팀 2인 이상 출격 시 스킬 가속 +10%, 회복량 +12%",
  게티아: "동일 팀 2인 이상 출격 시 피해 증폭 +9%, 관통 +8%",
  엘리멘탈: "동일 팀 2인 이상 출격 시 속성 축적량 +18%",
  오리지널: "동일 팀 2인 이상 출격 시 공격/방어/체력 +5%",
};

const ROLE_ORDER = ["오펜서", "디펜서", "스커미셔", "버서커", "어쌔신", "어썰트", "리콘", "서포터", "메딕", "스폐셜"];
const RANGE_ORDER = ["근거리", "근중거리", "중거리", "중원거리", "원거리"];
const ATTR_ORDER = ["소이", "자기", "빙결", "산성", "풍압", "수냉", "철갑", "초능", "음파", "중력", "섬광", "연막", "물리"];

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
  "아르덴",
  "벨라",
  "카일론",
  "세라핀",
  "루미나",
  "발터",
  "니카",
  "제로스",
  "이리스",
  "카론",
  "미라쥬",
  "도미닉",
  "레인",
  "볼트",
  "오르카",
  "린드",
  "에단",
  "시온",
  "테라",
  "하임",
  "노바",
  "가넷",
  "블레이즈",
  "솔라",
  "베스퍼",
  "아쥬르",
  "크로노",
  "데미안",
];

const NAME_PRON_MAP = {
  Aries: "아리에스",
  Taurus: "타우루스",
  Gemini: "제미니",
  Cancer: "캔서",
  Leo: "레오",
  Virgo: "버고",
  Libra: "리브라",
  Scorpio: "스콜피오",
  Sagittarius: "새지테리어스",
  Capricorn: "캐프리콘",
  Aquarius: "아쿠아리어스",
  Pisces: "파이시스",
  Ophiuchus: "오피우쿠스",
};

function koreanizeLatinToken(token) {
  const exact = NAME_PRON_MAP[token];
  if (exact) return exact;
  let s = token.toLowerCase();
  const rules = [
    ["ph", "프"],
    ["th", "스"],
    ["ch", "치"],
    ["sh", "쉬"],
    ["qu", "쿠"],
    ["ck", "크"],
    ["tion", "션"],
    ["sion", "전"],
    ["ia", "이아"],
    ["io", "이오"],
    ["ea", "이아"],
    ["ee", "이"],
    ["oo", "우"],
    ["ou", "아우"],
    ["au", "아우"],
  ];
  rules.forEach(([a, b]) => {
    s = s.replaceAll(a, b);
  });
  const map = {
    a: "아",
    b: "브",
    c: "크",
    d: "드",
    e: "에",
    f: "프",
    g: "그",
    h: "흐",
    i: "이",
    j: "제",
    k: "크",
    l: "르",
    m: "므",
    n: "느",
    o: "오",
    p: "프",
    q: "쿠",
    r: "르",
    s: "스",
    t: "트",
    u: "우",
    v: "브",
    w: "워",
    x: "크스",
    y: "이",
    z: "즈",
    "-": "-",
    "2": "2",
  };
  let out = "";
  for (const ch of s) out += map[ch] || ch;
  return out.replaceAll("ㅡ", "").replace(/\s+/g, " ").trim();
}

function koreanizeName(name) {
  if (/[가-힣]/.test(name)) return name;
  return name
    .split(/(\-|\s)/)
    .map((part) => (/^[A-Za-z0-9]+$/.test(part) ? koreanizeLatinToken(part) : part))
    .join("");
}

function classTemplate(roleClass) {
  const map = {
    오펜서: { atk: 28, def: 9, hp: 135, speed: 14, weaponType: "rifle" },
    디펜서: { atk: 18, def: 20, hp: 190, speed: 10, weaponType: "blade" },
    스커미셔: { atk: 22, def: 7, hp: 110, speed: 20, weaponType: "carbine" },
    버서커: { atk: 25, def: 12, hp: 150, speed: 13, weaponType: "shotgun" },
    어쌔신: { atk: 26, def: 8, hp: 115, speed: 19, weaponType: "blade" },
    어썰트: { atk: 23, def: 14, hp: 145, speed: 16, weaponType: "carbine" },
    리콘: { atk: 20, def: 10, hp: 118, speed: 17, weaponType: "rifle" },
    서포터: { atk: 16, def: 11, hp: 125, speed: 15, weaponType: "rifle" },
    메딕: { atk: 14, def: 10, hp: 120, speed: 15, weaponType: "rifle" },
    스폐셜: { atk: 21, def: 12, hp: 130, speed: 15, weaponType: "carbine" },
  };
  return map[roleClass] || map.오펜서;
}

function classAbility(roleClass) {
  const map = {
    오펜서: "지속/단일 집중 화력",
    디펜서: "도발 + 보호막 전개",
    스커미셔: "고속 회피 + 교란",
    버서커: "광폭/수호 전환",
    어쌔신: "은신 돌입 + 급습",
    어썰트: "돌진 충격 + 타격 연계",
    리콘: "정찰/탐지 + 노출 표식",
    서포터: "아군 버프 + 적 디버프",
    메딕: "회복/정화/재생 강화",
    스폐셜: "복제/소환/함정/텔레포트/해킹/반사",
  };
  return map[roleClass] || "전술 전개";
}

function getPrimaryAttribute(attributeText) {
  const raw = attributeText || "물리";
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
  const map = { 오펜서: "scope", 디펜서: "guard", 스커미셔: "dash", 버서커: "rage", 어쌔신: "dash", 어썰트: "guard", 리콘: "scope", 서포터: "reload", 메딕: "reload", 스폐셜: "rage" };
  return map[roleClass] || "scope";
}

function createUnitSpec({ name, team, unitType, index }) {
  const roleClass = ROLE_ORDER[index % ROLE_ORDER.length];
  const rangeClass = RANGE_ORDER[index % RANGE_ORDER.length];
  const attribute = attributeForIndex(index);
  const base = classTemplate(roleClass);
  const attrBase = attribute.split("/")[0];
  const attrColor = ATTRIBUTE_META[attrBase]?.color || "#9a9a9a";
  const isPhysical = attrBase === "물리";
  const displayName = koreanizeName(name);
  return {
    id: `${team}-${name}`.replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase() + `-${index}`,
    sourceId: `${team}-${index}`,
    name: displayName,
    unitType,
    team,
    teamEffect: TEAM_EFFECTS[team] || "없음",
    roleClass,
    rangeClass,
    classType: roleClass,
    attribute,
    color: attrColor,
    atk: base.atk + (isPhysical ? 3 : 0) + (unitType === "hero" ? 1 : 0),
    def: base.def + (isPhysical ? 2 : 0),
    hp: base.hp + (isPhysical ? 16 : 0),
    speed: base.speed + (attrBase === "풍압" || attrBase === "연막" ? 1 : 0),
    ability: `${classAbility(roleClass)} / ${ATTRIBUTE_META[attrBase]?.effect || "속성 효과 없음"}`,
    abilityIcon: abilityIconForClass(roleClass),
    weaponType: base.weaponType,
    level: 1,
    canUseDefense: ["디펜서", "어썰트", "버서커", "스폐셜"].includes(roleClass),
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
  ZODIAC_NAMES.forEach((name, i) => heroes.push(createUnitSpec({ name, team: "조디악", unitType: "hero", index: i })));
  SHEMHAM_NAMES.forEach((name, i) => heroes.push(createUnitSpec({ name, team: "셈하프", unitType: "hero", index: i + 20 })));
  GOETIA_NAMES.forEach((name, i) => mercs.push(createUnitSpec({ name, team: "게티아", unitType: "merc", index: i + 40 })));
  ATTR_ORDER.forEach((attr, i) => {
    mercs.push(
      createUnitSpec({
        name: `Elemental-${attr}`,
        team: "엘리멘탈",
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
      team: "오리지널",
      unitType,
      index: i + 120,
    });
    unit.ability = `${unit.ability} / 전용 프로토콜-${String((i % 25) + 1).padStart(2, "0")}`;
    if (unitType === "hero") heroes.push(unit);
    else mercs.push(unit);
  }
  if (heroes[0]) heroes[0].deployed = true;
  if (heroes[1]) heroes[1].deployed = true;
  return { heroes, mercs };
}

const MELEE_TYPES = [
  { key: "데거", range: 1.4, atk: 6, aspd: 1.35, pattern: "부채꼴", trait: "짧은 사거리/빠른 연타" },
  { key: "소드", range: 1.8, atk: 8, aspd: 1.0, pattern: "부채꼴", trait: "균형형 근접" },
  { key: "츠바이헨더", range: 2.2, atk: 12, aspd: 0.7, pattern: "부채꼴", trait: "공격 중 피격 방어 판정" },
  { key: "블레이드", range: 1.7, atk: 7, aspd: 1.05, pattern: "부채꼴", trait: "치명타 확률 상승" },
  { key: "스피어", range: 2.4, atk: 7, aspd: 1.2, pattern: "직선 찌르기", trait: "긴 사거리/빠른 찌르기" },
  { key: "랜스", range: 2.6, atk: 13, aspd: 0.72, pattern: "직선 찌르기", trait: "공격 중 방어 판정(방어 무장 쿨 무시)" },
  { key: "메이스", range: 1.8, atk: 10, aspd: 0.78, pattern: "부채꼴", trait: "넉백 부여" },
  { key: "해머", range: 2.3, atk: 14, aspd: 0.62, pattern: "부채꼴", trait: "강한 넉백/방어 판정 없음" },
  { key: "휩", range: 2.8, atk: 8, aspd: 0.68, pattern: "광역 선형", trait: "긴 사거리 넉백" },
  { key: "사이즈", range: 3.2, atk: 15, aspd: 0.6, pattern: "갈고리-낫 연계", trait: "끌어오기 + 밀치기" },
];

const FIREARM_TYPES = [
  { key: "SG", range: 1.9, atk: 12, aspd: 0.75, trait: "확산 탄/넉백" },
  { key: "AR", range: 3.0, atk: 8, aspd: 1.0, trait: "균형형 자동소총" },
  { key: "SMG", range: 2.4, atk: 6, aspd: 1.35, trait: "고연사 근중거리" },
  { key: "LMG", range: 3.3, atk: 7, aspd: 1.12, trait: "지속사격형" },
  { key: "DMR", range: 3.8, atk: 10, aspd: 0.82, trait: "중원거리 정밀사격" },
  { key: "SR", range: 4.7, atk: 14, aspd: 0.55, trait: "원거리 고화력" },
  { key: "RL", range: 4.2, atk: 16, aspd: 0.45, trait: "유도/폭발탄" },
];

const DEFENSE_TYPES = [
  { key: "버클러", block: 9, radius: 1.2, cd: 3.2, trait: "짧은 쿨타임" },
  { key: "라운드", block: 12, radius: 1.6, cd: 4.4, trait: "균형형 방어" },
  { key: "월", block: 18, radius: 2.0, cd: 6.1, trait: "고방어/긴 쿨" },
  { key: "돔", block: 14, radius: 2.6, cd: 5.5, trait: "대범위 보호" },
  { key: "스쿠툼", block: 11, radius: 1.6, cd: 4.8, trait: "방어 성공 시 치명타 상승" },
  { key: "스팅가드", block: 10, radius: 1.4, cd: 4.9, trait: "방어 + 근접 타격" },
  { key: "건실드", block: 10, radius: 1.4, cd: 5.0, trait: "방어 + 원거리 투사체" },
  { key: "업소브", block: 10, radius: 1.5, cd: 5.1, trait: "방어 성공 시 회복" },
];

const GEAR_TYPES = [
  { key: "메디킷", atk: 0, def: 0, hp: 18, speed: 0, cdr: 0.02, trait: "전투 중 회복량 증가" },
  { key: "파워모듈", atk: 5, def: 0, hp: 0, speed: 0, cdr: 0, trait: "공격력 증폭" },
  { key: "강화플레이트", atk: 0, def: 6, hp: 12, speed: -0.3, cdr: 0, trait: "방어력/체력 상승" },
  { key: "부스터슈즈", atk: 0, def: 0, hp: 0, speed: 2.2, cdr: 0, trait: "이동속도 상승" },
  { key: "쿨링코어", atk: 0, def: 0, hp: 0, speed: 0, cdr: 0.08, trait: "스킬 쿨타임 감소" },
  { key: "전술센서", atk: 2, def: 1, hp: 0, speed: 1.0, cdr: 0, trait: "탐지/정밀 보조" },
  { key: "리커버리팩", atk: 0, def: 2, hp: 10, speed: 0, cdr: 0.03, trait: "피해 후 회복" },
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
      mainType: "무기",
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
      description: `${base.key} 계열 ${mkName[idx]}형. ${base.trait}`,
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
        mainType: "장비",
        subType: g.key,
        category: "gear",
        icon: createItemIcon(g.key, "#2f5a3a"),
        atk: Math.round(g.atk * m),
        def: Math.round(g.def * m),
        hp: Math.round(g.hp * m),
        speed: Number((g.speed * m).toFixed(1)),
        cdr: Number((g.cdr * m).toFixed(2)),
        trait: g.trait,
        description: `${g.key} 장비. ${g.trait}`,
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
  if (rangeClass === "근거리") return "SG";
  if (rangeClass === "근중거리") return "SMG";
  if (rangeClass === "중거리") return "AR/LMG";
  if (rangeClass === "중원거리") return "DMR";
  if (rangeClass === "원거리") return "SR";
  return "AR";
}

function meleeForRole(roleClass) {
  if (roleClass === "오펜서") return "소드";
  if (roleClass === "디펜서") return "메이스";
  if (roleClass === "스커미셔") return "데거";
  if (roleClass === "버서커") return "해머";
  if (roleClass === "어쌔신") return "블레이드";
  if (roleClass === "어썰트") return "랜스";
  if (roleClass === "리콘") return "스피어";
  if (roleClass === "서포터") return "휩";
  if (roleClass === "메딕") return "스피어";
  return "사이즈";
}

function defenseForRole(roleClass) {
  if (roleClass === "디펜서") return "월";
  if (roleClass === "어썰트") return "라운드";
  if (roleClass === "버서커") return "스팅가드";
  if (roleClass === "스폐셜") return "돔";
  return "버클러";
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
    const targetType = key === "AR/LMG" ? (unit.roleClass === "오펜서" ? "LMG" : "AR") : key;
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
  if (unit.roleClass === "메딕") base = gears.find((g) => g.subType === "메디킷");
  else if (unit.roleClass === "서포터") base = gears.find((g) => g.subType === "쿨링코어");
  else if (unit.roleClass === "디펜서") base = gears.find((g) => g.subType === "강화플레이트");
  else if (unit.roleClass === "스커미셔" || unit.roleClass === "어쌔신") base = gears.find((g) => g.subType === "부스터슈즈");
  else base = gears.find((g) => g.subType === "파워모듈");
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
  const title = `긴급: ${QUEST_TITLE_POOL[randInt(0, QUEST_TITLE_POOL.length - 1)]}`;
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

function buildRegions(planetId, count, minStar, maxStar, prefix) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const t = count <= 1 ? 0 : i / (count - 1);
    const diff = Math.max(minStar, Math.min(maxStar, Math.round(minStar + (maxStar - minStar) * t)));
    out.push({ id: `${planetId}-r${i + 1}`, name: `${prefix} ${i + 1}`, difficulty: diff, restored: false });
  }
  return out;
}

function createPlanetCatalog() {
  const defs = [
    { id: "holy-terra", name: "홀리 테라", color: "#6ec6ff", x: 120, y: 110, traits: "입문형 보안 행성", enemies: "물리", rewards: "기초 자원", rc: 10, min: 1, max: 6, p: "성역" },
    { id: "neo-terra", name: "네오 테라", color: "#7bb1ff", x: 340, y: 140, traits: "도시 복합지", enemies: "물리/연막", rewards: "크레딧", rc: 15, min: 1, max: 10, p: "네오" },
    { id: "pompeio", name: "폼페이오", color: "#ff6d6d", x: 560, y: 180, traits: "화산 지대", enemies: "소이", rewards: "열원 광석", rc: 15, min: 1, max: 10, p: "용암" },
    { id: "metronos", name: "메트로노스", color: "#ffe16d", x: 780, y: 160, traits: "전력 허브", enemies: "자기", rewards: "고전도 코일", rc: 15, min: 1, max: 10, p: "그리드" },
    { id: "frozen-world", name: "프로즌 월드", color: "#8bd9ff", x: 1000, y: 160, traits: "빙설 협곡", enemies: "빙결", rewards: "극저온 코어", rc: 15, min: 1, max: 10, p: "빙하" },
    { id: "blueocean", name: "블루오션", color: "#4fa4ff", x: 1220, y: 220, traits: "심해 군도", enemies: "수냉", rewards: "해수 합금", rc: 15, min: 1, max: 10, p: "해구" },
    { id: "melt-amazon", name: "멜튼 아마존", color: "#55e175", x: 1420, y: 340, traits: "산성 밀림", enemies: "산성", rewards: "산성 수지", rc: 15, min: 1, max: 10, p: "밀림" },
    { id: "mardio", name: "마르디오", color: "#95ff72", x: 1360, y: 560, traits: "폭풍 고원", enemies: "풍압", rewards: "공압 결정", rc: 15, min: 1, max: 10, p: "고원" },
    { id: "mykenes", name: "미케네스", color: "#9a6f4b", x: 1160, y: 690, traits: "장갑 유적", enemies: "철갑", rewards: "중장 플레이트", rc: 15, min: 1, max: 10, p: "유적" },
    { id: "museum", name: "뮤지움", color: "#ffa552", x: 920, y: 760, traits: "공명 실험지", enemies: "음파", rewards: "진동 소자", rc: 15, min: 1, max: 10, p: "공명" },
    { id: "paradise", name: "파라다이스", color: "#f4f4f4", x: 700, y: 740, traits: "고광도 정원", enemies: "섬광", rewards: "광자 정수", rc: 15, min: 1, max: 10, p: "정원" },
    { id: "hell", name: "헬", color: "#1f1f1f", x: 500, y: 700, traits: "연무 협곡", enemies: "연막", rewards: "암흑 유도체", rc: 15, min: 1, max: 10, p: "사연" },
    { id: "ancient", name: "에인션트", color: "#9f9f9f", x: 300, y: 620, traits: "고대 전장", enemies: "물리", rewards: "고대 합금", rc: 15, min: 1, max: 10, p: "유적" },
    { id: "psionica", name: "사이오니카", color: "#b08cff", x: 180, y: 430, traits: "초능 단층대", enemies: "초능", rewards: "마력 결정", rc: 15, min: 1, max: 10, p: "초능" },
    { id: "graviton", name: "그래비톤", color: "#996bff", x: 430, y: 430, traits: "중력 균열", enemies: "중력", rewards: "중력 위상석", rc: 18, min: 4, max: 10, p: "균열" },
    { id: "obsidian", name: "옵시디언", color: "#332f44", x: 640, y: 420, traits: "암흑 균층", enemies: "연막/철갑", rewards: "암흑 결정", rc: 12, min: 3, max: 9, p: "균층" },
    { id: "storm-ark", name: "스톰 아크", color: "#7de1ff", x: 860, y: 420, traits: "고도 폭풍층", enemies: "풍압/자기", rewards: "플라즈마 코어", rc: 20, min: 5, max: 10, p: "폭풍" },
    { id: "vermilion", name: "버밀리온", color: "#ff8e78", x: 1080, y: 430, traits: "홍열 협곡", enemies: "소이/산성", rewards: "적열 광석", rc: 16, min: 4, max: 10, p: "홍열" },
    { id: "trident", name: "트라이던트", color: "#4a8fff", x: 1280, y: 430, traits: "심층 해역", enemies: "수냉/음파", rewards: "심해 코어", rc: 14, min: 3, max: 10, p: "해역" },
    { id: "eclipse", name: "이클립스", color: "#c37dff", x: 1480, y: 470, traits: "복합 특이점", enemies: "복합 속성", rewards: "전설 자원", rc: 20, min: 6, max: 10, p: "특이점" },
  ];
  return defs.map((d) => ({
    id: d.id,
    name: d.name,
    color: d.color,
    x: d.x,
    y: d.y,
    traits: d.traits,
    enemies: d.enemies,
    rewards: d.rewards,
    regions: buildRegions(d.id, d.rc, d.min, d.max, d.p),
  }));
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
    planets: createPlanetCatalog(),
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
      { id: "ship-1", name: "HF-셔틀", capacity: 12, unlocked: true },
      { id: "ship-2", name: "HF-프리깃", capacity: 18, unlocked: false },
      { id: "ship-3", name: "HF-캐리어", capacity: 24, unlocked: false },
    ],
    activeShipId: "ship-1",
    mechs: [
      { id: "mech-1", name: "MF-01 Aegis", role: "?쒖?", hp: 620, currentHp: 620, atk: 96, def: 62, speed: 38, unlocked: true },
      { id: "mech-2", name: "MF-02 Swift", role: "寃쎈웾", hp: 480, currentHp: 480, atk: 84, def: 44, speed: 54, unlocked: false },
      { id: "mech-3", name: "MF-03 Bastion", role: "以묐웾", hp: 860, currentHp: 860, atk: 118, def: 92, speed: 26, unlocked: false },
    ],
    activeMechId: "mech-1",
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
  missionSkillCards: document.getElementById("missionSkillCards"),
  missionSkillPeek: document.getElementById("missionSkillPeek"),
  emergencyRepairBtn: document.getElementById("emergencyRepairBtn"),
  missionLoadingOverlay: document.getElementById("missionLoadingOverlay"),
  missionResultModal: document.getElementById("missionResultModal"),
  missionResultTitle: document.getElementById("missionResultTitle"),
  missionResultReason: document.getElementById("missionResultReason"),
  missionResultBody: document.getElementById("missionResultBody"),
  mainMenuHelp: document.getElementById("mainMenuHelp"),
};

const MAIN_MENU_DEFAULT_HELP = {
  title: "異쒓꺽",
  desc: "?됱꽦怨?吏??쓣 ?좏깮???꾨Т???ㅼ뼱媛묐땲?? ?꾪닾?먯꽌 ?밸━?섎㈃ 吏???섎났??吏꾪뻾?⑸땲??",
};

const FACILITY_INFO = {
  hq: {
    name: "본부",
    desc: "퀘스트 확인, 출격 인원 배치, 장비/무기 관리를 담당합니다.",
    use: "퀘스트 진행 및 출격 편성을 관리합니다.",
  },
  factory: {
    name: "공장",
    desc: "유닛, 장비, 무기, 메카 및 우주선 관련 제작과 업그레이드를 진행합니다.",
    use: "제작/연구 대기열과 업그레이드 비용을 관리합니다.",
  },
  plant: {
    name: "발전소",
    desc: "전력과 자원을 생산하고, 본부/공장 소비량 절감 보너스를 제공합니다.",
    use: "주기적으로 자원을 수령하고 발전소 레벨을 올립니다.",
  },
  market: {
    name: "마켓",
    desc: "신입 히어로/용병과 장비, 무기, 자원을 구매할 수 있습니다.",
    use: "10 크레딧으로 품목을 갱신하며 용병 계약을 관리합니다.",
  },
  black: {
    name: "블랙 마켓",
    desc: "베테랑 유닛과 전설급 장비/무장을 고가에 거래합니다.",
    use: "고급 장비 구매 및 포획 빌런 거래를 수행합니다.",
  },
  hangar: {
    name: "격납고",
    desc: "우주선과 메카 상태를 관리하고 출격용 메카를 지정합니다.",
    use: "메카 내구도 수리와 활성 메카 선택을 수행합니다.",
  },
  prison: {
    name: "수감소",
    desc: "체포한 빌런을 수감하고 교화 또는 방출을 관리합니다.",
    use: "교화 결과에 따라 용병 전환 또는 실패 처리를 진행합니다.",
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
        <div>난이도 ${region.difficulty} / 상태: ${region.restored ? "수복 완료" : "미수복"}</div>
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
  phase: "idle",
  rafId: null,
  lastTime: 0,
  elapsed: 0,
  player: null,
  enemies: [],
  effects: [],
  mapW: 3200,
  mapH: 2400,
  camX: 0,
  camY: 0,
  moveTarget: null,
  draggingMap: false,
  dragStartX: 0,
  dragStartY: 0,
  dragCamX: 0,
  dragCamY: 0,
  stats: { kills: 0, progress: 0 },
  finalBoss: null,
  bossCaptured: false,
  bountyCredit: 0,
  raidBounty: 0,
  raidTriggered: false,
  skills: [],
  draggingSkillId: null,
  skillPreview: null,
  captureBaseline: 0,
  regionId: null,
  planetId: null,
};

function pushFx(kind, data = {}, life = 0.25) {
  mission.effects.push({ kind, ...data, life });
}

function createFinalBoss(region) {
  const names = ["크림슨 바론", "페이즈 스펙터", "아이스 템페스트", "브레이크 미러", "그래비티 로드"];
  const name = names[randInt(0, names.length - 1)];
  const bounty = 700 + region.difficulty * 180;
  return {
    id: `boss-${Date.now()}`,
    name,
    bounty,
    hpScale: 5.2,
  };
}

function spawnRaidIfNeeded(region) {
  if (mission.raidTriggered) return;
  if (Math.random() > 0.22) return;
  mission.raidTriggered = true;
  const base = 2 + Math.floor(region.difficulty / 3);
  for (let i = 0; i < base; i += 1) {
    mission.enemies.push({
      id: `raid-${Date.now()}-${i}`,
      x: 120 + Math.random() * (mission.mapW - 240),
      y: 120 + Math.random() * (mission.mapH - 240),
      r: 12,
      hp: 55 + region.difficulty * 12,
      speed: 72 + Math.random() * 24,
      touchCd: 0,
      raidType: "merc",
      bounty: 120 + region.difficulty * 20,
      name: "용병단",
    });
  }
  mission.enemies.push({
    id: `raid-boss-${Date.now()}`,
    x: 120 + Math.random() * (mission.mapW - 240),
    y: 120 + Math.random() * (mission.mapH - 240),
    r: 16,
    hp: 150 + region.difficulty * 35,
    speed: 66,
    touchCd: 0,
    raidType: "mercBoss",
    bounty: 500 + region.difficulty * 90,
    name: "?⑸퀝??蹂댁뒪",
  });
}

function setupMissionSkills() {
  mission.skills = [
    { id: "skill-burst", name: "Burst Strike", kind: "damage", power: 34, radius: 0, cd: 6, left: 0 },
    { id: "skill-bomb", name: "AOE Bomb", kind: "damage", power: 42, radius: 110, cd: 10, left: 0 },
    { id: "skill-heal", name: "Field Repair", kind: "heal", power: 30, radius: 120, cd: 12, left: 0 },
    { id: "skill-boost", name: "Assault Boost", kind: "buff", power: 0, radius: 0, cd: 14, left: 0 },
  ];
  renderMissionSkills();
}

function renderMissionSkills() {
  if (!ui.missionSkillCards || !ui.missionSkillPeek) return;
  ui.missionSkillCards.innerHTML = mission.skills
    .map(
      (s, idx) => `<div class="mission-skill-card ${s.left > 0 ? "on-cooldown" : ""}" draggable="true" data-skill-id="${s.id}">
        <strong>${idx + 1}. ${s.name}</strong>
        <small>${s.kind} ${s.radius > 0 ? `/ r ${s.radius}` : ""}</small>
        <small>${s.left > 0 ? `${s.left.toFixed(1)}s` : "Ready"}</small>
      </div>`,
    )
    .join("");
  ui.missionSkillPeek.textContent = "移대뱶瑜??쒕옒洹명빐??留듭뿉 ?볦쑝硫?諛쒕룞";
}

function castSkill(skillId, tx, ty) {
  const p = mission.player;
  const sk = mission.skills.find((s) => s.id === skillId);
  if (!sk || sk.left > 0 || !p || mission.phase !== "combat") return;
  if (sk.kind === "heal") {
    p.hp = Math.min(p.maxHp, p.hp + sk.power);
    if (p.mechMaxHp > 0 && p.mechHp > 0) p.mechHp = Math.min(p.mechMaxHp, p.mechHp + Math.round(sk.power * 0.8));
    pushFx("parry-flash", { x: p.x, y: p.y, r: 32, color: "#8dffc8" }, 0.2);
  } else if (sk.kind === "buff") {
    p.attack += 8;
    p.speed += 14;
    pushFx("parry-flash", { x: p.x, y: p.y, r: 28, color: "#8dd2ff" }, 0.2);
  } else if (sk.radius > 0) {
    mission.enemies.forEach((e) => {
      const d = Math.hypot(e.x - tx, e.y - ty);
      if (d <= sk.radius) dealDamageToEnemy(e, Math.round(sk.power * (1 - d / (sk.radius * 1.3))), p);
    });
    pushFx("explosion", { x: tx, y: ty, r: sk.radius, color: "#ffbe84" }, 0.24);
  } else {
    const nearest = mission.enemies
      .map((e) => ({ e, d: Math.hypot(e.x - p.x, e.y - p.y) }))
      .sort((a, b) => a.d - b.d)[0]?.e;
    if (nearest) dealDamageToEnemy(nearest, sk.power, p);
  }
  sk.left = sk.cd;
  renderMissionSkills();
}

function clampCamera() {
  mission.camX = clamp(mission.camX, 0, Math.max(0, mission.mapW - ui.canvas.width));
  mission.camY = clamp(mission.camY, 0, Math.max(0, mission.mapH - ui.canvas.height));
}

function screenToWorld(x, y) {
  return { x: x + mission.camX, y: y + mission.camY };
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
  target.x = clamp(target.x, 20, mission.mapW - 20);
  target.y = clamp(target.y, 20, mission.mapH - 20);
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
  const type = p.meleeType || "??";
  p.attackingMeleeType = type;
  p.attackMotionUntil = mission.elapsed + (type === "??" ? 0.34 : 0.24);
  p.lastMeleeAt = mission.elapsed;
  const range = p.meleeRangePx;
  const base = p.meleeDamage;
  const fx = p.meleeFxScale || 1;

  pushFx(
    "melee-swing",
    { x: p.x, y: p.y, r: Math.max(28, range * 0.52 * fx), color: p.attrColor || "#ffd48a", width: 3 * fx, type },
    0.15 * (0.95 + (fx - 1) * 0.8),
  );

  const cleaveTypes = ["??", "??", "?????", "????", "???", "??", "?"];
  if (cleaveTypes.includes(type)) {
    const hitR = type === "?" ? range * 1.08 : type === "??" ? range : range * 0.88;
    mission.enemies.forEach((e) => {
      if (Math.hypot(e.x - p.x, e.y - p.y) <= hitR) {
        dealDamageToEnemy(e, base, p);
        if (["???", "??", "?"].includes(type)) applyKnockback(e, p.x, p.y, type === "??" ? 34 : type === "?" ? 26 : 18);
      }
    });
    return;
  }

  if (type === "???" || type === "??") {
    const tx = target.x - p.x;
    const ty = target.y - p.y;
    const m = Math.hypot(tx, ty) || 1;
    const x2 = p.x + (tx / m) * range * (type === "??" ? 1.2 : 1);
    const y2 = p.y + (ty / m) * range * (type === "??" ? 1.2 : 1);
    pushFx("stab-line", { x1: p.x, y1: p.y, x2, y2, color: p.attrColor || "#ffd48a", width: type === "??" ? 3 : 2 }, 0.12);
    mission.enemies.forEach((e) => {
      const d = distancePointToSegment(e.x, e.y, p.x, p.y, x2, y2);
      if (d <= e.r + 8) dealDamageToEnemy(e, base + (type === "??" ? 4 : 0), p);
    });
    return;
  }

  if (type === "???") {
    const hookTarget = mission.enemies
      .map((e) => ({ e, d: Math.hypot(e.x - p.x, e.y - p.y) }))
      .filter((x) => x.d <= p.scytheHookRangePx)
      .sort((a, b) => a.d - b.d)[0]?.e;
    if (hookTarget) {
      pushFx("hook-line", { x1: p.x, y1: p.y, x2: hookTarget.x, y2: hookTarget.y, color: p.attrColor || "#ffd48a", width: 3 }, 0.16);
      const dx = p.x - hookTarget.x;
      const dy = p.y - hookTarget.y;
      const m = Math.hypot(dx, dy) || 1;
      hookTarget.x += (dx / m) * Math.min(90, m - 12);
      hookTarget.y += (dy / m) * Math.min(90, m - 12);
      dealDamageToEnemy(hookTarget, base + 6, p);
      applyKnockback(hookTarget, p.x, p.y, 32);
    } else {
      dealDamageToEnemy(target, base, p);
    }
    return;
  }

  dealDamageToEnemy(target, base, p);
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
  if (ui.missionResultModal) ui.missionResultModal.classList.add("hidden");

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
  const selectedMech =
    (state.mechs || []).find((m) => m.id === state.activeMechId && m.unlocked) || (state.mechs || []).find((m) => m.unlocked) || null;
  const activeMech = selectedMech && selectedMech.currentHp > 0 ? selectedMech : null;
  const mechMul = activeMech ? 1.75 : 1;
  const baseHp = Math.round(70 + sumHp * 0.85);
  const baseSpeed = Math.round(145 + avgSpeed * 4.6);
  const baseAttack = Math.round(10 + sumAtk * 0.65);
  const baseDefense = Math.round(sumDef * 0.45);
  mission.player = {
    x: 220,
    y: 220,
    r: 14,
    hp: Math.round(baseHp * mechMul),
    maxHp: Math.round(baseHp * mechMul),
    baseHp,
    speed: Math.round(baseSpeed * (activeMech ? 0.92 : 1)),
    baseSpeed,
    attack: Math.round(baseAttack * (activeMech ? 1.25 : 1)),
    baseAttack,
    defense: Math.round(baseDefense * (activeMech ? 1.3 : 1)),
    baseDefense,
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
    mountedMechId: activeMech?.id || null,
    mechHp: activeMech?.currentHp || 0,
    mechMaxHp: activeMech?.hp || 0,
    mechBroken: false,
  };
  mission.mapW = 3400 + region.difficulty * 150;
  mission.mapH = 2500 + region.difficulty * 120;
  mission.finalBoss = createFinalBoss(region);
  mission.bossCaptured = false;
  mission.bountyCredit = 0;
  mission.raidBounty = 0;
  mission.raidTriggered = false;
  mission.enemies = [];
  for (let i = 0; i < enemyCount; i += 1) {
    mission.enemies.push({
      id: `${Date.now()}-${i}`,
      x: 120 + Math.random() * (mission.mapW - 240),
      y: 120 + Math.random() * (mission.mapH - 240),
      r: 12,
      hp: enemyHp,
      speed: 65 + Math.random() * 35,
      touchCd: 0,
    });
  }
  mission.enemies.push({
    id: mission.finalBoss.id,
    x: mission.mapW - 220,
    y: mission.mapH - 220,
    r: 19,
    hp: Math.round(enemyHp * mission.finalBoss.hpScale),
    speed: 58,
    touchCd: 0,
    isFinalBoss: true,
    name: mission.finalBoss.name,
    bounty: mission.finalBoss.bounty,
  });
  spawnRaidIfNeeded(region);

  mission.running = true;
  mission.phase = "loading";
  mission.lastTime = performance.now();
  mission.elapsed = 0;
  mission.stats = { kills: 0, progress: 0 };
  mission.captureBaseline = state.capturedVillains.length;
  mission.regionId = region.id;
  mission.planetId = planet.id;
  mission.moveTarget = { x: mission.player.x, y: mission.player.y };
  mission.camX = Math.max(0, mission.player.x - ui.canvas.width / 2);
  mission.camY = Math.max(0, mission.player.y - ui.canvas.height / 2);
  clampCamera();
  mission.effects = [];
  setupMissionSkills();
  ui.missionTitle.textContent = `${planet.name} - ${region.name}`;
  ui.missionInfo.textContent = `Loading... terrain scan and drop route`;
  if (ui.missionLoadingOverlay) ui.missionLoadingOverlay.classList.remove("hidden");
  setTimeout(() => {
    showScreen("mission");
    mission.phase = "landing";
    ui.missionInfo.textContent = "Dropship landing (2s)";
    mission.rafId = requestAnimationFrame(loopMission);
    setTimeout(() => {
      mission.phase = "combat";
      ui.missionInfo.textContent = "Combat started. Capture target and secure area.";
      if (ui.missionLoadingOverlay) ui.missionLoadingOverlay.classList.add("hidden");
    }, 2000);
  }, 800);
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
  if (mission.moveTarget && mission.phase === "combat") {
    const dx = mission.moveTarget.x - p.x;
    const dy = mission.moveTarget.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 4) {
      const step = Math.min(dist, p.speed * dt);
      p.x += (dx / dist) * step;
      p.y += (dy / dist) * step;
    }
  }
  p.x = clamp(p.x, 20, mission.mapW - 20);
  p.y = clamp(p.y, 20, mission.mapH - 20);
  if (!mission.draggingMap) {
    mission.camX = p.x - ui.canvas.width / 2;
    mission.camY = p.y - ui.canvas.height / 2;
    clampCamera();
  }
  if (mission.phase !== "combat") return;
  mission.skills.forEach((s) => {
    s.left = Math.max(0, s.left - dt);
  });

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
        if (p.attackMotionUntil > mission.elapsed && ["랜스", "츠바이헨더"].includes(p.attackingMeleeType)) {
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
            { x: p.x, y: p.y, r: (p.defenseType === "돔" ? 76 : 44) * dfx, color: p.attrColor || "#8cd3ff", dtype: p.defenseType, angle, width: 2 + dfx },
            0.2 * (0.95 + (dfx - 1) * 0.8),
          );
          if (p.defenseType === "업소브") p.hp = Math.min(p.maxHp, p.hp + 10);
          if (p.defenseType === "스팅가드") e.hp -= 8;
          if (p.defenseType === "건실드") {
            const n = mission.enemies.find((x) => x.id !== e.id);
            if (n) n.hp -= 6;
          }
          if (p.defenseType === "스쿠툼") {
            p.critBonusStacks = Math.min(2, (p.critBonusStacks || 0) + 1);
            p.critBonusUntil = mission.elapsed + 6;
          }
        }
        if (p.mechHp > 0) {
          p.mechHp = Math.max(0, p.mechHp - damage);
          if (p.mechHp <= 0 && !p.mechBroken) {
            p.mechBroken = true;
            p.maxHp = p.baseHp;
            p.hp = Math.min(p.hp, p.maxHp);
            p.speed = Math.round(p.baseSpeed * 1.08);
            p.attack = p.baseAttack;
            p.defense = p.baseDefense;
          }
        } else {
          p.hp -= damage;
        }
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
      const dead = mission.enemies[i];
      mission.stats.kills += 1;
      mission.stats.progress = Math.min(100, mission.stats.progress + 3);
      if (dead.isFinalBoss) {
        mission.bossCaptured = true;
        mission.bountyCredit += dead.bounty || 0;
        state.capturedVillains.push({
          id: `boss-capture-${Date.now()}`,
          name: dead.name || "理쒖쥌 蹂댁뒪",
          value: dead.bounty || 0,
          isBoss: true,
          rehabLevel: 0,
        });
      } else if (dead.raidType === "merc" || dead.raidType === "mercBoss") {
        const cap = Math.random() < (dead.raidType === "mercBoss" ? 0.8 : 0.55);
        if (cap) {
          mission.raidBounty += dead.bounty || 0;
          state.capturedVillains.push({
            id: `raid-capture-${Date.now()}-${i}`,
            name: dead.name || "용병단",
            value: dead.bounty || 0,
          });
        }
      }
      if (!dead.isFinalBoss && Math.random() < 0.2) {
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

  const bossLabel = mission.bossCaptured ? "Boss Captured" : (mission.finalBoss?.name || "Boss");
  const mechHud = p.mountedMechId ? ` | Mech ${Math.floor(Math.max(0, p.mechHp))}/${Math.floor(p.mechMaxHp)}${p.mechBroken ? " BROKEN" : ""}` : "";
  ui.missionHud.textContent = `HP ${Math.max(0, Math.floor(p.hp))}/${p.maxHp}${mechHud} | Enemies ${mission.enemies.length} | ${bossLabel} | Progress ${mission.stats.progress}%`;
  renderMissionSkills();

  if (p.hp <= 0) endMission(false, "?덉뼱濡쒓? ?곕윭議뚯뒿?덈떎.");
  if (mission.bossCaptured || mission.enemies.length === 0) endMission(true, "吏???섎났 ?꾨즺");
}

function drawMission() {
  const ctx = ui.canvas.getContext("2d");
  ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
  ctx.fillStyle = "#0a121c";
  ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);
  ctx.save();
  ctx.translate(-mission.camX, -mission.camY);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  for (let x = 0; x <= mission.mapW; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, mission.mapH);
    ctx.stroke();
  }
  for (let y = 0; y <= mission.mapH; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(mission.mapW, y);
    ctx.stroke();
  }

  const p = mission.player;
  const weaponMap = { rifle: "R", carbine: "C", shotgun: "S", blade: "B" };
  ctx.fillStyle = p.color || "#4dd0e1";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Segoe UI";
  ctx.fillText(weaponMap[p.weaponType] || "R", p.x + 14, p.y + 4);

  ctx.strokeStyle = "rgba(77,208,225,.35)";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.firearmRangePx || 220, 0, Math.PI * 2);
  ctx.stroke();

  if (p.defenseType === "돔") {
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
      if (fx.dtype === "버클러") drawArc(26, 0.45, 3);
      else if (fx.dtype === "라운드") drawArc(34, 0.65, 3);
      else if (fx.dtype === "월") {
        ctx.save();
        ctx.translate(fx.x, fx.y);
        ctx.rotate(a);
        ctx.fillRect(20, -26, 10, 52);
        ctx.restore();
      } else if (fx.dtype === "돔") {
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, 76 * (1 + (1 - alpha) * 0.1), 0, Math.PI * 2);
        ctx.stroke();
      } else if (fx.dtype === "스쿠툼") {
        drawArc(34, 0.65, 3);
        ctx.globalAlpha = alpha * 0.5;
        drawArc(42, 0.72, 2);
      } else if (fx.dtype === "스팅가드") {
        drawArc(30, 0.6, 3);
        ctx.beginPath();
        ctx.moveTo(fx.x + Math.cos(a) * 30, fx.y + Math.sin(a) * 30);
        ctx.lineTo(fx.x + Math.cos(a) * 44, fx.y + Math.sin(a) * 44);
        ctx.stroke();
      } else if (fx.dtype === "건실드") {
        drawArc(30, 0.6, 3);
        ctx.beginPath();
        ctx.arc(fx.x + Math.cos(a) * 40, fx.y + Math.sin(a) * 40, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (fx.dtype === "업소브") {
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
    if (e.isFinalBoss) ctx.fillStyle = "#ff2d8b";
    else if (e.raidType === "mercBoss") ctx.fillStyle = "#ff9b3d";
    else if (e.raidType === "merc") ctx.fillStyle = "#ffd059";
    else ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
    if (e.isFinalBoss || e.raidType === "mercBoss") {
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px Segoe UI";
      ctx.fillText(e.name || "Boss", e.x + 14, e.y - 10);
    }
  });
  if (mission.moveTarget) {
    ctx.strokeStyle = "rgba(120,210,255,0.8)";
    ctx.beginPath();
    ctx.arc(mission.moveTarget.x, mission.moveTarget.y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (mission.skillPreview?.radius > 0) {
    ctx.strokeStyle = "rgba(255,228,130,0.9)";
    ctx.beginPath();
    ctx.arc(mission.skillPreview.x, mission.skillPreview.y, mission.skillPreview.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function endMission(success, reason, retreated = false) {
  if (!mission.running) return;
  mission.running = false;
  if (mission.rafId) cancelAnimationFrame(mission.rafId);

  const planet = getPlanetById(mission.planetId);
  const region = planet ? getRegionById(planet, mission.regionId) : null;

  const missionCleared = !!success;
  let rewardCredit = 0;
  let rewardResource = 0;
  if (missionCleared && planet && region) {
    region.restored = true;
    const baseCredit = 240 + region.difficulty * 110;
    const baseResource = 90 + region.difficulty * 45;
    const rate = getRestoreRate(planet);
    const bonus = 1 + rate * 0.4;
    rewardCredit = Math.round(baseCredit * bonus);
    rewardResource = Math.round(baseResource * bonus);
    if (!state.settings.infinite) {
      state.credits += rewardCredit;
      state.resources += rewardResource;
    }
    state.power += 20 + state.powerPlantLevel * 5;
  } else if (retreated && planet && region) {
    const baseCredit = 240 + region.difficulty * 110;
    const baseResource = 90 + region.difficulty * 45;
    const progressRatio = clamp((mission.stats?.progress || 0) / 100, 0.15, 0.6);
    rewardCredit = Math.round(baseCredit * progressRatio);
    rewardResource = Math.round(baseResource * progressRatio);
    if (!state.settings.infinite) {
      state.credits += rewardCredit;
      state.resources += rewardResource;
    }
  } else {
    rewardCredit = 0;
    rewardResource = 0;
  }
  const bountyTotal = (mission.bountyCredit || 0) + (mission.raidBounty || 0);
  if (bountyTotal > 0) {
    rewardCredit += bountyTotal;
    if (!state.settings.infinite) state.credits += bountyTotal;
  }
  const activeMech = mission.player?.mountedMechId ? (state.mechs || []).find((m) => m.id === mission.player.mountedMechId) : null;
  if (activeMech && typeof mission.player?.mechHp === "number") {
    activeMech.currentHp = clamp(Math.round(mission.player.mechHp), 0, activeMech.hp);
  }
  const newCaptured = state.capturedVillains.slice(mission.captureBaseline || 0);
  const mechStatus = activeMech ? `${activeMech.name} durability ${activeMech.currentHp}/${activeMech.hp}` : "No mech mounted";
  if (ui.missionResultBody && ui.missionResultModal) {
    if (ui.missionResultTitle) ui.missionResultTitle.textContent = missionCleared ? "Mission Clear" : retreated ? "Retreated" : "Mission Failed";
    const bossReason = mission.bossCaptured && mission.finalBoss ? `${mission.finalBoss.name} captured bounty paid` : "";
    if (ui.missionResultReason) ui.missionResultReason.textContent = [reason, bossReason].filter(Boolean).join(" / ");
    const raidLine = mission.raidBounty > 0 ? `<div class="base-card"><strong>Mercenary bounty</strong><div>Credit ${mission.raidBounty}</div></div>` : "";
    const capturedLine = newCaptured.length
      ? `<div class="base-card"><strong>Captured / Loot</strong><div>${newCaptured
          .slice(0, 5)
          .map((v) => v.name)
          .join(", ")}${newCaptured.length > 5 ? ` +${newCaptured.length - 5}` : ""}</div></div>`
      : "";
    ui.missionResultBody.innerHTML = `
      <div class="base-card"><strong>泥섏튂????/strong><div>${mission.stats?.kills || 0}</div></div>
      <div class="base-card"><strong>吏꾪뻾??/strong><div>${mission.stats?.progress || 0}%</div></div>
      <div class="base-card"><strong>蹂댁긽</strong><div>?щ젅??${rewardCredit} / ?먯썝 ${rewardResource}</div></div>
      ${mission.bossCaptured && mission.finalBoss ? `<div class="base-card"><strong>理쒖쥌 蹂댁뒪 ?꾩긽湲?/strong><div>${mission.finalBoss.name}: ?щ젅??${mission.bountyCredit}</div></div>` : ""}
      ${raidLine}
      ${capturedLine}
      <div class="base-card"><strong>Mech status</strong><div>${mechStatus}</div></div>
    `;
    ui.missionResultModal.classList.remove("hidden");
  } else {
    alert(`${reason}\nCredit ${rewardCredit} / Resource ${rewardResource}`);
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
    const catalogOriginalHeroIds = new Set(catalog.heroes.filter((u) => u.team === "오리지널").map((u) => u.id));
    const catalogOriginalMercIds = new Set(catalog.mercs.filter((u) => u.team === "오리지널").map((u) => u.id));
    const nonOriginalHeroes = state.heroes.filter((u) => u.team !== "오리지널");
    const nonOriginalMercs = state.mercs.filter((u) => u.team !== "오리지널");
    const fixedOriginalHeroes = state.heroes.filter((u) => catalogOriginalHeroIds.has(u.id));
    const fixedOriginalMercs = state.mercs.filter((u) => catalogOriginalMercIds.has(u.id));
    const missingOriginalHeroes = catalog.heroes.filter((u) => u.team === "오리지널" && !fixedOriginalHeroes.some((x) => x.id === u.id));
    const missingOriginalMercs = catalog.mercs.filter((u) => u.team === "오리지널" && !fixedOriginalMercs.some((x) => x.id === u.id));
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
    classType: "히어로",
    color: "#7dc4ff",
    weaponType: "rifle",
    abilityIcon: "scope",
    level: 1,
    canUseDefense: ["디펜서", "가디언", "버서커", "어썰트"].includes(h.roleClass || h.classType),
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
    ability: "현장 대응",
    classType: "?⑸퀝",
    color: "#a7ffa4",
    weaponType: "carbine",
    abilityIcon: "dash",
    level: 1,
    canUseDefense: ["디펜서", "가디언", "버서커", "어썰트"].includes(m.roleClass || m.classType),
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
    if (!h.roleClass) h.roleClass = "오펜서";
    if (!h.rangeClass) h.rangeClass = "중거리";
    if (!h.classType || h.classType === "히어로") h.classType = h.roleClass;
    if (!h.attribute) h.attribute = "물리";
    if (!h.teamEffect && h.team) h.teamEffect = TEAM_EFFECTS[h.team] || "없음";
    if (h.name && !/[가-힣]/.test(h.name)) h.name = koreanizeName(h.name);
  });
  state.mercs.forEach((m) => {
    if (!m.roleClass) m.roleClass = "?ㅼ빱誘몄뀛";
    if (!m.rangeClass) m.rangeClass = "以묒썝嫄곕━";
    if (!m.classType || m.classType === "?⑸퀝") m.classType = m.roleClass;
    if (!m.attribute) m.attribute = "물리";
    if (!m.teamEffect && m.team) m.teamEffect = TEAM_EFFECTS[m.team] || "없음";
    if (m.name && !/[가-힣]/.test(m.name)) m.name = koreanizeName(m.name);
  });
  if (!Array.isArray(state.inventory)) state.inventory = [];
  state.inventory = state.inventory.map((it) => ({
    itemKind: it.itemKind || it.type || "gear",
    mainType: it.mainType || (it.type === "weapon" ? "臾닿린" : "?λ퉬"),
    subType: it.subType || (it.type === "weapon" ? "legacy" : "legacy"),
    slotType: it.slotType || (it.type === "weapon" ? "firearm" : "gear"),
    icon: it.icon || createItemIcon(it.name?.slice(0, 3) || "아이템", "#435069"),
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
  if (!Array.isArray(state.mechs) || state.mechs.length === 0) {
    state.mechs = [
      { id: "mech-1", name: "MF-01 Aegis", role: "?쒖?", hp: 620, currentHp: 620, atk: 96, def: 62, speed: 38, unlocked: true },
      { id: "mech-2", name: "MF-02 Swift", role: "寃쎈웾", hp: 480, currentHp: 480, atk: 84, def: 44, speed: 54, unlocked: false },
      { id: "mech-3", name: "MF-03 Bastion", role: "以묐웾", hp: 860, currentHp: 860, atk: 118, def: 92, speed: 26, unlocked: false },
    ];
  }
  state.mechs.forEach((m) => {
    if (typeof m.currentHp !== "number") m.currentHp = m.hp;
    m.currentHp = clamp(m.currentHp, 0, m.hp);
  });
  if (!state.activeMechId || !state.mechs.some((m) => m.id === state.activeMechId && m.unlocked)) {
    state.activeMechId = state.mechs.find((m) => m.unlocked)?.id || state.mechs[0]?.id || null;
  }
}

function ensurePlanetState() {
  const catalog = createPlanetCatalog();
  const oldMap = new Map((state.planets || []).map((p) => [p.id, p]));
  state.planets = catalog.map((p) => {
    const old = oldMap.get(p.id);
    const oldRegions = new Map((old?.regions || []).map((r) => [r.id, r]));
    return {
      ...p,
      regions: p.regions.map((r) => ({ ...r, restored: !!oldRegions.get(r.id)?.restored })),
    };
  });
  if (!state.selectedPlanetId || !state.planets.some((p) => p.id === state.selectedPlanetId)) {
    state.selectedPlanetId = state.planets[0]?.id || null;
  }
  const cur = getPlanetById(state.selectedPlanetId);
  if (!cur || !state.selectedRegionId || !cur.regions.some((r) => r.id === state.selectedRegionId)) {
    state.selectedRegionId = cur?.regions[0]?.id || null;
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
  const weaponMap = { rifle: "R", carbine: "C", shotgun: "S", blade: "B" };
  const symbol = weaponMap[unit.weaponType] || "R";
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

function getActiveMech() {
  return (state.mechs || []).find((m) => m.id === state.activeMechId) || null;
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
  if (unit.team === "조디악") return { ...s, atk: Math.round(s.atk * 1.06), speed: Math.round(s.speed * 1.08) };
  if (unit.team === "셈하프") return { ...s, hp: Math.round(s.hp * 1.12), speed: Math.round(s.speed * 1.1) };
  if (unit.team === "게티아") return { ...s, atk: Math.round(s.atk * 1.09), def: Math.round(s.def * 1.08) };
  if (unit.team === "엘리멘탈") return { ...s, atk: Math.round(s.atk * 1.08), hp: Math.round(s.hp * 1.08) };
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
        <div>분류: ${unit.unitType === "merc" ? "용병" : "히어로"} / 역할군 ${unit.roleClass || unit.classType || "-"}</div>
        <div>?ш굅由? <span class="range-chip" style="background:${rangeColor}">${unit.rangeClass || "-"}</span></div>
        <div>?띿꽦: ${unit.attribute || "臾쇰━"} (${ATTRIBUTE_META[(unit.attribute || "臾쇰━").split("/")[0]]?.effect || "-"})</div>
        <div>?덈꺼: ${unit.level || 1}</div>
        <div>怨듦꺽??${s.atk} / 諛⑹뼱??${s.def} / 泥대젰 ${s.hp} / ?ㅽ뵾??${s.speed}</div>
        <div>怨좎쑀 ?λ젰: ${unit.ability || "-"}</div>
      </div>
      <div class="base-card">
        <strong>?</strong>
        <div>${unit.team || "무소속"}</div>
        <div>?명듃 ?④낵: ${unit.teamEffect || "?놁쓬"}</div>
        <div>현재 발동 상태: ${teamActive ? "발동 중" : "비활성 (같은 팀 2명 이상 필요)"}</div>
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
    alert("크레딧이 부족합니다.");
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
    alert("크레딧이 부족합니다.");
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
          <div>난이도 ${"★".repeat(state.emergencyQuest.stars)} (${state.emergencyQuest.stars}성)</div>
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
          <div>난이도 ${"★".repeat(q.stars)} (${q.stars}성)</div>
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
            <span>${u.unitType === "merc" ? "용병" : "히어로"}</span>
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
                const mIcon = h.equippedMelee ? "M:ON" : "M:--";
                const fIcon = h.equippedFirearm ? "F:ON" : "F:--";
                const dIcon = h.canUseDefense ? (h.equippedDefense ? "D:ON" : "D:--") : "D:NA";
                const g1Icon = h.equippedGears?.[0] ? "G1:ON" : "G1:--";
                const g2Icon = h.equippedGears?.[1] ? "G2:ON" : "G2:--";
                return `<button class="hero-select${selected}" data-action="select-hero" data-id="${h.id}">
                  <strong>${h.name}</strong>
                  <div>怨?${s.atk} / 諛?${s.def} / 泥?${s.hp} / ??${s.speed}</div>
                  <div>?λ젰: ${h.ability || "-"}</div>
                  <div class="equip-icons" title="洹쇱젒/珥앷린/諛⑹뼱/?λ퉬1/?λ퉬2">${mIcon} ${fIcon} ${dIcon} ${g1Icon} ${g2Icon}</div>
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
                    <button data-action="equip-item" data-id="${it.id}">${selectedHero ? selectedHero.name : "히어로"} 장착</button>
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
      <button data-action="hire-merc" data-id="${m.id}" ${hired ? "disabled" : ""}>${hired ? "고용중" : "고용"}</button></div>`;
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
    html += `<div class="base-card"><strong>???/?? ??</strong><div class="hangar-visual-grid">`;
    state.hangarShips.forEach((s) => {
      const active = state.activeShipId === s.id ? " active" : "";
      html += `<div class="hangar-visual ship${active}">
        <div class="hangar-art ship-art"></div>
        <strong>${s.name}</strong>
        <div>?? ${s.capacity}</div>
      </div>`;
    });
    (state.mechs || []).forEach((m) => {
      const activeMech = state.activeMechId === m.id ? " active" : "";
      const curHp = typeof m.currentHp === "number" ? Math.max(0, Math.round(m.currentHp)) : m.hp;
      const repairCost = Math.max(60, Math.round((m.hp - curHp) * 1.4));
      html += `<div class="hangar-visual mech ${m.unlocked ? "" : "locked"}">
        <div class="hangar-art mech-art"></div>
        <strong>${m.name}</strong>
        <div>${m.role} / HP ${curHp}/${m.hp} / ATK ${m.atk}</div>
        <button data-action="select-mech-active" data-id="${m.id}" ${!m.unlocked || activeMech ? "disabled" : ""}>${activeMech ? "선택됨" : "탑승 메카 지정"}</button>
        <button data-action="repair-mech" data-id="${m.id}" ${!m.unlocked || curHp >= m.hp ? "disabled" : ""}>수리 (${repairCost})</button>
      </div>`;
    });
    html += `</div></div>`;
    state.hangarShips.forEach((s) => {
      html += `<div class="base-card">
        <strong>${s.name}</strong>
        <div>理쒕? 異쒓꺽 ?몄썝: ${s.capacity}</div>
        <div>상태: ${s.unlocked ? "이용 가능" : "미해금"}</div>
        <button data-action="select-ship" data-id="${s.id}" ${!s.unlocked || state.activeShipId === s.id ? "disabled" : ""}>
          ${state.activeShipId === s.id ? "선택됨" : "출격 우주선으로 선택"}
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
        <div class="row">
          ${v.isBoss ? `<button data-action="rehab-boss" data-id="${v.id}">援먰솕 ?쒕룄(?뚮젅?댁뼱釉??꾪솚)</button>` : ""}
          <button data-action="release-villain" data-id="${v.id}">?앸갑(?щ젅??+50)</button>
        </div></div>`;
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
  const missionResultMainBtn = document.getElementById("missionResultMainBtn");
  if (missionResultMainBtn) {
    missionResultMainBtn.addEventListener("click", () => {
      if (ui.missionResultModal) ui.missionResultModal.classList.add("hidden");
      showScreen("main");
    });
  }
  document.getElementById("retreatBtn").addEventListener("click", () => {
    if (!mission.running) return;
    if (ui.missionLoadingOverlay) ui.missionLoadingOverlay.classList.remove("hidden");
    setTimeout(() => {
      if (ui.missionLoadingOverlay) ui.missionLoadingOverlay.classList.add("hidden");
      endMission(false, "중도 퇴각", true);
    }, 800);
  });
  if (ui.canvas) {
    ui.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!mission.running || !mission.player) return;
      const rect = ui.canvas.getBoundingClientRect();
      const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      mission.moveTarget = { x: clamp(world.x, 20, mission.mapW - 20), y: clamp(world.y, 20, mission.mapH - 20) };
    });
    ui.canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || !mission.running) return;
      mission.draggingMap = true;
      mission.dragStartX = e.clientX;
      mission.dragStartY = e.clientY;
      mission.dragCamX = mission.camX;
      mission.dragCamY = mission.camY;
    });
    window.addEventListener("mousemove", (e) => {
      if (!mission.draggingMap) return;
      mission.camX = mission.dragCamX - (e.clientX - mission.dragStartX);
      mission.camY = mission.dragCamY - (e.clientY - mission.dragStartY);
      clampCamera();
    });
    window.addEventListener("mouseup", () => {
      mission.draggingMap = false;
    });
    ui.canvas.addEventListener("dragover", (e) => {
      if (!mission.running || !mission.draggingSkillId) return;
      e.preventDefault();
      const rect = ui.canvas.getBoundingClientRect();
      const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      const sk = mission.skills.find((s) => s.id === mission.draggingSkillId);
      mission.skillPreview = sk && sk.radius > 0 ? { x: w.x, y: w.y, radius: sk.radius } : null;
    });
    ui.canvas.addEventListener("drop", (e) => {
      if (!mission.running || !mission.draggingSkillId) return;
      e.preventDefault();
      const rect = ui.canvas.getBoundingClientRect();
      const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      castSkill(mission.draggingSkillId, w.x, w.y);
      mission.draggingSkillId = null;
      mission.skillPreview = null;
    });
  }
  if (ui.missionSkillCards) {
    ui.missionSkillCards.addEventListener("dragstart", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const card = t.closest("[data-skill-id]");
      if (!(card instanceof HTMLElement)) return;
      mission.draggingSkillId = card.dataset.skillId || null;
    });
    ui.missionSkillCards.addEventListener("dragend", () => {
      mission.draggingSkillId = null;
      mission.skillPreview = null;
    });
  }
  if (ui.emergencyRepairBtn) {
    ui.emergencyRepairBtn.addEventListener("click", () => {
      if (!mission.running || !mission.player?.mountedMechId || mission.player.mechMaxHp <= 0) return;
      const need = Math.max(120, Math.round((mission.player.mechMaxHp - mission.player.mechHp) * 0.35));
      if (need <= 0) return;
      if (!spendCredits(need)) {
        alert(`?щ젅??遺議?(?꾩슂 ${need})`);
        return;
      }
      mission.player.mechHp = mission.player.mechMaxHp;
      mission.player.mechBroken = false;
      mission.player.maxHp = Math.round(mission.player.baseHp * 1.75);
      mission.player.speed = Math.round(mission.player.baseSpeed * 0.92);
      mission.player.attack = Math.round(mission.player.baseAttack * 1.25);
      mission.player.defense = Math.round(mission.player.baseDefense * 1.3);
      alert(`湲닿툒 ?섎━ ?꾨즺 (-${need} ?щ젅??`);
    });
  }

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
      if (!spendCredits(cost)) alert("크레딧이 부족합니다.");
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

    if (action === "select-mech-active" && id) {
      const mech = (state.mechs || []).find((m) => m.id === id && m.unlocked);
      if (mech) state.activeMechId = mech.id;
    }

    if (action === "repair-mech" && id) {
      const mech = (state.mechs || []).find((m) => m.id === id && m.unlocked);
      if (mech) {
        const curHp = typeof mech.currentHp === "number" ? mech.currentHp : mech.hp;
        const need = Math.max(0, mech.hp - curHp);
        if (need > 0) {
          const cost = Math.max(60, Math.round(need * 1.4));
          if (!spendCredits(cost)) alert("크레딧이 부족합니다.");
          else mech.currentHp = mech.hp;
        }
      }
    }

    if (action === "hire-merc") {
      const spec = MERC_POOL.find((m) => m.id === id);
      if (spec && !state.mercs.some((m) => m.sourceId === id)) {
        if (!spendCredits(spec.contract)) alert("크레딧이 부족합니다.");
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
      if (!spendCredits(2200)) alert("크레딧이 부족합니다.");
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

    if (action === "rehab-boss") {
      const idx = state.capturedVillains.findIndex((v) => v.id === id && v.isBoss);
      if (idx >= 0) {
        const v = state.capturedVillains[idx];
        const success = Math.random() < 0.72;
        if (success) {
          state.mercs.push({
            id: `boss-merc-${Date.now()}`,
            name: `${v.name} (援먰솕)`,
            unitType: "merc",
            rank: "보스",
            contract: 0,
            atk: 34,
            def: 20,
            hp: 220,
            speed: 18,
            ability: "지배자 사격",
            roleClass: "스페셜",
            rangeClass: "중거리",
            attribute: "물리",
            team: "rehab",
            teamEffect: "교화 링크",
            classType: "스페셜",
            color: "#d86cff",
            weaponType: "rifle",
            abilityIcon: "scope",
            level: 1,
            deployed: false,
          });
          alert("援먰솕 ?깃났: ?뚮젅?댁뼱釉??⑸퀝?쇰줈 ?꾪솚?섏뿀?듬땲??");
          state.capturedVillains.splice(idx, 1);
        } else {
          v.rehabLevel = (v.rehabLevel || 0) - 1;
          alert("援먰솕 ?ㅽ뙣: ?ㅼ쓬???ㅼ떆 ?쒕룄?섏꽭??");
        }
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
    const eq = target.closest("[data-equipped-id]");
    if (eq) {
      const itemId = eq.getAttribute("data-equipped-id");
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
          renderFacilityContent(state.baseTab);
          saveState();
          return;
        }
        const equipTarget = target.closest("[data-equip-slot]");
        if (equipTarget) {
          const heroId = equipTarget.getAttribute("data-hero-id");
          const slotKey = equipTarget.getAttribute("data-equip-slot");
          if (heroId && slotKey) {
            const moved = getHeroSlotItem(getHeroById(payload.heroId), payload.slotKey);
            if (moved) {
              unequipHeroSlot(payload.heroId, payload.slotKey);
              equipItemToHeroSlot(heroId, moved.id, slotKey);
              state.inventory = state.inventory.filter((it) => it.id !== moved.id);
            }
            renderFacilityContent(state.baseTab);
            saveState();
          }
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
        if (heroId && slotKey) equipItemToHeroSlot(heroId, itemId, slotKey);
      } else {
        const heroTarget = target.closest(".hero-select");
        const heroArea = target.closest(".hero-slot-area");
        const heroId = heroTarget?.dataset.id || heroArea?.dataset.dropHero || state.hqSelectedHeroId;
        if (heroId) equipItemToHero(heroId, itemId);
        state.hqSelectedHeroId = heroId;
      }
      renderFacilityContent(state.baseTab);
      saveState();
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
  ensurePlanetState();
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

