/* ── Z-Sales Pro Survey Types ── */

export type SurveyTone =
  | "minimal"
  | "emotional"
  | "data_trust"
  | "witty_casual"
  | "luxury"
  | "friendly_local";

export type SurveyUspKey =
  | "price"
  | "quality"
  | "design"
  | "efficacy"
  | "convenience"
  | "brand";

export type SurveyUseScenario =
  | "daily"
  | "gift"
  | "special"
  | "work"
  | "care";

export type SurveyPricePositioning = "value" | "reasonable" | "premium";

export type SurveyForbiddenKey =
  | "exaggeration"
  | "medical"
  | "comparison"
  | "price_emphasis";

export type SurveyAnswers = {
  channel: string;
  productInferred?: {
    brand?: string;
    productName?: string;
    category?: string;
    estimatedPrice?: string;
  };
  tone?: SurveyTone;
  targetPersona?: {
    ageRange: string;
    description: string;
  };
  uspRanking?: SurveyUspKey[];
  competitor?: {
    name?: string;
    pricePoint?: string;
    theirAngle?: string;
    ourEdge: string;
  };
  useScenario?: SurveyUseScenario;
  pricePositioning?: SurveyPricePositioning;
  forbidden?: SurveyForbiddenKey[];
  mustInclude?: string;
};

export type SurveyGeneratePayload = {
  requestText: string;
  rolloutRequest: string;
  knowledgeText: string;
};

/* ── Label Maps ── */

export const TONE_LABELS: Record<SurveyTone, string> = {
  minimal: "미니멀",
  emotional: "감성 스토리",
  data_trust: "데이터 신뢰",
  witty_casual: "위트 캐주얼",
  luxury: "럭셔리",
  friendly_local: "친근한 동네",
};

const TONE_DIRECTIVE: Record<SurveyTone, string> = {
  minimal: "여백 충분, 중성 톤 위주, 산세리프 폰트, 큰 제품컷 1개 + 짧은 카피. 장식 최소화.",
  emotional: "라이프스타일 사진과 감성 무드. 따뜻한 톤. 짧은 스토리 카피 위주.",
  data_trust: "데이터/성분/인증 패널 중심. 표/차트/아이콘 활용. 네이비/그레이 팔레트.",
  witty_casual: "재치 있는 문구와 컬러풀한 일러스트. 친근한 말투. 밝고 경쾌한 무드.",
  luxury: "흑금/딥톤 강한 대비. 큰 여백. 세리프 폰트. 패키지 디테일. 카피 절제.",
  friendly_local: "동네 가게 같은 친근함. 손글씨 느낌 폰트. 사장 한마디. 베이지/크림톤.",
};

export const USP_LABELS: Record<SurveyUspKey, string> = {
  price: "가격",
  quality: "품질",
  design: "디자인",
  efficacy: "효능",
  convenience: "편의성",
  brand: "브랜드",
};

const USP_SECTION_WEIGHT: Record<SurveyUspKey, string> = {
  price: "가격 가치를 핵심 메시지로 전개",
  quality: "자료/인증/성분 비중 확대, 제품컷 클로즈업",
  design: "비주얼 비중 확대, 디자인 디테일 컷 추가",
  efficacy: "사용 결과/전후 비교 비중 확대",
  convenience: "가장 쉬운 3스텝으로 단순화, 시간/노력 절감 강조",
  brand: "브랜드 스토리/철학 삽입",
};

export const SCENARIO_LABELS: Record<SurveyUseScenario, string> = {
  daily: "일상 루틴",
  gift: "선물용",
  special: "특별한 날",
  work: "업무용",
  care: "케어용",
};

export const PRICE_LABELS: Record<SurveyPricePositioning, string> = {
  value: "가성비",
  reasonable: "합리적",
  premium: "프리미엄",
};

const PRICE_DIRECTIVE: Record<SurveyPricePositioning, string> = {
  value: "가격 대비 가치를 직접 강조. 비교표/1회당 비용 등 수치 비교 활용.",
  reasonable: "가격을 전면에 내세우지 않고 '이 가격에 이 품질' 구조로 전개.",
  premium: "가격을 변호하지 말고 가치를 설계. 소재/인증/디테일 클로즈업과 절제된 카피.",
};

export const FORBIDDEN_LABELS: Record<SurveyForbiddenKey, string> = {
  exaggeration: "과장 표현 ('최고', '유일', '100%' 등)",
  medical: "의료적 효능 표현 ('치료', '개선', '예방' 등)",
  comparison: "타사 직접 비교 ('A사보다' 등)",
  price_emphasis: "가격 강조 ('최저가', '파격가' 등)",
};

/* ── Synthesizer (결정적 함수, LLM 호출 없음) ── */

export function synthesize(answers: SurveyAnswers): SurveyGeneratePayload {
  return {
    requestText: buildRequestText(answers),
    rolloutRequest: buildRolloutRequest(answers),
    knowledgeText: buildKnowledgeText(answers),
  };
}

function buildRequestText(a: SurveyAnswers): string {
  const parts: string[] = ["전환율 중심 리디자인"];
  if (a.tone) parts.push(`톤: ${TONE_LABELS[a.tone]}`);
  if (a.uspRanking?.length) parts.push(`핵심 소구: ${USP_LABELS[a.uspRanking[0]]}`);
  if (a.pricePositioning) parts.push(`가격: ${PRICE_LABELS[a.pricePositioning]}`);
  if (a.useScenario) parts.push(`시나리오: ${SCENARIO_LABELS[a.useScenario]}`);
  return parts.join(" / ");
}

function buildRolloutRequest(a: SurveyAnswers): string {
  const parts: string[] = [];
  if (a.competitor?.ourEdge) {
    parts.push(`경쟁사 대비 핵심 차별점: "${a.competitor.ourEdge.trim()}".`);
  }
  if (a.uspRanking?.length) {
    const directives = a.uspRanking.slice(0, 3)
      .map((k, i) => `${i + 1}순위 ${USP_LABELS[k]} - ${USP_SECTION_WEIGHT[k]}`)
      .join("\n");
    parts.push(`USP 우선순위:\n${directives}`);
  }
  if (a.mustInclude?.trim()) {
    parts.push(`필수 포함: "${a.mustInclude.trim()}"`);
  }
  return parts.join("\n\n");
}

function buildKnowledgeText(a: SurveyAnswers): string {
  const blocks: string[] = [];

  if (a.tone) {
    blocks.push(`## 브랜드 톤\n선택: ${TONE_LABELS[a.tone]}\n적용: ${TONE_DIRECTIVE[a.tone]}`);
  }
  if (a.targetPersona) {
    blocks.push(`## 타겟 페르소나\n연령대: ${a.targetPersona.ageRange}\n설명: "${a.targetPersona.description}"`);
  }
  if (a.uspRanking?.length) {
    const ranked = a.uspRanking.map((k, i) => `${i + 1}순위: ${USP_LABELS[k]}`).join("\n");
    blocks.push(`## USP 우선순위\n${ranked}`);
  }
  if (a.competitor) {
    const lines: string[] = [];
    if (a.competitor.name) lines.push(`경쟁사: ${a.competitor.name}`);
    if (a.competitor.pricePoint) lines.push(`경쟁사 가격: ${a.competitor.pricePoint}`);
    if (a.competitor.theirAngle) lines.push(`경쟁사 강점: ${a.competitor.theirAngle}`);
    lines.push(`우리 차별점: ${a.competitor.ourEdge}`);
    blocks.push(`## 경쟁사 비교\n${lines.join("\n")}`);
  }
  if (a.useScenario) {
    blocks.push(`## 사용 시나리오\n${SCENARIO_LABELS[a.useScenario]}`);
  }
  if (a.pricePositioning) {
    blocks.push(`## 가격 포지셔닝\n선택: ${PRICE_LABELS[a.pricePositioning]}\n규칙: ${PRICE_DIRECTIVE[a.pricePositioning]}`);
  }
  if (a.forbidden?.length) {
    const items = a.forbidden.map((k) => `- ${FORBIDDEN_LABELS[k]}`).join("\n");
    blocks.push(`## 금지 표현\n${items}`);
  }
  if (a.mustInclude?.trim()) {
    blocks.push(`## 필수 포함\n"${a.mustInclude.trim()}"`);
  }
  if (a.productInferred) {
    const p = a.productInferred;
    const lines: string[] = [];
    if (p.brand) lines.push(`브랜드: ${p.brand}`);
    if (p.productName) lines.push(`제품명: ${p.productName}`);
    if (p.category) lines.push(`카테고리: ${p.category}`);
    if (p.estimatedPrice) lines.push(`추정 가격: ${p.estimatedPrice}`);
    if (lines.length) blocks.push(`## 제품 정보 (자동 분석)\n${lines.join("\n")}`);
  }

  return blocks.join("\n\n");
}
