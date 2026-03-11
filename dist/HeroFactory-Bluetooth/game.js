const SAVE_KEY = "hf_mvp_save_v1";
const PROGRESS_SAVE_KEY = "hf_progress_v1";
const MANUAL_SAVE_KEY = "hf_manual_saves_v1";
const LATEST_CHECKPOINT_CACHE_KEY = "hf_latest_checkpoint_cache_v1";
const LATEST_CHECKPOINT_DATA_ID = "__latest_checkpoint_cache__";
const AUTO_RUNTIME_META_KEY = "hf_auto_runtime_meta_v1";
const AUTO_RUNTIME_STATE_ID = "__auto_runtime_latest__";
const MANUAL_SAVE_LIMIT = 12;
const MANUAL_SAVE_DB_NAME = "hf_manual_saves_db_v1";
const MANUAL_SAVE_DB_STORE = "slots";
const PLANT_MAX_ACCUM_HOURS = 24;
const PLANT_MAX_LEVEL = 100;

const DIFFICULTY_META = {
  invincible: { label: "무적", enemyScale: 0.62, rewardScale: 1.6, facilityScale: 1.35, nightmare: false },
  very_easy: { label: "매우 쉬움", enemyScale: 0.74, rewardScale: 1.35, facilityScale: 1.28, nightmare: false },
  easy: { label: "쉬움", enemyScale: 0.86, rewardScale: 1.18, facilityScale: 1.16, nightmare: false },
  normal: { label: "보통", enemyScale: 1, rewardScale: 1, facilityScale: 1, nightmare: false },
  hard: { label: "어려움", enemyScale: 1.22, rewardScale: 0.85, facilityScale: 0.85, nightmare: false },
  very_hard: { label: "매우 어려움", enemyScale: 1.46, rewardScale: 0.72, facilityScale: 0.68, nightmare: false },
  nightmare: { label: "악몽", enemyScale: 1.85, rewardScale: 0.58, facilityScale: 0.5, nightmare: true },
};
const DIFF_SCALE = { easy: DIFFICULTY_META.easy.enemyScale, normal: DIFFICULTY_META.normal.enemyScale, hard: DIFFICULTY_META.hard.enemyScale };

function normalizeDifficultyValue(value) {
  const v = String(value || "normal").trim();
  const map = {
    "무적": "invincible",
    "매우 쉬움": "very_easy",
    "쉬움": "easy",
    "보통": "normal",
    "어려움": "hard",
    "매우 어려움": "very_hard",
    "악몽": "nightmare",
    easy: "easy",
    normal: "normal",
    hard: "hard",
    very_easy: "very_easy",
    very_hard: "very_hard",
    nightmare: "nightmare",
    invincible: "invincible",
  };
  return map[v] || "normal";
}

function getDifficultyMeta(value = state?.settings?.difficulty) {
  const id = normalizeDifficultyValue(value);
  return DIFFICULTY_META[id] || DIFFICULTY_META.normal;
}

function isGodModeActive() {
  return !!state?.settings?.godMode || normalizeDifficultyValue(state?.settings?.difficulty) === "invincible";
}

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

const QUEST_OBJECTIVE_POOL = [
  "capture_total",
  "capture_tier",
  "capture_tier",
  "defeat_total",
  "restore_region",
  "capture_targets",
];

const RESOURCE_DEFS = {
  terra_core: { name: "테라코어", usage: "기초 프레임/범용 강화에 사용", type: "terra" },
  soi_ore: { name: "볼케이늄", usage: "소이 계열 강화", type: "attribute" },
  jagi_ore: { name: "마그네실", usage: "자기 계열 강화", type: "attribute" },
  binggyeol_ore: { name: "크라이오나이트", usage: "빙결 계열 강화", type: "attribute" },
  sanseong_ore: { name: "코로젤", usage: "산성 계열 강화", type: "attribute" },
  pungap_ore: { name: "에어리움", usage: "풍압 계열 강화", type: "attribute" },
  sunaeng_ore: { name: "아쿠아리온", usage: "수냉 계열 강화", type: "attribute" },
  cheolgap_ore: { name: "아다만코어", usage: "철갑 계열 강화", type: "attribute" },
  choneung_ore: { name: "사이코실", usage: "초능 계열 강화", type: "attribute" },
  eumpa_ore: { name: "레조늄", usage: "음파 계열 강화", type: "attribute" },
  junglyeok_ore: { name: "그래비토늄", usage: "중력 계열 강화", type: "attribute" },
  seomgwang_ore: { name: "루미네이트", usage: "섬광 계열 강화", type: "attribute" },
  yeonmak_ore: { name: "녹스더스트", usage: "연막 계열 강화", type: "attribute" },
  mulri_ore: { name: "티타노스", usage: "물리 계열 강화", type: "attribute" },
  void_relay: { name: "보이드 릴레이", usage: "고급 코어/전설 계열 제작 보조", type: "special" },
};

const PLANET_RESOURCE_BY_PLANET = {
  p1: "terra_core",
  p2: "soi_ore",
  p3: "binggyeol_ore",
  p4: "void_relay",
};

const PLANET_RESOURCE_BY_NAME = {
  "네오 테라": "terra_core",
  "홀리 테라": "terra_core",
  폼페이오: "soi_ore",
  메트로노스: "jagi_ore",
  "프로즌 월드": "binggyeol_ore",
  블루오션: "sunaeng_ore",
  "멜튼 아마존": "sanseong_ore",
  마르디오: "pungap_ore",
  미케네스: "cheolgap_ore",
  뮤지움: "eumpa_ore",
  파라다이스: "seomgwang_ore",
  헬: "yeonmak_ore",
  에인션트: "mulri_ore",
};
const PLANET_THEME_CONFIG = {
  p1: {
    key: "neo_terra",
    name: "도시 폐허",
    primaryAttr: "물리",
    bgTop: "#2f3a48",
    bgMid: "#5f5a4c",
    bgBottom: "#2f4557",
    patchColors: ["#566372", "#6e6652", "#4e6174"],
    obstacleMain: "ruin",
    obstacleAltA: "rock",
    obstacleAltB: "tree",
    hazardType: "",
    hazardAttr: "",
  },
  p2: {
    key: "pompeio",
    name: "화산 지대",
    primaryAttr: "소이",
    bgTop: "#5e2618",
    bgMid: "#7b3a22",
    bgBottom: "#2f1f1a",
    patchColors: ["#8b3d27", "#b2602e", "#4d2418"],
    obstacleMain: "lava_ore",
    obstacleAltA: "lava_ore",
    obstacleAltB: "rock",
    hazardType: "lava_ore",
    hazardAttr: "소이",
  },
  p3: {
    key: "ice_front",
    name: "빙결 지대",
    primaryAttr: "빙결",
    bgTop: "#1f3a56",
    bgMid: "#406f8e",
    bgBottom: "#1f2f46",
    patchColors: ["#6bb3d6", "#8fd8f0", "#3f6f94"],
    obstacleMain: "ice_spike",
    obstacleAltA: "ice_spike",
    obstacleAltB: "rock",
    hazardType: "ice_spike",
    hazardAttr: "빙결",
  },
  p4: {
    key: "eclipse",
    name: "보이드 정거장",
    primaryAttr: "초능",
    bgTop: "#241a3c",
    bgMid: "#3a2e55",
    bgBottom: "#1b1630",
    patchColors: ["#5f4c86", "#785fa8", "#3a2f5e"],
    obstacleMain: "void_crystal",
    obstacleAltA: "void_crystal",
    obstacleAltB: "rock",
    hazardType: "void_crystal",
    hazardAttr: "초능",
  },
};
const PLANET_THEME_BY_ATTRIBUTE = {
  물리: {
    key: "attr-physical",
    name: "황무지 전선",
    primaryAttr: "물리",
    bgTop: "#37414e",
    bgMid: "#67604f",
    bgBottom: "#2e4354",
    patchColors: ["#596273", "#736955", "#4f6377"],
    obstacleMain: "ruin",
    obstacleAltA: "rock",
    obstacleAltB: "tree",
    hazardType: "",
    hazardAttr: "",
  },
  소이: {
    key: "attr-fire",
    name: "화산 지대",
    primaryAttr: "소이",
    bgTop: "#5e2618",
    bgMid: "#7b3a22",
    bgBottom: "#2f1f1a",
    patchColors: ["#8b3d27", "#b2602e", "#4d2418"],
    obstacleMain: "lava_ore",
    obstacleAltA: "lava_ore",
    obstacleAltB: "rock",
    hazardType: "lava_ore",
    hazardAttr: "소이",
  },
  빙결: {
    key: "attr-ice",
    name: "빙결 지대",
    primaryAttr: "빙결",
    bgTop: "#1f3a56",
    bgMid: "#406f8e",
    bgBottom: "#1f2f46",
    patchColors: ["#6bb3d6", "#8fd8f0", "#3f6f94"],
    obstacleMain: "ice_spike",
    obstacleAltA: "ice_spike",
    obstacleAltB: "rock",
    hazardType: "ice_spike",
    hazardAttr: "빙결",
  },
  초능: {
    key: "attr-psy",
    name: "보이드 정거장",
    primaryAttr: "초능",
    bgTop: "#241a3c",
    bgMid: "#3a2e55",
    bgBottom: "#1b1630",
    patchColors: ["#5f4c86", "#785fa8", "#3a2f5e"],
    obstacleMain: "void_crystal",
    obstacleAltA: "void_crystal",
    obstacleAltB: "rock",
    hazardType: "void_crystal",
    hazardAttr: "초능",
  },
  자기: {
    key: "attr-magnet",
    name: "전자 폭풍 지대",
    primaryAttr: "자기",
    bgTop: "#2a3948",
    bgMid: "#3d5368",
    bgBottom: "#1c2734",
    patchColors: ["#5b7e9f", "#48637e", "#2e4257"],
    obstacleMain: "electro_pillar",
    obstacleAltA: "rock",
    obstacleAltB: "steel_scrap",
    hazardType: "electro_pillar",
    hazardAttr: "자기",
  },
  산성: {
    key: "attr-acid",
    name: "부식 늪지",
    primaryAttr: "산성",
    bgTop: "#223b24",
    bgMid: "#355a2c",
    bgBottom: "#1b2a1f",
    patchColors: ["#6cbf4d", "#4f8f3b", "#2e5530"],
    obstacleMain: "acid_pool",
    obstacleAltA: "tree",
    obstacleAltB: "rock",
    hazardType: "acid_pool",
    hazardAttr: "산성",
  },
  풍압: {
    key: "attr-wind",
    name: "폭풍 협곡",
    primaryAttr: "풍압",
    bgTop: "#334a57",
    bgMid: "#5b7f88",
    bgBottom: "#1f323f",
    patchColors: ["#87bcc8", "#6ea0b1", "#4f7b8f"],
    obstacleMain: "storm_spire",
    obstacleAltA: "rock",
    obstacleAltB: "tree",
    hazardType: "storm_spire",
    hazardAttr: "풍압",
  },
  수냉: {
    key: "attr-water",
    name: "침수 지대",
    primaryAttr: "수냉",
    bgTop: "#1d3958",
    bgMid: "#29608f",
    bgBottom: "#15304a",
    patchColors: ["#5e9fdd", "#3e7bbd", "#2e5c96"],
    obstacleMain: "aqua_vent",
    obstacleAltA: "rock",
    obstacleAltB: "tree",
    hazardType: "aqua_vent",
    hazardAttr: "수냉",
  },
  철갑: {
    key: "attr-armor",
    name: "강철 폐기장",
    primaryAttr: "철갑",
    bgTop: "#3e3531",
    bgMid: "#5e4a40",
    bgBottom: "#2a2421",
    patchColors: ["#8a6b58", "#6f5a4d", "#4f433c"],
    obstacleMain: "steel_scrap",
    obstacleAltA: "rock",
    obstacleAltB: "ruin",
    hazardType: "",
    hazardAttr: "철갑",
  },
  음파: {
    key: "attr-sonic",
    name: "공명 협곡",
    primaryAttr: "음파",
    bgTop: "#3f2f2a",
    bgMid: "#6a4b3a",
    bgBottom: "#2b241f",
    patchColors: ["#b88058", "#8f684f", "#664a3d"],
    obstacleMain: "sonic_rock",
    obstacleAltA: "rock",
    obstacleAltB: "ruin",
    hazardType: "sonic_rock",
    hazardAttr: "음파",
  },
  중력: {
    key: "attr-gravity",
    name: "중력 왜곡대",
    primaryAttr: "중력",
    bgTop: "#2a2140",
    bgMid: "#46356b",
    bgBottom: "#1f1833",
    patchColors: ["#8365bf", "#684da0", "#4d3a7b"],
    obstacleMain: "gravity_well",
    obstacleAltA: "void_crystal",
    obstacleAltB: "rock",
    hazardType: "gravity_well",
    hazardAttr: "중력",
  },
  섬광: {
    key: "attr-flash",
    name: "광휘 지대",
    primaryAttr: "섬광",
    bgTop: "#4e5a62",
    bgMid: "#7f8a8f",
    bgBottom: "#2d3439",
    patchColors: ["#c6d0d8", "#aeb8c0", "#8a969f"],
    obstacleMain: "flash_prism",
    obstacleAltA: "rock",
    obstacleAltB: "ruin",
    hazardType: "flash_prism",
    hazardAttr: "섬광",
  },
  연막: {
    key: "attr-smoke",
    name: "암막 오염지",
    primaryAttr: "연막",
    bgTop: "#252a31",
    bgMid: "#383f4a",
    bgBottom: "#171c23",
    patchColors: ["#646d7a", "#505965", "#3d4652"],
    obstacleMain: "smoke_vent",
    obstacleAltA: "rock",
    obstacleAltB: "tree",
    hazardType: "smoke_vent",
    hazardAttr: "연막",
  },
};
const PLANET_RESTORE_MILESTONES = [25, 50, 75, 100];
const NEO_TERRA_REGION_TEMPLATE = [
  { id: "p1-r1", name: "코어 지구", difficulty: 1 },
  { id: "p1-r2", name: "상층 구역", difficulty: 1 },
  { id: "p1-r3", name: "공업 지대", difficulty: 2 },
  { id: "p1-r4", name: "자원 터널", difficulty: 2 },
  { id: "p1-r5", name: "하부 주거층", difficulty: 3 },
  { id: "p1-r6", name: "데이터 허브", difficulty: 3 },
  { id: "p1-r7", name: "정화 플랜트", difficulty: 4 },
  { id: "p1-r8", name: "방어 링", difficulty: 4 },
  { id: "p1-r9", name: "중앙 격리구", difficulty: 5 },
  { id: "p1-r10", name: "오메가 코어", difficulty: 6 },
];

const RESOURCE_BY_ATTRIBUTE = {
  소이: "soi_ore",
  자기: "jagi_ore",
  빙결: "binggyeol_ore",
  산성: "sanseong_ore",
  풍압: "pungap_ore",
  수냉: "sunaeng_ore",
  철갑: "cheolgap_ore",
  초능: "choneung_ore",
  음파: "eumpa_ore",
  중력: "junglyeok_ore",
  섬광: "seomgwang_ore",
  연막: "yeonmak_ore",
  물리: "mulri_ore",
};
const ATTRIBUTE_BY_RESOURCE = Object.entries(RESOURCE_BY_ATTRIBUTE).reduce((acc, [attr, rid]) => {
  acc[rid] = attr;
  return acc;
}, {});

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
  "베후이야","옐리엘","시타엘","엘레미야","마하시야","렐라헬","아카이야","카헤텔","하지엘","알라디야","라우비야","하하이야",
  "예잘렐","메바헬","하리엘","하카미야","라위야","칼리엘","레우비야","파할리야","넬카엘","예이아이엘","멜라헬","하헤우이야",
  "니트하이야","하아이야","예라텔","세헤이야","레이이엘","오마엘","레카벨","바사리야","예후이야","레하히야","카바키야","메나델",
  "아니엘","하미야","레하엘","이에아젤","하하헬","미카엘","브울리야","옐라히야","셀리아","아리엘","아살리야","미하엘",
  "베후엘","다니엘","하하시야","이마미야","나나엘","니타엘","메바히야","포이엘","네마미야","예이알렐","하라헬","미츠라엘",
  "우마벨","이아헬","아나우엘","메히엘","다마비야","마나켈","에야엘","하부히야","로켈","야바미야","하이아이엘","무미야",
];
const GOETIA_NAMES = [
  "바엘","아가레스","바사고","사미기나","마르바스","발레포르","아몬","바르바토스","파이몬","부에르","구시온","시트리",
  "벨레트","레라이에","엘리고스","제파르","보티스","바틴","살로스","푸르손","마락스","이포스","아이무","나베리우스",
  "글라시아라볼라스","부네","로노베","베리트","아스타로트","포르네우스","포라스","아스모데우스","가프","푸르푸르","마르코시아스","스토라스",
  "페넥스","할파스","말파스","라우무","포칼로르","베파르","사브나크","샥스","비네","비프론스","부알","하겐티",
  "크로셀","푸르카스","발람","알로케스","카이미","무르무르","오로바스","그레모리","오세","아미","오리아스","바푸라",
  "자간","발락","안드라스","플라우로스","안드레알푸스","키메예스","암두시아스","벨리알","데카라비아","세에레","단탈리온","안드로말리우스",
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
  const fixedMeleeType = MELEE_TYPES[index % MELEE_TYPES.length]?.key || "소드";
  const fixedFirearmType = FIREARM_TYPES[index % FIREARM_TYPES.length]?.key || firearmForRangeFixed(rangeClass);
  const canUseDefense = index % 2 === 0;
  const codexKey = `${unitType}|${fixedFirearmType}|${fixedMeleeType}|${canUseDefense ? 1 : 0}|${rangeClass}|${attrBase}|${roleClass}`;
  return {
    id: `${team}-${name}`.replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase() + `-${index}`,
    sourceId: `${team}-${index}`,
    name: displayName,
    unitType,
    team,
    teamEffect: TEAM_EFFECTS[team] || "없음",
    roleClass,
    rangeClass,
    fixedMeleeType,
    fixedFirearmType,
    codexKey,
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
    canUseDefense,
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
  { key: "클레이모어", range: 2.2, atk: 12, aspd: 0.7, pattern: "부채꼴", trait: "공격 중 피격 방어 판정" },
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

const REQUIRED_CORE_SKILL_NAMES = [
  "데미지 코어",
  "실드 코어",
  "대쉬 코어",
  "클록 코어",
  "소나 코어",
  "그래비티 코어",
  "스팀 코어",
  "캐슬 코어",
  "페이즈 코어",
  "홀로 코어",
  "레이저 코어",
  "플레임 코어",
  "플라이트 코어",
  "소드 코어",
  "살보 코어",
  "스마트 코어",
  "업그레이드 코어",
];
const CORE_SKILL_NAMES = [...REQUIRED_CORE_SKILL_NAMES];

let UNIT_CODEX_CACHE = null;
let MECH_CODEX_CACHE = null;

const MECH_MODULE_BASES = [
  { name: "방호장", atk: 0, def: 10, hp: 70, speed: -1, trait: "실드 효율 증가" },
  { name: "과부하", atk: 16, def: -3, hp: 0, speed: 2, trait: "공격 성능 상승" },
  { name: "후연소", atk: 6, def: 0, hp: 0, speed: 5, trait: "기동성 강화" },
  { name: "나노수복", atk: 0, def: 6, hp: 60, speed: 0, trait: "자동 복구" },
  { name: "조준연결", atk: 12, def: 0, hp: 0, speed: 1, trait: "조준 보정" },
  { name: "탄도강화", atk: 10, def: 0, hp: 0, speed: 0, trait: "연사 안정화" },
  { name: "펄스수호", atk: 0, def: 9, hp: 40, speed: 0, trait: "피격 완화" },
  { name: "플럭스엔진", atk: 4, def: 0, hp: 0, speed: 4, trait: "가속 강화" },
  { name: "충격증폭", atk: 9, def: 1, hp: 0, speed: 0, trait: "넉백/경직 강화" },
  { name: "관통증폭", atk: 11, def: 0, hp: 0, speed: 0, trait: "방어 관통 강화" },
  { name: "냉각순환", atk: 0, def: 4, hp: 20, speed: 1, trait: "스킬 과열 완화" },
  { name: "에너지절감", atk: 0, def: 3, hp: 25, speed: 1, trait: "모듈 소모 절감" },
  { name: "응급차폐", atk: 0, def: 12, hp: 30, speed: -1, trait: "위기 시 차폐" },
  { name: "반동억제", atk: 5, def: 0, hp: 0, speed: 1, trait: "사격 정확도 향상" },
  { name: "추적보정", atk: 7, def: 0, hp: 0, speed: 1, trait: "유도 성능 향상" },
  { name: "근접가속", atk: 8, def: 1, hp: 0, speed: 2, trait: "근접 연타 가속" },
  { name: "요격제어", atk: 4, def: 5, hp: 20, speed: 0, trait: "투사체 요격 강화" },
  { name: "정밀안정", atk: 10, def: 0, hp: 0, speed: 0, trait: "치명타 안정화" },
  { name: "격돌프레임", atk: 7, def: 4, hp: 35, speed: -1, trait: "충돌 내구 강화" },
  { name: "방열블록", atk: 3, def: 3, hp: 30, speed: 0, trait: "지속사격 열 제어" },
  { name: "중력안정", atk: 6, def: 2, hp: 25, speed: 0, trait: "중력 반동 완화" },
  { name: "파장동기", atk: 8, def: 1, hp: 10, speed: 1, trait: "음파 동기화" },
  { name: "연막분사", atk: 0, def: 5, hp: 35, speed: 2, trait: "연막 전개 강화" },
  { name: "섬광충전", atk: 6, def: 0, hp: 0, speed: 1, trait: "섬광 축적 강화" },
  { name: "수냉펌프", atk: 0, def: 4, hp: 45, speed: 1, trait: "수냉 회복 강화" },
  { name: "소이혼합", atk: 11, def: 0, hp: 0, speed: 0, trait: "소이 지속 피해 강화" },
  { name: "산성혼합", atk: 10, def: 0, hp: 0, speed: 0, trait: "산성 융해 강화" },
  { name: "자기코일", atk: 9, def: 0, hp: 0, speed: 1, trait: "연쇄 전격 강화" },
  { name: "빙결핵", atk: 7, def: 2, hp: 15, speed: 0, trait: "빙결 누적 강화" },
  { name: "풍압노즐", atk: 6, def: 0, hp: 0, speed: 2, trait: "풍압 넉백 강화" },
  { name: "철갑강화", atk: 10, def: 2, hp: 20, speed: -1, trait: "철갑 관통 강화" },
  { name: "초능증폭", atk: 8, def: 1, hp: 0, speed: 1, trait: "마력 효율 강화" },
  { name: "음파발진", atk: 7, def: 1, hp: 10, speed: 1, trait: "음파 전파 강화" },
  { name: "중력코어링", atk: 6, def: 2, hp: 20, speed: 0, trait: "흡인력 강화" },
  { name: "격자방벽", atk: 0, def: 13, hp: 40, speed: -1, trait: "장벽 내구 강화" },
  { name: "추진개량", atk: 4, def: 0, hp: 0, speed: 4, trait: "추진 효율 향상" },
  { name: "동력리미터해제", atk: 14, def: -5, hp: 0, speed: 2, trait: "순간 고화력" },
  { name: "분산제어", atk: 5, def: 3, hp: 20, speed: 0, trait: "피해 분산" },
  { name: "긴급수리킷", atk: 0, def: 4, hp: 60, speed: 0, trait: "피해 시 회복" },
  { name: "전술링크", atk: 8, def: 2, hp: 10, speed: 1, trait: "아군 연계 강화" },
  { name: "정찰드론연동", atk: 6, def: 1, hp: 0, speed: 2, trait: "탐지/시야 강화" },
  { name: "탄창확장", atk: 9, def: 0, hp: 0, speed: 0, trait: "지속 화력 증가" },
  { name: "냉매분사", atk: 3, def: 2, hp: 20, speed: 1, trait: "쿨다운 완화" },
  { name: "패링보조", atk: 6, def: 4, hp: 15, speed: 0, trait: "패링 성공률 향상" },
  { name: "잔광미끼", atk: 4, def: 1, hp: 0, speed: 3, trait: "회피/교란 강화" },
  { name: "도약보조", atk: 5, def: 0, hp: 0, speed: 4, trait: "돌진 보조" },
  { name: "광학위장", atk: 0, def: 3, hp: 20, speed: 2, trait: "은폐 지속 향상" },
  { name: "확산증폭", atk: 8, def: 0, hp: 0, speed: 0, trait: "범위 공격 강화" },
  { name: "집속증폭", atk: 12, def: 0, hp: 0, speed: -1, trait: "단일 피해 강화" },
  { name: "고정포대연동", atk: 11, def: 2, hp: 25, speed: -1, trait: "포격 안정화" },
  { name: "탄성장갑", atk: 0, def: 14, hp: 30, speed: -1, trait: "피해 반동 흡수" },
  { name: "회복증폭", atk: 0, def: 2, hp: 55, speed: 1, trait: "치유 효율 증가" },
];

const MK_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function normalizeMeleeTypeName(name) {
  return name === "츠바이헨더" ? "클레이모어" : name;
}

function replaceZweihanderText(text) {
  if (typeof text !== "string") return text;
  return text.replace(/츠바이헨더/g, "클레이모어");
}

function localizeLegacyMechModuleName(name) {
  if (!name) return name;
  const map = {
    Aegis: "방호장",
    Overdrive: "과부하",
    Afterburn: "후연소",
    "Nano-Repair": "나노수복",
    "Target-Link": "조준연결",
    "Ammo-Forge": "탄도강화",
    "Pulse-Guard": "펄스수호",
    "Flux-Engine": "플럭스엔진",
  };
  let out = String(name);
  Object.entries(map).forEach(([en, ko]) => {
    out = out.replace(en, ko);
  });
  const mkNum = out.match(/MK\.(\d+)/)?.[1];
  if (mkNum) {
    const idx = Number(mkNum) - 1;
    if (idx >= 0 && idx < MK_ROMAN.length) out = out.replace(`MK.${mkNum}`, `MK.${MK_ROMAN[idx]}`);
  }
  return out;
}

function createItemIcon(label, bg = "#2a3e5a", fg = "#fff") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><rect width='160' height='160' rx='20' fill='${bg}'/><text x='80' y='92' text-anchor='middle' font-size='28' font-weight='700' fill='${fg}' font-family='Segoe UI'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function weaponShapeSvg(type, slotType, fg = "#f2f6ff") {
  const t = String(type || "").toUpperCase();
  if (slotType === "melee") {
    if (t === "데거") return `<path d='M84 24 L102 62 L82 58 L72 136 L60 132 L70 56 L50 62 Z' fill='${fg}'/>`;
    if (t === "클레이모어") return `<rect x='72' y='22' width='16' height='84' rx='3' fill='${fg}'/><rect x='60' y='96' width='40' height='10' rx='3' fill='${fg}'/><rect x='74' y='106' width='12' height='32' rx='4' fill='${fg}'/>`;
    if (t === "스피어" || t === "랜스") return `<path d='M80 18 L96 42 L88 44 L88 136 L72 136 L72 44 L64 42 Z' fill='${fg}'/>`;
    if (t === "해머") return `<rect x='56' y='28' width='48' height='26' rx='4' fill='${fg}'/><rect x='74' y='54' width='12' height='84' rx='4' fill='${fg}'/>`;
    if (t === "휩") return `<path d='M34 120 C46 94,64 88,78 78 C90 70,96 60,104 46 C112 32,124 26,138 30' stroke='${fg}' stroke-width='10' fill='none' stroke-linecap='round'/>`;
    if (t === "사이즈") return `<rect x='74' y='26' width='12' height='110' rx='4' fill='${fg}'/><path d='M80 28 C42 30,32 58,42 80 C52 96,72 86,82 64 Z' fill='${fg}'/>`;
    return `<path d='M80 20 L92 46 L88 108 L80 132 L72 108 L68 46 Z' fill='${fg}'/>`;
  }
  if (slotType === "firearm") {
    if (t === "SG") return `<rect x='34' y='70' width='92' height='18' rx='5' fill='${fg}'/><rect x='48' y='88' width='18' height='34' rx='4' fill='${fg}'/>`;
    if (t === "SMG") return `<rect x='36' y='68' width='84' height='16' rx='5' fill='${fg}'/><rect x='66' y='84' width='16' height='40' rx='4' fill='${fg}'/>`;
    if (t === "LMG") return `<rect x='26' y='66' width='108' height='16' rx='5' fill='${fg}'/><rect x='64' y='82' width='16' height='42' rx='4' fill='${fg}'/><rect x='28' y='88' width='26' height='10' rx='4' fill='${fg}'/>`;
    if (t === "DMR" || t === "SR") return `<rect x='24' y='70' width='114' height='12' rx='4' fill='${fg}'/><rect x='54' y='60' width='32' height='8' rx='3' fill='${fg}'/><rect x='70' y='82' width='12' height='40' rx='4' fill='${fg}'/>`;
    if (t === "RL") return `<rect x='32' y='64' width='94' height='22' rx='8' fill='${fg}'/><circle cx='126' cy='75' r='10' fill='none' stroke='${fg}' stroke-width='8'/>`;
    return `<rect x='28' y='68' width='98' height='14' rx='5' fill='${fg}'/><rect x='62' y='82' width='16' height='38' rx='4' fill='${fg}'/>`;
  }
  if (slotType === "defense") {
    if (t === "돔") return `<path d='M80 28 C40 28,26 64,26 92 C26 114,44 130,80 130 C116 130,134 114,134 92 C134 64,120 28,80 28 Z' fill='${fg}'/>`;
    if (t === "월") return `<rect x='44' y='32' width='72' height='100' rx='8' fill='${fg}'/>`;
    if (t === "버클러") return `<circle cx='80' cy='80' r='42' fill='${fg}'/>`;
    if (t === "건실드") return `<rect x='48' y='36' width='56' height='94' rx='8' fill='${fg}'/><rect x='94' y='72' width='32' height='10' rx='3' fill='${fg}'/>`;
    return `<path d='M80 24 L120 42 L120 86 C120 108,102 126,80 136 C58 126,40 108,40 86 L40 42 Z' fill='${fg}'/>`;
  }
  return `<circle cx='80' cy='80' r='28' fill='${fg}'/>`;
}

function createWeaponTypeIcon(type, slotType, options = {}) {
  const typePalette = {
    데거: "#5a2f68",
    소드: "#4d3c7a",
    클레이모어: "#5e334f",
    블레이드: "#403f86",
    스피어: "#2c5c6f",
    랜스: "#2f4b78",
    메이스: "#5f4a34",
    해머: "#69352a",
    휩: "#2f5864",
    사이즈: "#5c2a48",
    SG: "#2f4a62",
    AR: "#2a5f66",
    SMG: "#24616f",
    LMG: "#2a4d7a",
    DMR: "#2f567f",
    SR: "#334278",
    RL: "#6c3a2f",
    버클러: "#6a5a34",
    라운드: "#6c4f2e",
    월: "#7a4638",
    돔: "#4f5f7a",
    스쿠툼: "#6a4a3a",
    스팅가드: "#5e3d36",
    건실드: "#445a74",
    업소브: "#476874",
  };
  const base = slotType === "melee" ? "#3d2747" : slotType === "firearm" ? "#1f3f57" : slotType === "defense" ? "#4f3f27" : "#2a3e5a";
  const bg = options.bg || typePalette[String(type || "")] || base;
  const fg = options.fg || "#f2f6ff";
  const keyText = String(type || "").slice(0, 6);
  const shape = weaponShapeSvg(type, slotType, fg);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${bg}'/><stop offset='1' stop-color='#0f1825'/></linearGradient></defs>
    <rect width='160' height='160' rx='20' fill='url(#g)'/>
    <rect x='10' y='10' width='140' height='140' rx='14' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='3'/>
    ${shape}
    <text x='80' y='148' text-anchor='middle' font-size='16' font-weight='700' fill='rgba(235,245,255,0.94)' font-family='Segoe UI'>${keyText}</text>
  </svg>`;
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
      icon: createWeaponTypeIcon(base.key, category),
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

function createMechWeaponCatalog() {
  const out = [];
  let id = 1;
  const mkStats = [0.95, 1.05, 1.15, 1.28, 1.42];
  const mkName = ["I", "II", "III", "IV", "V"];
  const push = (base, category, idx) => {
    const m = mkStats[idx];
    out.push({
      id: `mw-${id++}`,
      itemKind: "mechWeapon",
      slotType: category,
      weaponType: base.key,
      name: `MX-${base.key}-${mkName[idx]}`,
      mainType: "메카 무장",
      subType: `${category}/${base.key}`,
      icon: createWeaponTypeIcon(base.key, category, { bg: category === "melee" ? "#4f2a62" : category === "firearm" ? "#1f4a66" : "#604721" }),
      atk: Math.round(base.atk * m),
      def: category === "defense" ? Math.round((base.block || 0) * 0.5 * m) : 0,
      hp: 0,
      speed: 0,
      range: Number((base.range * (0.96 + idx * 0.03)).toFixed(2)),
      attackSpeed: Number(((base.aspd || 1) * (0.94 + idx * 0.04)).toFixed(2)),
      block: base.block ? Math.round(base.block * m) : 0,
      blockRadius: base.radius || 0,
      cooldown: base.cd ? Number((base.cd * (1.04 - idx * 0.03)).toFixed(2)) : 0,
      trait: base.trait || "",
      description: `메카 전용 ${base.key} 무장`,
    });
  };
  MELEE_TYPES.forEach((x) => { for (let i = 0; i < 5; i += 1) push(x, "melee", i); });
  FIREARM_TYPES.forEach((x) => { for (let i = 0; i < 5; i += 1) push(x, "firearm", i); });
  DEFENSE_TYPES.forEach((x) => { for (let i = 0; i < 5; i += 1) push(x, "defense", i); });
  return out;
}

function createMechModuleCatalog() {
  const out = [];
  let id = 1;
  MECH_MODULE_BASES.forEach((m) => {
    for (let mk = 1; mk <= 10; mk += 1) {
      const scale = 0.85 + mk * 0.08;
      out.push({
        id: `mm-${id++}`,
        itemKind: "mechModule",
        slotType: "module",
        moduleBase: m.name,
        mk,
      name: `${m.name} 스킬 모듈 MK.${MK_ROMAN[mk - 1]}`,
        mainType: "스킬 모듈",
        subType: "일반 모듈",
        icon: createItemIcon(`${m.name.slice(0, 2)}${mk}`, "#2a5f52"),
        atk: Math.round(m.atk * scale),
        def: Math.round(m.def * scale),
        hp: Math.round(m.hp * scale),
        speed: Number((m.speed * scale).toFixed(1)),
        trait: m.trait,
      });
    }
  });
  REQUIRED_CORE_SKILL_NAMES.forEach((c) => {
    out.push({
      id: `mc-${id++}`,
      itemKind: "mechCore",
      slotType: "core",
      coreName: c,
      name: c,
      mainType: "코어 모듈",
      subType: "코어",
      icon: createItemIcon(c.slice(0, 4), "#6b3f2f"),
      atk: 8,
      def: 8,
      hp: 40,
      speed: 1,
      trait: `${c} 활성 스킬`,
    });
  });
  return out;
}

function createMechStarterInventory() {
  const weapons = createMechWeaponCatalog();
  const modules = createMechModuleCatalog();
  const starter = [];
  const pick = (arr, pred) => arr.find(pred);
  MELEE_TYPES.forEach((t) => starter.push(pick(weapons, (x) => x.slotType === "melee" && x.name === `MX-${t.key}-III`)));
  FIREARM_TYPES.forEach((t) => starter.push(pick(weapons, (x) => x.slotType === "firearm" && x.name === `MX-${t.key}-III`)));
  DEFENSE_TYPES.forEach((t) => starter.push(pick(weapons, (x) => x.slotType === "defense" && x.name === `MX-${t.key}-III`)));
  starter.push(...modules.filter((x) => x.slotType === "module").slice(0, 10));
  starter.push(...modules.filter((x) => x.slotType === "core"));
  return starter.filter(Boolean);
}

function ensureMechWeaponCoverageInventory() {
  if (!Array.isArray(state.mechInventory)) state.mechInventory = [];
  const catalog = createMechWeaponCatalog();
  const parseWeaponBase = (it) => {
    if (!it) return "";
    if (it.weaponType) return it.weaponType;
    const sub = String(it.subType || "");
    if (sub.includes("/")) return sub.split("/").pop() || "";
    const m = String(it.name || "").match(/MX\-([^\-]+)\-/);
    return m?.[1] || "";
  };
  const hasType = new Set(
    state.mechInventory
      .filter((it) => it && (it.slotType === "melee" || it.slotType === "firearm" || it.slotType === "defense"))
      .map((it) => `${it.slotType}:${parseWeaponBase(it)}`),
  );

  const pickOneByBase = (slotType, baseKey) =>
    catalog.find((it) => it.slotType === slotType && it.weaponType === baseKey && /-III$/.test(it.name)) ||
    catalog.find((it) => it.slotType === slotType && it.weaponType === baseKey);

  const addIfMissing = (slotType, baseKey) => {
    const k = `${slotType}:${baseKey}`;
    if (hasType.has(k)) return;
    const item = pickOneByBase(slotType, baseKey);
    if (!item) return;
    const cloned = { ...item, id: `cov-${slotType}-${baseKey}-${Date.now()}-${Math.floor(Math.random() * 100000)}` };
    state.mechInventory.push(cloned);
    hasType.add(k);
  };

  MELEE_TYPES.forEach((t) => addIfMissing("melee", t.key));
  FIREARM_TYPES.forEach((t) => addIfMissing("firearm", t.key));
  DEFENSE_TYPES.forEach((t) => addIfMissing("defense", t.key));
}

function ensureMechModuleCoverageInventory() {
  if (!Array.isArray(state.mechInventory)) state.mechInventory = [];
  const catalog = createMechModuleCatalog();
  const moduleByBase = new Set(
    state.mechInventory
      .filter((it) => it?.slotType === "module")
      .map((it) => it.moduleBase || String(it.name || "").replace(/\s*스킬 모듈.*/g, "").trim()),
  );
  const coreByName = new Set(
    state.mechInventory
      .filter((it) => it?.slotType === "core")
      .map((it) => it.coreName || it.name),
  );

  MECH_MODULE_BASES.forEach((base) => {
    if (moduleByBase.has(base.name)) return;
    const sample = catalog.find((it) => it.slotType === "module" && it.moduleBase === base.name && it.mk === 1);
    if (!sample) return;
    state.mechInventory.push({ ...sample, id: `cov-module-${Date.now()}-${Math.floor(Math.random() * 100000)}` });
    moduleByBase.add(base.name);
  });

  REQUIRED_CORE_SKILL_NAMES.forEach((coreName) => {
    if (coreByName.has(coreName)) return;
    const sample = catalog.find((it) => it.slotType === "core" && (it.coreName || it.name) === coreName);
    if (!sample) return;
    state.mechInventory.push({ ...sample, id: `cov-core-${Date.now()}-${Math.floor(Math.random() * 100000)}` });
    coreByName.add(coreName);
  });
}

function createStarterMechs() {
  const weightCycle = ["경량", "표준", "중량"];
  const rangeCycle = RANGE_ORDER;
  const names = [
    "HX-01 Aries",
    "HX-02 Vela",
    "HX-03 Taranis",
    "HX-04 Boreal",
    "HX-05 Hydrox",
    "HX-06 Melta",
    "HX-07 Gale",
    "HX-08 Bastion",
    "HX-09 Echo",
    "HX-10 Gravix",
    "HX-11 Nova",
    "HX-12 Shade",
    "HX-13 Atlas",
    "HX-14 Mirage",
    "HX-15 Saber",
    "HX-16 Valkyr",
    "HX-17 Omega",
  ];
  return REQUIRED_CORE_SKILL_NAMES.map((coreName, i) => {
    const role = weightCycle[i % weightCycle.length];
    const rangeClass = rangeCycle[i % rangeCycle.length];
    const attribute = ATTR_ORDER[i % ATTR_ORDER.length];
    const hpBase = role === "경량" ? 520 : role === "중량" ? 920 : 700;
    const defBase = role === "경량" ? 44 : role === "중량" ? 96 : 66;
    const spdBase = role === "경량" ? 56 : role === "중량" ? 26 : 40;
    return {
      id: `starter-mech-${i + 1}`,
      name: names[i] || `HX-${String(i + 1).padStart(2, "0")}`,
      role,
      rangeClass,
      attribute,
      coreSkill: coreName,
      hp: hpBase + i * 8,
      currentHp: hpBase + i * 8,
      atk: 98 + i * 3,
      def: defBase + Math.floor(i * 1.2),
      speed: Math.max(20, spdBase - Math.floor(i * 0.2)),
      level: 1,
      star: 0,
      unlocked: true,
      pilotId: null,
      equippedModules: [],
      equippedCore: {
        id: `starter-core-eq-${i + 1}`,
        itemKind: "mechCore",
        slotType: "core",
        name: coreName,
        mainType: "코어 모듈",
        subType: "코어",
        icon: createItemIcon("CORE", "#6b3f2f"),
        atk: 8,
        def: 8,
        hp: 40,
        speed: 1,
        trait: `${coreName} 활성 스킬`,
      },
    };
  });
}

function firearmForRangeFixed(rangeClass) {
  const map = {
    근거리: "SG",
    근중거리: "SMG",
    중거리: "AR",
    중원거리: "DMR",
    원거리: "SR",
  };
  return map[rangeClass] || "AR";
}

function normalizeUnitWeaponRules(unit) {
  if (!unit) return unit;
  const meleeKeys = MELEE_TYPES.map((x) => x.key);
  const firearmKeys = FIREARM_TYPES.map((x) => x.key);
  unit.fixedMeleeType = normalizeMeleeTypeName(unit.fixedMeleeType);
  if (typeof unit.codexKey === "string") unit.codexKey = replaceZweihanderText(unit.codexKey);
  if (!unit.fixedMeleeType || !meleeKeys.includes(unit.fixedMeleeType)) {
    const idx = Math.abs(String(unit.id || unit.name || "u").split("").reduce((a, c) => a + c.charCodeAt(0), 0));
    unit.fixedMeleeType = meleeKeys[idx % meleeKeys.length];
  }
  if (!unit.fixedFirearmType || !firearmKeys.includes(unit.fixedFirearmType)) {
    unit.fixedFirearmType = firearmForRangeFixed(unit.rangeClass);
    if (!firearmKeys.includes(unit.fixedFirearmType)) unit.fixedFirearmType = firearmKeys[0];
  }
  if (typeof unit.canUseDefense !== "boolean") unit.canUseDefense = ["디펜서", "어썰트", "버서커", "스폐셜"].includes(unit.roleClass || unit.classType);
  return unit;
}

function getUnitCodexCatalog() {
  if (UNIT_CODEX_CACHE) return UNIT_CODEX_CACHE;
  const result = [];
  const firearmKeys = FIREARM_TYPES.map((x) => x.key);
  const meleeKeys = MELEE_TYPES.map((x) => x.key);
  const codexNameBySeed = (seed, unitType, roleClass, attribute, rangeClass) => {
    const a = ["아크", "벨", "카인", "델", "에온", "펜", "가이", "헬", "이오", "쟈", "키르", "루멘", "미르", "네오", "오르", "프록", "퀸", "라즈", "실", "테오", "울", "바론", "웨인", "시아", "요른", "제트"];
    const b = ["가드", "스톰", "리퍼", "클로", "노바", "브레이커", "스펙터", "폴", "웨이브", "하운드", "레이븐", "기어", "엣지", "서지", "크래프트", "리프", "펄스", "블룸", "소드", "코어"];
    const p1 = a[Math.abs(seed * 7 + 11) % a.length];
    const p2 = b[Math.abs(seed * 13 + 5) % b.length];
    return `${unitType === "merc" ? "용병" : "히어로"} ${p1}${p2} (${attribute} ${roleClass}/${rangeClass})`;
  };
  let idx = 1;
  ["hero", "merc"].forEach((unitType) => {
    firearmKeys.forEach((firearm) => {
      meleeKeys.forEach((melee) => {
        [false, true].forEach((shield) => {
          RANGE_ORDER.forEach((rangeClass) => {
            ATTR_ORDER.forEach((attribute) => {
              ROLE_ORDER.forEach((roleClass) => {
                result.push({
                  key: `${unitType}|${firearm}|${melee}|${shield ? 1 : 0}|${rangeClass}|${attribute}|${roleClass}`,
                  name: codexNameBySeed(idx, unitType, roleClass, attribute, rangeClass),
                  unitType,
                  fixedFirearmType: firearm,
                  fixedMeleeType: melee,
                  canUseDefense: shield,
                  rangeClass,
                  attribute,
                  roleClass,
                  team: pickRandom(["조디악", "셈하프", "게티아", "엘리멘탈", "오리지널"]),
                  ability: `${roleClass} 프로토콜 / ${attribute} 연계`,
                  atk: 12 + (idx % 23),
                  def: 7 + (idx % 17),
                  hp: 120 + (idx % 140),
                  speed: 12 + (idx % 15),
                });
                idx += 1;
              });
            });
          });
        });
      });
    });
  });
  // 1800 original units to reach 20,000 total
  for (let i = 1; i <= 1800; i += 1) {
    const roleClass = ROLE_ORDER[i % ROLE_ORDER.length];
    const rangeClass = RANGE_ORDER[i % RANGE_ORDER.length];
    const attribute = ATTR_ORDER[i % ATTR_ORDER.length];
    const firearm = firearmKeys[(i * 3) % firearmKeys.length];
    const melee = meleeKeys[(i * 5) % meleeKeys.length];
    const unitType = i % 2 === 0 ? "hero" : "merc";
    const shield = i % 3 === 0;
    result.push({
      key: `ORIG-U-${String(i).padStart(4, "0")}`,
      name: `오리진 ${codexNameBySeed(20000 + i, unitType, roleClass, attribute, rangeClass)}`,
      unitType,
      fixedFirearmType: firearm,
      fixedMeleeType: melee,
      canUseDefense: shield,
      rangeClass,
      attribute,
      roleClass,
      team: "오리지널",
      ability: `오리지널 패턴-${String(i).padStart(4, "0")}`,
      atk: 28 + (i % 35),
      def: 14 + (i % 25),
      hp: 220 + (i % 260),
      speed: 18 + (i % 21),
    });
  }
  UNIT_CODEX_CACHE = result.slice(0, 20000);
  return UNIT_CODEX_CACHE;
}

function getMechCodexCatalog() {
  if (MECH_CODEX_CACHE) return MECH_CODEX_CACHE;
  const result = [];
  const weights = ["경량", "표준", "중량"];
  let idx = 1;
  weights.forEach((weight) => {
    RANGE_ORDER.forEach((rangeClass) => {
      ATTR_ORDER.forEach((attribute) => {
        ROLE_ORDER.forEach((mechClass) => {
          const code = `M-${String(idx).padStart(4, "0")}`;
          result.push({
            key: `${weight}|${rangeClass}|${attribute}|${mechClass}`,
            name: `메카-${code}`,
            role: weight,
            rangeClass,
            attribute,
            mechClass,
            coreSkill: REQUIRED_CORE_SKILL_NAMES[idx % REQUIRED_CORE_SKILL_NAMES.length],
            atk: 120 + (idx % 55),
            def: 80 + (idx % 40),
            hp: 700 + (idx % 380),
            speed: 24 + (idx % 20),
          });
          idx += 1;
        });
      });
    });
  });
  for (let i = 1; i <= 50; i += 1) {
    result.push({
      key: `ORIG-M-${String(i).padStart(3, "0")}`,
      name: `오리진 메카-${String(i).padStart(3, "0")}`,
      role: weights[i % weights.length],
      rangeClass: RANGE_ORDER[i % RANGE_ORDER.length],
      attribute: ATTR_ORDER[i % ATTR_ORDER.length],
      mechClass: ROLE_ORDER[i % ROLE_ORDER.length],
      coreSkill: REQUIRED_CORE_SKILL_NAMES[i % REQUIRED_CORE_SKILL_NAMES.length],
      atk: 200 + (i % 60),
      def: 110 + (i % 50),
      hp: 1200 + (i % 520),
      speed: 32 + (i % 24),
    });
  }
  MECH_CODEX_CACHE = result.slice(0, 2000);
  return MECH_CODEX_CACHE;
}

function grantFullCodexUnlockRoster() {
  if (!Array.isArray(state.codexUnitUnlockKeys)) state.codexUnitUnlockKeys = [];
  if (!Array.isArray(state.codexMechUnlockKeys)) state.codexMechUnlockKeys = [];
  const beforeUnit = new Set(state.codexUnitUnlockKeys);
  const beforeMech = new Set(state.codexMechUnlockKeys);
  getUnitCodexCatalog().forEach((u) => beforeUnit.add(u.key));
  getMechCodexCatalog().forEach((m) => beforeMech.add(m.key));
  const addedUnit = beforeUnit.size - state.codexUnitUnlockKeys.length;
  const addedMech = beforeMech.size - state.codexMechUnlockKeys.length;
  state.codexUnitUnlockKeys = [...beforeUnit];
  state.codexMechUnlockKeys = [...beforeMech];
  return { addHero: 0, addMerc: 0, addMech: addedMech, totalUnits: addedUnit };
}

function buildPlayableUnitFromCodexRow(row, idx) {
  const unit = {
    id: `grant-u-${String(idx + 1).padStart(5, "0")}-${row.unitType === "merc" ? "m" : "h"}`,
    sourceId: `grant-${idx + 1}`,
    name: row.name,
    unitType: row.unitType === "merc" ? "merc" : "hero",
    rank: "도감",
    contract: 0,
    atk: row.atk || 12,
    def: row.def || 8,
    hp: row.hp || 120,
    speed: row.speed || 12,
    ability: row.ability || "도감 기본 스킬",
    roleClass: row.roleClass || "오펜서",
    rangeClass: row.rangeClass || "중거리",
    fixedMeleeType: normalizeMeleeTypeName(row.fixedMeleeType || "소드"),
    fixedFirearmType: row.fixedFirearmType || firearmForRangeFixed(row.rangeClass || "중거리"),
    canUseDefense: !!row.canUseDefense,
    codexKey: row.key,
    attribute: row.attribute || "물리",
    team: row.team || "오리지널",
    teamEffect: TEAM_EFFECTS[row.team] || "없음",
    classType: row.roleClass || "오펜서",
    color: getAttributeColor(row.attribute || "물리"),
    weaponType: (row.rangeClass || "중거리") === "근거리" ? "shotgun" : (row.rangeClass || "중거리") === "원거리" ? "sniper" : "rifle",
    abilityIcon: "scope",
    level: 1,
    star: 0,
    deployed: false,
    equippedMelee: null,
    equippedFirearm: null,
    equippedDefense: null,
    equippedGears: [],
  };
  if (unit.unitType === "merc") {
    unit.randomLoadout = MERC_LOADOUT_POOL[randInt(0, MERC_LOADOUT_POOL.length - 1)];
  }
  return unit;
}

async function grantMissingPlayableUnitsByKeys(missingKeys, onProgress) {
  const report = (p, txt) => {
    if (typeof onProgress === "function") onProgress(clamp(p, 0, 100), txt || "유닛 보충 중...");
  };
  if (!Array.isArray(missingKeys) || missingKeys.length === 0) return { addHero: 0, addMerc: 0, totalUnits: 0 };

  const catalog = getUnitCodexCatalog();
  const byKey = new Map(catalog.map((row, idx) => [row.key, { row, idx }]));
  const unitIdSet = new Set([...(state.heroes || []), ...(state.mercs || [])].map((u) => u.id));
  let addHero = 0;
  let addMerc = 0;

  report(4, `누락 유닛 보충 준비 (${missingKeys.length})`);
  await nextFrame();

  for (let i = 0; i < missingKeys.length; i += 1) {
    const key = missingKeys[i];
    const found = byKey.get(key);
    if (!found) continue;
    const unit = buildPlayableUnitFromCodexRow(found.row, found.idx);
    while (unitIdSet.has(unit.id)) unit.id = `${unit.id}-x`;
    unitIdSet.add(unit.id);
    if (unit.unitType === "merc") {
      state.mercs.push(unit);
      addMerc += 1;
    } else {
      state.heroes.push(unit);
      addHero += 1;
    }
    if (i % 200 === 0) {
      report(4 + (i / Math.max(1, missingKeys.length)) * 94, `누락 유닛 보충 중... ${i + 1}/${missingKeys.length}`);
      await nextFrame();
    }
  }
  report(100, `보충 완료 (+${addHero + addMerc})`);
  return { addHero, addMerc, totalUnits: addHero + addMerc };
}

function grantMissingPlayableUnitsByKeysSync(missingKeys) {
  if (!Array.isArray(missingKeys) || missingKeys.length === 0) return { addHero: 0, addMerc: 0, totalUnits: 0 };
  const catalog = getUnitCodexCatalog();
  const byKey = new Map(catalog.map((row, idx) => [row.key, { row, idx }]));
  const unitIdSet = new Set([...(state.heroes || []), ...(state.mercs || [])].map((u) => u.id));
  let addHero = 0;
  let addMerc = 0;
  for (let i = 0; i < missingKeys.length; i += 1) {
    const found = byKey.get(missingKeys[i]);
    if (!found) continue;
    const unit = buildPlayableUnitFromCodexRow(found.row, found.idx);
    while (unitIdSet.has(unit.id)) unit.id = `${unit.id}-x`;
    unitIdSet.add(unit.id);
    if (unit.unitType === "merc") {
      state.mercs.push(unit);
      addMerc += 1;
    } else {
      state.heroes.push(unit);
      addHero += 1;
    }
  }
  return { addHero, addMerc, totalUnits: addHero + addMerc };
}

function buildPlayableMechFromCodexRow(row, idx, idSet) {
  let id = `grant-m-${String(idx + 1).padStart(4, "0")}`;
  while (idSet.has(id)) id = `${id}-x`;
  idSet.add(id);
  return {
    id,
    name: row.name,
    role: row.role || "표준",
    rangeClass: row.rangeClass || "중거리",
    attribute: row.attribute || "물리",
    mechClass: row.mechClass || "오펜서",
    coreSkill: row.coreSkill || REQUIRED_CORE_SKILL_NAMES[idx % REQUIRED_CORE_SKILL_NAMES.length],
    atk: row.atk || 120,
    def: row.def || 80,
    hp: row.hp || 700,
    speed: row.speed || 24,
    currentHp: row.hp || 700,
    unlocked: true,
    level: 1,
    star: 0,
    pilotId: null,
    equippedMelee: null,
    equippedFirearm: null,
    equippedDefense: null,
    equippedCore: null,
    equippedModules: [],
    codexKey: row.key,
  };
}

function getMechCodexKeyNormalized(mech) {
  if (!mech) return "";
  return mech.codexKey || `${mech.role || "표준"}|${mech.rangeClass || "중거리"}|${getAttributeBase(mech.attribute || "물리")}|${mech.mechClass || "오펜서"}`;
}

function enforceExactMechRosterByCodex() {
  const catalog = getMechCodexCatalog();
  const target = catalog.length;
  const catalogMap = new Map(catalog.map((r, i) => [r.key, { row: r, idx: i }]));
  const keys = catalog.map((r) => r.key);
  const all = [...(state.mechs || [])];
  const idSet = new Set(all.map((m) => m.id));
  let changed = false;

  const bestByKey = new Map();
  all.forEach((m, idx) => {
    const key = getMechCodexKeyNormalized(m);
    if (!catalogMap.has(key)) return;
    m.codexKey = key;
    const score = Number(!!m.unlocked) * 1_000_000_000 + getStarValue(m.star) * 1_000_000 + Number(m.level || 1) * 1_000 - idx;
    const prev = bestByKey.get(key);
    if (!prev || score > prev.score) {
      bestByKey.set(key, { mech: m, score });
    }
  });

  keys.forEach((k) => {
    if (bestByKey.has(k)) return;
    const found = catalogMap.get(k);
    if (!found) return;
    bestByKey.set(k, { mech: buildPlayableMechFromCodexRow(found.row, found.idx, idSet), score: 0 });
    changed = true;
  });

  let result = keys.map((k) => bestByKey.get(k)?.mech).filter(Boolean);
  result.forEach((m) => {
    if (!m.unlocked) changed = true;
    m.unlocked = true;
    if (typeof m.currentHp !== "number") m.currentHp = m.hp;
    m.currentHp = clamp(m.currentHp, 0, m.hp);
    if (!Array.isArray(m.equippedModules)) m.equippedModules = [];
    if (!("equippedMelee" in m)) m.equippedMelee = null;
    if (!("equippedFirearm" in m)) m.equippedFirearm = null;
    if (!("equippedDefense" in m)) m.equippedDefense = null;
    if (!("equippedCore" in m)) m.equippedCore = null;
    if (!Number.isFinite(m.level)) m.level = 1;
    if (!Number.isFinite(m.star)) m.star = 0;
  });

  if (result.length > target) {
    result = result.slice(0, target);
    changed = true;
  }
  if (result.length !== (state.mechs || []).length) changed = true;
  state.mechs = result;

  if (!state.activeMechId || !state.mechs.some((m) => m.id === state.activeMechId && m.unlocked)) {
    state.activeMechId = state.mechs[0]?.id || null;
  }
  if (!state.hangarSelectedMechId || !state.mechs.some((m) => m.id === state.hangarSelectedMechId && m.unlocked)) {
    state.hangarSelectedMechId = state.mechs[0]?.id || null;
  }
  const validPilotIds = new Set(getAllUnits().map((u) => u.id));
  state.mechs.forEach((m) => {
    if (m.pilotId && !validPilotIds.has(m.pilotId)) m.pilotId = null;
  });
  return {
    changed,
    total: state.mechs.length,
    target,
    unlocked: state.mechs.filter((m) => m.unlocked).length,
  };
}

function grantOnePerCodexPlayable() {
  const unitCatalog = getUnitCodexCatalog();
  const mechCatalog = getMechCodexCatalog();
  const unitKeySet = new Set([...(state.heroes || []), ...(state.mercs || [])].map((u) => getUnitCodexKey(u)));
  const mechKeySet = new Set((state.mechs || []).map((m) => m.codexKey || `${m.role}|${m.rangeClass}|${getAttributeBase(m.attribute)}|${m.mechClass}`));
  const unitIdSet = new Set([...(state.heroes || []), ...(state.mercs || [])].map((u) => u.id));
  const mechIdSet = new Set((state.mechs || []).map((m) => m.id));
  let addHero = 0;
  let addMerc = 0;
  let addMech = 0;

  unitCatalog.forEach((row, idx) => {
    if (unitKeySet.has(row.key)) return;
    let id = `grant-u-${String(idx + 1).padStart(5, "0")}-${row.unitType === "merc" ? "m" : "h"}`;
    while (unitIdSet.has(id)) id = `${id}-x`;
    unitIdSet.add(id);
    const unit = {
      id,
      sourceId: `grant-${idx + 1}`,
      name: row.name,
      unitType: row.unitType === "merc" ? "merc" : "hero",
      rank: "도감",
      contract: 0,
      atk: row.atk || 12,
      def: row.def || 8,
      hp: row.hp || 120,
      speed: row.speed || 12,
      ability: row.ability || "도감 기본 스킬",
      roleClass: row.roleClass || "오펜서",
      rangeClass: row.rangeClass || "중거리",
      fixedMeleeType: normalizeMeleeTypeName(row.fixedMeleeType || "소드"),
      fixedFirearmType: row.fixedFirearmType || firearmForRangeFixed(row.rangeClass || "중거리"),
      canUseDefense: !!row.canUseDefense,
      codexKey: row.key,
      attribute: row.attribute || "물리",
      team: row.team || "오리지널",
      teamEffect: TEAM_EFFECTS[row.team] || "없음",
      classType: row.roleClass || "오펜서",
      color: getAttributeColor(row.attribute || "물리"),
      weaponType: (row.rangeClass || "중거리") === "근거리" ? "shotgun" : (row.rangeClass || "중거리") === "원거리" ? "sniper" : "rifle",
      abilityIcon: "scope",
      level: 1,
      star: 0,
      deployed: false,
      equippedMelee: null,
      equippedFirearm: null,
      equippedDefense: null,
      equippedGears: [],
    };
    if (unit.unitType === "merc") {
      unit.randomLoadout = MERC_LOADOUT_POOL[randInt(0, MERC_LOADOUT_POOL.length - 1)];
      state.mercs.push(unit);
      addMerc += 1;
    } else {
      state.heroes.push(unit);
      addHero += 1;
    }
    unitKeySet.add(row.key);
  });

  mechCatalog.forEach((row, idx) => {
    if (mechKeySet.has(row.key)) return;
    let id = `grant-m-${String(idx + 1).padStart(4, "0")}`;
    while (mechIdSet.has(id)) id = `${id}-x`;
    mechIdSet.add(id);
    state.mechs.push({
      id,
      name: row.name,
      role: row.role || "표준",
      rangeClass: row.rangeClass || "중거리",
      attribute: row.attribute || "물리",
      mechClass: row.mechClass || "오펜서",
      coreSkill: row.coreSkill || REQUIRED_CORE_SKILL_NAMES[idx % REQUIRED_CORE_SKILL_NAMES.length],
      atk: row.atk || 120,
      def: row.def || 80,
      hp: row.hp || 700,
      speed: row.speed || 24,
      currentHp: row.hp || 700,
      unlocked: true,
      level: 1,
      star: 0,
      pilotId: null,
      equippedMelee: null,
      equippedFirearm: null,
      equippedDefense: null,
      equippedCore: null,
      equippedModules: [],
      codexKey: row.key,
    });
    mechKeySet.add(row.key);
    addMech += 1;
  });

  return { addHero, addMerc, addMech, totalUnits: addHero + addMerc };
}

async function grantOnePerCodexPlayableWithProgress(onProgress) {
  const report = (p, txt) => {
    if (typeof onProgress === "function") onProgress(clamp(p, 0, 100), txt || "로딩 중...");
  };
  const unitCatalog = getUnitCodexCatalog();
  const mechCatalog = getMechCodexCatalog();
  const unitKeySet = new Set([...(state.heroes || []), ...(state.mercs || [])].map((u) => getUnitCodexKey(u)));
  const mechKeySet = new Set((state.mechs || []).map((m) => m.codexKey || `${m.role}|${m.rangeClass}|${getAttributeBase(m.attribute)}|${m.mechClass}`));
  const unitIdSet = new Set([...(state.heroes || []), ...(state.mercs || [])].map((u) => u.id));
  const mechIdSet = new Set((state.mechs || []).map((m) => m.id));
  let addHero = 0;
  let addMerc = 0;
  let addMech = 0;

  report(5, "유닛 지급 준비");
  for (let idx = 0; idx < unitCatalog.length; idx += 1) {
    const row = unitCatalog[idx];
    if (unitKeySet.has(row.key)) {
      if (idx % 250 === 0) {
        report(5 + (idx / Math.max(1, unitCatalog.length)) * 70, "유닛 지급 중...");
        await nextFrame();
      }
      continue;
    }
    let id = `grant-u-${String(idx + 1).padStart(5, "0")}-${row.unitType === "merc" ? "m" : "h"}`;
    while (unitIdSet.has(id)) id = `${id}-x`;
    unitIdSet.add(id);
    const unit = {
      id,
      sourceId: `grant-${idx + 1}`,
      name: row.name,
      unitType: row.unitType === "merc" ? "merc" : "hero",
      rank: "도감",
      contract: 0,
      atk: row.atk || 12,
      def: row.def || 8,
      hp: row.hp || 120,
      speed: row.speed || 12,
      ability: row.ability || "도감 기본 스킬",
      roleClass: row.roleClass || "오펜서",
      rangeClass: row.rangeClass || "중거리",
      fixedMeleeType: normalizeMeleeTypeName(row.fixedMeleeType || "소드"),
      fixedFirearmType: row.fixedFirearmType || firearmForRangeFixed(row.rangeClass || "중거리"),
      canUseDefense: !!row.canUseDefense,
      codexKey: row.key,
      attribute: row.attribute || "물리",
      team: row.team || "오리지널",
      teamEffect: TEAM_EFFECTS[row.team] || "없음",
      classType: row.roleClass || "오펜서",
      color: getAttributeColor(row.attribute || "물리"),
      weaponType: (row.rangeClass || "중거리") === "근거리" ? "shotgun" : (row.rangeClass || "중거리") === "원거리" ? "sniper" : "rifle",
      abilityIcon: "scope",
      level: 1,
      star: 0,
      deployed: false,
      equippedMelee: null,
      equippedFirearm: null,
      equippedDefense: null,
      equippedGears: [],
    };
    if (unit.unitType === "merc") {
      unit.randomLoadout = MERC_LOADOUT_POOL[randInt(0, MERC_LOADOUT_POOL.length - 1)];
      state.mercs.push(unit);
      addMerc += 1;
    } else {
      state.heroes.push(unit);
      addHero += 1;
    }
    unitKeySet.add(row.key);
    if (idx % 250 === 0) {
      report(5 + (idx / Math.max(1, unitCatalog.length)) * 70, "유닛 지급 중...");
      await nextFrame();
    }
  }

  report(78, "메카 지급 준비");
  for (let idx = 0; idx < mechCatalog.length; idx += 1) {
    const row = mechCatalog[idx];
    if (mechKeySet.has(row.key)) {
      if (idx % 120 === 0) {
        report(78 + (idx / Math.max(1, mechCatalog.length)) * 20, "메카 지급 중...");
        await nextFrame();
      }
      continue;
    }
    let id = `grant-m-${String(idx + 1).padStart(4, "0")}`;
    while (mechIdSet.has(id)) id = `${id}-x`;
    mechIdSet.add(id);
    state.mechs.push({
      id,
      name: row.name,
      role: row.role || "표준",
      rangeClass: row.rangeClass || "중거리",
      attribute: row.attribute || "물리",
      mechClass: row.mechClass || "오펜서",
      coreSkill: row.coreSkill || REQUIRED_CORE_SKILL_NAMES[idx % REQUIRED_CORE_SKILL_NAMES.length],
      atk: row.atk || 120,
      def: row.def || 80,
      hp: row.hp || 700,
      speed: row.speed || 24,
      currentHp: row.hp || 700,
      unlocked: true,
      level: 1,
      star: 0,
      pilotId: null,
      equippedMelee: null,
      equippedFirearm: null,
      equippedDefense: null,
      equippedCore: null,
      equippedModules: [],
      codexKey: row.key,
    });
    mechKeySet.add(row.key);
    addMech += 1;
    if (idx % 120 === 0) {
      report(78 + (idx / Math.max(1, mechCatalog.length)) * 20, "메카 지급 중...");
      await nextFrame();
    }
  }
  report(100, "완료");
  return { addHero, addMerc, addMech, totalUnits: addHero + addMerc };
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
    const key = normalizeMeleeTypeName(unit.fixedMeleeType || meleeForRole(unit.roleClass || unit.classType));
    const base = wp.find((x) => x.slotType === "melee" && x.weaponType === key && x.name.endsWith("-III"));
    return base ? { ...base, id: `${base.id}-${unit.id}-m` } : null;
  }
  if (slotType === "firearm") {
    const key = unit.fixedFirearmType || firearmForRange(unit.rangeClass);
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

function pickRandom(arr) {
  if (!arr || !arr.length) return null;
  return arr[randInt(0, arr.length - 1)];
}

function ensureResourceState() {
  if (!state || typeof state !== "object") return;
  state.powerPlantLevel = clamp(Math.max(1, Number(state.powerPlantLevel || 1)), 1, PLANT_MAX_LEVEL);
  if (!state.resourceStock || typeof state.resourceStock !== "object") state.resourceStock = {};
  Object.keys(RESOURCE_DEFS).forEach((id) => {
    if (!Number.isFinite(state.resourceStock[id])) state.resourceStock[id] = 0;
  });
  if (!Number.isFinite(state.resourceVersion) || state.resourceVersion < 1) {
    const legacy = Number.isFinite(state.resources) ? Math.max(0, Math.floor(state.resources)) : 0;
    state.resourceStock.terra_core = (state.resourceStock.terra_core || 0) + legacy;
    state.resourceVersion = 1;
  }
}

function getResourceAmount(id) {
  ensureResourceState();
  return Math.max(0, Math.floor(state.resourceStock[id] || 0));
}

function isMechInventoryItem(item) {
  if (!item || typeof item !== "object") return false;
  if (item.slotType === "module" || item.slotType === "core") return true;
  if (String(item.itemKind || "").toLowerCase().startsWith("mech")) return true;
  if (String(item.mainType || "").includes("메카")) return true;
  return false;
}

function addItemToOwnedInventory(item) {
  if (!item) return false;
  if (isMechInventoryItem(item)) {
    if (!Array.isArray(state.mechInventory)) state.mechInventory = [];
    state.mechInventory.push(item);
    return true;
  }
  if (!Array.isArray(state.inventory)) state.inventory = [];
  state.inventory.push(item);
  return true;
}

function normalizeOwnedInventoriesByType() {
  if (!Array.isArray(state.inventory)) state.inventory = [];
  if (!Array.isArray(state.mechInventory)) state.mechInventory = [];
  const movedToMech = [];
  const keptInv = [];
  state.inventory.forEach((it) => {
    if (isMechInventoryItem(it)) movedToMech.push(it);
    else keptInv.push(it);
  });
  const movedToNormal = [];
  const keptMech = [];
  state.mechInventory.forEach((it) => {
    if (isMechInventoryItem(it)) keptMech.push(it);
    else movedToNormal.push(it);
  });
  state.inventory = [...keptInv, ...movedToNormal];
  state.mechInventory = [...keptMech, ...movedToMech];
}

function grantRecoveryAssetBundleOnce() {
  if (state.recoveryAssetBundleV3) return;
  const invSig = new Set((state.inventory || []).map((it) => `${it.slotType || ""}|${it.weaponType || ""}|${it.name || ""}|${it.mainType || ""}`));
  const mechSig = new Set((state.mechInventory || []).map((it) => `${it.slotType || ""}|${it.weaponType || ""}|${it.moduleBase || ""}|${it.coreName || ""}|${it.name || ""}`));
  let seq = 0;
  createWeaponCatalog().forEach((it) => {
    const sig = `${it.slotType || ""}|${it.weaponType || ""}|${it.name || ""}|${it.mainType || ""}`;
    if (invSig.has(sig)) return;
    addItemToOwnedInventory({ ...it, id: `recovery-v3-${it.id}-${Date.now()}-${seq++}` });
    invSig.add(sig);
  });
  createGearCatalog().forEach((it) => {
    const sig = `${it.slotType || ""}|${it.weaponType || ""}|${it.name || ""}|${it.mainType || ""}`;
    if (invSig.has(sig)) return;
    addItemToOwnedInventory({ ...it, id: `recovery-v3-${it.id}-${Date.now()}-${seq++}` });
    invSig.add(sig);
  });
  createMechWeaponCatalog().forEach((it) => {
    const sig = `${it.slotType || ""}|${it.weaponType || ""}|${it.moduleBase || ""}|${it.coreName || ""}|${it.name || ""}`;
    if (mechSig.has(sig)) return;
    addItemToOwnedInventory({ ...it, id: `recovery-v3-${it.id}-${Date.now()}-${seq++}` });
    mechSig.add(sig);
  });
  createMechModuleCatalog().forEach((it) => {
    const sig = `${it.slotType || ""}|${it.weaponType || ""}|${it.moduleBase || ""}|${it.coreName || ""}|${it.name || ""}`;
    if (mechSig.has(sig)) return;
    addItemToOwnedInventory({ ...it, id: `recovery-v3-${it.id}-${Date.now()}-${seq++}` });
    mechSig.add(sig);
  });
  normalizeOwnedInventoriesByType();
  state.recoveryAssetBundleV2 = true;
  state.recoveryAssetBundleV3 = true;
}

function addResource(id, amount) {
  ensureResourceState();
  let n = Math.max(0, Math.round(amount || 0));
  if (n > 0 && isCreditDelinquent() && !state.settings?.infinite) n = Math.floor(n / 2);
  if (!n) return 0;
  if (!RESOURCE_DEFS[id]) id = "terra_core";
  state.resourceStock[id] = getResourceAmount(id) + n;
  return n;
}

function spendResource(id, amount) {
  ensureResourceState();
  const n = Math.max(0, Math.round(amount || 0));
  if (!RESOURCE_DEFS[id]) id = "terra_core";
  if (state.settings?.infinite) return true;
  if (getResourceAmount(id) < n) return false;
  state.resourceStock[id] = getResourceAmount(id) - n;
  return true;
}

function getTotalResources() {
  ensureResourceState();
  return Object.keys(state.resourceStock).reduce((acc, k) => acc + Math.max(0, Math.floor(state.resourceStock[k] || 0)), 0);
}

function getAttributeBase(attributeText) {
  return String(attributeText || "물리").split("/")[0];
}

function getResourceIdForAttribute(attributeText) {
  const base = getAttributeBase(attributeText);
  return RESOURCE_BY_ATTRIBUTE[base] || "terra_core";
}

function getPlanetResourceId(planet) {
  if (!planet) return "terra_core";
  const byId = PLANET_RESOURCE_BY_PLANET[planet.id];
  if (byId) return byId;
  return PLANET_RESOURCE_BY_NAME[planet.name] || "terra_core";
}

function getPlanetThemeById(planetId = "") {
  return PLANET_THEME_CONFIG[planetId] || PLANET_THEME_CONFIG.p1;
}

function getPlanetThemeByPlanet(planet) {
  if (!planet) return PLANET_THEME_CONFIG.p1;
  const byId = getPlanetThemeById(planet.id);
  if (PLANET_THEME_CONFIG[planet.id]) return byId;
  const rid = getPlanetResourceId(planet);
  const attr = ATTRIBUTE_BY_RESOURCE[rid] || "물리";
  const byAttr = PLANET_THEME_BY_ATTRIBUTE[attr] || PLANET_THEME_BY_ATTRIBUTE.물리;
  return {
    ...byAttr,
    key: `${byAttr.key}-${planet.id || planet.name || "unknown"}`,
    primaryAttr: attr,
  };
}

const VILLAIN_FAMILY = ["강", "윤", "한", "서", "박", "진", "이", "오", "도", "민", "류", "백", "유", "노", "채", "임", "하", "마", "권", "손"];
const VILLAIN_NORMAL_A = [
  "레드", "그림", "블랙", "바이올렛", "루인", "크로우", "미스트", "볼트", "팬텀", "아이언", "노바", "세이블",
  "애시", "크립트", "제로", "나이트", "스틸", "더스크", "블리츠", "쉐이드",
];
const VILLAIN_NORMAL_B = [
  "울프", "메이커", "레이스", "하운드", "브레이커", "리퍼", "엔젤", "헌터", "로드", "스펙터", "기어", "퀸",
  "폴", "클로", "웨이브", "바이트", "펄스", "스파인", "도미노", "레이븐",
];
const VILLAIN_NAMED_POOL = [
  "카르민 블레이드", "그레이 볼트", "노바 리퍼", "실버 하울", "애시 크라운", "도미노 팬텀", "다크 스티치", "제로 스팅",
  "아이언 마스크", "루미너스 헥스", "오블리크 단테", "블러드 스파크", "나이트 포지", "베일 헌터", "코발트 샤드", "세이블 프롬",
  "라이트닝 바론", "아크 윕", "그림 노치", "브레이크 하트", "크로스 파이어", "피어스 로직", "폴른 크레스트", "미러 울프",
];
const MID_BOSS_NAME_POOL = [
  "바르가스 아이언콜", "세레스 블랙리프", "데미안 크로우폴", "아젤라 라그나", "메린트 스톰락", "칼드 로어",
  "오필리아 스톤하트", "아르곤 실버팽", "제리코 듄브레이커", "살리아 체인위치", "로칸 그레이문", "미하엘 언더게이트",
  "테오도르 플린트", "카시안 브라이트록", "릴리아 블러드문", "가브리엘 스컬렌", "나르딘 콜드레인", "헤이든 브라스",
  "키이라 블랙스완", "바이런 더스트폴", "에리카 섀도링", "라자르 드레드노트", "세이렌 울프마더", "콘라드 레드엣지",
  "바네사 아크실드", "알렉시스 나이트피크", "도미니크 체인소드", "아만다 슬레이트", "볼프강 크림슨락", "하워드 아이언베인",
  "시그마 베스퍼", "프레이야 미스트블룸", "루카스 본브레이커", "마르셀 라이트폴", "세라크 와이번", "이자벨 플레임본",
];
const FINAL_BOSS_NAME_POOL = [
  "아르케논 제로스", "벨리알 카이론", "네메시스 발키르", "오블리비온 라사드", "펜리르 나크스", "드라켄 모르트",
  "세라핌 카르마인", "미카엘 크룩스", "루시안 아포크", "케일럼 블랙노바", "오시리스 텐브링", "칼리고 웨인",
  "모르가나 인페르나", "아이기스 카이저", "에레보스 다이브", "나이트폴 프라임", "아바돈 실드브레이크", "테스타먼트 레이",
  "바하무트 크레스트", "시바라 그라비온", "라그나로크 펄스", "헬릭스 도미니언", "크림슨 크라운", "블랙테일 소버린",
];
const VILLAIN_TITLE_BY_TIER = {
  normal: "전투원",
  named: "네임드 간부",
  midboss: "중간 보스",
  finalboss: "최종 보스",
};
const VILLAIN_THEME_BY_PLANET = {
  p1: { code: "urban", faction: "네오 테라 잔당", attributes: ["물리", "자기", "연막", "철갑"] },
  p2: { code: "desert", faction: "바실 사막 약탈단", attributes: ["소이", "풍압", "물리", "철갑"] },
  p3: { code: "frost", faction: "아이스 프론트 분견대", attributes: ["빙결", "수냉", "자기", "초능"] },
  p4: { code: "void", faction: "이클립스 보이드 군단", attributes: ["초능", "중력", "섬광", "연막"] },
};

const VILLAIN_FAMILY_SET = new Set(VILLAIN_FAMILY);

function stripVillainFamilyPrefix(name = "") {
  const raw = String(name || "").trim();
  if (!raw) return raw;
  const parts = raw.split(/\s+/);
  if (parts.length >= 2 && VILLAIN_FAMILY_SET.has(parts[0])) {
    return parts.slice(1).join(" ").trim();
  }
  return raw;
}

function pickUniqueBossName(tier, pool) {
  if (typeof state !== "undefined") {
    const key = tier === "finalboss" ? "usedFinalBossNames" : "usedMidBossNames";
    if (!Array.isArray(state[key])) state[key] = [];
    const used = new Set(state[key]);
    const options = pool.filter((n) => !used.has(n));
    const chosen = options.length ? pickRandom(options) : `${pickRandom(pool)} ${randInt(2, 99)}`;
    state[key].push(chosen);
    if (state[key].length > 300) state[key] = state[key].slice(-180);
    return chosen;
  }
  return pickRandom(pool);
}

function createVillainIdentity(tier = "normal") {
  let realName = "";
  if (tier === "finalboss") realName = pickUniqueBossName("finalboss", FINAL_BOSS_NAME_POOL);
  else if (tier === "midboss") realName = pickUniqueBossName("midboss", MID_BOSS_NAME_POOL);
  else if (tier === "named") realName = pickRandom(VILLAIN_NAMED_POOL);
  else realName = `${pickRandom(VILLAIN_NORMAL_A)}-${pickRandom(VILLAIN_NORMAL_B)}`;
  realName = stripVillainFamilyPrefix(realName);
  return { title: VILLAIN_TITLE_BY_TIER[tier] || "전투원", realName };
}

function getVillainThemeByPlanetId(planetId) {
  return VILLAIN_THEME_BY_PLANET[planetId] || { code: "wild", faction: "행성 유격대", attributes: ["물리", "소이", "빙결"] };
}

function listMercCodexRowsForTheme(planetId, tier = "normal") {
  const theme = getVillainThemeByPlanetId(planetId);
  const preferredRanges = tier === "finalboss"
    ? ["원거리", "중원거리", "중거리"]
    : tier === "midboss"
      ? ["중원거리", "중거리", "근중거리"]
      : ["중거리", "근중거리", "중원거리", "근거리"];
  const rows = getUnitCodexCatalog().filter((r) =>
    r && r.unitType === "merc"
    && theme.attributes.includes(getAttributeBase(r.attribute))
    && preferredRanges.includes(r.rangeClass));
  return rows.length ? rows : getUnitCodexCatalog().filter((r) => r && r.unitType === "merc");
}

function pickMercCodexForVillain(planetId, tier = "normal", seedText = "") {
  const rows = listMercCodexRowsForTheme(planetId, tier);
  if (!rows.length) return null;
  const h = hashText(`${planetId || "any"}|${tier}|${seedText}`);
  return rows[h % rows.length];
}

function buildVillainIdentityFromCodex(tier = "normal", planetId = "", mercCodex = null, seedText = "") {
  const theme = getVillainThemeByPlanetId(planetId);
  const fallback = createVillainIdentity(tier);
  const baseName = stripVillainFamilyPrefix(mercCodex?.name || fallback.realName);
  const prefix =
    tier === "finalboss" ? `${theme.faction} 군주`
      : tier === "midboss" ? `${theme.faction} 지휘관`
        : tier === "named" ? `${theme.faction} 간부`
          : `${theme.faction} 전투원`;
  const suffixSeed = hashText(`${seedText}|${baseName}|${tier}`) % 97;
  const realName = `${baseName}-${String(suffixSeed + 3).padStart(2, "0")}`;
  return { title: VILLAIN_TITLE_BY_TIER[tier] || prefix, realName, faction: theme.faction };
}

const VILLAIN_ARCHETYPES = [
  { key: "브루트", attackStyle: "heavy", hpMul: 1.34, atkMul: 1.15, speedMul: 0.78, resist: 0.14, rangedBias: 0.08, color: "#d77272", shape: "hex", notes: "근접 압박형" },
  { key: "레이더", attackStyle: "skirmish", hpMul: 0.92, atkMul: 1.04, speedMul: 1.26, resist: 0.02, rangedBias: 0.48, color: "#ff9f6a", shape: "tri", notes: "기동 사격형" },
  { key: "마크스맨", attackStyle: "marksman", hpMul: 0.88, atkMul: 1.24, speedMul: 0.94, resist: 0.04, rangedBias: 0.85, color: "#f0c66e", shape: "diamond", notes: "장거리 저격형" },
  { key: "데몰리셔", attackStyle: "demolisher", hpMul: 1.06, atkMul: 1.16, speedMul: 0.9, resist: 0.08, rangedBias: 0.72, color: "#ff7f4d", shape: "square", notes: "폭발 화력형" },
  { key: "테크노", attackStyle: "controller", hpMul: 0.98, atkMul: 1.12, speedMul: 1.02, resist: 0.1, rangedBias: 0.7, color: "#8fc4ff", shape: "oct", notes: "유도/교란형" },
  { key: "팬텀", attackStyle: "assassin", hpMul: 0.86, atkMul: 1.2, speedMul: 1.34, resist: 0.06, rangedBias: 0.2, color: "#b59cff", shape: "kite", notes: "습격 암살형" },
];

function hashText(s = "") {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function getVillainTraitByName(realName, tier = "normal") {
  const h = hashText(`${realName}|${tier}`);
  const base = VILLAIN_ARCHETYPES[h % VILLAIN_ARCHETYPES.length];
  const tierScale = tier === "finalboss" ? 1.5 : tier === "midboss" ? 1.24 : tier === "named" ? 1.1 : 1;
  return {
    ...base,
    hpMul: base.hpMul * tierScale,
    atkMul: base.atkMul * (tierScale * 0.96),
    speedMul: Math.max(0.72, base.speedMul + (tier === "finalboss" ? 0.08 : 0)),
    resist: Math.min(0.3, base.resist + (tier === "finalboss" ? 0.08 : tier === "midboss" ? 0.04 : 0)),
    rangedBias: Math.min(0.95, base.rangedBias + (tier === "finalboss" ? 0.12 : 0)),
  };
}

function buildVillainProfile(tier = "normal", planetId = "", seedText = "") {
  const mercRow = pickMercCodexForVillain(planetId, tier, seedText);
  const identity = buildVillainIdentityFromCodex(tier, planetId, mercRow, seedText);
  const trait = getVillainTraitByName(identity.realName, tier);
  return {
    mercRow,
    identity,
    trait,
    faction: getVillainThemeByPlanetId(planetId).faction,
  };
}

function applyDamageToEnemy(enemy, amount, source = "generic") {
  if (!enemy) return 0;
  let dmg = Math.max(1, Math.round(amount));
  if (enemy.resist) dmg = Math.max(1, Math.round(dmg * (1 - enemy.resist)));
  if (source === "melee" && enemy.attackStyle === "heavy") dmg = Math.max(1, Math.round(dmg * 0.9));
  if (source === "projectile" && enemy.attackStyle === "assassin") dmg = Math.max(1, Math.round(dmg * 0.88));
  if (enemy.shield && enemy.shield > 0) {
    const absorbed = Math.min(enemy.shield, dmg);
    enemy.shield -= absorbed;
    dmg -= absorbed;
    if (dmg <= 0) {
      enemy.alert = true;
      return absorbed;
    }
  }
  enemy.hp -= dmg;
  enemy.alert = true;
  return dmg;
}

const FINAL_BOSS_PATTERNS = [
  { id: "tyrant", name: "폭군형", color: "#ff7c7c", core: "붕괴 파동", shape: "hex" },
  { id: "sniper", name: "저격군주형", color: "#ffd17d", core: "정밀 처형", shape: "diamond" },
  { id: "gravity", name: "중력지배형", color: "#b59cff", core: "중력 우물", shape: "oct" },
  { id: "mirage", name: "환영교란형", color: "#8ec5ff", core: "환영 분화", shape: "kite" },
  { id: "inferno", name: "화염폭격형", color: "#ff9f57", core: "융해 폭렬", shape: "square" },
];

function getFinalBossPattern(realName = "") {
  const idx = hashText(`boss|${realName}`) % FINAL_BOSS_PATTERNS.length;
  return FINAL_BOSS_PATTERNS[idx];
}

function spawnBossMinions(boss, count = 3) {
  for (let i = 0; i < count; i += 1) {
    const a = (Math.PI * 2 * i) / Math.max(1, count);
    const d = 90 + i * 24;
    const x = clamp(boss.x + Math.cos(a) * d, 60, mission.worldW - 60);
    const y = clamp(boss.y + Math.sin(a) * d, 60, mission.worldH - 60);
    mission.enemies.push({
      id: `boss-minion-${Date.now()}-${i}`,
      title: "친위대",
      realName: `${boss.realName} 측근`,
      name: `친위대 - ${boss.realName} 측근`,
      x,
      y,
      spawnX: x,
      spawnY: y,
      r: 13,
      hp: Math.round(120 + (boss.atk || 30) * 1.9),
      maxHp: Math.round(120 + (boss.atk || 30) * 1.9),
      speed: 66,
      atk: Math.round((boss.atk || 30) * 0.62),
      resist: 0.04,
      attackStyle: "skirmish",
      archetype: "친위대",
      archetypeNotes: "보스 호위",
      palette: "#ffb88f",
      shape: "tri",
      rangedBias: 0.36,
      touchCd: 0,
      attackCd: 0,
      aggroRange: 220,
      alert: true,
      named: true,
    });
  }
}

function runFinalBossPattern(e, t, dt) {
  if (!e || !e.isBoss || !t) return;
  e.bossSkillA = Math.max(0, (e.bossSkillA || 0) - dt);
  e.bossSkillB = Math.max(0, (e.bossSkillB || 0) - dt);
  e.bossSkillC = Math.max(0, (e.bossSkillC || 0) - dt);
  const p = e.bossPattern || "tyrant";

  if (p === "tyrant" && e.bossSkillA <= 0) {
    missionFx("explosion", { x: e.x, y: e.y, r: 150, color: "#ff7c7c" }, 0.35);
    mission.units.forEach((u) => {
      const d = Math.hypot(u.x - e.x, u.y - e.y);
      if (d > 170) return;
      const dmg = Math.max(2, Math.round(e.atk * (1.15 - d / 200)));
      if (u.isMech && !u.mechBroken && u.mechHp > 0) {
        u.mechHp -= dmg;
        if (u.mechHp <= 0) {
          u.mechBroken = true;
          u.mechDestroyedThisMission = true;
          u.r = 12;
          u.speed = Math.max(70, Math.round((u.baseSpeed || u.speed) * 0.72));
          missionFx("break", { x: u.x, y: u.y, r: 56, color: "#ff7f7f" }, 0.4);
        }
        syncMissionMechOutcome(u);
      } else u.hp -= dmg;
      markUnitDamaged(u);
      const k = Math.max(8, 34 - d * 0.08);
      u.x += ((u.x - e.x) / (d || 1)) * k;
      u.y += ((u.y - e.y) / (d || 1)) * k;
    });
    e.bossSkillA = 7.5;
  }
  if (p === "sniper" && e.bossSkillA <= 0) {
    for (let i = -2; i <= 2; i += 1) {
      const tx = t.x + i * 26;
      const ty = t.y + i * 12;
      spawnProjectile(e, { id: `sniper-${i}`, x: tx, y: ty }, {
        fromEnemy: true, speed: 880, radius: 4.2, dmg: Math.round(e.atk * 0.9), color: "#ffd17d", life: 1.1, pierce: 1,
      });
    }
    e.bossSkillA = 6.2;
  }
  if (p === "gravity" && e.bossSkillA <= 0) {
    missionFx("skill", { x: e.x, y: e.y, r: 180, color: "#b59cff" }, 0.45);
    mission.units.forEach((u) => {
      const d = Math.hypot(u.x - e.x, u.y - e.y);
      if (d > 220) return;
      const pull = Math.max(6, 30 - d * 0.08);
      u.x += ((e.x - u.x) / (d || 1)) * pull;
      u.y += ((e.y - u.y) / (d || 1)) * pull;
      if (d < 88) {
        const dmg = Math.max(2, Math.round(e.atk * 0.52));
        if (u.isMech && !u.mechBroken && u.mechHp > 0) {
          u.mechHp -= dmg;
          if (u.mechHp <= 0) {
            u.mechBroken = true;
            u.mechDestroyedThisMission = true;
            u.r = 12;
            u.speed = Math.max(70, Math.round((u.baseSpeed || u.speed) * 0.72));
            missionFx("break", { x: u.x, y: u.y, r: 56, color: "#ff7f7f" }, 0.4);
          }
          syncMissionMechOutcome(u);
        } else u.hp -= dmg;
        markUnitDamaged(u);
      }
    });
    e.bossSkillA = 8.2;
  }
  if (p === "mirage" && e.bossSkillA <= 0) {
    spawnBossMinions(e, 3);
    missionFx("skill", { x: e.x, y: e.y, r: 120, color: "#8ec5ff" }, 0.35);
    e.bossSkillA = 10.5;
  }
  if (p === "inferno" && e.bossSkillA <= 0) {
    missionFx("explosion", { x: t.x, y: t.y, r: 92, color: "#ff9f57" }, 0.38);
    mission.units.forEach((u) => {
      const d = Math.hypot(u.x - t.x, u.y - t.y);
      if (d > 110) return;
      const dmg = Math.max(2, Math.round(e.atk * (0.95 - d / 180)));
      if (u.isMech && !u.mechBroken && u.mechHp > 0) {
        u.mechHp -= dmg;
        if (u.mechHp <= 0) {
          u.mechBroken = true;
          u.mechDestroyedThisMission = true;
          u.r = 12;
          u.speed = Math.max(70, Math.round((u.baseSpeed || u.speed) * 0.72));
          missionFx("break", { x: u.x, y: u.y, r: 56, color: "#ff7f7f" }, 0.4);
        }
        syncMissionMechOutcome(u);
      } else u.hp -= dmg;
      markUnitDamaged(u);
    });
    e.bossSkillA = 6.8;
  }

  if (e.bossSkillB <= 0) {
    spawnProjectile(e, t, {
      fromEnemy: true,
      speed: 540,
      radius: 5.2,
      dmg: Math.max(3, Math.round(e.atk * 0.75)),
      color: e.palette || "#ffb0e5",
      homing: true,
      turnRate: 5.1,
      life: 1.45,
    });
    missionFx("shot", { x1: e.x, y1: e.y, x2: t.x, y2: t.y, color: e.palette || "#ffb0e5", w: 3.6 }, 0.14);
    e.bossSkillB = 1.2;
  }
}

function createCapturedVillainRecord(input = {}) {
  const tier = input.tier || "normal";
  const planetId = input.planetId || "";
  const mercRow = input.mercCodexKey
    ? getUnitCodexCatalog().find((r) => r.key === input.mercCodexKey && r.unitType === "merc")
    : pickMercCodexForVillain(planetId, tier, input.realName || input.id || "");
  const identity = buildVillainIdentityFromCodex(tier, planetId, mercRow, input.id || input.realName || "");
  const realName = stripVillainFamilyPrefix(input.realName || identity.realName);
  const title = input.title || identity.title;
  const seedLevel = typeof input.reformLevel === "number" ? input.reformLevel : 0;
  const seedScore = Number.isFinite(input.reformScore) ? Math.round(input.reformScore) : seedLevel * 100;
  return {
    id: input.id || `cv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tier,
    title,
    realName,
    name: `${title} - ${realName}`,
    value: Math.max(140, input.value || 260),
    reformLevel: seedLevel,
    reformScore: seedScore,
    escapeCount: typeof input.escapeCount === "number" ? input.escapeCount : 0,
    reformMission: input.reformMission || null,
    converted: !!input.converted,
    archetype: input.archetype || "",
    attackStyle: input.attackStyle || "",
    palette: input.palette || "",
    planetId,
    faction: input.faction || identity.faction || getVillainThemeByPlanetId(planetId).faction,
    mercCodexKey: input.mercCodexKey || mercRow?.key || "",
  };
}

function ensurePrisonState() {
  if (!Array.isArray(state.capturedVillains)) state.capturedVillains = [];
  const renameMigration = state.prisonNameVersion !== 2;
  state.capturedVillains = state.capturedVillains.map((v) =>
    createCapturedVillainRecord({
      ...v,
      id: v.id,
      tier: v.tier || (String(v.title || "").includes("최종") ? "finalboss" : String(v.title || "").includes("중간") ? "midboss" : String(v.title || "").includes("네임드") ? "named" : "normal"),
      title: v.title || (String(v.name || "").includes("최종 보스") ? "최종 보스" : String(v.name || "").includes("중간 보스") ? "중간 보스" : String(v.name || "").includes("네임드") ? "네임드 간부" : "전투원"),
      realName: renameMigration ? null : (v.realName || (v.name && v.name.includes(" - ") ? v.name.split(" - ").slice(-1)[0] : null)),
      value: v.value,
      reformLevel: v.reformLevel,
      reformScore: v.reformScore,
      escapeCount: v.escapeCount,
      reformMission: v.reformMission,
      converted: v.converted,
      archetype: v.archetype,
      attackStyle: v.attackStyle,
      palette: v.palette,
      planetId: v.planetId,
      faction: v.faction,
      mercCodexKey: v.mercCodexKey,
    }),
  );
  state.capturedVillains.forEach((v) => applyReformDurationPolicy(v));
  if (!Array.isArray(state.prisonLog)) state.prisonLog = [];
  state.prisonNameVersion = 2;
}

function reformLevelFromScore(score) {
  const s = Math.round(Number(score || 0));
  if (s >= 0) return Math.floor(s / 100);
  return -Math.floor(Math.abs(s) / 100);
}

function ensureVillainReformGauge(villain) {
  if (!villain) return;
  if (!Number.isFinite(villain.reformScore)) villain.reformScore = Math.round((villain.reformLevel || 0) * 100);
  villain.reformScore = clamp(Math.round(villain.reformScore), -500, 500);
  villain.reformLevel = reformLevelFromScore(villain.reformScore);
}

function applyVillainReformDelta(villain, deltaScore) {
  ensureVillainReformGauge(villain);
  villain.reformScore = clamp(Math.round(villain.reformScore + deltaScore), -500, 500);
  villain.reformLevel = reformLevelFromScore(villain.reformScore);
}

function getVillainReformTierMeta(villainTier = "normal") {
  const map = {
    normal: { gainMul: 1, lossMul: 1, label: "전투원" },
    named: { gainMul: 0.78, lossMul: 1.05, label: "네임드 간부" },
    midboss: { gainMul: 0.56, lossMul: 1.14, label: "중간 보스" },
    finalboss: { gainMul: 0.34, lossMul: 1.28, label: "최종 보스" },
  };
  return map[villainTier] || map.normal;
}

function getReformGaugeUi(villain) {
  ensureVillainReformGauge(villain);
  const score = villain.reformScore || 0;
  const level = villain.reformLevel || 0;
  const rem = Math.abs(score) % 100;
  const pct = clamp(rem, 0, 100);
  const up = score >= 0;
  return {
    level,
    score,
    pct,
    up,
    text: `${score >= 0 ? "+" : ""}${score}pt`,
  };
}

const REFORM_DURATION_MS_BY_TIER = {
  basic: 0,
  tactical: 30 * 1000,
  intensive: 60 * 1000,
};

function applyReformDurationPolicy(villain) {
  if (!villain?.reformMission) return;
  const m = villain.reformMission;
  const dur = REFORM_DURATION_MS_BY_TIER[m.tier] ?? 0;
  const startedAt = Number.isFinite(m.startedAt) ? m.startedAt : Date.now();
  m.startedAt = startedAt;
  if (m.tier === "basic") {
    m.endsAt = Date.now() - 1;
    return;
  }
  const targetEndsAt = startedAt + dur;
  if (!Number.isFinite(m.endsAt) || m.endsAt > targetEndsAt) {
    m.endsAt = targetEndsAt;
  }
}

function rollRecruitOffer(tier = "market") {
  const seed = pickRandom(getUnitCodexCatalog());
  const unitType = seed?.unitType || (Math.random() < (tier === "black" ? 0.4 : 0.55) ? "hero" : "merc");
  const roleClass = seed?.roleClass || pickRandom(ROLE_ORDER);
  const rangeClass = seed?.rangeClass || pickRandom(RANGE_ORDER);
  const attribute = seed?.attribute || pickRandom(ATTR_ORDER);
  const team = seed?.team || pickRandom(["조디악", "셈하프", "게티아", "엘리멘탈", "오리지널"]);
  const mid = tier === "black" ? randInt(16, 40) : randInt(9, 24);
  const hp = tier === "black" ? randInt(150, 260) : randInt(90, 170);
  const contract = tier === "black" ? randInt(1600, 5200) : randInt(280, 1300);
  const rank = tier === "black" ? pickRandom(["베테랑", "엘리트", "전설"]) : pickRandom(["신입", "중급", "숙련"]);
  const classType = roleClass;
  const fixedMeleeType = seed?.fixedMeleeType || pickRandom(MELEE_TYPES)?.key || "소드";
  const fixedFirearmType = seed?.fixedFirearmType || pickRandom(FIREARM_TYPES)?.key || "AR";
  const canUseDefense = typeof seed?.canUseDefense === "boolean" ? seed.canUseDefense : Math.random() < 0.5;
  const codexKey = seed?.key || `${unitType}|${fixedFirearmType}|${fixedMeleeType}|${canUseDefense ? 1 : 0}|${rangeClass}|${attribute}|${roleClass}`;
  return {
    id: `offer-${tier}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    unitType,
    rank,
    contract,
    name: seed?.name || `${pickRandom(VILLAIN_NORMAL_A)} ${pickRandom(VILLAIN_NORMAL_B)}`,
    atk: mid + randInt(0, 10),
    def: Math.max(4, Math.round(mid * 0.62)),
    hp,
    speed: randInt(11, 22),
    ability: pickRandom(["전술 교란", "정밀 사격", "돌파 지휘", "쉴드 타격", "교전 분석", "피해 분산", "응급 봉합", "초근접 압박"]),
    roleClass,
    rangeClass,
    attribute,
    team,
    classType,
    fixedMeleeType,
    fixedFirearmType,
    canUseDefense,
    codexKey,
    color: getAttributeColor(attribute),
    weaponType: fixedFirearmType,
    abilityIcon: pickRandom(["scope", "reload", "guard", "dash", "rage"]),
  };
}

function normalizeRecruitOffer(input = {}, tier = "market") {
  const unitType = input.unitType === "merc" ? "merc" : "hero";
  const roleClass = input.roleClass || input.classType || pickRandom(ROLE_ORDER) || "오펜서";
  const rangeClass = input.rangeClass || pickRandom(RANGE_ORDER) || "중거리";
  const attribute = input.attribute || pickRandom(ATTR_ORDER) || "물리";
  const team = input.team || pickRandom(["조디악", "셈하프", "게티아", "엘리멘탈", "오리지널"]) || "오리지널";
  const atk = Number.isFinite(input.atk) ? input.atk : randInt(10, 26);
  const def = Number.isFinite(input.def) ? input.def : randInt(5, 16);
  const hp = Number.isFinite(input.hp) ? input.hp : randInt(90, 180);
  const speed = Number.isFinite(input.speed) ? input.speed : randInt(11, 22);
  const contract = Number.isFinite(input.contract) ? input.contract : tier === "black" ? randInt(1600, 5200) : randInt(280, 1300);
  const rank = input.rank || (tier === "black" ? pickRandom(["베테랑", "엘리트", "전설"]) : pickRandom(["신입", "중급", "숙련"])) || "신입";
  const fixedMeleeType = input.fixedMeleeType || pickRandom(MELEE_TYPES)?.key || "소드";
  const fixedFirearmType = input.fixedFirearmType || firearmForRangeFixed(rangeClass);
  const canUseDefense = typeof input.canUseDefense === "boolean" ? input.canUseDefense : ["디펜서", "어썰트", "버서커", "스폐셜"].includes(roleClass);
  const codexKey = input.codexKey || `${unitType}|${fixedFirearmType}|${fixedMeleeType}|${canUseDefense ? 1 : 0}|${rangeClass}|${getAttributeBase(attribute)}|${roleClass}`;
  return {
    id: input.id || `offer-${tier}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    unitType,
    rank,
    contract,
    name: input.name || `${pickRandom(VILLAIN_NORMAL_A)} ${pickRandom(VILLAIN_NORMAL_B)}`,
    atk,
    def,
    hp,
    speed,
    ability: input.ability || pickRandom(["전술 교란", "정밀 사격", "돌파 지휘", "쉴드 타격", "교전 분석", "피해 분산", "응급 봉합", "초근접 압박"]) || "전술 교란",
    roleClass,
    rangeClass,
    attribute,
    team,
    classType: input.classType || roleClass,
    fixedMeleeType,
    fixedFirearmType,
    canUseDefense,
    codexKey,
    color: input.color || getAttributeColor(attribute),
    weaponType: input.weaponType || (rangeClass === "근거리" ? "shotgun" : rangeClass === "원거리" ? "sniper" : "rifle"),
    abilityIcon: input.abilityIcon || pickRandom(["scope", "reload", "guard", "dash", "rage"]) || "scope",
  };
}

function rerollShopOffers(kind = "market", count = 8) {
  const arr = [...Array(count)].map(() => rollRecruitOffer(kind));
  if (kind === "black") state.blackMarketOffers = arr;
  else state.marketOffers = arr;
}

function ensureTradeState() {
  if (!Array.isArray(state.marketOffers)) state.marketOffers = [];
  if (!Array.isArray(state.blackMarketOffers)) state.blackMarketOffers = [];
  state.marketOffers = state.marketOffers.map((x) => normalizeRecruitOffer(x, "market"));
  state.blackMarketOffers = state.blackMarketOffers.map((x) => normalizeRecruitOffer(x, "black"));
  if (state.marketOffers.length < 8) rerollShopOffers("market", 12);
  if (state.blackMarketOffers.length < 6) rerollShopOffers("black", 10);
}

function hireUnitFromOffer(offer) {
  if (!offer) return;
  const normalized = normalizeRecruitOffer(offer, state.baseTab === "black" ? "black" : "market");
  if (!spendCredits(normalized.contract)) {
    alert("크레딧 부족");
    return;
  }
  const payload = {
    id: `${normalized.unitType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sourceId: normalized.id,
    name: normalized.name,
    unitType: normalized.unitType,
    rank: normalized.rank,
    contract: normalized.contract,
    atk: normalized.atk,
    def: normalized.def,
    hp: normalized.hp,
    speed: normalized.speed,
    ability: normalized.ability,
    roleClass: normalized.roleClass,
    rangeClass: normalized.rangeClass,
    fixedMeleeType: normalized.fixedMeleeType,
    fixedFirearmType: normalized.fixedFirearmType,
    codexKey: normalized.codexKey,
    attribute: normalized.attribute,
    team: normalized.team,
    teamEffect: TEAM_EFFECTS[normalized.team] || "없음",
    classType: normalized.classType,
    color: normalized.color,
    weaponType: normalized.weaponType,
    abilityIcon: normalized.abilityIcon,
    level: 1,
    deployed: false,
    equippedMelee: null,
    equippedFirearm: null,
    equippedDefense: null,
    equippedGears: [],
    canUseDefense: typeof normalized.canUseDefense === "boolean" ? normalized.canUseDefense : ["디펜서", "어썰트", "버서커", "스폐셜"].includes(normalized.roleClass || normalized.classType),
  };
  if (normalized.unitType === "hero") state.heroes.push(payload);
  else {
    payload.randomLoadout = MERC_LOADOUT_POOL[randInt(0, MERC_LOADOUT_POOL.length - 1)];
    state.mercs.push(payload);
  }
}

function getFactoryCostScale() {
  const plantLv = clamp(Math.max(1, Number(state.powerPlantLevel || 1)), 1, PLANT_MAX_LEVEL);
  return clamp(1 - plantLv * 0.04, 0.65, 1);
}

function formatFactoryCost(baseCredit, baseTerra = 0, count = 1) {
  const c = calcFactoryCost(baseCredit * Math.max(1, count), baseTerra * Math.max(1, count));
  return `크레딧 ${c.credit}${c.terra > 0 ? ` / 테라코어 ${c.terra}` : ""}`;
}

function buildFactoryPreviewSummary() {
  const weaponCatalog = createWeaponCatalog();
  const gearCatalog = createGearCatalog();
  const mechWeaponCatalog = createMechWeaponCatalog();
  const mechModuleCatalog = createMechModuleCatalog();
  const mechSample = pickRandom(createStarterMechs()) || null;
  const heroSamples = [];
  for (let i = 0; i < 14; i += 1) {
    const o = normalizeRecruitOffer(rollRecruitOffer("market"), "market");
    if (o.unitType === "hero") heroSamples.push(o);
  }
  const heroSample = heroSamples[0] || normalizeRecruitOffer(rollRecruitOffer("market"), "market");
  const nextLockedShip = (state.hangarShips || []).find((s) => !s.unlocked) || null;
  const nextShipIdx = (state.hangarShips || []).length + 1;
  const nextShipCap = clamp(12 + nextShipIdx * 3, 12, 30);
  return {
    heroSample,
    weaponSample: pickRandom(weaponCatalog) || null,
    gearSample: pickRandom(gearCatalog) || null,
    mechWeaponSample: pickRandom(mechWeaponCatalog) || null,
    mechModuleSample: pickRandom(mechModuleCatalog.filter((x) => x.slotType === "module")) || null,
    weaponCatalogSize: weaponCatalog.length,
    gearCatalogSize: gearCatalog.length,
    mechWeaponCatalogSize: mechWeaponCatalog.length,
    mechModuleBaseCount: MECH_MODULE_BASES.length,
    mechModuleTotalCount: mechModuleCatalog.filter((x) => x.slotType === "module").length,
    nextLockedShip,
    nextShipCap,
    mechSample,
  };
}

function calcFactoryCost(baseCredit, baseTerra = 0) {
  const s = getFactoryCostScale();
  return {
    credit: Math.max(1, Math.round(baseCredit * s)),
    terra: Math.max(0, Math.round(baseTerra * s)),
  };
}

function getPlantResourceGain(resourceId, level = 1) {
  const lv = clamp(Math.max(1, Number(level || 1)), 1, PLANT_MAX_LEVEL);
  if (resourceId === "terra_core") return 100 * lv;
  const def = RESOURCE_DEFS[resourceId];
  if (!def) return 0;
  if (def.type === "attribute") return 36 * lv;
  if (def.type === "special") return 18 * lv;
  return 28 * lv;
}

function ensurePlantProductionState() {
  if (!state || typeof state !== "object") return;
  state.powerPlantLevel = clamp(Math.max(1, Number(state.powerPlantLevel || 1)), 1, PLANT_MAX_LEVEL);
  const now = Date.now();
  if (!state.plantProduction || typeof state.plantProduction !== "object") {
    state.plantProduction = { lastTick: now, credit: 0, power: 0, resources: {} };
  }
  if (!Number.isFinite(state.plantProduction.lastTick)) state.plantProduction.lastTick = now;
  if (!Number.isFinite(state.plantProduction.credit)) state.plantProduction.credit = 0;
  if (!Number.isFinite(state.plantProduction.power)) state.plantProduction.power = 0;
  if (!state.plantProduction.resources || typeof state.plantProduction.resources !== "object") state.plantProduction.resources = {};
  Object.keys(RESOURCE_DEFS).forEach((rid) => {
    if (!Number.isFinite(state.plantProduction.resources[rid])) state.plantProduction.resources[rid] = 0;
  });
}

function getPlantCreditRatePerHour(level = state?.powerPlantLevel || 1) {
  return 360 * clamp(Math.max(1, Number(level || 1)), 1, PLANT_MAX_LEVEL);
}

function getPlantPowerRatePerHour(level = state?.powerPlantLevel || 1) {
  return 25 * clamp(Math.max(1, Number(level || 1)), 1, PLANT_MAX_LEVEL);
}

function getPlantResourceRatePerHour(resourceId, level = state?.powerPlantLevel || 1) {
  return getPlantResourceGain(resourceId, level);
}

function updatePlantAccumulation(now = Date.now()) {
  ensurePlantProductionState();
  const pp = state.plantProduction;
  const safeNow = Number.isFinite(now) ? now : Date.now();
  const last = clamp(Number(pp.lastTick || safeNow), 0, safeNow);
  const elapsedMs = Math.max(0, safeNow - last);
  if (elapsedMs <= 0) return;
  const elapsedHours = Math.min(PLANT_MAX_ACCUM_HOURS, elapsedMs / 3600000);
  const lv = clamp(Math.max(1, Number(state.powerPlantLevel || 1)), 1, PLANT_MAX_LEVEL);
  const maxCredit = getPlantCreditRatePerHour(lv) * PLANT_MAX_ACCUM_HOURS;
  const maxPower = getPlantPowerRatePerHour(lv) * PLANT_MAX_ACCUM_HOURS;
  pp.credit = Math.min(maxCredit, Number(pp.credit || 0) + getPlantCreditRatePerHour(lv) * elapsedHours);
  pp.power = Math.min(maxPower, Number(pp.power || 0) + getPlantPowerRatePerHour(lv) * elapsedHours);
  Object.keys(RESOURCE_DEFS).forEach((rid) => {
    const maxRes = getPlantResourceRatePerHour(rid, lv) * PLANT_MAX_ACCUM_HOURS;
    pp.resources[rid] = Math.min(maxRes, Number(pp.resources[rid] || 0) + getPlantResourceRatePerHour(rid, lv) * elapsedHours);
  });
  pp.lastTick = safeNow;
}

function getStarValue(v) {
  return clamp(Math.floor(Number(v) || 0), 0, 10);
}

function getStarDots(star) {
  const s = getStarValue(star);
  return `${"●".repeat(s)}${"○".repeat(10 - s)}`;
}

function getUnitMaxLevel(unit) {
  return 100 + getStarValue(unit?.star) * 10;
}

function getMechMaxLevel(mech) {
  return 100 + getStarValue(mech?.star) * 10;
}

const SHIP_MAX_UPGRADE_LV = 100;
const SHIP_MAX_CAPACITY = 100;

function getShipBaseCapacity(ship) {
  const base = Number(ship?.baseCapacity || 0);
  if (Number.isFinite(base) && base > 0) return Math.round(base);
  const cap = Number(ship?.capacity || 12);
  return clamp(Math.round(cap), 10, SHIP_MAX_CAPACITY);
}

function calcShipCapacityByUpgrade(ship, upgradeLv = 0) {
  const lv = clamp(Math.round(Number(upgradeLv || 0)), 0, SHIP_MAX_UPGRADE_LV);
  const base = getShipBaseCapacity(ship);
  if (lv >= SHIP_MAX_UPGRADE_LV) return SHIP_MAX_CAPACITY;
  const grown = base + ((SHIP_MAX_CAPACITY - base) * lv) / SHIP_MAX_UPGRADE_LV;
  return clamp(Math.round(grown), base, SHIP_MAX_CAPACITY);
}

function getStarMultiplier(star) {
  return Math.pow(1.22, getStarValue(star));
}

function getUnitCodexKey(unit) {
  if (!unit) return "";
  return unit.codexKey || `${unit.unitType || "hero"}|${unit.fixedFirearmType || firearmForRangeFixed(unit.rangeClass)}|${unit.fixedMeleeType || "소드"}|${unit.canUseDefense ? 1 : 0}|${unit.rangeClass || "중거리"}|${getAttributeBase(unit.attribute || "물리")}|${unit.roleClass || unit.classType || "오펜서"}`;
}

function getOwnedUnitCountByCodexKey(key) {
  if (!key) return 0;
  return [...(state.heroes || []), ...(state.mercs || [])].filter((u) => getUnitCodexKey(u) === key).length;
}

function getUnitNameTypeKey(unit) {
  if (!unit) return "";
  const name = String(unit.name || "").trim();
  const type = unit.unitType === "merc" ? "merc" : "hero";
  return `${name}::${type}`;
}

function getOwnedUnitCountByNameType(key) {
  if (!key) return 0;
  return [...(state.heroes || []), ...(state.mercs || [])].filter((u) => getUnitNameTypeKey(u) === key).length;
}

function getUnitPromotionGroupKey(unit) {
  if (!unit) return "";
  return getUnitNameTypeKey(unit);
}

function getOwnedUnitCountByPromotionGroup(baseUnit) {
  if (!baseUnit) return 0;
  const key = getUnitPromotionGroupKey(baseUnit);
  if (!key) return 0;
  return [...(state.heroes || []), ...(state.mercs || [])].filter((u) => getUnitPromotionGroupKey(u) === key).length;
}

function getPromotionCostByStar(star) {
  return 1;
}

function returnUnitLoadoutToInventory(unit, pushToInventory = true) {
  if (!unit) return;
  if (pushToInventory) {
    [unit.equippedMelee, unit.equippedFirearm, unit.equippedDefense, ...(unit.equippedGears || [])]
      .filter(Boolean)
      .forEach((it) => state.inventory.push(it));
  }
  unit.equippedMelee = null;
  unit.equippedFirearm = null;
  unit.equippedDefense = null;
  unit.equippedGears = [];
}

function reconcileUnitRosterToSinglePerCodex() {
  const catalog = getUnitCodexCatalog();
  const catalogKeySet = new Set(catalog.map((c) => c.key));
  const byNameType = new Map(catalog.map((c) => [`${String(c.name || "").trim()}::${c.unitType === "merc" ? "merc" : "hero"}`, c.key]));
  const heroKeys = catalog.filter((c) => c.unitType !== "merc").map((c) => c.key);
  const mercKeys = catalog.filter((c) => c.unitType === "merc").map((c) => c.key);

  const normalizeToCatalogKey = (unit) => {
    let key = replaceZweihanderText(getUnitCodexKey(unit));
    if (!catalogKeySet.has(key)) {
      const nt = getUnitNameTypeKey(unit);
      key = byNameType.get(nt) || "";
    }
    if (!catalogKeySet.has(key)) {
      const pool = unit.unitType === "merc" ? mercKeys : heroKeys;
      const src = `${unit.id || ""}|${unit.name || ""}|${unit.roleClass || ""}|${unit.rangeClass || ""}`;
      const h = Math.abs(src.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
      key = pool[h % Math.max(1, pool.length)] || catalog[0]?.key || "";
    }
    unit.codexKey = key;
    return key;
  };

  const all = [...(state.heroes || []), ...(state.mercs || [])];
  const selectedByKey = new Map();
  const dupCountByKey = new Map();
  let removed = 0;
  let promoted = 0;
  for (let i = 0; i < all.length; i += 1) {
    const u = all[i];
    const key = normalizeToCatalogKey(u);
    const prev = selectedByKey.get(key);
    if (!prev) {
      selectedByKey.set(key, { unit: u, score: Number(u.deployed) * 1_000_000_000 + getStarValue(u.star) * 1_000_000 + Number(u.level || 1) * 1_000 - i });
      continue;
    }
    removed += 1;
    dupCountByKey.set(key, (dupCountByKey.get(key) || 0) + 1);
    const score = Number(u.deployed) * 1_000_000_000 + getStarValue(u.star) * 1_000_000 + Number(u.level || 1) * 1_000 - i;
    if (score > prev.score) {
      prev.unit.deployed = false;
      selectedByKey.set(key, { unit: u, score });
    } else {
      u.deployed = false;
    }
  }

  let finalKeepers = [...selectedByKey.values()].map((x) => x.unit);
  finalKeepers.forEach((keeper) => {
    const key = keeper.codexKey;
    const extras = dupCountByKey.get(key) || 0;
    if (extras <= 0) return;
    let star = getStarValue(keeper.star);
    const promoteCount = Math.min(extras, Math.max(0, 10 - star));
    for (let i = 0; i < promoteCount; i += 1) {
      const oldMul = getStarMultiplier(star);
      const newMul = getStarMultiplier(star + 1);
      const ratio = newMul / oldMul;
      keeper.star = star + 1;
      keeper.atk = Math.max(1, Math.round((keeper.atk || 1) * ratio));
      keeper.def = Math.max(1, Math.round((keeper.def || 1) * ratio));
      keeper.hp = Math.max(1, Math.round((keeper.hp || 1) * ratio));
      keeper.speed = Math.max(1, Number(((keeper.speed || 1) * ratio).toFixed(2)));
      star += 1;
      promoted += 1;
    }
  });

  if (finalKeepers.length > catalog.length) {
    finalKeepers.sort((a, b) => {
      const sa = getStarValue(b.star) - getStarValue(a.star);
      if (sa) return sa;
      const la = (b.level || 1) - (a.level || 1);
      if (la) return la;
      return String(a.id || "").localeCompare(String(b.id || ""), "ko");
    });
    const dropped = finalKeepers.slice(catalog.length);
    dropped.forEach((u) => {
      returnUnitLoadoutToInventory(u, false);
      u.deployed = false;
    });
    removed += dropped.length;
    finalKeepers = finalKeepers.slice(0, catalog.length);
  }

  // Ensure unique IDs (legacy duplicated id safety).
  const usedIds = new Set();
  finalKeepers.forEach((u, idx) => {
    let uid = String(u.id || `${u.unitType || "hero"}-fix-${idx + 1}`);
    while (usedIds.has(uid)) uid = `${uid}-x`;
    u.id = uid;
    usedIds.add(uid);
  });

  state.heroes = finalKeepers.filter((u) => (u.unitType || "hero") !== "merc");
  state.mercs = finalKeepers.filter((u) => (u.unitType || "hero") === "merc");

  if (!state.hqSelectedHeroId || !(state.heroes || []).some((h) => h.id === state.hqSelectedHeroId)) {
    state.hqSelectedHeroId = state.heroes[0]?.id || null;
  }

  const deployCap = getDeployCapacity();
  const deployed = getAllUnits().filter((u) => u.deployed);
  if (deployed.length > deployCap) {
    for (let i = deployCap; i < deployed.length; i += 1) deployed[i].deployed = false;
  }
  const deployedIds = new Set(getAllUnits().filter((u) => u.deployed).map((u) => u.id));
  (state.mechs || []).forEach((m) => {
    if (m.pilotId && !deployedIds.has(m.pilotId)) m.pilotId = null;
  });

  const uniqueNow = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
  return { removed, promoted, total: getAllUnits().length, unique: uniqueNow };
}

function enforceExactUnitRosterByCodex() {
  const target = getUnitCodexCatalog().length;
  grantFullCodexUnlockRoster();
  let changed = false;
  let total = getAllUnits().length;
  let unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;

  // 1) If over target, prioritize trimming/deduping first (fast path).
  if (total > target || unique > target) {
    reconcileUnitRosterToSinglePerCodex();
    changed = true;
    total = getAllUnits().length;
    unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
  }

  // 2) Fill only actually missing codex keys.
  if (total < target || unique < target) {
    const catalogKeys = getUnitCodexCatalog().map((c) => c.key);
    const ownedKeys = new Set(getAllUnits().map((u) => getUnitCodexKey(u)));
    const missingKeys = [];
    for (let i = 0; i < catalogKeys.length; i += 1) {
      const k = catalogKeys[i];
      if (!ownedKeys.has(k)) missingKeys.push(k);
    }
    if (missingKeys.length) {
      grantMissingPlayableUnitsByKeysSync(missingKeys);
      reconcileUnitRosterToSinglePerCodex();
      changed = true;
      total = getAllUnits().length;
      unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
    }
  }

  // 3) Final hard cap to exact target.
  if (total > target) {
    const sorted = sortUnitsGrouped(getAllUnits());
    const keepSet = new Set(sorted.slice(0, target));
    state.heroes = (state.heroes || []).filter((u) => keepSet.has(u));
    state.mercs = (state.mercs || []).filter((u) => keepSet.has(u));
    changed = true;
    total = getAllUnits().length;
    unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
  }

  const ok = total === target && unique === target;
  return { ok, changed, total, unique, target };
}

async function enforceExactUnitRosterByCodexWithProgress(onProgress) {
  const t0 = performance.now();
  const stageAt = {};
  const mark = (name) => {
    stageAt[name] = performance.now();
  };
  const elapsed = (name) => `${Math.max(0, Math.round(performance.now() - (stageAt[name] || t0)))}ms`;
  const totalElapsed = () => `${Math.max(0, Math.round(performance.now() - t0))}ms`;
  const report = (p, txt) => {
    if (typeof onProgress === "function") onProgress(clamp(p, 0, 100), txt || "정리 중...");
  };
  const target = getUnitCodexCatalog().length;
  mark("unlock");
  report(6, "도감 키 동기화");
  await nextFrame();
  grantFullCodexUnlockRoster();
  report(10, `도감 키 동기화 완료 (${elapsed("unlock")})`);

  let total = getAllUnits().length;
  let unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
  let changed = false;

  if (total > target || unique > target) {
    mark("dedupe1");
    report(24, `중복 정리 (${total}/${target})`);
    await nextFrame();
    reconcileUnitRosterToSinglePerCodex();
    changed = true;
    await nextFrame();
    total = getAllUnits().length;
    unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
    report(32, `중복 정리 완료 (${elapsed("dedupe1")})`);
  }

  if (total < target || unique < target) {
    mark("scan");
    report(34, `누락 키 탐색 (${total}/${target})`);
    await nextFrame();
    const catalogKeys = getUnitCodexCatalog().map((c) => c.key);
    const ownedKeys = new Set(getAllUnits().map((u) => getUnitCodexKey(u)));
    const missingKeys = [];
    for (let i = 0; i < catalogKeys.length; i += 1) {
      const k = catalogKeys[i];
      if (!ownedKeys.has(k)) missingKeys.push(k);
      if (i % 800 === 0) await nextFrame();
    }
    report(44, `누락 키 탐색 완료 (${missingKeys.length}개, ${elapsed("scan")})`);
    if (missingKeys.length > 0) {
      mark("fill");
      report(46, `누락 유닛 보충 (${missingKeys.length})`);
      await nextFrame();
      await grantMissingPlayableUnitsByKeys(missingKeys, (p, txt) => report(46 + p * 0.36, `${txt || "누락 보충 중..."} (${elapsed("fill")})`));
      report(84, `누락 유닛 보충 완료 (${elapsed("fill")})`);
      mark("dedupe2");
      report(86, "보충 후 정리");
      await nextFrame();
      reconcileUnitRosterToSinglePerCodex();
      changed = true;
      await nextFrame();
      total = getAllUnits().length;
      unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
      report(92, `보충 후 정리 완료 (${elapsed("dedupe2")})`);
    }
  }

  if (total > target) {
    mark("trim");
    report(94, "최종 정리");
    await nextFrame();
    const sorted = sortUnitsGrouped(getAllUnits());
    const keepSet = new Set(sorted.slice(0, target));
    state.heroes = (state.heroes || []).filter((u) => keepSet.has(u));
    state.mercs = (state.mercs || []).filter((u) => keepSet.has(u));
    changed = true;
    await nextFrame();
    total = getAllUnits().length;
    unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
    report(98, `최종 정리 완료 (${elapsed("trim")})`);
  }

  report(100, `완료 (${total}/${target}, 전체 ${totalElapsed()})`);
  return { ok: total === target && unique === target, changed, total, unique, target };
}

function ensureExactPlayableRosterSync(maxPass = 3) {
  let unitRes = { ok: false, total: 0, target: getUnitCodexCatalog().length, unique: 0 };
  let mechRes = { total: 0, target: getMechCodexCatalog().length, unlocked: 0 };
  for (let i = 0; i < maxPass; i += 1) {
    unitRes = enforceExactUnitRosterByCodex();
    mechRes = enforceExactMechRosterByCodex();
    const mechOk = mechRes.total === mechRes.target && mechRes.unlocked === mechRes.target;
    if (unitRes.ok && mechOk) break;
  }
  const mechOk = mechRes.total === mechRes.target && mechRes.unlocked === mechRes.target;
  if (!unitRes.ok || !mechOk) {
    const unitHard = rebuildUnitRosterFromCodexHard();
    const mechHard = rebuildMechRosterFromCodexHard();
    unitRes = {
      ok: unitHard.total === unitHard.target && unitHard.unique === unitHard.target,
      changed: true,
      total: unitHard.total,
      unique: unitHard.unique,
      target: unitHard.target,
    };
    mechRes = {
      changed: true,
      total: mechHard.total,
      target: mechHard.target,
      unlocked: mechHard.unlocked,
    };
  }
  return { unit: unitRes, mech: mechRes };
}

function rebuildUnitRosterFromCodexHard() {
  const catalog = getUnitCodexCatalog();
  const catalogMap = new Map(catalog.map((r) => [r.key, r]));
  const all = [...(state.heroes || []), ...(state.mercs || [])];
  const bestByKey = new Map();
  const nameTypeQueues = new Map();
  const scoreOf = (u, idx) => Number(!!u.deployed) * 1_000_000_000 + getStarValue(u.star) * 1_000_000 + Number(u.level || 1) * 1_000 - idx;
  all.forEach((u, idx) => {
    const k = getUnitCodexKey(u);
    if (catalogMap.has(k)) {
      const prev = bestByKey.get(k);
      const sc = scoreOf(u, idx);
      if (!prev || sc > prev.score) bestByKey.set(k, { unit: u, score: sc });
      return;
    }
    const nt = getUnitNameTypeKey(u);
    if (!nameTypeQueues.has(nt)) nameTypeQueues.set(nt, []);
    nameTypeQueues.get(nt).push({ unit: u, score: scoreOf(u, idx) });
  });
  const keepers = [];
  const usedIds = new Set();
  catalog.forEach((row, idx) => {
    const direct = bestByKey.get(row.key)?.unit || null;
    const nt = `${String(row.name || "").trim()}::${row.unitType === "merc" ? "merc" : "hero"}`;
    const q = nameTypeQueues.get(nt) || [];
    q.sort((a, b) => b.score - a.score);
    const byName = q.length ? q.shift().unit : null;
    const picked = direct || byName || buildPlayableUnitFromCodexRow(row, idx);
    picked.codexKey = row.key;
    picked.unitType = row.unitType === "merc" ? "merc" : "hero";
    normalizeUnitWeaponRules(picked);
    if (!picked.equippedMelee) picked.equippedMelee = createItemIconLoadout("melee", picked);
    if (!picked.equippedFirearm) picked.equippedFirearm = createItemIconLoadout("firearm", picked);
    if (picked.canUseDefense && !picked.equippedDefense) picked.equippedDefense = createItemIconLoadout("defense", picked);
    if (!Array.isArray(picked.equippedGears)) picked.equippedGears = [createDefaultGearForUnit(picked)];
    let uid = String(picked.id || `hard-u-${idx + 1}`);
    while (usedIds.has(uid)) uid = `${uid}-h`;
    picked.id = uid;
    usedIds.add(uid);
    keepers.push(picked);
  });
  state.heroes = keepers.filter((u) => u.unitType !== "merc");
  state.mercs = keepers.filter((u) => u.unitType === "merc");
  if (!state.hqSelectedHeroId || !state.heroes.some((h) => h.id === state.hqSelectedHeroId)) state.hqSelectedHeroId = state.heroes[0]?.id || null;
  return { total: keepers.length, unique: new Set(keepers.map((u) => getUnitCodexKey(u))).size, target: catalog.length };
}

function rebuildMechRosterFromCodexHard() {
  const catalog = getMechCodexCatalog();
  const all = [...(state.mechs || [])];
  const byKey = new Map();
  all.forEach((m, idx) => {
    const k = getMechCodexKeyNormalized(m);
    const sc = Number(!!m.unlocked) * 1_000_000_000 + getStarValue(m.star) * 1_000_000 + Number(m.level || 1) * 1_000 - idx;
    const prev = byKey.get(k);
    if (!prev || sc > prev.score) byKey.set(k, { mech: m, score: sc });
  });
  const ids = new Set(all.map((m) => m.id));
  const out = catalog.map((row, idx) => {
    const kept = byKey.get(row.key)?.mech || buildPlayableMechFromCodexRow(row, idx, ids);
    kept.codexKey = row.key;
    kept.unlocked = true;
    if (!Array.isArray(kept.equippedModules)) kept.equippedModules = [];
    if (!Number.isFinite(kept.currentHp)) kept.currentHp = kept.hp;
    kept.currentHp = clamp(kept.currentHp, 0, kept.hp);
    return kept;
  });
  state.mechs = out;
  if (!state.activeMechId || !out.some((m) => m.id === state.activeMechId)) state.activeMechId = out[0]?.id || null;
  if (!state.hangarSelectedMechId || !out.some((m) => m.id === state.hangarSelectedMechId)) state.hangarSelectedMechId = out[0]?.id || null;
  return { total: out.length, target: catalog.length, unlocked: out.filter((m) => m.unlocked).length };
}

function promoteUnitByCodexKey(key) {
  const owned = sortUnitsGrouped([...(state.heroes || []), ...(state.mercs || [])]);
  const isNameTypeKey = String(key).includes("::");
  const list = owned
    .filter((u) => (isNameTypeKey ? getUnitNameTypeKey(u) === key : getUnitCodexKey(u) === key))
    .sort((a, b) => {
      const pa = Number(b.id === state.hqSelectedHeroId) + Number(b.deployed) * 2;
      const pb = Number(a.id === state.hqSelectedHeroId) + Number(a.deployed) * 2;
      if (pa !== pb) return pa - pb;
      const sa = getStarValue(b.star) - getStarValue(a.star);
      if (sa) return sa;
      const la = (b.level || 1) - (a.level || 1);
      if (la) return la;
      return String(a.name || "").localeCompare(String(b.name || ""), "ko");
    });
  if (!list.length) return { ok: false, reason: "대상 없음" };
  return promoteUnitByUnitId(list[0].id);
}

function promoteUnitByUnitId(unitId) {
  const base = getUnitById(unitId);
  if (!base) return { ok: false, reason: "대상 없음" };
  const star = getStarValue(base.star);
  if (star >= 10) return { ok: false, reason: "이미 10성" };
  const duplicateNeed = getPromotionCostByStar(star);
  const requiredOwned = duplicateNeed + 1;
  const groupKey = getUnitPromotionGroupKey(base);
  const heroEntries = (state.heroes || []).map((u, idx) => ({ bucket: "heroes", idx, unit: u }));
  const mercEntries = (state.mercs || []).map((u, idx) => ({ bucket: "mercs", idx, unit: u }));
  const allEntries = [...heroEntries, ...mercEntries].filter((e) => getUnitPromotionGroupKey(e.unit) === groupKey);
  if (allEntries.length < requiredOwned) return { ok: false, reason: "중복 유닛이 1개 더 필요합니다." };
  const targetAfterCount = allEntries.length - duplicateNeed;

  const candidates = allEntries
    .filter((e) => e.unit !== base)
    .sort((a, b) => {
      const pa = Number(a.unit.id === state.hqSelectedHeroId) + Number(a.unit.deployed) * 2;
      const pb = Number(b.unit.id === state.hqSelectedHeroId) + Number(b.unit.deployed) * 2;
      if (pa !== pb) return pa - pb; // 선택/출격이 아닌 개체를 우선 소모
      return (a.unit.level || 1) - (b.unit.level || 1);
    });
  const removedEntries = candidates.slice(0, duplicateNeed);
  if (removedEntries.length < duplicateNeed) return { ok: false, reason: "중복 유닛이 1개 더 필요합니다." };

  removedEntries.forEach((e) => {
    const u = e.unit;
    [u.equippedMelee, u.equippedFirearm, u.equippedDefense, ...(u.equippedGears || [])]
      .filter(Boolean)
      .forEach((it) => state.inventory.push(it));
  });

  removedEntries
    .sort((a, b) => (a.bucket === b.bucket ? b.idx - a.idx : String(a.bucket).localeCompare(String(b.bucket), "ko")))
    .forEach((e) => {
      const arr = e.bucket === "heroes" ? state.heroes : state.mercs;
      if (!Array.isArray(arr) || !arr.length) return;
      let idx = e.idx;
      if (arr[idx] !== e.unit) idx = arr.findIndex((x) => x === e.unit);
      if (idx < 0) idx = arr.findIndex((x) => x !== base && getUnitPromotionGroupKey(x) === groupKey);
      if (idx >= 0) arr.splice(idx, 1);
    });

  // Safety net: if removal was skipped by stale references/order mismatch, force-remove extras by group.
  const removeOneFallback = () => {
    const pools = [state.heroes || [], state.mercs || []];
    for (const arr of pools) {
      const idx = arr.findIndex((u) => u !== base && getUnitPromotionGroupKey(u) === groupKey);
      if (idx >= 0) {
        const u = arr[idx];
        [u.equippedMelee, u.equippedFirearm, u.equippedDefense, ...(u.equippedGears || [])]
          .filter(Boolean)
          .forEach((it) => state.inventory.push(it));
        arr.splice(idx, 1);
        return true;
      }
    }
    return false;
  };
  let guard = 8;
  while (guard > 0 && getOwnedUnitCountByPromotionGroup(base) > targetAfterCount) {
    if (!removeOneFallback()) break;
    guard -= 1;
  }

  const oldMul = getStarMultiplier(star);
  const newMul = getStarMultiplier(star + 1);
  const ratio = newMul / oldMul;
  base.star = star + 1;
  base.atk = Math.max(1, Math.round((base.atk || 1) * ratio));
  base.def = Math.max(1, Math.round((base.def || 1) * ratio));
  base.hp = Math.max(1, Math.round((base.hp || 1) * ratio));
  base.speed = Math.max(1, Number(((base.speed || 1) * ratio).toFixed(2)));
  return { ok: true, name: base.name, star: base.star, consumed: duplicateNeed };
}

function autoPromoteAllUnits() {
  const all = [...(state.heroes || []), ...(state.mercs || [])];
  if (!all.length) return { groups: 0, promotions: 0, consumed: 0 };
  const groups = new Map();
  all.forEach((u) => {
    const k = getUnitPromotionGroupKey(u);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(u);
  });

  let promotionCount = 0;
  let consumedCount = 0;
  let touchedGroups = 0;
  [...groups.entries()].forEach(([_, list]) => {
    if (!list || list.length < 2) return;
    const keeper = [...list].sort((a, b) => {
      const dep = Number(b.deployed) - Number(a.deployed);
      if (dep) return dep;
      const s = getStarValue(b.star) - getStarValue(a.star);
      if (s) return s;
      const lv = (b.level || 1) - (a.level || 1);
      if (lv) return lv;
      return String(a.id || "").localeCompare(String(b.id || ""), "ko");
    })[0];
    if (!keeper) return;
    let changed = false;
    let guard = 200;
    while (guard > 0) {
      const before = getOwnedUnitCountByPromotionGroup(keeper);
      const beforeStar = getStarValue(keeper.star);
      if (before <= 1 || beforeStar >= 10) break;
      const res = promoteUnitByUnitId(keeper.id);
      if (!res.ok) break;
      const after = getOwnedUnitCountByPromotionGroup(keeper);
      if (after >= before) break;
      promotionCount += 1;
      consumedCount += Math.max(1, before - after);
      changed = true;
      guard -= 1;
    }
    if (changed) touchedGroups += 1;
  });
  return { groups: touchedGroups, promotions: promotionCount, consumed: consumedCount };
}

function promoteMechByModelKey(key) {
  const owned = [...(state.mechs || [])]
    .filter((m) => m && m.unlocked && ((m.codexKey && m.codexKey === key) || (!m.codexKey && String(m.name || "").replace(/-P\d+$/i, "") === key)))
    .sort((a, b) => {
      const sa = Number(a.id === state.activeMechId) + Number(a.id === state.hangarSelectedMechId);
      const sb = Number(b.id === state.activeMechId) + Number(b.id === state.hangarSelectedMechId);
      if (sb !== sa) return sb - sa;
      return (b.level || 1) - (a.level || 1);
    });
  if (!owned.length) return { ok: false, reason: "대상 없음" };
  const base = owned[0];
  const star = getStarValue(base.star);
  if (star >= 10) return { ok: false, reason: "이미 10성" };
  const duplicateNeed = getPromotionCostByStar(star);
  const requiredOwned = duplicateNeed + 1;
  if (owned.length < requiredOwned) return { ok: false, reason: "중복 메카가 1기 더 필요합니다." };
  const removedMechs = owned.slice(1, 1 + duplicateNeed);
  removedMechs.forEach((m) => {
    [m.equippedMelee, m.equippedFirearm, m.equippedDefense, m.equippedCore, ...(m.equippedModules || [])]
      .filter(Boolean)
      .forEach((it) => state.mechInventory.push(it));
  });
  const removeIds = new Set(removedMechs.map((m) => m.id));
  state.mechs = (state.mechs || []).filter((m) => !removeIds.has(m.id));
  const oldMul = getStarMultiplier(star);
  const newMul = getStarMultiplier(star + 1);
  const ratio = newMul / oldMul;
  base.star = star + 1;
  base.atk = Math.max(1, Math.round((base.atk || 1) * ratio));
  base.def = Math.max(1, Math.round((base.def || 1) * ratio));
  base.hp = Math.max(1, Math.round((base.hp || 1) * ratio));
  base.currentHp = Math.min(base.hp, Math.round((base.currentHp || base.hp) * ratio));
  base.speed = Math.max(1, Number(((base.speed || 1) * ratio).toFixed(2)));
  return { ok: true, name: base.name, star: base.star, consumed: duplicateNeed };
}

function upgradeActiveShip() {
  const ship = getActiveShip();
  if (!ship) return { ok: false, reason: "우주선 없음" };
  const lv = Math.max(0, Number(ship.upgradeLv || 0));
  if (lv >= SHIP_MAX_UPGRADE_LV) return { ok: false, reason: `최대 레벨 도달 (Lv.${SHIP_MAX_UPGRADE_LV})` };
  const costCredit = 1400 + lv * 520;
  const costTerra = 220 + lv * 90;
  if (!spendCredits(costCredit)) return { ok: false, reason: "크레딧 부족" };
  if (!spendResource("terra_core", costTerra)) {
    if (!state.settings.infinite) state.credits += costCredit;
    return { ok: false, reason: "테라코어 부족" };
  }
  ship.baseCapacity = getShipBaseCapacity(ship);
  ship.upgradeLv = clamp(lv + 1, 0, SHIP_MAX_UPGRADE_LV);
  ship.capacity = calcShipCapacityByUpgrade(ship, ship.upgradeLv);
  ship.buffAtk = Number(((ship.buffAtk || 0) + 0.015).toFixed(3));
  ship.buffDef = Number(((ship.buffDef || 0) + 0.015).toFixed(3));
  ship.buffHp = Number(((ship.buffHp || 0) + 0.02).toFixed(3));
  ship.buffSpeed = Number(((ship.buffSpeed || 0) + 0.01).toFixed(3));
  return { ok: true, name: ship.name, lv: ship.upgradeLv, cap: ship.capacity, costCredit, costTerra };
}

function sortUnitsGrouped(units = []) {
  return [...units].sort((a, b) => {
    const sa = getStarValue(a?.star);
    const sb = getStarValue(b?.star);
    if (sb !== sa) return sb - sa;
    const la = Number(a?.level || 1);
    const lb = Number(b?.level || 1);
    if (lb !== la) return lb - la;
    const an = String(a?.name || "");
    const bn = String(b?.name || "");
    const n = an.localeCompare(bn, "ko");
    if (n) return n;
    const ut = String(a?.unitType || "").localeCompare(String(b?.unitType || ""), "ko");
    if (ut) return ut;
    const tm = String(a?.team || "").localeCompare(String(b?.team || ""), "ko");
    if (tm) return tm;
    return String(a?.id || "").localeCompare(String(b?.id || ""), "ko");
  });
}

function getUnitCodexEntries() {
  const catalog = getUnitCodexCatalog();
  const entries = new Map();
  const nameTypeKey = (u) => `${String(u?.name || "").trim()}::${u?.unitType === "merc" ? "merc" : "hero"}`;
  const makeKey = (u) =>
    u.codexKey ||
    `${u.unitType}|${u.fixedFirearmType || firearmForRangeFixed(u.rangeClass)}|${u.fixedMeleeType || "소드"}|${u.canUseDefense ? 1 : 0}|${u.rangeClass || "중거리"}|${getAttributeBase(u.attribute || "물리")}|${u.roleClass || u.classType || "오펜서"}`;
  const byNameType = new Map();
  const addCatalog = (u) => {
    const key = makeKey(u);
    if (entries.has(key)) return;
    const row = {
      key,
      name: u.name,
      unitType: u.unitType,
      owned: false,
      ownedCount: 0,
      sampleId: null,
      codexKey: key,
      star: 0,
      roleClass: u.roleClass || u.classType || "???",
      rangeClass: u.rangeClass || "???",
      attribute: u.attribute || "???",
      fixedFirearmType: u.fixedFirearmType || "???",
      fixedMeleeType: u.fixedMeleeType || "???",
      canUseDefense: !!u.canUseDefense,
      team: u.team || "???",
      ability: u.ability || "???",
      atk: u.atk || 0,
      def: u.def || 0,
      hp: u.hp || 0,
      speed: u.speed || 0,
    };
    entries.set(key, row);
    const nt = nameTypeKey(u);
    if (!byNameType.has(nt)) byNameType.set(nt, key);
  };
  catalog.forEach(addCatalog);

  const owned = [...(state.heroes || []), ...(state.mercs || [])];
  owned.forEach((u) => {
    const nt = nameTypeKey(u);
    const key = byNameType.get(nt) || makeKey(u);
    if (!entries.has(key)) return;
    const row = entries.get(key);
    row.owned = true;
    row.ownedCount += 1;
    row.sampleId = row.sampleId || u.id;
    row.star = Math.max(getStarValue(row.star), getStarValue(u.star));
    if ((u.atk || 0) + (u.def || 0) + (u.hp || 0) > (row.atk || 0) + (row.def || 0) + (row.hp || 0)) {
      row.roleClass = u.roleClass || u.classType || row.roleClass;
      row.rangeClass = u.rangeClass || row.rangeClass;
      row.attribute = u.attribute || row.attribute;
      row.fixedFirearmType = u.fixedFirearmType || row.fixedFirearmType;
      row.fixedMeleeType = u.fixedMeleeType || row.fixedMeleeType;
      row.canUseDefense = typeof u.canUseDefense === "boolean" ? u.canUseDefense : row.canUseDefense;
      row.team = u.team || row.team;
      row.ability = u.ability || row.ability;
      row.atk = u.atk || row.atk;
      row.def = u.def || row.def;
      row.hp = u.hp || row.hp;
      row.speed = u.speed || row.speed;
    }
  });

  const codexUnlockSet = new Set(Array.isArray(state.codexUnitUnlockKeys) ? state.codexUnitUnlockKeys : []);
  codexUnlockSet.forEach((k) => {
    const row = entries.get(k);
    if (!row) return;
    row.owned = true;
    row.ownedCount = Math.max(1, Number(row.ownedCount || 0));
  });

  return [...entries.values()].sort((a, b) => {
    const n = a.name.localeCompare(b.name, "ko");
    if (n) return n;
    return String(a.unitType).localeCompare(String(b.unitType), "ko");
  });
}

function getMechCodexEntries() {
  const baseModels = getMechCodexCatalog();
  const entries = new Map();
  const modelName = (name) => String(name || "").replace(/-P\d+$/i, "");
  const byModel = new Map();
  baseModels.forEach((m) => {
    const mdl = modelName(m.name);
    const key = m.key || mdl;
    entries.set(key, {
      key,
      name: m.name || key,
      owned: false,
      ownedCount: 0,
      star: 0,
      role: m.role || "???",
      rangeClass: m.rangeClass || "???",
      attribute: m.attribute || "???",
      mechClass: m.mechClass || "???",
      coreSkill: m.coreSkill || "???",
      atk: m.atk || 0,
      def: m.def || 0,
      hp: m.hp || 0,
      speed: m.speed || 0,
    });
    if (!byModel.has(mdl)) byModel.set(mdl, key);
  });
  (state.mechs || [])
    .filter((m) => m && m.unlocked)
    .forEach((m) => {
      const mdl = modelName(m.name);
      const key = byModel.get(mdl) || m.codexKey || mdl;
      if (!entries.has(key)) {
        entries.set(key, {
          key,
          name: m.name || key,
          owned: true,
          ownedCount: 1,
          star: getStarValue(m.star),
          role: m.role || "???",
          rangeClass: m.rangeClass || "???",
          attribute: m.attribute || "???",
          mechClass: m.mechClass || "???",
          coreSkill: m.coreSkill || m.equippedCore?.name || "???",
          atk: m.atk || 0,
          def: m.def || 0,
          hp: m.hp || 0,
          speed: m.speed || 0,
        });
        return;
      }
      const row = entries.get(key);
      row.owned = true;
      row.ownedCount += 1;
      row.star = Math.max(getStarValue(row.star), getStarValue(m.star));
      if ((m.atk || 0) + (m.def || 0) + (m.hp || 0) > (row.atk || 0) + (row.def || 0) + (row.hp || 0)) {
        row.role = m.role || row.role;
        row.rangeClass = m.rangeClass || row.rangeClass;
        row.attribute = m.attribute || row.attribute;
        row.mechClass = m.mechClass || row.mechClass;
        row.coreSkill = m.coreSkill || m.equippedCore?.name || row.coreSkill;
        row.atk = m.atk || row.atk;
        row.def = m.def || row.def;
        row.hp = m.hp || row.hp;
        row.speed = m.speed || row.speed;
      }
    });

  const codexUnlockSet = new Set(Array.isArray(state.codexMechUnlockKeys) ? state.codexMechUnlockKeys : []);
  codexUnlockSet.forEach((k) => {
    const row = entries.get(k);
    if (!row) return;
    row.owned = true;
    row.ownedCount = Math.max(1, Number(row.ownedCount || 0));
  });

  return [...entries.values()].sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

function consumeFactoryCost(baseCredit, baseTerra = 0) {
  const c = calcFactoryCost(baseCredit, baseTerra);
  if (!spendCredits(c.credit)) return { ok: false, reason: "크레딧 부족" };
  if (!spendResource("terra_core", c.terra)) {
    if (!state.settings.infinite) state.credits += c.credit;
    return { ok: false, reason: "테라코어 부족" };
  }
  return { ok: true, ...c };
}

function produceFactoryHero(count = 1) {
  let made = 0;
  for (let i = 0; i < count; i += 1) {
    const pay = consumeFactoryCost(420, 56);
    if (!pay.ok) break;
    let offer = null;
    for (let k = 0; k < 8; k += 1) {
      const p = normalizeRecruitOffer(rollRecruitOffer("market"), "market");
      if (p.unitType === "hero") {
        offer = p;
        break;
      }
    }
    if (!offer) offer = normalizeRecruitOffer(rollRecruitOffer("market"), "market");
    const unit = {
      id: `factory-hero-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sourceId: `factory-hero-src-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: offer.name,
      unitType: "hero",
      rank: offer.rank,
      contract: offer.contract,
      atk: offer.atk,
      def: offer.def,
      hp: offer.hp,
      speed: offer.speed,
      ability: offer.ability,
      roleClass: offer.roleClass,
      rangeClass: offer.rangeClass,
      fixedMeleeType: offer.fixedMeleeType,
      fixedFirearmType: offer.fixedFirearmType,
      codexKey: offer.codexKey,
      attribute: offer.attribute,
      team: offer.team,
      teamEffect: TEAM_EFFECTS[offer.team] || "없음",
      classType: offer.classType,
      color: offer.color,
      weaponType: offer.weaponType,
      abilityIcon: offer.abilityIcon,
      level: 1,
      star: 0,
      deployed: false,
      equippedMelee: null,
      equippedFirearm: null,
      equippedDefense: null,
      equippedGears: [],
      canUseDefense: typeof offer.canUseDefense === "boolean" ? offer.canUseDefense : ["디펜서", "어썰트", "버서커", "스폐셜"].includes(offer.roleClass || offer.classType),
    };
    state.heroes.push(unit);
    made += 1;
  }
  return made;
}

function produceFactoryInventory(kind = "weapon", count = 1) {
  const catalog = kind === "weapon" ? createWeaponCatalog() : createGearCatalog();
  let made = 0;
  for (let i = 0; i < count; i += 1) {
    const pay = kind === "weapon" ? consumeFactoryCost(180, 24) : consumeFactoryCost(150, 20);
    if (!pay.ok) break;
    const item = pickRandom(catalog);
    if (!item) continue;
    state.inventory.push({ ...item, id: `factory-${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
    made += 1;
  }
  return made;
}

function produceFactoryShip() {
  const locked = (state.hangarShips || []).find((s) => !s.unlocked);
  if (locked) {
    const pay = consumeFactoryCost(980 + state.factoryLevel * 140, 180);
    if (!pay.ok) return { ok: false, reason: pay.reason };
    locked.unlocked = true;
    return { ok: true, name: locked.name, unlocked: true, upgraded: false };
  }
  const up = upgradeActiveShip();
  if (!up.ok) return { ok: false, reason: up.reason };
  return { ok: true, name: up.name, unlocked: false, upgraded: true, lv: up.lv, cap: up.cap };
}

function produceFactoryMech(count = 1) {
  let made = 0;
  const src = createStarterMechs();
  for (let i = 0; i < count; i += 1) {
    const pay = consumeFactoryCost(920, 130);
    if (!pay.ok) break;
    const base = pickRandom(src);
    if (!base) continue;
    const mech = JSON.parse(JSON.stringify(base));
    mech.id = `factory-mech-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    mech.name = `${base.name}-P${randInt(11, 99)}`;
    mech.unlocked = true;
    mech.level = 1;
    mech.star = 0;
    mech.mechClass = base.mechClass || ROLE_ORDER[randInt(0, ROLE_ORDER.length - 1)];
    mech.codexKey = `${mech.role || "표준"}|${mech.rangeClass || "중거리"}|${getAttributeBase(mech.attribute || "물리")}|${mech.mechClass}`;
    mech.currentHp = mech.hp;
    mech.pilotId = null;
    state.mechs.push(mech);
    made += 1;
  }
  return made;
}

function produceFactoryMechItem(kind = "weapon", count = 1) {
  const catalog = kind === "weapon" ? createMechWeaponCatalog() : createMechModuleCatalog().filter((x) => x.slotType === "module");
  let made = 0;
  for (let i = 0; i < count; i += 1) {
    const pay = kind === "weapon" ? consumeFactoryCost(260, 34) : consumeFactoryCost(300, 42);
    if (!pay.ok) break;
    const it = pickRandom(catalog);
    if (!it) continue;
    state.mechInventory.push({ ...it, id: `factory-mech-${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
    made += 1;
  }
  normalizeMechInventory();
  return made;
}

function startReformMission(villain, tier = "basic") {
  if (!villain || villain.reformMission) return;
  ensureVillainReformGauge(villain);
  const table = {
    // 요청 반영: 기본(즉시), 전술(30초), 집중(1분)
    basic: { durationSec: 0, success: 0.86, credit: [22, 58], res: [14, 34], label: "기본 교화" },
    tactical: { durationSec: 30, success: 0.64, credit: [52, 130], res: [28, 88], label: "전술 교화" },
    intensive: { durationSec: 60, success: 0.46, credit: [120, 300], res: [62, 210], label: "집중 교화" },
  };
  const cfg = table[tier] || table.basic;
  const durationMs = Math.max(0, Math.round(cfg.durationSec * 1000));
  const now = Date.now();
  villain.reformMission = {
    tier,
    label: cfg.label,
    successChance: cfg.success,
    creditReward: randInt(cfg.credit[0], cfg.credit[1]),
    resourceReward: randInt(cfg.res[0], cfg.res[1]),
    startedAt: now,
    endsAt: now + durationMs,
  };
  if (tier === "basic") {
    resolveReformMission(villain);
  }
}

function convertVillainToMerc(villain) {
  if (!villain) return false;
  const row = villain.mercCodexKey
    ? getUnitCodexCatalog().find((x) => x.key === villain.mercCodexKey && x.unitType === "merc")
    : pickMercCodexForVillain(villain.planetId || "", villain.tier || "normal", villain.realName || villain.id || "");
  if (!row) return false;
  const tier = villain.tier || "normal";
  const scale = tier === "finalboss" ? 1.85 : tier === "midboss" ? 1.55 : tier === "named" ? 1.28 : 1.08;
  const bonus = Math.max(0, Math.round((villain.value || 0) * 0.02));
  const rank = tier === "finalboss" ? "교화-군주" : tier === "midboss" ? "교화-지휘관" : tier === "named" ? "교화-간부" : "교화";
  const starBase = tier === "finalboss" ? 4 : tier === "midboss" ? 3 : tier === "named" ? 2 : 1;
  const levelBase = tier === "finalboss" ? 42 : tier === "midboss" ? 30 : tier === "named" ? 20 : 12;
  const sourceId = `rehab-merc-${row.key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const nextAtk = Math.max(12, Math.round((row.atk || 18) * scale) + Math.round(bonus * 0.16));
  const nextDef = Math.max(6, Math.round((row.def || 10) * scale) + Math.round(bonus * 0.12));
  const nextHp = Math.max(120, Math.round((row.hp || 150) * scale) + Math.round(bonus * 1.8));
  const nextSpeed = Math.max(12, Math.round((row.speed || 15) * (tier === "finalboss" ? 1.15 : 1.08)));
  const nextAbility = `${rank} 프로토콜 / ${villain.archetype || row.roleClass || "전투"}`;
  const payload = {
    id: `rehab-merc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sourceId,
    name: stripVillainFamilyPrefix(villain.realName || row.name || "교화 용병"),
    unitType: "merc",
    rank,
    contract: Math.max(350, Math.round((villain.value || 260) * 0.65)),
    atk: nextAtk,
    def: nextDef,
    hp: nextHp,
    speed: nextSpeed,
    ability: nextAbility,
    roleClass: row.roleClass || "오펜서",
    rangeClass: row.rangeClass || "중거리",
    fixedMeleeType: row.fixedMeleeType || "소드",
    fixedFirearmType: row.fixedFirearmType || "AR",
    canUseDefense: !!row.canUseDefense,
    codexKey: row.key,
    attribute: row.attribute || "물리",
    team: row.team || "오리지널",
    teamEffect: TEAM_EFFECTS[row.team] || "없음",
    classType: row.roleClass || "용병",
    color: getAttributeColor(row.attribute || "물리"),
    weaponType: row.fixedFirearmType || "AR",
    abilityIcon: tier === "finalboss" ? "rage" : tier === "midboss" ? "guard" : "scope",
    level: levelBase,
    star: starBase,
    randomLoadout: MERC_LOADOUT_POOL[randInt(0, MERC_LOADOUT_POOL.length - 1)],
    deployed: false,
    equippedMelee: null,
    equippedFirearm: null,
    equippedDefense: null,
    equippedGears: [],
  };
  state.mercs.push(payload);
  if (!Array.isArray(state.codexUnitUnlockKeys)) state.codexUnitUnlockKeys = [];
  if (!state.codexUnitUnlockKeys.includes(row.key)) state.codexUnitUnlockKeys.push(row.key);
  return true;
}

function resolveReformMission(villain) {
  if (!villain?.reformMission) return false;
  if (Date.now() < villain.reformMission.endsAt) return false;
  ensureVillainReformGauge(villain);
  const m = villain.reformMission;
  const success = Math.random() < m.successChance;
  const tierMeta = getVillainReformTierMeta(villain.tier);
  villain.reformMission = null;
  if (success) {
    let gain = 1;
    let jackpot = false;
    if (m.tier === "basic") {
      gain = Math.random() < 0.1 ? 2 : 1;
    } else if (m.tier === "tactical") {
      const r = Math.random();
      gain = r < 0.2 ? 3 : r < 0.65 ? 2 : 1;
    } else if (m.tier === "intensive") {
      if (Math.random() < 0.14) {
        jackpot = true;
        villain.reformLevel = 5;
      } else {
        const r = Math.random();
        gain = r < 0.28 ? 4 : r < 0.68 ? 3 : 2;
      }
    }
    let delta = 0;
    if (!jackpot) {
      delta = Math.max(8, Math.round(gain * 100 * tierMeta.gainMul));
      applyVillainReformDelta(villain, delta);
    } else {
      villain.reformScore = 500;
      ensureVillainReformGauge(villain);
    }
    if (!state.settings.infinite) {
      addCredits(m.creditReward);
      addResource("terra_core", m.resourceReward);
    }
    if (jackpot) state.prisonLog.unshift(`${villain.realName}: ${m.label} 대성공! 즉시 교화 5레벨 달성`);
    else state.prisonLog.unshift(`${villain.realName}: ${m.label} 성공 (+${delta}pt, 교화 ${villain.reformLevel})`);
  } else {
    let loss = 1;
    if (m.tier === "basic") {
      loss = Math.random() < 0.72 ? 0 : 1;
    } else if (m.tier === "tactical") {
      loss = Math.random() < 0.16 ? 2 : 1;
    } else if (m.tier === "intensive") {
      const r = Math.random();
      loss = r < 0.45 ? 2 : r < 0.9 ? 1 : 3;
    }
    const delta = Math.max(8, Math.round(loss * 100 * tierMeta.lossMul));
    applyVillainReformDelta(villain, -delta);
    state.prisonLog.unshift(`${villain.realName}: ${m.label} 실패 (-${delta}pt, 교화 ${villain.reformLevel})`);
  }
  if (villain.reformLevel >= 5) {
    const ok = convertVillainToMerc(villain);
    villain.converted = true;
    if (ok) state.prisonLog.unshift(`${villain.realName}: 교화 완료, 용병 전력으로 편입`);
  }
  if (villain.reformLevel <= -5) {
    villain.escapeCount = (villain.escapeCount || 0) + 1;
    state.prisonLog.unshift(`${villain.realName}: 탈옥 발생 (누적 ${villain.escapeCount}회)`);
  }
  state.prisonLog = state.prisonLog.slice(0, 24);
  return true;
}

function transferVillainById(id) {
  const idx = state.capturedVillains.findIndex((v) => v.id === id);
  if (idx < 0) return;
  const villain = state.capturedVillains[idx];
  const creditGain = Math.max(80, Math.round((villain.value || 200) * 0.92));
  const resourceGain = Math.max(25, Math.round((villain.value || 200) * 0.46));
  const giveCredit = Math.random() < 0.5;
  if (!state.settings.infinite) {
    if (giveCredit) addCredits(creditGain);
    else addResource("terra_core", resourceGain);
  }
  state.prisonLog.unshift(`${villain.realName}: 인계 완료 (${giveCredit ? `크레딧 +${creditGain}` : `자원 +${resourceGain}`})`);
  state.prisonLog = state.prisonLog.slice(0, 24);
  state.capturedVillains.splice(idx, 1);
}

function isMercenaryBandVillain(villain) {
  if (!villain) return false;
  const tier = String(villain.tier || "").toLowerCase();
  const title = String(villain.title || "");
  const faction = String(villain.faction || "");
  const archetype = String(villain.archetype || "");
  if (tier === "named") return true;
  return /용병단|mercenary|raider|band/i.test(`${title} ${faction} ${archetype}`);
}

function canBulkTransferVillain(villain) {
  if (!villain) return false;
  const tier = String(villain.tier || "").toLowerCase();
  if (tier === "finalboss" || tier === "midboss") return false;
  if (isMercenaryBandVillain(villain)) return false;
  return true;
}

function transferBulkVillains() {
  const ids = (state.capturedVillains || [])
    .filter((v) => canBulkTransferVillain(v))
    .map((v) => v.id)
    .filter(Boolean);
  if (!ids.length) return 0;
  ids.forEach((id) => transferVillainById(id));
  return ids.length;
}

function isNamedOfficerVillain(villain) {
  if (!villain) return false;
  const tier = String(villain.tier || "").toLowerCase();
  if (tier === "named") return true;
  return /네임드\s*간부|named/i.test(`${villain.title || ""} ${villain.name || ""}`);
}

function transferNamedOfficerVillains() {
  const ids = (state.capturedVillains || [])
    .filter((v) => isNamedOfficerVillain(v))
    .map((v) => v.id)
    .filter(Boolean);
  if (!ids.length) return 0;
  ids.forEach((id) => transferVillainById(id));
  return ids.length;
}

function formatDuration(ms) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function makeQuestObjective(stars) {
  const kind = pickRandom(QUEST_OBJECTIVE_POOL) || "capture_total";
  if (kind === "capture_total") {
    const target = randInt(2, Math.min(8, 3 + Math.floor(stars / 2)));
    return {
      objectiveType: "capture_total",
      targetTier: null,
      targetNames: [],
      matchedNames: [],
      target,
      progress: 0,
      objectiveText: `빌런 ${target}명 체포`,
    };
  }
  if (kind === "capture_tier") {
    const targetTier = stars >= 8 ? pickRandom(["midboss", "finalboss"]) : stars >= 5 ? pickRandom(["named", "midboss"]) : "named";
    const target = targetTier === "finalboss" ? 1 : targetTier === "midboss" ? randInt(1, 2) : randInt(2, 4);
    const title = targetTier === "finalboss" ? "최종 보스" : targetTier === "midboss" ? "중간 보스" : "네임드 간부";
    return {
      objectiveType: "capture_tier",
      targetTier,
      targetNames: [],
      matchedNames: [],
      target,
      progress: 0,
      objectiveText: `${title} ${target}명 체포`,
    };
  }
  if (kind === "defeat_total") {
    const target = randInt(12 + stars * 2, 24 + stars * 3);
    return {
      objectiveType: "defeat_total",
      targetTier: null,
      targetNames: [],
      matchedNames: [],
      target,
      progress: 0,
      objectiveText: `적 ${target}기 처치`,
    };
  }
  if (kind === "restore_region") {
    const target = stars >= 8 ? 2 : 1;
    return {
      objectiveType: "restore_region",
      targetTier: null,
      targetNames: [],
      matchedNames: [],
      target,
      progress: 0,
      objectiveText: `지역 ${target}곳 수복(클리어)`,
    };
  }
  const pool = stars >= 7 ? [...MID_BOSS_NAME_POOL, ...FINAL_BOSS_NAME_POOL] : [...VILLAIN_NAMED_POOL, ...MID_BOSS_NAME_POOL];
  const uniquePool = [...new Set(pool)].sort(() => Math.random() - 0.5);
  const want = stars >= 9 ? 3 : 2;
  const targetNames = uniquePool.slice(0, want);
  return {
    objectiveType: "capture_targets",
    targetTier: null,
    targetNames,
    matchedNames: [],
    target: targetNames.length,
    progress: 0,
    objectiveText: `지정 빌런 체포 (${targetNames.join(", ")})`,
  };
}

function questProgressValue(q) {
  if (!q) return 0;
  if (q.objectiveType === "capture_targets") return Array.isArray(q.matchedNames) ? q.matchedNames.length : 0;
  return Number.isFinite(q.progress) ? q.progress : 0;
}

function isQuestCompletable(q) {
  if (!q) return false;
  const target = Number.isFinite(q.target) ? q.target : 1;
  return questProgressValue(q) >= target;
}

function questProgressText(q) {
  const target = Number.isFinite(q.target) ? q.target : 1;
  if (q.objectiveType === "capture_targets") {
    const matchedSet = new Set(Array.isArray(q.matchedNames) ? q.matchedNames : []);
    const rows = (q.targetNames || []).map((n) => (matchedSet.has(n) ? `완료:${n}` : n)).join(", ");
    return `목표 ${questProgressValue(q)}/${target} | ${rows}`;
  }
  return `목표 ${questProgressValue(q)}/${target}`;
}

function normalizeQuest(q) {
  if (!q || typeof q !== "object") return null;
  if (q.objectiveType) {
    q.target = Number.isFinite(q.target) ? q.target : 1;
    q.progress = Number.isFinite(q.progress) ? q.progress : 0;
    if (!Array.isArray(q.targetNames)) q.targetNames = [];
    if (!Array.isArray(q.matchedNames)) q.matchedNames = [];
    if (!q.objectiveText) q.objectiveText = "작전 목표 달성";
    return q;
  }
  const stars = Number.isFinite(q.stars) ? q.stars : randInt(1, 10);
  const objective = makeQuestObjective(stars);
  return {
    id: q.id || `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: q.title || `작전: ${QUEST_TITLE_POOL[randInt(0, QUEST_TITLE_POOL.length - 1)]}`,
    stars,
    rewardCredit: Number.isFinite(q.rewardCredit) ? q.rewardCredit : 120 + stars * 90,
    rewardResource: Number.isFinite(q.rewardResource) ? q.rewardResource : 60 + stars * 35,
    ...objective,
  };
}

function applyQuestProgressFromMission(report) {
  if (!report) return;
  const captured = Array.isArray(report.capturedVillains) ? report.capturedVillains : [];
  const capturedByTier = { normal: 0, named: 0, midboss: 0, finalboss: 0 };
  const capturedNames = new Set();
  captured.forEach((v) => {
    const tier = v?.tier || "normal";
    if (Object.prototype.hasOwnProperty.call(capturedByTier, tier)) capturedByTier[tier] += 1;
    if (v?.realName) capturedNames.add(v.realName);
  });
  state.quests.forEach((q) => {
    const target = Number.isFinite(q.target) ? q.target : 1;
    if (q.objectiveType === "capture_total") {
      q.progress = Math.min(target, questProgressValue(q) + captured.length);
      return;
    }
    if (q.objectiveType === "capture_tier") {
      q.progress = Math.min(target, questProgressValue(q) + (capturedByTier[q.targetTier] || 0));
      return;
    }
    if (q.objectiveType === "defeat_total") {
      q.progress = Math.min(target, questProgressValue(q) + (report.killedEnemies || 0));
      return;
    }
    if (q.objectiveType === "restore_region") {
      q.progress = Math.min(target, questProgressValue(q) + (report.success ? 1 : 0));
      return;
    }
    if (q.objectiveType === "capture_targets") {
      if (!Array.isArray(q.matchedNames)) q.matchedNames = [];
      (q.targetNames || []).forEach((name) => {
        if (capturedNames.has(name) && !q.matchedNames.includes(name)) q.matchedNames.push(name);
      });
      q.progress = Math.min(target, q.matchedNames.length);
    }
  });
}

function createNormalQuest(counter, fixedStars = null) {
  const stars = Number.isFinite(fixedStars) ? fixedStars : randInt(1, 10);
  const title = `작전: ${QUEST_TITLE_POOL[randInt(0, QUEST_TITLE_POOL.length - 1)]}`;
  const objective = makeQuestObjective(stars);
  return {
    id: `q-${counter}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    stars,
    rewardCredit: 120 + stars * 90,
    rewardResource: 60 + stars * 35,
    ...objective,
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

function makeInitialState() {
  const initialRoster = createInitialRoster();
  const starterInventory = createStarterInventory();
  const starterMechInventory = createMechStarterInventory();
  return {
    credits: 1200,
    lastSavedAt: 0,
    resources: 450,
    resourceStock: {
      terra_core: 450,
    },
    resourceVersion: 1,
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
        name: "네오 테라",
        color: "#4f8ef7",
        x: 180,
        y: 200,
        traits: "도시형 폐허, 높은 재화 회수율",
        enemies: "드론, 갱단, 경비 AI",
        rewards: "테라코어, 범용 부품",
        regions: [
          { id: "p1-r1", name: "코어 지구", difficulty: 1, restored: false },
          { id: "p1-r2", name: "상층 구역", difficulty: 2, restored: false },
          { id: "p1-r3", name: "공업 지대", difficulty: 3, restored: false },
        ],
      },
      {
        id: "p2",
        name: "바실 사막",
        color: "#da9f4a",
        x: 560,
        y: 300,
        traits: "모래 폭풍, 탄약 소모 증가",
        enemies: "사막 약탈단, 중장갑 야수",
        rewards: "볼케이늄, 소이 강화 재료",
        regions: [
          { id: "p2-r1", name: "붉은 협곡", difficulty: 2, restored: false },
          { id: "p2-r2", name: "유적 벙커", difficulty: 3, restored: false },
          { id: "p2-r3", name: "석영 평원", difficulty: 4, restored: false },
        ],
      },
      {
        id: "p3",
        name: "아이스 프론트",
        color: "#74d3ff",
        x: 1040,
        y: 520,
        traits: "저온 지대, 이동 속도 저하",
        enemies: "빙결 생체, 실험체",
        rewards: "크라이오나이트, 빙결 강화 재료",
        regions: [
          { id: "p3-r1", name: "빙하 기지", difficulty: 3, restored: false },
          { id: "p3-r2", name: "빙결 동굴", difficulty: 4, restored: false },
          { id: "p3-r3", name: "극지 코어", difficulty: 5, restored: false },
        ],
      },
      {
        id: "p4",
        name: "이클립스 정거장",
        color: "#b57bff",
        x: 1360,
        y: 180,
        traits: "우주 정거장, 엘리트 밀집",
        enemies: "용병단, 실드 병기",
        rewards: "보이드 릴레이, 고급 코어 재료",
        regions: [
          { id: "p4-r1", name: "외곽 링", difficulty: 4, restored: false },
          { id: "p4-r2", name: "연구 구획", difficulty: 5, restored: false },
          { id: "p4-r3", name: "중앙 반응로", difficulty: 6, restored: false },
        ],
      },
    ],
    selectedPlanetId: null,
    selectedRegionId: null,
    baseTab: "hq",
    hqView: "quests",
    hqCodexTab: "units",
    hqCodexPageUnits: 1,
    hqCodexPageMechs: 1,
    hqSelectedHeroId: initialRoster.heroes[0]?.id || null,
    hqGearFilter: "all",
    hqSelectedItemId: null,
    selectedItemDetailId: null,
    selectedUnitDetailId: null,
    hqReserveFilter: { roleClass: "all", attribute: "all", rangeClass: "all" },
    autoDeployMode: "planet",
    hqReservePage: 1,
    hangarMechPage: 1,
    rosterVersion: 5,
    questCounter: 1,
    quests: [],
    emergencyQuest: null,
    factoryLevel: 1,
    powerPlantLevel: 1,
    plantProduction: {
      lastTick: Date.now(),
      credit: 0,
      power: 0,
      resources: Object.keys(RESOURCE_DEFS).reduce((acc, id) => {
        acc[id] = 0;
        return acc;
      }, {}),
    },
    hangarShips: [
      { id: "ship-1", name: "HF-셔틀", baseCapacity: 12, capacity: 12, unlocked: true, upgradeLv: 0, buffAtk: 0, buffDef: 0, buffHp: 0, buffSpeed: 0 },
      { id: "ship-2", name: "HF-프리깃", baseCapacity: 18, capacity: 18, unlocked: false, upgradeLv: 0, buffAtk: 0, buffDef: 0, buffHp: 0, buffSpeed: 0 },
      { id: "ship-3", name: "HF-캐리어", baseCapacity: 24, capacity: 24, unlocked: false, upgradeLv: 0, buffAtk: 0, buffDef: 0, buffHp: 0, buffSpeed: 0 },
    ],
    activeShipId: "ship-1",
    hangarView: "ships",
    mechs: createStarterMechs(),
    activeMechId: "starter-mech-1",
    hangarSelectedMechId: "starter-mech-1",
    hangarMechInventoryFilter: "all",
    mechInventory: starterMechInventory,
    inventory: starterInventory,
    capturedVillains: [],
    prisonLog: [],
    marketOffers: [],
    blackMarketOffers: [],
    codexUnitUnlockKeys: [],
    codexMechUnlockKeys: [],
    fullCodexGranted: false,
    planetView: {
      tx: -120,
      ty: -160,
    },
  };
}

function applyProgressSnapshot(baseState, snapshot) {
  if (!baseState || !snapshot || !Array.isArray(baseState.planets) || !Array.isArray(snapshot.planets)) return baseState;
  const byPlanetId = {};
  snapshot.planets.forEach((p) => { if (p?.id) byPlanetId[p.id] = p; });
  baseState.planets.forEach((p) => {
    const snapPlanet = byPlanetId[p.id];
    if (!snapPlanet || !Array.isArray(snapPlanet.regions) || !Array.isArray(p.regions)) return;
    const byRegionId = {};
    const byRegionName = {};
    snapPlanet.regions.forEach((r) => {
      if (r?.id) byRegionId[r.id] = !!r.restored;
      if (r?.name) byRegionName[r.name] = !!r.restored;
    });
    p.regions.forEach((r) => {
      if (!r) return;
      if (r.id && typeof byRegionId[r.id] === "boolean") r.restored = byRegionId[r.id];
      else if (r.name && typeof byRegionName[r.name] === "boolean") r.restored = byRegionName[r.name];
    });
  });
  if (snapshot.planetRestoreClaims && typeof snapshot.planetRestoreClaims === "object") {
    baseState.planetRestoreClaims = snapshot.planetRestoreClaims;
  }
  return baseState;
}

function loadState() {
  const base = makeInitialState();
  let merged = base;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      merged = { ...base, ...parsed };
    }
  } catch (_) {
    merged = base;
  }
  try { loadLatestCheckpointCache(); } catch (_) {}
  try {
    const progressRaw = localStorage.getItem(PROGRESS_SAVE_KEY);
    if (progressRaw) {
      const progress = JSON.parse(progressRaw);
      const progressSavedAt = Number(progress?.savedAt || 0);
      const curSavedAt = Number(merged?.lastSavedAt || 0);
      if ((progressSavedAt > 0 && progressSavedAt >= curSavedAt) || (progressSavedAt <= 0 && curSavedAt <= 0)) {
        merged = applyProgressSnapshot(merged, progress);
      }
    }
  } catch (_) {}
  return merged;
}

function saveProgressSnapshot() {
  try {
    const snapshot = {
      savedAt: Number(state.lastSavedAt || Date.now()),
      planetRestoreClaims: state.planetRestoreClaims || {},
      planets: (state.planets || []).map((p) => ({
        id: p.id,
        name: p.name,
        regions: (p.regions || []).map((r) => ({
          id: r.id,
          name: r.name,
          restored: !!r.restored,
        })),
      })),
    };
    localStorage.setItem(PROGRESS_SAVE_KEY, JSON.stringify(snapshot));
  } catch (_) {}
}

function saveState() {
  state.lastSavedAt = Date.now();
  const snap = getStateSnapshotForManualSave();
  snap.lastSavedAt = Number(state.lastSavedAt || Date.now());
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    persistLatestCheckpointCache(
      { id: "runtime-latest", savedAt: Number(state.lastSavedAt || Date.now()), name: "자동 최신" },
      snap,
    );
  } catch (e) {
    console.warn("SAVE_FAILED", e);
  }
  void putAutoRuntimeState(state.lastSavedAt, snap);
  saveProgressSnapshot();
}

const state = loadState();
state.settings.difficulty = normalizeDifficultyValue(state.settings?.difficulty);
if (!state.planetRestoreClaims || typeof state.planetRestoreClaims !== "object") state.planetRestoreClaims = {};
ensureResourceState();
ensurePlantProductionState();
updatePlantAccumulation();

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
  actionToast: document.getElementById("actionToast"),
  uiLoadGauge: document.getElementById("uiLoadGauge"),
  uiLoadGaugeFill: document.getElementById("uiLoadGaugeFill"),
  uiLoadGaugeText: document.getElementById("uiLoadGaugeText"),
  unitDetailModal: document.getElementById("unitDetailModal"),
  unitDetailTitle: document.getElementById("unitDetailTitle"),
  unitDetailBody: document.getElementById("unitDetailBody"),
  itemDetailModal: document.getElementById("itemDetailModal"),
  itemDetailTitle: document.getElementById("itemDetailTitle"),
  itemDetailBody: document.getElementById("itemDetailBody"),
  itemUpgradeBtn: document.getElementById("itemUpgradeBtn"),
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
  bossWarningOverlay: document.getElementById("bossWarningOverlay"),
  bossWarningTitle: document.getElementById("bossWarningTitle"),
  bossWarningText: document.getElementById("bossWarningText"),
  bossPhaseOverlay: document.getElementById("bossPhaseOverlay"),
  bossPhaseText: document.getElementById("bossPhaseText"),
  canvas: document.getElementById("gameCanvas"),
  missionSkillCards: document.getElementById("missionSkillCards"),
  missionSkillPeek: document.getElementById("missionSkillPeek"),
  missionLoadingOverlay: document.getElementById("missionLoadingOverlay"),
  missionLoadingTitle: document.getElementById("missionLoadingTitle"),
  missionLoadingText: document.getElementById("missionLoadingText"),
  missionResultModal: document.getElementById("missionResultModal"),
  missionResultTitle: document.getElementById("missionResultTitle"),
  missionResultReason: document.getElementById("missionResultReason"),
  missionResultBody: document.getElementById("missionResultBody"),
  missionResultRestartBtn: document.getElementById("missionResultRestartBtn"),
  missionResultMainBtn: document.getElementById("missionResultMainBtn"),
  emergencyRepairBtn: document.getElementById("emergencyRepairBtn"),
  missionAutoBtn: document.getElementById("missionAutoBtn"),
  missionFollowSwitchBtn: document.getElementById("missionFollowSwitchBtn"),
  missionFollowLabel: document.getElementById("missionFollowLabel"),
  missionSpeedGroup: document.getElementById("missionSpeedGroup"),
  mainMenuHelp: document.getElementById("mainMenuHelp"),
  manualSaveNowBtn: document.getElementById("manualSaveNowBtn"),
  manualSaveList: document.getElementById("manualSaveList"),
};

const MAIN_MENU_DEFAULT_HELP = {
  title: "출격",
  desc: "행성과 지역을 선택해 임무에 들어갑니다. 전투에서 승리하면 지역 수복이 진행됩니다.",
};

let actionToastTimer = null;
let uiLoadGaugeTimer = null;
let uiLoadGaugeAnimFrame = null;
let uiLoadGaugeCurrent = 0;

function showActionToast(message, kind = "success") {
  if (!ui.actionToast) return;
  ui.actionToast.textContent = message || "";
  ui.actionToast.classList.remove("hidden");
  ui.actionToast.classList.toggle("success", kind === "success");
  if (actionToastTimer) clearTimeout(actionToastTimer);
  actionToastTimer = setTimeout(() => {
    if (!ui.actionToast) return;
    ui.actionToast.classList.add("hidden");
  }, 2600);
}

function setUiLoadGauge(percent = 0, text = "로딩 중...", durationMs = 260) {
  if (!ui.uiLoadGauge) return;
  const target = clamp(Number(percent) || 0, 0, 100);
  if (uiLoadGaugeTimer) {
    clearTimeout(uiLoadGaugeTimer);
    uiLoadGaugeTimer = null;
  }
  if (uiLoadGaugeAnimFrame) {
    cancelAnimationFrame(uiLoadGaugeAnimFrame);
    uiLoadGaugeAnimFrame = null;
  }
  ui.uiLoadGauge.classList.remove("hidden");
  if (ui.uiLoadGaugeText) ui.uiLoadGaugeText.textContent = text;
  if (!ui.uiLoadGaugeFill) return;
  const start = uiLoadGaugeCurrent;
  const delta = target - start;
  const dur = Math.max(0, Number(durationMs) || 0);
  if (dur === 0 || Math.abs(delta) < 0.2) {
    uiLoadGaugeCurrent = target;
    ui.uiLoadGaugeFill.style.width = `${uiLoadGaugeCurrent}%`;
    return;
  }
  const t0 = performance.now();
  const step = (t) => {
    const k = clamp((t - t0) / dur, 0, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - k, 3);
    uiLoadGaugeCurrent = start + delta * eased;
    if (ui.uiLoadGaugeFill) ui.uiLoadGaugeFill.style.width = `${uiLoadGaugeCurrent}%`;
    if (k < 1) uiLoadGaugeAnimFrame = requestAnimationFrame(step);
    else uiLoadGaugeAnimFrame = null;
  };
  uiLoadGaugeAnimFrame = requestAnimationFrame(step);
}

function hideUiLoadGauge(delayMs = 1200) {
  if (!ui.uiLoadGauge) return;
  if (uiLoadGaugeTimer) clearTimeout(uiLoadGaugeTimer);
  if (uiLoadGaugeAnimFrame) {
    cancelAnimationFrame(uiLoadGaugeAnimFrame);
    uiLoadGaugeAnimFrame = null;
  }
  uiLoadGaugeTimer = setTimeout(() => {
    if (!ui.uiLoadGauge) return;
    ui.uiLoadGauge.classList.add("hidden");
    uiLoadGaugeCurrent = 0;
    if (ui.uiLoadGaugeFill) ui.uiLoadGaugeFill.style.width = "0%";
  }, Math.max(0, delayMs));
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

const FACILITY_INFO = {
  hq: {
    name: "본부",
    desc: "퀘스트, 긴급 퀘스트 확인과 출격 인원/장비 편성을 담당합니다.",
    use: "클릭 시 인원 상태를 변경하고 출격 편성을 관리할 수 있습니다.",
  },
  factory: {
    name: "공장",
    desc: "무기/장비 생산과 연구를 진행하는 핵심 생산 시설입니다.",
    use: "클릭 시 공장 업그레이드와 연구 효율 확인이 가능합니다.",
  },
  plant: {
    name: "발전소",
    desc: "기지 운영에 필요한 자원과 전력을 생산합니다.",
    use: "클릭 시 발전소 생산물 수령이 가능합니다.",
  },
  market: {
    name: "마켓",
    desc: "신입 히어로/용병, 무기, 장비, 자원을 거래합니다.",
    use: "클릭 시 용병 계약과 계약 해지(80% 환급)를 진행할 수 있습니다.",
  },
  black: {
    name: "블랙 마켓",
    desc: "고성능 인력/전설급 장비를 비싼 가격에 거래합니다.",
    use: "클릭 시 프리미엄 구매와 체포 빌런 판매가 가능합니다.",
  },
  hangar: {
    name: "격납고",
    desc: "우주선과 메카를 정비하고 출격 대기 상태를 관리합니다.",
    use: "클릭 시 격납고 상태를 확인합니다.",
  },
  prison: {
    name: "수감소",
    desc: "체포한 빌런을 수감하고 교화 임무를 통해 전향시킵니다.",
    use: "클릭 시 수감 현황, 교화 진행, 탈옥 위험도를 관리할 수 있습니다.",
  },
};

function updateTopbar() {
  ensureResourceState();
  if (state.settings.infinite) {
    ui.creditText.textContent = "크레딧: INF";
    ui.resourceText.textContent = "자원: INF";
    ui.powerText.textContent = "전력: INF";
    return;
  }
  const creditPrefix = isCreditDelinquent() ? "(신용 불량) " : "";
  ui.creditText.textContent = `${creditPrefix}크레딧: ${Math.floor(state.credits)}`;
  const totalRes = getTotalResources();
  state.resources = totalRes;
  ui.resourceText.textContent = `자원: ${totalRes} (테라코어 ${getResourceAmount("terra_core")})`;
  ui.powerText.textContent = `전력: ${Math.floor(state.power)}`;
  showBankruptModalIfNeeded();
}

function isCreditDelinquent() {
  if (state?.settings?.infinite) return false;
  return Math.floor(Number(state?.credits || 0)) <= 0;
}

function isBankruptState() {
  if (state?.settings?.infinite) return false;
  return Number(state?.credits || 0) < -100000;
}

function getDebtDropRateMultiplier() {
  return isCreditDelinquent() ? 0.55 : 1;
}

function applyCreditGainPenalty(amount) {
  const v = Math.round(Number(amount) || 0);
  if (v <= 0) return v;
  if (!isCreditDelinquent()) return v;
  return Math.floor(v / 2);
}

function addCredits(amount, options = {}) {
  const raw = Math.round(Number(amount) || 0);
  if (!raw) return 0;
  if (state.settings?.infinite) return 0;
  const applied = (raw > 0 && !options.bypassPenalty) ? applyCreditGainPenalty(raw) : raw;
  state.credits += applied;
  return applied;
}

function getMissionFailureCreditPenalty() {
  const units = Math.max(0, Number(mission.deployedUnitCount || mission.units?.length || 0));
  const mechs = Math.max(0, Number(mission.deployedMechCount || 0));
  const p = getPlanetById(mission.planetId);
  const r = p && Array.isArray(p.regions) ? getRegionById(p, mission.regionId) : null;
  const diff = Math.max(1, Number(r?.difficulty || 1));
  return Math.max(120, Math.round((units * 92 + mechs * 168 + 80) * (0.9 + diff * 0.16)));
}

let bankruptModalShown = false;

function showBankruptModalIfNeeded() {
  if (!ui?.missionResultModal || !ui?.missionResultTitle || !ui?.missionResultReason || !ui?.missionResultBody) return;
  if (!isBankruptState()) {
    bankruptModalShown = false;
    return;
  }
  if (bankruptModalShown) return;
  bankruptModalShown = true;
  ui.missionResultTitle.textContent = "파산";
  ui.missionResultReason.textContent = "크레딧이 -100000 미만입니다. 최근 저장 시점으로 복구하세요.";
  ui.missionResultBody.innerHTML = `<div class="base-card"><strong>현재 크레딧:</strong> ${Math.floor(state.credits)}</div>`;
  if (ui.missionResultRestartBtn) ui.missionResultRestartBtn.classList.remove("hidden");
  ui.missionResultModal.classList.remove("hidden");
}

function showScreen(name) {
  Object.values(ui.screens).forEach((node) => node.classList.remove("active"));
  ui.screens[name].classList.add("active");
  if (document?.body) document.body.classList.toggle("mission-mode", name === "mission");
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

function isInfinitePlanet(planet) {
  return !!planet && planet.id === "p-infinite";
}

function sanitizePlanetRegions(planet) {
  if (!planet || !Array.isArray(planet.regions)) {
    planet.regions = [];
    return;
  }
  const seen = {};
  const cleaned = [];
  planet.regions.forEach((r, idx) => {
    if (!r || typeof r !== "object") return;
    const rid = String(r.id || `${planet.id}-r${idx + 1}`);
    if (seen[rid]) return;
    seen[rid] = 1;
    const infiniteRegion = !!r.infiniteMode;
    if (!isInfinitePlanet(planet) && infiniteRegion) return;
    cleaned.push({
      ...r,
      id: rid,
      name: String(r.name || `지역 ${cleaned.length + 1}`),
      difficulty: Math.max(1, Math.min(10, Number(r.difficulty || 1))),
      restored: !!r.restored,
      infiniteMode: infiniteRegion && isInfinitePlanet(planet),
    });
  });
  planet.regions = cleaned;
}

function enforceNeoTerraRegionSpec(planet) {
  if (!planet) return;
  const isNeoTerra = planet.id === "p1" || String(planet.name || "").trim() === "네오 테라";
  if (!isNeoTerra) return;
  const restoredById = {};
  const restoredByName = {};
  let legacyRestoredCount = 0;
  (planet.regions || []).forEach((r) => {
    if (!r || !r.id) return;
    restoredById[String(r.id)] = !!r.restored;
    if (r.name) restoredByName[String(r.name)] = !!r.restored;
    if (r.restored) legacyRestoredCount += 1;
  });
  planet.id = "p1";
  planet.name = "네오 테라";
  let mappedRestoredCount = 0;
  planet.regions = NEO_TERRA_REGION_TEMPLATE.map((tpl) => {
    const restored = !!(restoredById[tpl.id] || restoredByName[tpl.name]);
    if (restored) mappedRestoredCount += 1;
    return {
    id: tpl.id,
    name: tpl.name,
    difficulty: tpl.difficulty,
    restored,
    infiniteMode: false,
    };
  });
  // 과거 저장 구조에서 id가 바뀐 경우: 복구 가능한 범위만큼 앞에서부터 수복 처리.
  if (mappedRestoredCount === 0 && legacyRestoredCount > 0) {
    const recover = Math.min(NEO_TERRA_REGION_TEMPLATE.length, legacyRestoredCount);
    for (let i = 0; i < recover; i += 1) {
      planet.regions[i].restored = true;
    }
    mappedRestoredCount = recover;
  }
  // 무한 행성이 이미 해금된 저장이라면 네오 테라는 완전 수복 상태여야 정합성이 맞음.
  if (mappedRestoredCount === 0 && getPlanetById("p-infinite")) {
    planet.regions.forEach((r) => { r.restored = true; });
  }
}

function normalizePlanetState() {
  if (!Array.isArray(state.planets)) state.planets = [];
  const seenPlanet = {};
  const normalized = [];
  state.planets.forEach((p, idx) => {
    if (!p || typeof p !== "object") return;
    const pid = String(p.id || `p-auto-${idx + 1}`);
    if (seenPlanet[pid]) return;
    seenPlanet[pid] = 1;
    const planet = { ...p, id: pid };
    sanitizePlanetRegions(planet);
    enforceNeoTerraRegionSpec(planet);
    normalized.push(planet);
  });
  state.planets = normalized;
}

function getBasePlanets() {
  return (state.planets || []).filter((p) => p && !isInfinitePlanet(p));
}

function allBasePlanetsFullyRestored() {
  const bases = getBasePlanets();
  if (!bases.length) return false;
  return bases.every((p) => Array.isArray(p.regions) && p.regions.length > 0 && p.regions.every((r) => !!r.restored));
}

function buildInfinitePlanet() {
  const bases = getBasePlanets();
  const regions = bases.map((p, i) => ({
    id: `p-inf-r${i + 1}`,
    name: `${p.name} 무한 지역`,
    difficulty: 10,
    restored: false,
    infiniteMode: true,
    themePlanetId: p.id,
    themePlanetName: p.name,
  }));
  return {
    id: "p-infinite",
    name: "인피니티 프론티어",
    color: "#7a7aff",
    x: 1480,
    y: 760,
    traits: "끝없이 확장되는 무한 탐사지역",
    enemies: "해금된 행성들의 모든 빌런 세력",
    rewards: "대량 크레딧/테마 자원/아이템",
    regions,
    infiniteHub: true,
  };
}

function ensurePlanetRestoreRewardStateForPlanet(planetId) {
  if (!state.planetRestoreClaims || typeof state.planetRestoreClaims !== "object") state.planetRestoreClaims = {};
  if (!state.planetRestoreClaims[planetId] || typeof state.planetRestoreClaims[planetId] !== "object") {
    state.planetRestoreClaims[planetId] = {};
  }
  PLANET_RESTORE_MILESTONES.forEach((m) => {
    if (typeof state.planetRestoreClaims[planetId][m] !== "boolean") state.planetRestoreClaims[planetId][m] = false;
  });
}

function ensurePlanetProgressState() {
  normalizePlanetState();
  (state.planets || []).forEach((p) => {
    if (!p || isInfinitePlanet(p)) return;
    ensurePlanetRestoreRewardStateForPlanet(p.id);
    const claims = state.planetRestoreClaims?.[p.id] || {};
    const maxClaim = PLANET_RESTORE_MILESTONES.reduce((m, v) => (claims[v] ? Math.max(m, v) : m), 0);
    if (maxClaim > 0 && Array.isArray(p.regions) && p.regions.length) {
      const minRestored = Math.min(p.regions.length, Math.ceil((p.regions.length * maxClaim) / 100));
      const currentRestored = p.regions.filter((r) => !!r.restored).length;
      if (currentRestored < minRestored) {
        for (let i = 0; i < minRestored; i += 1) p.regions[i].restored = true;
      }
    }
  });
  if (allBasePlanetsFullyRestored()) {
    const existingInfinite = getPlanetById("p-infinite");
    const rebuilt = buildInfinitePlanet();
    if (existingInfinite) {
      existingInfinite.name = rebuilt.name;
      existingInfinite.color = rebuilt.color;
      existingInfinite.x = rebuilt.x;
      existingInfinite.y = rebuilt.y;
      existingInfinite.traits = rebuilt.traits;
      existingInfinite.enemies = rebuilt.enemies;
      existingInfinite.rewards = rebuilt.rewards;
      existingInfinite.infiniteHub = true;
      existingInfinite.regions = rebuilt.regions;
    } else {
      state.planets.push(rebuilt);
    }
    ensurePlanetRestoreRewardStateForPlanet("p-infinite");
    if (!existingInfinite) showActionToast("모든 행성 수복 완료: 인피니티 프론티어 해금", "success");
  }
}

function getPlanetRestoreRewardInfo(planet, milestone) {
  const rate = Math.max(0, Math.min(100, Math.round(getRestoreRate(planet) * 100)));
  const claimed = !!(state.planetRestoreClaims?.[planet.id]?.[milestone]);
  const claimable = !claimed && rate >= milestone;
  const resId = getPlanetResourceId(planet);
  const credit = 400 + milestone * 34;
  const resource = 80 + milestone * 7;
  return { rate, claimed, claimable, resId, credit, resource };
}

function claimPlanetRestoreReward(planetId, milestone) {
  const planet = getPlanetById(planetId);
  if (!planet || isInfinitePlanet(planet)) return;
  ensurePlanetRestoreRewardStateForPlanet(planetId);
  const info = getPlanetRestoreRewardInfo(planet, milestone);
  if (info.claimed) {
    showActionToast(`${planet.name} ${milestone}% 보상은 이미 수령했습니다.`);
    return;
  }
  if (!info.claimable) {
    showActionToast(`${planet.name} 수복률이 ${milestone}%에 도달하지 않았습니다.`);
    return;
  }
  if (!state.settings.infinite) {
    addCredits(info.credit);
    addResource(info.resId, info.resource);
  }
  state.planetRestoreClaims[planetId][milestone] = true;
  const resName = RESOURCE_DEFS[info.resId]?.name || "자원";
  showActionToast(`${planet.name} ${milestone}% 수복 보상 수령: 크레딧 ${info.credit}, ${resName} ${info.resource}`, "success");
  saveState();
  updateTopbar();
  renderSortie();
}

function setPlanetInfo(planet) {
  const rate = Math.round(getRestoreRate(planet) * 100);
  ui.planetInfoName.textContent = planet.name;
  ui.planetInfoTraits.textContent = `특징: ${planet.traits}`;
  ui.planetInfoEnemies.textContent = `적: ${planet.enemies}`;
  ui.planetInfoRewards.textContent = `보상: ${planet.rewards}`;
  ui.planetInfoRestore.textContent = isInfinitePlanet(planet) ? "수복률: 무한 탐사 행성" : `수복률: ${rate}%`;
}

function renderSortie() {
  ensurePlanetProgressState();
  const planet = getPlanetById(state.selectedPlanetId);
  if (planet && (!state.selectedRegionId || !planet.regions.some((r) => r.id === state.selectedRegionId))) {
    state.selectedRegionId = planet.regions[0]?.id || null;
  }
  const rateText = planet && !isInfinitePlanet(planet) ? ` / 수복률 ${Math.round(getRestoreRate(planet) * 100)}%` : "";
  ui.selectedPlanetText.textContent = `선택 행성: ${planet ? planet.name : "없음"}${rateText}`;
  ui.regionList.innerHTML = "";
  if (!planet) {
    ui.regionList.innerHTML = `<div class="base-card">행성을 먼저 선택하세요.</div>`;
    return;
  }
  if (!isInfinitePlanet(planet)) {
    ensurePlanetRestoreRewardStateForPlanet(planet.id);
    const rewardCard = document.createElement("div");
    rewardCard.className = "base-card restore-reward-panel";
    rewardCard.innerHTML = `
      <strong>${planet.name} 수복 보상</strong>
      <div class="restore-reward-row">
        ${PLANET_RESTORE_MILESTONES.map((m) => {
          const info = getPlanetRestoreRewardInfo(planet, m);
          const resName = RESOURCE_DEFS[info.resId]?.name || "자원";
          const label = info.claimed ? "수령 완료" : info.claimable ? "수령" : "미도달";
          return `<button data-claim-restore="${m}" ${info.claimable ? "" : "disabled"}>${m}% (${label})<small>크레딧 ${info.credit} / ${resName} ${info.resource}</small></button>`;
        }).join("")}
      </div>
    `;
    ui.regionList.appendChild(rewardCard);
  } else {
    const infCard = document.createElement("div");
    infCard.className = "base-card";
    infCard.innerHTML = `<strong>무한 탐사 규칙</strong><div>최종 보스 처치로 클리어되지 않으며, 철수 시 클리어 판정입니다.</div>`;
    ui.regionList.appendChild(infCard);
  }
  planet.regions.forEach((region) => {
    const selected = state.selectedRegionId === region.id ? "selected" : "";
    const restored = region.restored && !region.infiniteMode ? "restored" : "";
    const rate = Math.round(getRestoreRate(planet) * 100);
    const bonusText =
      region.infiniteMode
        ? `${region.themePlanetName || "테마"}의 빌런/보상이 무한 등장`
        : rate >= 100
        ? "행성 완전 수복: 적 대폭 약화, 시설 다수 등장"
        : rate > 0
          ? "부분 수복: 해당 지역 편의시설 일부 등장"
          : "편의시설 없음";
    const div = document.createElement("div");
    div.className = `region-item ${selected} ${restored}`;
    div.setAttribute("data-select-region", region.id);
    const dispatchBtn = region.restored && !region.infiniteMode
      ? `<button data-dispatch-region="${region.id}">파견</button>`
      : "";
    div.innerHTML = `
      <div>
        <strong>${region.name}</strong>
        <div>난이도: ${region.difficulty} / 상태: ${region.infiniteMode ? "무한 탐사" : (region.restored ? "수복 완료" : "미수복")}</div>
        <div>${bonusText}</div>
      </div>
      <div>
        <button data-select-region="${region.id}">선택</button>
        ${dispatchBtn}
      </div>
    `;
    ui.regionList.appendChild(div);
  });
}

function runRegionDispatch(regionId) {
  const planet = getPlanetById(state.selectedPlanetId);
  if (!planet) return;
  const region = getRegionById(planet, regionId);
  if (!region) return;
  if (!region.restored || region.infiniteMode) {
    showActionToast("수복된 일반 지역만 파견할 수 있습니다.");
    return;
  }
  const diffMeta = getDifficultyMeta();
  const baseCredit = 140 + region.difficulty * 95;
  const baseResource = 60 + region.difficulty * 45;
  const credit = Math.round(baseCredit * 0.42 * diffMeta.rewardScale);
  const resId = getPlanetResourceId(planet);
  const resource = Math.round(baseResource * 0.4 * diffMeta.rewardScale);
  const found = [];
  if (Math.random() < 0.28) {
    const pool = [...createWeaponCatalog().slice(0, 24), ...createGearCatalog().slice(0, 16)];
    const picked = pickRandom(pool);
    if (picked) found.push({ ...picked, id: `dispatch-loot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
  }
  if (!state.settings.infinite) {
    addCredits(credit);
    addResource(resId, resource);
  }
  found.forEach((it) => addItemToOwnedInventory(it));
  state.power += Math.round(6 + region.difficulty * 1.5);
  saveState();
  updateTopbar();
  const resName = RESOURCE_DEFS[resId]?.name || "자원";
  if (ui.missionResultTitle) ui.missionResultTitle.textContent = "파견 성공";
  if (ui.missionResultReason) ui.missionResultReason.textContent = `${planet.name} - ${region.name} 파견 보고`;
  if (ui.missionResultBody) {
    ui.missionResultBody.innerHTML = `
      <div class="base-card"><strong>작전 형태:</strong> 자동 파견</div>
      <div class="base-card"><strong>보상:</strong> 크레딧 ${credit} / ${resName} ${resource}</div>
      <div class="base-card"><strong>추가 획득:</strong> ${found.length ? found.map((x) => x.name).join(", ") : "없음"}</div>
      <div class="base-card"><strong>비고:</strong> 직접 출격 대비 보상 효율이 낮습니다.</div>
    `;
  }
  if (ui.missionResultModal) ui.missionResultModal.classList.remove("hidden");
}

function renderPlanetNodes() {
  ensurePlanetProgressState();
  ui.planetTrack.innerHTML = "";
  state.planets.forEach((planet) => {
    const node = document.createElement("button");
    node.className = "planet-node";
    node.style.left = `${planet.x}px`;
    node.style.top = `${planet.y}px`;
    node.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,.28), ${planet.color})`;
    const rate = isInfinitePlanet(planet) ? "∞" : `${Math.round(getRestoreRate(planet) * 100)}%`;
    node.innerHTML = `<span class="planet-node-name">${planet.name}</span><small class="planet-node-rate">${isInfinitePlanet(planet) ? "무한 탐사" : `수복 ${rate}`}</small>`;
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

  const edge = 24;
  mission.units.forEach((u) => {
    const px = sx(u.x);
    const py = sy(u.y);
    if (px >= edge && px <= ui.canvas.width - edge && py >= edge && py <= ui.canvas.height - edge) return;
    const cx = ui.canvas.width * 0.5;
    const cy = ui.canvas.height * 0.5;
    const dx = px - cx;
    const dy = py - cy;
    const ang = Math.atan2(dy, dx);
    const halfW = ui.canvas.width * 0.5 - edge;
    const halfH = ui.canvas.height * 0.5 - edge;
    const t = 1 / Math.max(Math.abs(dx) / halfW || 0.0001, Math.abs(dy) / halfH || 0.0001);
    const ax = cx + dx * t;
    const ay = cy + dy * t;
    const szArrow = 10;
    ctx.fillStyle = u.isMech && !u.mechBroken ? "#9dd6ff" : "#d6f2ff";
    ctx.strokeStyle = "#1b2c3d";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(ax + Math.cos(ang) * szArrow, ay + Math.sin(ang) * szArrow);
    ctx.lineTo(ax + Math.cos(ang + 2.45) * szArrow * 0.8, ay + Math.sin(ang + 2.45) * szArrow * 0.8);
    ctx.lineTo(ax + Math.cos(ang - 2.45) * szArrow * 0.8, ay + Math.sin(ang - 2.45) * szArrow * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#eef6ff";
    ctx.font = "10px Segoe UI";
    ctx.fillText(u.isMech && !u.mechBroken ? "MECH" : "UNIT", ax + 8, ay - 8);
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

function markUnitDamaged(unit) {
  if (!unit) return;
  unit.lastDamagedAt = mission.elapsed || 0;
}

function syncMissionMechOutcome(unit) {
  if (!unit?.isMech || !unit.mechId) return;
  if (!mission.mechOutcome) mission.mechOutcome = {};
  const rec = mission.mechOutcome[unit.mechId] || { destroyed: false, currentHp: 0 };
  const hpNow = Math.max(0, Math.round(unit.mechHp || 0));
  rec.currentHp = hpNow;
  // 매 프레임 현재 상태를 기준으로 파괴 여부를 재평가한다.
  // (한 번 true가 되면 영구 고정되는 문제 방지)
  rec.destroyed = !!(unit.mechBroken || unit.mechDestroyedThisMission || hpNow <= 0);
  mission.mechOutcome[unit.mechId] = rec;
}

function performMeleeAttack(p, target) {
  const type = normalizeMeleeTypeName(p.meleeType || "소드");
  p.attackingMeleeType = type;
  p.attackMotionUntil = mission.elapsed + (type === "데거" ? 0.18 : type === "해머" ? 0.34 : 0.28);
  p.lastMeleeAt = mission.elapsed;
  const range = p.meleeRangePx;
  const base = p.meleeDamage;
  const meleeFx = {
    데거: { life: 0.1, width: 2, scale: 0.42 },
    소드: { life: 0.15, width: 3, scale: 0.5 },
    클레이모어: { life: 0.2, width: 4, scale: 0.62 },
    블레이드: { life: 0.13, width: 3, scale: 0.48 },
    스피어: { life: 0.12, width: 2, scale: 0.56 },
    랜스: { life: 0.14, width: 3, scale: 0.62 },
    메이스: { life: 0.18, width: 4, scale: 0.58 },
    해머: { life: 0.22, width: 5, scale: 0.68 },
    휩: { life: 0.2, width: 3, scale: 0.78 },
    사이즈: { life: 0.2, width: 4, scale: 0.72 },
  }[type] || { life: 0.14, width: 3, scale: 0.5 };
  const mfx = p.meleeFxScale || 1;
  pushFx(
    "melee-swing",
    { x: p.x, y: p.y, r: Math.max(26, range * meleeFx.scale * mfx), color: p.attrColor || "#ffd48a", width: meleeFx.width * mfx, type },
    meleeFx.life * (0.95 + (mfx - 1) * 0.8),
  );

  if (["데거", "소드", "클레이모어", "블레이드", "메이스", "해머", "휩"].includes(type)) {
    const hitR = type === "휩" ? range * 1.1 : range * 0.9;
    mission.enemies.forEach((e) => {
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      if (d <= hitR) {
        dealDamageToEnemy(e, base, p);
        if (["메이스", "해머", "휩"].includes(type)) applyKnockback(e, p.x, p.y, type === "해머" ? 45 : 30);
      }
    });
    return;
  }

  if (type === "스피어" || type === "랜스") {
    if (target) {
      pushFx(
        "stab-line",
        { x1: p.x, y1: p.y, x2: target.x, y2: target.y, color: p.attrColor || "#ffdfb8", width: (type === "랜스" ? 4 : 3) * mfx },
        (type === "랜스" ? 0.16 : 0.12) * (0.95 + (mfx - 1) * 0.8),
      );
      dealDamageToEnemy(target, type === "랜스" ? Math.round(base * 1.12) : base, p);
      applyKnockback(target, p.x, p.y, type === "랜스" ? 36 : 14);
    }
    return;
  }

  if (type === "사이즈") {
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
  stopBossBgm();
  const planet = getPlanetById(state.selectedPlanetId);
  if (!planet) {
    alert("행성을 선택하세요.");
    return;
  }
  const region = getRegionById(planet, state.selectedRegionId);
  if (!region) {
    alert("지역을 선택하세요.");
    return;
  }

  const restoreRate = getRestoreRate(planet);
  const allRestored = restoreRate >= 1;
  let enemyCount = 3 + region.difficulty * 2;
  enemyCount = Math.round(enemyCount * getDifficultyMeta().enemyScale);
  enemyCount = Math.round(enemyCount * (1 - restoreRate * 0.4));
  if (allRestored) enemyCount = Math.round(enemyCount * 0.7);
  if (region.restored) enemyCount = Math.round(enemyCount * 0.75);
  enemyCount = Math.max(1, enemyCount);

  const enemyHp = Math.round((28 + region.difficulty * 10) * getDifficultyMeta().enemyScale);
  const deployed = getAllUnits().filter((u) => u.deployed);
  if (!deployed.length) {
    alert("(출격 인원이 없음)");
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
    meleeType: leaderMelee?.weaponType || "소드",
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
    critChance: 0.1 + (leaderMelee?.weaponType === "블레이드" ? 0.08 : 0),
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
  ui.missionInfo.textContent = `적 ${enemyCount}기 출현. 전멸시키면 지역을 수복합니다.`;
  showScreen("mission");
  mission.rafId = requestAnimationFrame(loopMission);
}

function loopMission(ts) {
  if (!mission.running) return;
  const baseDt = Math.min(0.033, (ts - mission.lastTime) / 1000);
  const dt = baseDt * clamp(mission.timeScale || 1, 1, 5);
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
      if (!isGodModeActive()) {
        let damage = Math.max(1, 8 - p.defense);
        let blocked = false;
        if (p.attackMotionUntil > mission.elapsed && ["랜스", "클레이모어"].includes(p.attackingMeleeType)) {
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
          name: "체포된 빌런",
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

  ui.missionHud.textContent = `HP ${Math.max(0, Math.floor(p.hp))}/${p.maxHp} | 남은 적 ${mission.enemies.length} | 근접 ${p.meleeType} / 총기 ${p.firearmType} | 방어쿨 ${p.defenseCdLeft.toFixed(1)}s`;

  if (p.hp <= 0) endMission(false, "히어로가 쓰러졌습니다.");
  if (mission.enemies.length === 0) endMission(true, "지역 수복 완료");
}

function drawMission() {
  const ctx = ui.canvas.getContext("2d");
  ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);

  const p = mission.player;
  const weaponMap = { rifle: "┤", carbine: "┤", shotgun: "╪", blade: "⚔" };
  ctx.fillStyle = p.color || "#4dd0e1";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Segoe UI";
  ctx.fillText(weaponMap[p.weaponType] || "┤", p.x + 14, p.y + 4);

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
      addCredits(Math.round(baseCredit * bonus));
      addResource(getPlanetResourceId(planet), Math.round(baseResource * bonus));
    }
    state.power += 20 + state.powerPlantLevel * 5;
    alert(`${reason}\n보상 획득 완료`);
  } else {
    alert(`임무 실패: ${reason}`);
  }
  trySpawnEmergencyQuest();
  updateEmergencyQuestStatus();
  saveState();
  updateTopbar();
  showScreen("sortie");
}

// Advanced sortie override: large map, camera drag, loading/landing sequence, skill cards, rich rewards.
Object.assign(mission, {
  phase: "idle",
  phaseTime: 0,
  worldW: 0,
  worldH: 0,
  theme: PLANET_THEME_CONFIG.p1,
  camera: { x: 0, y: 0 },
  zoom: 0.78,
  viewW: 900,
  viewH: 500,
  units: [],
  totalEnemyCount: 0,
  killedEnemies: 0,
  capturedVillains: [],
  salvagedMechs: [],
  foundItems: [],
  projectiles: [],
  terrainPatches: [],
  skillCards: [],
  skillDragId: null,
  skillHoverWorld: null,
  ship: null,
  navGrid: null,
  bossUiTimer: 0,
  bossPhaseTimer: 0,
  bossBgmKey: null,
  loadingDuration: 1.4,
  autoMode: false,
  timeScale: 1,
  autoThinkCd: 0,
  mechOutcome: {},
  followUnitId: null,
  fieldShops: [],
  freeLootNodes: [],
  alliedUnits: [],
  rareMines: [],
  extraResourceDrops: {},
  recruitedFromField: [],
  nearFieldShopId: null,
  infiniteMode: false,
  infiniteThemePlanetId: null,
  infiniteSeed: 0,
});

const missionInput = {
  draggingCamera: false,
  cameraMoved: false,
  dragStartX: 0,
  dragStartY: 0,
  baseCamX: 0,
  baseCamY: 0,
};

const MISSION_DEFAULT_ZOOM = 0.78;
const bossAudio = { ctx: null, gain: null, nodes: [], timer: null };

function stopBossBgm() {
  if (bossAudio.timer) {
    clearInterval(bossAudio.timer);
    bossAudio.timer = null;
  }
  bossAudio.nodes.forEach((n) => {
    try { n.stop(); } catch (_) {}
    try { n.disconnect(); } catch (_) {}
  });
  bossAudio.nodes = [];
}

function playBossBgm(pattern = "tyrant") {
  if (!state.settings.sound) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!bossAudio.ctx) bossAudio.ctx = new Ctx();
    if (bossAudio.ctx.state === "suspended") bossAudio.ctx.resume();
    if (!bossAudio.gain) {
      bossAudio.gain = bossAudio.ctx.createGain();
      bossAudio.gain.gain.value = 0.022;
      bossAudio.gain.connect(bossAudio.ctx.destination);
    }
    stopBossBgm();
    const chordByPattern = {
      tyrant: [48, 55, 60],
      sniper: [50, 57, 62],
      gravity: [45, 52, 57],
      mirage: [53, 60, 65],
      inferno: [47, 54, 59],
    };
    const notes = chordByPattern[pattern] || chordByPattern.tyrant;
    const masterFilter = bossAudio.ctx.createBiquadFilter();
    masterFilter.type = "lowpass";
    masterFilter.frequency.value = 820;
    masterFilter.Q.value = 0.7;
    masterFilter.connect(bossAudio.gain);
    const nodes = [masterFilter];
    const osc = notes.map((n, idx) => {
      const o = bossAudio.ctx.createOscillator();
      const g = bossAudio.ctx.createGain();
      o.type = "sine";
      o.frequency.value = 440 * 2 ** ((n - 69) / 12);
      g.gain.value = idx === 0 ? 0.18 : 0.08;
      o.connect(g);
      g.connect(masterFilter);
      o.start();
      nodes.push(o, g);
      return { o, g };
    });
    const lfo = bossAudio.ctx.createOscillator();
    const lfoGain = bossAudio.ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 46;
    lfo.connect(lfoGain);
    lfoGain.connect(masterFilter.frequency);
    lfo.start();
    nodes.push(lfo, lfoGain);
    bossAudio.nodes = nodes;
    bossAudio.timer = setInterval(() => {
      if (!bossAudio.ctx) return;
      osc.forEach((v, i) => {
        const det = (i === 0 ? -0.3 : i === 1 ? 0.2 : -0.15);
        const f = 440 * 2 ** ((notes[i] - 69) / 12) + det;
        v.o.frequency.setTargetAtTime(f, bossAudio.ctx.currentTime, 0.4);
      });
    }, 2200);
  } catch (_) {}
}

function setBossWarning(title, text, seconds = 2.8) {
  if (ui.bossWarningTitle) ui.bossWarningTitle.textContent = title || "BOSS ALERT";
  if (ui.bossWarningText) ui.bossWarningText.textContent = text || "";
  if (ui.bossWarningOverlay) ui.bossWarningOverlay.classList.remove("hidden");
  mission.bossUiTimer = Math.max(0.6, seconds);
}

function setBossPhaseText(text, seconds = 2.1) {
  if (ui.bossPhaseText) ui.bossPhaseText.textContent = text;
  if (ui.bossPhaseOverlay) ui.bossPhaseOverlay.classList.remove("hidden");
  mission.bossPhaseTimer = Math.max(0.5, seconds);
}

function resizeMissionCanvas() {
  const shell = ui.screens.mission?.querySelector(".mission-shell");
  const rect = shell ? shell.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
  const w = clamp(Math.floor(rect.width), 640, 3840);
  const h = clamp(Math.floor(rect.height), 360, 2160);
  const dpr = clamp(Number(window.devicePixelRatio || 1), 1, 2);
  mission.canvasCssW = w;
  mission.canvasCssH = h;
  mission.canvasDpr = dpr;
  ui.canvas.style.width = `${w}px`;
  ui.canvas.style.height = `${h}px`;
  ui.canvas.width = Math.floor(w * dpr);
  ui.canvas.height = Math.floor(h * dpr);
  const zr = getMissionZoomRange();
  mission.zoom = clamp(mission.zoom || 1, zr.min, zr.max);
  mission.viewW = w / mission.zoom;
  mission.viewH = h / mission.zoom;
  mission.camera = clampMissionCamera(mission.camera.x, mission.camera.y);
}

function missionWorldPos(clientX, clientY) {
  const rect = ui.canvas.getBoundingClientRect();
  const nx = clamp((clientX - rect.left) / Math.max(1, rect.width), 0, 1);
  const ny = clamp((clientY - rect.top) / Math.max(1, rect.height), 0, 1);
  return {
    x: mission.camera.x + nx * mission.viewW,
    y: mission.camera.y + ny * mission.viewH,
  };
}

function missionFx(kind, data = {}, life = 0.35) {
  mission.effects.push({ kind, ...data, life });
}

function spawnProjectile(source, target, cfg = {}) {
  if (!source || !target) return;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const d = Math.hypot(dx, dy) || 1;
  const speed = cfg.speed || 520;
  const life = cfg.life || 1.2;
  mission.projectiles.push({
    id: `prj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sourceId: source.id,
    targetId: target.id,
    x: source.x,
    y: source.y,
    vx: (dx / d) * speed,
    vy: (dy / d) * speed,
    life,
    lifeTotal: life,
    radius: cfg.radius || 4,
    color: cfg.color || "#8ecaff",
    dmg: Math.max(1, cfg.dmg || 8),
    fromEnemy: !!cfg.fromEnemy,
    explosive: !!cfg.explosive,
    homing: !!cfg.homing,
    arc: !!cfg.arc,
    arcHeight: cfg.arcHeight || 0,
    pierce: Math.max(0, cfg.pierce || 0),
    hitIds: {},
    turnRate: cfg.turnRate || 5.4,
  });
}

function missionClamp(x, y) {
  return { x: clamp(x, 30, mission.worldW - 30), y: clamp(y, 30, mission.worldH - 30) };
}

function getMissionStartSafeZone(worldW = mission.worldW, worldH = mission.worldH) {
  const shipX = 280;
  const shipTargetY = worldH - 240;
  return {
    x: clamp(shipX - 240, 0, Math.max(0, worldW - 1)),
    y: clamp(shipTargetY - 280, 0, Math.max(0, worldH - 1)),
    w: 560,
    h: 320,
  };
}

function pointInMissionStartSafeZone(x, y, worldW = mission.worldW, worldH = mission.worldH, pad = 0) {
  const z = getMissionStartSafeZone(worldW, worldH);
  return x >= z.x - pad && x <= z.x + z.w + pad && y >= z.y - pad && y <= z.y + z.h + pad;
}

function rectIntersectsMissionStartSafeZone(x, y, w, h, worldW = mission.worldW, worldH = mission.worldH, pad = 0) {
  const z = getMissionStartSafeZone(worldW, worldH);
  const ax1 = x - pad;
  const ay1 = y - pad;
  const ax2 = x + w + pad;
  const ay2 = y + h + pad;
  const bx1 = z.x;
  const by1 = z.y;
  const bx2 = z.x + z.w;
  const by2 = z.y + z.h;
  return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
}

function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function rectExpanded(o, pad = 16) {
  return { x: o.x - pad, y: o.y - pad, w: o.w + pad * 2, h: o.h + pad * 2 };
}

function segIntersects(a, b, c, d) {
  const ccw = (p1, p2, p3) => (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
  return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
}

function segmentHitsRect(ax, ay, bx, by, r) {
  const a = { x: ax, y: ay };
  const b = { x: bx, y: by };
  if (pointInRect(a.x, a.y, r) || pointInRect(b.x, b.y, r)) return true;
  const p1 = { x: r.x, y: r.y };
  const p2 = { x: r.x + r.w, y: r.y };
  const p3 = { x: r.x + r.w, y: r.y + r.h };
  const p4 = { x: r.x, y: r.y + r.h };
  return segIntersects(a, b, p1, p2) || segIntersects(a, b, p2, p3) || segIntersects(a, b, p3, p4) || segIntersects(a, b, p4, p1);
}

function firstBlockingObstacle(ax, ay, bx, by, pad = 18) {
  for (let i = 0; i < (mission.obstacles || []).length; i += 1) {
    const r = rectExpanded(mission.obstacles[i], pad);
    if (segmentHitsRect(ax, ay, bx, by, r)) return r;
  }
  return null;
}

function countBlockingObstacles(ax, ay, bx, by, pad = 18) {
  let c = 0;
  for (let i = 0; i < (mission.obstacles || []).length; i += 1) {
    const r = rectExpanded(mission.obstacles[i], pad);
    if (segmentHitsRect(ax, ay, bx, by, r)) c += 1;
  }
  return c;
}

function pushOutFromObstacles(pos, pad = 14) {
  let x = pos.x;
  let y = pos.y;
  (mission.obstacles || []).forEach((o) => {
    const r = rectExpanded(o, pad);
    if (!pointInRect(x, y, r)) return;
    const dL = Math.abs(x - r.x);
    const dR = Math.abs(r.x + r.w - x);
    const dT = Math.abs(y - r.y);
    const dB = Math.abs(r.y + r.h - y);
    const minD = Math.min(dL, dR, dT, dB);
    if (minD === dL) x = r.x - 2;
    else if (minD === dR) x = r.x + r.w + 2;
    else if (minD === dT) y = r.y - 2;
    else y = r.y + r.h + 2;
  });
  return missionClamp(x, y);
}

function findNearestFreePoint(pos, pad = 14) {
  let p = pushOutFromObstacles(pos, pad);
  const blocked = (x, y) => {
    for (let i = 0; i < (mission.obstacles || []).length; i += 1) {
      const r = rectExpanded(mission.obstacles[i], pad);
      if (pointInRect(x, y, r)) return true;
    }
    return false;
  };
  if (!blocked(p.x, p.y)) return p;
  const step = 22;
  const maxRing = 14;
  for (let ring = 1; ring <= maxRing; ring += 1) {
    const r = ring * step;
    for (let i = 0; i < 24; i += 1) {
      const a = (Math.PI * 2 * i) / 24;
      const t = missionClamp(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
      if (!blocked(t.x, t.y)) return t;
    }
  }
  return p;
}

function buildAvoidPath(from, to, pad = 18) {
  const safeTo = findNearestFreePoint(to, pad + 2);
  const path = [];
  let cur = { x: from.x, y: from.y };
  let guard = 0;
  while (guard < 12) {
    guard += 1;
    const block = firstBlockingObstacle(cur.x, cur.y, safeTo.x, safeTo.y, pad);
    if (!block) break;
    const margin = 22 + guard * 2;
    const cands = [
      { x: block.x - margin, y: block.y - margin },
      { x: block.x + block.w + margin, y: block.y - margin },
      { x: block.x + block.w + margin, y: block.y + block.h + margin },
      { x: block.x - margin, y: block.y + block.h + margin },
      { x: block.x + block.w * 0.5, y: block.y - margin },
      { x: block.x + block.w * 0.5, y: block.y + block.h + margin },
      { x: block.x - margin, y: block.y + block.h * 0.5 },
      { x: block.x + block.w + margin, y: block.y + block.h * 0.5 },
    ].map((p) => findNearestFreePoint(missionClamp(p.x, p.y), pad));
    cands.sort((a, b) => {
      const ac = countBlockingObstacles(cur.x, cur.y, a.x, a.y, pad) + countBlockingObstacles(a.x, a.y, safeTo.x, safeTo.y, pad);
      const bc = countBlockingObstacles(cur.x, cur.y, b.x, b.y, pad) + countBlockingObstacles(b.x, b.y, safeTo.x, safeTo.y, pad);
      const ad = Math.hypot(cur.x - a.x, cur.y - a.y) + Math.hypot(safeTo.x - a.x, safeTo.y - a.y);
      const bd = Math.hypot(cur.x - b.x, cur.y - b.y) + Math.hypot(safeTo.x - b.x, safeTo.y - b.y);
      return ac - bc || ad - bd;
    });
    let picked = cands[0] || safeTo;
    for (let i = 0; i < cands.length; i += 1) {
      const p = cands[i];
      if (!firstBlockingObstacle(cur.x, cur.y, p.x, p.y, pad * 0.8)) {
        picked = p;
        break;
      }
    }
    if (!picked) break;
    path.push(picked);
    cur = picked;
  }
  path.push(safeTo);
  const smooth = [];
  let anchor = from;
  for (let i = 0; i < path.length; i += 1) {
    const p = path[i];
    if (firstBlockingObstacle(anchor.x, anchor.y, p.x, p.y, pad)) {
      smooth.push(p);
      anchor = p;
    } else if (i === path.length - 1) {
      smooth.push(p);
    }
  }
  return smooth.length ? smooth : [safeTo];
}

function obstacleAvoidanceVector(x, y, radius = 14) {
  let vx = 0;
  let vy = 0;
  const sense = radius + 26;
  (mission.obstacles || []).forEach((o) => {
    const r = rectExpanded(o, sense);
    if (!pointInRect(x, y, r)) return;
    const cx = clamp(x, r.x, r.x + r.w);
    const cy = clamp(y, r.y, r.y + r.h);
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.hypot(dx, dy) || 0.001;
    const w = clamp((sense - d) / sense, 0, 1);
    vx += (dx / d) * w * 1.45;
    vy += (dy / d) * w * 1.45;
  });
  return { vx, vy };
}

function setMissionZoom(nextZoom, clientX, clientY) {
  const zr = getMissionZoomRange();
  const oldZoom = clamp(mission.zoom || 1, zr.min, zr.max);
  const nz = clamp(nextZoom, zr.min, zr.max);
  if (Math.abs(nz - oldZoom) < 0.001) return;
  const before = missionWorldPos(clientX, clientY);
  mission.zoom = nz;
  const cssW = Number(mission.canvasCssW || ui.canvas.clientWidth || window.innerWidth);
  const cssH = Number(mission.canvasCssH || ui.canvas.clientHeight || window.innerHeight);
  mission.viewW = cssW / mission.zoom;
  mission.viewH = cssH / mission.zoom;
  const after = missionWorldPos(clientX, clientY);
  mission.camera = clampMissionCamera(mission.camera.x + (before.x - after.x), mission.camera.y + (before.y - after.y));
}

function clampMissionCamera(x, y) {
  const minX = 0;
  const minY = 0;
  const maxX = Math.max(minX, mission.worldW - mission.viewW);
  const maxY = Math.max(minY, mission.worldH - mission.viewH);
  return { x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) };
}

function getMissionZoomRange() {
  // Keep units/mechs/enemies recognizable while allowing broad scouting.
  return { min: 0.55, max: 2.4 };
}

function angleWrap(a) {
  let v = a;
  while (v > Math.PI) v -= Math.PI * 2;
  while (v < -Math.PI) v += Math.PI * 2;
  return v;
}

function lerpAngle(from, to, t) {
  const d = angleWrap(to - from);
  return from + d * clamp(t, 0, 1);
}

function buildMissionNavGrid(cellSize = 72) {
  const cols = Math.max(8, Math.ceil(mission.worldW / cellSize));
  const rows = Math.max(8, Math.ceil(mission.worldH / cellSize));
  const blocked = new Uint8Array(cols * rows);
  const markBlocked = (cx, cy) => {
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;
    blocked[cy * cols + cx] = 1;
  };
  (mission.obstacles || []).forEach((o) => {
    const pad = 28;
    const minX = Math.floor((o.x - pad) / cellSize);
    const maxX = Math.floor((o.x + o.w + pad) / cellSize);
    const minY = Math.floor((o.y - pad) / cellSize);
    const maxY = Math.floor((o.y + o.h + pad) / cellSize);
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) markBlocked(x, y);
    }
  });
  return { cellSize, cols, rows, blocked };
}

function navCellId(x, y, cols) {
  return y * cols + x;
}

function findNearestNavCell(grid, sx, sy, maxRadius = 7) {
  const cx = clamp(Math.floor(sx / grid.cellSize), 0, grid.cols - 1);
  const cy = clamp(Math.floor(sy / grid.cellSize), 0, grid.rows - 1);
  const free = (x, y) => x >= 0 && y >= 0 && x < grid.cols && y < grid.rows && grid.blocked[navCellId(x, y, grid.cols)] === 0;
  if (free(cx, cy)) return { x: cx, y: cy };
  for (let r = 1; r <= maxRadius; r += 1) {
    for (let yy = cy - r; yy <= cy + r; yy += 1) {
      for (let xx = cx - r; xx <= cx + r; xx += 1) {
        if (!free(xx, yy)) continue;
        return { x: xx, y: yy };
      }
    }
  }
  return { x: cx, y: cy };
}

function buildAStarPath(from, to) {
  const g = mission.navGrid;
  if (!g) return [];
  const s = findNearestNavCell(g, from.x, from.y, 8);
  const t = findNearestNavCell(g, to.x, to.y, 8);
  const startId = navCellId(s.x, s.y, g.cols);
  const targetId = navCellId(t.x, t.y, g.cols);
  if (startId === targetId) return [findNearestFreePoint(to, 14)];
  const INF = 1e15;
  const gScore = new Float64Array(g.cols * g.rows);
  const fScore = new Float64Array(g.cols * g.rows);
  const came = new Int32Array(g.cols * g.rows);
  const open = new Uint8Array(g.cols * g.rows);
  const closed = new Uint8Array(g.cols * g.rows);
  for (let i = 0; i < gScore.length; i += 1) {
    gScore[i] = INF;
    fScore[i] = INF;
    came[i] = -1;
  }
  const h = (x, y) => Math.abs(x - t.x) + Math.abs(y - t.y);
  const openList = [startId];
  open[startId] = 1;
  gScore[startId] = 0;
  fScore[startId] = h(s.x, s.y);
  const dirs = [
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
    [1, 1, 1.42], [1, -1, 1.42], [-1, 1, 1.42], [-1, -1, 1.42],
  ];
  let guard = 0;
  while (openList.length && guard < 12000) {
    guard += 1;
    let bestIdx = 0;
    for (let i = 1; i < openList.length; i += 1) {
      if (fScore[openList[i]] < fScore[openList[bestIdx]]) bestIdx = i;
    }
    const curId = openList.splice(bestIdx, 1)[0];
    open[curId] = 0;
    if (curId === targetId) {
      const points = [];
      let id = curId;
      while (id !== -1) {
        const cy = Math.floor(id / g.cols);
        const cx = id - cy * g.cols;
        points.push({
          x: cx * g.cellSize + g.cellSize * 0.5,
          y: cy * g.cellSize + g.cellSize * 0.5,
        });
        id = came[id];
      }
      points.reverse();
      points.push(findNearestFreePoint(to, 14));
      const smoothed = [];
      let anchor = from;
      for (let i = 0; i < points.length; i += 1) {
        if (firstBlockingObstacle(anchor.x, anchor.y, points[i].x, points[i].y, 16)) {
          smoothed.push(points[i]);
          anchor = points[i];
        } else if (i === points.length - 1) {
          smoothed.push(points[i]);
        }
      }
      return smoothed;
    }
    closed[curId] = 1;
    const cy = Math.floor(curId / g.cols);
    const cx = curId - cy * g.cols;
    for (let i = 0; i < dirs.length; i += 1) {
      const nx = cx + dirs[i][0];
      const ny = cy + dirs[i][1];
      if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) continue;
      const nid = navCellId(nx, ny, g.cols);
      if (closed[nid] || g.blocked[nid]) continue;
      const tg = gScore[curId] + dirs[i][2];
      if (tg >= gScore[nid]) continue;
      came[nid] = curId;
      gScore[nid] = tg;
      fScore[nid] = tg + h(nx, ny);
      if (!open[nid]) {
        open[nid] = 1;
        openList.push(nid);
      }
    }
  }
  return [];
}

function computeUnitPath(from, to, pad = 18) {
  const aStar = buildAStarPath(from, to);
  if (aStar && aStar.length) return aStar;
  return buildAvoidPath(from, to, pad);
}

function generateMissionObstacles(worldW, worldH, region, theme = PLANET_THEME_CONFIG.p1) {
  const obs = [];
  const pushObs = (x, y, w, h, type = "ruin") => {
    const nx = clamp(x, 40, worldW - 120);
    const ny = clamp(y, 40, worldH - 120);
    const nw = clamp(w, 42, 420);
    const nh = clamp(h, 36, 360);
    if (rectIntersectsMissionStartSafeZone(nx, ny, nw, nh, worldW, worldH, 20)) return;
    obs.push({
      id: `obs-${obs.length}`,
      x: nx,
      y: ny,
      w: nw,
      h: nh,
      type,
    });
  };

  const lanesY = [0.22, 0.42, 0.62, 0.8].map((r) => Math.round(worldH * r));
  lanesY.forEach((ly, idx) => {
    const segW = 420;
    const gapW = 200 + idx * 20;
    let x = 120;
    while (x < worldW - 180) {
      const gap = (Math.floor((x + idx * 77) / (segW + gapW)) % 3) === 1;
      if (!gap) pushObs(x, ly - 28, segW, 56, theme.obstacleMain || "ruin");
      x += segW + gapW;
    }
  });

  const lanesX = [0.25, 0.5, 0.74].map((r) => Math.round(worldW * r));
  lanesX.forEach((lx, idx) => {
    const segH = 360;
    const gapH = 240 + idx * 30;
    let y = 120;
    while (y < worldH - 180) {
      const gap = (Math.floor((y + idx * 91) / (segH + gapH)) % 3) === 2;
      if (!gap) pushObs(lx - 22, y, 44, segH, theme.obstacleMain || "ruin");
      y += segH + gapH;
    }
  });

  const clusterCount = 8 + Math.floor((region?.difficulty || 1) * 0.6);
  for (let c = 0; c < clusterCount; c += 1) {
    const cx = 220 + Math.random() * (worldW - 440);
    const cy = 180 + Math.random() * (worldH - 360);
    const type = c % 2 === 0 ? (theme.obstacleAltA || "tree") : (theme.obstacleAltB || "rock");
    const n = 8 + randInt(0, 8);
    for (let i = 0; i < n; i += 1) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const rr = 40 + Math.random() * 130;
      const isTreeLike = type === "tree";
      const w = isTreeLike ? 52 + Math.random() * 52 : 62 + Math.random() * 68;
      const h = isTreeLike ? 40 + Math.random() * 46 : 52 + Math.random() * 62;
      pushObs(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, w, h, type);
    }
  }

  const sideCount = 24;
  for (let i = 0; i < sideCount; i += 1) {
    const side = i % 4;
    if (side === 0) pushObs(50 + i * 6, 50 + Math.random() * 60, 120 + Math.random() * 160, 34 + Math.random() * 28, theme.obstacleAltB || "rock");
    if (side === 1) pushObs(worldW - 250 - i * 5, 70 + Math.random() * 70, 120 + Math.random() * 170, 34 + Math.random() * 28, theme.obstacleAltB || "rock");
    if (side === 2) pushObs(60 + Math.random() * 120, worldH - 180 - Math.random() * 70, 120 + Math.random() * 170, 34 + Math.random() * 30, theme.obstacleAltA || "tree");
    if (side === 3) pushObs(worldW - 260 - Math.random() * 120, worldH - 180 - Math.random() * 70, 120 + Math.random() * 170, 34 + Math.random() * 30, theme.obstacleAltA || "tree");
  }

  return obs;
}

function missionUnitCards(units) {
  const coreThemeByName = (coreName = "") => {
    const n = String(coreName || "");
    if (n.includes("소나")) return "core-sona";
    if (n.includes("그래비티")) return "core-gravity";
    if (n.includes("플레임") || n.includes("소이")) return "core-flame";
    if (n.includes("클록") || n.includes("페이즈")) return "core-cloak";
    if (n.includes("실드") || n.includes("캐슬")) return "core-shield";
    if (n.includes("레이저") || n.includes("살보")) return "core-laser";
    if (n.includes("스팀") || n.includes("업그레이드")) return "core-steam";
    return "core-generic";
  };
  const cards = [];
  units.forEach((u, i) => {
    const baseCastRange = Math.max(140, Math.round((u.firearmRange || 220) * (u.isMech ? 1.2 : 1.08)));
    cards.push({
      id: `ms-${u.id}-1`,
      ownerId: u.id,
      name: `${u.name} 스킬`,
      sourceTitle: `${u.name} 스킬`,
      sourceSub: u.isMech ? `${u.name} 메카 모듈` : `${u.name} 유닛`,
      desc: `드래그 위치 공격 (사거리 ${baseCastRange})`,
      kind: "damage",
      artKind: u.isMech ? "module" : "damage",
      artClass: u.isMech ? "art-module" : "art-damage",
      radius: 120 + (u.isMech ? 30 : 0),
      castRange: baseCastRange,
      power: Math.round(u.atk * 1.2),
      cooldown: Math.max(6, 14 - u.speed / 18),
      remain: 0,
      readyAt: 0,
      color: u.attrColor || "#9dc7ff",
    });
    if (u.isMech && u.coreSkillName) {
      const coreRange = Math.max(baseCastRange, Math.round((u.firearmRange || 220) * 1.45));
      cards.push({
        id: `ms-${u.id}-core`,
        ownerId: u.id,
        name: u.coreSkillName,
        sourceTitle: `${u.name} 코어 스킬`,
        sourceSub: u.coreSkillName,
        desc: `코어 범위 발동 (사거리 ${coreRange})`,
        kind: "core",
        artKind: "core",
        artClass: `art-core ${coreThemeByName(u.coreSkillName)}`,
        radius: 160,
        castRange: coreRange,
        power: Math.round(u.atk * 1.55),
        cooldown: 22,
        remain: 0,
        readyAt: 0,
        color: "#f2c14e",
      });
    }
    if (i % 3 === 0) {
      const healRange = Math.max(130, Math.round((u.firearmRange || 220) * 0.95));
      cards.push({
        id: `ms-${u.id}-heal`,
        ownerId: u.id,
        name: `${u.name} 지원`,
        sourceTitle: `${u.name} 지원 스킬`,
        sourceSub: "회복 모듈",
        desc: `아군 범위 회복 (사거리 ${healRange})`,
        kind: "heal",
        artKind: "heal",
        artClass: "art-heal",
        radius: 130,
        castRange: healRange,
        power: Math.round(u.maxHp * 0.12),
        cooldown: 18,
        remain: 0,
        readyAt: 0,
        color: "#57cc99",
      });
    }
  });
  return cards;
}

function makeSkillCardArtData(skill) {
  const name = String(skill?.name || "");
  const src = String(skill?.sourceSub || "");
  const kind = String(skill?.kind || "damage");
  const label = `${name}|${src}|${kind}`;
  const hash = Math.abs([...label].reduce((a, c) => ((a * 31) + c.charCodeAt(0)) % 100000, 7));
  const hue = hash % 360;
  const hue2 = (hue + 42) % 360;
  const hue3 = (hue + 88) % 360;
  let motif = `<circle cx='380' cy='620' r='156' fill='rgba(255,255,255,0.38)'/>`;
  if (kind === "heal" || /회복|치유|수복/.test(label)) {
    motif = `<path d='M340 470 h80 v80 h80 v80 h-80 v80 h-80 v-80 h-80 v-80 h80 z' fill='rgba(216,255,230,0.84)'/>`;
  } else if (kind === "core" || /코어/.test(label)) {
    if (/소나/.test(label)) motif = `<circle cx='380' cy='620' r='116' fill='rgba(170,235,255,0.9)'/><circle cx='380' cy='620' r='192' fill='none' stroke='rgba(140,220,255,0.65)' stroke-width='16'/><circle cx='380' cy='620' r='262' fill='none' stroke='rgba(140,220,255,0.4)' stroke-width='12'/>`;
    else if (/그래비티/.test(label)) motif = `<circle cx='380' cy='620' r='126' fill='rgba(180,146,255,0.85)'/><ellipse cx='380' cy='620' rx='252' ry='66' fill='none' stroke='rgba(208,178,255,0.6)' stroke-width='16'/>`;
    else if (/플레임|소이/.test(label)) motif = `<path d='M380 430 C300 530,320 598,380 730 C444 610,460 542,380 430z' fill='rgba(255,178,120,0.88)'/>`;
    else if (/클록|연막|스모크/.test(label)) motif = `<circle cx='360' cy='610' r='120' fill='rgba(150,160,180,0.5)'/><circle cx='440' cy='560' r='140' fill='rgba(110,120,140,0.42)'/><circle cx='320' cy='700' r='108' fill='rgba(138,148,170,0.36)'/>`;
    else if (/실드|방호|캐슬/.test(label)) motif = `<path d='M380 430 L520 486 V602 C520 700,454 780,380 822 C306 780,240 700,240 602 V486 Z' fill='rgba(196,255,216,0.75)'/>`;
    else if (/레이저|빔/.test(label)) motif = `<rect x='210' y='594' width='350' height='28' rx='14' fill='rgba(232,244,255,0.8)'/><rect x='260' y='540' width='100' height='18' rx='9' fill='rgba(232,244,255,0.65)'/>`;
    else motif = `<circle cx='380' cy='620' r='122' fill='rgba(190,210,255,0.82)'/><path d='M380 450 l38 84 88 12-66 58 20 88-80-42-80 42 20-88-66-58 88-12z' fill='rgba(236,244,255,0.65)'/>`;
  } else if (/대쉬|돌진|이동/.test(label)) {
    motif = `<path d='M184 660 L504 540 L436 660 L588 660 L268 780 L336 660 Z' fill='rgba(190,230,255,0.82)'/>`;
  } else if (/실드|방어|차폐/.test(label)) {
    motif = `<path d='M380 438 L532 498 V626 C532 718,460 794,380 830 C300 794,228 718,228 626 V498 Z' fill='rgba(180,255,214,0.78)'/>`;
  } else if (/소총|AR|SMG|SR|DMR|RL|SG/.test(label)) {
    motif = `<rect x='196' y='584' width='360' height='56' rx='16' fill='rgba(229,240,255,0.8)'/><rect x='314' y='640' width='48' height='108' rx='12' fill='rgba(229,240,255,0.8)'/>`;
  }
  const deco = [...Array(8)].map((_, i) => {
    const x = 90 + ((hash + i * 79) % 580);
    const y = 130 + ((hash + i * 53) % 860);
    const r = 22 + ((hash + i * 17) % 48);
    return `<circle cx='${x}' cy='${y}' r='${r}' fill='hsla(${(hue + i * 19) % 360} 80% 80% / 0.07)'/>`;
  }).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 760 1120'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='hsl(${hue} 58% 24%)'/>
        <stop offset='0.55' stop-color='hsl(${hue2} 52% 17%)'/>
        <stop offset='1' stop-color='hsl(${hue3} 46% 12%)'/>
      </linearGradient>
    </defs>
    <rect width='760' height='1120' rx='48' fill='url(#bg)'/>
    <circle cx='600' cy='220' r='180' fill='rgba(255,255,255,0.08)'/>
    <circle cx='160' cy='920' r='220' fill='rgba(255,255,255,0.06)'/>
    ${deco}
    ${motif}
  </svg>`;
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27");
  return `url('data:image/svg+xml;utf8,${encoded}')`;
}

function renderMissionSkills() {
  if (!ui.missionSkillCards) return;
  ui.missionSkillCards.innerHTML = mission.skillCards
    .map((s) => `<div class="mission-skill-card ${s.remain > 0 ? "on-cooldown" : ""}" style="--skill-bg:${makeSkillCardArtData(s)}" draggable="${s.remain <= 0 ? "true" : "false"}" data-skill-id="${s.id}">
      <div class="skill-card-head"><strong>${s.sourceTitle || s.name}</strong><small>${s.sourceSub || s.desc}</small></div>
      <div class="skill-card-body"><span>${s.name}</span></div>
      <div class="skill-card-foot"><small data-skill-remain="${s.id}">${s.remain > 0 ? `${s.remain.toFixed(1)}s` : "사용 가능"}</small></div></div>`)
    .join("");
  if (ui.missionSkillPeek) {
    ui.missionSkillPeek.textContent = `카드 드래그 후 맵에 놓아 사용 (총 ${mission.skillCards.length}장)`;
  }
}

function syncMissionSkillCooldowns(nowMs = Date.now()) {
  (mission.skillCards || []).forEach((s) => {
    if (!Number.isFinite(s.readyAt)) s.readyAt = 0;
    if (s.readyAt <= 0 && s.remain > 0) {
      // Legacy saves/old runtime path: promote remaining seconds to absolute timestamp once.
      s.readyAt = nowMs + Math.round(s.remain * 1000);
    }
    if (s.readyAt > 0) {
      s.remain = Math.max(0, (s.readyAt - nowMs) / 1000);
      if (s.remain <= 0) s.readyAt = 0;
    } else {
      s.remain = 0;
    }
  });
}

function refreshMissionSkillCooldownUi() {
  if (!ui.missionSkillCards) return;
  mission.skillCards.forEach((s) => {
    const card = ui.missionSkillCards.querySelector(`[data-skill-id="${s.id}"]`);
    if (!card) return;
    const onCooldown = s.remain > 0;
    card.classList.toggle("on-cooldown", onCooldown);
    card.setAttribute("draggable", onCooldown ? "false" : "true");
    const remainNode = card.querySelector(`[data-skill-remain="${s.id}"]`);
    if (remainNode) remainNode.textContent = onCooldown ? `${s.remain.toFixed(1)}s` : "사용 가능";
  });
}

function updateMissionControlUi() {
  if (ui.missionAutoBtn) {
    ui.missionAutoBtn.textContent = `자동: ${mission.autoMode ? "ON" : "OFF"}`;
    ui.missionAutoBtn.classList.toggle("active", !!mission.autoMode);
  }
  if (ui.missionFollowSwitchBtn) {
    ui.missionFollowSwitchBtn.disabled = getFollowableUnits().length <= 1;
  }
  if (ui.missionFollowLabel) {
    const fu = mission.units.find((u) => u.id === mission.followUnitId && u.hp > 0);
    ui.missionFollowLabel.textContent = `추적: ${fu ? fu.name : "없음"}`;
  }
  if (ui.missionSpeedGroup) {
    ui.missionSpeedGroup.querySelectorAll("button[data-speed]").forEach((btn) => {
      const speed = Number(btn.dataset.speed || 1);
      btn.classList.toggle("active", speed === (mission.timeScale || 1));
    });
  }
}

function getFollowableUnits() {
  return (mission.units || []).filter((u) => u && u.hp > 0);
}

function setMissionFollowUnit(unitId) {
  const units = getFollowableUnits();
  if (!units.length) {
    mission.followUnitId = null;
    updateMissionControlUi();
    return;
  }
  const chosen = units.find((u) => u.id === unitId) || units[0];
  mission.followUnitId = chosen.id;
  updateMissionControlUi();
}

function cycleMissionFollowUnit() {
  const units = getFollowableUnits();
  if (!units.length) {
    mission.followUnitId = null;
    updateMissionControlUi();
    return;
  }
  const idx = units.findIndex((u) => u.id === mission.followUnitId);
  const next = units[(idx + 1 + units.length) % units.length];
  setMissionFollowUnit(next.id);
}

function updateMissionFollowCamera(dt) {
  if (!mission.autoMode) return;
  if (missionInput?.draggingCamera) return;
  const fu = mission.units.find((u) => u.id === mission.followUnitId && u.hp > 0) || null;
  if (!fu) return;
  const target = clampMissionCamera(
    fu.x - mission.viewW * 0.5,
    fu.y - mission.viewH * 0.58,
  );
  const t = 1 - Math.exp(-Math.max(0.001, dt) * 6.5);
  mission.camera = clampMissionCamera(
    mission.camera.x + (target.x - mission.camera.x) * t,
    mission.camera.y + (target.y - mission.camera.y) * t,
  );
}

function setMissionAutoMode(enabled) {
  mission.autoMode = !!enabled;
  mission.autoThinkCd = 0;
  if (mission.autoMode) setMissionFollowUnit(mission.followUnitId);
  updateMissionControlUi();
}

function setMissionTimeScale(speed) {
  mission.timeScale = clamp(Math.round(Number(speed) || 1), 1, 5);
  updateMissionControlUi();
}

function autoCastMissionSkill(skill) {
  if (!skill || skill.remain > 0) return false;
  const owner = mission.units.find((u) => u.id === skill.ownerId) || mission.units[0];
  if (!owner || owner.hp <= 0) return false;
  const castRange = Math.max(60, Number(skill.castRange || owner.firearmRange || 220));
  if (skill.kind === "heal") {
    const low = [...mission.units]
      .filter((u) => u.hp > 0 && Math.hypot(u.x - owner.x, u.y - owner.y) <= castRange)
      .sort((a, b) => (a.hp / Math.max(1, a.maxHp)) - (b.hp / Math.max(1, b.maxHp)))[0];
    const target = low || owner;
    return castSkillCard(skill, target.x, target.y, { silentFail: true });
  }
  let target = null;
  let best = Infinity;
  mission.enemies.forEach((e) => {
    const d = Math.hypot(e.x - owner.x, e.y - owner.y);
    if (d <= castRange && d < best) {
      best = d;
      target = e;
    }
  });
  if (!target) return false;
  return castSkillCard(skill, target.x, target.y, { silentFail: true });
}

function pickBestEnemyTargetForUnit(unit) {
  let best = null;
  let bestDist = Infinity;
  let bestHp = Infinity;
  const tieEps = 6;
  const targets = [
    ...(mission.enemies || []),
    ...((mission.rareMines || []).filter((m) => m && !m.broken && m.hp > 0)),
  ];
  targets.forEach((e) => {
    const d = Math.hypot(e.x - unit.x, e.y - unit.y);
    const ehp = Number.isFinite(e.hp) ? e.hp : 999999;
    if (d + tieEps < bestDist) {
      best = e;
      bestDist = d;
      bestHp = ehp;
      return;
    }
    if (Math.abs(d - bestDist) <= tieEps && ehp < bestHp) {
      best = e;
      bestDist = d;
      bestHp = ehp;
    }
  });
  return { target: best, dist: bestDist };
}

function updateMissionAutoMode(dt) {
  if (!mission.autoMode || mission.phase !== "battle") return;
  mission.autoThinkCd = Math.max(0, (mission.autoThinkCd || 0) - dt);
  if (mission.autoThinkCd > 0) return;
  mission.autoThinkCd = 0.22;

  mission.units.forEach((u) => {
    if (u.hp <= 0) return;
    const pick = pickBestEnemyTargetForUnit(u);
    const nearest = pick.target;
    const dist = pick.dist;
    if (!nearest || !Number.isFinite(dist)) return;
    const engage = Math.max(u.meleeRange || 120, (u.firearmRange || 190) * 0.86);
    if (dist <= engage * 0.9) return;
    const tx = clamp(nearest.x + randInt(-22, 22), 40, mission.worldW - 40);
    const ty = clamp(nearest.y + randInt(-22, 22), 40, mission.worldH - 40);
    const needRepath =
      !u.path?.length ||
      Math.hypot((u.targetX || u.moveX || u.x) - tx, (u.targetY || u.moveY || u.y) - ty) > 70;
    if (!needRepath) return;
    const path = computeUnitPath({ x: u.x, y: u.y }, { x: tx, y: ty }, Math.max(16, u.r + 4));
    u.path = path;
    const end = path[path.length - 1] || { x: tx, y: ty };
    u.targetX = end.x;
    u.targetY = end.y;
    const first = path[0] || { x: tx, y: ty };
    u.moveX = first.x;
    u.moveY = first.y;
  });

  const ready = mission.skillCards.filter((s) => s.remain <= 0);
  if (!ready.length) return;
  let casted = 0;
  for (let i = 0; i < ready.length && casted < 2; i += 1) {
    const sk = ready[i];
    if (sk.kind !== "heal" && Math.random() < 0.35) continue;
    if (autoCastMissionSkill(sk)) casted += 1;
  }
}

function renderMissionLoading(visible, title, text) {
  if (!ui.missionLoadingOverlay) return;
  ui.missionLoadingOverlay.classList.toggle("hidden", !visible);
  if (title && ui.missionLoadingTitle) ui.missionLoadingTitle.textContent = title;
  if (text && ui.missionLoadingText) ui.missionLoadingText.textContent = text;
}

function buildMissionUnitsAdvanced(deployed) {
  const teamCounts = getTeamCounts(deployed);
  const activeMech = (state.mechs || []).find((m) => m.unlocked && m.id === state.activeMechId) || null;
  const ship = getActiveShip();
  const shipAtk = 1 + Number(ship?.buffAtk || 0);
  const shipDef = 1 + Number(ship?.buffDef || 0);
  const shipHp = 1 + Number(ship?.buffHp || 0);
  const shipSpd = 1 + Number(ship?.buffSpeed || 0);
  const themeAttr = getAttributeBase(mission.theme?.primaryAttr || "물리");
  return deployed.map((u, i) => {
    const s = calculateUnitStatsWithTeam(u, teamCounts);
    let mech = (state.mechs || []).find((m) => m.unlocked && m.pilotId === u.id) || null;
    if (!mech && activeMech && i === 0) mech = activeMech;
    const mechAttr = mech?.attribute || u.attribute;
    const melee = u.equippedMelee || createItemIconLoadout("melee", u);
    const firearm = u.equippedFirearm || createItemIconLoadout("firearm", u);
    const defense = u.equippedDefense || null;
    const mechCurrentHp = mech ? Math.max(1, Number(mech.currentHp || 0) || mech.hp || 1) : 0;
    const unitAttrBase = getAttributeBase(mechAttr || u.attribute || "물리");
    const isThemeMatch = unitAttrBase === themeAttr;
    const themeAtk = isThemeMatch ? 1.14 : 1;
    const themeDef = isThemeMatch ? 1.1 : 1;
    const themeHp = isThemeMatch ? 1.08 : 1;
    const themeSpd = isThemeMatch ? 1.08 : 1;
    const p = missionClamp(200 + (i % 5) * 58, mission.worldH - 220 + Math.floor(i / 5) * 42);
    return {
      id: u.id,
      name: u.name,
      x: p.x,
      y: p.y,
      r: mech ? 18 : 12,
      color: mech ? getAttributeColor(mechAttr) : (u.color || "#80c7ff"),
      attrColor: getAttributeColor(mechAttr),
      moveX: p.x,
      moveY: p.y,
      targetX: p.x,
      targetY: p.y,
      path: [],
      velX: 0,
      velY: 0,
      faceAngle: -Math.PI / 2,
      visible: false,
      deployDelay: i * 0.1,
      deployProgress: 0,
      spawnX: p.x,
      spawnY: p.y,
      finalX: p.x,
      finalY: p.y,
      stuckTime: 0,
      lastPosX: p.x,
      lastPosY: p.y,
      maxHp: Math.round((s.hp + (mech ? mech.hp * 0.45 : 0)) * shipHp * themeHp),
      hp: Math.round((s.hp + (mech ? mechCurrentHp * 0.45 : 0)) * shipHp * themeHp),
      atk: Math.round((s.atk + (mech ? mech.atk * 0.33 : 0)) * shipAtk * themeAtk),
      def: Math.round((s.def + (mech ? mech.def * 0.36 : 0)) * shipDef * themeDef),
      speed: Math.round((90 + s.speed * 3 + (mech ? mech.speed * 1.5 : 0)) * shipSpd * themeSpd),
      meleeRange: Math.round((melee?.range || 1.8) * 68),
      firearmRange: Math.round((firearm?.range || 3.0) * 74),
      meleeDmg: Math.max(6, Math.round((melee?.atk || 7) + s.atk * 0.55)),
      firearmDmg: Math.max(6, Math.round((firearm?.atk || 8) + s.atk * 0.62)),
      meleeType: melee?.weaponType || "소드",
      meleeIcon: createWeaponTypeIcon(melee?.weaponType || "소드", "melee"),
      firearmType: firearm?.weaponType || "AR",
      firearmIcon: createWeaponTypeIcon(firearm?.weaponType || "AR", "firearm"),
      defenseType: defense?.weaponType || "",
      hasDefense: !!(defense || mech?.equippedDefense),
      meleeCd: Math.max(0.22, 0.96 / (melee?.attackSpeed || 1)),
      firearmCd: Math.max(0.2, 0.92 / (firearm?.attackSpeed || 1)),
      attackCd: 0,
      isMech: !!mech,
      mechId: mech?.id || null,
      mechHp: mechCurrentHp,
      mechMaxHp: mech?.hp || 0,
      mechBroken: false,
      mechDestroyedThisMission: false,
      baseSpeed: Math.round((90 + s.speed * 3 + (mech ? mech.speed * 1.5 : 0)) * shipSpd * themeSpd),
      coreSkillName: mech?.equippedCore?.name || mech?.coreSkill || "",
      lastDamagedAt: 0,
      regenDelay: 4.5,
      regenHpPerSec: Math.max(4, Math.round((Math.round(s.hp + (mech ? mechCurrentHp * 0.45 : 0))) * 0.035)),
      regenMechPerSec: Math.max(10, Math.round((mech?.hp || 220) * 0.04)),
    };
  });
}

function spawnEnemiesAdvanced(region) {
  if (region?.infiniteMode) {
    const spawnPlanetId = mission.infiniteThemePlanetId || mission.planetId || region?.planetId || "";
    const diffMeta = getDifficultyMeta();
    const statScale = 1.1 + diffMeta.enemyScale * 0.44;
    const difficulty = Math.max(8, Number(region?.difficulty || 10));
    const normal = Math.round((30 + difficulty * 9) * diffMeta.enemyScale);
    const midBossCount = Math.max(2, Math.floor(difficulty / 2));
    const finalBossCount = Math.max(2, 2 + Math.floor(difficulty / 4));
    mission.totalEnemyCount = normal + midBossCount + finalBossCount;
    mission.enemies = [];
    for (let i = 0; i < normal; i += 1) {
      const sx = mission.worldW * 0.22 + Math.random() * mission.worldW * 0.72;
      const sy = 120 + Math.random() * (mission.worldH - 240);
      const named = Math.random() < 0.22;
      const prof = buildVillainProfile(named ? "named" : "normal", spawnPlanetId, `inf-normal-${i}-${Date.now()}`);
      const identity = prof.identity;
      const trait = prof.trait;
      const maxHp = Math.round((120 + difficulty * 24) * statScale * trait.hpMul + Math.floor(Math.random() * 40));
      mission.enemies.push({
        id: `inf-e-${Date.now()}-${i}`,
        title: identity.title,
        realName: identity.realName,
        name: `${identity.title} - ${identity.realName}`,
        x: sx,
        y: sy,
        spawnX: sx,
        spawnY: sy,
        r: 14,
        hp: maxHp,
        maxHp,
        shield: 0,
        maxShield: 0,
        speed: Math.round((56 + Math.random() * 26) * trait.speedMul),
        atk: Math.round((15 + difficulty * 2.5) * (0.94 + statScale * 0.16) * trait.atkMul),
        resist: trait.resist,
        attackStyle: trait.attackStyle,
        archetype: trait.key,
        archetypeNotes: trait.notes,
        palette: trait.color,
        shape: trait.shape,
        rangedBias: trait.rangedBias,
        touchCd: 0,
        attackCd: 0,
        aggroRange: 230 + Math.random() * 180,
        alert: false,
        named,
        planetId: spawnPlanetId,
        faction: prof.faction,
        mercCodexKey: prof.mercRow?.key || "",
        attribute: prof.mercRow?.attribute || getVillainThemeByPlanetId(spawnPlanetId).primaryAttr,
      });
    }
    for (let i = 0; i < midBossCount; i += 1) {
      const sx = mission.worldW * 0.45 + Math.random() * mission.worldW * 0.5;
      const sy = 160 + Math.random() * (mission.worldH - 320);
      const prof = buildVillainProfile("midboss", spawnPlanetId, `inf-mid-${i}-${Date.now()}`);
      const identity = prof.identity;
      const trait = prof.trait;
      const maxHp = Math.round((460 + difficulty * 88) * statScale * trait.hpMul);
      mission.enemies.push({
        id: `inf-mb-${Date.now()}-${i}`,
        title: identity.title,
        realName: identity.realName,
        name: `${identity.title} - ${identity.realName}`,
        x: sx,
        y: sy,
        spawnX: sx,
        spawnY: sy,
        r: 18,
        hp: maxHp,
        maxHp,
        shield: 0,
        maxShield: 0,
        speed: Math.round((52 + Math.random() * 12) * trait.speedMul),
        atk: Math.round((28 + difficulty * 4.5) * trait.atkMul),
        resist: trait.resist,
        attackStyle: trait.attackStyle,
        archetype: trait.key,
        archetypeNotes: trait.notes,
        palette: trait.color,
        shape: trait.shape,
        rangedBias: trait.rangedBias,
        touchCd: 0,
        attackCd: 0,
        aggroRange: 320,
        alert: true,
        named: true,
        isMidBoss: true,
        revivesLeft: 1,
        planetId: spawnPlanetId,
        faction: prof.faction,
        mercCodexKey: prof.mercRow?.key || "",
        attribute: prof.mercRow?.attribute || getVillainThemeByPlanetId(spawnPlanetId).primaryAttr,
      });
    }
    for (let i = 0; i < finalBossCount; i += 1) {
      const sx = mission.worldW * (0.58 + Math.random() * 0.35);
      const sy = 180 + Math.random() * (mission.worldH - 360);
      const prof = buildVillainProfile("finalboss", spawnPlanetId, `inf-final-${i}-${Date.now()}`);
      const finalIdentity = prof.identity;
      const finalTrait = prof.trait;
      const finalPattern = getFinalBossPattern(finalIdentity.realName);
      const bossMaxHp = Math.round((1300 + difficulty * 310) * finalTrait.hpMul * (0.98 + statScale * 0.25));
      mission.enemies.push({
        id: `boss-final-inf-${Date.now()}-${i}`,
        title: finalIdentity.title,
        realName: finalIdentity.realName,
        name: `${finalIdentity.title} - ${finalIdentity.realName}`,
        x: sx,
        y: sy,
        r: 26,
        hp: bossMaxHp,
        maxHp: bossMaxHp,
        shield: 0,
        maxShield: 0,
        speed: Math.round(50 * finalTrait.speedMul),
        atk: Math.round((40 + difficulty * 6) * finalTrait.atkMul * (0.92 + statScale * 0.2)),
        resist: Math.min(0.42, finalTrait.resist + 0.08),
        attackStyle: finalTrait.attackStyle,
        archetype: `${finalTrait.key} / ${finalPattern.name}`,
        archetypeNotes: `${finalTrait.notes} · ${finalPattern.core}`,
        palette: finalPattern.color || finalTrait.color,
        shape: finalPattern.shape || finalTrait.shape,
        rangedBias: Math.max(0.5, finalTrait.rangedBias),
        touchCd: 0,
        attackCd: 0,
        spawnX: sx,
        spawnY: sy,
        aggroRange: 99999,
        alert: true,
        isBoss: true,
        leashRadius: 99999,
        revivesLeft: 1,
        bossPattern: finalPattern.id,
        bossSkillA: 2.5,
        bossSkillB: 0.85,
        bossSkillC: 6,
        named: true,
        planetId: spawnPlanetId,
        faction: prof.faction,
        mercCodexKey: prof.mercRow?.key || "",
        attribute: prof.mercRow?.attribute || getVillainThemeByPlanetId(spawnPlanetId).primaryAttr,
      });
    }
    return;
  }
  const spawnPlanetId = mission.planetId || region?.planetId || "";
  const diffMeta = getDifficultyMeta();
  const nightmare = !!diffMeta.nightmare;
  const statScale = 0.86 + diffMeta.enemyScale * 0.34;
  const base = 18 + region.difficulty * 6;
  const normal = Math.round(base * diffMeta.enemyScale * (nightmare ? 1.28 : 1));
  const midBossCount = Math.max(1, Math.floor(region.difficulty / 3) + (nightmare ? 1 : 0));
  mission.totalEnemyCount = normal + midBossCount + 1;
  mission.enemies = [];
  for (let i = 0; i < normal; i += 1) {
    const sx = mission.worldW * 0.35 + Math.random() * mission.worldW * 0.55;
    const sy = 120 + Math.random() * (mission.worldH - 240);
    const named = Math.random() < 0.16;
    const prof = buildVillainProfile(named ? "named" : "normal", spawnPlanetId, `normal-${i}-${region?.id || ""}-${Date.now()}`);
    const identity = prof.identity;
    const trait = prof.trait;
    const baseHp = (100 + region.difficulty * 18) * statScale;
    const baseAtk = (14 + region.difficulty * 2) * (0.9 + statScale * 0.18);
    const maxHp = Math.round(baseHp * trait.hpMul + Math.floor(Math.random() * 36));
    const shield = nightmare ? Math.round(maxHp * (0.24 + Math.random() * 0.16)) : 0;
    mission.enemies.push({
      id: `e-${Date.now()}-${i}`,
      title: identity.title,
      realName: identity.realName,
      name: `${identity.title} - ${identity.realName}`,
      x: sx,
      y: sy,
      spawnX: sx,
      spawnY: sy,
      r: 14,
      hp: maxHp,
      maxHp,
      shield,
      maxShield: shield,
      speed: Math.round((56 + Math.random() * 24) * trait.speedMul),
      atk: Math.round(baseAtk * trait.atkMul),
      resist: trait.resist,
      attackStyle: trait.attackStyle,
      archetype: trait.key,
      archetypeNotes: trait.notes,
      palette: trait.color,
      shape: trait.shape,
      rangedBias: trait.rangedBias,
      touchCd: 0,
      attackCd: 0,
      aggroRange: 150 + Math.random() * 120,
      alert: false,
      named,
      planetId: spawnPlanetId,
      faction: prof.faction,
      mercCodexKey: prof.mercRow?.key || "",
      attribute: prof.mercRow?.attribute || getVillainThemeByPlanetId(spawnPlanetId).primaryAttr,
    });
  }
  for (let i = 0; i < midBossCount; i += 1) {
    const sx = mission.worldW * 0.52 + Math.random() * mission.worldW * 0.36;
    const sy = 160 + Math.random() * (mission.worldH - 320);
    const prof = buildVillainProfile("midboss", spawnPlanetId, `mid-${i}-${region?.id || ""}-${Date.now()}`);
    const identity = prof.identity;
    const trait = prof.trait;
    const baseHp = (420 + region.difficulty * 70) * statScale;
    const baseAtk = (24 + region.difficulty * 4) * (0.94 + statScale * 0.2);
    const maxHp = Math.round(baseHp * trait.hpMul);
    const shield = nightmare ? Math.round(maxHp * 0.34) : 0;
    mission.enemies.push({
      id: `mb-${Date.now()}-${i}`,
      title: identity.title,
      realName: identity.realName,
      name: `${identity.title} - ${identity.realName}`,
      x: sx,
      y: sy,
      spawnX: sx,
      spawnY: sy,
      r: 18,
      hp: maxHp,
      maxHp,
      shield,
      maxShield: shield,
      speed: Math.round((52 + Math.random() * 10) * trait.speedMul),
      atk: Math.round(baseAtk * trait.atkMul),
      resist: trait.resist,
      attackStyle: trait.attackStyle,
      archetype: trait.key,
      archetypeNotes: trait.notes,
      palette: trait.color,
      shape: trait.shape,
      rangedBias: trait.rangedBias,
      touchCd: 0,
      attackCd: 0,
      aggroRange: 240,
      alert: false,
      named: true,
      isMidBoss: true,
      revivesLeft: nightmare ? 1 : 0,
      planetId: spawnPlanetId,
      faction: prof.faction,
      mercCodexKey: prof.mercRow?.key || "",
      attribute: prof.mercRow?.attribute || getVillainThemeByPlanetId(spawnPlanetId).primaryAttr,
    });
  }
  const bossX = mission.worldW - 320;
  const bossY = clamp(Math.round(mission.worldH * 0.5), 220, mission.worldH - 220);
  const finalProf = buildVillainProfile("finalboss", spawnPlanetId, `final-${region?.id || ""}-${Date.now()}`);
  const finalIdentity = finalProf.identity;
  const finalTrait = finalProf.trait;
  const finalPattern = getFinalBossPattern(finalIdentity.realName);
  const bossMaxHp = Math.round((1200 + region.difficulty * 260) * finalTrait.hpMul * (0.96 + statScale * 0.24));
  const bossShield = nightmare ? Math.round(bossMaxHp * 0.42) : 0;
  mission.enemies.push({
    id: "boss-final",
    title: finalIdentity.title,
    realName: finalIdentity.realName,
    name: `${finalIdentity.title} - ${finalIdentity.realName}`,
    x: bossX,
    y: bossY,
    r: 26,
    hp: bossMaxHp,
    maxHp: bossMaxHp,
    shield: bossShield,
    maxShield: bossShield,
    speed: Math.round(48 * finalTrait.speedMul),
    atk: Math.round((36 + region.difficulty * 5) * finalTrait.atkMul * (0.92 + statScale * 0.18)),
    resist: Math.min(0.36, finalTrait.resist + 0.06),
    attackStyle: finalTrait.attackStyle,
    archetype: `${finalTrait.key} / ${finalPattern.name}`,
    archetypeNotes: `${finalTrait.notes} · ${finalPattern.core}`,
    palette: finalPattern.color || finalTrait.color,
    shape: finalPattern.shape || finalTrait.shape,
    rangedBias: Math.max(0.45, finalTrait.rangedBias),
    touchCd: 0,
    attackCd: 0,
    spawnX: bossX,
    spawnY: bossY,
    aggroRange: nightmare ? 99999 : 280,
    alert: true,
    isBoss: true,
    leashRadius: nightmare ? 99999 : 280,
    revivesLeft: nightmare ? 1 : 0,
    bossPattern: finalPattern.id,
    bossSkillA: 2.8,
    bossSkillB: 0.9,
    bossSkillC: 6.5,
    named: true,
    planetId: spawnPlanetId,
    faction: finalProf.faction,
    mercCodexKey: finalProf.mercRow?.key || "",
    attribute: finalProf.mercRow?.attribute || getVillainThemeByPlanetId(spawnPlanetId).primaryAttr,
  });
}

function spawnInfiniteReplacementBoss() {
  if (!mission.infiniteMode) return;
  const region = { difficulty: 10 };
  const spawnPlanetId = mission.infiniteThemePlanetId || mission.planetId || "";
  const sx = mission.worldW * (0.58 + Math.random() * 0.35);
  const sy = 180 + Math.random() * (mission.worldH - 360);
  const finalProf = buildVillainProfile("finalboss", spawnPlanetId, `inf-re-${Date.now()}`);
  const finalIdentity = finalProf.identity;
  const finalTrait = finalProf.trait;
  const finalPattern = getFinalBossPattern(finalIdentity.realName);
  const bossMaxHp = Math.round((1450 + region.difficulty * 320) * finalTrait.hpMul);
  mission.enemies.push({
    id: `boss-final-inf-re-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: finalIdentity.title,
    realName: finalIdentity.realName,
    name: `${finalIdentity.title} - ${finalIdentity.realName}`,
    x: sx,
    y: sy,
    r: 26,
    hp: bossMaxHp,
    maxHp: bossMaxHp,
    shield: 0,
    maxShield: 0,
    speed: Math.round(52 * finalTrait.speedMul),
    atk: Math.round((44 + region.difficulty * 6) * finalTrait.atkMul),
    resist: Math.min(0.46, finalTrait.resist + 0.1),
    attackStyle: finalTrait.attackStyle,
    archetype: `${finalTrait.key} / ${finalPattern.name}`,
    archetypeNotes: `${finalTrait.notes} · ${finalPattern.core}`,
    palette: finalPattern.color || finalTrait.color,
    shape: finalPattern.shape || finalTrait.shape,
    rangedBias: Math.max(0.52, finalTrait.rangedBias),
    touchCd: 0,
    attackCd: 0,
    spawnX: sx,
    spawnY: sy,
    aggroRange: 99999,
    alert: true,
    isBoss: true,
    leashRadius: 99999,
    revivesLeft: 1,
    bossPattern: finalPattern.id,
    bossSkillA: 2.45,
    bossSkillB: 0.84,
    bossSkillC: 5.8,
    named: true,
    planetId: spawnPlanetId,
    faction: finalProf.faction,
    mercCodexKey: finalProf.mercRow?.key || "",
    attribute: finalProf.mercRow?.attribute || getVillainThemeByPlanetId(spawnPlanetId).primaryAttr,
  });
  mission.totalEnemyCount += 1;
}

function makeFieldRewardUnit(seed = 0) {
  const role = ROLE_ORDER[seed % ROLE_ORDER.length];
  const range = RANGE_ORDER[(seed + 2) % RANGE_ORDER.length];
  const attr = ATTR_ORDER[(seed + 3) % ATTR_ORDER.length];
  const team = seed % 2 === 0 ? "오리지널" : "엘리멘탈";
  const unitType = seed % 3 === 0 ? "hero" : "merc";
  const localNames = ["아르곤", "에일린", "도윤", "세피아", "라크", "유나", "하운드", "리엔", "카이로", "미스트"];
  const name = `${localNames[seed % localNames.length]}-${randInt(11, 99)}`;
  const unit = createUnitSpec({ name, team, unitType, index: 700 + seed });
  unit.roleClass = role;
  unit.classType = role;
  unit.rangeClass = range;
  unit.attribute = attr;
  unit.color = getAttributeColor(attr);
  unit.ability = `${classAbility(role)} / ${ATTRIBUTE_META[attr]?.effect || "속성 효과 없음"}`;
  unit.level = randInt(2, 5);
  unit.deployed = false;
  unit.id = `field-${unitType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  unit.sourceId = `field-reward-${Date.now()}-${seed}`;
  return unit;
}

function buildFieldAllyCombatUnit(rewardUnit, x, y, idx = 0) {
  const melee = createItemIconLoadout("melee", rewardUnit) || { range: 1.8, atk: 9, attackSpeed: 1, weaponType: "소드" };
  const firearm = createItemIconLoadout("firearm", rewardUnit) || { range: 3.1, atk: 9, attackSpeed: 1, weaponType: "AR" };
  const hp = 135 + rewardUnit.hp + randInt(0, 30);
  return {
    id: `ally-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
    rewardUnit,
    isFieldAlly: true,
    x,
    y,
    spawnX: x,
    spawnY: y,
    r: 12,
    color: rewardUnit.color || "#79d4a8",
    attrColor: getAttributeColor(rewardUnit.attribute),
    name: rewardUnit.name,
    moveX: x,
    moveY: y,
    targetX: x,
    targetY: y,
    path: [],
    velX: 0,
    velY: 0,
    faceAngle: -Math.PI / 2,
    hp,
    maxHp: hp,
    atk: Math.round((rewardUnit.atk || 20) * 1.08),
    def: Math.round((rewardUnit.def || 8) * 1.05),
    speed: Math.round(95 + (rewardUnit.speed || 14) * 3.2),
    meleeRange: Math.round((melee.range || 1.8) * 66),
    firearmRange: Math.round((firearm.range || 3) * 74),
    meleeDmg: Math.max(6, Math.round((melee.atk || 8) + rewardUnit.atk * 0.55)),
    firearmDmg: Math.max(6, Math.round((firearm.atk || 8) + rewardUnit.atk * 0.58)),
    meleeType: melee.weaponType || "소드",
    firearmType: firearm.weaponType || "AR",
    meleeCd: Math.max(0.24, 0.95 / (melee.attackSpeed || 1)),
    firearmCd: Math.max(0.22, 0.88 / (firearm.attackSpeed || 1)),
    attackCd: 0,
    aggroRange: 420,
    patrolRange: 140,
    lastDamagedAt: 0,
  };
}

function randomFacilityPoint(margin = 220) {
  let x = margin + Math.random() * Math.max(1, mission.worldW - margin * 2);
  let y = margin + Math.random() * Math.max(1, mission.worldH - margin * 2);
  for (let i = 0; i < 20; i += 1) {
    const blocked = (mission.obstacles || []).some((o) =>
      x >= o.x - margin * 0.24 && x <= o.x + o.w + margin * 0.24 && y >= o.y - margin * 0.24 && y <= o.y + o.h + margin * 0.24);
    const startBlocked = pointInMissionStartSafeZone(x, y, mission.worldW, mission.worldH, 34);
    if (!blocked && !startBlocked) break;
    x = margin + Math.random() * Math.max(1, mission.worldW - margin * 2);
    y = margin + Math.random() * Math.max(1, mission.worldH - margin * 2);
  }
  return missionClamp(x, y);
}

function purgeStartZoneMissionObjects() {
  mission.obstacles = (mission.obstacles || []).filter((o) =>
    !rectIntersectsMissionStartSafeZone(o.x, o.y, o.w, o.h, mission.worldW, mission.worldH, 16));
  mission.fieldShops = (mission.fieldShops || []).filter((s) =>
    !pointInMissionStartSafeZone(s.x, s.y, mission.worldW, mission.worldH, (s.r || 0) + 22));
  mission.freeLootNodes = (mission.freeLootNodes || []).filter((n) =>
    !pointInMissionStartSafeZone(n.x, n.y, mission.worldW, mission.worldH, (n.r || 0) + 16));
  mission.alliedUnits = (mission.alliedUnits || []).filter((a) =>
    !pointInMissionStartSafeZone(a.x, a.y, mission.worldW, mission.worldH, (a.r || 0) + 18));
  mission.rareMines = (mission.rareMines || []).filter((m) =>
    !pointInMissionStartSafeZone(m.x, m.y, mission.worldW, mission.worldH, (m.r || 0) + 20));
}

function spawnMissionFacilities(region, planet) {
  mission.fieldShops = [];
  mission.freeLootNodes = [];
  mission.alliedUnits = [];
  mission.rareMines = [];
  mission.extraResourceDrops = {};
  mission.recruitedFromField = [];
  const diff = Math.max(1, region?.difficulty || 1);
  const restoredBoost = region?.restored ? 1 : 0;
  const restoreRate = getRestoreRate(planet);
  const diffMeta = getDifficultyMeta();
  const debtDropMul = getDebtDropRateMultiplier();
  const facilityFactor = clamp((0.35 + restoreRate * 0.95 + restoredBoost * 0.25) * diffMeta.facilityScale, 0.2, 1.85);
  const shopCount = Math.max(1, Math.round((0.9 + restoredBoost * 0.9) * facilityFactor));
  const lootCount = Math.max(1, Math.round((4 + diff * 0.8 + restoredBoost * 2) * facilityFactor * debtDropMul));
  const allyCount = Math.max(1, Math.round((0.8 + Math.floor(diff / 4) + restoredBoost) * facilityFactor));
  const mineCount = Math.max(1, Math.round((1.6 + Math.floor(diff / 3) + restoredBoost) * facilityFactor));

  const itemPool = [...createWeaponCatalog().slice(0, 36), ...createGearCatalog().slice(0, 20)];
  for (let i = 0; i < shopCount; i += 1) {
    const pos = randomFacilityPoint(280);
    const stock = [];
    for (let k = 0; k < 3; k += 1) {
      const picked = pickRandom(itemPool);
      if (!picked) continue;
      stock.push({ ...picked, id: `shop-item-${Date.now()}-${i}-${k}` });
    }
    mission.fieldShops.push({
      id: `shop-${i}-${Date.now()}`,
      x: pos.x,
      y: pos.y,
      r: 62,
      name: `현장 상점-${i + 1}`,
      stock,
      used: false,
    });
  }

  for (let i = 0; i < lootCount; i += 1) {
    const pos = randomFacilityPoint(180);
    const item = pickRandom(itemPool);
    if (!item) continue;
    mission.freeLootNodes.push({
      id: `loot-${i}-${Date.now()}`,
      x: pos.x,
      y: pos.y,
      r: 20,
      icon: i % 2 === 0 ? "🎁" : "🧰",
      item: { ...item, id: `free-loot-${Date.now()}-${i}` },
      picked: false,
    });
  }

  for (let i = 0; i < allyCount; i += 1) {
    const pos = randomFacilityPoint(300);
    const rewardUnit = makeFieldRewardUnit(i + diff * 5);
    const ally = buildFieldAllyCombatUnit(rewardUnit, pos.x + randInt(-24, 24), pos.y + randInt(-24, 24), i);
    mission.alliedUnits.push(ally);
  }

  const primaryResource = getPlanetResourceId(planet);
  for (let i = 0; i < mineCount; i += 1) {
    const pos = randomFacilityPoint(260);
    const usePrimary = i % 2 === 0;
    const resourceId = usePrimary ? primaryResource : (Math.random() < 0.5 ? "void_relay" : "terra_core");
    const reward = 24 + diff * 8 + randInt(0, 18);
    mission.rareMines.push({
      id: `mine-${i}-${Date.now()}`,
      x: pos.x,
      y: pos.y,
      r: 26,
      hp: 140 + diff * 55,
      maxHp: 140 + diff * 55,
      isResourceNode: true,
      capturable: false,
      name: `${RESOURCE_DEFS[resourceId]?.name || "희귀"} 채굴소`,
      resourceId,
      reward,
      broken: false,
    });
  }
}

function grantFieldAllyRecruitmentOnSuccess() {
  if (!Array.isArray(mission.alliedUnits) || !mission.alliedUnits.length) return [];
  const recruits = [];
  const catalog = getUnitCodexCatalog();
  mission.alliedUnits.forEach((a) => {
    if (!a?.rewardUnit || a.hp <= 0) return;
    let unit = { ...a.rewardUnit };
    const ensuredKey = getUnitCodexKey(unit);
    if (!ensuredKey || !catalog.some((r) => r.key === ensuredKey)) {
      const rewardType = a.rewardUnit.unitType === "merc" ? "merc" : "hero";
      const pool = catalog.filter((r) => (rewardType === "merc" ? r.unitType === "merc" : r.unitType !== "merc"));
      const row = pickRandom(pool);
      if (!row) return;
      unit = buildPlayableUnitFromCodexRow(row, Math.floor(Math.random() * 90000));
    }
    unit.id = `${unit.id || unit.codexKey || "field"}-owned-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    unit.deployed = false;
    if (unit.unitType === "hero") state.heroes.push(unit);
    else state.mercs.push(unit);
    recruits.push(unit);
  });
  mission.recruitedFromField = recruits.map((u) => `${u.name}(${u.unitType === "hero" ? "히어로" : "용병"})`);
  return recruits;
}

function grantSalvagedMechsIntoRoster() {
  const salvageCount = Math.max(0, Number(mission.salvagedMechs?.length || 0));
  if (!salvageCount) return [];
  const catalog = getMechCodexCatalog();
  const granted = [];
  const idSet = new Set((state.mechs || []).map((m) => m.id));
  for (let i = 0; i < salvageCount; i += 1) {
    const row = pickRandom(catalog);
    if (!row) continue;
    const mech = buildPlayableMechFromCodexRow(row, i, idSet);
    mech.id = `${mech.id || "salvage-mech"}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    idSet.add(mech.id);
    mech.unlocked = true;
    state.mechs.push(mech);
    granted.push(mech);
  }
  return granted;
}

function getNearestInteractableFieldShop() {
  const shops = (mission.fieldShops || []).filter((s) => s && !s.used);
  if (!shops.length || !mission.units?.length) return null;
  let best = null;
  let bestDist = Infinity;
  shops.forEach((s) => {
    mission.units.forEach((u) => {
      const d = Math.hypot(u.x - s.x, u.y - s.y);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    });
  });
  if (!best) return null;
  if (bestDist > best.r + 64) return null;
  return { shop: best, dist: bestDist };
}

function interactNearestFieldShop() {
  if (!mission.running || mission.phase !== "battle") return;
  const hit = getNearestInteractableFieldShop();
  if (!hit || !hit.shop) {
    showActionToast("근처에 상호작용 가능한 임시 상점이 없습니다. (F)", "success");
    return;
  }
  const shop = hit.shop;
  const lines = (shop.stock || []).map((it, idx) => {
    const cost = 80 + Math.round((it.grade || 1) * 20);
    return `${idx + 1}. ${it.name} (${cost} 크레딧)`;
  });
  const pickRaw = window.prompt(`[${shop.name}] 구매할 번호를 입력하세요.\n0: 나가기\n${lines.join("\n")}`, "1");
  if (pickRaw == null) return;
  const pick = Number(pickRaw);
  if (!Number.isFinite(pick) || pick < 0 || pick > (shop.stock || []).length) {
    showActionToast("잘못된 번호입니다.", "success");
    return;
  }
  if (pick === 0) return;
  const item = shop.stock[pick - 1];
  if (!item) return;
  const cost = 80 + Math.round((item.grade || 1) * 20);
  if (!state.settings.infinite && state.credits < cost) {
    showActionToast("크레딧이 부족합니다.", "success");
    return;
  }
  if (!state.settings.infinite) state.credits -= cost;
  mission.foundItems.push({ ...item, id: `${item.id}-${Date.now()}` });
  shop.used = true;
  missionFx("skill", { x: shop.x, y: shop.y, r: 64, color: "#ffe08a" }, 0.34);
  updateTopbar();
  showActionToast(`${shop.name}에서 ${item.name} 구매 완료`, "success");
}

function applyDamageToMine(mine, amount, hitColor = "#bff77c") {
  if (!mine || mine.broken) return 0;
  const dmg = Math.max(1, Math.round(amount || 0));
  mine.hp -= dmg;
  missionFx("hit", { x: mine.x, y: mine.y, r: 18, color: hitColor }, 0.18);
  if (mine.hp <= 0) {
    mine.broken = true;
    mission.extraResourceDrops[mine.resourceId] = (mission.extraResourceDrops[mine.resourceId] || 0) + mine.reward;
    missionFx("explosion", { x: mine.x, y: mine.y, r: 56, color: "#cbff95" }, 0.45);
  }
  return dmg;
}

function isHazardObstacleType(type = "") {
  return [
    "lava_ore",
    "ice_spike",
    "void_crystal",
    "acid_pool",
    "storm_spire",
    "electro_pillar",
    "aqua_vent",
    "sonic_rock",
    "gravity_well",
    "flash_prism",
    "smoke_vent",
  ].includes(type);
}

function applyMissionHazardDamageToUnit(unit, dt) {
  if (!unit || unit.hp <= 0) return;
  if (unit.isMech || (unit.mechId && !unit.mechBroken) || unit.ridingMechId) return;
  const touchHazard = (mission.obstacles || []).find((o) => {
    if (!o || !isHazardObstacleType(o.type)) return false;
    const pad = Math.max(6, unit.r * 0.55);
    return unit.x >= o.x - pad && unit.x <= o.x + o.w + pad && unit.y >= o.y - pad && unit.y <= o.y + o.h + pad;
  });
  if (!touchHazard) {
    unit.hazardTick = 0;
    return;
  }
  unit.hazardTick = (unit.hazardTick || 0) + dt;
  if (unit.hazardTick < 0.45) return;
  unit.hazardTick = 0;
  const dmg = Math.max(3, Math.round((unit.maxHp || 120) * 0.018));
  unit.hp -= dmg;
  markUnitDamaged(unit);
  missionFx("hit", {
    x: unit.x,
    y: unit.y,
    r: 16,
    color:
      touchHazard.type === "lava_ore" ? "#ff7d4a"
        : touchHazard.type === "ice_spike" ? "#9ee8ff"
          : touchHazard.type === "acid_pool" ? "#9cff6a"
            : touchHazard.type === "storm_spire" ? "#a5ffe9"
              : touchHazard.type === "electro_pillar" ? "#ffe56f"
                : touchHazard.type === "aqua_vent" ? "#6bc2ff"
                  : touchHazard.type === "sonic_rock" ? "#ffb26f"
                    : touchHazard.type === "gravity_well" ? "#b38cff"
                      : touchHazard.type === "flash_prism" ? "#f6f6ff"
                        : touchHazard.type === "smoke_vent" ? "#a0a8b6"
                          : "#c89fff",
  }, 0.18);
}

function castSkillCard(skill, wx, wy, options = {}) {
  if (!skill || skill.remain > 0) return false;
  const owner = mission.units.find((u) => u.id === skill.ownerId) || mission.units[0] || null;
  if (!owner || owner.hp <= 0) return false;
  const x = clamp(wx, 0, mission.worldW);
  const y = clamp(wy, 0, mission.worldH);
  const castRange = Math.max(60, Number(skill.castRange || owner.firearmRange || 220));
  const ownerDist = Math.hypot(x - owner.x, y - owner.y);
  if (ownerDist > castRange) {
    if (!options.silentFail) showActionToast(`${owner.name} 스킬 사거리 밖입니다.`, "success");
    return false;
  }
  missionFx("skill", { x, y, r: skill.radius, color: skill.color }, 0.5);
  if (skill.kind === "heal") {
    mission.units.forEach((u) => {
      if (Math.hypot(u.x - x, u.y - y) <= skill.radius) u.hp = Math.min(u.maxHp, u.hp + skill.power);
    });
  } else {
    mission.enemies.forEach((e) => {
      const d = Math.hypot(e.x - x, e.y - y);
      if (d <= skill.radius) applyDamageToEnemy(e, Math.round(skill.power * (1 - d / Math.max(1, skill.radius * 1.2))), "skill");
      if (skill.kind === "core" && d <= skill.radius * 0.7) applyDamageToEnemy(e, Math.round(skill.power * 0.6), "skill");
    });
    mission.rareMines?.forEach((m) => {
      if (m.broken) return;
      const d = Math.hypot(m.x - x, m.y - y);
      if (d > skill.radius) return;
      applyDamageToMine(m, Math.round(skill.power * 0.45), "#d6f2a2");
    });
  }
  const nowMs = Date.now();
  skill.readyAt = nowMs + Math.round(skill.cooldown * 1000);
  skill.remain = Math.max(0, (skill.readyAt - nowMs) / 1000);
  refreshMissionSkillCooldownUi();
  return true;
}

function updateMission(dt) {
  refreshMissionSkillCooldownUi();
  mission.freeLootNodes?.forEach((n) => {
    if (n.picked) return;
    const near = mission.units.some((u) => Math.hypot(u.x - n.x, u.y - n.y) <= n.r + u.r + 12);
    if (!near) return;
    n.picked = true;
    mission.foundItems.push({ ...n.item, id: `${n.item.id}-${Date.now()}` });
    missionFx("skill", { x: n.x, y: n.y, r: 42, color: "#a8f0ff" }, 0.26);
  });
  const nearShop = getNearestInteractableFieldShop();
  mission.nearFieldShopId = nearShop?.shop?.id || null;
  mission.units.forEach((u) => {
    const wp = u.path && u.path.length ? u.path[0] : { x: u.moveX, y: u.moveY };
    const dx = wp.x - u.x;
    const dy = wp.y - u.y;
    const md = Math.hypot(dx, dy);
    let desiredFace = u.faceAngle ?? -Math.PI / 2;
    if (md > 2) {
      const step = u.speed * dt;
      if (md <= step + 1.5) {
        u.x = wp.x;
        u.y = wp.y;
        u.velX = (u.velX || 0) * 0.2;
        u.velY = (u.velY || 0) * 0.2;
        if (u.path && u.path.length) {
          u.path.shift();
          if (u.path[0]) {
            u.moveX = u.path[0].x;
            u.moveY = u.path[0].y;
          } else {
            u.moveX = u.x;
            u.moveY = u.y;
          }
        }
      } else {
        const tx = dx / md;
        const ty = dy / md;
        const desX = tx * u.speed;
        const desY = ty * u.speed;
        const blend = clamp(dt * 7.5, 0, 1);
        u.velX = (u.velX || 0) + (desX - (u.velX || 0)) * blend;
        u.velY = (u.velY || 0) + (desY - (u.velY || 0)) * blend;
        u.x += u.velX * dt;
        u.y += u.velY * dt;
        desiredFace = Math.atan2(ty, tx);
      }
    } else {
      u.velX = (u.velX || 0) * Math.max(0, 1 - dt * 10);
      u.velY = (u.velY || 0) * Math.max(0, 1 - dt * 10);
    }
    applyMissionHazardDamageToUnit(u, dt);
    const pushed = pushOutFromObstacles({ x: u.x, y: u.y }, Math.max(10, u.r));
    const p = missionClamp(pushed.x, pushed.y);
    u.x = p.x;
    u.y = p.y;
    const moved = Math.hypot(u.x - (u.lastPosX || u.x), u.y - (u.lastPosY || u.y));
    if (md > 14 && moved < Math.max(0.8, u.speed * dt * 0.18)) u.stuckTime = (u.stuckTime || 0) + dt;
    else u.stuckTime = Math.max(0, (u.stuckTime || 0) - dt * 0.75);
    if (u.stuckTime > 0.65) {
      const goal = { x: u.targetX ?? u.moveX, y: u.targetY ?? u.moveY };
      const newPath = computeUnitPath({ x: u.x, y: u.y }, goal, Math.max(16, u.r + 5));
      u.path = newPath;
      if (u.path[0]) {
        u.moveX = u.path[0].x;
        u.moveY = u.path[0].y;
      }
      u.stuckTime = 0;
    }
    u.lastPosX = u.x;
    u.lastPosY = u.y;
    u.attackCd -= dt;
    const pick = pickBestEnemyTargetForUnit(u);
    const nearest = pick.target;
    const dist = pick.dist;
    const noDamageFor = (mission.elapsed || 0) - (u.lastDamagedAt || 0);
    if (noDamageFor >= (u.regenDelay || 4.5)) {
      if (u.hp < u.maxHp) {
        u.hp = Math.min(u.maxHp, u.hp + (u.regenHpPerSec || 4) * dt);
      }
    }
    if (nearest && u.attackCd <= 0) {
      desiredFace = Math.atan2(nearest.y - u.y, nearest.x - u.x);
      if (dist <= u.meleeRange) {
        if (nearest.isResourceNode) applyDamageToMine(nearest, u.meleeDmg, u.attrColor);
        else applyDamageToEnemy(nearest, u.meleeDmg, "melee");
        const ang = Math.atan2(nearest.y - u.y, nearest.x - u.x);
        missionFx("melee", { x: u.x, y: u.y, r: Math.max(24, u.meleeRange * 0.34), color: u.attrColor, a0: ang - 0.75, a1: ang + 0.75 }, 0.28);
        missionFx("hit", { x: nearest.x, y: nearest.y, r: 26, color: u.attrColor }, 0.2);
        u.attackCd = u.meleeCd;
      } else if (dist <= u.firearmRange) {
        if (!nearest.isResourceNode) nearest.alert = true;
        const shotColor = u.firearmType === "RL" ? "#ffcf66" : u.attrColor;
        if (u.firearmType === "SG") {
          for (let k = 0; k < 4; k += 1) {
            const spreadTarget = {
              id: `${nearest.id}-sg-${k}`,
              x: nearest.x + randInt(-26, 26),
              y: nearest.y + randInt(-26, 26),
            };
            spawnProjectile(u, spreadTarget, {
              speed: 650,
              radius: 2.6,
              dmg: Math.max(1, Math.round(u.firearmDmg * 0.38)),
              color: shotColor,
              life: 0.45,
            });
          }
        } else {
          spawnProjectile(u, nearest, {
            speed: u.firearmType === "RL" ? 380 : u.firearmType === "SR" ? 820 : u.firearmType === "DMR" ? 760 : 640,
            radius: u.firearmType === "RL" ? 6.5 : u.firearmType === "SR" ? 4.8 : 4.2,
            dmg: u.firearmDmg,
            color: shotColor,
            explosive: u.firearmType === "RL",
            homing: u.firearmType === "RL",
            arc: u.firearmType === "RL",
            arcHeight: u.firearmType === "RL" ? 42 : 0,
            pierce: u.firearmType === "SR" ? 2 : u.firearmType === "DMR" || u.firearmType === "LMG" ? 1 : 0,
            life: u.firearmType === "RL" ? 1.8 : 1.2,
          });
        }
        u.attackCd = u.firearmCd;
      }
    }
    syncMissionMechOutcome(u);
    u.faceAngle = lerpAngle(u.faceAngle ?? -Math.PI / 2, desiredFace, dt * (nearest ? 12 : 8));
  });

  mission.alliedUnits?.forEach((u) => {
    if (u.hp <= 0) return;
    const pick = pickBestEnemyTargetForUnit(u);
    const nearest = pick.target;
    const dist = pick.dist;
    u.attackCd -= dt;
    let desiredFace = u.faceAngle ?? -Math.PI / 2;
    if (nearest) {
      desiredFace = Math.atan2(nearest.y - u.y, nearest.x - u.x);
      if (dist > Math.max(u.meleeRange * 0.85, u.firearmRange * 0.62)) {
        const tx = nearest.x - (nearest.x - u.x) * 0.28;
        const ty = nearest.y - (nearest.y - u.y) * 0.28;
        const dx = tx - u.x;
        const dy = ty - u.y;
        const dm = Math.hypot(dx, dy) || 1;
        u.x += (dx / dm) * u.speed * dt;
        u.y += (dy / dm) * u.speed * dt;
      }
      if (u.attackCd <= 0) {
        if (dist <= u.meleeRange) {
          if (nearest.isResourceNode) applyDamageToMine(nearest, u.meleeDmg, u.attrColor);
          else applyDamageToEnemy(nearest, u.meleeDmg, "ally-melee");
          missionFx("melee", { x: u.x, y: u.y, r: Math.max(20, u.meleeRange * 0.3), color: u.attrColor, a0: desiredFace - 0.8, a1: desiredFace + 0.8 }, 0.22);
          u.attackCd = u.meleeCd;
        } else if (dist <= u.firearmRange) {
          spawnProjectile(u, nearest, {
            speed: 620,
            radius: 3.8,
            dmg: u.firearmDmg,
            color: u.attrColor,
            life: 1,
          });
          missionFx("shot", { x1: u.x, y1: u.y, x2: nearest.x, y2: nearest.y, color: u.attrColor, w: 2.2 }, 0.1);
          u.attackCd = u.firearmCd;
        }
      }
    } else {
      const dx = u.spawnX - u.x;
      const dy = u.spawnY - u.y;
      const dm = Math.hypot(dx, dy) || 1;
      if (dm > 8) {
        u.x += (dx / dm) * Math.min(44, u.speed * 0.6) * dt;
        u.y += (dy / dm) * Math.min(44, u.speed * 0.6) * dt;
      }
    }
    const p = missionClamp(u.x, u.y);
    u.x = p.x;
    u.y = p.y;
    u.faceAngle = lerpAngle(u.faceAngle ?? -Math.PI / 2, desiredFace, dt * 9);
  });

  mission.enemies.forEach((e) => {
    let t = null;
    let td = Infinity;
    [...mission.units, ...(mission.alliedUnits || [])].forEach((u) => {
      if (u.hp <= 0) return;
      const d = Math.hypot(u.x - e.x, u.y - e.y);
      if (d < td) { td = d; t = u; }
    });
    if (!t) return;
    if (e.isBoss) {
      if (!e.bossPhase) e.bossPhase = 1;
      const hpRate = e.maxHp > 0 ? e.hp / e.maxHp : 1;
      if (e.bossPhase === 1 && hpRate <= 0.7) {
        e.bossPhase = 2;
        e.atk = Math.round(e.atk * 1.16);
        e.speed = Math.round(e.speed * 1.08);
        e.resist = Math.min(0.45, (e.resist || 0) + 0.04);
        missionFx("skill", { x: e.x, y: e.y, r: 220, color: e.palette || "#ffb0e5" }, 0.45);
        setBossPhaseText(`PHASE 2 - ${e.archetype || "BOSS"} 각성`, 2.4);
      } else if (e.bossPhase === 2 && hpRate <= 0.35) {
        e.bossPhase = 3;
        e.atk = Math.round(e.atk * 1.2);
        e.speed = Math.round(e.speed * 1.1);
        e.resist = Math.min(0.5, (e.resist || 0) + 0.06);
        missionFx("explosion", { x: e.x, y: e.y, r: 260, color: e.palette || "#ff9f7f" }, 0.5);
        setBossPhaseText(`PHASE 3 - ${e.realName} 폭주`, 2.8);
      }
    }
    const inAggro = td <= (e.aggroRange || 220);
    const shouldChase = e.isBoss ? inAggro : (e.alert || inAggro);
    if (!e.isBoss && !shouldChase) {
      const dxBack = e.spawnX - e.x;
      const dyBack = e.spawnY - e.y;
      const dmBack = Math.hypot(dxBack, dyBack) || 1;
      if (Math.hypot(dxBack, dyBack) > 8) {
        e.x += (dxBack / dmBack) * Math.min(42, e.speed * 0.75) * dt;
        e.y += (dyBack / dmBack) * Math.min(42, e.speed * 0.75) * dt;
      }
      return;
    }
    if (e.isBoss && !inAggro) return;

    const dx = t.x - e.x;
    const dy = t.y - e.y;
    const dm = Math.hypot(dx, dy) || 1;
    let dirX = dx / dm;
    let dirY = dy / dm;
    const style = e.attackStyle || "skirmish";
    if (style === "marksman" && dm < 180) {
      dirX *= -0.85;
      dirY *= -0.85;
    } else if (style === "controller" && dm < 140) {
      dirX *= -0.65;
      dirY *= -0.65;
    } else if (style === "assassin" && dm < 220 && Math.random() < 0.12) {
      dirX *= 1.7;
      dirY *= 1.7;
    } else if (style === "heavy") {
      dirX *= 0.88;
      dirY *= 0.88;
    }
    e.x += dirX * e.speed * dt;
    e.y += dirY * e.speed * dt;
    if (e.isBoss) {
      const lx = e.x - e.spawnX;
      const ly = e.y - e.spawnY;
      const lm = Math.hypot(lx, ly) || 1;
      const limit = e.leashRadius || 260;
      if (lm > limit) {
        e.x = e.spawnX + (lx / lm) * limit;
        e.y = e.spawnY + (ly / lm) * limit;
      }
    }
    e.touchCd -= dt;
    e.attackCd -= dt;
    if (e.isBoss) {
      runFinalBossPattern(e, t, dt);
    }
    const canRanged = !e.isBoss && (Math.random() < Math.max(0.08, e.rangedBias || (e.isMidBoss ? 0.62 : e.named ? 0.48 : 0.2)));
    if (canRanged && td <= 240 && e.attackCd <= 0) {
      spawnProjectile(e, t, {
        speed: 460,
        radius: 4.6,
        dmg: Math.max(2, Math.round(e.atk * 0.45) - Math.round(t.def * 0.35)),
        color: e.isMidBoss ? "#ff9c57" : "#ff6f6f",
        fromEnemy: true,
        homing: false,
        turnRate: 0,
        life: 0.9,
      });
      missionFx("shot", { x1: e.x, y1: e.y, x2: t.x, y2: t.y, color: "#ff6f6f", w: 2.8 }, 0.12);
      e.attackCd = e.isMidBoss ? 1.1 : 1.5;
    }
    if (td <= e.r + t.r + 4 && e.touchCd <= 0) {
      const ang = Math.atan2(t.y - e.y, t.x - e.x);
      missionFx("melee", { x: e.x, y: e.y, r: Math.max(16, (e.r + 10) * 1.2), color: "#ff8a8a", a0: ang - 0.7, a1: ang + 0.7 }, 0.22);
      if (!isGodModeActive()) {
        if (t.hasDefense && Math.random() < 0.32) {
          missionFx("shield", { x: t.x, y: t.y, r: t.r + 14, color: "#9cd1ff" }, 0.2);
          e.touchCd = 0.45;
          return;
        }
        const dmg = Math.max(1, e.atk - t.def);
        if (t.isMech && !t.mechBroken && t.mechHp > 0) {
          t.mechHp -= dmg;
          markUnitDamaged(t);
          if (t.mechHp <= 0) {
            t.mechBroken = true;
            t.mechDestroyedThisMission = true;
            t.r = 12;
            t.speed = Math.max(70, Math.round((t.baseSpeed || t.speed) * 0.72));
            missionFx("break", { x: t.x, y: t.y, r: 56, color: "#ff7f7f" }, 0.4);
          }
          syncMissionMechOutcome(t);
        } else {
          t.hp -= dmg;
          markUnitDamaged(t);
        }
      }
      e.touchCd = 0.55;
      e.alert = true;
    }
  });

  for (let i = mission.projectiles.length - 1; i >= 0; i -= 1) {
    const p = mission.projectiles[i];
    if (p.homing) {
      const target = p.fromEnemy
        ? mission.units.find((u) => u.id === p.targetId)
        : (mission.enemies.find((e) => e.id === p.targetId) || (mission.rareMines || []).find((m) => m.id === p.targetId && !m.broken));
      if (target) {
        const ddx = target.x - p.x;
        const ddy = target.y - p.y;
        const dm = Math.hypot(ddx, ddy) || 1;
        const speed = Math.hypot(p.vx, p.vy) || 1;
        const nx = (ddx / dm) * speed;
        const ny = (ddy / dm) * speed;
        const t = clamp(dt * (p.turnRate || 5.4), 0, 1);
        p.vx = p.vx + (nx - p.vx) * t;
        p.vy = p.vy + (ny - p.vy) * t;
      }
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    let remove = false;
    if (p.fromEnemy) {
      for (let j = 0; j < mission.units.length; j += 1) {
        const u = mission.units[j];
        if (p.hitIds?.[u.id]) continue;
        const d = Math.hypot(u.x - p.x, u.y - p.y);
        if (d <= u.r + p.radius) {
          p.hitIds[u.id] = true;
          if (!isGodModeActive()) {
            if (u.hasDefense && Math.random() < 0.28) {
              missionFx("shield", { x: u.x, y: u.y, r: u.r + 14, color: "#9cd1ff" }, 0.2);
            } else if (u.isMech && !u.mechBroken && u.mechHp > 0) {
              u.mechHp -= p.dmg;
              markUnitDamaged(u);
              if (u.mechHp <= 0) {
                u.mechBroken = true;
                u.mechDestroyedThisMission = true;
                u.r = 12;
                u.speed = Math.max(70, Math.round((u.baseSpeed || u.speed) * 0.72));
                missionFx("break", { x: u.x, y: u.y, r: 56, color: "#ff7f7f" }, 0.4);
              }
              syncMissionMechOutcome(u);
            } else {
              u.hp -= p.dmg;
              markUnitDamaged(u);
            }
          }
          missionFx("hit", { x: p.x, y: p.y, r: p.explosive ? 34 : 20, color: p.color }, 0.2);
          if (p.explosive) missionFx("explosion", { x: p.x, y: p.y, r: 36, color: p.color }, 0.32);
          if (p.pierce > 0) p.pierce -= 1;
          else {
            remove = true;
            break;
          }
        }
      }
      if (!remove) {
        for (let j = 0; j < (mission.alliedUnits || []).length; j += 1) {
          const a = mission.alliedUnits[j];
          if (!a || a.hp <= 0) continue;
          if (p.hitIds?.[a.id]) continue;
          const d = Math.hypot(a.x - p.x, a.y - p.y);
          if (d <= a.r + p.radius) {
            p.hitIds[a.id] = true;
            const dmg = Math.max(1, p.dmg - Math.round((a.def || 0) * 0.45));
            a.hp -= dmg;
            missionFx("hit", { x: p.x, y: p.y, r: 18, color: p.color || "#ff9a9a" }, 0.16);
            if (p.pierce > 0) p.pierce -= 1;
            else {
              remove = true;
              break;
            }
          }
        }
      }
    } else {
      for (let j = 0; j < mission.enemies.length; j += 1) {
        const e = mission.enemies[j];
        if (p.hitIds?.[e.id]) continue;
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d <= e.r + p.radius) {
          p.hitIds[e.id] = true;
          applyDamageToEnemy(e, p.dmg, "projectile");
          missionFx("hit", { x: p.x, y: p.y, r: p.explosive ? 34 : 20, color: p.color }, 0.2);
          if (p.explosive) {
            missionFx("explosion", { x: p.x, y: p.y, r: 36, color: p.color }, 0.32);
            mission.enemies.forEach((aoe) => {
              const ad = Math.hypot(aoe.x - p.x, aoe.y - p.y);
              if (ad <= 70) applyDamageToEnemy(aoe, Math.max(1, Math.round(p.dmg * 0.52)), "explosion");
            });
          }
          if (p.pierce > 0) p.pierce -= 1;
          else {
            remove = true;
            break;
          }
        }
      }
      if (!remove) {
        for (let j = 0; j < (mission.rareMines || []).length; j += 1) {
          const m = mission.rareMines[j];
          if (!m || m.broken) continue;
          const d = Math.hypot(m.x - p.x, m.y - p.y);
          if (d <= m.r + p.radius) {
            applyDamageToMine(m, Math.max(1, Math.round(p.dmg * 0.72)), "#bff77c");
            remove = true;
            break;
          }
        }
      }
    }
    if (remove || p.life <= 0 || p.x < 0 || p.y < 0 || p.x > mission.worldW || p.y > mission.worldH) {
      mission.projectiles.splice(i, 1);
    }
  }

  for (let i = mission.enemies.length - 1; i >= 0; i -= 1) {
    const e = mission.enemies[i];
    if (e.hp > 0) continue;
    mission.killedEnemies += 1;
    if ((e.isBoss || e.isMidBoss) && (e.revivesLeft || 0) > 0) {
      e.revivesLeft -= 1;
      e.hp = Math.max(1, Math.round(e.maxHp * (e.isBoss ? 0.65 : 0.56)));
      const rebornShield = Math.round((e.maxShield || e.maxHp * 0.3) * 0.7);
      e.shield = Math.max(e.shield || 0, rebornShield);
      e.alert = true;
      mission.killedEnemies = Math.max(0, mission.killedEnemies - 1);
      missionFx("explosion", { x: e.x, y: e.y, r: e.isBoss ? 190 : 120, color: e.palette || "#f8b0ff" }, 0.45);
      if (e.isBoss) setBossPhaseText(`${e.realName} 부활 - 추격 재개`, 2.6);
      continue;
    }
    if (e.isBoss) {
      mission.capturedVillains.push(createCapturedVillainRecord({
        id: `boss-${Date.now()}`,
        tier: "finalboss",
        title: e.title || "최종 보스",
        realName: e.realName,
        value: 1600,
        archetype: e.archetype,
        attackStyle: e.attackStyle,
        palette: e.palette,
        planetId: e.planetId || mission.planetId || "",
        faction: e.faction || "",
        mercCodexKey: e.mercCodexKey || "",
      }));
      mission.enemies.splice(i, 1);
      if (mission.infiniteMode) {
        spawnInfiniteReplacementBoss();
        continue;
      }
      endMission(true, `${e.name} 체포 완료`, false);
      return;
    }
    if (Math.random() < (e.named ? 0.65 : 0.22)) {
      mission.capturedVillains.push(createCapturedVillainRecord({
        id: `v-${Date.now()}-${i}`,
        tier: e.isMidBoss ? "midboss" : e.named ? "named" : "normal",
        title: e.title || (e.isMidBoss ? "중간 보스" : e.named ? "네임드 간부" : "전투원"),
        realName: e.realName,
        value: e.isMidBoss ? 980 : e.named ? 680 : 260,
        archetype: e.archetype,
        attackStyle: e.attackStyle,
        palette: e.palette,
        planetId: e.planetId || mission.planetId || "",
        faction: e.faction || "",
        mercCodexKey: e.mercCodexKey || "",
      }));
    }
    const dropMul = getDebtDropRateMultiplier();
    if (Math.random() < 0.09 * dropMul) {
      const pool = [...createWeaponCatalog().slice(0, 32), ...createGearCatalog().slice(0, 18)];
      const p = pool[randInt(0, pool.length - 1)];
      if (p) mission.foundItems.push({ ...p, id: `loot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
    }
    if (Math.random() < 0.05 * dropMul) mission.salvagedMechs.push(`노획 메카-${randInt(1, 99)}`);
    mission.enemies.splice(i, 1);
  }
  for (let i = mission.effects.length - 1; i >= 0; i -= 1) {
    mission.effects[i].life -= dt;
    if (mission.effects[i].life <= 0) mission.effects.splice(i, 1);
  }
  mission.units = mission.units.filter((u) => u.hp > 0);
  mission.alliedUnits = (mission.alliedUnits || []).filter((u) => u.hp > 0);
  if (!mission.units.length) endMission(false, "전원 치명상", false);
}

function drawWeaponGlyph(ctx, x, y, w, h, type, slotType) {
  const t = String(type || "").toUpperCase();
  const cx = x + w * 0.5;
  const cy = y + h * 0.5;
  const stroke = "#e8f2ff";
  ctx.strokeStyle = stroke;
  ctx.fillStyle = stroke;
  ctx.lineWidth = Math.max(1, h * 0.08);
  if (slotType === "firearm") {
    if (t === "RL") {
      ctx.strokeRect(x + w * 0.14, y + h * 0.32, w * 0.62, h * 0.36);
      ctx.beginPath();
      ctx.arc(x + w * 0.82, cy, h * 0.17, 0, Math.PI * 2);
      ctx.stroke();
    } else if (t === "SR" || t === "DMR") {
      ctx.fillRect(x + w * 0.1, y + h * 0.44, w * 0.78, h * 0.14);
      ctx.fillRect(x + w * 0.34, y + h * 0.26, w * 0.22, h * 0.12);
      ctx.fillRect(x + w * 0.46, y + h * 0.58, w * 0.12, h * 0.26);
    } else if (t === "SG") {
      ctx.fillRect(x + w * 0.14, y + h * 0.4, w * 0.7, h * 0.2);
      ctx.fillRect(x + w * 0.24, y + h * 0.6, w * 0.14, h * 0.24);
    } else if (t === "SMG") {
      ctx.fillRect(x + w * 0.16, y + h * 0.4, w * 0.62, h * 0.2);
      ctx.fillRect(x + w * 0.4, y + h * 0.6, w * 0.12, h * 0.24);
    } else if (t === "LMG") {
      ctx.fillRect(x + w * 0.1, y + h * 0.38, w * 0.78, h * 0.2);
      ctx.fillRect(x + w * 0.36, y + h * 0.58, w * 0.12, h * 0.24);
      ctx.fillRect(x + w * 0.12, y + h * 0.6, w * 0.18, h * 0.1);
    } else {
      ctx.fillRect(x + w * 0.12, y + h * 0.42, w * 0.72, h * 0.18);
      ctx.fillRect(x + w * 0.38, y + h * 0.6, w * 0.12, h * 0.24);
    }
    return;
  }
  if (slotType === "melee") {
    if (t === "해머") {
      ctx.fillRect(x + w * 0.28, y + h * 0.2, w * 0.44, h * 0.22);
      ctx.fillRect(x + w * 0.46, y + h * 0.42, w * 0.08, h * 0.44);
    } else if (t === "스피어" || t === "랜스") {
      ctx.fillRect(x + w * 0.47, y + h * 0.2, w * 0.06, h * 0.56);
      ctx.beginPath();
      ctx.moveTo(cx, y + h * 0.08);
      ctx.lineTo(x + w * 0.62, y + h * 0.2);
      ctx.lineTo(x + w * 0.38, y + h * 0.2);
      ctx.closePath();
      ctx.fill();
    } else if (t === "휩") {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.15, y + h * 0.76);
      ctx.bezierCurveTo(x + w * 0.35, y + h * 0.3, x + w * 0.65, y + h * 0.72, x + w * 0.86, y + h * 0.24);
      ctx.stroke();
    } else if (t === "사이즈") {
      ctx.fillRect(x + w * 0.47, y + h * 0.2, w * 0.06, h * 0.58);
      ctx.beginPath();
      ctx.arc(x + w * 0.42, y + h * 0.24, h * 0.16, Math.PI * 0.2, Math.PI * 1.1);
      ctx.stroke();
    } else if (t === "데거") {
      ctx.beginPath();
      ctx.moveTo(cx, y + h * 0.16);
      ctx.lineTo(x + w * 0.62, y + h * 0.5);
      ctx.lineTo(cx, y + h * 0.84);
      ctx.lineTo(x + w * 0.38, y + h * 0.5);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(x + w * 0.44, y + h * 0.14, w * 0.12, h * 0.56);
      ctx.fillRect(x + w * 0.35, y + h * 0.66, w * 0.3, h * 0.08);
    }
    return;
  }
}

function drawWeaponHardpoints(ctx, u, ux, uy, ur, face, sz) {
  const pad = ur + Math.max(sz(20), 18);
  const boxW = Math.max(sz(34), 28);
  const boxH = Math.max(sz(24), 20);
  ctx.save();
  ctx.translate(ux, uy);
  ctx.rotate(face + Math.PI / 2);
  ctx.fillStyle = "rgba(8,18,30,0.98)";
  ctx.strokeStyle = "rgba(220,236,255,0.95)";
  ctx.lineWidth = Math.max(1.4, sz(2));
  ctx.beginPath();
  ctx.rect(pad, -boxH * 0.5, boxW, boxH);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.rect(-pad - boxW, -boxH * 0.5, boxW, boxH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eaf3ff";
  ctx.font = `${Math.max(10, Math.round(sz(11)))}px Segoe UI`;
  const iconPad = Math.max(2, Math.round(sz(2)));
  drawWeaponGlyph(ctx, pad + iconPad, -boxH * 0.5 + iconPad, boxW - iconPad * 2, boxH - iconPad * 2, u.firearmType, "firearm");
  drawWeaponGlyph(ctx, -pad - boxW + iconPad, -boxH * 0.5 + iconPad, boxW - iconPad * 2, boxH - iconPad * 2, u.meleeType, "melee");
  ctx.restore();
  ctx.lineWidth = 1;
}

function drawMission() {
  const ctx = ui.canvas.getContext("2d");
  const drawW = Number(mission.canvasCssW || ui.canvas.clientWidth || ui.canvas.width);
  const drawH = Number(mission.canvasCssH || ui.canvas.clientHeight || ui.canvas.height);
  const dpr = Number(mission.canvasDpr || 1);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, drawW, drawH);
  const camX = mission.camera.x;
  const camY = mission.camera.y;
  const zr = getMissionZoomRange();
  const zoom = clamp(mission.zoom || 1, zr.min, zr.max);
  const viewW = drawW / zoom;
  const viewH = drawH / zoom;
  const sx = (x) => (x - camX) * zoom;
  const sy = (y) => (y - camY) * zoom;
  const sz = (v) => v * zoom;
  const bg = ctx.createLinearGradient(0, 0, 0, drawH);
  const theme = mission.theme || PLANET_THEME_CONFIG.p1;
  bg.addColorStop(0, theme.bgTop || "#3f8647");
  bg.addColorStop(0.52, theme.bgMid || "#c5ad78");
  bg.addColorStop(1, theme.bgBottom || "#3f89b8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, drawW, drawH);

  mission.terrainPatches?.forEach((p) => {
    const tx = p.x - camX;
    const ty = p.y - camY;
    if (tx < -p.r * 2 || ty < -p.r * 2 || tx > viewW + p.r * 2 || ty > viewH + p.r * 2) return;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.ellipse(sx(p.x), sy(p.y), sz(p.r * 1.4), sz(p.r), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = "#0f1c2d";
  for (let x = -(camX % 120); x < viewW; x += 120) {
    const gx = x * zoom;
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, drawH); ctx.stroke();
  }
  for (let y = -(camY % 120); y < viewH; y += 120) {
    const gy = y * zoom;
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(drawW, gy); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  mission.obstacles?.forEach((o) => {
    const tx = sx(o.x);
    const ty = sy(o.y);
    const tw = sz(o.w);
    const th = sz(o.h);
    if (o.type === "tree") ctx.fillStyle = "rgba(38,100,52,0.8)";
    else if (o.type === "rock") ctx.fillStyle = "rgba(98,106,116,0.8)";
    else if (o.type === "lava_ore") ctx.fillStyle = "rgba(170,62,24,0.84)";
    else if (o.type === "ice_spike") ctx.fillStyle = "rgba(126,196,230,0.82)";
    else if (o.type === "void_crystal") ctx.fillStyle = "rgba(92,74,150,0.84)";
    else if (o.type === "acid_pool") ctx.fillStyle = "rgba(64,124,42,0.84)";
    else if (o.type === "storm_spire") ctx.fillStyle = "rgba(74,132,144,0.84)";
    else if (o.type === "electro_pillar") ctx.fillStyle = "rgba(132,114,48,0.84)";
    else if (o.type === "aqua_vent") ctx.fillStyle = "rgba(38,90,142,0.84)";
    else if (o.type === "steel_scrap") ctx.fillStyle = "rgba(112,90,72,0.84)";
    else if (o.type === "sonic_rock") ctx.fillStyle = "rgba(122,84,62,0.84)";
    else if (o.type === "gravity_well") ctx.fillStyle = "rgba(78,62,132,0.84)";
    else if (o.type === "flash_prism") ctx.fillStyle = "rgba(148,156,164,0.84)";
    else if (o.type === "smoke_vent") ctx.fillStyle = "rgba(84,90,100,0.84)";
    else ctx.fillStyle = "rgba(90,76,58,0.78)";
    ctx.fillRect(tx, ty, tw, th);
    if (o.type === "ruin" || o.type === "lava_ore" || o.type === "ice_spike" || o.type === "void_crystal"
      || o.type === "acid_pool" || o.type === "storm_spire" || o.type === "electro_pillar"
      || o.type === "aqua_vent" || o.type === "steel_scrap" || o.type === "sonic_rock"
      || o.type === "gravity_well" || o.type === "flash_prism" || o.type === "smoke_vent") {
      ctx.strokeStyle = "rgba(170,145,110,0.55)";
      ctx.lineWidth = Math.max(1, sz(1.3));
      for (let i = 1; i < 4; i += 1) {
        const yy = ty + (th * i) / 4;
        ctx.beginPath();
        ctx.moveTo(tx + sz(4), yy);
        ctx.lineTo(tx + tw - sz(4), yy);
        ctx.stroke();
      }
      ctx.lineWidth = 1;
    }
    if (o.type === "rock") {
      ctx.fillStyle = "rgba(150,160,172,0.28)";
      ctx.fillRect(tx + tw * 0.12, ty + th * 0.14, tw * 0.32, th * 0.2);
      ctx.fillStyle = "rgba(60,70,84,0.35)";
      ctx.fillRect(tx + tw * 0.46, ty + th * 0.5, tw * 0.36, th * 0.28);
    }
    if (o.type === "tree") {
      ctx.fillStyle = "rgba(25,80,38,0.55)";
      ctx.beginPath();
      ctx.arc(tx + tw * 0.55, ty + th * 0.5, Math.max(8, tw * 0.22), 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx + tw * 0.3, ty + th * 0.34, Math.max(6, tw * 0.15), 0, Math.PI * 2);
      ctx.fill();
    }
    if (o.type === "lava_ore") {
      ctx.fillStyle = "rgba(255,163,98,0.42)";
      ctx.fillRect(tx + tw * 0.18, ty + th * 0.2, tw * 0.3, th * 0.22);
      ctx.fillStyle = "rgba(255,88,38,0.34)";
      ctx.fillRect(tx + tw * 0.52, ty + th * 0.52, tw * 0.26, th * 0.2);
    }
    if (o.type === "ice_spike") {
      ctx.fillStyle = "rgba(215,245,255,0.48)";
      ctx.beginPath();
      ctx.moveTo(tx + tw * 0.24, ty + th * 0.9);
      ctx.lineTo(tx + tw * 0.42, ty + th * 0.18);
      ctx.lineTo(tx + tw * 0.56, ty + th * 0.9);
      ctx.closePath();
      ctx.fill();
    }
    if (o.type === "void_crystal") {
      ctx.fillStyle = "rgba(208,170,255,0.42)";
      ctx.beginPath();
      ctx.moveTo(tx + tw * 0.5, ty + th * 0.12);
      ctx.lineTo(tx + tw * 0.82, ty + th * 0.48);
      ctx.lineTo(tx + tw * 0.5, ty + th * 0.9);
      ctx.lineTo(tx + tw * 0.18, ty + th * 0.48);
      ctx.closePath();
      ctx.fill();
    }
    if (o.type === "acid_pool") {
      ctx.fillStyle = "rgba(171,255,116,0.38)";
      ctx.beginPath();
      ctx.ellipse(tx + tw * 0.5, ty + th * 0.52, tw * 0.34, th * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (o.type === "storm_spire") {
      ctx.fillStyle = "rgba(187,250,255,0.36)";
      ctx.beginPath();
      ctx.moveTo(tx + tw * 0.5, ty + th * 0.1);
      ctx.lineTo(tx + tw * 0.72, ty + th * 0.46);
      ctx.lineTo(tx + tw * 0.5, ty + th * 0.9);
      ctx.lineTo(tx + tw * 0.28, ty + th * 0.46);
      ctx.closePath();
      ctx.fill();
    }
    if (o.type === "electro_pillar") {
      ctx.fillStyle = "rgba(255,238,138,0.42)";
      ctx.beginPath();
      ctx.moveTo(tx + tw * 0.3, ty + th * 0.16);
      ctx.lineTo(tx + tw * 0.55, ty + th * 0.16);
      ctx.lineTo(tx + tw * 0.42, ty + th * 0.52);
      ctx.lineTo(tx + tw * 0.64, ty + th * 0.52);
      ctx.lineTo(tx + tw * 0.38, ty + th * 0.88);
      ctx.lineTo(tx + tw * 0.46, ty + th * 0.6);
      ctx.lineTo(tx + tw * 0.26, ty + th * 0.6);
      ctx.closePath();
      ctx.fill();
    }
    if (o.type === "aqua_vent") {
      ctx.fillStyle = "rgba(146,224,255,0.38)";
      ctx.beginPath();
      ctx.ellipse(tx + tw * 0.5, ty + th * 0.6, tw * 0.28, th * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(tx + tw * 0.46, ty + th * 0.24, tw * 0.08, th * 0.26);
    }
    if (o.type === "steel_scrap") {
      ctx.fillStyle = "rgba(214,196,172,0.28)";
      ctx.fillRect(tx + tw * 0.2, ty + th * 0.24, tw * 0.56, th * 0.2);
      ctx.fillRect(tx + tw * 0.36, ty + th * 0.5, tw * 0.34, th * 0.28);
    }
    if (o.type === "sonic_rock") {
      ctx.strokeStyle = "rgba(255,210,158,0.42)";
      ctx.lineWidth = Math.max(1.2, sz(1.8));
      ctx.beginPath();
      ctx.arc(tx + tw * 0.5, ty + th * 0.52, Math.max(sz(8), tw * 0.18), 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(tx + tw * 0.5, ty + th * 0.52, Math.max(sz(14), tw * 0.27), 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    if (o.type === "gravity_well") {
      ctx.fillStyle = "rgba(190,166,255,0.34)";
      ctx.beginPath();
      ctx.ellipse(tx + tw * 0.5, ty + th * 0.52, tw * 0.3, th * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(206,186,255,0.45)";
      ctx.beginPath();
      ctx.ellipse(tx + tw * 0.5, ty + th * 0.52, tw * 0.4, th * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (o.type === "flash_prism") {
      ctx.fillStyle = "rgba(244,248,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(tx + tw * 0.5, ty + th * 0.12);
      ctx.lineTo(tx + tw * 0.86, ty + th * 0.72);
      ctx.lineTo(tx + tw * 0.14, ty + th * 0.72);
      ctx.closePath();
      ctx.fill();
    }
    if (o.type === "smoke_vent") {
      ctx.fillStyle = "rgba(184,196,210,0.34)";
      ctx.beginPath();
      ctx.arc(tx + tw * 0.38, ty + th * 0.42, Math.max(sz(6), tw * 0.1), 0, Math.PI * 2);
      ctx.arc(tx + tw * 0.58, ty + th * 0.36, Math.max(sz(8), tw * 0.13), 0, Math.PI * 2);
      ctx.arc(tx + tw * 0.7, ty + th * 0.52, Math.max(sz(6), tw * 0.1), 0, Math.PI * 2);
      ctx.fill();
    }
  });

  mission.fieldShops?.forEach((s) => {
    const x = sx(s.x);
    const y = sy(s.y);
    const rr = sz(s.r);
    ctx.globalAlpha = s.used ? 0.45 : 0.9;
    ctx.fillStyle = "#1d2e44";
    ctx.beginPath();
    ctx.arc(x, y, rr * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffe08a";
    ctx.lineWidth = Math.max(1.2, sz(2));
    ctx.beginPath();
    ctx.arc(x, y, rr * 0.95, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffe08a";
    ctx.font = `${Math.max(9, Math.round(sz(11)))}px Segoe UI`;
    ctx.fillText("SHOP", x - rr * 0.45, y + rr * 0.08);
    ctx.fillText(s.name, x - rr * 0.7, y - rr * 1.1);
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  });
  mission.freeLootNodes?.forEach((n) => {
    if (n.picked) return;
    const x = sx(n.x);
    const y = sy(n.y);
    const rr = sz(n.r);
    ctx.fillStyle = "#84d8ff";
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f2436";
    ctx.font = `${Math.max(10, Math.round(sz(15)))}px Segoe UI`;
    ctx.fillText(n.icon || "🎁", x - rr * 0.45, y + rr * 0.35);
  });
  mission.rareMines?.forEach((m) => {
    if (m.broken) return;
    const x = sx(m.x);
    const y = sy(m.y);
    const rr = sz(m.r);
    ctx.fillStyle = "#5a6b43";
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#cbff95";
    ctx.lineWidth = Math.max(1.2, sz(2));
    ctx.beginPath();
    ctx.arc(x, y, rr + sz(4), 0, Math.PI * 2);
    ctx.stroke();
    const hpRate = Math.max(0, Math.min(1, m.hp / Math.max(1, m.maxHp)));
    ctx.fillStyle = "rgba(12,16,26,0.85)";
    ctx.fillRect(x - rr, y - rr - sz(14), rr * 2, sz(6));
    ctx.fillStyle = "#bff87a";
    ctx.fillRect(x - rr, y - rr - sz(14), rr * 2 * hpRate, sz(6));
    ctx.fillStyle = "#e8ffd0";
    ctx.font = `${Math.max(9, Math.round(sz(10)))}px Segoe UI`;
    ctx.fillText(m.name, x - rr * 1.25, y + rr + sz(14));
    ctx.lineWidth = 1;
  });

  if (mission.ship && mission.phase !== "battle") {
    const px = sx(mission.ship.x);
    const py = sy(mission.ship.y);
    ctx.fillStyle = "#8fb7dc";
    ctx.beginPath();
    ctx.moveTo(px, py - sz(20));
    ctx.lineTo(px + sz(78), py + sz(4));
    ctx.lineTo(px, py + sz(28));
    ctx.lineTo(px - sz(78), py + sz(4));
    ctx.closePath(); ctx.fill();
  }

  mission.projectiles?.forEach((p) => {
    const px = sx(p.x);
    const progress = p.lifeTotal > 0 ? 1 - p.life / p.lifeTotal : 1;
    const arcOffset = p.arc ? Math.sin(Math.max(0, Math.min(1, progress)) * Math.PI) * (p.arcHeight || 24) : 0;
    const py = sy(p.y) - sz(arcOffset);
    if (p.arc) {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(px, sy(p.y) + sz(8), Math.max(4, sz((p.radius || 4) * 1.6)), Math.max(2, sz((p.radius || 4) * 0.8)), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = p.fromEnemy ? (p.color || "#ff7b7b") : (p.color || "#9ecfff");
    ctx.beginPath();
    ctx.arc(px, py, sz(p.radius || 4), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = p.fromEnemy ? "rgba(255,220,220,0.8)" : "rgba(255,255,255,0.5)";
    ctx.lineWidth = Math.max(1.2, sz(1.4));
    ctx.beginPath();
    const trailScale = p.fromEnemy ? 0.02 : 0.012;
    ctx.moveTo(px - sz(p.vx * trailScale), py - sz(p.vy * trailScale));
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.lineWidth = 1;
  });

  mission.effects.forEach((fx) => {
    const a = Math.max(0, Math.min(1, fx.life / 0.5));
    ctx.globalAlpha = a;
    if (fx.kind === "shot") {
      ctx.strokeStyle = fx.color || "#a2d5ff";
      ctx.lineWidth = Math.max(1.2, sz(fx.w || 2));
      ctx.beginPath();
      ctx.moveTo(sx(fx.x1), sy(fx.y1));
      ctx.lineTo(sx(fx.x2), sy(fx.y2));
      ctx.stroke();
    } else if (fx.kind === "melee") {
      ctx.strokeStyle = fx.color || "#ffd080";
      ctx.lineWidth = Math.max(2, sz(5));
      ctx.beginPath();
      ctx.arc(sx(fx.x || 0), sy(fx.y || 0), sz(fx.r || 24), fx.a0 ?? -0.7, fx.a1 ?? 0.7);
      ctx.stroke();
    } else if (fx.kind === "shield") {
      ctx.strokeStyle = fx.color || "#9cd1ff";
      ctx.lineWidth = Math.max(2, sz(4));
      ctx.beginPath();
      ctx.arc(sx(fx.x || 0), sy(fx.y || 0), sz(fx.r || 26), 0, Math.PI * 2);
      ctx.stroke();
    } else if (fx.kind === "explosion") {
      ctx.fillStyle = fx.color || "#ffad63";
      ctx.beginPath();
      ctx.arc(sx(fx.x || 0), sy(fx.y || 0), sz((fx.r || 26) * (1.08 + (1 - a) * 0.5)), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffe7aa";
      ctx.lineWidth = Math.max(1.2, sz(2));
      ctx.beginPath();
      ctx.arc(sx(fx.x || 0), sy(fx.y || 0), sz((fx.r || 26) * (0.68 + (1 - a) * 0.2)), 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = fx.color || "#ffe08a";
      ctx.fillStyle = fx.color || "#ffe08a";
      ctx.beginPath();
      ctx.arc(sx(fx.x || 0), sy(fx.y || 0), sz((fx.r || 24) * (1 + (1 - a) * 0.25)), 0, Math.PI * 2);
      if (fx.kind === "skill") ctx.stroke(); else ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
  });

  mission.units.forEach((u) => {
    if (mission.phase !== "battle" && !u.visible) return;
    if (!u.path || !u.path.length) return;
    ctx.strokeStyle = "rgba(160,245,255,0.98)";
    ctx.lineWidth = Math.max(1.8, sz(2.8));
    ctx.setLineDash([sz(8), sz(6)]);
    ctx.beginPath();
    ctx.moveTo(sx(u.x), sy(u.y));
    u.path.forEach((p) => ctx.lineTo(sx(p.x), sy(p.y)));
    ctx.stroke();
    ctx.setLineDash([]);
    const last = u.path[u.path.length - 1];
    ctx.fillStyle = "rgba(215,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(sx(last.x), sy(last.y), Math.max(3.2, sz(5.2)), 0, Math.PI * 2);
    ctx.fill();
  });

  mission.alliedUnits?.forEach((u) => {
    const ux = sx(u.x);
    const uy = sy(u.y);
    const ur = sz(u.r);
    const face = u.faceAngle ?? -Math.PI / 2;
    ctx.save();
    ctx.translate(ux, uy);
    ctx.rotate(face + Math.PI / 2);
    ctx.fillStyle = u.color || "#7dd7a5";
    ctx.beginPath();
    ctx.arc(0, 0, ur, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d6ffe7";
    ctx.lineWidth = Math.max(1.1, sz(1.8));
    ctx.beginPath();
    ctx.arc(0, 0, ur + sz(4), 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#efffff";
    ctx.beginPath();
    ctx.moveTo(0, -ur - sz(4));
    ctx.lineTo(sz(4), -ur + sz(1));
    ctx.lineTo(-sz(4), -ur + sz(1));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#d8ffec";
    ctx.font = "10px Segoe UI";
    ctx.fillText(`지원:${u.name}`, ux - 34, uy - ur - 8);
  });

  mission.units.forEach((u) => {
    if (mission.phase !== "battle" && !u.visible) return;
    const ux = sx(u.x);
    const uy = sy(u.y);
    const ur = sz(u.r);
    const face = u.faceAngle ?? -Math.PI / 2;
    if (u.isMech && !u.mechBroken) {
      ctx.save();
      ctx.translate(ux, uy);
      ctx.rotate(face + Math.PI / 2);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(-ur - sz(10), -ur - sz(10), (ur + sz(10)) * 2, (ur + sz(10)) * 2);
      ctx.fillStyle = u.color;
      ctx.beginPath();
      ctx.moveTo(0, -ur - sz(2));
      ctx.lineTo(ur + sz(6), -sz(2));
      ctx.lineTo(ur - sz(2), ur + sz(4));
      ctx.lineTo(-ur + sz(2), ur + sz(4));
      ctx.lineTo(-ur - sz(6), -sz(2));
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = u.attrColor || "#f2c14e";
      ctx.lineWidth = Math.max(1.2, sz(2));
      ctx.stroke();
      ctx.fillStyle = "#0f1724";
      ctx.fillRect(-sz(7), -sz(4), sz(14), sz(8));
      ctx.fillStyle = "#e5eefb";
      ctx.fillRect(-sz(2), -ur - sz(9), sz(4), sz(10));
      ctx.restore();
      ctx.lineWidth = 1;
    } else {
      ctx.save();
      ctx.translate(ux, uy);
      ctx.rotate(face + Math.PI / 2);
      ctx.fillStyle = u.color;
      ctx.beginPath();
      ctx.arc(0, 0, ur, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f1f8ff";
      ctx.beginPath();
      ctx.moveTo(0, -ur - sz(4));
      ctx.lineTo(sz(5), -ur + sz(2));
      ctx.lineTo(-sz(5), -ur + sz(2));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    drawWeaponHardpoints(ctx, u, ux, uy, ur, face, sz);
    ctx.fillStyle = "#dce7f5";
    ctx.font = "11px Segoe UI";
    ctx.fillText(u.isMech && !u.mechBroken ? `M:${Math.max(0, Math.floor(u.mechHp))}` : `HP:${Math.max(0, Math.floor(u.hp))}`, ux - 26, uy - ur - 6);
  });

  mission.enemies.forEach((e) => {
    const ex = sx(e.x);
    const ey = sy(e.y);
    const er = sz(e.r);
    const color = e.palette || (e.isBoss ? "#b775ff" : e.isMidBoss ? "#ffb347" : e.named ? "#ff9f47" : "#ff6767");
    ctx.fillStyle = color;
    ctx.beginPath();
    if (e.shape === "diamond") {
      ctx.moveTo(ex, ey - er);
      ctx.lineTo(ex + er, ey);
      ctx.lineTo(ex, ey + er);
      ctx.lineTo(ex - er, ey);
      ctx.closePath();
    } else if (e.shape === "square") {
      ctx.rect(ex - er * 0.85, ey - er * 0.85, er * 1.7, er * 1.7);
    } else if (e.shape === "hex") {
      for (let i = 0; i < 6; i += 1) {
        const a = -Math.PI / 2 + (Math.PI * 2 * i) / 6;
        const px = ex + Math.cos(a) * er;
        const py = ey + Math.sin(a) * er;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (e.shape === "oct") {
      for (let i = 0; i < 8; i += 1) {
        const a = -Math.PI / 2 + (Math.PI * 2 * i) / 8;
        const px = ex + Math.cos(a) * er;
        const py = ey + Math.sin(a) * er;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (e.shape === "tri") {
      ctx.moveTo(ex, ey - er);
      ctx.lineTo(ex + er * 0.95, ey + er * 0.75);
      ctx.lineTo(ex - er * 0.95, ey + er * 0.75);
      ctx.closePath();
    } else if (e.shape === "kite") {
      ctx.moveTo(ex, ey - er);
      ctx.lineTo(ex + er * 0.75, ey);
      ctx.lineTo(ex, ey + er * 0.9);
      ctx.lineTo(ex - er * 0.55, ey);
      ctx.closePath();
    } else {
      ctx.arc(ex, ey, er, 0, Math.PI * 2);
    }
    ctx.fill();
    if (e.shield && e.shield > 0) {
      const sr = Math.max(0, Math.min(1, e.shield / Math.max(1, e.maxShield || e.shield)));
      ctx.strokeStyle = "#8ee6ff";
      ctx.lineWidth = Math.max(1.2, sz(2.2));
      ctx.beginPath();
      ctx.arc(ex, ey, er + sz(4.5), -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sr);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    if (e.isBoss) {
      ctx.strokeStyle = "#fff3a6";
      ctx.lineWidth = Math.max(1.6, sz(2.2));
      ctx.beginPath();
      ctx.arc(ex, ey, er + sz(7), 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = e.palette || "#ffb0e5";
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(ex, ey, er + sz(18 + Math.sin(mission.elapsed * 3.2) * 4), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      ctx.fillStyle = "#111a2a";
      ctx.beginPath();
      ctx.arc(ex, ey, sz(4.4), 0, Math.PI * 2);
      ctx.fill();
    }
    if (e.isBoss || e.isMidBoss || e.named) {
      ctx.fillStyle = "#f1f5ff";
      ctx.font = "10px Segoe UI";
      ctx.fillText(`${e.title || "빌런"}:${e.realName || ""}`, ex - 44, ey - er - 10);
      ctx.fillStyle = "#d3e5ff";
      ctx.fillText(`${e.archetype || "전투원"} · ${e.archetypeNotes || ""}`, ex - 44, ey - er + 1);
    }
  });

  if (mission.skillHoverWorld && mission.skillDragId) {
    const sk = mission.skillCards.find((x) => x.id === mission.skillDragId);
    if (sk) {
      const owner = mission.units.find((u) => u.id === sk.ownerId) || mission.units[0] || null;
      const castRange = Math.max(60, Number(sk.castRange || owner?.firearmRange || 220));
      const inRange = owner ? (Math.hypot(mission.skillHoverWorld.x - owner.x, mission.skillHoverWorld.y - owner.y) <= castRange) : true;
      if (owner) {
        const ox = sx(owner.x);
        const oy = sy(owner.y);
        const tx = sx(mission.skillHoverWorld.x);
        const ty = sy(mission.skillHoverWorld.y);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = inRange ? "#8be39a" : "#ff8f8f";
        ctx.beginPath();
        ctx.arc(ox, oy, sz(castRange), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = inRange ? "#86e59b" : "#ff9d9d";
        ctx.setLineDash([Math.max(4, sz(6)), Math.max(3, sz(4))]);
        ctx.lineWidth = Math.max(1.2, sz(1.8));
        ctx.beginPath();
        ctx.arc(ox, oy, sz(castRange), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        if (!inRange) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#ffd4d4";
          ctx.font = `${Math.max(10, Math.round(sz(12)))}px Segoe UI`;
          ctx.fillText("사거리 밖", tx + sz(10), ty - sz(10));
        }
      }
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = inRange ? (sk.color || "#8ecaff") : "#ff7f7f";
      ctx.beginPath(); ctx.arc(sx(mission.skillHoverWorld.x), sy(mission.skillHoverWorld.y), sz(sk.radius), 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
    }
  }
}

function showMissionResult(success, reason, retreated) {
  const planet = getPlanetById(mission.planetId);
  const region = planet ? getRegionById(planet, mission.regionId) : null;
  const newlyRestored = !!(success && region && !region.infiniteMode && !region.restored);
  const diffMeta = getDifficultyMeta();
  const infiniteMode = !!mission.infiniteMode;
  const progress = infiniteMode ? 100 : (mission.totalEnemyCount > 0 ? Math.round((mission.killedEnemies / mission.totalEnemyCount) * 100) : 0);
  const baseCredit = (region?.difficulty || 1) * 180 + mission.killedEnemies * (infiniteMode ? 32 : 22);
  const baseResource = (region?.difficulty || 1) * 90 + mission.killedEnemies * (infiniteMode ? 15 : 10);
  const ratio = success ? 1 : retreated ? Math.max(0.35, progress / 100) : 0.25;
  const richMul = infiniteMode ? 1.65 : 1;
  const creditPlanned = Math.round(baseCredit * ratio * diffMeta.rewardScale * richMul);
  const resourcePlanned = Math.round(baseResource * ratio * diffMeta.rewardScale * richMul);
  let creditApplied = 0;
  let resourceApplied = 0;
  let failurePenalty = 0;
  const themePlanet = mission.infiniteThemePlanetId ? getPlanetById(mission.infiniteThemePlanetId) : null;
  const rewardResourceId = infiniteMode ? getPlanetResourceId(themePlanet || planet) : getPlanetResourceId(planet);
  const rewardResourceName = RESOURCE_DEFS[rewardResourceId]?.name || "자원";
  if (mission.extraResourceDrops && typeof mission.extraResourceDrops === "object") {
    Object.entries(mission.extraResourceDrops).forEach(([rid, amt]) => {
      if (!amt || amt <= 0) return;
      addResource(rid, Math.round(amt));
    });
  }
  let recruited = [];
  if (success) recruited = grantFieldAllyRecruitmentOnSuccess();
  const salvagedGranted = success ? grantSalvagedMechsIntoRoster() : [];
  if (!state.settings.infinite) {
    creditApplied = addCredits(creditPlanned);
    resourceApplied = addResource(rewardResourceId, resourcePlanned);
    if (!success && !retreated) {
      failurePenalty = getMissionFailureCreditPenalty();
      addCredits(-failurePenalty, { bypassPenalty: true });
    }
  }
  state.power += Math.round(12 + progress * 0.15);
  if (success && region && !region.infiniteMode) region.restored = true;
  if (success && region && !region.infiniteMode) saveProgressSnapshot();
  if (newlyRestored) {
    void createAutoCheckpointAfterRegionClear(planet, region);
  }
  ensurePlanetProgressState();
  state.capturedVillains.push(...mission.capturedVillains);
  mission.foundItems.forEach((it) => addItemToOwnedInventory(it));
  grantOnePerCodexPlayable();
  applyQuestProgressFromMission({
    success,
    retreated,
    killedEnemies: mission.killedEnemies,
    capturedVillains: mission.capturedVillains,
  });

  if (ui.missionResultTitle) {
    if (isBankruptState()) ui.missionResultTitle.textContent = "파산";
    else ui.missionResultTitle.textContent = success ? (infiniteMode && retreated ? "탐사 철수 (클리어)" : "클리어") : retreated ? "중도 퇴각" : "미션 실패";
  }
  if (ui.missionResultReason) {
    const bankruptSuffix = isBankruptState() ? " | 파산" : "";
    ui.missionResultReason.textContent = `${reason}${bankruptSuffix}`;
  }
  if (ui.missionResultBody) {
    const extraResourceText = Object.entries(mission.extraResourceDrops || {})
      .filter(([, amt]) => amt > 0)
      .map(([rid, amt]) => `${RESOURCE_DEFS[rid]?.name || rid} ${Math.round(amt)}`)
      .join(", ");
    ui.missionResultBody.innerHTML = `
      <div class="base-card"><strong>처치한 적:</strong> ${mission.killedEnemies} / ${mission.totalEnemyCount}</div>
      <div class="base-card"><strong>진행도:</strong> ${infiniteMode ? `무한 탐사 / 처치 ${mission.killedEnemies}` : `${progress}%`}</div>
      <div class="base-card"><strong>보상:</strong> 크레딧 ${creditApplied} / ${rewardResourceName} ${resourceApplied}</div>
      <div class="base-card"><strong>실패 페널티:</strong> ${failurePenalty > 0 ? `크레딧 -${failurePenalty}` : "없음"}</div>
      <div class="base-card"><strong>획득 아이템:</strong> ${mission.foundItems.length ? mission.foundItems.slice(0, 8).map((x) => x.name).join(", ") : "없음"}</div>
      <div class="base-card"><strong>체포 빌런:</strong> ${mission.capturedVillains.length ? mission.capturedVillains.map((x) => x.name).join(", ") : "없음"}</div>
      <div class="base-card"><strong>노획 메카:</strong> ${salvagedGranted.length ? salvagedGranted.map((m) => m.name).join(", ") : "없음"}</div>
      <div class="base-card"><strong>채굴 보너스:</strong> ${extraResourceText || "없음"}</div>
      <div class="base-card"><strong>현장 영입:</strong> ${recruited.length ? recruited.map((u) => `${u.name}(${u.unitType === "hero" ? "히어로" : "용병"})`).join(", ") : "없음"}</div>
    `;
  }
  if (ui.missionResultRestartBtn) ui.missionResultRestartBtn.classList.toggle("hidden", !isBankruptState());
  if (ui.missionResultModal) ui.missionResultModal.classList.remove("hidden");
}

function finalizeMissionMechOutcome() {
  if (!Array.isArray(state.mechs)) return;
  const outcome = mission.mechOutcome || {};
  state.mechs.forEach((m) => {
    if (!m?.id || !m.unlocked) return;
    const rec = outcome[m.id];
    if (!rec) return;
    const hpNow = clamp(Math.round(rec.currentHp || 0), 0, m.hp);
    if (rec.destroyed) {
      // 파괴 이력이 있으면 무료 완전수리 대상이 아님(긴급수리/격납고 수리 필요).
      m.currentHp = hpNow;
    } else {
      // 파괴되지 않고 복귀하면 자동 무료 완전수리.
      m.currentHp = m.hp;
    }
  });
}

function endMission(success, reason, retreated = false) {
  if (!mission.running) return;
  mission.running = false;
  if (mission.rafId) cancelAnimationFrame(mission.rafId);
  stopBossBgm();
  mission.bossBgmKey = null;
  mission.bossUiTimer = 0;
  mission.bossPhaseTimer = 0;
  if (ui.bossWarningOverlay) ui.bossWarningOverlay.classList.add("hidden");
  if (ui.bossPhaseOverlay) ui.bossPhaseOverlay.classList.add("hidden");
  renderMissionLoading(false, "", "");
  if (mission.infiniteMode && retreated) success = true;
  finalizeMissionMechOutcome();
  showMissionResult(success, reason, retreated);
  trySpawnEmergencyQuest();
  updateEmergencyQuestStatus();
  saveState();
  updateTopbar();
}

function loopMission(ts) {
  if (!mission.running) return;
  const baseDt = Math.min(0.033, (ts - mission.lastTime) / 1000);
  const dt = baseDt * clamp(mission.timeScale || 1, 1, 5);
  mission.lastTime = ts;
  mission.elapsed += dt;
  syncMissionSkillCooldowns();
  mission.bossUiTimer = Math.max(0, (mission.bossUiTimer || 0) - dt);
  mission.bossPhaseTimer = Math.max(0, (mission.bossPhaseTimer || 0) - dt);
  if (ui.bossWarningOverlay) ui.bossWarningOverlay.classList.toggle("hidden", mission.bossUiTimer <= 0);
  if (ui.bossPhaseOverlay) ui.bossPhaseOverlay.classList.toggle("hidden", mission.bossPhaseTimer <= 0);
  mission.phaseTime += dt;
  if (mission.phase === "loading") {
    const p = Math.min(1, mission.phaseTime / mission.loadingDuration);
    renderMissionLoading(true, "출격 준비 중...", `지형 동기화 ${Math.round(p * 100)}%`);
    if (p >= 1) { mission.phase = "landing"; mission.phaseTime = 0; renderMissionLoading(true, "우주선 착륙 중", "착륙 시퀀스 시작"); }
  } else if (mission.phase === "landing") {
    const t = Math.min(1, mission.phaseTime / 2);
    if (mission.ship) mission.ship.y = -220 + (mission.ship.targetY + 220) * t;
    renderMissionLoading(true, "착륙 진행", `착륙률 ${Math.round(t * 100)}%`);
    if (t >= 1) { mission.phase = "deploy"; mission.phaseTime = 0; renderMissionLoading(true, "유닛 전개", "우주선에서 하차 중"); }
  } else if (mission.phase === "deploy") {
    mission.units.forEach((u) => {
      const t = clamp((mission.phaseTime - (u.deployDelay || 0)) / 1.05, 0, 1);
      if (t > 0) u.visible = true;
      u.deployProgress = t;
      if (u.visible) {
        u.x = u.spawnX + (u.finalX - u.spawnX) * t;
        u.y = u.spawnY + (u.finalY - u.spawnY) * t;
      }
    });
    if (mission.phaseTime >= 3) {
      mission.units.forEach((u) => {
        u.visible = true;
        u.x = u.finalX;
        u.y = u.finalY;
      });
      mission.phase = "battle";
      mission.phaseTime = 0;
      renderMissionLoading(false, "", "");
      const boss = mission.enemies.find((e) => e.isBoss);
      if (boss) {
        setBossWarning("FINAL TARGET DETECTED", `${boss.title} - ${boss.realName}`, 3.2);
        playBossBgm(boss.bossPattern || "tyrant");
        mission.bossBgmKey = boss.bossPattern || "tyrant";
      }
    }
  } else {
    updateMissionAutoMode(dt);
    updateMission(dt);
    updateMissionFollowCamera(dt);
    const dMeta = getDifficultyMeta();
    const shopHint = mission.nearFieldShopId ? " | F: 임시 상점" : "";
    const themeTag = mission.theme?.primaryAttr ? ` | 행성 버프 ${mission.theme.primaryAttr}` : "";
    const remainVillains = Math.max(0, mission.totalEnemyCount - mission.killedEnemies);
    const deployedUnits = mission.deployedUnitCount || mission.units.length;
    const deployedMechs = mission.deployedMechCount || mission.units.filter((u) => u.isMech && !u.mechBroken).length;
    ui.missionHud.textContent = `난이도 ${dMeta.label} | 출격 유닛 ${deployedUnits} | 출격 메카 ${deployedMechs} | 처치 ${mission.killedEnemies}/남은 ${remainVillains} | 줌 ${(mission.zoom || 1).toFixed(2)}x${themeTag}${shopHint}`;
  }
  drawMission();
  mission.rafId = requestAnimationFrame(loopMission);
}

function startMission() {
  ensurePlanetProgressState();
  const planet = getPlanetById(state.selectedPlanetId);
  if (!planet) return alert("행성을 선택하세요.");
  const region = getRegionById(planet, state.selectedRegionId);
  if (!region) return alert("지역을 선택하세요.");
  const deployed = getAllUnits().filter((u) => u.deployed);
  if (!deployed.length) return alert("(출격 인원이 없음)");
  const hasPilot = deployed.some((u) => (state.mechs || []).some((m) => m.unlocked && m.pilotId === u.id));
  if (!hasPilot) {
    const activeMech = (state.mechs || []).find((m) => m.unlocked && m.id === state.activeMechId) || (state.mechs || []).find((m) => m.unlocked);
    if (activeMech && deployed[0]) activeMech.pilotId = deployed[0].id;
  }
  mission.zoom = MISSION_DEFAULT_ZOOM;
  mission.worldW = 6800 + region.difficulty * 220;
  mission.worldH = 4200 + region.difficulty * 170;
  if (region.infiniteMode) {
    mission.worldW = 9800 + region.difficulty * 260;
    mission.worldH = 6200 + region.difficulty * 230;
  }
  showScreen("mission");
  resizeMissionCanvas();
  mission.camera = clampMissionCamera(0, Math.max(0, mission.worldH - mission.viewH));
  mission.regionId = region.id;
  mission.planetId = planet.id;
  mission.elapsed = 0;
  mission.phase = "loading";
  mission.phaseTime = 0;
  mission.loadingDuration = 0.9 + Math.min(1.5, region.difficulty * 0.18);
  mission.autoMode = false;
  mission.timeScale = 1;
  mission.autoThinkCd = 0;
  mission.followUnitId = null;
  mission.killedEnemies = 0;
  mission.capturedVillains = [];
  mission.salvagedMechs = [];
  mission.foundItems = [];
  mission.fieldShops = [];
  mission.freeLootNodes = [];
  mission.alliedUnits = [];
  mission.rareMines = [];
  mission.extraResourceDrops = {};
  mission.recruitedFromField = [];
  mission.nearFieldShopId = null;
  mission.deployedUnitCount = deployed.length;
  mission.deployedMechCount = deployed.filter((u) => (state.mechs || []).some((m) => m.unlocked && m.pilotId === u.id)).length;
  mission.effects = [];
  mission.projectiles = [];
  mission.bossUiTimer = 0;
  mission.bossPhaseTimer = 0;
  mission.bossBgmKey = null;
  mission.mechOutcome = {};
  mission.infiniteMode = !!region.infiniteMode;
  mission.infiniteThemePlanetId = region.themePlanetId || null;
  mission.infiniteSeed = Date.now();
  const themedPlanet = mission.infiniteMode && mission.infiniteThemePlanetId ? getPlanetById(mission.infiniteThemePlanetId) : planet;
  mission.theme = getPlanetThemeByPlanet(themedPlanet || planet);
  if (ui.bossWarningOverlay) ui.bossWarningOverlay.classList.add("hidden");
  if (ui.bossPhaseOverlay) ui.bossPhaseOverlay.classList.add("hidden");
  mission.ship = { x: 280, y: -220, targetY: mission.worldH - 240 };
  mission.obstacles = generateMissionObstacles(mission.worldW, mission.worldH, region, mission.theme);
  mission.navGrid = buildMissionNavGrid(72);
  mission.terrainPatches = [...Array(260)].map((_, i) => ({
    x: 120 + Math.random() * (mission.worldW - 240),
    y: 100 + Math.random() * (mission.worldH - 200),
    r: 28 + Math.random() * 110,
    a: 0.08 + Math.random() * 0.14,
    c: mission.theme.patchColors?.[i % 3] || (i % 3 === 0 ? "#3a7f43" : i % 3 === 1 ? "#c2a16a" : "#4f93bf"),
  }));
  mission.units = buildMissionUnitsAdvanced(deployed);
  if (mission.units[0]) mission.followUnitId = mission.units[0].id;
  mission.units.forEach((u, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const sx = mission.ship.x - 70 + col * 26;
    const sy = mission.ship.targetY + 24 + row * 18;
    u.spawnX = sx;
    u.spawnY = sy;
    u.finalX = u.x;
    u.finalY = u.y;
    u.x = sx;
    u.y = sy;
    u.visible = false;
    u.deployDelay = i * 0.12;
    u.deployProgress = 0;
    u.moveX = u.finalX;
    u.moveY = u.finalY;
    u.targetX = u.finalX;
    u.targetY = u.finalY;
    if (u.isMech && u.mechId) {
      mission.mechOutcome[u.mechId] = {
        destroyed: false,
        currentHp: Math.max(0, Math.round(u.mechHp || 0)),
      };
    }
  });
  spawnEnemiesAdvanced(region);
  spawnMissionFacilities(region, planet);
  purgeStartZoneMissionObjects();
  mission.skillCards = missionUnitCards(mission.units);
  syncMissionSkillCooldowns();
  mission.skillDragId = null;
  mission.skillHoverWorld = null;

  ui.missionTitle.textContent = `${planet.name} - ${region.name}`;
  ui.missionInfo.textContent = region.infiniteMode
    ? `무한 탐사 / 난이도 ${region.difficulty}`
    : `일반 지역 / 난이도 ${region.difficulty}`;
  renderMissionSkills();
  updateMissionControlUi();
  renderMissionLoading(true, "출격 준비 중...", "지형/적 배치 계산 중");
  mission.running = true;
  mission.lastTime = performance.now();
  if (mission.rafId) cancelAnimationFrame(mission.rafId);
  mission.rafId = requestAnimationFrame(loopMission);
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
  if (!state.hqCodexTab || !["units", "mechs"].includes(state.hqCodexTab)) state.hqCodexTab = "units";
  if (!Number.isFinite(state.hqCodexPageUnits) || state.hqCodexPageUnits < 1) state.hqCodexPageUnits = 1;
  if (!Number.isFinite(state.hqCodexPageMechs) || state.hqCodexPageMechs < 1) state.hqCodexPageMechs = 1;
  if (!Number.isFinite(state.hqReservePage) || state.hqReservePage < 1) state.hqReservePage = 1;
  if (!Number.isFinite(state.hangarMechPage) || state.hangarMechPage < 1) state.hangarMechPage = 1;
  state.quests = state.quests
    .slice(0, 10)
    .map((q) => normalizeQuest(q))
    .filter(Boolean);
  while (state.quests.length < 10) {
    state.quests.push(createNormalQuest(state.questCounter));
    state.questCounter += 1;
  }
  if (state.quests.length > 10) state.quests = state.quests.slice(0, 10);
}

function dedupeReformedMercsByCodex() {
  if (!Array.isArray(state.mercs)) return;
  // Keep duplicate reformed mercs; only remove strict duplicate IDs.
  const seen = new Set();
  state.mercs = state.mercs.filter((m) => {
    const id = String(m?.id || "");
    if (!id) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function ensureRosterState() {
  const allNow = [...(state.heroes || []), ...(state.mercs || [])];
  const needBootstrap = !state.rosterVersion || state.rosterVersion < 5 || allNow.length < 180;

  if (needBootstrap) {
    const catalog = createInitialRoster();
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
    if (!([...(state.heroes || []), ...(state.mercs || [])].some((u) => u?.deployed))) {
      if (state.heroes[0]) state.heroes[0].deployed = true;
      if (state.heroes[1]) state.heroes[1].deployed = true;
    }
    if (!state.hqSelectedHeroId || !state.heroes.some((h) => h.id === state.hqSelectedHeroId)) {
      state.hqSelectedHeroId = state.heroes[0]?.id || null;
    }
    state.rosterVersion = 5;
  }
  state.heroes = state.heroes.map((h, idx) => ({
    unitType: "hero",
    def: 6,
    speed: 15,
    ability: "기본 전술",
    classType: "히어로",
    color: "#7dc4ff",
    weaponType: "rifle",
    abilityIcon: "scope",
    level: 1,
    star: 0,
    canUseDefense: ["디펜서", "어썰트", "버서커", "스폐셜"].includes(h.roleClass || h.classType),
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
    classType: "용병",
    color: "#a7ffa4",
    weaponType: "carbine",
    abilityIcon: "dash",
    level: 1,
    star: 0,
    canUseDefense: ["디펜서", "어썰트", "버서커", "스폐셜"].includes(m.roleClass || m.classType),
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
    normalizeUnitWeaponRules(h);
    if (!h.codexKey) h.codexKey = `${h.unitType || "hero"}|${h.fixedFirearmType}|${h.fixedMeleeType}|${h.canUseDefense ? 1 : 0}|${h.rangeClass}|${getAttributeBase(h.attribute)}|${h.roleClass || h.classType || "오펜서"}`;
    if (!Number.isFinite(h.star)) h.star = 0;
  });
  state.mercs.forEach((m) => {
    if (!m.roleClass) m.roleClass = "스커미셔";
    if (!m.rangeClass) m.rangeClass = "중원거리";
    if (!m.classType || m.classType === "용병") m.classType = m.roleClass;
    if (!m.attribute) m.attribute = "물리";
    if (!m.teamEffect && m.team) m.teamEffect = TEAM_EFFECTS[m.team] || "없음";
    if (m.name && !/[가-힣]/.test(m.name)) m.name = koreanizeName(m.name);
    normalizeUnitWeaponRules(m);
    if (!m.codexKey) m.codexKey = `${m.unitType || "merc"}|${m.fixedFirearmType}|${m.fixedMeleeType}|${m.canUseDefense ? 1 : 0}|${m.rangeClass}|${getAttributeBase(m.attribute)}|${m.roleClass || m.classType || "오펜서"}`;
    if (!Number.isFinite(m.star)) m.star = 0;
  });
  dedupeReformedMercsByCodex();
  const shemBySourceId = new Map(SHEMHAM_NAMES.map((name, i) => [`셈하프-${i + 20}`, name]));
  const goetiaBySourceId = new Map(GOETIA_NAMES.map((name, i) => [`게티아-${i + 40}`, name]));
  state.heroes.forEach((h) => {
    if (h.team === "셈하프") {
      const canonical = shemBySourceId.get(h.sourceId);
      if (canonical) h.name = canonical;
    }
  });
  state.mercs.forEach((m) => {
    if (m.team === "게티아") {
      const canonical = goetiaBySourceId.get(m.sourceId);
      if (canonical) m.name = canonical;
    }
  });
  state.rosterVersion = 5;
  if (!Array.isArray(state.inventory)) state.inventory = [];
  state.inventory = state.inventory.map((it) => ({
    itemKind: it.itemKind || it.type || "gear",
    mainType: it.mainType || (it.type === "weapon" ? "무기" : "장비"),
    subType: replaceZweihanderText(it.subType || (it.type === "weapon" ? "legacy" : "legacy")),
    slotType: it.slotType || (it.type === "weapon" ? "firearm" : "gear"),
    icon: it.icon || createItemIcon(replaceZweihanderText(it.name)?.slice(0, 3) || "아이템", "#435069"),
    cdr: it.cdr || 0,
    weaponType: normalizeMeleeTypeName(it.weaponType),
    name: replaceZweihanderText(it.name),
    ...it,
    subType: replaceZweihanderText(it.subType || (it.type === "weapon" ? "legacy" : "legacy")),
    weaponType: normalizeMeleeTypeName(it.weaponType),
    name: replaceZweihanderText(it.name),
  }));
  if (state.inventory.length > 40000) {
    state.inventory = state.inventory.slice(0, 40000);
  }
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
    if (u.equippedMelee) {
      u.equippedMelee.weaponType = normalizeMeleeTypeName(u.equippedMelee.weaponType);
      u.equippedMelee.subType = replaceZweihanderText(u.equippedMelee.subType);
      u.equippedMelee.name = replaceZweihanderText(u.equippedMelee.name);
    }
    if (u.equippedFirearm) {
      u.equippedFirearm.subType = replaceZweihanderText(u.equippedFirearm.subType);
      u.equippedFirearm.name = replaceZweihanderText(u.equippedFirearm.name);
    }
    if (u.equippedDefense) {
      u.equippedDefense.subType = replaceZweihanderText(u.equippedDefense.subType);
      u.equippedDefense.name = replaceZweihanderText(u.equippedDefense.name);
    }
    if (Array.isArray(u.equippedGears)) {
      u.equippedGears = u.equippedGears.map((g) =>
        g
          ? {
              ...g,
              subType: replaceZweihanderText(g.subType),
              name: replaceZweihanderText(g.name),
            }
          : g,
      );
    }
    if (!Array.isArray(u.equippedGears)) u.equippedGears = [];
    if (u.equippedGears.length === 0) u.equippedGears.push(createDefaultGearForUnit(u));
  };
  state.heroes.forEach(migrateLegacySlots);
  state.mercs.forEach(migrateLegacySlots);
  if (!state.hqReserveFilter) state.hqReserveFilter = { roleClass: "all", attribute: "all", rangeClass: "all" };
  if (!state.hqGearFilter) state.hqGearFilter = "all";
  if (!Array.isArray(state.hangarShips) || state.hangarShips.length === 0) {
    state.hangarShips = [{ id: "ship-1", name: "HF-셔틀", baseCapacity: 12, capacity: 12, unlocked: true, upgradeLv: 0, buffAtk: 0, buffDef: 0, buffHp: 0, buffSpeed: 0 }];
  }
  state.hangarShips = state.hangarShips.map((s) => ({
    upgradeLv: 0,
    baseCapacity: Number(s?.baseCapacity || s?.capacity || 12),
    buffAtk: 0,
    buffDef: 0,
    buffHp: 0,
    buffSpeed: 0,
    ...s,
  }));
  state.hangarShips.forEach((s) => {
    s.upgradeLv = clamp(Math.round(Number(s.upgradeLv || 0)), 0, SHIP_MAX_UPGRADE_LV);
    s.baseCapacity = getShipBaseCapacity(s);
    const computedCap = calcShipCapacityByUpgrade(s, s.upgradeLv);
    if (s.upgradeLv >= SHIP_MAX_UPGRADE_LV) s.capacity = SHIP_MAX_CAPACITY;
    else s.capacity = clamp(Math.max(Number(s.capacity || 0), computedCap), s.baseCapacity, SHIP_MAX_CAPACITY);
  });
  if (!state.activeShipId || !state.hangarShips.some((s) => s.id === state.activeShipId && s.unlocked)) {
    const firstUnlocked = state.hangarShips.find((s) => s.unlocked);
    state.activeShipId = firstUnlocked ? firstUnlocked.id : state.hangarShips[0].id;
  }
  if (!state.hangarView || !["ships", "mechs"].includes(state.hangarView)) state.hangarView = "ships";
  if (!state.hangarMechInventoryFilter) state.hangarMechInventoryFilter = "all";
  if (!Array.isArray(state.mechs) || state.mechs.length === 0) {
    state.mechs = createStarterMechs();
  }
  const starterMechs = createStarterMechs();
  const mechMap = new Map((state.mechs || []).map((m) => [m.id, m]));
  starterMechs.forEach((m) => {
    if (!mechMap.has(m.id)) {
      mechMap.set(m.id, { ...m });
    } else {
      mechMap.set(m.id, { ...m, ...mechMap.get(m.id), unlocked: true });
    }
  });
  state.mechs = [...mechMap.values()];
  state.mechs.forEach((m) => {
    if (typeof m.currentHp !== "number") m.currentHp = m.hp;
    m.currentHp = clamp(m.currentHp, 0, m.hp);
    if (!m.attribute) m.attribute = "물리";
    if (!m.rangeClass) m.rangeClass = "중거리";
    if (!("pilotId" in m)) m.pilotId = null;
    if (!Array.isArray(m.equippedModules)) m.equippedModules = [];
    if (!("equippedMelee" in m)) m.equippedMelee = null;
    if (!("equippedFirearm" in m)) m.equippedFirearm = null;
    if (!("equippedDefense" in m)) m.equippedDefense = null;
    if (!("equippedCore" in m)) m.equippedCore = null;
    if (!Number.isFinite(m.level)) m.level = Math.max(1, Number(m.upgradeLv || 1));
    if (!Number.isFinite(m.star)) m.star = 0;
    if (!m.mechClass) m.mechClass = ROLE_ORDER[Math.abs(String(m.id || m.name || "m").split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % ROLE_ORDER.length];
    if (!m.codexKey) m.codexKey = `${m.role || "표준"}|${m.rangeClass || "중거리"}|${getAttributeBase(m.attribute || "물리")}|${m.mechClass}`;
  });
  if (!(state.mechs || []).some((m) => m.unlocked)) {
    const starterIds = new Set(starterMechs.map((m) => m.id));
    state.mechs.forEach((m) => {
      if (starterIds.has(m.id)) m.unlocked = true;
    });
  }
  const usedMechItemIds = new Set();
  const normalizeMechItemRecord = (it, fallbackPrefix) => {
    if (!it) return null;
    const localizedName = localizeLegacyMechModuleName(it.name || "");
    const inferredWeaponType = (() => {
      if (it.weaponType) return it.weaponType;
      const sub = String(it.subType || "");
      if (sub.includes("/")) return sub.split("/").pop() || "";
      const m = String(it.name || "").match(/MX\-([^\-]+)\-/);
      return m?.[1] || "";
    })();
    const inferredModuleBase = it.slotType === "module"
      ? (it.moduleBase || localizedName.replace(/\s*스킬 모듈.*/g, "").trim())
      : it.moduleBase;
    const inferredCoreName = it.slotType === "core" ? (it.coreName || localizedName) : it.coreName;
    const normalized = {
      itemKind: it.itemKind || "mechModule",
      slotType: it.slotType || "module",
      mainType: it.mainType || "메카 장비",
      subType: replaceZweihanderText(it.subType || "기본"),
      name: replaceZweihanderText(localizedName || it.name || "메카 장비"),
      weaponType: normalizeMeleeTypeName(inferredWeaponType) || undefined,
      moduleBase: inferredModuleBase || undefined,
      coreName: inferredCoreName || undefined,
      icon: it.icon || createItemIcon(replaceZweihanderText(localizedName || it.name || "MK").slice(0, 2), "#34536b"),
      atk: it.atk || 0,
      def: it.def || 0,
      hp: it.hp || 0,
      speed: it.speed || 0,
      ...it,
      subType: replaceZweihanderText(it.subType || "기본"),
      name: replaceZweihanderText(localizedName || it.name || "메카 장비"),
      weaponType: normalizeMeleeTypeName(inferredWeaponType) || undefined,
    };
    let id = normalized.id || `${fallbackPrefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    while (usedMechItemIds.has(id)) {
      id = `${fallbackPrefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    }
    normalized.id = id;
    usedMechItemIds.add(id);
    return normalized;
  };
  state.mechs.forEach((m) => {
    m.equippedMelee = normalizeMechItemRecord(m.equippedMelee, `melee-${m.id}`);
    m.equippedFirearm = normalizeMechItemRecord(m.equippedFirearm, `firearm-${m.id}`);
    m.equippedDefense = normalizeMechItemRecord(m.equippedDefense, `defense-${m.id}`);
    m.equippedCore = normalizeMechItemRecord(m.equippedCore, `core-${m.id}`);
    m.equippedModules = (m.equippedModules || []).map((it, idx) => normalizeMechItemRecord(it, `module${idx}-${m.id}`));
  });
  if (!state.activeMechId || !state.mechs.some((m) => m.id === state.activeMechId && m.unlocked)) {
    state.activeMechId = state.mechs.find((m) => m.unlocked)?.id || state.mechs[0]?.id || null;
  }
  const allUnitIds = new Set(getAllUnits().map((u) => u.id));
  const usedPilotIds = new Set();
  state.mechs.forEach((m) => {
    if (!m.pilotId || !allUnitIds.has(m.pilotId) || usedPilotIds.has(m.pilotId)) m.pilotId = null;
    if (m.pilotId) usedPilotIds.add(m.pilotId);
  });
  const activeMech = getMechById(state.activeMechId);
  if (activeMech && !activeMech.pilotId) {
    const candidate = getAllUnits().find((u) => u.deployed && !usedPilotIds.has(u.id)) || getAllUnits().find((u) => !usedPilotIds.has(u.id));
    if (candidate) activeMech.pilotId = candidate.id;
  }
  if (!state.hangarSelectedMechId || !state.mechs.some((m) => m.id === state.hangarSelectedMechId && m.unlocked)) {
    state.hangarSelectedMechId = state.mechs.find((m) => m.unlocked)?.id || null;
  }
  if (!Array.isArray(state.mechInventory) || state.mechInventory.length === 0) state.mechInventory = createMechStarterInventory();
  state.mechInventory = state.mechInventory
    .map((it, idx) => normalizeMechItemRecord(it, `inventory-${idx}`))
    .filter(Boolean);
  if (state.mechInventory.length > 40000) {
    state.mechInventory = state.mechInventory.slice(0, 40000);
  }
  // Heavy roster canonicalization is run on explicit actions (e.g. 자동 성 강화/도감 지급),
  // not during boot, to avoid long blocking on large saves.
  ensureMechWeaponCoverageInventory();
  ensureMechModuleCoverageInventory();
  normalizeMechInventory();
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

const UNIT_PORTRAIT_CACHE = new Map();

function getPortraitImage(unit) {
  const weaponMap = { rifle: "┤", carbine: "┤", shotgun: "╪", blade: "⚔" };
  const symbol = weaponMap[unit.weaponType] || "┤";
  const fill = unit.color || "#9fb2c7";
  const cacheKey = `${symbol}|${fill}`;
  if (UNIT_PORTRAIT_CACHE.has(cacheKey)) return UNIT_PORTRAIT_CACHE.get(cacheKey);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>
    <rect width='96' height='96' rx='14' fill='#132338'/>
    <circle cx='40' cy='48' r='23' fill='${fill}' stroke='#ffffff88' stroke-width='2'/>
    <text x='72' y='54' text-anchor='middle' font-size='20' fill='#fff' font-family='Segoe UI'>${symbol}</text>
  </svg>`;
  const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  UNIT_PORTRAIT_CACHE.set(cacheKey, uri);
  return uri;
}

function getShipPreviewImage(ship) {
  const name = ship?.name || "SHIP";
  const active = ship?.id === state.activeShipId;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 120'>
    <defs>
      <linearGradient id='shipHull' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${active ? "#c5e7ff" : "#8fb7dc"}'/>
        <stop offset='100%' stop-color='${active ? "#4f7ca5" : "#2f4861"}'/>
      </linearGradient>
      <linearGradient id='shipWing' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stop-color='#7eaad0'/>
        <stop offset='100%' stop-color='#2a3f53'/>
      </linearGradient>
    </defs>
    <rect width='220' height='120' rx='12' fill='#13263b'/>
    <ellipse cx='110' cy='82' rx='76' ry='22' fill='#0c1826' opacity='0.82'/>
    <path d='M110 16 L148 34 L162 70 L110 102 L58 70 L72 34 Z' fill='url(#shipHull)' stroke='#d7e8f7' stroke-width='2'/>
    <path d='M26 58 L72 44 L72 76 L26 62 Z' fill='url(#shipWing)' stroke='#9fc2de' stroke-width='1.4'/>
    <path d='M194 58 L148 44 L148 76 L194 62 Z' fill='url(#shipWing)' stroke='#9fc2de' stroke-width='1.4'/>
    <rect x='100' y='34' width='20' height='34' rx='7' fill='#b8d4eb' opacity='0.86'/>
    <circle cx='110' cy='46' r='4.5' fill='#20394c'/>
    <rect x='76' y='68' width='16' height='10' rx='4' fill='#1f3345'/>
    <rect x='128' y='68' width='16' height='10' rx='4' fill='#1f3345'/>
    <circle cx='78' cy='73' r='2.3' fill='#ffd88b'/><circle cx='86' cy='73' r='2.3' fill='#ffd88b'/>
    <circle cx='134' cy='73' r='2.3' fill='#ffd88b'/><circle cx='142' cy='73' r='2.3' fill='#ffd88b'/>
    <text x='110' y='108' text-anchor='middle' font-size='12' fill='#d8e7f4' font-family='Segoe UI'>${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getMechPreviewImage(mech) {
  const name = mech?.name || "MECH";
  const attrColor = getAttributeColor(mech?.attribute || "물리");
  const roleStroke = mech?.role === "경량" ? "#9ce5b2" : mech?.role === "중량" ? "#f0b88f" : "#9ecbff";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 120'>
    <rect width='220' height='120' rx='12' fill='#1a2030'/>
    <ellipse cx='110' cy='84' rx='50' ry='18' fill='#111827' opacity='0.8'/>
    <rect x='90' y='20' width='40' height='28' rx='8' fill='${attrColor}' stroke='${roleStroke}' stroke-width='2.4'/>
    <rect x='78' y='46' width='64' height='34' rx='10' fill='#64748d' stroke='#dbe8f8' stroke-width='2'/>
    <rect x='56' y='48' width='20' height='30' rx='7' fill='#8fa3ba'/>
    <rect x='144' y='48' width='20' height='30' rx='7' fill='#8fa3ba'/>
    <rect x='84' y='82' width='20' height='24' rx='6' fill='#8c9bb0'/>
    <rect x='116' y='82' width='20' height='24' rx='6' fill='#8c9bb0'/>
    <rect x='96' y='54' width='28' height='10' rx='4' fill='#223244'/>
    <circle cx='100' cy='34' r='3.2' fill='#0f1724'/><circle cx='120' cy='34' r='3.2' fill='#0f1724'/>
    <text x='110' y='16' text-anchor='middle' font-size='12' fill='#d8e7f4' font-family='Segoe UI'>${name}</text>
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

function getMechById(id) {
  return (state.mechs || []).find((m) => m.id === id) || null;
}

function getMechPilot(mech) {
  if (!mech?.pilotId) return null;
  return getUnitById(mech.pilotId);
}

function assignPilotToMech(mechId, unitId) {
  const mech = getMechById(mechId);
  if (!mech) return;
  if (!unitId) {
    mech.pilotId = null;
    return;
  }
  const unit = getUnitById(unitId);
  if (!unit) return;
  (state.mechs || []).forEach((m) => {
    if (m.id !== mech.id && m.pilotId === unit.id) m.pilotId = null;
  });
  mech.pilotId = unit.id;
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
  return findAnyItemRefById(itemId)?.item || null;
}

function findAnyItemRefById(itemId) {
  const invIdx = state.inventory.findIndex((it) => it.id === itemId);
  if (invIdx >= 0) return { item: state.inventory[invIdx], where: "inventory", index: invIdx };
  const mechInvIdx = (state.mechInventory || []).findIndex((it) => it.id === itemId);
  if (mechInvIdx >= 0) return { item: state.mechInventory[mechInvIdx], where: "mechInventory", index: mechInvIdx };
  for (const h of state.heroes || []) {
    if (h.equippedMelee?.id === itemId) return { item: h.equippedMelee, where: "hero", owner: h, slot: "equippedMelee" };
    if (h.equippedFirearm?.id === itemId) return { item: h.equippedFirearm, where: "hero", owner: h, slot: "equippedFirearm" };
    if (h.equippedDefense?.id === itemId) return { item: h.equippedDefense, where: "hero", owner: h, slot: "equippedDefense" };
    const gi = (h.equippedGears || []).findIndex((g) => g?.id === itemId);
    if (gi >= 0) return { item: h.equippedGears[gi], where: "hero", owner: h, slot: `equippedGears.${gi}` };
  }
  for (const m of state.mechs || []) {
    if (m.equippedMelee?.id === itemId) return { item: m.equippedMelee, where: "mech", owner: m, slot: "equippedMelee" };
    if (m.equippedFirearm?.id === itemId) return { item: m.equippedFirearm, where: "mech", owner: m, slot: "equippedFirearm" };
    if (m.equippedDefense?.id === itemId) return { item: m.equippedDefense, where: "mech", owner: m, slot: "equippedDefense" };
    if (m.equippedCore?.id === itemId) return { item: m.equippedCore, where: "mech", owner: m, slot: "equippedCore" };
    const mi = (m.equippedModules || []).findIndex((g) => g?.id === itemId);
    if (mi >= 0) return { item: m.equippedModules[mi], where: "mech", owner: m, slot: `equippedModules.${mi}` };
  }
  return null;
}

function inferItemAttribute(item) {
  const direct = getAttributeBase(item?.attribute);
  if (RESOURCE_BY_ATTRIBUTE[direct]) return direct;
  const text = `${item?.name || ""} ${item?.trait || ""} ${item?.description || ""}`;
  for (let i = 0; i < ATTR_ORDER.length; i += 1) {
    const a = ATTR_ORDER[i];
    if (text.includes(a)) return a;
  }
  return "물리";
}

function upgradeItemById(itemId) {
  const ref = findAnyItemRefById(itemId);
  if (!ref?.item) return false;
  const item = ref.item;
  const lv = Number.isFinite(item.upgradeLv) ? item.upgradeLv : 0;
  const tier = parseItemTier(item);
  const costCredit = 140 + lv * 95 + tier * 55;
  const needTerra = 18 + lv * 10 + tier * 4;
  const attr = inferItemAttribute(item);
  const attrResId = getResourceIdForAttribute(attr);
  const attrResName = RESOURCE_DEFS[attrResId]?.name || "속성 자원";
  const needAttr = 12 + lv * 8 + tier * 3;
  if (!spendCredits(costCredit)) {
    alert("크레딧 부족");
    return false;
  }
  if (!state.settings.infinite) {
    if (getResourceAmount("terra_core") < needTerra) {
      state.credits += costCredit;
      alert(`테라코어 부족 (필요 ${needTerra})`);
      return false;
    }
    if (getResourceAmount(attrResId) < needAttr) {
      state.credits += costCredit;
      alert(`${attrResName} 부족 (필요 ${needAttr})`);
      return false;
    }
    spendResource("terra_core", needTerra);
    spendResource(attrResId, needAttr);
  }
  item.upgradeLv = lv + 1;
  item.atk = Math.round((item.atk || 0) + Math.max(1, 1 + tier * 0.6));
  item.def = Math.round((item.def || 0) + Math.max(0, 0.8 + tier * 0.45));
  item.hp = Math.round((item.hp || 0) + Math.max(1, 5 + tier * 2.5));
  item.speed = Number(((item.speed || 0) + 0.08 + tier * 0.03).toFixed(2));
  if (item.attackSpeed) item.attackSpeed = Number((item.attackSpeed * 1.012).toFixed(3));
  if (item.block) item.block = Math.round(item.block + 1 + tier * 0.4);
  if (item.cdr) item.cdr = Number(Math.min(0.35, item.cdr + 0.004 + tier * 0.001).toFixed(3));
  showActionToast(`${item.name} +${item.upgradeLv} 강화 완료 (크레딧 ${costCredit}, 테라코어 ${needTerra}, ${attrResName} ${needAttr})`);
  return true;
}

function upgradeMechById(mechId) {
  const mech = getMechById(mechId);
  if (!mech || !mech.unlocked) return false;
  const level = Math.max(1, Number(mech.level || mech.upgradeLv || 1));
  const maxLevel = getMechMaxLevel(mech);
  if (level >= maxLevel) {
    alert(`강화 한도 도달 (현재 ${level} / 최대 ${maxLevel})`);
    return false;
  }
  const lv = Math.max(0, level - 1);
  const costCredit = 420 + lv * 220;
  const needTerra = 45 + lv * 22;
  const attrResId = getResourceIdForAttribute(mech.attribute || "물리");
  const attrResName = RESOURCE_DEFS[attrResId]?.name || "속성 자원";
  const needAttr = 30 + lv * 16;
  if (!spendCredits(costCredit)) {
    alert("크레딧 부족");
    return false;
  }
  if (!state.settings.infinite) {
    if (getResourceAmount("terra_core") < needTerra) {
      state.credits += costCredit;
      alert(`테라코어 부족 (필요 ${needTerra})`);
      return false;
    }
    if (getResourceAmount(attrResId) < needAttr) {
      state.credits += costCredit;
      alert(`${attrResName} 부족 (필요 ${needAttr})`);
      return false;
    }
    spendResource("terra_core", needTerra);
    spendResource(attrResId, needAttr);
  }
  mech.level = level + 1;
  mech.upgradeLv = mech.level - 1;
  const hpInc = 28 + Math.round(lv * 3.2);
  const atkInc = 5 + Math.round(lv * 0.8);
  const defInc = 4 + Math.round(lv * 0.7);
  const spdInc = 1 + Math.round(lv * 0.25);
  mech.hp = Math.round((mech.hp || 0) + hpInc);
  mech.atk = Math.round((mech.atk || 0) + atkInc);
  mech.def = Math.round((mech.def || 0) + defInc);
  mech.speed = Math.round((mech.speed || 0) + spdInc);
  mech.currentHp = Math.min(mech.hp, Math.max(0, (Number.isFinite(mech.currentHp) ? mech.currentHp : mech.hp) + Math.round(hpInc * 0.5)));
  showActionToast(`${mech.name} Lv.${mech.level} 강화 완료 (크레딧 ${costCredit}, 테라코어 ${needTerra}, ${attrResName} ${needAttr})`);
  return true;
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

  const starMul = getStarMultiplier(unit.star || 0);
  atk = Math.round(atk * starMul);
  def = Math.round(def * starMul);
  hp = Math.round(hp * starMul);
  speed = Number((speed * (1 + getStarValue(unit.star || 0) * 0.035)).toFixed(2));

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
      alert("이 유닛은 방어 무장을 장착할 수 없습니다.");
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
  if (slotKey === "melee") return createItemIcon("근접", "#4b334f");
  if (slotKey === "firearm") return createItemIcon("총기", "#2d4d5f");
  if (slotKey === "defense") return createItemIcon("방어", "#4a3f2b");
  return createItemIcon("장비", "#2f5a3a");
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
  if (slotKey === "melee") {
    if (item.slotType !== "melee") return false;
    if (hero.fixedMeleeType && item.weaponType && item.weaponType !== hero.fixedMeleeType) return false;
    return true;
  }
  if (slotKey === "firearm") {
    if (item.slotType !== "firearm") return false;
    if (hero.fixedFirearmType && item.weaponType && item.weaponType !== hero.fixedFirearmType) return false;
    return true;
  }
  if (slotKey === "defense") return item.slotType === "defense" && hero.canUseDefense;
  if (slotKey === "gear1" || slotKey === "gear2") return item.slotType === "gear";
  return false;
}

function getMechSlotItem(mech, slotKey) {
  if (!mech || !slotKey) return null;
  if (slotKey === "melee") return mech.equippedMelee || null;
  if (slotKey === "firearm") return mech.equippedFirearm || null;
  if (slotKey === "defense") return mech.equippedDefense || null;
  if (slotKey === "core") return mech.equippedCore || null;
  if (slotKey.startsWith("module")) {
    const idx = Number(slotKey.replace("module", ""));
    if (Number.isNaN(idx)) return null;
    return mech.equippedModules?.[idx] || null;
  }
  return null;
}

function setMechSlotItem(mech, slotKey, item) {
  if (!mech || !slotKey) return;
  if (slotKey === "melee") mech.equippedMelee = item || null;
  else if (slotKey === "firearm") mech.equippedFirearm = item || null;
  else if (slotKey === "defense") mech.equippedDefense = item || null;
  else if (slotKey === "core") mech.equippedCore = item || null;
  else if (slotKey.startsWith("module")) {
    const idx = Number(slotKey.replace("module", ""));
    if (Number.isNaN(idx)) return;
    if (!Array.isArray(mech.equippedModules)) mech.equippedModules = [];
    mech.equippedModules[idx] = item || null;
  }
}

function itemFitsMechSlot(item, slotKey) {
  if (!item || !slotKey) return false;
  if (slotKey === "melee") return item.slotType === "melee";
  if (slotKey === "firearm") return item.slotType === "firearm";
  if (slotKey === "defense") return item.slotType === "defense";
  if (slotKey === "core") return item.slotType === "core";
  if (slotKey.startsWith("module")) return item.slotType === "module";
  return false;
}

function unequipMechSlot(mechId, slotKey) {
  const mech = getMechById(mechId);
  if (!mech) return;
  const current = getMechSlotItem(mech, slotKey);
  if (!current) return;
  state.mechInventory.push(current);
  setMechSlotItem(mech, slotKey, null);
}

function equipMechItemToSlot(mechId, itemId, slotKey) {
  const mech = getMechById(mechId);
  const idx = (state.mechInventory || []).findIndex((it) => it.id === itemId);
  if (!mech || idx < 0) return;
  const item = state.mechInventory[idx];
  if (!itemFitsMechSlot(item, slotKey)) return;
  state.mechInventory.splice(idx, 1);
  const old = getMechSlotItem(mech, slotKey);
  if (old) state.mechInventory.push(old);
  setMechSlotItem(mech, slotKey, item);
  normalizeMechInventory();
}

function getPreferredMechSlotForItem(mech, item) {
  if (!mech || !item) return null;
  if (item.slotType === "melee") return "melee";
  if (item.slotType === "firearm") return "firearm";
  if (item.slotType === "defense") return "defense";
  if (item.slotType === "core") return "core";
  if (item.slotType === "module") {
    if (!Array.isArray(mech.equippedModules)) mech.equippedModules = [];
    const emptyIdx = mech.equippedModules.findIndex((x) => !x);
    return emptyIdx >= 0 ? `module${emptyIdx}` : "module0";
  }
  return null;
}

function getAllEquippedMechItemIds() {
  const ids = new Set();
  (state.mechs || []).forEach((m) => {
    [m.equippedMelee, m.equippedFirearm, m.equippedDefense, m.equippedCore].forEach((it) => {
      if (it?.id) ids.add(it.id);
    });
    (m.equippedModules || []).forEach((it) => {
      if (it?.id) ids.add(it.id);
    });
  });
  return ids;
}

function normalizeMechInventory() {
  if (!Array.isArray(state.mechInventory)) state.mechInventory = [];
  const equippedIds = getAllEquippedMechItemIds();
  state.mechInventory = state.mechInventory.filter((it) => !equippedIds.has(it?.id));
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
    alert("해당 슬롯에 장착할 수 없는 아이템입니다.");
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

function takeBestInventoryItem(inventory, predicate, scoreFn) {
  let bestIdx = -1;
  let bestScore = -Infinity;
  inventory.forEach((it, idx) => {
    if (!predicate(it)) return;
    const s = scoreFn(it);
    if (s > bestScore) {
      bestScore = s;
      bestIdx = idx;
    }
  });
  if (bestIdx < 0) return null;
  const [picked] = inventory.splice(bestIdx, 1);
  return picked || null;
}

function heroItemScore(item, slotKey, hero) {
  const tier = parseItemTier(item);
  const atk = item.atk || 0;
  const def = item.def || 0;
  const hp = item.hp || 0;
  const spd = item.speed || 0;
  const range = item.range || 0;
  const aspd = item.attackSpeed || 0;
  const block = item.block || 0;
  const cdr = item.cdr || 0;

  if (slotKey === "melee") {
    const preferred = meleeForRole(hero.roleClass || hero.classType);
    const match = item.weaponType === preferred ? 36 : 0;
    return atk * 5 + aspd * 8 + range * 4 + spd * 2 + tier * 3 + match;
  }
  if (slotKey === "firearm") {
    const wanted = firearmForRange(hero.rangeClass);
    const match = wanted === "AR/LMG" ? (item.weaponType === "AR" || item.weaponType === "LMG") : item.weaponType === wanted;
    const buff = match ? 40 : item.weaponType === "RL" ? 10 : 0;
    return atk * 5 + aspd * 9 + range * 5 + spd * 2 + tier * 3 + buff;
  }
  if (slotKey === "defense") {
    return block * 6 + def * 4 + hp * 1.2 + (item.cooldown ? (18 - item.cooldown * 2) : 0) + tier * 3;
  }
  if (slotKey === "gear1" || slotKey === "gear2") {
    const role = hero.roleClass || hero.classType;
    const wAtk = role === "오펜서" || role === "버서커" || role === "어쌔신" ? 4.2 : 2.4;
    const wDef = role === "디펜서" || role === "어썰트" ? 3.8 : 2.2;
    const wHp = role === "디펜서" || role === "메딕" ? 2.6 : 1.7;
    const wSpd = role === "스커미셔" || role === "어쌔신" || role === "리콘" ? 3.3 : 1.8;
    const wCdr = role === "메딕" || role === "서포터" || role === "스폐셜" ? 140 : 90;
    return atk * wAtk + def * wDef + hp * wHp + spd * wSpd + cdr * wCdr + tier * 3;
  }
  return 0;
}

function autoEquipHeroes() {
  const heroes = [...(state.heroes || [])].sort((a, b) => Number(b.deployed) - Number(a.deployed) || (b.level || 1) - (a.level || 1));
  heroes.forEach((h) => {
    ["melee", "firearm", "defense", "gear1", "gear2"].forEach((slotKey) => {
      if (slotKey === "defense" && !h.canUseDefense) return;
      const cur = getHeroSlotItem(h, slotKey);
      if (cur) {
        state.inventory.push(cur);
        setHeroSlotItem(h, slotKey, null);
      }
    });
    if (Array.isArray(h.equippedGears)) h.equippedGears = h.equippedGears.filter(Boolean);
    const order = ["melee", "firearm", ...(h.canUseDefense ? ["defense"] : []), "gear1", "gear2"];
    order.forEach((slotKey) => {
      const picked = takeBestInventoryItem(
        state.inventory,
        (it) => itemFitsSlot(it, slotKey, h),
        (it) => heroItemScore(it, slotKey, h),
      );
      if (picked) setHeroSlotItem(h, slotKey, picked);
    });
    if (Array.isArray(h.equippedGears)) h.equippedGears = h.equippedGears.filter(Boolean);
  });
}

function mechItemScore(item, slotKey, mech) {
  const tier = parseItemTier(item);
  const atk = item.atk || 0;
  const def = item.def || 0;
  const hp = item.hp || 0;
  const spd = item.speed || 0;
  const range = item.range || 0;
  const aspd = item.attackSpeed || 0;
  const block = item.block || 0;
  if (slotKey === "melee") return atk * 5 + aspd * 7 + range * 4 + tier * 3;
  if (slotKey === "firearm") return atk * 5 + aspd * 8 + range * 5 + tier * 3;
  if (slotKey === "defense") return block * 6 + def * 4 + hp * 1.2 + tier * 3;
  if (slotKey === "core") {
    const name = item.coreName || item.name;
    const bonus = mech.coreSkill && mech.coreSkill === name ? 40 : 0;
    return atk * 2 + def * 2 + hp * 1.5 + spd * 2 + tier * 3 + bonus;
  }
  if (slotKey.startsWith("module")) return atk * 3 + def * 3 + hp * 1.6 + spd * 3 + tier * 3;
  return 0;
}

function autoEquipMechs() {
  const mechs = [...(state.mechs || [])].filter((m) => m.unlocked).sort((a, b) => Number(b.id === state.activeMechId) - Number(a.id === state.activeMechId));
  mechs.forEach((m) => {
    const slots = ["melee", "firearm", "defense", "module0", "module1", "module2", "core"];
    slots.forEach((slotKey) => {
      const cur = getMechSlotItem(m, slotKey);
      if (cur) {
        state.mechInventory.push(cur);
        setMechSlotItem(m, slotKey, null);
      }
    });
    const pickSlots = ["melee", "firearm", "defense", "core", "module0", "module1", "module2"];
    pickSlots.forEach((slotKey) => {
      const picked = takeBestInventoryItem(
        state.mechInventory,
        (it) => itemFitsMechSlot(it, slotKey),
        (it) => mechItemScore(it, slotKey, m),
      );
      if (picked) setMechSlotItem(m, slotKey, picked);
    });
  });
  normalizeMechInventory();
}

function getPlanetPreferredAttribute(planetId = state.selectedPlanetId) {
  const planet = getPlanetById(planetId);
  if (!planet) return "물리";
  const resId = getPlanetResourceId(planet);
  const entry = Object.entries(RESOURCE_BY_ATTRIBUTE).find(([, rid]) => rid === resId);
  return entry?.[0] || "물리";
}

function resolveAutoDeployAttribute(mode = state.autoDeployMode) {
  if (mode === "planet") return getPlanetPreferredAttribute();
  if (mode === "all") return null;
  if (ATTR_ORDER.includes(mode)) return mode;
  return getPlanetPreferredAttribute();
}

function autoDeployModeLabel(mode = state.autoDeployMode) {
  if (mode === "planet") return `행성 권장 (${getPlanetPreferredAttribute()})`;
  if (mode === "all") return "전체 균형";
  if (ATTR_ORDER.includes(mode)) return `${mode} 속성`;
  return "행성 권장";
}

function autoDeployUnitsByPreference(mode = state.autoDeployMode) {
  const preferredAttr = resolveAutoDeployAttribute(mode);
  const deployCap = getDeployCapacity();
  const all = sortUnitsGrouped(getAllUnits());
  const classKey = (u) => u.roleClass || u.classType || "오펜서";
  const score = (u, classCounts = {}) => {
    const attr = getAttributeBase(u.attribute || "물리");
    const attrScore = preferredAttr ? (attr === preferredAttr ? 2400 : attr === "물리" ? 120 : -220) : 0;
    const starScore = getStarValue(u.star) * 520;
    const levelScore = (u.level || 1) * 28;
    const shieldScore = u.canUseDefense ? 780 : 0;
    const cls = classKey(u);
    const diversityPenalty = (classCounts[cls] || 0) * 220;
    const roleBonus = ["오펜서", "디펜서", "서포터", "메딕"].includes(cls) ? 40 : 0;
    return attrScore + starScore + levelScore + shieldScore + roleBonus - diversityPenalty;
  };
  const picked = [];
  const pickedIds = new Set();
  const classCounts = {};
  // 1) 클래스 다양성 우선: 각 클래스에서 최고 점수 1명씩 선발
  ROLE_ORDER.forEach((rc) => {
    if (picked.length >= deployCap) return;
    const cands = all.filter((u) => !pickedIds.has(u.id) && classKey(u) === rc);
    if (!cands.length) return;
    cands.sort((a, b) => score(b, classCounts) - score(a, classCounts));
    const top = cands[0];
    if (!top) return;
    picked.push(top);
    pickedIds.add(top.id);
    classCounts[rc] = (classCounts[rc] || 0) + 1;
  });
  // 2) 남는 슬롯은 우선순위(속성/방패/성/레벨) + 클래스 중복 페널티로 선발
  while (picked.length < deployCap) {
    let best = null;
    let bestScore = -Infinity;
    all.forEach((u) => {
      if (pickedIds.has(u.id)) return;
      const s = score(u, classCounts);
      if (s > bestScore) {
        bestScore = s;
        best = u;
      }
    });
    if (!best) break;
    picked.push(best);
    pickedIds.add(best.id);
    const rc = classKey(best);
    classCounts[rc] = (classCounts[rc] || 0) + 1;
  }
  getAllUnits().forEach((u) => {
    u.deployed = pickedIds.has(u.id);
  });
  return { preferredAttr: preferredAttr || "전체", deployed: picked.length, modeLabel: autoDeployModeLabel(mode) };
}

function autoAssignMechsByPreference(mode = state.autoDeployMode) {
  const preferredAttr = resolveAutoDeployAttribute(mode);
  const deployedUnits = sortUnitsGrouped(getAllUnits().filter((u) => u.deployed));
  const unlocked = (state.mechs || []).filter((m) => m.unlocked);
  const rangeIdx = (r) => Math.max(0, RANGE_ORDER.indexOf(r || "중거리"));
  const roleSynergy = {
    오펜서: ["오펜서", "버서커", "어쌔신"],
    디펜서: ["디펜서", "어썰트", "버서커"],
    스커미셔: ["스커미셔", "어쌔신", "리콘"],
    버서커: ["버서커", "오펜서", "디펜서"],
    어쌔신: ["어쌔신", "스커미셔", "리콘"],
    어썰트: ["어썰트", "디펜서", "버서커"],
    리콘: ["리콘", "스커미셔", "어쌔신"],
    서포터: ["서포터", "리콘", "스폐셜"],
    메딕: ["메딕", "서포터", "디펜서"],
    스폐셜: ["스폐셜", "리콘", "서포터"],
  };
  const pairScore = (u, m) => {
    const uAttr = getAttributeBase(u.attribute || "물리");
    const mAttr = getAttributeBase(m.attribute || "물리");
    const attrScore = preferredAttr
      ? (mAttr === preferredAttr ? 1800 : uAttr === mAttr ? 1200 : mAttr === "물리" ? 220 : 0)
      : (uAttr === mAttr ? 1900 : mAttr === "물리" ? 320 : 80);

    const dr = Math.abs(rangeIdx(u.rangeClass) - rangeIdx(m.rangeClass));
    const rangeScore = dr === 0 ? 1300 : dr === 1 ? 700 : dr === 2 ? 220 : 0;

    const role = u.roleClass || u.classType || "오펜서";
    const mechClass = m.mechClass || "오펜서";
    const pref = roleSynergy[role] || [];
    const roleScore = mechClass === role ? 1100 : pref.includes(mechClass) ? 650 : 120;

    const quality = getStarValue(m.star) * 260 + (m.level || 1) * 12 + (m.hp || 0) * 0.025 + (m.atk || 0) * 0.55 + (m.def || 0) * 0.42;
    return attrScore + rangeScore + roleScore + quality;
  };

  // 자동 배치 시에는 출격 인원만 탑승 대상으로 사용
  unlocked.forEach((m) => {
    m.pilotId = null;
  });
  if (!deployedUnits.length || !unlocked.length) return { preferredAttr, assigned: 0 };

  // 유닛별 궁합 점수가 가장 높은 메카를 1:1로 배정 (그리디)
  const remaining = [...unlocked];
  const unitsByPriority = [...deployedUnits].sort((a, b) => {
    const sa = getStarValue(b.star) - getStarValue(a.star);
    if (sa) return sa;
    const lv = (b.level || 1) - (a.level || 1);
    if (lv) return lv;
    return String(a.name || "").localeCompare(String(b.name || ""), "ko");
  });

  let count = 0;
  let firstAssigned = null;
  const assignCount = Math.min(unitsByPriority.length, remaining.length);
  for (let i = 0; i < assignCount; i += 1) {
    const unit = unitsByPriority[i];
    let bestIdx = 0;
    let bestScore = -Infinity;
    for (let j = 0; j < remaining.length; j += 1) {
      const s = pairScore(unit, remaining[j]);
      if (s > bestScore) {
        bestScore = s;
        bestIdx = j;
      }
    }
    const [picked] = remaining.splice(bestIdx, 1);
    if (!picked) continue;
    picked.pilotId = unit.id;
    if (!firstAssigned) firstAssigned = picked.id;
    count += 1;
  }

  if (firstAssigned) state.activeMechId = firstAssigned;
  return { preferredAttr: preferredAttr || "전체", assigned: count, modeLabel: autoDeployModeLabel(mode) };
}

function openUnitDetail(unitId, opts = {}) {
  const unit = getUnitById(unitId);
  if (!unit || !ui.unitDetailModal) return;
  const readOnly = !!opts.readOnly;
  state.selectedUnitDetailId = unitId;
  const s = calculateUnitStats(unit);
  const level = unit.level || 1;
  const maxLevel = getUnitMaxLevel(unit);
  const star = getStarValue(unit.star);
  const starDots = getStarDots(star);
  const sameCount = getOwnedUnitCountByPromotionGroup(unit);
  const promoteNeed = getPromotionCostByStar(star);
  const duplicateCount = Math.max(0, sameCount - 1);
  const upgradeCredit = 180 + level * 120;
  const upgradeTerra = 20 + level * 12;
  const attrResId = getResourceIdForAttribute(unit.attribute);
  const attrResName = RESOURCE_DEFS[attrResId]?.name || "속성 자원";
  const upgradeAttr = 12 + level * 8;
  const deployed = getAllUnits().filter((u) => u.deployed);
  const teamCounts = getTeamCounts(deployed);
  const teamActive = isTeamEffectActive(unit, teamCounts);
  const rangeColor = RANGE_META[unit.rangeClass]?.color || "#9a9a9a";
  if (ui.unitDetailTitle) ui.unitDetailTitle.textContent = `${unit.name} 상세 정보${readOnly ? " (도감)" : ""}`;
  if (ui.unitDetailBody) {
    ui.unitDetailBody.innerHTML = `
      <div class="base-card">
        <div>분류: ${unit.unitType === "merc" ? "용병" : "히어로"} / 역할군: ${unit.roleClass || unit.classType || "-"}</div>
        <div>사거리: <span class="range-chip" style="background:${rangeColor}">${unit.rangeClass || "-"}</span></div>
        <div>속성: ${unit.attribute || "물리"} (${ATTRIBUTE_META[(unit.attribute || "물리").split("/")[0]]?.effect || "-"})</div>
        <div>성급: ${starDots} (${star}성)</div>
        <div>레벨: ${unit.level || 1} / 최대 ${maxLevel}</div>
        <div>고정 무장: 근접 ${unit.fixedMeleeType || "-"} / 총기 ${unit.fixedFirearmType || "-"} / 실드 ${unit.canUseDefense ? "가능" : "불가"}</div>
        <div>공격력 ${s.atk} / 방어력 ${s.def} / 체력 ${s.hp} / 스피드 ${s.speed}</div>
        <div>고유 능력: ${unit.ability || "-"}</div>
        ${readOnly ? "" : `<div>강화 비용: 크레딧 ${upgradeCredit} / 테라코어 ${upgradeTerra} / ${attrResName} ${upgradeAttr}</div>`}
      </div>
      <div class="base-card">
        <strong>팀</strong>
        <div>${unit.team || "무소속"}</div>
        <div>세트 효과: ${unit.teamEffect || "없음"}</div>
        <div>현재 발동 상태: ${teamActive ? "발동 중" : "비활성(같은 팀 2인 이상 출격 필요)"}</div>
      </div>
      ${readOnly ? `<div class="base-card"><strong>도감 정보</strong><div>도감은 유닛 종류의 기본 정보만 표시합니다.</div></div>` : `<div class="base-card">
        <strong>장착 정보</strong>
        ${
          unit.unitType === "hero"
            ? `<div>근접: ${unit.equippedMelee?.name || "없음"}</div>
               <div>총기: ${unit.equippedFirearm?.name || "없음"}</div>
               <div>방어: ${unit.equippedDefense?.name || "없음"}</div>
               <div>장비1: ${unit.equippedGears?.[0]?.name || "없음"}</div>
               <div>장비2: ${unit.equippedGears?.[1]?.name || "없음"}</div>`
            : `<div>근접: ${unit.equippedMelee?.name || "-"}</div>
               <div>총기: ${unit.equippedFirearm?.name || "-"}</div>
               <div>방어: ${unit.equippedDefense?.name || "-"}</div>
               <div>랜덤 장비 세트: ${unit.randomLoadout || "-"}</div>`
        }
      </div>`}
    `;
  }
  const upBtn = document.getElementById("unitUpgradeBtn");
  if (upBtn) {
    if (readOnly) {
      upBtn.textContent = "도감 전용";
      upBtn.disabled = true;
    } else {
      const cost = 180 + (unit.level || 1) * 120;
      upBtn.textContent = `강화 (${cost} 크레딧)`;
      upBtn.disabled = (unit.level || 1) >= maxLevel;
    }
  }
  const promoteBtn = document.getElementById("unitPromoteBtn");
  if (promoteBtn) {
    if (readOnly) {
      promoteBtn.textContent = "도감 전용";
      promoteBtn.disabled = true;
    } else {
      promoteBtn.textContent = `성 강화 (중복 1개 필요 / 현재 중복 ${duplicateCount}개)`;
      promoteBtn.disabled = star >= 10 || duplicateCount < promoteNeed;
    }
  }
  ui.unitDetailModal.classList.remove("hidden");
}

function openUnitCodexDetailByKey(codexKey) {
  const row = getUnitCodexEntries().find((x) => x.key === codexKey);
  if (!row || !ui.unitDetailModal) return;
  state.selectedUnitDetailId = null;
  const rangeColor = RANGE_META[row.rangeClass]?.color || "#9a9a9a";
  if (ui.unitDetailTitle) ui.unitDetailTitle.textContent = `${row.name} 상세 정보 (도감)`;
  if (ui.unitDetailBody) {
    ui.unitDetailBody.innerHTML = `
      <div class="base-card">
        <div>분류: ${row.unitType === "merc" ? "용병" : "히어로"} / 역할군: ${row.roleClass || "-"}</div>
        <div>사거리: <span class="range-chip" style="background:${rangeColor}">${row.rangeClass || "-"}</span></div>
        <div>속성: ${row.attribute || "물리"}</div>
        <div>성급: ${getStarDots(row.star || 0)} (${getStarValue(row.star || 0)}성)</div>
        <div>고정 무장: 근접 ${row.fixedMeleeType || "-"} / 총기 ${row.fixedFirearmType || "-"} / 실드 ${row.canUseDefense ? "가능" : "불가"}</div>
        <div>공격력 ${row.atk || 0} / 방어력 ${row.def || 0} / 체력 ${row.hp || 0} / 스피드 ${row.speed || 0}</div>
        <div>고유 능력: ${row.ability || "-"}</div>
      </div>
      <div class="base-card"><strong>도감 정보</strong><div>도감은 유닛 종류의 기본 정보만 표시합니다.</div></div>
    `;
  }
  const upBtn = document.getElementById("unitUpgradeBtn");
  if (upBtn) {
    upBtn.textContent = "도감 전용";
    upBtn.disabled = true;
  }
  const promoteBtn = document.getElementById("unitPromoteBtn");
  if (promoteBtn) {
    promoteBtn.textContent = "도감 전용";
    promoteBtn.disabled = true;
  }
  ui.unitDetailModal.classList.remove("hidden");
}

function openMechCodexDetail(codexKey) {
  const row = getMechCodexEntries().find((x) => x.key === codexKey);
  if (!row || !row.owned || !ui.unitDetailModal) return;
  state.selectedUnitDetailId = null;
  if (ui.unitDetailTitle) ui.unitDetailTitle.textContent = `${row.name} 상세 정보`;
  if (ui.unitDetailBody) {
    ui.unitDetailBody.innerHTML = `
      <div class="base-card">
        <div class="hangar-preview"><img src="${getMechPreviewImage({ name: row.name, attribute: row.attribute, role: row.role })}" alt="${row.name} 이미지" /></div>
        <div>성급: ${getStarDots(row.star)} (${getStarValue(row.star)}성)</div>
        <div>보유 수량: ${row.ownedCount}</div>
        <div>무게: ${row.role} / 사거리: ${row.rangeClass} / 속성: ${row.attribute} / 클래스: ${row.mechClass || "-"}</div>
        <div>코어 스킬: ${row.coreSkill}</div>
        <div>능력치: 공 ${row.atk} / 방 ${row.def} / 체 ${row.hp} / 속 ${row.speed}</div>
      </div>
      <div class="base-card">
        <div>메카 성 강화는 도감 카드의 '성 강화' 버튼으로 진행합니다.</div>
        <div>메카 무장 편집/수리는 격납고 메카 탭에서 가능합니다.</div>
      </div>
    `;
  }
  const upBtn = document.getElementById("unitUpgradeBtn");
  if (upBtn) {
    upBtn.textContent = "메카 강화는 격납고에서";
    upBtn.disabled = true;
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
  const lv = Number.isFinite(item.upgradeLv) ? item.upgradeLv : 0;
  const tier = parseItemTier(item);
  const costCredit = 140 + lv * 95 + tier * 55;
  const needTerra = 18 + lv * 10 + tier * 4;
  const attr = inferItemAttribute(item);
  const attrResId = getResourceIdForAttribute(attr);
  const attrResName = RESOURCE_DEFS[attrResId]?.name || "속성 자원";
  const needAttr = 12 + lv * 8 + tier * 3;
  if (ui.itemDetailTitle) ui.itemDetailTitle.textContent = `${item.name} 정보`;
  if (ui.itemDetailBody) {
    ui.itemDetailBody.innerHTML = `
      <div class="base-card">
        <div>강화 레벨: +${lv}</div>
        <div>분류: ${item.mainType || (item.itemKind === "weapon" ? "무기" : "장비")} - ${item.subType || "-"}</div>
        <div>공 ${item.atk || 0} / 방 ${item.def || 0} / 체 ${item.hp || 0} / 속 ${item.speed || 0}</div>
        ${item.range ? `<div>사거리: ${item.range}</div>` : ""}
        ${item.attackSpeed ? `<div>공격 속도: ${item.attackSpeed}</div>` : ""}
        ${item.block ? `<div>방어력: ${item.block} / 범위: ${item.blockRadius || 0} / 쿨: ${item.cooldown || 0}s</div>` : ""}
        ${item.cdr ? `<div>스킬 쿨타임 감소: ${Math.round(item.cdr * 100)}%</div>` : ""}
        <div>특징: ${item.trait || "-"}</div>
        <div>강화 비용: 크레딧 ${costCredit} / 테라코어 ${needTerra} / ${attrResName} ${needAttr}</div>
        <div>${item.description || ""}</div>
      </div>
    `;
  }
  if (ui.itemUpgradeBtn) ui.itemUpgradeBtn.disabled = false;
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
  const maxLevel = getUnitMaxLevel(unit);
  if (level >= maxLevel) {
    alert(`강화 한도 도달 (현재 ${level} / 최대 ${maxLevel})`);
    return;
  }
  const cost = 180 + level * 120;
  const attrResId = getResourceIdForAttribute(unit.attribute);
  const attrResName = RESOURCE_DEFS[attrResId]?.name || "속성 자원";
  const needTerra = 20 + level * 12;
  const needAttr = 12 + level * 8;
  if (!spendCredits(cost)) {
    alert("크레딧 부족");
    return;
  }
  if (!state.settings.infinite) {
    if (getResourceAmount("terra_core") < needTerra) {
      state.credits += cost;
      alert(`테라코어 부족 (필요 ${needTerra})`);
      return;
    }
    if (getResourceAmount(attrResId) < needAttr) {
      state.credits += cost;
      alert(`${attrResName} 부족 (필요 ${needAttr})`);
      return;
    }
    spendResource("terra_core", needTerra);
    spendResource(attrResId, needAttr);
  }
  unit.level = level + 1;
  unit.atk += 2;
  unit.def += 1;
  unit.hp += 10;
  unit.speed += 0.5;
  showActionToast(`${unit.name} Lv.${unit.level} 강화 완료 (크레딧 ${cost}, 테라코어 ${needTerra}, ${attrResName} ${needAttr})`);
  updateTopbar();
  openUnitDetail(unitId);
}

function addRewards(credit, resource, ratio = 1) {
  if (state.settings.infinite) return;
  addCredits(Math.round(credit * ratio));
  addResource("terra_core", Math.round(resource * ratio));
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
  if (!isQuestCompletable(q)) {
    alert("목표를 먼저 달성해야 합니다.");
    return;
  }
  addRewards(q.rewardCredit, q.rewardResource, 1);
  replaceQuestById(id);
  updateTopbar();
}

function completeAllCompletableQuests() {
  const ids = (state.quests || []).filter((q) => isQuestCompletable(q)).map((q) => q.id);
  if (!ids.length) return 0;
  ids.forEach((id) => completeQuestById(id));
  return ids.length;
}

function rerollQuestById(id) {
  const q = state.quests.find((x) => x.id === id);
  if (!q) return;
  const cost = 120 + q.stars * 45;
  if (!spendCredits(cost)) {
    alert("크레딧 부족");
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
  if (ui.emergencyToast) {
    ui.emergencyToast.style.left = "18px";
    ui.emergencyToast.style.top = "68px";
    ui.emergencyToast.style.bottom = "auto";
    ui.emergencyToast.classList.remove("hidden");
  }
  if (ui.emergencyToastTimer) {
    ui.emergencyToastTimer.textContent = `남은 시간: ${formatDuration(remain)}`;
  }
}

function renderFacilityContent(tab) {
  ensureResourceState();
  ensureTradeState();
  ensurePrisonState();
  const prevBaseScrollTop = ui.baseContent ? ui.baseContent.scrollTop : 0;
  const prevUnitScrollMap = new Map();
  if (ui.baseContent) {
    [...ui.baseContent.querySelectorAll(".unit-scroll")].forEach((el, idx) => {
      const key = el.getAttribute("data-scroll-key") || `idx:${idx}`;
      prevUnitScrollMap.set(key, el.scrollTop);
    });
  }
  let html = "";
  if (tab === "hq") {
    let squad = [...state.heroes, ...state.mercs];
    const completableCount = (state.quests || []).filter((q) => isQuestCompletable(q)).length;
    html += `<div class="row">
      <button data-hq-view="quests" ${state.hqView === "quests" ? "disabled" : ""}>퀘스트</button>
      <button data-hq-view="squad" ${state.hqView === "squad" ? "disabled" : ""}>출격 인원</button>
      <button data-hq-view="gear" ${state.hqView === "gear" ? "disabled" : ""}>장비 및 무기</button>
      <button data-hq-view="codex" ${state.hqView === "codex" ? "disabled" : ""}>도감</button>
    </div>`;
    html += `<div class="row"><button data-action="complete-quests-auto" ${completableCount > 0 ? "" : "disabled"}>완료 퀘스트 자동 수령 (${completableCount})</button></div>`;

    if (state.hqView === "quests") {
      html += `<div class="base-card"><strong>퀘스트 관리</strong><div>일반 퀘스트 10개가 유지되며, 완료 시 새 퀘스트가 즉시 보충됩니다.</div></div>`;
      if (state.emergencyQuest) {
        const remain = Math.max(0, state.emergencyQuest.expiresAt - Date.now());
        html += `<div class="base-card quest-emergency">
          <strong>긴급 퀘스트 (최우선)</strong>
          <div>${state.emergencyQuest.title}</div>
          <div>난이도: ${"★".repeat(state.emergencyQuest.stars)} (${state.emergencyQuest.stars}성)</div>
          <div>보상: 크레딧 ${state.emergencyQuest.rewardCredit} / 테라코어 ${state.emergencyQuest.rewardResource}</div>
          <div>남은 시간: ${formatDuration(remain)}</div>
          <button data-action="complete-emergency">긴급 퀘스트 완료 처리</button>
        </div>`;
      }
      html += `<div class="quest-list">`;
      state.quests.forEach((q, idx) => {
        const cost = 120 + q.stars * 45;
        const canComplete = isQuestCompletable(q);
        html += `<div class="base-card quest-card">
          <div><strong>${idx + 1}. ${q.title}</strong></div>
          <div>난이도: ${"★".repeat(q.stars)} (${q.stars}성)</div>
          <div>목표: ${q.objectiveText || "작전 목표 달성"}</div>
          <div>${questProgressText(q)}</div>
          <div>보상: 크레딧 ${q.rewardCredit} / 테라코어 ${q.rewardResource}</div>
          <div class="row">
            <button data-action="complete-quest" data-id="${q.id}" ${canComplete ? "" : "disabled"}>${canComplete ? "미션완료" : "진행 중"}</button>
            <button data-action="reroll-quest" data-id="${q.id}">교체 (${cost} 크레딧)</button>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    if (state.hqView === "squad") {
      const deployed = sortUnitsGrouped(squad.filter((u) => u.deployed));
      const reserveAll = sortUnitsGrouped(squad.filter((u) => !u.deployed));
      const reserve = reserveAll.filter(unitMatchesReserveFilter);
      const deployCap = getDeployCapacity();
      const reserveCap = getReserveCapacity();
      const reservePageSize = 1000;
      const reserveMaxPage = Math.max(1, Math.ceil(reserve.length / reservePageSize));
      state.hqReservePage = clamp(state.hqReservePage || 1, 1, reserveMaxPage);
      const reserveStart = (state.hqReservePage - 1) * reservePageSize;
      const reservePageItems = reserve.slice(reserveStart, reserveStart + reservePageSize);
      const card = (u) => {
        const rangeColor = RANGE_META[u.rangeClass]?.color || "#9a9a9a";
        return `<div class="unit-card" draggable="true" data-unit-id="${u.id}">
          <div class="card-q q-tl"><img src="${getClassMarkImage(u)}" alt="클래스 마크" /></div>
          <div class="card-q q-tr"><img src="${getPortraitImage(u)}" alt="인원 이미지" /></div>
          <div class="card-q q-bl"><img src="${getAbilityImage(u)}" alt="능력 이미지" /></div>
          <div class="card-q q-br">
            <strong>${u.name}</strong>
            <span>${u.unitType === "merc" ? "용병" : "히어로"}</span>
            <span>${getStarDots(u.star || 0)}</span>
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
      html += `<div class="base-card"><strong>출격 인원 배치</strong><div>카드를 드래그해 배치합니다. 기본 슬롯은 5x10이며, 보유 인원 구역은 인원 수에 따라 확장됩니다.</div><div class="row"><label>배치 기준</label><select data-auto-deploy-mode="1"><option value="planet" ${state.autoDeployMode === "planet" ? "selected" : ""}>행성 권장 속성</option><option value="all" ${state.autoDeployMode === "all" ? "selected" : ""}>전체 균형</option>${ATTR_ORDER.map((a) => `<option value="${a}" ${state.autoDeployMode === a ? "selected" : ""}>${a} 속성</option>`).join("")}</select><button data-action="auto-deploy-units">자동 배치</button><button data-action="clear-all-deployed">출격 인원 전원 해제</button><button data-action="auto-promote-all-units">자동 성 강화(전체)</button><button data-action="force-fix-units">유닛 데이터 강제 정리</button></div></div>`;
      html += `<div class="base-card">
        <strong>보유 인원 분류</strong>
        <div class="row">
          <label>클래스</label>
          <select data-filter-key="roleClass">
            <option value="all" ${state.hqReserveFilter.roleClass === "all" ? "selected" : ""}>전체</option>
            ${ROLE_ORDER.map((r) => `<option value="${r}" ${state.hqReserveFilter.roleClass === r ? "selected" : ""}>${r}</option>`).join("")}
          </select>
          <label>속성</label>
          <select data-filter-key="attribute">
            <option value="all" ${state.hqReserveFilter.attribute === "all" ? "selected" : ""}>전체</option>
            ${ATTR_ORDER.map((a) => `<option value="${a}" ${state.hqReserveFilter.attribute === a ? "selected" : ""}>${a}</option>`).join("")}
          </select>
          <label>사거리</label>
          <select data-filter-key="rangeClass">
            <option value="all" ${state.hqReserveFilter.rangeClass === "all" ? "selected" : ""}>전체</option>
            ${RANGE_ORDER.map((r) => `<option value="${r}" ${state.hqReserveFilter.rangeClass === r ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </div>
      </div>`;
      html += `<div class="squad-layout">
        <div class="squad-zone" data-drop-zone="deployed">
          <h4>출격 인원 (왼쪽) ${deployed.length}/${deployCap} - 우주선: ${getActiveShip().name}</h4>
          <div class="unit-scroll" data-scroll-zone="deployed">
            <div class="unit-grid">${renderSlots(deployed, deployCap)}</div>
          </div>
        </div>
        <div class="squad-zone" data-drop-zone="reserve">
          <h4>보유 인원 (오른쪽) 필터 ${reserve.length}명 / 전체 ${reserveAll.length}명 / 슬롯 ${reserveCap}</h4>
          <div class="row">
            <button data-action="hq-reserve-page" data-id="prev" ${state.hqReservePage <= 1 ? "disabled" : ""}>이전</button>
            <div>페이지 ${state.hqReservePage}/${reserveMaxPage}</div>
            <button data-action="hq-reserve-page" data-id="next" ${state.hqReservePage >= reserveMaxPage ? "disabled" : ""}>다음</button>
          </div>
          <div class="unit-scroll" data-scroll-zone="reserve">
            <div class="unit-grid">${
              reservePageItems.length
                ? reservePageItems.map((u) => `<div class="unit-slot filled">${card(u)}</div>`).join("")
                : `<div class="base-card">표시할 인원이 없습니다.</div>`
            }</div>
          </div>
        </div>
      </div>`;
    }

    if (state.hqView === "gear") {
      const selectedHero = getHeroById(state.hqSelectedHeroId) || state.heroes[0];
      if (selectedHero) state.hqSelectedHeroId = selectedHero.id;
      const gearFilter = state.hqGearFilter || "all";
      const filteredGearInventory = (state.inventory || []).filter((it) => {
        if (gearFilter === "all") return true;
        if (gearFilter === "melee") return it.slotType === "melee";
        if (gearFilter === "firearm") return it.slotType === "firearm";
        if (gearFilter === "defense") return it.slotType === "defense";
        if (gearFilter === "gear") return it.slotType === "gear";
        return true;
      });
      const slotCard = (slotKey, label) => {
        const it = getHeroSlotItem(selectedHero, slotKey);
        const canDrop = slotKey !== "defense" || selectedHero?.canUseDefense;
        const dis = canDrop ? "" : " disabled-slot";
        if (!it) {
          return `<div class="equip-slot${dis}" data-equip-slot="${slotKey}" data-hero-id="${selectedHero?.id || ""}">
            <div class="slot-title">${label}</div>
            <div class="slot-empty">${canDrop ? "드래그 장착" : "장착 불가"}</div>
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
      html += `<div class="base-card"><strong>장비 및 무기</strong><div>히어로는 근접/총기 2무장 + (가능시 방어무장) + 장비 2칸을 사용합니다. 카드 클릭 시 정보 확인, 드래그로 배치 가능합니다.</div><div class="row"><button data-action="auto-equip-units">자동 장착</button></div></div>`;
      html += `<div class="gear-layout">
        <div class="base-card hero-slot-area" data-drop-hero="${state.hqSelectedHeroId || ""}">
          <h4>히어로 목록</h4>
          <div class="hero-grid">
            ${state.heroes
              .slice()
              .sort((a, b) => {
                const n = String(a?.name || "").localeCompare(String(b?.name || ""), "ko");
                if (n) return n;
                return String(a?.id || "").localeCompare(String(b?.id || ""), "ko");
              })
              .map((h) => {
                const selected = h.id === state.hqSelectedHeroId ? " selected-hero" : "";
                const s = calculateUnitStats(h);
                const miniSlot = (slotKey, label) => {
                  const it = getHeroSlotItem(h, slotKey);
                  const canDrop = slotKey !== "defense" || h.canUseDefense;
                  const dis = canDrop ? "" : " disabled-slot";
                  if (!it) {
                    return `<div class="equip-slot${dis}" data-equip-slot="${slotKey}" data-hero-id="${h.id}">
                      <div class="slot-title">${label}</div>
                      <div class="slot-empty">${canDrop ? "빈 슬롯" : "불가"}</div>
                    </div>`;
                  }
                  return `<div class="equip-slot filled${dis}" data-equip-slot="${slotKey}" data-hero-id="${h.id}">
                    <div class="slot-title">${label}</div>
                    <div class="equipped-item" draggable="true" data-equipped-id="${it.id}" data-hero-id="${h.id}" data-slot-key="${slotKey}">
                      <img src="${it.icon}" alt="icon"/>
                      <div><strong>${it.name}</strong><div>${it.mainType}/${it.subType}</div></div>
                    </div>
                  </div>`;
                };
                return `<div class="hero-select${selected}" data-id="${h.id}" data-drop-hero="${h.id}">
                  <button data-action="select-hero" data-id="${h.id}"><strong>${h.name}</strong></button>
                  <div>${getStarDots(h.star || 0)} / Lv.${h.level || 1}/${getUnitMaxLevel(h)}</div>
                  <div>고정 무장: ${h.fixedMeleeType || "-"} / ${h.fixedFirearmType || "-"} / 실드 ${h.canUseDefense ? "가능" : "불가"}</div>
                  <div>공 ${s.atk} / 방 ${s.def} / 체 ${s.hp} / 속 ${s.speed}</div>
                  <div>능력: ${h.ability || "-"}</div>
                  <div class="equip-board mini-hero-equip">
                    ${miniSlot("melee", "근접")}
                    ${miniSlot("firearm", "총기")}
                    ${miniSlot("defense", "방어")}
                    ${miniSlot("gear1", "장비1")}
                    ${miniSlot("gear2", "장비2")}
                  </div>
                </div>`;
              })
              .join("")}
          </div>
          <div class="row">
            <button data-action="unequip-melee" data-id="${state.hqSelectedHeroId}">근접 해제</button>
            <button data-action="unequip-firearm" data-id="${state.hqSelectedHeroId}">총기 해제</button>
            <button data-action="unequip-defense" data-id="${state.hqSelectedHeroId}">방어 해제</button>
            <button data-action="unequip-gears" data-id="${state.hqSelectedHeroId}">장비 해제</button>
          </div>
          <div class="equip-board">
            ${slotCard("melee", "근접 무장")}
            ${slotCard("firearm", "총기 무장")}
            ${slotCard("defense", "방어 무장")}
            ${slotCard("gear1", "장비 슬롯 1")}
            ${slotCard("gear2", "장비 슬롯 2")}
          </div>
        </div>
        <div class="base-card inventory-drop" data-drop-inventory="1">
          <h4>보유 장비/무기</h4>
          <div class="row">
            <button data-action="set-hq-gear-filter" data-id="all" ${gearFilter === "all" ? "disabled" : ""}>전체</button>
            <button data-action="set-hq-gear-filter" data-id="melee" ${gearFilter === "melee" ? "disabled" : ""}>근접</button>
            <button data-action="set-hq-gear-filter" data-id="firearm" ${gearFilter === "firearm" ? "disabled" : ""}>총기</button>
            <button data-action="set-hq-gear-filter" data-id="defense" ${gearFilter === "defense" ? "disabled" : ""}>방어</button>
            <button data-action="set-hq-gear-filter" data-id="gear" ${gearFilter === "gear" ? "disabled" : ""}>장비</button>
          </div>
          <div class="item-grid">
            ${
              filteredGearInventory.length
                ? filteredGearInventory
                    .map(
                      (it) => `<div class="item-card" draggable="true" data-item-id="${it.id}">
                  <div class="item-head"><img src="${it.icon || createItemIcon("IT")}" alt="item"/><strong>${it.name}</strong></div>
                  <div>${it.mainType || "-"} / ${it.subType || "-"}</div>
                  <div>공 ${it.atk || 0} 방 ${it.def || 0} 체 ${it.hp || 0} 속 ${it.speed || 0}</div>
                  <div class="row">
                    <button data-action="item-info" data-id="${it.id}">정보</button>
                    <button data-action="upgrade-item" data-id="${it.id}">강화</button>
                    <button data-action="equip-item" data-id="${it.id}">${selectedHero ? selectedHero.name : "히어로"} 장착</button>
                  </div>
                  <div class="drag-tag" data-item-id="${it.id}">드래그 장착</div>
                </div>`,
                    )
                    .join("")
                : `<div class="base-card">해당 분류의 보유 인벤토리가 없습니다.</div>`
            }
          </div>
        </div>
      </div>`;
    }

    if (state.hqView === "codex") {
      const codexTab = state.hqCodexTab === "mechs" ? "mechs" : "units";
      const unitRows = getUnitCodexEntries();
      const mechRows = getMechCodexEntries();
      const ownedUnits = unitRows.filter((x) => x.owned).length;
      const ownedMechs = mechRows.filter((x) => x.owned).length;
      const unitPageSize = 1000;
      const mechPageSize = 120;
      html += `<div class="base-card"><strong>도감</strong><div>보유하지 않은 대상은 이름만 공개되고, 나머지 정보는 ???로 표시됩니다.</div><div class="row"><button data-action="grant-full-codex">도감 전부 해금 지급</button></div></div>`;
      html += `<div class="row">
        <button data-action="set-codex-tab" data-id="units" ${codexTab === "units" ? "disabled" : ""}>유닛 도감 (${ownedUnits}/${unitRows.length})</button>
        <button data-action="set-codex-tab" data-id="mechs" ${codexTab === "mechs" ? "disabled" : ""}>메카 도감 (${ownedMechs}/${mechRows.length})</button>
      </div>`;
      if (codexTab === "units") {
        const maxPage = Math.max(1, Math.ceil(unitRows.length / unitPageSize));
        state.hqCodexPageUnits = clamp(state.hqCodexPageUnits || 1, 1, maxPage);
        const start = (state.hqCodexPageUnits - 1) * unitPageSize;
        const viewRows = unitRows.slice(start, start + unitPageSize);
        html += `<div class="row"><button data-action="codex-page" data-id="units-prev" ${state.hqCodexPageUnits <= 1 ? "disabled" : ""}>이전</button><div>페이지 ${state.hqCodexPageUnits}/${maxPage}</div><button data-action="codex-page" data-id="units-next" ${state.hqCodexPageUnits >= maxPage ? "disabled" : ""}>다음</button></div>`;
        html += `<div class="unit-grid codex-unit-grid">`;
        viewRows.forEach((u) => {
          const need = getPromotionCostByStar(u.star || 0);
          const rangeColor = RANGE_META[u.rangeClass]?.color || "#9a9a9a";
          if (!u.owned) {
            html += `<div class="unit-slot filled">
              <div class="unit-card">
                <div class="card-q q-tl"><img src="${createItemIcon("?", "#2f3a4d")}" alt="미확인"/></div>
                <div class="card-q q-tr"><img src="${createItemIcon("???", "#2f3a4d")}" alt="미확인"/></div>
                <div class="card-q q-bl"><img src="${createItemIcon("?", "#2f3a4d")}" alt="미확인"/></div>
                <div class="card-q q-br">
                  <strong>${u.name}</strong>
                  <span>${u.unitType === "merc" ? "용병" : "히어로"}</span>
                  <span>${getStarDots(0)}</span>
                  <span class="range-pill" style="background:#b0b8c5">???</span>
                  <span class="role-pill">???</span>
                </div>
              </div>
              <div class="row"><button disabled>정보 열람 불가</button><button disabled>성 강화 불가</button></div>
            </div>`;
          } else {
            const sampleUnit = getUnitById(u.sampleId);
            const classImg = sampleUnit ? getClassMarkImage(sampleUnit) : (CLASS_META[u.roleClass]?.icon || "./assets/icons/class-default.svg");
            const portrait = sampleUnit ? getPortraitImage(sampleUnit) : createItemIcon("U", "#2f4463");
            const abilityImg = sampleUnit ? getAbilityImage(sampleUnit) : createItemIcon("SK", "#2f5a3a");
            const infoAction = sampleUnit ? "codex-unit-info" : "codex-unit-info-key";
            const infoId = sampleUnit ? u.sampleId : u.key;
            html += `<div class="unit-slot filled">
              <div class="unit-card codex-clickable" data-action="${infoAction}" data-id="${infoId}">
                <div class="card-q q-tl"><img src="${classImg}" alt="클래스 마크"/></div>
                <div class="card-q q-tr"><img src="${portrait}" alt="유닛 이미지"/></div>
                <div class="card-q q-bl"><img src="${abilityImg}" alt="능력 이미지"/></div>
                <div class="card-q q-br">
                  <strong>${u.name}</strong>
                  <span>${u.unitType === "merc" ? "용병" : "히어로"} / ${u.ownedCount}기 보유</span>
                  <span>${getStarDots(u.star)}</span>
                  <span class="range-pill" style="background:${rangeColor}">${u.rangeClass || "-"}</span>
                  <span class="role-pill">${u.roleClass || "-"}</span>
                </div>
              </div>
              <div>고정 무장: ${u.fixedMeleeType || "?"} / ${u.fixedFirearmType || "?"} / 실드 ${u.canUseDefense ? "가능" : "불가"}</div>
              <div class="row"><button data-action="${infoAction}" data-id="${infoId}">정보 열람</button></div>
            </div>`;
          }
        });
        html += `</div>`;
      } else {
        const maxPage = Math.max(1, Math.ceil(mechRows.length / mechPageSize));
        state.hqCodexPageMechs = clamp(state.hqCodexPageMechs || 1, 1, maxPage);
        const start = (state.hqCodexPageMechs - 1) * mechPageSize;
        const viewRows = mechRows.slice(start, start + mechPageSize);
        html += `<div class="row"><button data-action="codex-page" data-id="mechs-prev" ${state.hqCodexPageMechs <= 1 ? "disabled" : ""}>이전</button><div>페이지 ${state.hqCodexPageMechs}/${maxPage}</div><button data-action="codex-page" data-id="mechs-next" ${state.hqCodexPageMechs >= maxPage ? "disabled" : ""}>다음</button></div>`;
        html += `<div class="hero-grid codex-mech-grid">`;
        viewRows.forEach((m) => {
          const need = getPromotionCostByStar(m.star || 0);
          if (!m.owned) {
            html += `<div class="hero-select mech-card codex-mech-card">
              <div class="hangar-preview"><img src="${createItemIcon("?", "#243449")}" alt="미확인"/></div>
              <strong>${m.name}</strong>
              <div>성급: ${getStarDots(0)} (0성)</div>
              <div>무게: ??? / 사거리: ??? / 속성: ??? / 클래스: ???</div>
              <div>코어 스킬: ???</div>
              <div>스탯: 공 ??? / 방 ??? / 체 ??? / 속 ???</div>
              <div class="row"><button disabled>정보 열람 불가</button></div>
            </div>`;
          } else {
            html += `<div class="hero-select mech-card codex-mech-card codex-clickable" data-action="codex-mech-info" data-id="${m.key}">
              <div class="hangar-preview"><img src="${getMechPreviewImage({ name: m.name, attribute: m.attribute, role: m.role })}" alt="${m.name}"/></div>
              <strong>${m.name}</strong>
              <div>성급: ${getStarDots(m.star)} (${getStarValue(m.star)}성)</div>
              <div>보유 수량: ${m.ownedCount}</div>
              <div>무게: ${m.role} / 사거리: ${m.rangeClass} / 속성: ${m.attribute} / 클래스: ${m.mechClass || "-"}</div>
              <div>코어 스킬: ${m.coreSkill}</div>
              <div>스탯: 공 ${m.atk} / 방 ${m.def} / 체 ${m.hp} / 속 ${m.speed}</div>
              <div class="row">
                <button data-action="codex-mech-info" data-id="${m.key}">정보 열람</button>
              </div>
            </div>`;
          }
        });
        html += `</div>`;
      }
    }
  }
  if (tab === "factory") {
    const cs = getFactoryCostScale();
    const fp = buildFactoryPreviewSummary();
    const shipUnlockMode = !!fp.nextLockedShip;
    const activeShip = getActiveShip();
    const shipLv = Math.max(0, Number(activeShip?.upgradeLv || 0));
    const shipNextLv = Math.min(SHIP_MAX_UPGRADE_LV, shipLv + 1);
    const shipBaseCredit = shipUnlockMode ? 980 + state.factoryLevel * 140 : 1400 + shipLv * 520;
    const shipBaseTerra = shipUnlockMode ? 180 : 220 + shipLv * 90;
    const shipLabel = shipUnlockMode ? "우주선 해금" : "우주선 업그레이드";
    const shipName = shipUnlockMode ? fp.nextLockedShip.name : (activeShip?.name || "활성 우주선");
    const shipCap = shipUnlockMode ? fp.nextLockedShip.capacity : (activeShip?.capacity || 12);
    const shipNextCap = shipUnlockMode ? null : calcShipCapacityByUpgrade(activeShip, shipNextLv);
    html += `<div class="base-card"><strong>공장 Lv.${state.factoryLevel}</strong>
      <div>생산 비용 보정: x${cs.toFixed(2)} (발전소 영향 포함)</div>
      <div>보유 생산 라인: 히어로/무기/장비/우주선/메카/메카 무장/스킬 모듈</div>
      <div class="row"><button data-action="upgrade-factory">공장 업그레이드 (비용 ${state.factoryLevel * 500} 크레딧)</button></div>
    </div>`;
    html += `<div class="item-grid">
      <div class="base-card">
        <strong>히어로 생산</strong>
        <div>비용: ${formatFactoryCost(420, 56, 1)}</div>
        <div>양산 x5 비용: ${formatFactoryCost(420, 56, 5)}</div>
        <div>생산 대상: 랜덤 히어로 1명 (영입 풀 기준)</div>
        <div>예시: ${fp.heroSample.name} / ${fp.heroSample.roleClass} / ${fp.heroSample.rangeClass} / ${fp.heroSample.attribute}</div>
        <div>예시 스탯: 공 ${fp.heroSample.atk} 방 ${fp.heroSample.def} 체 ${fp.heroSample.hp} 속 ${fp.heroSample.speed}</div>
        <div class="row">
          <button data-action="factory-make-hero">히어로 생산</button>
          <button data-action="factory-make-hero-x5">히어로 양산 x5</button>
        </div>
      </div>
      <div class="base-card">
        <strong>무기 생산</strong>
        <div>비용: ${formatFactoryCost(180, 24, 1)}</div>
        <div>양산 x5 비용: ${formatFactoryCost(180, 24, 5)}</div>
        <div>생산 대상: 랜덤 무기 1개 (${fp.weaponCatalogSize}종)</div>
        <div>예시: ${fp.weaponSample ? fp.weaponSample.name : "-"} / ${fp.weaponSample ? fp.weaponSample.subType : "-"}</div>
        <div>예시 스탯: 공 ${fp.weaponSample ? fp.weaponSample.atk : 0} 사거리 ${fp.weaponSample ? fp.weaponSample.range : 0} 연사 ${fp.weaponSample ? fp.weaponSample.attackSpeed : 0}</div>
        <div class="row">
          <button data-action="factory-make-weapon">무기 생산</button>
          <button data-action="factory-make-weapon-x5">무기 양산 x5</button>
        </div>
      </div>
      <div class="base-card">
        <strong>장비 생산</strong>
        <div>비용: ${formatFactoryCost(150, 20, 1)}</div>
        <div>양산 x5 비용: ${formatFactoryCost(150, 20, 5)}</div>
        <div>생산 대상: 랜덤 장비 1개 (${fp.gearCatalogSize}종)</div>
        <div>예시: ${fp.gearSample ? fp.gearSample.name : "-"} / ${fp.gearSample ? fp.gearSample.subType : "-"}</div>
        <div>예시 스탯: 공 ${fp.gearSample ? fp.gearSample.atk : 0} 방 ${fp.gearSample ? fp.gearSample.def : 0} 체 ${fp.gearSample ? fp.gearSample.hp : 0} 속 ${fp.gearSample ? fp.gearSample.speed : 0}</div>
        <div class="row">
          <button data-action="factory-make-gear">장비 생산</button>
          <button data-action="factory-make-gear-x5">장비 양산 x5</button>
        </div>
      </div>
      <div class="base-card">
        <strong>${shipLabel}</strong>
        <div>비용: ${formatFactoryCost(shipBaseCredit, shipBaseTerra, 1)}</div>
        <div>대상: ${shipName}</div>
        <div>${shipUnlockMode ? "해금 후 업그레이드 Lv.0 시작" : `현재 업그레이드 레벨: Lv.${shipLv} / 최대 Lv.${SHIP_MAX_UPGRADE_LV}${shipLv < SHIP_MAX_UPGRADE_LV ? ` (다음 Lv.${shipNextLv})` : ""}`}</div>
        <div>수용 인원: ${shipCap}명${shipUnlockMode ? "" : ` (Lv.${SHIP_MAX_UPGRADE_LV} 달성 시 ${SHIP_MAX_CAPACITY}명${shipLv < SHIP_MAX_UPGRADE_LV ? ` / 다음 ${shipNextCap}명` : ""})`}</div>
        <div>${
          shipUnlockMode
            ? "잠금 우주선을 순서대로 해금합니다."
            : `전투 버프 강화: 공격 +${Math.round((activeShip?.buffAtk || 0) * 100)}%, 방어 +${Math.round((activeShip?.buffDef || 0) * 100)}%, 체력 +${Math.round((activeShip?.buffHp || 0) * 100)}%, 속도 +${Math.round((activeShip?.buffSpeed || 0) * 100)}%`
        }</div>
        <div class="row">
          <button data-action="factory-make-ship">${shipUnlockMode ? "우주선 해금" : (shipLv >= SHIP_MAX_UPGRADE_LV ? `우주선 업그레이드 완료 (Lv.${SHIP_MAX_UPGRADE_LV})` : `우주선 업그레이드 (Lv.${shipLv}→Lv.${shipNextLv})`)}</button>
        </div>
      </div>
      <div class="base-card">
        <strong>메카 생산</strong>
        <div>비용: ${formatFactoryCost(920, 130, 1)}</div>
        <div>양산 x3 비용: ${formatFactoryCost(920, 130, 3)}</div>
        <div>생산 대상: 랜덤 메카 1기 (속성/무게/사거리 포함)</div>
        <div>예시: ${fp.mechSample ? fp.mechSample.name : "-"} / ${fp.mechSample ? fp.mechSample.attribute : "-"} / ${fp.mechSample ? fp.mechSample.role : "-"} / ${fp.mechSample ? fp.mechSample.rangeClass : "-"}</div>
        <div>예시 스탯: 공 ${fp.mechSample ? fp.mechSample.atk : 0} 방 ${fp.mechSample ? fp.mechSample.def : 0} 체 ${fp.mechSample ? fp.mechSample.hp : 0} 속 ${fp.mechSample ? fp.mechSample.speed : 0}</div>
        <div class="row">
          <button data-action="factory-make-mech">메카 생산</button>
          <button data-action="factory-make-mech-x3">메카 양산 x3</button>
        </div>
      </div>
      <div class="base-card">
        <strong>메카 무장 생산</strong>
        <div>비용: ${formatFactoryCost(260, 34, 1)}</div>
        <div>양산 x5 비용: ${formatFactoryCost(260, 34, 5)}</div>
        <div>생산 대상: 랜덤 메카 무장 1개 (${fp.mechWeaponCatalogSize}종)</div>
        <div>예시: ${fp.mechWeaponSample ? fp.mechWeaponSample.name : "-"} / ${fp.mechWeaponSample ? fp.mechWeaponSample.subType : "-"}</div>
        <div>예시 스탯: 공 ${fp.mechWeaponSample ? fp.mechWeaponSample.atk : 0} 사거리 ${fp.mechWeaponSample ? fp.mechWeaponSample.range : 0} 연사 ${fp.mechWeaponSample ? fp.mechWeaponSample.attackSpeed : 0}</div>
        <div class="row">
          <button data-action="factory-make-mech-weapon">메카 무장 생산</button>
          <button data-action="factory-make-mech-weapon-x5">메카 무장 양산 x5</button>
        </div>
      </div>
      <div class="base-card">
        <strong>스킬 모듈 생산</strong>
        <div>비용: ${formatFactoryCost(300, 42, 1)}</div>
        <div>양산 x5 비용: ${formatFactoryCost(300, 42, 5)}</div>
        <div>생산 대상: 랜덤 일반 모듈 1개 (기본 ${fp.mechModuleBaseCount}종, 총 ${fp.mechModuleTotalCount}개 MK 단계)</div>
        <div>예시: ${fp.mechModuleSample ? fp.mechModuleSample.name : "-"}</div>
        <div>예시 스탯: 공 ${fp.mechModuleSample ? fp.mechModuleSample.atk : 0} 방 ${fp.mechModuleSample ? fp.mechModuleSample.def : 0} 체 ${fp.mechModuleSample ? fp.mechModuleSample.hp : 0} 속 ${fp.mechModuleSample ? fp.mechModuleSample.speed : 0}</div>
        <div class="row">
          <button data-action="factory-make-module">스킬 모듈 생산</button>
          <button data-action="factory-make-module-x5">스킬 모듈 양산 x5</button>
        </div>
      </div>
    </div>`;
  }
  if (tab === "plant") {
    updatePlantAccumulation();
    ensurePlantProductionState();
    const pp = state.plantProduction;
    const plantLv = clamp(Math.max(1, Number(state.powerPlantLevel || 1)), 1, PLANT_MAX_LEVEL);
    const plantCreditRate = getPlantCreditRatePerHour(state.powerPlantLevel);
    const plantPowerRate = getPlantPowerRatePerHour(state.powerPlantLevel);
    const plantCredit = Math.floor(pp.credit || 0);
    const plantPower = Math.floor(pp.power || 0);
    const plantUpgradeCost = plantLv * 800;
    const isPlantMax = plantLv >= PLANT_MAX_LEVEL;
    const plantResourceRows = Object.entries(RESOURCE_DEFS)
      .map(([resId, def]) => {
        const rate = getPlantResourceRatePerHour(resId, state.powerPlantLevel);
        const gain = Math.floor(pp.resources?.[resId] || 0);
        return `<div class="base-card">
          <strong>${def.name}</strong>
          <div>현재 보유: ${getResourceAmount(resId)}</div>
          <div>시간당 생산: +${rate}</div>
          <div>누적 수령 가능: +${gain}</div>
          <div style="opacity:.75">${def.usage}</div>
          <button data-action="collect-plant-resource" data-id="${resId}">${def.name} 수령 (+${gain})</button>
        </div>`;
      })
      .join("");
    const stockRows = Object.entries(RESOURCE_DEFS)
      .map(([id, def]) => `<div>${def.name}: ${getResourceAmount(id)} <span style="opacity:.72">(${def.usage})</span></div>`)
      .join("");
    html += `<div class="base-card"><strong>발전소 Lv.${plantLv}${isPlantMax ? ` (최대 Lv.${PLANT_MAX_LEVEL})` : ""}</strong><div>시간당 생산: 크레딧 +${plantCreditRate}, 전력 +${plantPowerRate} / 누적 최대 ${PLANT_MAX_ACCUM_HOURS}시간(시간당 생산량의 ${PLANT_MAX_ACCUM_HOURS}배)</div><div>현재 누적: 크레딧 +${plantCredit}, 전력 +${plantPower}</div></div>`;
    html += `<div class="row">
      <button data-action="collect-plant-credit">크레딧 수령 (+${plantCredit})</button>
      <button data-action="collect-plant-power">전력 수령 (+${plantPower})</button>
      <button data-action="upgrade-plant" ${isPlantMax ? "disabled" : ""}>${isPlantMax ? `발전소 최대 레벨 (Lv.${PLANT_MAX_LEVEL})` : `발전소 업그레이드 (비용 ${plantUpgradeCost} 크레딧)`}</button>
    </div>`;
    html += `<div class="item-grid">${plantResourceRows}</div>`;
    html += `<div class="base-card"><strong>자원 보관고</strong>${stockRows}</div>`;
  }
  if (tab === "market") {
    html += `<div class="base-card"><strong>신입/용병 고용</strong><div>고용 후보 ${state.marketOffers.length}명</div>
    <button data-action="refresh-market-offers">리스트 리셋 (10 크레딧)</button></div>`;
    state.marketOffers.forEach((m) => {
      const offer = normalizeRecruitOffer(m, "market");
      const hired = [...state.heroes, ...state.mercs].some((x) => x.sourceId === offer.id);
      html += `<div class="base-card">${offer.name} (${offer.rank} / ${offer.unitType === "merc" ? "용병" : "히어로"}) 계약금 ${offer.contract}
      <div>${offer.roleClass} / ${offer.rangeClass} / ${offer.attribute} / 팀 ${offer.team}</div>
      <div>공 ${offer.atk} / 방 ${offer.def} / 체 ${offer.hp} / 속 ${offer.speed}</div>
      <div>고유 능력: ${offer.ability}</div>
      <button data-action="hire-market-offer" data-id="${offer.id}" ${hired ? "disabled" : ""}>${hired ? "고용됨" : "고용"}</button></div>`;
    });
    if (state.mercs.length) {
      html += `<div class="base-card"><strong>고용 중 용병</strong>`;
      state.mercs.forEach((m) => {
        const refund = Math.floor(m.contract * 0.8);
        html += `<div>${m.name} / 계약금 ${m.contract} / 해지 환급 ${refund}
        <button data-action="fire-merc" data-id="${m.id}">계약 해지</button></div>`;
      });
      html += `</div>`;
    }
  }
  if (tab === "black") {
    html += `<div class="base-card"><strong>블랙 마켓 프리미엄</strong><div>베테랑 인력, 전설 장비, 고급 자원 거래</div>
    <button data-action="refresh-black-offers">리스트 리셋 (10 크레딧)</button></div>`;
    state.blackMarketOffers.forEach((m) => {
      const offer = normalizeRecruitOffer(m, "black");
      const hired = [...state.heroes, ...state.mercs].some((x) => x.sourceId === offer.id);
      html += `<div class="base-card">${offer.name} (${offer.rank} / ${offer.unitType === "merc" ? "용병" : "히어로"}) 계약금 ${offer.contract}
      <div>${offer.roleClass} / ${offer.rangeClass} / ${offer.attribute} / 팀 ${offer.team}</div>
      <div>공 ${offer.atk} / 방 ${offer.def} / 체 ${offer.hp} / 속 ${offer.speed}</div>
      <div>고유 능력: ${offer.ability}</div>
      <button data-action="hire-black-offer" data-id="${offer.id}" ${hired ? "disabled" : ""}>${hired ? "고용됨" : "고용"}</button></div>`;
    });
    html += `<div class="base-card">전설 무기 패키지 - 2200 크레딧 <button data-action="buy-legend">구매</button></div>`;
    html += `<div class="base-card"><strong>포획 빌런 거래</strong>`;
    if (!state.capturedVillains.length) html += `<div>수감된 빌런이 없습니다.</div>`;
    state.capturedVillains.forEach((v) => {
      html += `<div>${v.name} / 시세 ${v.value}
      <button data-action="sell-villain" data-id="${v.id}">판매</button></div>`;
    });
    html += `</div>`;
  }
  if (tab === "hangar") {
    // Keep acquired duplicate mechs; do not normalize down to codex size on render.
    const ownedMechCountAll = (state.mechs || []).filter((m) => m && m.unlocked).length;
    html += `<div class="base-card"><strong>격납고</strong><div>우주선/메카를 전환해서 관리할 수 있습니다.</div><div>보유 메카 수: ${ownedMechCountAll}기</div></div>`;
    html += `<div class="row">
      <button data-action="hangar-view" data-id="ships" ${state.hangarView === "ships" ? "disabled" : ""}>우주선</button>
      <button data-action="hangar-view" data-id="mechs" ${state.hangarView === "mechs" ? "disabled" : ""}>메카</button>
    </div>`;
    if (state.hangarView === "ships") {
      html += `<div class="base-card"><div>선택한 우주선의 수용 인원이 출격 인원 최대치가 됩니다.</div></div>`;
      state.hangarShips.forEach((s) => {
        const shipLv = Math.max(0, Number(s.upgradeLv || 0));
        html += `<div class="base-card">
          <div class="hangar-preview"><img src="${getShipPreviewImage(s)}" alt="${s.name} 이미지" /></div>
          <strong>${s.name}</strong>
          <div>업그레이드 Lv.${shipLv}</div>
          <div>최대 출격 인원: ${s.capacity}</div>
          <div>버프: 공 ${Math.round((s.buffAtk || 0) * 100)}% / 방 ${Math.round((s.buffDef || 0) * 100)}% / 체 ${Math.round((s.buffHp || 0) * 100)}% / 속 ${Math.round((s.buffSpeed || 0) * 100)}%</div>
          <div>상태: ${s.unlocked ? "운용 가능" : "미해금"}</div>
          <button data-action="select-ship" data-id="${s.id}" ${!s.unlocked || state.activeShipId === s.id ? "disabled" : ""}>
            ${state.activeShipId === s.id ? "선택됨" : "출격 우주선으로 선택"}
          </button>
        </div>`;
      });
    } else {
      const ownedMechs = (state.mechs || [])
        .filter((m) => m.unlocked)
        .sort((a, b) => {
          const pa = Number(!!a.pilotId);
          const pb = Number(!!b.pilotId);
          if (pb !== pa) return pb - pa;
          if (state.activeMechId === a.id && state.activeMechId !== b.id) return -1;
          if (state.activeMechId === b.id && state.activeMechId !== a.id) return 1;
          return String(a.name || "").localeCompare(String(b.name || ""), "ko");
        });
      const mechPageSize = 100;
      const mechMaxPage = Math.max(1, Math.ceil(ownedMechs.length / mechPageSize));
      state.hangarMechPage = clamp(state.hangarMechPage || 1, 1, mechMaxPage);
      const mechStart = (state.hangarMechPage - 1) * mechPageSize;
      const viewMechs = ownedMechs.slice(mechStart, mechStart + mechPageSize);
      const allUnits = getAllUnits();
      const sortedPilots = [...allUnits].sort((a, b) => Number(b.deployed) - Number(a.deployed));
      const deployedPilotPool = sortedPilots.filter((u) => u.deployed);
      const damagedMechs = ownedMechs.filter((m) => {
        const cur = typeof m.currentHp === "number" ? m.currentHp : m.hp;
        return cur < m.hp;
      });
      const damagedCount = damagedMechs.length;
      const totalRepairCost = damagedMechs.reduce((sum, m) => {
        const cur = typeof m.currentHp === "number" ? m.currentHp : m.hp;
        const need = Math.max(0, m.hp - cur);
        return sum + (need > 0 ? Math.max(60, Math.round(need * 1.4)) : 0);
      }, 0);
      html += `<div class="base-card"><div>메카 정보 카드 안의 7개 슬롯에서 바로 편집합니다. 인벤토리 카드를 슬롯으로 드래그하면 장착, 슬롯 카드를 인벤토리로 드래그하면 해제됩니다.</div><div class="row"><label>배치 기준</label><select data-auto-deploy-mode="1"><option value="planet" ${state.autoDeployMode === "planet" ? "selected" : ""}>행성 권장 속성</option><option value="all" ${state.autoDeployMode === "all" ? "selected" : ""}>전체 균형</option>${ATTR_ORDER.map((a) => `<option value="${a}" ${state.autoDeployMode === a ? "selected" : ""}>${a} 속성</option>`).join("")}</select><button data-action="auto-deploy-mechs">자동 배치</button><button data-action="repair-all-mechs" ${damagedCount === 0 ? "disabled" : ""}>파손 메카 전체 수리 (${totalRepairCost})</button><div>파손: ${damagedCount}기</div></div></div>`;
      html += `<div class="gear-layout mech-gear-layout">`;
      html += `<div class="base-card unit-scroll mech-list-column" data-scroll-key="mech-list">`;
      html += `<div class="row">
        <button data-action="hangar-mech-page" data-id="prev" ${state.hangarMechPage <= 1 ? "disabled" : ""}>이전</button>
        <div>페이지 ${state.hangarMechPage}/${mechMaxPage}</div>
        <button data-action="hangar-mech-page" data-id="next" ${state.hangarMechPage >= mechMaxPage ? "disabled" : ""}>다음</button>
      </div>`;
      if (!ownedMechs.length) {
        html += `<div class="base-card">보유한 메카가 없습니다.</div>`;
      }
      viewMechs.forEach((m) => {
        const curHp = typeof m.currentHp === "number" ? Math.max(0, Math.round(m.currentHp)) : m.hp;
        const repairCost = Math.max(60, Math.round((m.hp - curHp) * 1.4));
        const selectedCls = state.activeMechId === m.id ? " selected-hero" : "";
        const pilotedCls = m.pilotId ? " piloted-mech" : "";
        const pilot = getMechPilot(m);
        const pilotOptions = (() => {
          const opts = [...deployedPilotPool];
          if (pilot && !opts.some((u) => u.id === pilot.id)) opts.unshift(pilot);
          return opts;
        })();
        const mechLevel = Math.max(1, Number(m.level || m.upgradeLv || 1));
        const mechMaxLevel = getMechMaxLevel(m);
        const moduleSlots = [...Array(3)].map((_, i) => m.equippedModules?.[i] || null);
        const slotRows = [
          { key: "melee", label: "메카용 근접 무기", item: m.equippedMelee || null },
          { key: "firearm", label: "메카용 총기", item: m.equippedFirearm || null },
          { key: "defense", label: "메카용 방어 무기", item: m.equippedDefense || null },
          { key: "module0", label: "스킬 1 모듈", item: moduleSlots[0] },
          { key: "module1", label: "스킬 2 모듈", item: moduleSlots[1] },
          { key: "module2", label: "스킬 3 모듈", item: moduleSlots[2] },
          { key: "core", label: "코어 스킬 모듈", item: m.equippedCore || null },
        ];
        html += `<div class="hero-select mech-card${selectedCls}${pilotedCls}">
          <div class="hangar-preview"><img src="${getMechPreviewImage(m)}" alt="${m.name} 이미지" /></div>
          <strong>${m.name} ${m.upgradeLv ? `+${m.upgradeLv}` : ""}</strong>
          <div>${getStarDots(m.star || 0)} / Lv.${m.level || Math.max(1, (m.upgradeLv || 0) + 1)}/${getMechMaxLevel(m)}</div>
          <div>${m.role} / ${m.rangeClass || "중거리"} / ${m.attribute || "물리"}</div>
          <div>HP ${curHp}/${m.hp} / ATK ${m.atk} / DEF ${m.def} / SPD ${m.speed}</div>
          <div class="row mech-action-row">
            <button data-action="select-mech-active" data-id="${m.id}" ${state.activeMechId === m.id ? "disabled" : ""}>${state.activeMechId === m.id ? "선택됨" : "탑승 메카 지정"}</button>
            <button data-action="upgrade-mech" data-id="${m.id}" ${mechLevel >= mechMaxLevel ? "disabled" : ""}>강화</button>
            <button data-action="repair-mech" data-id="${m.id}" ${curHp >= m.hp ? "disabled" : ""}>수리 (${repairCost})</button>
          </div>
          <div>코어 스킬: ${m.coreSkill || m.equippedCore?.name || "미지정"}</div>
          <div class="row mech-pilot-row"><label>탑승 유닛</label>
            <select data-mech-pilot="${m.id}">
              <option value="">미탑승</option>
              ${pilotOptions
                .map((u) => `<option value="${u.id}" ${pilot?.id === u.id ? "selected" : ""}>${u.name} (${u.unitType === "merc" ? "용병" : "히어로"}${u.deployed ? "/출격대기" : ""})</option>`)
                .join("")}
            </select>
          </div>
          <div class="equip-board mech-equip-board">
            ${slotRows
              .map((s) => `<div class="equip-slot ${s.item ? "filled" : ""}" data-mech-equip-slot="${s.key}" data-mech-id="${m.id}">
              <div class="slot-title">${s.label}</div>
              ${
                s.item
                  ? `<div class="equipped-item" draggable="true" data-mech-equipped-id="${s.item.id}" data-mech-id="${m.id}" data-mech-slot-key="${s.key}"><img src="${s.item.icon || createItemIcon("MK")}" alt="slot"/><div><strong>${s.item.name}</strong><div>${s.item.mainType || "-"} / ${s.item.subType || "-"}</div></div></div>`
                  : `<div class="slot-empty">비어 있음</div>`
              }
            </div>`)
              .join("")}
          </div>
        </div>`;
      });
      html += `</div>`;

      html += `<div class="base-card unit-scroll inventory-drop" data-drop-mech-inventory="1" data-scroll-key="mech-inventory">`;
      html += `<h4>메카 무장/모듈 인벤토리</h4><div class="row"><button data-action="auto-equip-mechs">자동 장착</button><button data-action="auto-deploy-mechs">자동 배치</button></div>`;
      const mechInvFilter = state.hangarMechInventoryFilter || "all";
      const equippedMechIds = getAllEquippedMechItemIds();
      const visibleMechInventory = (state.mechInventory || [])
        .filter((it) => !equippedMechIds.has(it?.id))
        .filter((it) => {
          if (mechInvFilter === "all") return true;
          if (mechInvFilter === "melee") return it.slotType === "melee";
          if (mechInvFilter === "firearm") return it.slotType === "firearm";
          if (mechInvFilter === "defense") return it.slotType === "defense";
          if (mechInvFilter === "module") return it.slotType === "module";
          if (mechInvFilter === "core") return it.slotType === "core";
          return true;
        });
      html += `<div class="row">
        <button data-action="set-mech-inv-filter" data-id="all" ${mechInvFilter === "all" ? "disabled" : ""}>전체</button>
        <button data-action="set-mech-inv-filter" data-id="melee" ${mechInvFilter === "melee" ? "disabled" : ""}>근접</button>
        <button data-action="set-mech-inv-filter" data-id="firearm" ${mechInvFilter === "firearm" ? "disabled" : ""}>총기</button>
        <button data-action="set-mech-inv-filter" data-id="defense" ${mechInvFilter === "defense" ? "disabled" : ""}>방어</button>
        <button data-action="set-mech-inv-filter" data-id="module" ${mechInvFilter === "module" ? "disabled" : ""}>모듈</button>
        <button data-action="set-mech-inv-filter" data-id="core" ${mechInvFilter === "core" ? "disabled" : ""}>코어</button>
      </div>`;
      html += `<div class="item-grid">`;
      visibleMechInventory.forEach((it) => {
        html += `<div class="item-card" draggable="true" data-mech-item-id="${it.id}">
          <div class="item-head"><img src="${it.icon || createItemIcon("MK")}" alt="mech-item"/><strong>${it.name}</strong></div>
          <div>${it.mainType || "-"} / ${it.subType || "-"}</div>
          <div>공 ${it.atk || 0} 방 ${it.def || 0} 체 ${it.hp || 0} 속 ${it.speed || 0}</div>
          <div class="row">
            <button data-action="item-info" data-id="${it.id}">정보</button>
            <button data-action="upgrade-item" data-id="${it.id}">강화</button>
          </div>
        </div>`;
      });
      if (!visibleMechInventory.length) html += `<div class="base-card">보유 메카 무장/모듈이 없습니다.</div>`;
      html += `</div>`;
      html += `</div>`;
      html += `</div>`;
    }
  }
  if (tab === "prison") {
    html += `<div class="base-card"><strong>수감소 / 교화 센터</strong><div>현재 수감 인원: ${(state.capturedVillains || []).length}명</div><div>교화 레벨 5 달성 시 용병 전환, -5 도달 시 탈옥</div></div>`;
    if (!state.capturedVillains.length) {
      html += `<div class="base-card">현재 수감 중인 빌런이 없습니다.</div>`;
    } else {
      state.capturedVillains.forEach((v) => applyReformDurationPolicy(v));
      state.capturedVillains.forEach((v) => resolveReformMission(v));
      state.capturedVillains = state.capturedVillains.filter((v) => !v.converted && v.reformLevel > -5);
      const bulkCandidates = state.capturedVillains.filter((v) => canBulkTransferVillain(v));
      const namedCandidates = state.capturedVillains.filter((v) => isNamedOfficerVillain(v));
      html += `<div class="base-card"><div class="row"><button data-action="bulk-transfer-villains" ${bulkCandidates.length ? "" : "disabled"}>일괄 인계</button><span>대상 ${bulkCandidates.length}명 (최종 보스/중간 보스/용병단 빌런 제외)</span></div><div class="row"><button data-action="bulk-transfer-named-villains" ${namedCandidates.length ? "" : "disabled"}>네임드 간부 일괄 인계</button><span>대상 ${namedCandidates.length}명 (네임드 간부)</span></div></div>`;
      html += `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:stretch;">`;
      state.capturedVillains.forEach((v) => {
        ensureVillainReformGauge(v);
        const g = getReformGaugeUi(v);
        const tierMeta = getVillainReformTierMeta(v.tier);
        const remain = v.reformMission ? Math.max(0, v.reformMission.endsAt - Date.now()) : 0;
        const linkedMerc = v.mercCodexKey ? getUnitCodexCatalog().find((r) => r.key === v.mercCodexKey && r.unitType === "merc") : null;
        const linkedOwned = !!(linkedMerc && (state.mercs || []).some((m) => m && m.codexKey === linkedMerc.key));
        const segCount = 10;
        const activeSeg = Math.max(0, Math.min(segCount, Math.ceil(g.pct / (100 / segCount))));
        const segHtml = [...Array(segCount)]
          .map((_, idx) => {
            const on = idx < activeSeg;
            const color = g.up ? "#58d68d" : "#ff7b7b";
            return `<div style="flex:1;height:100%;border-radius:2px;background:${on ? color : "#273042"};opacity:${on ? 1 : 0.5};"></div>`;
          })
          .join("");
        const levelIcon = g.level >= 0 ? "▲" : "▼";
        const levelColor = g.level >= 0 ? "#9ae6b4" : "#feb2b2";
        html += `<div class="base-card" style="min-height:360px;display:flex;flex-direction:column;justify-content:flex-start;"><strong>${v.title}</strong> - ${v.realName}
        <div>몸값 ${v.value} / 교화 레벨 ${g.level} / 탈옥 ${v.escapeCount || 0}회</div>
        <div>교화 난도: ${tierMeta.label} (상위 등급일수록 게이지 상승 효율 감소)</div>
        <div style="margin:8px 0;padding:8px;border:1px solid #2a3448;border-radius:10px;background:linear-gradient(180deg,#121927,#0d1421);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
            <div style="font-size:12px;color:#d9e2f2;">교화 게이지</div>
            <div style="font-size:12px;color:${levelColor};font-weight:700;">${levelIcon} LV ${Math.abs(g.level)}</div>
          </div>
          <div style="height:12px;padding:2px;border-radius:8px;background:#1b2433;display:flex;gap:2px;overflow:hidden;">
            ${segHtml}
          </div>
          <div style="margin-top:6px;position:relative;height:10px;">
            <div style="position:absolute;left:0;right:0;top:4px;height:2px;background:#22304a;"></div>
            <div style="position:absolute;left:calc(${g.pct}% - 6px);top:0;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${g.up ? "#68d391" : "#ff8f8f"};"></div>
          </div>
        </div>
        <div>전투 성향: ${v.archetype || "-"} ${v.attackStyle ? `(${v.attackStyle})` : ""}</div>
        <div>연결 용병 도감: ${linkedMerc ? `${linkedMerc.name} [${linkedMerc.key}]` : (v.mercCodexKey || "미지정")}</div>
        <div>편입 상태: ${linkedOwned ? "보유 중(강화 대상)" : "미보유(교화 시 신규 편입)"}</div>
        ${
          v.reformMission
            ? `<div style="margin-top:8px;">진행 중: ${v.reformMission.label} / 남은 시간 ${formatDuration(remain)}</div>
               <div class="row" style="margin-top:auto;"><button data-action="transfer-villain" data-id="${v.id}">인계</button></div>`
            : `<div class="row">
                <button data-action="start-reform" data-id="${v.id}" data-tier="basic">기본 교화</button>
                <button data-action="start-reform" data-id="${v.id}" data-tier="tactical">전술 교화</button>
                <button data-action="start-reform" data-id="${v.id}" data-tier="intensive">집중 교화</button>
                <button data-action="transfer-villain" data-id="${v.id}">인계</button>
              </div>`
        }
        </div>`;
      });
      html += `</div>`;
    }
    if (state.prisonLog?.length) {
      html += `<div class="base-card"><strong>교화 기록</strong>${state.prisonLog
        .slice(0, 8)
        .map((x) => `<div>${x}</div>`)
        .join("")}</div>`;
    }
  }
  ui.baseContent.innerHTML = html;
  if (ui.baseContent) {
    ui.baseContent.scrollTop = prevBaseScrollTop;
    [...ui.baseContent.querySelectorAll(".unit-scroll")].forEach((el, idx) => {
      const key = el.getAttribute("data-scroll-key") || `idx:${idx}`;
      if (prevUnitScrollMap.has(key)) el.scrollTop = prevUnitScrollMap.get(key);
      else if (prevUnitScrollMap.has(`idx:${idx}`)) el.scrollTop = prevUnitScrollMap.get(`idx:${idx}`);
    });
  }
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

function loadManualSaveSlotsMeta() {
  try {
    const raw = localStorage.getItem(MANUAL_SAVE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x) => ({ id: x?.id, savedAt: x?.savedAt, name: x?.name || "시점 저장" }))
      .filter((x) => x.id && x.savedAt)
      .slice(0, MANUAL_SAVE_LIMIT);
  } catch (_) {
    return [];
  }
}

let manualSaveSlots = loadManualSaveSlotsMeta();

function loadLatestCheckpointCache() {
  try {
    const raw = localStorage.getItem(LATEST_CHECKPOINT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.savedAt || !parsed.id) return null;
    return { id: parsed.id, savedAt: Number(parsed.savedAt || 0) };
  } catch (_) {
    return null;
  }
}

function persistLatestCheckpointCache(slot, data) {
  try {
    if (!slot?.id || !slot?.savedAt) return false;
    localStorage.setItem(LATEST_CHECKPOINT_CACHE_KEY, JSON.stringify({
      id: slot.id,
      savedAt: slot.savedAt,
    }));
    if (data) {
      void putManualSaveData(LATEST_CHECKPOINT_DATA_ID, {
        id: slot.id,
        savedAt: Number(slot.savedAt || Date.now()),
        data,
      });
    }
    return true;
  } catch (_) {
    return false;
  }
}

function clearLatestCheckpointCacheIfMatch(slotId) {
  try {
    const cur = loadLatestCheckpointCache();
    if (!cur) return;
    if (!slotId || cur.id === slotId) {
      localStorage.removeItem(LATEST_CHECKPOINT_CACHE_KEY);
      void deleteManualSaveData(LATEST_CHECKPOINT_DATA_ID);
    }
  } catch (_) {}
}

function persistAutoRuntimeMeta(savedAt) {
  try {
    localStorage.setItem(AUTO_RUNTIME_META_KEY, JSON.stringify({ savedAt: Number(savedAt || Date.now()) }));
    return true;
  } catch (_) {
    return false;
  }
}

function loadAutoRuntimeMeta() {
  try {
    const raw = localStorage.getItem(AUTO_RUNTIME_META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Number.isFinite(Number(parsed.savedAt))) return null;
    return { savedAt: Number(parsed.savedAt) };
  } catch (_) {
    return null;
  }
}

function openManualSaveDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("hf_manual_saves_db_v1", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("slots")) db.createObjectStore("slots", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("IDB_OPEN_FAILED"));
  });
}

async function putManualSaveData(id, data) {
  const db = await openManualSaveDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("slots", "readwrite");
    tx.objectStore("slots").put({ id, data });
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = () => { db.close(); reject(tx.error || new Error("IDB_PUT_FAILED")); };
  });
}

async function getManualSaveData(id) {
  const db = await openManualSaveDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("slots", "readonly");
    const req = tx.objectStore("slots").get(id);
    req.onsuccess = () => {
      db.close();
      resolve(req.result?.data || null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error || new Error("IDB_GET_FAILED"));
    };
  });
}

async function deleteManualSaveData(id) {
  const db = await openManualSaveDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("slots", "readwrite");
    tx.objectStore("slots").delete(id);
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = () => { db.close(); reject(tx.error || new Error("IDB_DELETE_FAILED")); };
  });
}

async function putAutoRuntimeState(savedAt, data) {
  try {
    if (!data) return false;
    await putManualSaveData(AUTO_RUNTIME_STATE_ID, {
      savedAt: Number(savedAt || Date.now()),
      data,
    });
    persistAutoRuntimeMeta(savedAt);
    return true;
  } catch (_) {
    return false;
  }
}

async function getAutoRuntimeState() {
  try {
    const wrapped = await getManualSaveData(AUTO_RUNTIME_STATE_ID);
    if (!wrapped || typeof wrapped !== "object" || !wrapped.data) return null;
    return wrapped;
  } catch (_) {
    return null;
  }
}

let autoRuntimeHydratedOnce = false;
async function hydrateAutoRuntimeStateIfNewer() {
  if (autoRuntimeHydratedOnce) return false;
  autoRuntimeHydratedOnce = true;
  const curSavedAt = Number(state.lastSavedAt || 0);
  let pickedData = null;
  let pickedSavedAt = curSavedAt;

  // Always try IDB runtime state directly to survive localStorage write failures.
  const wrappedRuntime = await getAutoRuntimeState();
  const runtimeSavedAt = Number(wrappedRuntime?.savedAt || wrappedRuntime?.data?.lastSavedAt || 0);
  if (wrappedRuntime?.data && runtimeSavedAt > pickedSavedAt) {
    pickedData = wrappedRuntime.data;
    pickedSavedAt = runtimeSavedAt;
  }

  try {
    const latestCp = await getManualSaveData(LATEST_CHECKPOINT_DATA_ID);
    const cpSavedAt = Number(latestCp?.savedAt || 0);
    if (latestCp?.data && cpSavedAt > pickedSavedAt) {
      pickedData = latestCp.data;
      pickedSavedAt = cpSavedAt;
    }
  } catch (_) {}

  if (!pickedData || pickedSavedAt <= curSavedAt) return false;
  applyManualSaveDataInPlace(pickedData);
  state.lastSavedAt = Math.max(Number(state.lastSavedAt || 0), pickedSavedAt);
  saveState();
  return true;
}

function clearManualSaveDb() {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.deleteDatabase("hf_manual_saves_db_v1");
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false);
    } catch (_) {
      resolve(false);
    }
  });
}

function persistManualSaveSlotsMeta() {
  try {
    localStorage.setItem(MANUAL_SAVE_KEY, JSON.stringify(manualSaveSlots.slice(0, MANUAL_SAVE_LIMIT)));
    return true;
  } catch (_) {
    return false;
  }
}

async function migrateLegacyManualSlotsIfNeeded() {
  try {
    const raw = localStorage.getItem(MANUAL_SAVE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || !arr.some((x) => x && x.data)) return;
    const migratedMeta = [];
    for (let i = 0; i < arr.length && migratedMeta.length < MANUAL_SAVE_LIMIT; i += 1) {
      const it = arr[i];
      if (!it?.id || !it?.savedAt) continue;
      if (it.data) {
        try { await putManualSaveData(it.id, it.data); } catch (_) {}
      }
      migratedMeta.push({ id: it.id, savedAt: it.savedAt, name: it.name || "시점 저장" });
    }
    manualSaveSlots = migratedMeta;
    persistManualSaveSlotsMeta();
  } catch (_) {}
}

function getStateSnapshotForManualSave() {
  const clone = JSON.parse(JSON.stringify(state));
  delete clone.manualSaves;
  return clone;
}

function formatSaveTimestamp(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString("ko-KR", { hour12: false });
  } catch (_) {
    return String(ts || "-");
  }
}

function renderManualSaveList() {
  if (!ui.manualSaveList) return;
  if (!manualSaveSlots.length) {
    ui.manualSaveList.innerHTML = "<div class=\"base-card\">저장된 시점이 없습니다.</div>";
    return;
  }
  ui.manualSaveList.innerHTML = manualSaveSlots
    .map((slot, idx) => (
      "<div class=\"base-card\">"
      + `<strong>#${idx + 1} ${slot.name || "시점 저장"}</strong>`
      + `<div>저장 시각: ${formatSaveTimestamp(slot.savedAt)}</div>`
      + "<div class=\"row\">"
      + `<button data-action=\"load-manual-save\" data-id=\"${slot.id}\">불러오기</button>`
      + `<button data-action=\"delete-manual-save\" data-id=\"${slot.id}\">삭제</button>`
      + "</div></div>"
    ))
    .join("");
}

async function createManualSaveNow(options = {}) {
  const customName = String(options?.name || "").trim();
  const silent = !!options?.silent;
  const snap = getStateSnapshotForManualSave();
  const now = Date.now();
  snap.lastSavedAt = now;
  const slot = {
    id: `ms-${now}-${Math.random().toString(36).slice(2, 6)}`,
    name: customName || `시점 저장 ${manualSaveSlots.length + 1}`,
    savedAt: now,
  };
  try {
    await putManualSaveData(slot.id, snap);
  } catch (_) {
    if (!silent) showActionToast("시점 저장 실패: 저장 공간 부족 또는 브라우저 제한");
    return false;
  }
  manualSaveSlots.unshift(slot);
  if (manualSaveSlots.length > MANUAL_SAVE_LIMIT) {
    const overflow = manualSaveSlots.slice(MANUAL_SAVE_LIMIT);
    manualSaveSlots = manualSaveSlots.slice(0, MANUAL_SAVE_LIMIT);
    for (let i = 0; i < overflow.length; i += 1) {
      try { await deleteManualSaveData(overflow[i].id); } catch (_) {}
    }
  }
  if (!persistManualSaveSlotsMeta()) {
    if (!silent) showActionToast("시점 저장 실패: 저장 공간 부족");
    return false;
  }
  persistLatestCheckpointCache(slot, snap);
  if (!silent) showActionToast(`시점 저장 완료: ${formatSaveTimestamp(now)}`, "success");
  renderManualSaveList();
  return true;
}

async function createAutoCheckpointAfterRegionClear(planet, region) {
  const planetName = planet?.name || "행성";
  const regionName = region?.name || "지역";
  const ok = await createManualSaveNow({
    name: `자동 저장 - ${planetName} / ${regionName}`,
    silent: true,
  });
  if (ok) {
    showActionToast(`지역 클리어 자동 저장 완료: ${planetName} / ${regionName}`, "success");
  } else {
    showActionToast("지역 클리어 자동 저장 실패: 저장 공간 부족 또는 브라우저 제한");
  }
}

function buildProgressSnapshotFromData(data) {
  return {
    savedAt: Number(data?.lastSavedAt || 0),
    planetRestoreClaims: data?.planetRestoreClaims || {},
    planets: (data?.planets || []).map((p) => ({
      id: p.id,
      name: p.name,
      regions: (p.regions || []).map((r) => ({ id: r.id, name: r.name, restored: !!r.restored })),
    })),
  };
}

function captureRosterPlacementSnapshot(src) {
  const heroes = Array.isArray(src?.heroes) ? src.heroes : [];
  const mercs = Array.isArray(src?.mercs) ? src.mercs : [];
  const mechs = Array.isArray(src?.mechs) ? src.mechs : [];
  const units = [...heroes, ...mercs];
  const unitPlacement = units.map((u) => ({
    id: u?.id || "",
    codexKey: u?.codexKey || "",
    deployed: !!u?.deployed,
  }));
  const unitCodexById = new Map(units.map((u) => [u.id, u.codexKey || ""]));
  const mechPlacement = mechs.map((m) => ({
    id: m?.id || "",
    codexKey: m?.codexKey || getMechCodexKeyNormalized(m),
    pilotId: m?.pilotId || null,
    pilotCodexKey: m?.pilotId ? (unitCodexById.get(m.pilotId) || "") : "",
  }));
  const activeMech = mechs.find((m) => m.id === src?.activeMechId) || null;
  const selectedMech = mechs.find((m) => m.id === src?.hangarSelectedMechId) || null;
  return {
    unitPlacement,
    mechPlacement,
    activeMechId: src?.activeMechId || null,
    activeMechCodexKey: activeMech?.codexKey || getMechCodexKeyNormalized(activeMech),
    selectedMechId: src?.hangarSelectedMechId || null,
    selectedMechCodexKey: selectedMech?.codexKey || getMechCodexKeyNormalized(selectedMech),
  };
}

function restoreRosterPlacementFromSnapshot(snapshot) {
  if (!snapshot) return;
  const allUnits = getAllUnits();
  const byId = new Map(allUnits.map((u) => [u.id, u]));
  const byCodex = new Map();
  allUnits.forEach((u) => {
    const k = getUnitCodexKey(u);
    if (!byCodex.has(k)) byCodex.set(k, []);
    byCodex.get(k).push(u);
  });
  allUnits.forEach((u) => { u.deployed = false; });
  (snapshot.unitPlacement || []).forEach((rec) => {
    if (!rec?.deployed) return;
    let unit = rec.id ? byId.get(rec.id) : null;
    if (!unit && rec.codexKey && byCodex.has(rec.codexKey)) {
      unit = byCodex.get(rec.codexKey).find((x) => !x.deployed) || byCodex.get(rec.codexKey)[0];
    }
    if (unit) unit.deployed = true;
  });
  const allMechs = Array.isArray(state.mechs) ? state.mechs : [];
  const mechById = new Map(allMechs.map((m) => [m.id, m]));
  const mechByCodex = new Map();
  allMechs.forEach((m) => mechByCodex.set(getMechCodexKeyNormalized(m), m));
  allMechs.forEach((m) => { m.pilotId = null; });
  (snapshot.mechPlacement || []).forEach((rec) => {
    let mech = rec?.id ? mechById.get(rec.id) : null;
    if (!mech && rec?.codexKey) mech = mechByCodex.get(rec.codexKey) || null;
    if (!mech) return;
    let pilot = rec?.pilotId ? byId.get(rec.pilotId) : null;
    if (!pilot && rec?.pilotCodexKey && byCodex.has(rec.pilotCodexKey)) {
      pilot = byCodex.get(rec.pilotCodexKey).find((u) => u.deployed) || byCodex.get(rec.pilotCodexKey)[0];
    }
    if (pilot) mech.pilotId = pilot.id;
  });
  let active = snapshot.activeMechId ? mechById.get(snapshot.activeMechId) : null;
  if (!active && snapshot.activeMechCodexKey) active = mechByCodex.get(snapshot.activeMechCodexKey) || null;
  if (active) state.activeMechId = active.id;
  let selected = snapshot.selectedMechId ? mechById.get(snapshot.selectedMechId) : null;
  if (!selected && snapshot.selectedMechCodexKey) selected = mechByCodex.get(snapshot.selectedMechCodexKey) || null;
  if (selected) state.hangarSelectedMechId = selected.id;
}

function applyManualSaveDataInPlace(data) {
  const merged = { ...makeInitialState(), ...data };
  merged.settings = { ...makeInitialState().settings, ...(merged.settings || {}) };
  if (!(merged.planetRestoreClaims && typeof merged.planetRestoreClaims === "object")) merged.planetRestoreClaims = {};
  if (!Array.isArray(merged.planets)) merged.planets = makeInitialState().planets;
  const placementSnapshot = captureRosterPlacementSnapshot(merged);

  for (const key of Object.keys(state)) delete state[key];
  Object.assign(state, merged);

  state.settings.difficulty = normalizeDifficultyValue(state.settings?.difficulty);
  ensureResourceState();
  ensurePlantProductionState();
  updatePlantAccumulation();
  if (!(state.autoDeployMode === "planet" || state.autoDeployMode === "all" || ATTR_ORDER.includes(state.autoDeployMode))) {
    state.autoDeployMode = "planet";
  }
  ensureQuestState();
  ensureRosterState();
  normalizeOwnedInventoriesByType();
  grantRecoveryAssetBundleOnce();
  restoreRosterPlacementFromSnapshot(placementSnapshot);
  ensureTradeState();
  ensurePrisonState();
  ensurePlanetProgressState();
  updateEmergencyQuestStatus();
  if (!state.selectedPlanetId && state.planets.length > 0) {
    state.selectedPlanetId = state.planets[0].id;
    state.selectedRegionId = state.planets[0].regions?.[0]?.id || null;
  }
  updateTopbar();
  renderSortie();
  renderBase();
  syncSettingsForm();
  if (!ui.facilityModal.classList.contains("hidden")) renderFacilityContent(state.baseTab || "hq");
  saveProgressSnapshot();
}

async function loadManualSaveById(id) {
  const slot = manualSaveSlots.find((x) => x.id === id);
  if (!slot) return;
  const ok = confirm(`저장된 시점(${formatSaveTimestamp(slot.savedAt)})을 불러올까요? 현재 진행 상태는 덮어쓰기됩니다.`);
  if (!ok) return;
  let data = null;
  try {
    data = await getManualSaveData(id);
  } catch (_) {
    data = null;
  }
  if (!data) {
    alert("불러오기 실패: 저장 데이터를 찾을 수 없습니다.");
    return;
  }
  try {
    applyManualSaveDataInPlace(data);
    saveState();
    persistLatestCheckpointCache(slot, data);
    showActionToast(`시점 불러오기 완료: ${formatSaveTimestamp(slot.savedAt)}`, "success");
  } catch (_) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      localStorage.setItem(PROGRESS_SAVE_KEY, JSON.stringify(buildProgressSnapshotFromData(data)));
      location.reload();
    } catch (_) {
      alert("불러오기 실패: 저장 데이터 적용 중 오류가 발생했습니다.");
    }
  }
}

async function restartFromLatestCheckpoint() {
  let picked = null;
  if (Array.isArray(manualSaveSlots) && manualSaveSlots.length > 0) {
    picked = [...manualSaveSlots].sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0))[0];
  }
  if (!picked) {
    location.reload();
    return;
  }
  try {
    const data = await getManualSaveData(picked.id);
    if (!data) {
      location.reload();
      return;
    }
    applyManualSaveDataInPlace(data);
    saveState();
    if (ui.missionResultModal) ui.missionResultModal.classList.add("hidden");
    showActionToast(`최근 저장 시점 복구: ${formatSaveTimestamp(picked.savedAt)}`, "success");
  } catch (_) {
    location.reload();
  }
}

async function autoLoadLatestCheckpointOnBoot() {
  try {
    if (!Array.isArray(manualSaveSlots) || manualSaveSlots.length === 0) return false;
    const latest = [...manualSaveSlots].sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0))[0];
    if (!latest?.id) return false;
    const curSavedAt = Number(state.lastSavedAt || 0);
    const latestSavedAt = Number(latest.savedAt || 0);
    if (!Number.isFinite(latestSavedAt) || latestSavedAt <= curSavedAt) return false;
    const data = await getManualSaveData(latest.id);
    if (!data) return false;
    applyManualSaveDataInPlace(data);
    saveState();
    return true;
  } catch (_) {
    return false;
  }
}

async function deleteManualSaveById(id) {
  const before = manualSaveSlots.length;
  manualSaveSlots = manualSaveSlots.filter((x) => x.id !== id);
  if (manualSaveSlots.length === before) return;
  persistManualSaveSlotsMeta();
  clearLatestCheckpointCacheIfMatch(id);
  try { await deleteManualSaveData(id); } catch (_) {}
  renderManualSaveList();
  showActionToast("저장 시점을 삭제했습니다.");
}

function syncSettingsForm() {
  document.getElementById("soundToggle").checked = state.settings.sound;
  document.getElementById("languageSelect").value = state.settings.language;
  document.getElementById("difficultySelect").value = normalizeDifficultyValue(state.settings.difficulty);
  document.getElementById("godModeToggle").checked = state.settings.godMode;
  document.getElementById("infiniteToggle").checked = state.settings.infinite;
  renderManualSaveList();
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
  window.addEventListener("beforeunload", () => {
    saveState();
  });
  window.addEventListener("pagehide", () => {
    saveState();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveState();
  });
  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.dataset.go));
  });

  document.getElementById("planetOpenBtn").addEventListener("click", openPlanetModal);
  document.getElementById("planetCloseBtn").addEventListener("click", closePlanetModal);
  document.getElementById("startMissionBtn").addEventListener("click", startMission);
  document.getElementById("retreatBtn").addEventListener("click", () => endMission(false, "중도 퇴각", true));
  if (ui.missionAutoBtn) {
    ui.missionAutoBtn.addEventListener("click", () => {
      setMissionAutoMode(!mission.autoMode);
    });
  }
  if (ui.missionFollowSwitchBtn) {
    ui.missionFollowSwitchBtn.addEventListener("click", () => {
      cycleMissionFollowUnit();
    });
  }
  if (ui.missionSpeedGroup) {
    ui.missionSpeedGroup.querySelectorAll("button[data-speed]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setMissionTimeScale(Number(btn.dataset.speed || 1));
      });
    });
  }
  if (ui.missionResultMainBtn) {
    ui.missionResultMainBtn.addEventListener("click", () => {
      if (ui.missionResultModal) ui.missionResultModal.classList.add("hidden");
      showScreen("main");
    });
  }
  if (ui.missionResultRestartBtn) {
    ui.missionResultRestartBtn.addEventListener("click", async () => {
      await restartFromLatestCheckpoint();
      updateTopbar();
      renderSortie();
      renderBase();
      showScreen("main");
    });
  }
  if (ui.emergencyRepairBtn) {
    ui.emergencyRepairBtn.addEventListener("click", () => {
      if (!mission.running || mission.phase !== "battle") return;
      const broken = mission.units.filter((u) => u.isMech && u.mechBroken);
      if (!broken.length) return alert("긴급 수리 대상 메카가 없습니다.");
      const cost = broken.length * 180;
      if (!spendCredits(cost)) return alert("크레딧 부족");
      broken.forEach((u) => {
        u.mechBroken = false;
        u.mechDestroyedThisMission = true;
        u.r = 18;
        u.mechHp = Math.round(u.mechMaxHp * 0.5);
        u.speed = u.baseSpeed || u.speed;
        syncMissionMechOutcome(u);
      });
      updateTopbar();
    });
  }

  ui.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  ui.canvas.addEventListener("mousedown", (e) => {
    if (!mission.running || mission.phase !== "battle") return;
    if (e.button === 2) {
      const raw = missionWorldPos(e.clientX, e.clientY);
      const w = missionClamp(raw.x, raw.y);
      mission.units.forEach((u) => {
        if (mission.phase !== "battle" && !u.visible) return;
        const tx = w.x;
        const ty = w.y;
        const path = computeUnitPath({ x: u.x, y: u.y }, { x: tx, y: ty }, Math.max(16, u.r + 4));
        u.path = path;
        const end = path[path.length - 1] || { x: tx, y: ty };
        u.targetX = end.x;
        u.targetY = end.y;
        const first = path[0] || { x: tx, y: ty };
        u.moveX = first.x;
        u.moveY = first.y;
      });
      return;
    }
    if (e.button !== 0) return;
    e.preventDefault();
    missionInput.draggingCamera = true;
    missionInput.cameraMoved = false;
    missionInput.dragStartX = e.clientX;
    missionInput.dragStartY = e.clientY;
    missionInput.baseCamX = mission.camera.x;
    missionInput.baseCamY = mission.camera.y;
  });
  window.addEventListener("mousemove", (e) => {
    if (!missionInput.draggingCamera || !mission.running) return;
    const dx = e.clientX - missionInput.dragStartX;
    const dy = e.clientY - missionInput.dragStartY;
    if (!missionInput.cameraMoved && Math.hypot(dx, dy) < 6) return;
    missionInput.cameraMoved = true;
    const z = clamp(mission.zoom || 1, getMissionZoomRange().min, getMissionZoomRange().max);
    mission.camera = clampMissionCamera(missionInput.baseCamX - dx / z, missionInput.baseCamY - dy / z);
  });
  window.addEventListener("mouseup", () => {
    missionInput.draggingCamera = false;
    missionInput.cameraMoved = false;
  });
  window.addEventListener("blur", () => {
    missionInput.draggingCamera = false;
    missionInput.cameraMoved = false;
  });
  window.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (!mission.running || mission.phase !== "battle") return;
    if ((e.code === "KeyF" || String(e.key || "").toLowerCase() === "f")) {
      const t = e.target;
      const inInput = t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (inInput) return;
      e.preventDefault();
      interactNearestFieldShop();
    }
  });

  if (ui.missionSkillCards) {
    ui.missionSkillCards.addEventListener("dragstart", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const card = t.closest("[data-skill-id]");
      if (!card) return;
      const sid = card.getAttribute("data-skill-id");
      if (!sid) return;
      mission.skillDragId = sid;
      e.dataTransfer?.setData("text/skill-id", sid);
      e.dataTransfer.effectAllowed = "move";
    });
    ui.missionSkillCards.addEventListener("dragend", () => {
      mission.skillHoverWorld = null;
      mission.skillDragId = null;
    });
  }
  ui.canvas.addEventListener("dragover", (e) => {
    const sid = e.dataTransfer?.getData("text/skill-id") || mission.skillDragId;
    if (!sid) return;
    e.preventDefault();
    mission.skillHoverWorld = missionWorldPos(e.clientX, e.clientY);
  });
  ui.canvas.addEventListener("drop", (e) => {
    const sid = e.dataTransfer?.getData("text/skill-id") || mission.skillDragId;
    if (!sid) return;
    e.preventDefault();
    const w = missionWorldPos(e.clientX, e.clientY);
    const skill = mission.skillCards.find((s) => s.id === sid);
    castSkillCard(skill, w.x, w.y);
    mission.skillHoverWorld = null;
    mission.skillDragId = null;
  });
  ui.canvas.addEventListener(
    "wheel",
    (e) => {
      if (!mission.running || mission.phase === "idle") return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.12 : -0.12;
      setMissionZoom((mission.zoom || 1) + delta, e.clientX, e.clientY);
    },
    { passive: false },
  );

  window.addEventListener("resize", () => {
    if (mission.running) resizeMissionCanvas();
  });

  ui.regionList.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const dispatchBtn = target.closest("[data-dispatch-region]");
    if (dispatchBtn instanceof HTMLElement) {
      const regionId = dispatchBtn.dataset.dispatchRegion;
      if (!regionId) return;
      runRegionDispatch(regionId);
      return;
    }
    const claimBtn = target.closest("[data-claim-restore]");
    if (claimBtn instanceof HTMLElement) {
      const planet = getPlanetById(state.selectedPlanetId);
      if (!planet) return;
      const milestone = Number(claimBtn.dataset.claimRestore || 0);
      if (!milestone) return;
      claimPlanetRestoreReward(planet.id, milestone);
      return;
    }
    const clickNode = target.closest("[data-select-region]");
    if (!(clickNode instanceof HTMLElement)) return;
    const regionId = clickNode.dataset.selectRegion;
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

  const bindBackdropClose = (modalEl, closeFn) => {
    if (!modalEl || typeof closeFn !== "function") return;
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) closeFn();
    });
  };
  bindBackdropClose(ui.planetModal, closePlanetModal);
  bindBackdropClose(ui.facilityModal, closeFacilityModal);
  bindBackdropClose(ui.unitDetailModal, closeUnitDetail);
  bindBackdropClose(ui.itemDetailModal, closeItemDetail);
  bindBackdropClose(ui.missionResultModal, () => {
    ui.missionResultModal.classList.add("hidden");
  });

  const udClose1 = document.getElementById("unitDetailCloseBtn");
  const udClose2 = document.getElementById("unitDetailCloseBtn2");
  const udUpgrade = document.getElementById("unitUpgradeBtn");
  const udPromote = document.getElementById("unitPromoteBtn");
  const itemClose1 = document.getElementById("itemDetailCloseBtn");
  const itemClose2 = document.getElementById("itemDetailCloseBtn2");
  const itemUpgrade = document.getElementById("itemUpgradeBtn");
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
  if (udPromote) {
    udPromote.addEventListener("click", () => {
      if (!state.selectedUnitDetailId) return;
      const unit = getUnitById(state.selectedUnitDetailId);
      if (!unit) return;
      const res = promoteUnitByUnitId(unit.id);
      if (!res.ok) {
        alert(`유닛 성 강화 실패: ${res.reason}`);
        return;
      }
      showActionToast(`${res.name} ${res.star}성 성 강화 완료 (중복 1개 소모)`);
      renderFacilityContent(state.baseTab);
      openUnitDetail(unit.id);
      saveState();
    });
  }
  if (itemUpgrade) {
    itemUpgrade.addEventListener("click", () => {
      if (!state.selectedItemDetailId) return;
      if (upgradeItemById(state.selectedItemDetailId)) {
        updateTopbar();
        openItemDetail(state.selectedItemDetailId);
        if (!ui.facilityModal.classList.contains("hidden")) renderFacilityContent(state.baseTab);
        saveState();
      }
    });
  }

  ui.baseContent.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    let showLoadGaugeForAction = false;
    const hqViewEl = target.closest("[data-hq-view]");
    const hqView = hqViewEl?.dataset.hqView;
    if (hqView) {
      state.hqView = hqView;
      renderFacilityContent(state.baseTab);
      saveState();
      return;
    }
    const actionEl = target.closest("[data-action]");
    const action = actionEl?.dataset.action;
    if (!action) return;
    const id = actionEl?.dataset.id;

    if (action === "complete-quest" && id) {
      completeQuestById(id);
    }

    if (action === "complete-quests-auto") {
      const done = completeAllCompletableQuests();
      if (done > 0) showActionToast(`완료 퀘스트 자동 수령: ${done}개 처리`, "success");
      else showActionToast("자동 수령할 완료 퀘스트가 없습니다.");
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
        alert("히어로를 먼저 선택하세요.");
      } else {
        equipItemToHero(state.hqSelectedHeroId, id);
      }
    }

    if (action === "set-hq-gear-filter" && id) {
      if (["all", "melee", "firearm", "defense", "gear"].includes(id)) {
        state.hqGearFilter = id;
      }
    }

    if (action === "set-codex-tab" && id) {
      if (id === "units" || id === "mechs") state.hqCodexTab = id;
    }

    if (action === "codex-page" && id) {
      showLoadGaugeForAction = true;
      setUiLoadGauge(14, "페이지 로딩 중...");
      if (id === "units-prev") state.hqCodexPageUnits = Math.max(1, (state.hqCodexPageUnits || 1) - 1);
      if (id === "units-next") state.hqCodexPageUnits = (state.hqCodexPageUnits || 1) + 1;
      if (id === "mechs-prev") state.hqCodexPageMechs = Math.max(1, (state.hqCodexPageMechs || 1) - 1);
      if (id === "mechs-next") state.hqCodexPageMechs = (state.hqCodexPageMechs || 1) + 1;
    }

    if (action === "hq-reserve-page" && id) {
      showLoadGaugeForAction = true;
      setUiLoadGauge(14, "페이지 로딩 중...");
      if (id === "prev") state.hqReservePage = Math.max(1, (state.hqReservePage || 1) - 1);
      if (id === "next") state.hqReservePage = (state.hqReservePage || 1) + 1;
    }

    if (action === "codex-unit-info" && id) {
      openUnitDetail(id, { readOnly: true });
    }

    if (action === "codex-unit-info-key" && id) {
      openUnitCodexDetailByKey(id);
    }

    if (action === "promote-unit-codex" && id) {
      const res = promoteUnitByCodexKey(id);
      if (!res.ok) alert(`유닛 성 강화 실패: ${res.reason}`);
      else showActionToast(`${res.name} ${res.star}성 성 강화 완료 (중복 1개 소모)`);
    }

    if (action === "promote-mech-codex" && id) {
      const res = promoteMechByModelKey(id);
      if (!res.ok) alert(`메카 성 강화 실패: ${res.reason}`);
      else showActionToast(`${res.name} ${res.star}성 성 강화 완료 (중복 1기 소모)`);
    }

    if (action === "codex-mech-info" && id) {
      openMechCodexDetail(id);
    }

    if (action === "grant-full-codex") {
      setUiLoadGauge(4, "전체 지급 준비 중...");
      await nextFrame();
      grantFullCodexUnlockRoster();
      setUiLoadGauge(12, "도감 해금 처리 중...");
      await nextFrame();
      const res = await grantOnePerCodexPlayableWithProgress((p, txt) => {
        const normalized = 12 + p * 0.88;
        setUiLoadGauge(normalized, txt || "지급 처리 중...");
      });
      setUiLoadGauge(90, "중복 정리 중...");
      const reconciled = reconcileUnitRosterToSinglePerCodex();
      const exact = await enforceExactUnitRosterByCodexWithProgress((p, txt) => setUiLoadGauge(90 + p * 0.1, txt));
      const mechExact = enforceExactMechRosterByCodex();
      setUiLoadGauge(100, "지급 완료");
      showActionToast(`전체 지급 완료: 유닛 ${exact.total}/${exact.target}, 메카 ${mechExact.unlocked}/${mechExact.target}`);
      updateTopbar();
      renderFacilityContent(state.baseTab);
      saveState();
      hideUiLoadGauge(220);
      return;
    }

    if (action === "auto-equip-units") {
      autoEquipHeroes();
    }

    if (action === "auto-promote-all-units") {
      setUiLoadGauge(18, "자동 성 강화 처리 중...");
      await nextFrame();
      const res = autoPromoteAllUnits();
      setUiLoadGauge(64, "중복 정리 중...");
      await nextFrame();
      const reconciled = reconcileUnitRosterToSinglePerCodex();
      let exact = await enforceExactUnitRosterByCodexWithProgress((p, txt) => setUiLoadGauge(66 + p * 0.34, txt));
      if (exact.total !== exact.target || exact.unique !== exact.target) {
        setUiLoadGauge(82, "데이터 재정렬 중...");
        await nextFrame();
        exact = await enforceExactUnitRosterByCodexWithProgress((p, txt) => setUiLoadGauge(82 + p * 0.18, txt));
      }
      const mechExact = enforceExactMechRosterByCodex();
      setUiLoadGauge(100, "완료");
      hideUiLoadGauge(1000);
      showActionToast(`자동 성 강화 완료: ${res.groups}개 그룹, ${res.promotions}회 강화, ${res.consumed}기 소모 / 유닛 ${exact.total}/${exact.target} / 메카 ${mechExact.unlocked}/${mechExact.target}`);
      renderFacilityContent(state.baseTab);
      saveState();
    }

    if (action === "force-fix-units") {
      setUiLoadGauge(24, "유닛 데이터 강제 정리 중...");
      await nextFrame();
      let exact = await enforceExactUnitRosterByCodexWithProgress((p, txt) => setUiLoadGauge(24 + p * 0.7, txt));
      if (exact.total !== exact.target || exact.unique !== exact.target) {
        setUiLoadGauge(74, "데이터 재정렬 중...");
        await nextFrame();
        exact = await enforceExactUnitRosterByCodexWithProgress((p, txt) => setUiLoadGauge(74 + p * 0.24, txt));
      }
      const mechExact = enforceExactMechRosterByCodex();
      state.rosterCanonicalizedV3 = true;
      setUiLoadGauge(100, `정리 완료 ${exact.total}/${exact.target}`);
      hideUiLoadGauge(1000);
      showActionToast(`강제 정리 완료: 유닛 ${exact.total}/${exact.target}, 메카 ${mechExact.unlocked}/${mechExact.target}`);
      renderFacilityContent(state.baseTab);
      saveState();
    }

    if (action === "clear-all-deployed") {
      const all = getAllUnits();
      let changed = 0;
      all.forEach((u) => {
        if (u.deployed) changed += 1;
        u.deployed = false;
      });
      (state.mechs || []).forEach((m) => {
        m.pilotId = null;
      });
      showActionToast(`출격 인원 전원 해제 완료: ${changed}명`);
      renderFacilityContent(state.baseTab);
      saveState();
    }

    if (action === "auto-deploy-units" || action === "auto-deploy-units-planet") {
      const res = autoDeployUnitsByPreference(state.autoDeployMode || "planet");
      showActionToast(`유닛 자동 배치 완료: ${res.deployed}명 출격 (${res.modeLabel})`);
      renderFacilityContent(state.baseTab);
      saveState();
    }

    if (action === "item-info" && id) {
      openItemDetail(id);
    }

    if (action === "upgrade-item" && id) {
      if (upgradeItemById(id)) {
        if (state.selectedItemDetailId === id && !ui.itemDetailModal.classList.contains("hidden")) openItemDetail(id);
      }
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
      if (!spendCredits(cost)) alert("크레딧 부족");
      else state.factoryLevel += 1;
    }

    if (action === "factory-make-hero") {
      const made = produceFactoryHero(1);
      if (!made) alert("생산 실패: 재화 부족");
      else showActionToast(`히어로 ${made}명 생산 완료`);
    }
    if (action === "factory-make-hero-x5") {
      const made = produceFactoryHero(5);
      if (!made) alert("양산 실패: 재화 부족");
      else showActionToast(`히어로 ${made}명 양산 완료`);
    }
    if (action === "factory-make-weapon") {
      const made = produceFactoryInventory("weapon", 1);
      if (!made) alert("생산 실패: 재화 부족");
      else showActionToast(`무기 ${made}개 생산 완료`);
    }
    if (action === "factory-make-weapon-x5") {
      const made = produceFactoryInventory("weapon", 5);
      if (!made) alert("양산 실패: 재화 부족");
      else showActionToast(`무기 ${made}개 양산 완료`);
    }
    if (action === "factory-make-gear") {
      const made = produceFactoryInventory("gear", 1);
      if (!made) alert("생산 실패: 재화 부족");
      else showActionToast(`장비 ${made}개 생산 완료`);
    }
    if (action === "factory-make-gear-x5") {
      const made = produceFactoryInventory("gear", 5);
      if (!made) alert("양산 실패: 재화 부족");
      else showActionToast(`장비 ${made}개 양산 완료`);
    }
    if (action === "factory-make-ship") {
      const res = produceFactoryShip();
      if (!res.ok) alert(`우주선 해금/업그레이드 실패: ${res.reason}`);
      else if (res.upgraded) showActionToast(`${res.name} 업그레이드 완료 (Lv.${res.lv}, 수용 ${res.cap})`);
      else showActionToast(`${res.name} 해금 완료`);
    }
    if (action === "factory-make-mech") {
      const made = produceFactoryMech(1);
      if (!made) alert("생산 실패: 재화 부족");
      else showActionToast(`메카 ${made}기 생산 완료`);
    }
    if (action === "factory-make-mech-x3") {
      const made = produceFactoryMech(3);
      if (!made) alert("양산 실패: 재화 부족");
      else showActionToast(`메카 ${made}기 양산 완료`);
    }
    if (action === "factory-make-mech-weapon") {
      const made = produceFactoryMechItem("weapon", 1);
      if (!made) alert("생산 실패: 재화 부족");
      else showActionToast(`메카 무장 ${made}개 생산 완료`);
    }
    if (action === "factory-make-mech-weapon-x5") {
      const made = produceFactoryMechItem("weapon", 5);
      if (!made) alert("양산 실패: 재화 부족");
      else showActionToast(`메카 무장 ${made}개 양산 완료`);
    }
    if (action === "factory-make-module") {
      const made = produceFactoryMechItem("module", 1);
      if (!made) alert("생산 실패: 재화 부족");
      else showActionToast(`스킬 모듈 ${made}개 생산 완료`);
    }
    if (action === "factory-make-module-x5") {
      const made = produceFactoryMechItem("module", 5);
      if (!made) alert("양산 실패: 재화 부족");
      else showActionToast(`스킬 모듈 ${made}개 양산 완료`);
    }

    if (action === "upgrade-plant") {
      const curLv = clamp(Math.max(1, Number(state.powerPlantLevel || 1)), 1, PLANT_MAX_LEVEL);
      if (curLv >= PLANT_MAX_LEVEL) {
        alert(`발전소는 최대 Lv.${PLANT_MAX_LEVEL}입니다.`);
      } else {
        const cost = curLv * 800;
        if (!spendCredits(cost)) alert("크레딧 부족");
        else {
          state.powerPlantLevel = clamp(curLv + 1, 1, PLANT_MAX_LEVEL);
          showActionToast(`발전소 업그레이드 완료: Lv.${state.powerPlantLevel}`);
        }
      }
    }

    if (action === "collect-plant-credit") {
      updatePlantAccumulation();
      ensurePlantProductionState();
      const creditGain = Math.floor(state.plantProduction.credit || 0);
      if (creditGain <= 0) {
        showActionToast("발전소 크레딧 누적량이 없습니다.");
      } else {
        state.plantProduction.credit = Math.max(0, Number(state.plantProduction.credit || 0) - creditGain);
        if (!state.settings.infinite) {
          addCredits(creditGain);
        }
        showActionToast(`발전소 수령: 크레딧 +${creditGain}`);
      }
    }

    if (action === "collect-plant-power") {
      updatePlantAccumulation();
      ensurePlantProductionState();
      const powerGain = Math.floor(state.plantProduction.power || 0);
      if (powerGain <= 0) {
        showActionToast("발전소 전력 누적량이 없습니다.");
      } else {
        state.plantProduction.power = Math.max(0, Number(state.plantProduction.power || 0) - powerGain);
        if (!state.settings.infinite) {
          state.power += powerGain;
        }
        showActionToast(`발전소 수령: 전력 +${powerGain}`);
      }
    }

    if (action === "collect-plant-resource" && id) {
      updatePlantAccumulation();
      ensurePlantProductionState();
      const gain = Math.floor(state.plantProduction.resources?.[id] || 0);
      const label = RESOURCE_DEFS[id]?.name || id;
      if (gain <= 0) {
        showActionToast(`발전소 ${label} 누적량이 없습니다.`);
      } else {
        state.plantProduction.resources[id] = Math.max(0, Number(state.plantProduction.resources[id] || 0) - gain);
        if (!state.settings.infinite) {
          addResource(id, gain);
        }
        showActionToast(`발전소 수령: ${label} +${gain}`);
      }
    }

    if (action === "collect-plant-credit" || action === "collect-plant-power" || action === "collect-plant-resource") {
      if (state.baseTab === "plant") renderFacilityContent("plant");
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

    if (action === "hangar-view" && id) {
      if (id === "ships" || id === "mechs") state.hangarView = id;
    }

    if (action === "set-mech-inv-filter" && id) {
      if (["all", "melee", "firearm", "defense", "module", "core"].includes(id)) {
        state.hangarMechInventoryFilter = id;
      }
    }

    if (action === "hangar-mech-page" && id) {
      showLoadGaugeForAction = true;
      setUiLoadGauge(14, "페이지 로딩 중...");
      if (id === "prev") state.hangarMechPage = Math.max(1, (state.hangarMechPage || 1) - 1);
      if (id === "next") state.hangarMechPage = (state.hangarMechPage || 1) + 1;
    }

    if (action === "auto-equip-mechs") {
      autoEquipMechs();
    }

    if (action === "auto-deploy-mechs" || action === "auto-deploy-mechs-planet") {
      const res = autoAssignMechsByPreference(state.autoDeployMode || "planet");
      showActionToast(`메카 자동 배치 완료: ${res.assigned}기 탑승 배정 (${res.modeLabel})`);
      renderFacilityContent(state.baseTab);
      saveState();
    }

    if (action === "select-hangar-mech" && id) {
      const mech = getMechById(id);
      if (mech && mech.unlocked) state.hangarSelectedMechId = id;
    }

    if (action === "select-mech-active" && id) {
      const mech = (state.mechs || []).find((m) => m.id === id && m.unlocked);
      if (mech) {
        state.activeMechId = mech.id;
        state.hangarSelectedMechId = mech.id;
      }
    }

    if (action === "repair-mech" && id) {
      const mech = (state.mechs || []).find((m) => m.id === id && m.unlocked);
      if (mech) {
        const curHp = typeof mech.currentHp === "number" ? mech.currentHp : mech.hp;
        const need = Math.max(0, mech.hp - curHp);
        if (need > 0) {
          const cost = Math.max(60, Math.round(need * 1.4));
          if (!spendCredits(cost)) alert("크레딧 부족");
          else mech.currentHp = mech.hp;
        }
      }
    }

    if (action === "repair-all-mechs") {
      const damaged = (state.mechs || []).filter((m) => {
        if (!m || !m.unlocked) return false;
        const cur = typeof m.currentHp === "number" ? m.currentHp : m.hp;
        return cur < m.hp;
      });
      if (!damaged.length) {
        showActionToast("수리할 파손 메카가 없습니다.");
      } else {
        const totalCost = damaged.reduce((sum, m) => {
          const cur = typeof m.currentHp === "number" ? m.currentHp : m.hp;
          const need = Math.max(0, m.hp - cur);
          return sum + (need > 0 ? Math.max(60, Math.round(need * 1.4)) : 0);
        }, 0);
        if (!spendCredits(totalCost)) {
          alert("크레딧 부족");
        } else {
          damaged.forEach((m) => {
            m.currentHp = m.hp;
          });
          showActionToast(`파손 메카 전체 수리 완료: ${damaged.length}기 (비용 ${totalCost})`);
        }
      }
    }

    if (action === "upgrade-mech" && id) {
      upgradeMechById(id);
    }

    if (action === "equip-mech-item" && id) {
      const mechId = target.dataset.mech || state.hangarSelectedMechId;
      const mech = getMechById(mechId);
      const item = (state.mechInventory || []).find((x) => x.id === id);
      if (mech && item) {
        const preferred = getPreferredMechSlotForItem(mech, item);
        if (preferred) equipMechItemToSlot(mech.id, id, preferred);
      }
    }

    if (action === "unequip-mech-slot" && id) {
      const mech = getMechById(id);
      const slot = target.dataset.slot || "";
      if (mech) {
        unequipMechSlot(mech.id, slot);
        normalizeMechInventory();
      }
    }

    if (action === "hire-merc") {
      const spec = MERC_POOL.find((m) => m.id === id);
      if (spec && !state.mercs.some((m) => m.sourceId === id)) {
        if (!spendCredits(spec.contract)) alert("크레딧 부족");
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
            teamEffect: TEAM_EFFECTS[spec.team] || "없음",
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

    if (action === "refresh-market-offers") {
      if (!spendCredits(10)) alert("크레딧 부족");
      else rerollShopOffers("market", 12);
    }

    if (action === "refresh-black-offers") {
      if (!spendCredits(10)) alert("크레딧 부족");
      else rerollShopOffers("black", 10);
    }

    if (action === "hire-market-offer") {
      const offer = (state.marketOffers || []).find((x) => x.id === id);
      if (offer) hireUnitFromOffer(offer);
    }

    if (action === "hire-black-offer") {
      const offer = (state.blackMarketOffers || []).find((x) => x.id === id);
      if (offer) hireUnitFromOffer(offer);
    }

    if (action === "fire-merc") {
      const idx = state.mercs.findIndex((m) => m.id === id);
      if (idx >= 0) {
        const refund = Math.floor(state.mercs[idx].contract * 0.8);
        if (!state.settings.infinite) addCredits(refund);
        state.mercs.splice(idx, 1);
      }
    }

    if (action === "buy-legend") {
      if (!spendCredits(2200)) alert("크레딧 부족");
      else addItemToOwnedInventory({
        id: `lg-${Date.now()}`,
        name: "전설 무기 패키지",
        itemKind: "weapon",
        mainType: "무기",
        subType: "전설 패키지",
        slotType: "firearm",
        atk: 80,
        def: 10,
        hp: 20,
        speed: 6,
        icon: createItemIcon("전설", "#d9a23f"),
      });
    }

    if (action === "sell-villain") {
      const idx = state.capturedVillains.findIndex((v) => v.id === id);
      if (idx >= 0) {
        if (!state.settings.infinite) addCredits(state.capturedVillains[idx].value);
        state.capturedVillains.splice(idx, 1);
      }
    }

    if (action === "start-reform") {
      const villain = state.capturedVillains.find((v) => v.id === id);
      if (villain) startReformMission(villain, target.dataset.tier || "basic");
    }

    if (action === "transfer-villain" && id) {
      transferVillainById(id);
    }
    if (action === "bulk-transfer-villains") {
      const count = transferBulkVillains();
      if (!count) alert("일괄 인계 가능한 빌런이 없습니다.");
      else state.prisonLog.unshift(`일괄 인계 완료: ${count}명`);
      state.prisonLog = (state.prisonLog || []).slice(0, 24);
    }
    if (action === "bulk-transfer-named-villains") {
      const count = transferNamedOfficerVillains();
      if (!count) alert("네임드 간부 인계 대상이 없습니다.");
      else state.prisonLog.unshift(`네임드 간부 일괄 인계 완료: ${count}명`);
      state.prisonLog = (state.prisonLog || []).slice(0, 24);
    }

    updateTopbar();
    if (showLoadGaugeForAction) setUiLoadGauge(88, "페이지 반영 중...");
    renderFacilityContent(state.baseTab);
    saveState();
    if (showLoadGaugeForAction) {
      setUiLoadGauge(100, "로딩 완료");
      hideUiLoadGauge(180);
    }
  });

  ui.baseContent.addEventListener("dragstart", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const mechEquippedDrag = target.closest("[data-mech-equipped-id]");
    if (mechEquippedDrag) {
      const itemId = mechEquippedDrag.getAttribute("data-mech-equipped-id");
      const mechId = mechEquippedDrag.getAttribute("data-mech-id");
      const slotKey = mechEquippedDrag.getAttribute("data-mech-slot-key");
      if (!itemId || !mechId || !slotKey) return;
      e.dataTransfer?.setData("text/mech-equipped", JSON.stringify({ itemId, mechId, slotKey }));
      e.dataTransfer.effectAllowed = "move";
      return;
    }
    const mechItemDrag = target.closest("[data-mech-item-id]");
    if (mechItemDrag) {
      const itemId = mechItemDrag.getAttribute("data-mech-item-id");
      if (!itemId) return;
      e.dataTransfer?.setData("text/mech-item", itemId);
      e.dataTransfer.effectAllowed = "move";
      return;
    }
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
    const mechEquipZone = target.closest("[data-mech-equip-slot]");
    const mechInvZone = target.closest("[data-drop-mech-inventory]");
    const mechCardZone = target.closest("[data-mech-card-drop]");
    if (!zone && !heroZone && !equipZone && !invZone && !mechEquipZone && !mechInvZone && !mechCardZone) return;
    e.preventDefault();
  });

  ui.baseContent.addEventListener("drop", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const zone = target.closest("[data-drop-zone]");
    const itemId = e.dataTransfer?.getData("text/item");
    const equippedPayload = e.dataTransfer?.getData("text/equipped");
    const mechItemId = e.dataTransfer?.getData("text/mech-item");
    const mechEquippedPayload = e.dataTransfer?.getData("text/mech-equipped");

    if (mechEquippedPayload) {
      e.preventDefault();
      let payload = null;
      try {
        payload = JSON.parse(mechEquippedPayload);
      } catch (err) {
        payload = null;
      }
      if (payload) {
        const mechInvDrop = target.closest("[data-drop-mech-inventory]");
        if (mechInvDrop) {
          unequipMechSlot(payload.mechId, payload.slotKey);
          normalizeMechInventory();
          renderFacilityContent(state.baseTab);
          saveState();
          return;
        }
        const mechEquipTarget = target.closest("[data-mech-equip-slot]");
        if (mechEquipTarget) {
          const mechId = mechEquipTarget.getAttribute("data-mech-id");
          const slotKey = mechEquipTarget.getAttribute("data-mech-equip-slot");
          if (mechId && slotKey) {
            const srcMech = getMechById(payload.mechId);
            const moved = srcMech ? getMechSlotItem(srcMech, payload.slotKey) : null;
            if (moved && itemFitsMechSlot(moved, slotKey)) {
              setMechSlotItem(srcMech, payload.slotKey, null);
              const dstMech = getMechById(mechId);
              const old = dstMech ? getMechSlotItem(dstMech, slotKey) : null;
              if (old) state.mechInventory.push(old);
              if (dstMech) setMechSlotItem(dstMech, slotKey, moved);
            }
            normalizeMechInventory();
            renderFacilityContent(state.baseTab);
            saveState();
          }
          return;
        }
        const mechCardTarget = target.closest("[data-mech-card-drop]");
        if (mechCardTarget) {
          const mechId = mechCardTarget.getAttribute("data-mech-card-drop");
          const srcMech = getMechById(payload.mechId);
          const moved = srcMech ? getMechSlotItem(srcMech, payload.slotKey) : null;
          const dstMech = mechId ? getMechById(mechId) : null;
          const preferred = moved && dstMech ? getPreferredMechSlotForItem(dstMech, moved) : null;
          if (moved && dstMech && preferred && itemFitsMechSlot(moved, preferred)) {
            setMechSlotItem(srcMech, payload.slotKey, null);
            const old = getMechSlotItem(dstMech, preferred);
            if (old) state.mechInventory.push(old);
            setMechSlotItem(dstMech, preferred, moved);
            normalizeMechInventory();
          }
          renderFacilityContent(state.baseTab);
          saveState();
          return;
        }
      }
    }

    if (mechItemId) {
      e.preventDefault();
      const mechEquipTarget = target.closest("[data-mech-equip-slot]");
      if (mechEquipTarget) {
        const mechId = mechEquipTarget.getAttribute("data-mech-id") || state.hangarSelectedMechId;
        const slotKey = mechEquipTarget.getAttribute("data-mech-equip-slot");
        if (mechId && slotKey) equipMechItemToSlot(mechId, mechItemId, slotKey);
      } else {
        const mechCardTarget = target.closest("[data-mech-card-drop]");
        const mechId = mechCardTarget?.getAttribute("data-mech-card-drop");
        const mech = mechId ? getMechById(mechId) : null;
        const item = (state.mechInventory || []).find((it) => it.id === mechItemId);
        const preferred = mech && item ? getPreferredMechSlotForItem(mech, item) : null;
        if (mech && preferred) equipMechItemToSlot(mech.id, mechItemId, preferred);
      }
      normalizeMechInventory();
      renderFacilityContent(state.baseTab);
      saveState();
      return;
    }

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
        alert("현재 우주선 수용 인원을 초과했습니다.");
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
    const autoModeSel = target.dataset.autoDeployMode;
    if (autoModeSel) {
      const v = target.value;
      if (v === "planet" || v === "all" || ATTR_ORDER.includes(v)) {
        state.autoDeployMode = v;
      } else {
        state.autoDeployMode = "planet";
      }
      renderFacilityContent(state.baseTab);
      saveState();
      return;
    }
    const mechPilotId = target.dataset.mechPilot;
    if (mechPilotId) {
      assignPilotToMech(mechPilotId, target.value || null);
      renderFacilityContent(state.baseTab);
      saveState();
      return;
    }
    const key = target.dataset.filterKey;
    if (!key) return;
    if (!state.hqReserveFilter) state.hqReserveFilter = { roleClass: "all", attribute: "all", rangeClass: "all" };
    if (!["roleClass", "attribute", "rangeClass"].includes(key)) return;
    state.hqReserveFilter[key] = target.value;
    state.hqReservePage = 1;
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
    alert("저장 완료");
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PROGRESS_SAVE_KEY);
    localStorage.removeItem(MANUAL_SAVE_KEY);
    localStorage.removeItem(LATEST_CHECKPOINT_CACHE_KEY);
    clearManualSaveDb().finally(() => location.reload());
  });

  document.getElementById("exitBtn").addEventListener("click", () => {
    alert("웹 버전에서는 창 종료를 지원하지 않습니다.");
  });

  if (ui.manualSaveNowBtn) {
    ui.manualSaveNowBtn.addEventListener("click", async () => {
      await createManualSaveNow();
    });
  }
  if (ui.manualSaveList) {
    ui.manualSaveList.addEventListener("click", async (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest("button");
      if (!(btn instanceof HTMLElement)) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (!action || !id) return;
      if (action === "load-manual-save") {
        await loadManualSaveById(id);
      } else if (action === "delete-manual-save") {
        await deleteManualSaveById(id);
      }
    });
  }
}

function applySettingsFromForm() {
  state.settings.sound = document.getElementById("soundToggle").checked;
  state.settings.language = document.getElementById("languageSelect").value;
  state.settings.difficulty = normalizeDifficultyValue(document.getElementById("difficultySelect").value);
  state.settings.godMode = document.getElementById("godModeToggle").checked || state.settings.difficulty === "invincible";
  state.settings.infinite = document.getElementById("infiniteToggle").checked;
}

async function init() {
  bindEvents();
  bindMainMenuHelp();
  await migrateLegacyManualSlotsIfNeeded();
  renderManualSaveList();
  await hydrateAutoRuntimeStateIfNewer();
  const bootPlacementSnapshot = captureRosterPlacementSnapshot(state);
  if (!(state.autoDeployMode === "planet" || state.autoDeployMode === "all" || ATTR_ORDER.includes(state.autoDeployMode))) {
    state.autoDeployMode = "planet";
  }
  ensureQuestState();
  ensureRosterState();
  normalizeOwnedInventoriesByType();
  grantRecoveryAssetBundleOnce();
  restoreRosterPlacementFromSnapshot(bootPlacementSnapshot);
  ensureTradeState();
  ensurePrisonState();
  ensurePlanetProgressState();
  grantOnePerCodexPlayable();
  if (!state.fullCodexGranted) {
    grantFullCodexUnlockRoster();
    grantOnePerCodexPlayable();
    state.rosterCanonicalizedV2 = true;
    state.fullCodexGranted = true;
    saveState();
  }
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
  const runPostInitNormalization = async () => {
    try {
      const target = getUnitCodexCatalog().length;
      const unique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
      const mechUnique = new Set((state.mechs || []).map((m) => getMechCodexKeyNormalized(m))).size;
      const mechTarget = getMechCodexCatalog().length;
      if (unique < target || mechUnique < mechTarget || !state.rosterCanonicalizedV3) {
        setUiLoadGauge(20, "유닛 데이터 정리 중...");
        await nextFrame();
        grantFullCodexUnlockRoster();
        grantOnePerCodexPlayable();
        setUiLoadGauge(92, "메카 데이터 정리 중...");
        await nextFrame();
        state.rosterCanonicalizedV3 = true;
        const nowUnique = new Set(getAllUnits().map((u) => getUnitCodexKey(u))).size;
        const nowMechUnique = new Set((state.mechs || []).map((m) => getMechCodexKeyNormalized(m))).size;
        updateTopbar();
        if (!ui.facilityModal.classList.contains("hidden")) renderFacilityContent(state.baseTab);
        saveState();
        setUiLoadGauge(100, `정리 완료 유닛 ${nowUnique}/${target} / 메카 ${nowMechUnique}/${mechTarget}`);
        hideUiLoadGauge(900);
      }
    } catch (_) {
      hideUiLoadGauge(0);
    }
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => { void runPostInitNormalization(); }, { timeout: 900 });
  } else {
    setTimeout(() => { void runPostInitNormalization(); }, 60);
  }
  setInterval(() => {
    updatePlantAccumulation();
    updateEmergencyQuestStatus();
    if (!ui.facilityModal.classList.contains("hidden")) {
      if (state.baseTab === "hq" && state.hqView === "quests") renderFacilityContent("hq");
      if (state.baseTab === "plant") renderFacilityContent("plant");
    }
  }, 1000);
  setInterval(() => {
    saveState();
  }, 30000);
}

init().catch((e) => {
  console.warn("INIT_FAILED", e);
});
