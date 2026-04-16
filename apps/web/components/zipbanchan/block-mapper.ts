import type { LandingPageBlueprint, SectionBlueprint } from "../../lib/shared/pdp";
import type { ZipbanchanBlock, FoodItem } from "./types";

let mapId = 1;
function uid() {
  return `zbm-${Date.now()}-${mapId++}`;
}
function fid() {
  return `fim-${Date.now()}-${mapId++}`;
}

type SectionCategory =
  | "hero"
  | "food-category"
  | "persuasion"
  | "ranking"
  | "story"
  | "ingredient"
  | "chef"
  | "promo"
  | "benefit"
  | "review"
  | "generic";

function classifySection(section: SectionBlueprint): SectionCategory {
  const name = (section.section_name || "").toLowerCase();
  const goal = (section.goal || "").toLowerCase();
  const combined = `${name} ${goal}`;

  if (/히어로|hero|배너|banner|테마/.test(combined)) return "hero";
  if (/랭킹|ranking|best|top|추천|인기/.test(combined)) return "ranking";
  if (/스토리|story|과정|만들|조리|레시피/.test(combined)) return "story";
  if (/재료|ingredient|원재료|소재|산지/.test(combined)) return "ingredient";
  if (/셰프|chef|전문가|연구원|프로필/.test(combined)) return "chef";
  if (/프로모|promo|할인|쿠폰|혜택|discount/.test(combined)) return "promo";
  if (/베네핏|benefit|장점|특징|왜|이유/.test(combined)) return "benefit";
  if (/후기|review|리뷰|testimonial|평가/.test(combined)) return "review";
  if (/설득|카피|텍스트|소개|안내/.test(combined)) return "persuasion";
  if (/반찬|메인|국|찌개|밑반찬|간식|요리|음식|카테고리|메뉴/.test(combined)) return "food-category";

  return "generic";
}

function extractFoodItemsFromBullets(section: SectionBlueprint): FoodItem[] {
  return section.bullets.map((bullet, i) => ({
    id: fid(),
    name: bullet.replace(/^[-·•]\s*/, "").split(/[,.:]/)[0].trim(),
    imageUrl: i === 0 && section.generatedImage ? section.generatedImage : "",
    description: bullet.length > 20 ? bullet : undefined,
  }));
}

function buildHeroBlocks(section: SectionBlueprint, isFirst: boolean): ZipbanchanBlock[] {
  const blocks: ZipbanchanBlock[] = [];

  const isDark = /어두|dark|밤|보름|명절|전통/.test(`${section.section_name} ${section.style_guide}`);

  if (isDark) {
    blocks.push({
      type: "dark-hero-banner",
      id: uid(),
      title: section.headline,
      subtitle: section.subheadline,
      backgroundColor: "#2c3e6b",
      accentColor: "#f5e6c8",
      backgroundImageUrl: section.generatedImage || undefined,
      theme: section.section_name,
    });
  } else {
    blocks.push({
      type: "hero-banner",
      id: uid(),
      title: section.headline,
      subtitle: section.subheadline,
      backgroundColor: "#e8f0d8",
      accentColor: "#2d5016",
      backgroundImageUrl: section.generatedImage || undefined,
    });
  }

  blocks.push({
    type: "intro-text",
    id: uid(),
    text: section.trust_or_objection_line || section.subheadline,
    emphasis: section.CTA || undefined,
    alignment: "center",
  });

  return blocks;
}

function buildFoodCategoryBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  const blocks: ZipbanchanBlock[] = [];

  blocks.push({
    type: "section-header",
    id: uid(),
    icon: guessIcon(section.section_name),
    title: section.headline,
    subtitle: section.subheadline,
  });

  const items = extractFoodItemsFromBullets(section);

  if (items.length >= 3) {
    blocks.push({
      type: "food-grid",
      id: uid(),
      columns: items.length > 3 ? 2 : 2,
      shape: "rounded-square",
      items,
    });
  } else if (items.length > 0) {
    blocks.push({
      type: "food-list",
      id: uid(),
      showDescription: true,
      items,
    });
  }

  if (section.generatedImage) {
    blocks.push({
      type: "image-banner",
      id: uid(),
      imageUrl: section.generatedImage,
      alt: section.headline,
      aspectRatio: "16:9",
      borderRadius: true,
    });
  }

  return blocks;
}

function buildPersuasionBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  return [
    { type: "divider", id: uid(), style: "leaf", color: "#5b8c3e" },
    {
      type: "text-banner",
      id: uid(),
      headline: section.headline,
      body: section.subheadline,
      backgroundColor: "#faf6ee",
      textColor: "#3d3d3d",
      alignment: "center",
    },
  ];
}

function buildRankingBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  const items = extractFoodItemsFromBullets(section);
  return [
    {
      type: "ranking-section",
      id: uid(),
      title: section.headline,
      badge: "BEST",
      items,
    },
  ];
}

function buildStoryBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  const blocks: ZipbanchanBlock[] = [];

  blocks.push({
    type: "section-header",
    id: uid(),
    icon: "S",
    title: section.headline,
    subtitle: section.subheadline,
  });

  const steps = section.bullets.map((bullet, i) => ({
    imageUrl: i === 0 && section.generatedImage ? section.generatedImage : "",
    caption: bullet.replace(/^[-·•\d.]\s*/, "").split(/[,:]/)[0].trim(),
    description: bullet.length > 15 ? bullet : undefined,
  }));

  blocks.push({
    type: "story-section",
    id: uid(),
    title: section.headline,
    steps,
  });

  if (section.generatedImage) {
    blocks.push({
      type: "image-banner",
      id: uid(),
      imageUrl: section.generatedImage,
      alt: section.headline,
      aspectRatio: "4:3",
      borderRadius: true,
    });
  }

  return blocks;
}

function buildIngredientBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  return [
    {
      type: "ingredient-showcase",
      id: uid(),
      ingredientName: section.headline,
      imageUrl: section.generatedImage || "",
      description: section.subheadline,
      highlights: section.bullets.map((b) => b.replace(/^[-·•]\s*/, "").trim()),
    },
    { type: "flow-connector", id: uid(), direction: "down", color: "#5b8c3e" },
  ];
}

function buildChefBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  return [
    {
      type: "chef-profile",
      id: uid(),
      name: section.headline,
      title: section.subheadline,
      imageUrl: section.generatedImage || "",
      quote: section.trust_or_objection_line || undefined,
      credentials: section.bullets.map((b) => b.replace(/^[-·•]\s*/, "").trim()),
    },
  ];
}

function buildPromoBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  const blocks: ZipbanchanBlock[] = [];

  blocks.push({ type: "divider", id: uid(), style: "space" });

  const hasDiscount = /\d+%|할인|쿠폰/.test(`${section.headline} ${section.subheadline}`);

  if (hasDiscount) {
    const discountMatch = `${section.headline} ${section.subheadline}`.match(/~?\d+%/);
    blocks.push({
      type: "coupon-banner",
      id: uid(),
      discount: discountMatch?.[0] || "-50%",
      title: section.headline.replace(/~?\d+%\s*할인?/, "").trim() || section.headline,
      description: section.subheadline,
      backgroundColor: "#2c3e6b",
      accentColor: "#f5c542",
    });
  } else {
    blocks.push({
      type: "promo-banner",
      id: uid(),
      title: section.headline,
      subtitle: section.subheadline,
      ctaText: section.CTA || "주문하러 가기",
      backgroundColor: "#2c3e6b",
      accentColor: "#f5c542",
    });
  }

  blocks.push({
    type: "cta-button",
    id: uid(),
    text: section.CTA || "지금 주문하기",
    backgroundColor: "#5b8c3e",
    textColor: "#fff",
    size: "large",
    fullWidth: true,
  });

  return blocks;
}

function buildBenefitBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  return [
    {
      type: "icon-bullet-list",
      id: uid(),
      items: section.bullets.map((bullet, i) => ({
        icon: ["01", "02", "03", "04", "05", "06"][i % 6],
        text: bullet.replace(/^[-·•]\s*/, "").trim(),
      })),
    },
  ];
}

function buildReviewBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  const blocks: ZipbanchanBlock[] = [];

  blocks.push({
    type: "section-header",
    id: uid(),
    icon: "R",
    title: section.headline,
    subtitle: section.subheadline,
  });

  for (const bullet of section.bullets) {
    blocks.push({
      type: "testimonial-card",
      id: uid(),
      quote: bullet.replace(/^[-·•]\s*/, "").trim(),
      author: "고객님",
      rating: 5,
    });
  }

  return blocks;
}

function buildGenericBlocks(section: SectionBlueprint): ZipbanchanBlock[] {
  const blocks: ZipbanchanBlock[] = [];

  blocks.push({
    type: "section-header",
    id: uid(),
    icon: guessIcon(section.section_name),
    title: section.headline,
    subtitle: section.subheadline,
  });

  if (section.generatedImage) {
    blocks.push({
      type: "image-banner",
      id: uid(),
      imageUrl: section.generatedImage,
      alt: section.headline,
      aspectRatio: "16:9",
      borderRadius: true,
    });
  }

  if (section.bullets.length > 0) {
    blocks.push({
      type: "icon-bullet-list",
      id: uid(),
      items: section.bullets.map((b, i) => ({
        icon: ["01", "02", "03"][i % 3],
        text: b.replace(/^[-·•]\s*/, "").trim(),
      })),
    });
  }

  if (section.CTA) {
    blocks.push({
      type: "cta-button",
      id: uid(),
      text: section.CTA,
      backgroundColor: "#5b8c3e",
      textColor: "#fff",
      size: "medium",
      fullWidth: false,
    });
  }

  return blocks;
}

function guessIcon(sectionName: string): string {
  const name = sectionName.toLowerCase();
  if (/메인|요리|음식/.test(name)) return "M";
  if (/반주|술|안주/.test(name)) return "B";
  if (/밑반찬|반찬/.test(name)) return "S";
  if (/국|찌개|탕/.test(name)) return "G";
  if (/간식|디저트/.test(name)) return "D";
  if (/봄|여름|가을|겨울/.test(name)) return "T";
  if (/건강|영양/.test(name)) return "H";
  if (/추천|pick/.test(name)) return "P";
  if (/베네핏|장점/.test(name)) return "V";
  return "N";
}

export function mapBlueprintToBlocks(blueprint: LandingPageBlueprint): ZipbanchanBlock[] {
  const allBlocks: ZipbanchanBlock[] = [];

  blueprint.sections.forEach((section, index) => {
    const category = classifySection(section);

    switch (category) {
      case "hero":
        allBlocks.push(...buildHeroBlocks(section, index === 0));
        break;
      case "food-category":
        allBlocks.push(...buildFoodCategoryBlocks(section));
        break;
      case "persuasion":
        allBlocks.push(...buildPersuasionBlocks(section));
        break;
      case "ranking":
        allBlocks.push(...buildRankingBlocks(section));
        break;
      case "story":
        allBlocks.push(...buildStoryBlocks(section));
        break;
      case "ingredient":
        allBlocks.push(...buildIngredientBlocks(section));
        break;
      case "chef":
        allBlocks.push(...buildChefBlocks(section));
        break;
      case "promo":
        allBlocks.push(...buildPromoBlocks(section));
        break;
      case "benefit":
        allBlocks.push(...buildBenefitBlocks(section));
        break;
      case "review":
        allBlocks.push(...buildReviewBlocks(section));
        break;
      default:
        allBlocks.push(...buildGenericBlocks(section));
    }

    if (index < blueprint.sections.length - 1 && category !== "hero" && category !== "promo") {
      const nextCategory = classifySection(blueprint.sections[index + 1]);
      if (nextCategory === "food-category" && category === "food-category") {
        allBlocks.push({ type: "divider", id: uid(), style: "dot", color: "#ccc" });
      }
    }
  });

  allBlocks.push({
    type: "delivery-info",
    id: uid(),
    items: [
      { icon: "D", label: "배송", value: "냉장 직배송" },
      { icon: "P", label: "포장", value: "친환경 용기" },
      { icon: "T", label: "출고", value: "당일 출고" },
    ],
  });

  allBlocks.push({
    type: "brand-footer",
    id: uid(),
    brandName: "집반찬연구소",
    tagline: "매일 먹는 반찬, 정성을 다합니다",
    backgroundColor: "#5b8c3e",
    textColor: "#fff",
  });

  return allBlocks;
}
