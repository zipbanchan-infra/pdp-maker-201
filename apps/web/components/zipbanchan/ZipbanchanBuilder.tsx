"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Copy, Download, Layers, Plus, Trash2 } from "lucide-react";
import type { ZipbanchanBlock, ZipbanchanComponentType } from "./types";
import { PALETTE_ITEMS, createDefaultBlock } from "./block-defaults";
import { BlockRenderer } from "./ZipbanchanBlocks";
import { BlockEditor } from "./BlockEditor";
import styles from "./zipbanchan.module.css";

export function ZipbanchanBuilder() {
  const [blocks, setBlocks] = useState<ZipbanchanBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const addBlock = useCallback((type: ZipbanchanComponentType) => {
    const block = createDefaultBlock(type);
    setBlocks((prev) => [...prev, block]);
    setSelectedBlockId(block.id);
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

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  const groupedPalette = {
    layout: PALETTE_ITEMS.filter((p) => p.group === "layout"),
    content: PALETTE_ITEMS.filter((p) => p.group === "content"),
    promo: PALETTE_ITEMS.filter((p) => p.group === "promo"),
  };

  return (
    <div className={styles.builderLayout}>
      <aside className={styles.builderPalette}>
        <h3 className={styles.builderPaletteTitle}>컴포넌트 팔레트</h3>
        <p className={styles.builderPaletteDescription}>
          클릭하면 미리보기 하단에 추가됩니다. 추가 후 내용을 수정할 수 있습니다.
        </p>

        <div className={styles.paletteGroup}>
          <p className={styles.paletteGroupLabel}>레이아웃</p>
          {groupedPalette.layout.map((item) => (
            <button
              className={styles.paletteItem}
              key={item.type}
              onClick={() => addBlock(item.type)}
              type="button"
            >
              <span className={styles.paletteItemIcon}>{item.icon}</span>
              <span className={styles.paletteItemCopy}>
                <span className={styles.paletteItemName}>{item.label}</span>
                <span className={styles.paletteItemHint}>{item.hint}</span>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.paletteGroup}>
          <p className={styles.paletteGroupLabel}>콘텐츠</p>
          {groupedPalette.content.map((item) => (
            <button
              className={styles.paletteItem}
              key={item.type}
              onClick={() => addBlock(item.type)}
              type="button"
            >
              <span className={styles.paletteItemIcon}>{item.icon}</span>
              <span className={styles.paletteItemCopy}>
                <span className={styles.paletteItemName}>{item.label}</span>
                <span className={styles.paletteItemHint}>{item.hint}</span>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.paletteGroup}>
          <p className={styles.paletteGroupLabel}>프로모션</p>
          {groupedPalette.promo.map((item) => (
            <button
              className={styles.paletteItem}
              key={item.type}
              onClick={() => addBlock(item.type)}
              type="button"
            >
              <span className={styles.paletteItemIcon}>{item.icon}</span>
              <span className={styles.paletteItemCopy}>
                <span className={styles.paletteItemName}>{item.label}</span>
                <span className={styles.paletteItemHint}>{item.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className={styles.builderCanvas}>
        <div className={styles.builderCanvasHeader}>
          <h3 className={styles.builderCanvasTitle}>
            <Layers size={16} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
            미리보기 ({blocks.length}개 블록)
          </h3>
        </div>

        {blocks.length === 0 ? (
          <div className={styles.builderEmptyState}>
            <Plus size={32} />
            <strong>왼쪽 팔레트에서 컴포넌트를 추가하세요</strong>
            <p>
              히어로 배너, 음식 그리드, 텍스트 배너 등을 조합하여<br />
              집반찬연구소 스타일의 상세페이지를 만들 수 있습니다.
            </p>
          </div>
        ) : (
          <div className={styles.landingPreview} ref={previewRef}>
            {blocks.map((block) => (
              <div
                className={`${styles.blockWrapper} ${selectedBlockId === block.id ? styles.blockWrapperSelected : ""}`}
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
              >
                <div className={styles.blockToolbar}>
                  <button
                    className={styles.blockToolbarButton}
                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}
                    title="위로"
                    type="button"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    className={styles.blockToolbarButton}
                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}
                    title="아래로"
                    type="button"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    className={styles.blockToolbarButton}
                    onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
                    title="복제"
                    type="button"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    className={`${styles.blockToolbarButton} ${styles.blockToolbarButtonDanger}`}
                    onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                    title="삭제"
                    type="button"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <BlockRenderer block={block} />
              </div>
            ))}
          </div>
        )}

        {selectedBlock ? (
          <BlockEditor
            block={selectedBlock}
            onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
          />
        ) : null}
      </div>
    </div>
  );
}
