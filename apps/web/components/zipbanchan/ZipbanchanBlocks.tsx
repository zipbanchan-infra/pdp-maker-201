"use client";

import type {
  BrandFooterData,
  CategoryTagData,
  ChefProfileData,
  CouponBannerData,
  CountdownBadgeData,
  CtaButtonData,
  DarkHeroBannerData,
  DeliveryInfoData,
  DividerData,
  FlowConnectorData,
  FoodCardData,
  FoodFeatureData,
  FoodGridData,
  FoodHorizontalCardData,
  FoodItem,
  FoodListData,
  HeroBannerData,
  HighlightTextData,
  IconBulletListData,
  ImageBannerData,
  IngredientShowcaseData,
  IntroTextData,
  MdPickSectionData,
  NutritionBadgeData,
  PromoBannerData,
  RankingSectionData,
  SectionHeaderData,
  StorySectionData,
  TestimonialCardData,
  TextBannerData,
  ZipbanchanBlock
} from "./types";
import styles from "./zipbanchan.module.css";

/* ── 기존 11개 ── */

export function HeroBanner({ data }: { data: HeroBannerData }) {
  const hasImage = Boolean(data.backgroundImageUrl);
  return (
    <div className={styles.heroBanner} style={{ backgroundColor: data.backgroundColor, color: data.accentColor }}>
      {hasImage ? <img alt="" className={styles.heroBannerBg} src={data.backgroundImageUrl} /> : null}
      {hasImage ? <div className={styles.heroBannerOverlay} /> : null}
      <div className={styles.heroBannerContent}>
        <h2 className={styles.heroBannerTitle}>{data.title}</h2>
        <p className={styles.heroBannerSubtitle}>{data.subtitle}</p>
        {data.illustrationUrl ? <img alt="" className={styles.heroBannerIllustration} src={data.illustrationUrl} /> : null}
      </div>
    </div>
  );
}

export function SectionHeader({ data }: { data: SectionHeaderData }) {
  return (
    <div className={styles.sectionHeader} style={{ backgroundColor: data.backgroundColor }}>
      <div className={styles.sectionHeaderIcon}>{data.icon}</div>
      <div className={styles.sectionHeaderCopy}>
        <h3 className={styles.sectionHeaderTitle}>{data.title}</h3>
        {data.subtitle ? <p className={styles.sectionHeaderSubtitle}>{data.subtitle}</p> : null}
      </div>
    </div>
  );
}

function FoodCardInner({ item, shape }: { item: FoodItem; shape: "circle" | "rounded-square" }) {
  return (
    <div className={styles.foodCard}>
      <div className={shape === "circle" ? styles.foodCardImageCircle : styles.foodCardImageSquare}>
        {item.imageUrl ? <img alt={item.name} className={styles.foodCardImage} src={item.imageUrl} /> : null}
      </div>
      {item.badge ? <span className={styles.foodCardBadge}>{item.badge}</span> : null}
      <p className={styles.foodCardName}>{item.name}</p>
      {item.description ? <p className={styles.foodCardDescription}>{item.description}</p> : null}
      {item.price ? <p className={styles.foodCardPrice}>{item.price}</p> : null}
    </div>
  );
}

export function FoodCard({ data }: { data: FoodCardData }) {
  return <FoodCardInner item={data.item} shape={data.shape} />;
}

export function FoodGrid({ data }: { data: FoodGridData }) {
  return (
    <div className={styles.foodGrid}>
      {data.title ? <h3 className={styles.foodGridTitle}>{data.title}</h3> : null}
      <div className={`${styles.foodGridInner} ${data.columns === 3 ? styles.foodGridCols3 : styles.foodGridCols2}`}>
        {data.items.map((item) => (
          <FoodCardInner item={item} key={item.id} shape={data.shape} />
        ))}
      </div>
    </div>
  );
}

export function FoodList({ data }: { data: FoodListData }) {
  return (
    <div className={styles.foodList}>
      {data.title ? <h3 className={styles.foodListTitle}>{data.title}</h3> : null}
      {data.items.map((item) => (
        <div className={styles.foodListItem} key={item.id}>
          <div className={styles.foodListItemImage}>
            {item.imageUrl ? <img alt={item.name} src={item.imageUrl} /> : null}
          </div>
          <div className={styles.foodListItemCopy}>
            <p className={styles.foodListItemName}>{item.name}</p>
            {data.showDescription && item.description ? (
              <p className={styles.foodListItemDescription}>{item.description}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TextBanner({ data }: { data: TextBannerData }) {
  return (
    <div className={styles.textBanner} style={{ backgroundColor: data.backgroundColor, color: data.textColor, textAlign: data.alignment }}>
      <h3 className={styles.textBannerHeadline}>{data.headline}</h3>
      <p className={styles.textBannerBody}>{data.body}</p>
    </div>
  );
}

export function PromoBanner({ data }: { data: PromoBannerData }) {
  return (
    <div className={styles.promoBanner} style={{ backgroundColor: data.backgroundColor, color: data.accentColor }}>
      {data.discount ? (
        <span className={styles.promoBannerDiscount} style={{ backgroundColor: data.accentColor, color: data.backgroundColor }}>
          {data.discount}
        </span>
      ) : null}
      <h3 className={styles.promoBannerTitle}>{data.title}</h3>
      <p className={styles.promoBannerSubtitle}>{data.subtitle}</p>
      <button className={styles.promoBannerCta} style={{ backgroundColor: data.accentColor }} type="button">
        {data.ctaText}
      </button>
    </div>
  );
}

export function RankingSection({ data }: { data: RankingSectionData }) {
  return (
    <div className={styles.rankingSection}>
      <div className={styles.rankingHeader}>
        <h3 className={styles.rankingTitle}>{data.title}</h3>
        {data.badge ? <span className={styles.rankingBadge}>{data.badge}</span> : null}
      </div>
      {data.items.map((item, index) => (
        <div className={styles.rankingItem} key={item.id}>
          <span className={styles.rankingNumber}>{index + 1}</span>
          <div className={styles.rankingItemImage}>
            {item.imageUrl ? <img alt={item.name} src={item.imageUrl} /> : null}
          </div>
          <div className={styles.rankingItemCopy}>
            <p className={styles.rankingItemName}>{item.name}</p>
            {item.description ? <p className={styles.rankingItemDescription}>{item.description}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StorySection({ data }: { data: StorySectionData }) {
  return (
    <div className={styles.storySection}>
      <h3 className={styles.storySectionTitle}>{data.title}</h3>
      {data.steps.map((step, index) => (
        <div key={index}>
          {index > 0 ? <div className={styles.storyDivider}>|</div> : null}
          <div className={styles.storyStep}>
            <div className={styles.storyStepImage}>
              {step.imageUrl ? <img alt={step.caption} src={step.imageUrl} /> : null}
            </div>
            <p className={styles.storyStepCaption}>{step.caption}</p>
            {step.description ? <p className={styles.storyStepDescription}>{step.description}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChefProfile({ data }: { data: ChefProfileData }) {
  return (
    <div className={styles.chefProfile}>
      <div className={styles.chefProfileImage}>
        {data.imageUrl ? <img alt={data.name} src={data.imageUrl} /> : null}
      </div>
      <div className={styles.chefProfileCopy}>
        <p className={styles.chefProfileName}>{data.name}</p>
        <p className={styles.chefProfileTitle}>{data.title}</p>
        {data.quote ? <p className={styles.chefProfileQuote}>"{data.quote}"</p> : null}
        {data.credentials?.length ? (
          <ul className={styles.chefProfileCredentials}>
            {data.credentials.map((cred, i) => (
              <li className={styles.chefProfileCredential} key={i}>{cred}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export function NutritionBadge({ data }: { data: NutritionBadgeData }) {
  return (
    <div className={styles.nutritionBadge} style={{ backgroundColor: data.backgroundColor }}>
      {data.calories ? (
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionLabel}>칼로리</span>
          <span className={styles.nutritionValue}>{data.calories}</span>
        </div>
      ) : null}
      {data.highlights.map((item, i) => (
        <div className={styles.nutritionItem} key={i}>
          <span className={styles.nutritionLabel}>{item.label}</span>
          <span className={styles.nutritionValue}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── 신규 17개 ── */

export function DarkHeroBanner({ data }: { data: DarkHeroBannerData }) {
  return (
    <div className={styles.darkHeroBanner} style={{ backgroundColor: data.backgroundColor, color: data.accentColor }}>
      {data.backgroundImageUrl ? <img alt="" className={styles.heroBannerBg} src={data.backgroundImageUrl} /> : null}
      <div className={styles.darkHeroBannerContent}>
        {data.theme ? <span className={styles.darkHeroBannerTheme}>{data.theme}</span> : null}
        <h2 className={styles.darkHeroBannerTitle}>{data.title}</h2>
        <p className={styles.darkHeroBannerSubtitle}>{data.subtitle}</p>
        {data.illustrationUrl ? <img alt="" className={styles.heroBannerIllustration} src={data.illustrationUrl} /> : null}
      </div>
    </div>
  );
}

export function FoodFeature({ data }: { data: FoodFeatureData }) {
  return (
    <div className={styles.foodFeature} style={{ backgroundColor: data.backgroundColor }}>
      <div className={data.layout === "centered" ? styles.foodFeatureImageCentered : styles.foodFeatureImageFull}>
        {data.item.imageUrl ? <img alt={data.item.name} src={data.item.imageUrl} /> : null}
      </div>
      <p className={styles.foodFeatureName}>{data.item.name}</p>
      {data.item.description ? <p className={styles.foodFeatureDescription}>{data.item.description}</p> : null}
      {data.item.calories ? <span className={styles.foodFeatureCalories}>{data.item.calories}</span> : null}
    </div>
  );
}

export function FoodHorizontalCard({ data }: { data: FoodHorizontalCardData }) {
  return (
    <div
      className={`${styles.foodHorizontalCard} ${data.imagePosition === "right" ? styles.foodHorizontalCardReverse : ""}`}
      style={{ backgroundColor: data.backgroundColor }}
    >
      <div className={styles.foodHorizontalCardImage}>
        {data.item.imageUrl ? <img alt={data.item.name} src={data.item.imageUrl} /> : null}
      </div>
      <div className={styles.foodHorizontalCardCopy}>
        <p className={styles.foodHorizontalCardName}>{data.item.name}</p>
        {data.item.description ? <p className={styles.foodHorizontalCardDescription}>{data.item.description}</p> : null}
        {data.item.badge ? <span className={styles.foodHorizontalCardBadge}>{data.item.badge}</span> : null}
      </div>
    </div>
  );
}

export function IntroText({ data }: { data: IntroTextData }) {
  return (
    <div className={styles.introText} style={{ backgroundColor: data.backgroundColor, textAlign: data.alignment }}>
      <p className={styles.introTextBody}>{data.text}</p>
      {data.emphasis ? <span className={styles.introTextEmphasis}>{data.emphasis}</span> : null}
    </div>
  );
}

export function HighlightText({ data }: { data: HighlightTextData }) {
  return (
    <div className={styles.highlightText} style={{ backgroundColor: data.backgroundColor }}>
      {data.beforeText}
      <span className={styles.highlightTextMark} style={{ backgroundColor: data.highlightColor }}>
        {data.highlightedText}
      </span>
      {data.afterText}
    </div>
  );
}

export function CouponBanner({ data }: { data: CouponBannerData }) {
  return (
    <div className={styles.couponBanner} style={{ backgroundColor: data.backgroundColor, color: data.accentColor }}>
      <p className={styles.couponBannerDiscount}>{data.discount}</p>
      <h3 className={styles.couponBannerTitle}>{data.title}</h3>
      {data.description ? <p className={styles.couponBannerDescription}>{data.description}</p> : null}
    </div>
  );
}

export function MdPickSection({ data }: { data: MdPickSectionData }) {
  return (
    <div className={styles.mdPickSection}>
      <div className={styles.mdPickHeader}>
        <div>
          {data.badgeText ? <span className={styles.mdPickBadge}>{data.badgeText}</span> : null}
          <h3 className={styles.mdPickTitle}>{data.title}</h3>
          {data.subtitle ? <p className={styles.mdPickSubtitle}>{data.subtitle}</p> : null}
        </div>
      </div>
      <div className={styles.mdPickGrid}>
        {data.items.map((item) => (
          <FoodCardInner item={item} key={item.id} shape="rounded-square" />
        ))}
      </div>
    </div>
  );
}

export function IngredientShowcase({ data }: { data: IngredientShowcaseData }) {
  return (
    <div className={styles.ingredientShowcase}>
      <div className={styles.ingredientShowcaseImage}>
        {data.imageUrl ? <img alt={data.ingredientName} src={data.imageUrl} /> : null}
      </div>
      <h3 className={styles.ingredientShowcaseName}>{data.ingredientName}</h3>
      {data.origin ? <span className={styles.ingredientShowcaseOrigin}>{data.origin}</span> : null}
      <p className={styles.ingredientShowcaseDescription}>{data.description}</p>
      {data.highlights?.length ? (
        <ul className={styles.ingredientShowcaseHighlights}>
          {data.highlights.map((h, i) => (
            <li className={styles.ingredientShowcaseHighlightItem} key={i}>{h}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ImageBanner({ data }: { data: ImageBannerData }) {
  const aspectMap = { "16:9": "16/9", "4:3": "4/3", "1:1": "1/1", auto: "auto" };
  return (
    <div className={`${styles.imageBanner} ${data.borderRadius ? styles.imageBannerRounded : ""}`}>
      {data.imageUrl ? (
        <img
          alt={data.alt}
          src={data.imageUrl}
          style={{ aspectRatio: data.aspectRatio ? aspectMap[data.aspectRatio] : undefined }}
        />
      ) : null}
    </div>
  );
}

export function Divider({ data }: { data: DividerData }) {
  if (data.style === "dot") {
    return (
      <div className={styles.dividerDot} style={{ color: data.color }}>
        <span>&#9679;</span><span>&#9679;</span><span>&#9679;</span>
      </div>
    );
  }
  if (data.style === "space") {
    return <div className={styles.dividerSpace} />;
  }
  if (data.style === "leaf") {
    return <div className={styles.dividerLeaf} style={{ color: data.color }}>&#127807;</div>;
  }
  return <div className={styles.dividerLine} style={{ color: data.color }} />;
}

export function CtaButton({ data }: { data: CtaButtonData }) {
  const sizeClass = data.size === "small" ? styles.ctaButtonSmall
    : data.size === "large" ? styles.ctaButtonLarge
    : styles.ctaButtonMedium;

  return (
    <div className={styles.ctaButtonWrap}>
      <button
        className={`${styles.ctaButton} ${sizeClass} ${data.fullWidth ? styles.ctaButtonFull : ""}`}
        style={{ backgroundColor: data.backgroundColor, color: data.textColor }}
        type="button"
      >
        {data.text}
      </button>
    </div>
  );
}

export function FlowConnector({ data }: { data: FlowConnectorData }) {
  return (
    <div className={styles.flowConnector} style={{ color: data.color }}>
      <span className={styles.flowConnectorArrow}>{data.direction === "right" ? "→" : "↓"}</span>
      {data.label ? <span className={styles.flowConnectorLabel}>{data.label}</span> : null}
    </div>
  );
}

export function CountdownBadge({ data }: { data: CountdownBadgeData }) {
  return (
    <div className={styles.countdownBadge}>
      <span className={styles.countdownBadgeInner} style={{ backgroundColor: data.backgroundColor, color: data.textColor }}>
        <span className={styles.countdownBadgePulse} />
        {data.text}
      </span>
    </div>
  );
}

export function IconBulletList({ data }: { data: IconBulletListData }) {
  return (
    <div className={styles.iconBulletList} style={{ backgroundColor: data.backgroundColor }}>
      {data.items.map((item, i) => (
        <div className={styles.iconBulletItem} key={i}>
          <span className={styles.iconBulletIcon}>{item.icon}</span>
          <div>
            <p className={styles.iconBulletText}>{item.text}</p>
            {item.subtext ? <p className={styles.iconBulletSubtext}>{item.subtext}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryTagGroup({ data }: { data: CategoryTagData }) {
  return (
    <div className={styles.categoryTagWrap}>
      {data.tags.map((tag, i) => (
        <span
          className={styles.categoryTag}
          key={i}
          style={{ backgroundColor: tag.backgroundColor ?? "#f0ede6", color: tag.color ?? "#5b8c3e" }}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}

export function BrandFooter({ data }: { data: BrandFooterData }) {
  return (
    <div className={styles.brandFooter} style={{ backgroundColor: data.backgroundColor, color: data.textColor }}>
      {data.logoUrl ? (
        <div className={styles.brandFooterLogo}><img alt={data.brandName} src={data.logoUrl} /></div>
      ) : null}
      <p className={styles.brandFooterName}>{data.brandName}</p>
      {data.tagline ? <p className={styles.brandFooterTagline}>{data.tagline}</p> : null}
    </div>
  );
}

export function DeliveryInfo({ data }: { data: DeliveryInfoData }) {
  return (
    <div className={styles.deliveryInfo} style={{ backgroundColor: data.backgroundColor }}>
      {data.items.map((item, i) => (
        <div className={styles.deliveryInfoItem} key={i}>
          <span className={styles.deliveryInfoIcon}>{item.icon}</span>
          <span className={styles.deliveryInfoLabel}>{item.label}</span>
          <span className={styles.deliveryInfoValue}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function TestimonialCard({ data }: { data: TestimonialCardData }) {
  return (
    <div className={styles.testimonialCard} style={{ backgroundColor: data.backgroundColor }}>
      <p className={styles.testimonialQuote}>{data.quote}</p>
      <div className={styles.testimonialMeta}>
        <span className={styles.testimonialAuthor}>{data.author}</span>
        {data.rating ? (
          <span className={styles.testimonialStars}>{"★".repeat(data.rating)}{"☆".repeat(5 - data.rating)}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ── Block Renderer ── */

export function BlockRenderer({ block }: { block: ZipbanchanBlock }) {
  switch (block.type) {
    case "hero-banner": return <HeroBanner data={block} />;
    case "dark-hero-banner": return <DarkHeroBanner data={block} />;
    case "section-header": return <SectionHeader data={block} />;
    case "food-card": return <FoodCard data={block} />;
    case "food-grid": return <FoodGrid data={block} />;
    case "food-list": return <FoodList data={block} />;
    case "food-feature": return <FoodFeature data={block} />;
    case "food-horizontal-card": return <FoodHorizontalCard data={block} />;
    case "text-banner": return <TextBanner data={block} />;
    case "intro-text": return <IntroText data={block} />;
    case "highlight-text": return <HighlightText data={block} />;
    case "promo-banner": return <PromoBanner data={block} />;
    case "coupon-banner": return <CouponBanner data={block} />;
    case "ranking-section": return <RankingSection data={block} />;
    case "md-pick-section": return <MdPickSection data={block} />;
    case "story-section": return <StorySection data={block} />;
    case "ingredient-showcase": return <IngredientShowcase data={block} />;
    case "chef-profile": return <ChefProfile data={block} />;
    case "nutrition-badge": return <NutritionBadge data={block} />;
    case "icon-bullet-list": return <IconBulletList data={block} />;
    case "category-tag": return <CategoryTagGroup data={block} />;
    case "image-banner": return <ImageBanner data={block} />;
    case "divider": return <Divider data={block} />;
    case "cta-button": return <CtaButton data={block} />;
    case "flow-connector": return <FlowConnector data={block} />;
    case "countdown-badge": return <CountdownBadge data={block} />;
    case "brand-footer": return <BrandFooter data={block} />;
    case "delivery-info": return <DeliveryInfo data={block} />;
    case "testimonial-card": return <TestimonialCard data={block} />;
    default: return null;
  }
}
