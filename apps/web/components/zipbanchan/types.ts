export type ZipbanchanComponentType =
  | "hero-banner"
  | "dark-hero-banner"
  | "section-header"
  | "food-card"
  | "food-grid"
  | "food-list"
  | "food-feature"
  | "food-horizontal-card"
  | "text-banner"
  | "intro-text"
  | "highlight-text"
  | "promo-banner"
  | "coupon-banner"
  | "ranking-section"
  | "md-pick-section"
  | "story-section"
  | "ingredient-showcase"
  | "chef-profile"
  | "nutrition-badge"
  | "icon-bullet-list"
  | "category-tag"
  | "image-banner"
  | "divider"
  | "cta-button"
  | "flow-connector"
  | "countdown-badge"
  | "brand-footer"
  | "delivery-info"
  | "testimonial-card";

export interface FoodItem {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  price?: string;
  badge?: string;
  calories?: string;
}

/* ── 기존 11개 ── */

export interface HeroBannerData {
  type: "hero-banner";
  id: string;
  title: string;
  subtitle: string;
  backgroundImageUrl?: string;
  backgroundColor: string;
  accentColor: string;
  illustrationUrl?: string;
}

export interface SectionHeaderData {
  type: "section-header";
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  backgroundColor?: string;
}

export interface FoodCardData {
  type: "food-card";
  id: string;
  item: FoodItem;
  shape: "circle" | "rounded-square";
}

export interface FoodGridData {
  type: "food-grid";
  id: string;
  title?: string;
  items: FoodItem[];
  columns: 2 | 3;
  shape: "circle" | "rounded-square";
}

export interface FoodListData {
  type: "food-list";
  id: string;
  title?: string;
  items: FoodItem[];
  showDescription: boolean;
}

export interface TextBannerData {
  type: "text-banner";
  id: string;
  headline: string;
  body: string;
  backgroundColor: string;
  textColor: string;
  alignment: "left" | "center";
}

export interface PromoBannerData {
  type: "promo-banner";
  id: string;
  title: string;
  subtitle: string;
  discount?: string;
  ctaText: string;
  ctaUrl?: string;
  backgroundColor: string;
  accentColor: string;
}

export interface RankingSectionData {
  type: "ranking-section";
  id: string;
  title: string;
  badge?: string;
  items: FoodItem[];
}

export interface StorySectionData {
  type: "story-section";
  id: string;
  title: string;
  steps: {
    imageUrl: string;
    caption: string;
    description?: string;
  }[];
}

export interface ChefProfileData {
  type: "chef-profile";
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  quote?: string;
  credentials?: string[];
}

export interface NutritionBadgeData {
  type: "nutrition-badge";
  id: string;
  calories?: string;
  highlights: { label: string; value: string }[];
  backgroundColor?: string;
}

/* ── 신규 17개 ── */

export interface DarkHeroBannerData {
  type: "dark-hero-banner";
  id: string;
  title: string;
  subtitle: string;
  backgroundImageUrl?: string;
  backgroundColor: string;
  accentColor: string;
  illustrationUrl?: string;
  theme?: string;
}

export interface FoodFeatureData {
  type: "food-feature";
  id: string;
  item: FoodItem;
  layout: "centered" | "full-width";
  backgroundColor?: string;
}

export interface FoodHorizontalCardData {
  type: "food-horizontal-card";
  id: string;
  item: FoodItem;
  imagePosition: "left" | "right";
  backgroundColor?: string;
}

export interface IntroTextData {
  type: "intro-text";
  id: string;
  text: string;
  emphasis?: string;
  alignment: "left" | "center";
  backgroundColor?: string;
}

export interface HighlightTextData {
  type: "highlight-text";
  id: string;
  beforeText: string;
  highlightedText: string;
  afterText: string;
  highlightColor: string;
  backgroundColor?: string;
}

export interface CouponBannerData {
  type: "coupon-banner";
  id: string;
  title: string;
  discount: string;
  description?: string;
  backgroundColor: string;
  accentColor: string;
}

export interface MdPickSectionData {
  type: "md-pick-section";
  id: string;
  title: string;
  subtitle?: string;
  items: FoodItem[];
  badgeText?: string;
}

export interface IngredientShowcaseData {
  type: "ingredient-showcase";
  id: string;
  ingredientName: string;
  imageUrl: string;
  description: string;
  origin?: string;
  highlights?: string[];
}

export interface ImageBannerData {
  type: "image-banner";
  id: string;
  imageUrl: string;
  alt: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
  borderRadius?: boolean;
}

export interface DividerData {
  type: "divider";
  id: string;
  style: "line" | "dot" | "space" | "leaf";
  color?: string;
}

export interface CtaButtonData {
  type: "cta-button";
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  size: "small" | "medium" | "large";
  fullWidth: boolean;
}

export interface FlowConnectorData {
  type: "flow-connector";
  id: string;
  direction: "down" | "right";
  label?: string;
  color?: string;
}

export interface CountdownBadgeData {
  type: "countdown-badge";
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
}

export interface IconBulletListData {
  type: "icon-bullet-list";
  id: string;
  items: { icon: string; text: string; subtext?: string }[];
  backgroundColor?: string;
}

export interface CategoryTagData {
  type: "category-tag";
  id: string;
  tags: { label: string; color?: string; backgroundColor?: string }[];
}

export interface BrandFooterData {
  type: "brand-footer";
  id: string;
  brandName: string;
  tagline?: string;
  logoUrl?: string;
  backgroundColor: string;
  textColor: string;
}

export interface DeliveryInfoData {
  type: "delivery-info";
  id: string;
  items: { icon: string; label: string; value: string }[];
  backgroundColor?: string;
}

export interface TestimonialCardData {
  type: "testimonial-card";
  id: string;
  quote: string;
  author: string;
  rating?: number;
  backgroundColor?: string;
}

export type ZipbanchanBlock =
  | HeroBannerData
  | DarkHeroBannerData
  | SectionHeaderData
  | FoodCardData
  | FoodGridData
  | FoodListData
  | FoodFeatureData
  | FoodHorizontalCardData
  | TextBannerData
  | IntroTextData
  | HighlightTextData
  | PromoBannerData
  | CouponBannerData
  | RankingSectionData
  | MdPickSectionData
  | StorySectionData
  | IngredientShowcaseData
  | ChefProfileData
  | NutritionBadgeData
  | IconBulletListData
  | CategoryTagData
  | ImageBannerData
  | DividerData
  | CtaButtonData
  | FlowConnectorData
  | CountdownBadgeData
  | BrandFooterData
  | DeliveryInfoData
  | TestimonialCardData;

export interface ZipbanchanPage {
  id: string;
  title: string;
  blocks: ZipbanchanBlock[];
  createdAt: string;
  updatedAt: string;
}
