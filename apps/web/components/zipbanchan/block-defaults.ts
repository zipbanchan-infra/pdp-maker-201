import type { ZipbanchanBlock, ZipbanchanComponentType } from "./types";

let nextId = 1;
function uid() {
  return `zb-${Date.now()}-${nextId++}`;
}

function fid() {
  return `fi-${Date.now()}-${nextId++}`;
}

function placeholder(w: number, h: number, label: string, bg = "#e8e4db", fg = "#aaa") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect fill="${bg}" width="${w}" height="${h}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="${fg}">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PH_FOOD = placeholder(400, 400, "음식 사진");
const PH_HERO = placeholder(800, 400, "히어로 이미지", "#d4e8c2", "#6b8c4e");
const PH_INGREDIENT = placeholder(400, 400, "재료 사진", "#e8f0d8", "#5b8c3e");
const PH_CHEF = placeholder(200, 200, "셰프", "#f0ede6", "#999");
const PH_BANNER = placeholder(800, 300, "배너 이미지", "#f5f0e8", "#bbb");

export const PALETTE_ITEMS: {
  type: ZipbanchanComponentType;
  label: string;
  icon: string;
  hint: string;
  group: "layout" | "content" | "promo" | "story" | "info";
}[] = [
  // Layout
  { type: "hero-banner", label: "히어로 배너", icon: "🎨", hint: "밝은 테마 배너 (기획전형)", group: "layout" },
  { type: "dark-hero-banner", label: "다크 히어로", icon: "🌙", hint: "어두운 테마 배너 (정월대보름)", group: "layout" },
  { type: "section-header", label: "섹션 구분", icon: "📌", hint: "아이콘 + 카테고리 제목", group: "layout" },
  { type: "divider", label: "구분선", icon: "---", hint: "라인/점/잎 구분선", group: "layout" },
  { type: "image-banner", label: "이미지 배너", icon: "🖼️", hint: "전체 너비 사진", group: "layout" },
  { type: "text-banner", label: "텍스트 배너", icon: "💬", hint: "배경색 전환 + 설득 카피", group: "layout" },
  { type: "intro-text", label: "도입 문구", icon: "✏️", hint: "첫 인사/테마 소개", group: "layout" },
  { type: "highlight-text", label: "강조 텍스트", icon: "🖍️", hint: "키워드 컬러 강조", group: "layout" },

  // Content
  { type: "food-grid", label: "음식 그리드", icon: "🍱", hint: "2-3열 음식 나열", group: "content" },
  { type: "food-list", label: "음식 리스트", icon: "📋", hint: "세로 목록 (사진+이름)", group: "content" },
  { type: "food-feature", label: "음식 피처", icon: "🍽️", hint: "대형 단일 음식 소개", group: "content" },
  { type: "food-horizontal-card", label: "가로 카드", icon: "↔️", hint: "사진 좌/우 + 설명", group: "content" },
  { type: "ranking-section", label: "랭킹", icon: "🏆", hint: "BEST/TOP 순위형", group: "content" },
  { type: "md-pick-section", label: "MD 추천", icon: "👑", hint: "MD's Pick 큐레이션", group: "content" },
  { type: "category-tag", label: "카테고리 태그", icon: "🏷️", hint: "태그 그룹 (필터/분류)", group: "content" },
  { type: "testimonial-card", label: "후기 카드", icon: "💬", hint: "고객 리뷰/평점", group: "content" },

  // Story
  { type: "story-section", label: "스토리", icon: "📖", hint: "단계별 과정 스토리", group: "story" },
  { type: "ingredient-showcase", label: "재료 소개", icon: "🥬", hint: "대형 재료 사진 + 설명", group: "story" },
  { type: "flow-connector", label: "플로우 화살표", icon: "⬇️", hint: "단계 연결 화살표", group: "story" },
  { type: "chef-profile", label: "셰프 프로필", icon: "👨‍🍳", hint: "전문가 소개 카드", group: "story" },

  // Info & Promo
  { type: "nutrition-badge", label: "영양 정보", icon: "🥗", hint: "칼로리/영양 배지", group: "info" },
  { type: "icon-bullet-list", label: "아이콘 리스트", icon: "✅", hint: "아이콘 + 항목 나열", group: "info" },
  { type: "delivery-info", label: "배송 정보", icon: "🚚", hint: "배송/포장 안내 바", group: "info" },
  { type: "promo-banner", label: "프로모션 배너", icon: "🎉", hint: "할인/CTA 전체 배너", group: "promo" },
  { type: "coupon-banner", label: "쿠폰 배너", icon: "🎫", hint: "할인율 대형 표시", group: "promo" },
  { type: "cta-button", label: "CTA 버튼", icon: "👆", hint: "클릭 유도 버튼", group: "promo" },
  { type: "countdown-badge", label: "긴급 배지", icon: "⏰", hint: "마감임박/한정수량", group: "promo" },
  { type: "brand-footer", label: "브랜드 푸터", icon: "🏠", hint: "하단 브랜드 서명", group: "promo" },
];

export function createDefaultBlock(type: ZipbanchanComponentType): ZipbanchanBlock {
  switch (type) {
    case "hero-banner":
      return { type: "hero-banner", id: uid(), title: "우리집 홈런 식탁", subtitle: "집반찬과 함께 즐기는 한끼 식사", backgroundColor: "#e8f0d8", accentColor: "#2d5016", backgroundImageUrl: PH_HERO };

    case "dark-hero-banner":
      return { type: "dark-hero-banner", id: uid(), title: "정월대보름", subtitle: "풍성한 보름달 아래 특별한 한 상", backgroundColor: "#2c3e6b", accentColor: "#f5e6c8", theme: "전통 명절", backgroundImageUrl: PH_HERO };

    case "section-header":
      return { type: "section-header", id: uid(), icon: "M", title: "메인 요리", subtitle: "든든한 한 끼를 책임지는 메인 반찬" };

    case "food-card":
      return { type: "food-card", id: uid(), item: { id: fid(), name: "소고기육전", imageUrl: PH_FOOD }, shape: "rounded-square" };

    case "food-grid":
      return { type: "food-grid", id: uid(), columns: 2, shape: "rounded-square", items: [
        { id: fid(), name: "소고기육전", imageUrl: PH_FOOD },
        { id: fid(), name: "한돈 대파 제육볶음", imageUrl: PH_FOOD },
        { id: fid(), name: "궁중 떡볶이", imageUrl: PH_FOOD },
        { id: fid(), name: "한돈 미나리 고추장불고기", imageUrl: PH_FOOD },
      ]};

    case "food-list":
      return { type: "food-list", id: uid(), showDescription: true, items: [
        { id: fid(), name: "봄나물 달래무침", imageUrl: PH_FOOD, description: "새콤달콤한 봄 향기" },
        { id: fid(), name: "냉이된장국", imageUrl: PH_FOOD, description: "구수하고 깊은 맛" },
      ]};

    case "food-feature":
      return { type: "food-feature", id: uid(), layout: "centered", item: { id: fid(), name: "궁중 잡채", imageUrl: PH_FOOD, description: "당면과 채소가 어우러진 정성 가득 잡채", calories: "280kcal" }};

    case "food-horizontal-card":
      return { type: "food-horizontal-card", id: uid(), imagePosition: "left", item: { id: fid(), name: "소고기육전과 새콤파채", imageUrl: PH_FOOD, description: "부드러운 육전에 새콤한 파채를 곁들여 맛의 균형을 완성합니다.", badge: "인기" }};

    case "text-banner":
      return { type: "text-banner", id: uid(), headline: "밥? 술안주도 가능!\n든든한 메인 요리", body: "쌀밥 위에 올려도, 초간단 술안주로도 훌륭하게 즐길 수 있는 반찬을 추천합니다.", backgroundColor: "#faf6ee", textColor: "#3d3d3d", alignment: "center" };

    case "intro-text":
      return { type: "intro-text", id: uid(), text: "집반찬과 함께 즐겨보세요! 9월 맛집에서 한눈에 콕 골라드릴게요. 즐거운 한 끼가 될 거예요.", emphasis: "이번 주 추천 반찬을 확인해 보세요!", alignment: "center" };

    case "highlight-text":
      return { type: "highlight-text", id: uid(), beforeText: "오늘 저녁에도 ", highlightedText: "든든한", afterText: " 한 끼를 준비해 보세요.", highlightColor: "rgba(245, 197, 66, 0.3)" };

    case "promo-banner":
      return { type: "promo-banner", id: uid(), title: "집반찬연구소 첫 주문 혜택", subtitle: "지금 바로 집반찬을 만나보세요", discount: "-50%", ctaText: "주문하러 가기", backgroundColor: "#2c3e6b", accentColor: "#f5c542" };

    case "coupon-banner":
      return { type: "coupon-banner", id: uid(), discount: "~50%", title: "정월대보름 반찬 특별 할인", description: "2월 한정 기획전 할인", backgroundColor: "#2c3e6b", accentColor: "#f5c542" };

    case "ranking-section":
      return { type: "ranking-section", id: uid(), title: "이번 달 BEST", badge: "TOP 5", items: [
        { id: fid(), name: "소고기 장조림", imageUrl: PH_FOOD, description: "꾸준한 1위" },
        { id: fid(), name: "궁중 잡채", imageUrl: PH_FOOD, description: "특별한 날 인기" },
        { id: fid(), name: "매콤 닭갈비", imageUrl: PH_FOOD, description: "MZ 인기 메뉴" },
      ]};

    case "md-pick-section":
      return { type: "md-pick-section", id: uid(), title: "이달의 맛집 추천", subtitle: "MD가 직접 고른 이 달의 반찬", badgeText: "MD's Pick", items: [
        { id: fid(), name: "한돈 제육볶음", imageUrl: PH_FOOD },
        { id: fid(), name: "궁중 떡볶이", imageUrl: PH_FOOD },
      ]};

    case "story-section":
      return { type: "story-section", id: uid(), title: "이렇게 만들어요", steps: [
        { imageUrl: PH_INGREDIENT, caption: "신선한 재료 준비", description: "매일 아침 직접 고른 재료" },
        { imageUrl: PH_FOOD, caption: "정성스러운 조리", description: "30년 경력 셰프의 손맛" },
        { imageUrl: PH_FOOD, caption: "위생 포장 배송", description: "냉장 직배송으로 신선하게" },
      ]};

    case "ingredient-showcase":
      return { type: "ingredient-showcase", id: uid(), ingredientName: "국내산 쭈꾸미", imageUrl: PH_INGREDIENT, description: "통영 앞바다에서 갓 잡아올린 신선한 쭈꾸미를 사용합니다.", origin: "경남 통영산", highlights: ["고단백", "저칼로리", "타우린 풍부"] };

    case "chef-profile":
      return { type: "chef-profile", id: uid(), name: "김집반", title: "집반찬연구소 수석 연구원", imageUrl: PH_CHEF, quote: "매일 먹는 반찬이니까, 정성을 다합니다.", credentials: ["한식 조리기능장", "30년 경력"] };

    case "nutrition-badge":
      return { type: "nutrition-badge", id: uid(), calories: "350kcal", highlights: [
        { label: "용량", value: "300ml" },
        { label: "단백질", value: "12g" },
        { label: "나트륨", value: "480mg" },
      ], backgroundColor: "#f0ede6" };

    case "icon-bullet-list":
      return { type: "icon-bullet-list", id: uid(), items: [
        { icon: "01", text: "100% 국내산 재료", subtext: "원산지 표시 의무 준수" },
        { icon: "02", text: "냉장 직배송", subtext: "조리 후 당일 출고" },
        { icon: "03", text: "친환경 포장", subtext: "재활용 가능한 용기 사용" },
      ]};

    case "category-tag":
      return { type: "category-tag", id: uid(), tags: [
        { label: "메인 반찬", backgroundColor: "#5b8c3e", color: "#fff" },
        { label: "국/찌개", backgroundColor: "#f0ede6", color: "#5b8c3e" },
        { label: "밑반찬", backgroundColor: "#f0ede6", color: "#5b8c3e" },
        { label: "간식", backgroundColor: "#f0ede6", color: "#5b8c3e" },
      ]};

    case "image-banner":
      return { type: "image-banner", id: uid(), imageUrl: PH_BANNER, alt: "음식 사진", aspectRatio: "16:9", borderRadius: true };

    case "divider":
      return { type: "divider", id: uid(), style: "leaf", color: "#5b8c3e" };

    case "cta-button":
      return { type: "cta-button", id: uid(), text: "이번 주 식탁에 올려보세요", backgroundColor: "#5b8c3e", textColor: "#fff", size: "large", fullWidth: true };

    case "flow-connector":
      return { type: "flow-connector", id: uid(), direction: "down", label: "다음 단계", color: "#5b8c3e" };

    case "countdown-badge":
      return { type: "countdown-badge", id: uid(), text: "마감임박 - 이번 주까지!", backgroundColor: "#e74c3c", textColor: "#fff" };

    case "brand-footer":
      return { type: "brand-footer", id: uid(), brandName: "집반찬연구소", tagline: "매일 먹는 반찬, 정성을 다합니다", backgroundColor: "#5b8c3e", textColor: "#fff" };

    case "delivery-info":
      return { type: "delivery-info", id: uid(), items: [
        { icon: "D", label: "배송", value: "냉장 직배송" },
        { icon: "P", label: "포장", value: "친환경 용기" },
        { icon: "T", label: "출고", value: "당일 출고" },
      ]};

    case "testimonial-card":
      return { type: "testimonial-card", id: uid(), quote: "아이가 잘 먹어서 매주 시키게 됩니다. 반찬 걱정이 사라졌어요.", author: "김*영 고객님", rating: 5 };

    default:
      return { type: "text-banner", id: uid(), headline: "텍스트 배너", body: "내용을 입력하세요", backgroundColor: "#faf6ee", textColor: "#3d3d3d", alignment: "center" };
  }
}
