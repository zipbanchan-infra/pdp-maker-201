"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowLeft, Copy, Layers, Plus, Trash2 } from "lucide-react";
import type { GeneratedResult } from "../../lib/shared/pdp";
import type { ZipbanchanBlock, ZipbanchanComponentType } from "./types";
import { PALETTE_ITEMS, createDefaultBlock } from "./block-defaults";
import { LAYOUT_THUMBS } from "./layout-thumbs";
import { BlockRenderer } from "./ZipbanchanBlocks";
import { BlockEditor } from "./BlockEditor";
import { mapBlueprintToBlocks } from "./block-mapper";
import styles from "./zipbanchan.module.css";

interface ZipbanchanViewerProps {
  result: GeneratedResult;
  onReset: () => void;
}

export function ZipbanchanViewer({ result, onReset }: ZipbanchanViewerProps) {
  const [blocks, setBlocks] = useState<ZipbanchanBlock[]>(() =>
    mapBlueprintToBlocks(result.blueprint)
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: ZipbanchanComponentType) => {
    const block = createDefaultBlock(type);
    setBlocks((prev) => [...prev, block]);
    setSelectedBlockId(block.id);
    requestAnimationFrame(() => {
      const el = document.getElementById(`block-${block.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedBlockId((current) => (current === id ? null : current));
  }, []);

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index < 0) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index < 0) return prev;
      const copy = { ...prev[index], id: `zb-${Date.now()}-dup` };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<ZipbanchanBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } as ZipbanchanBlock : b))
    );
  }, []);

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedBlockId) ?? null,
    [blocks, selectedBlockId]
  );

  const groupedPalette = useMemo(() => ({
    layout: PALETTE_ITEMS.filter((p) => p.group === "layout"),
    content: PALETTE_ITEMS.filter((p) => p.group === "content"),
    story: PALETTE_ITEMS.filter((p) => p.group === "story"),
    info: PALETTE_ITEMS.filter((p) => p.group === "info"),
    promo: PALETTE_ITEMS.filter((p) => p.group === "promo"),
  }), []);

  const BLOCK_LABELS: Record<string, string> = {
    "hero-banner": "히어로 배너",
    "dark-hero-banner": "다크 히어로",
    "section-header": "섹션 구분",
    "food-card": "음식 카드",
    "food-grid": "음식 그리드",
    "food-list": "음식 리스트",
    "food-feature": "음식 피처",
    "food-horizontal-card": "가로 카드",
    "text-banner": "텍스트 배너",
    "intro-text": "도입 문구",
    "highlight-text": "강조 텍스트",
    "promo-banner": "프로모션",
    "coupon-banner": "쿠폰 배너",
    "ranking-section": "랭킹",
    "md-pick-section": "MD 추천",
    "story-section": "스토리",
    "ingredient-showcase": "재료 소개",
    "chef-profile": "셰프 프로필",
    "nutrition-badge": "영양 정보",
    "icon-bullet-list": "아이콘 리스트",
    "category-tag": "카테고리",
    "image-banner": "이미지 배너",
    "divider": "구분선",
    "cta-button": "CTA 버튼",
    "flow-connector": "플로우",
    "countdown-badge": "긴급 배지",
    "brand-footer": "브랜드 푸터",
    "delivery-info": "배송 정보",
    "testimonial-card": "후기",
  };

  return (
    <div className={styles.viewerLayout}>
      {/* 왼쪽: 컴포넌트 팔레트 */}
      <aside className={styles.viewerPalette}>
        <button className={styles.viewerBackButton} onClick={onReset} type="button">
          <ArrowLeft size={14} /> 돌아가기
        </button>

        <h3 className={styles.builderPaletteTitle}>컴포넌트</h3>

        {(["layout", "content", "story", "info", "promo"] as const).map((groupKey) => {
          const groupLabel = { layout: "레이아웃", content: "콘텐츠", story: "스토리", info: "정보", promo: "프로모션" }[groupKey];
          const items = groupedPalette[groupKey];
          return (
            <div className={styles.paletteGroup} key={groupKey}>
              <p className={styles.paletteGroupLabel}>{groupLabel}</p>
              {items.map((item) => (
                <button
                  className={styles.paletteItemCompact}
                  key={item.type}
                  onClick={() => addBlock(item.type)}
                  title={item.hint}
                  type="button"
                >
                  <span className={styles.paletteItemThumb} dangerouslySetInnerHTML={{ __html: LAYOUT_THUMBS[item.type] || "" }} />
                  {item.label}
                </button>
              ))}
            </div>
          );
        })}
      </aside>

      {/* 가운데: 미리보기 */}
      <div className={styles.viewerCenter}>
        <div className={styles.viewerCenterHeader}>
          <h3 className={styles.builderCanvasTitle}>
            <Layers size={16} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
            미리보기 ({blocks.length})
          </h3>
        </div>

        <div className={styles.landingPreview}>
          {blocks.map((block) => (
            <div
              className={`${styles.blockWrapper} ${selectedBlockId === block.id ? styles.blockWrapperSelected : ""}`}
              id={`block-${block.id}`}
              key={block.id}
              onClick={() => setSelectedBlockId(block.id)}
            >
              <div className={styles.blockToolbar}>
                <button className={styles.blockToolbarButton} onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }} title="위로" type="button">
                  <ArrowUp size={12} />
                </button>
                <button className={styles.blockToolbarButton} onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }} title="아래로" type="button">
                  <ArrowDown size={12} />
                </button>
                <button className={styles.blockToolbarButton} onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }} title="복제" type="button">
                  <Copy size={12} />
                </button>
                <button className={`${styles.blockToolbarButton} ${styles.blockToolbarButtonDanger}`} onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} title="삭제" type="button">
                  <Trash2 size={12} />
                </button>
              </div>
              <BlockRenderer block={block} />
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 컨텐츠 편집 패널 */}
      <aside className={styles.viewerInspector}>
        {selectedBlock ? (
          <>
            <div className={styles.inspectorHeader}>
              <span className={styles.inspectorLabel}>컨텐츠 편집 - {BLOCK_LABELS[selectedBlock.type] ?? selectedBlock.type}</span>
              <button
                className={styles.inspectorCloseButton}
                onClick={() => setSelectedBlockId(null)}
                type="button"
              >
                닫기
              </button>
            </div>
            <BlockEditor
              block={selectedBlock}
              onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
            />
          </>
        ) : (
          <div className={styles.inspectorEmpty}>
            <p>블록을 클릭하면<br />여기서 편집할 수 있습니다</p>
          </div>
        )}
      </aside>
    </div>
  );
}
