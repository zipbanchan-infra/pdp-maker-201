"use client";

import { useCallback, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ZipbanchanBlock, FoodItem } from "./types";
import styles from "./zipbanchan.module.css";

interface BlockEditorProps {
  block: ZipbanchanBlock;
  onUpdate: (updates: Partial<ZipbanchanBlock>) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.blockEditorField}>
      <label className={styles.blockEditorLabel}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className={styles.blockEditorInput}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      className={styles.blockEditorTextarea}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      value={value}
    />
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.blockEditorColorRow}>
      <input
        className={styles.blockEditorColorSwatch}
        onChange={(e) => onChange(e.target.value)}
        type="color"
        value={value}
      />
      <input
        className={styles.blockEditorInput}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1 }}
        type="text"
        value={value}
      />
    </div>
  );
}

function ImageUpload({ value, onChange, label }: { value: string; label?: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  return (
    <>
      <input
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
      {value ? (
        <div style={{ position: "relative" }}>
          <img alt={label} src={value} style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 8 }} />
          <button
            onClick={() => onChange("")}
            style={{ position: "absolute", top: 4, right: 4, background: "#fff", border: "1px solid #ddd", borderRadius: 6, padding: "2px 6px", cursor: "pointer", fontSize: 11 }}
            type="button"
          >
            제거
          </button>
        </div>
      ) : (
        <button
          className={styles.imageUploadZone}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Plus size={16} />
          {label ?? "이미지 업로드"}
        </button>
      )}
    </>
  );
}

function FoodItemEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: FoodItem;
  index: number;
  onChange: (updated: FoodItem) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#888" }}>항목 {index + 1}</span>
        <button
          onClick={onRemove}
          style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 2 }}
          type="button"
        >
          <Trash2 size={12} /> 삭제
        </button>
      </div>
      <Field label="이름">
        <TextInput value={item.name} onChange={(v) => onChange({ ...item, name: v })} />
      </Field>
      <Field label="설명">
        <TextInput value={item.description ?? ""} onChange={(v) => onChange({ ...item, description: v })} />
      </Field>
      <Field label="이미지">
        <ImageUpload value={item.imageUrl} onChange={(v) => onChange({ ...item, imageUrl: v })} />
      </Field>
    </div>
  );
}

export function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  const BLOCK_LABELS: Record<string, string> = {
    "hero-banner": "히어로 배너",
    "section-header": "섹션 구분",
    "food-card": "음식 카드",
    "food-grid": "음식 그리드",
    "food-list": "음식 리스트",
    "text-banner": "텍스트 배너",
    "promo-banner": "프로모션 배너",
    "ranking-section": "랭킹",
    "story-section": "스토리",
    "chef-profile": "셰프 프로필",
    "nutrition-badge": "영양 정보",
  };

  const addFoodItem = useCallback((items: FoodItem[]) => {
    return [...items, { id: `fi-${Date.now()}`, name: "새 메뉴", imageUrl: "", description: "" }];
  }, []);

  return (
    <div className={styles.blockEditorPanel}>
      <h4 className={styles.blockEditorTitle}>{BLOCK_LABELS[block.type] ?? block.type} 편집</h4>

      {block.type === "hero-banner" ? (
        <>
          <Field label="제목">
            <TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          <Field label="부제목">
            <TextInput value={block.subtitle} onChange={(v) => onUpdate({ subtitle: v })} />
          </Field>
          <Field label="배경색">
            <ColorInput value={block.backgroundColor} onChange={(v) => onUpdate({ backgroundColor: v })} />
          </Field>
          <Field label="글자색">
            <ColorInput value={block.accentColor} onChange={(v) => onUpdate({ accentColor: v })} />
          </Field>
          <Field label="배경 이미지">
            <ImageUpload value={block.backgroundImageUrl ?? ""} onChange={(v) => onUpdate({ backgroundImageUrl: v })} />
          </Field>
          <Field label="일러스트">
            <ImageUpload value={block.illustrationUrl ?? ""} onChange={(v) => onUpdate({ illustrationUrl: v })} label="일러스트 이미지" />
          </Field>
        </>
      ) : null}

      {block.type === "section-header" ? (
        <>
          <Field label="아이콘 (이모지)">
            <TextInput value={block.icon} onChange={(v) => onUpdate({ icon: v })} />
          </Field>
          <Field label="제목">
            <TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          <Field label="부제목">
            <TextInput value={block.subtitle ?? ""} onChange={(v) => onUpdate({ subtitle: v })} />
          </Field>
        </>
      ) : null}

      {block.type === "text-banner" ? (
        <>
          <Field label="헤드라인">
            <TextArea value={block.headline} onChange={(v) => onUpdate({ headline: v })} />
          </Field>
          <Field label="본문">
            <TextArea value={block.body} onChange={(v) => onUpdate({ body: v })} />
          </Field>
          <Field label="배경색">
            <ColorInput value={block.backgroundColor} onChange={(v) => onUpdate({ backgroundColor: v })} />
          </Field>
          <Field label="글자색">
            <ColorInput value={block.textColor} onChange={(v) => onUpdate({ textColor: v })} />
          </Field>
        </>
      ) : null}

      {block.type === "food-grid" ? (
        <>
          <Field label="제목">
            <TextInput value={block.title ?? ""} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          <Field label="열 수">
            <select
              className={styles.blockEditorInput}
              onChange={(e) => onUpdate({ columns: Number(e.target.value) as 2 | 3 })}
              value={block.columns}
            >
              <option value={2}>2열</option>
              <option value={3}>3열</option>
            </select>
          </Field>
          <Field label="모양">
            <select
              className={styles.blockEditorInput}
              onChange={(e) => onUpdate({ shape: e.target.value as "circle" | "rounded-square" })}
              value={block.shape}
            >
              <option value="rounded-square">사각형</option>
              <option value="circle">원형</option>
            </select>
          </Field>
          {block.items.map((item, i) => (
            <FoodItemEditor
              index={i}
              item={item}
              key={item.id}
              onChange={(updated) => {
                const next = [...block.items];
                next[i] = updated;
                onUpdate({ items: next });
              }}
              onRemove={() => onUpdate({ items: block.items.filter((_, j) => j !== i) })}
            />
          ))}
          <button
            className={styles.addFoodItemButton}
            onClick={() => onUpdate({ items: addFoodItem(block.items) })}
            type="button"
          >
            <Plus size={14} /> 메뉴 추가
          </button>
        </>
      ) : null}

      {block.type === "food-list" ? (
        <>
          <Field label="제목">
            <TextInput value={block.title ?? ""} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          {block.items.map((item, i) => (
            <FoodItemEditor
              index={i}
              item={item}
              key={item.id}
              onChange={(updated) => {
                const next = [...block.items];
                next[i] = updated;
                onUpdate({ items: next });
              }}
              onRemove={() => onUpdate({ items: block.items.filter((_, j) => j !== i) })}
            />
          ))}
          <button
            className={styles.addFoodItemButton}
            onClick={() => onUpdate({ items: addFoodItem(block.items) })}
            type="button"
          >
            <Plus size={14} /> 메뉴 추가
          </button>
        </>
      ) : null}

      {block.type === "ranking-section" ? (
        <>
          <Field label="제목">
            <TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          <Field label="배지">
            <TextInput value={block.badge ?? ""} onChange={(v) => onUpdate({ badge: v })} />
          </Field>
          {block.items.map((item, i) => (
            <FoodItemEditor
              index={i}
              item={item}
              key={item.id}
              onChange={(updated) => {
                const next = [...block.items];
                next[i] = updated;
                onUpdate({ items: next });
              }}
              onRemove={() => onUpdate({ items: block.items.filter((_, j) => j !== i) })}
            />
          ))}
          <button
            className={styles.addFoodItemButton}
            onClick={() => onUpdate({ items: addFoodItem(block.items) })}
            type="button"
          >
            <Plus size={14} /> 항목 추가
          </button>
        </>
      ) : null}

      {block.type === "promo-banner" ? (
        <>
          <Field label="제목">
            <TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          <Field label="부제목">
            <TextInput value={block.subtitle} onChange={(v) => onUpdate({ subtitle: v })} />
          </Field>
          <Field label="할인율">
            <TextInput value={block.discount ?? ""} onChange={(v) => onUpdate({ discount: v })} placeholder="-50%" />
          </Field>
          <Field label="CTA 텍스트">
            <TextInput value={block.ctaText} onChange={(v) => onUpdate({ ctaText: v })} />
          </Field>
          <Field label="배경색">
            <ColorInput value={block.backgroundColor} onChange={(v) => onUpdate({ backgroundColor: v })} />
          </Field>
          <Field label="강조색">
            <ColorInput value={block.accentColor} onChange={(v) => onUpdate({ accentColor: v })} />
          </Field>
        </>
      ) : null}

      {block.type === "story-section" ? (
        <>
          <Field label="제목">
            <TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          {block.steps.map((step, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#888" }}>단계 {i + 1}</span>
                <button
                  onClick={() => onUpdate({ steps: block.steps.filter((_, j) => j !== i) })}
                  style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: 11 }}
                  type="button"
                >
                  삭제
                </button>
              </div>
              <Field label="캡션">
                <TextInput
                  value={step.caption}
                  onChange={(v) => {
                    const next = [...block.steps];
                    next[i] = { ...step, caption: v };
                    onUpdate({ steps: next });
                  }}
                />
              </Field>
              <Field label="설명">
                <TextInput
                  value={step.description ?? ""}
                  onChange={(v) => {
                    const next = [...block.steps];
                    next[i] = { ...step, description: v };
                    onUpdate({ steps: next });
                  }}
                />
              </Field>
              <Field label="이미지">
                <ImageUpload
                  value={step.imageUrl}
                  onChange={(v) => {
                    const next = [...block.steps];
                    next[i] = { ...step, imageUrl: v };
                    onUpdate({ steps: next });
                  }}
                />
              </Field>
            </div>
          ))}
          <button
            className={styles.addFoodItemButton}
            onClick={() => onUpdate({ steps: [...block.steps, { imageUrl: "", caption: "새 단계", description: "" }] })}
            type="button"
          >
            <Plus size={14} /> 단계 추가
          </button>
        </>
      ) : null}

      {block.type === "chef-profile" ? (
        <>
          <Field label="이름">
            <TextInput value={block.name} onChange={(v) => onUpdate({ name: v })} />
          </Field>
          <Field label="직함">
            <TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} />
          </Field>
          <Field label="인용문">
            <TextArea value={block.quote ?? ""} onChange={(v) => onUpdate({ quote: v })} />
          </Field>
          <Field label="프로필 이미지">
            <ImageUpload value={block.imageUrl} onChange={(v) => onUpdate({ imageUrl: v })} />
          </Field>
        </>
      ) : null}

      {block.type === "nutrition-badge" ? (
        <>
          <Field label="칼로리">
            <TextInput value={block.calories ?? ""} onChange={(v) => onUpdate({ calories: v })} placeholder="350kcal" />
          </Field>
          <Field label="배경색">
            <ColorInput value={block.backgroundColor ?? "#f0ede6"} onChange={(v) => onUpdate({ backgroundColor: v })} />
          </Field>
          {block.highlights.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              <input
                className={styles.blockEditorInput}
                onChange={(e) => {
                  const next = [...block.highlights];
                  next[i] = { ...item, label: e.target.value };
                  onUpdate({ highlights: next });
                }}
                placeholder="라벨"
                style={{ flex: 1 }}
                value={item.label}
              />
              <input
                className={styles.blockEditorInput}
                onChange={(e) => {
                  const next = [...block.highlights];
                  next[i] = { ...item, value: e.target.value };
                  onUpdate({ highlights: next });
                }}
                placeholder="값"
                style={{ flex: 1 }}
                value={item.value}
              />
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}
