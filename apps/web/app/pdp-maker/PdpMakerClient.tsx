"use client";

import { type DragEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Clock3, Copy, FolderOpen, Loader2, RectangleHorizontal, RectangleVertical, Settings2, Smartphone, Sparkles, Square, Trash2, Upload, Wand2 } from "lucide-react";
import type { AspectRatio, GeneratedResult, PdpAnalyzeResponse, ReferenceModelUsage } from "@runacademy/shared";
import type { PdpAppState, PdpDraftSummary, PdpEditorDraftState, PreparedImageDraft } from "./pdp-drafts";
import { deletePdpDraft, getPdpDraft, listPdpDrafts, savePdpDraft } from "./pdp-drafts";
import { PdpEditor } from "./PdpEditor";
import { PdpSettingsSheet } from "./PdpSettingsSheet";
import styles from "./pdp-maker.module.css";
import {
  loadPdpClientSettings,
  resolveGeminiApiKeyHeaderValue,
  savePdpClientSettings,
  type PdpClientSettings
} from "./pdp-settings";
import { RATIO_OPTIONS, TONE_OPTIONS, apiJson, prepareImageFile, validateGeminiApiKey } from "./pdp-utils";
import zbStyles from "../../components/zipbanchan/zipbanchan.module.css";
import { ZipbanchanViewer } from "../../components/zipbanchan/ZipbanchanViewer";

type PreparedImage = PreparedImageDraft;
type MakerTab = "general" | "zipbanchan";

export function PdpMakerClient() {
  const [activeTab, setActiveTab] = useState<MakerTab>("general");
  const [appState, setAppState] = useState<PdpAppState>("upload");
  const [preparedImage, setPreparedImage] = useState<PreparedImage | null>(null);
  const [modelImage, setModelImage] = useState<PreparedImage | null>(null);
  const [modelImageUsage, setModelImageUsage] = useState<ReferenceModelUsage | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [desiredTone, setDesiredTone] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [notice, setNotice] = useState("브라우저에 초안이 저장되며, 저장한 작업은 이 화면에서 이어서 열 수 있습니다.");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [showErrorDetail, setShowErrorDetail] = useState(false);
  const [loadingStep, setLoadingStep] = useState("제품 이미지를 분석하는 중입니다.");
  const [drafts, setDrafts] = useState<PdpDraftSummary[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [draftCreatedAt, setDraftCreatedAt] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [editorDraftState, setEditorDraftState] = useState<PdpEditorDraftState | null>(null);
  const [editorSessionKey, setEditorSessionKey] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [manualSaveToastToken, setManualSaveToastToken] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [clientSettings, setClientSettings] = useState<PdpClientSettings>({ customGeminiApiKey: "" });
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = useCallback((from: number, to: number) => {
    setCompletedSteps((prev) => { const next = new Set(prev); next.add(from); return next; });
    setExpandedStep(to);
  }, []);
  const isApplyingDraftRef = useRef(false);
  const saveInFlightRef = useRef(false);

  const selectedRatio = useMemo(() => RATIO_OPTIONS.find((option) => option.value === aspectRatio) ?? RATIO_OPTIONS[2], [aspectRatio]);
  const selectedToneLabel = desiredTone || "AI 자동 추천";
  const preparedImageDisplayName = preparedImage ? formatCompactFileName(preparedImage.fileName) : "";
  const modelImageDisplayName = modelImage ? formatCompactFileName(modelImage.fileName) : "";
  const hasDraftContent = Boolean(preparedImage || modelImage || result || additionalInfo.trim() || desiredTone.trim() || activeDraftId);
  const effectiveGeminiApiKey = resolveGeminiApiKeyHeaderValue(clientSettings);
  const hasAvailableGeminiKey = Boolean(effectiveGeminiApiKey);
  const canAnalyze = Boolean(preparedImage && (!modelImage || modelImageUsage) && hasAvailableGeminiKey);
  const apiConnectionLabel = effectiveGeminiApiKey ? "개인 API 키" : "키 필요";

  const refreshDrafts = useCallback(async () => {
    setIsLoadingDrafts(true);
    try {
      setDrafts(await listPdpDrafts());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "저장된 작업 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoadingDrafts(false);
    }
  }, []);

  useEffect(() => {
    void refreshDrafts();
  }, [refreshDrafts]);

  useEffect(() => {
    setClientSettings(loadPdpClientSettings());
  }, []);

  useEffect(() => {
    if (isApplyingDraftRef.current || !hasDraftContent) {
      return;
    }

    setIsDirty(true);
    setSaveState((current) => (current === "saved" ? "idle" : current));
  }, [additionalInfo, appState, aspectRatio, desiredTone, editorDraftState, hasDraftContent, modelImage, modelImageUsage, preparedImage, result]);

  const handlePreparedImage = async (file: File) => {
    try {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      const nextImage = await prepareImageFile(file);
      setPreparedImage(nextImage);
      setErrorMessage("");
      setErrorDetail("");
      setShowErrorDetail(false);
      setNotice(`${file.name} 이미지를 준비했습니다. 설정을 확인한 뒤 AI 분석을 시작해 보세요.`);
      goToStep(1, 2);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "이미지를 준비하지 못했습니다.");
      setErrorDetail(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    }
  };

  const handleModelImage = async (file: File) => {
    try {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      const nextImage = await prepareImageFile(file);
      setModelImage(nextImage);
      setModelImageUsage(null);
      setErrorMessage("");
      setErrorDetail("");
      setShowErrorDetail(false);
      setNotice(`${file.name} 모델 이미지를 준비했습니다. 히어로우 전용 또는 전체 일관성 유지 방식을 선택해 주세요.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "모델 이미지를 준비하지 못했습니다.");
      setErrorDetail(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    }
  };

  const buildDraftInput = useCallback(() => {
    if (!hasDraftContent) {
      return null;
    }

    return {
      id: activeDraftId ?? undefined,
      createdAt: draftCreatedAt ?? undefined,
      appState: result ? "editor" : appState === "processing" ? "upload" : appState,
      preparedImage,
      modelImage,
      modelImageUsage,
      result,
      additionalInfo,
      desiredTone,
      aspectRatio,
      notice: editorDraftState?.notice ?? notice,
      editorState: result ? editorDraftState ?? createDefaultEditorDraftState(result) : null
    };
  }, [activeDraftId, additionalInfo, appState, aspectRatio, desiredTone, draftCreatedAt, editorDraftState, hasDraftContent, modelImage, modelImageUsage, notice, preparedImage, result]);

  const persistDraft = useCallback(
    async (mode: "manual" | "auto" | "switch" = "manual", options?: { showToast?: boolean }) => {
      const input = buildDraftInput();
      if (!input || saveInFlightRef.current) {
        return null;
      }

      saveInFlightRef.current = true;
      setSaveState("saving");

      try {
        const savedDraft = await savePdpDraft(input);
        isApplyingDraftRef.current = true;
        setActiveDraftId(savedDraft.id);
        setDraftCreatedAt(savedDraft.createdAt);
        setLastSavedAt(savedDraft.updatedAt);
        setSaveState("saved");
        setIsDirty(false);
        if (mode === "manual") {
          setNotice("현재 작업을 저장했습니다. 시작 화면에서 이어서 작업할 수 있습니다.");
          if (options?.showToast) {
            setManualSaveToastToken(Date.now());
          }
        }
        await refreshDrafts();
        return savedDraft;
      } catch (error) {
        setSaveState("error");
        setErrorMessage("작업을 저장하지 못했습니다.");
        setErrorDetail(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
        return null;
      } finally {
        saveInFlightRef.current = false;
        requestAnimationFrame(() => {
          isApplyingDraftRef.current = false;
        });
      }
    },
    [buildDraftInput, refreshDrafts]
  );

  const confirmSaveBeforeLeaving = useCallback(async () => {
    if (!isDirty || !hasDraftContent) {
      return true;
    }

    const shouldSave = window.confirm("저장되지 않은 작업이 있습니다.\n확인: 저장 후 이동\n취소: 저장하지 않고 이동");
    if (!shouldSave) {
      return true;
    }

    const savedDraft = await persistDraft("manual");
    return Boolean(savedDraft);
  }, [hasDraftContent, isDirty, persistDraft]);

  const resetWorkspace = useCallback(() => {
    isApplyingDraftRef.current = true;
    setAppState("upload");
    setPreparedImage(null);
    setModelImage(null);
    setModelImageUsage(null);
    setResult(null);
    setAdditionalInfo("");
    setDesiredTone("");
    setAspectRatio("9:16");
    setNotice("새 이미지로 다시 시작할 수 있습니다.");
    setErrorMessage("");
    setErrorDetail("");
    setShowErrorDetail(false);
    setEditorDraftState(null);
    setActiveDraftId(null);
    setDraftCreatedAt(null);
    setLastSavedAt(null);
    setSaveState("idle");
    setIsDirty(false);
    setEditorSessionKey((current) => current + 1);
    requestAnimationFrame(() => {
      isApplyingDraftRef.current = false;
    });
  }, []);

  const handleLoadDraft = useCallback(
    async (draftId: string) => {
      const canContinue = await confirmSaveBeforeLeaving();
      if (!canContinue) {
        return;
      }

      setIsLoadingDraft(true);
      setErrorMessage("");
      setErrorDetail("");
      setShowErrorDetail(false);

      try {
        const draft = await getPdpDraft(draftId);
        if (!draft) {
          setErrorMessage("저장된 작업을 찾지 못했습니다.");
          await refreshDrafts();
          return;
        }

        isApplyingDraftRef.current = true;
        setActiveDraftId(draft.id);
        setDraftCreatedAt(draft.createdAt);
        setLastSavedAt(draft.updatedAt);
        setPreparedImage(draft.preparedImage);
        setModelImage(draft.modelImage ?? null);
        setModelImageUsage(draft.modelImageUsage ?? null);
        setResult(draft.result);
        setAdditionalInfo(draft.additionalInfo);
        setDesiredTone(draft.desiredTone);
        setAspectRatio(draft.aspectRatio);
        setNotice(draft.notice);
        setEditorDraftState(draft.editorState);
        setAppState(draft.result ? "editor" : "upload");
        setSaveState("saved");
        setIsDirty(false);
        setEditorSessionKey((current) => current + 1);
      } catch (error) {
        setErrorMessage("저장된 작업을 불러오지 못했습니다.");
        setErrorDetail(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
      } finally {
        requestAnimationFrame(() => {
          isApplyingDraftRef.current = false;
          setIsLoadingDraft(false);
        });
      }
    },
    [confirmSaveBeforeLeaving, refreshDrafts]
  );

  const handleDeleteDraft = useCallback(
    async (draftId: string) => {
      const shouldDelete = window.confirm("이 저장된 작업을 삭제할까요?");
      if (!shouldDelete) {
        return;
      }

      try {
        await deletePdpDraft(draftId);
        if (activeDraftId === draftId) {
          resetWorkspace();
        }
        await refreshDrafts();
      } catch (error) {
        setErrorMessage("저장된 작업을 삭제하지 못했습니다.");
        setErrorDetail(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
      }
    },
    [activeDraftId, refreshDrafts, resetWorkspace]
  );

  useEffect(() => {
    if (!isDirty || !hasDraftContent) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasDraftContent, isDirty]);

  useEffect(() => {
    if (!hasDraftContent) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!isDirty) {
        return;
      }

      void persistDraft("auto");
    }, 30000);

    return () => window.clearInterval(timer);
  }, [hasDraftContent, isDirty, persistDraft]);

  const handleAnalyze = async () => {
    if (!preparedImage) {
      setErrorMessage("먼저 제품 이미지를 업로드해 주세요.");
      return;
    }

    if (!hasAvailableGeminiKey) {
      setErrorMessage("설정 메뉴에서 본인 Gemini API 키를 먼저 입력해 주세요.");
      return;
    }

    const currentGeminiApiKey = effectiveGeminiApiKey;

    if (!currentGeminiApiKey) {
      setErrorMessage("설정 메뉴에서 본인 Gemini API 키를 먼저 입력해 주세요.");
      return;
    }

    if (modelImage && !modelImageUsage) {
      setErrorMessage("모델 이미지를 사용할 방식을 먼저 선택해 주세요.");
      return;
    }

    setAppState("processing");
    setErrorMessage("");
    setErrorDetail("");
    setShowErrorDetail(false);
    setLoadingStep("입력한 Gemini API 키 연결 상태를 확인하는 중입니다.");

    try {
      const keyValidation = await validateGeminiApiKey(currentGeminiApiKey);

      if (!keyValidation.ok) {
        setAppState("upload");
        setErrorMessage(keyValidation.message);
        setErrorDetail(keyValidation.detail ?? "");
        return;
      }

      setLoadingStep("제품을 분석하고 상세페이지 구조를 설계하는 중입니다.");

      const response = await apiJson<PdpAnalyzeResponse>("/pdp/analyze", {
        method: "POST",
        body: JSON.stringify({
          imageBase64: preparedImage.base64,
          mimeType: preparedImage.mimeType,
          modelImageBase64: modelImage?.base64,
          modelImageMimeType: modelImage?.mimeType,
          modelImageFileName: modelImage?.fileName,
          additionalInfo: additionalInfo.trim() || undefined,
          desiredTone: desiredTone.trim() || undefined,
          aspectRatio,
          stylePreset: activeTab === "zipbanchan" ? "zipbanchan" : "general"
        })
      }, { geminiApiKey: currentGeminiApiKey });

      if (!response.ok) {
        setAppState("upload");
        setErrorMessage(response.message);
        setErrorDetail(response.detail ?? "");
        return;
      }

      setResult(response.result);
      setEditorDraftState(null);
      setEditorSessionKey((current) => current + 1);
      setNotice("분석이 완료되었습니다. 섹션별 이미지를 재생성하거나 텍스트를 직접 배치해 보세요.");
      setAppState("editor");
    } catch (error) {
      setAppState("upload");
      setErrorMessage("API 서버와 통신하지 못했습니다.");
      setErrorDetail(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    }
  };

  const handleReset = async () => {
    const canContinue = await confirmSaveBeforeLeaving();
    if (!canContinue) {
      return;
    }

    resetWorkspace();
  };

  const handleGoToMain = async () => {
    const canContinue = await confirmSaveBeforeLeaving();
    if (!canContinue) {
      return;
    }

    resetWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveSettings = (nextSettings: PdpClientSettings) => {
    savePdpClientSettings(nextSettings);
    setClientSettings(loadPdpClientSettings());
    setNotice("개인 Gemini API 키 확인을 마쳤습니다. 이 브라우저에서는 입력한 키로 바로 작업할 수 있습니다.");
  };

  if (appState === "editor" && result && activeTab === "zipbanchan") {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <ZipbanchanViewer
            result={result}
            onReset={() => void handleReset()}
          />
        </section>
      </main>
    );
  }

  if (appState === "editor" && result) {
    return (
      <>
        <PdpEditor
          key={`${activeDraftId ?? "new"}-${editorSessionKey}`}
          aspectRatio={aspectRatio}
          geminiApiKey={effectiveGeminiApiKey}
          desiredTone={desiredTone}
          initialDraftState={editorDraftState}
          initialResult={result}
          lastSavedAt={lastSavedAt}
          manualSaveToastToken={manualSaveToastToken}
          onDraftStateChange={setEditorDraftState}
          onManualSave={() => void persistDraft("manual", { showToast: true })}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onReset={() => void handleReset()}
          apiConnectionLabel={apiConnectionLabel}
          referenceModelImage={modelImage}
          referenceModelUsage={modelImageUsage}
          saveState={saveState}
        />
        <PdpSettingsSheet
          onOpenChange={setIsSettingsOpen}
          onSave={handleSaveSettings}
          open={isSettingsOpen}
          settings={clientSettings}
        />
      </>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.toolHeaderCompact}>
          <button className={styles.brandHomeButton} onClick={() => void handleGoToMain()} type="button">
            <strong>집반찬연구소</strong> 상세페이지 마법사
          </button>
          <div className={styles.toolHeaderActions}>
            <span className={styles.metaPill}>{apiConnectionLabel}</span>
            <button className={styles.headerSettingsButton} onClick={() => setIsSettingsOpen(true)} type="button">
              <Settings2 size={14} />
            </button>
          </div>
        </header>

        {appState !== "processing" ? (
          <div className={styles.mainGrid}>
          <section className={styles.savedDraftsPanel}>
            <div className={styles.savedDraftsHeader}>
              <div>
                <span className={styles.panelLabel}>저장된 작업</span>
                <h2 className={styles.savedDraftsTitle}>이어서 작업하기</h2>
              </div>
              <div className={styles.savedDraftsMeta}>
                <span className={styles.metaPill}>자동 저장 30초</span>
                {lastSavedAt ? <span className={styles.metaPill}>최근 저장 {formatSavedDraftDate(lastSavedAt)}</span> : null}
              </div>
            </div>

            {isLoadingDrafts ? (
              <div className={styles.savedDraftsEmpty}>
                <Loader2 className={styles.spinIcon} size={16} />
                저장된 작업을 불러오는 중입니다.
              </div>
            ) : drafts.length ? (
              <div className={styles.savedDraftGrid}>
                {drafts.map((draft) => (
                  <article className={styles.savedDraftCard} key={draft.id}>
                    <div className={styles.savedDraftPreview}>
                      <div className={styles.savedDraftPreviewFrame}>
                        {draft.thumbnailUrl ? <img alt={draft.title} src={draft.thumbnailUrl} /> : <Sparkles size={18} />}
                      </div>
                      <div className={styles.savedDraftPreviewMeta}>
                        <span className={styles.savedDraftStageBadge}>{draft.stageLabel}</span>
                        <span className={styles.savedDraftAspectBadge}>{draft.aspectRatio}</span>
                      </div>
                    </div>
                    <div className={styles.savedDraftCopy}>
                      <div className={styles.savedDraftHeaderRow}>
                        <strong title={draft.title}>{draft.title}</strong>
                        <span className={styles.savedDraftCountBadge}>{draft.sectionCount}섹션</span>
                      </div>
                      <p className={styles.savedDraftTimestamp}>{formatSavedDraftDate(draft.updatedAt)}</p>
                      <div className={styles.savedDraftMetaRow}>
                        <span>최근 저장</span>
                        <span>{formatSavedDraftDate(draft.updatedAt)}</span>
                      </div>
                    </div>
                    <div className={styles.savedDraftActions}>
                      <button className={styles.inlineButton} onClick={() => void handleLoadDraft(draft.id)} type="button" disabled={isLoadingDraft}>
                        <FolderOpen size={14} />
                        불러오기
                      </button>
                      <button className={styles.inlineDangerButton} onClick={() => void handleDeleteDraft(draft.id)} type="button">
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.savedDraftsEmpty}>
                <Clock3 size={16} />
                아직 저장된 작업이 없습니다. 이미지를 올리고 저장하면 이곳에서 다시 이어서 열 수 있습니다.
              </div>
            )}
          </section>

          <section className={styles.wizardPanel}>
            <div className={styles.wizardPanelHeader}>
              <span className={styles.panelLabel}>새 상세페이지</span>
              <h2 className={styles.savedDraftsTitle}>새로운 컨텐츠 만들기</h2>
              <p className={styles.panelDescription}>제품 이미지와 설정을 단계별로 입력하면 AI가 상세페이지를 자동 생성합니다.</p>
            </div>

            {/* Step 1: 스타일 선택 */}
            <div className={styles.wizardStep}>
              <button className={styles.wizardStepHeader} onClick={() => setExpandedStep(expandedStep === 0 ? -1 : 0)} type="button">
                <span className={completedSteps.has(0) ? styles.wizardStepDone : styles.wizardStepNumber}>
                  {completedSteps.has(0) ? "✓" : "1"}
                </span>
                <span className={styles.wizardStepLabel}>
                  스타일
                  <small> - {activeTab === "zipbanchan" ? "집반찬연구소" : "일반"}</small>
                </span>
                <span className={styles.toggleChevron}>{expandedStep === 0 ? "접기" : "펼치기"}</span>
              </button>
              {expandedStep === 0 ? (
                <div className={styles.wizardStepBody}>
                  <div className={styles.modelUsageGrid}>
                    <button
                      className={activeTab === "general" ? styles.modelUsageCardActive : styles.modelUsageCard}
                      onClick={() => { setActiveTab("general"); goToStep(0, 1); }}
                      type="button"
                    >
                      <strong>일반</strong>
                      <span>범용 상세페이지</span>
                    </button>
                    <button
                      className={activeTab === "zipbanchan" ? styles.modelUsageCardActive : styles.modelUsageCard}
                      onClick={() => { setActiveTab("zipbanchan"); goToStep(0, 1); }}
                      type="button"
                    >
                      <strong>집반찬연구소</strong>
                      <span>브랜드 스타일 자동 적용</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Step 2: 제품 이미지 */}
            <div className={styles.wizardStep}>
              <button className={styles.wizardStepHeader} onClick={() => setExpandedStep(expandedStep === 1 ? -1 : 1)} type="button">
                <span className={preparedImage ? styles.wizardStepDone : styles.wizardStepNumber}>
                  {preparedImage ? "✓" : "2"}
                </span>
                <span className={styles.wizardStepLabel}>
                  제품 이미지
                  {preparedImage ? <small> - {preparedImageDisplayName}</small> : null}
                </span>
                <span className={styles.toggleChevron}>{expandedStep === 1 ? "접기" : "펼치기"}</span>
              </button>
              {expandedStep === 1 ? (
                <div className={styles.wizardStepBody}>
                  <UploadDropzone
                    compact
                    description="JPG, PNG, WEBP (최대 10MB)"
                    hint={preparedImage?.fileName ? `선택됨: ${preparedImageDisplayName}` : "클릭 또는 드래그"}
                    onSelect={handlePreparedImage}
                    selectedFileName={preparedImage?.fileName}
                    title="제품 이미지를 업로드하세요"
                  />
                  {preparedImage ? (
                    <div className={styles.wizardPreviewRow}>
                      <img alt={preparedImage.fileName} className={styles.wizardPreviewThumb} src={preparedImage.previewUrl} />
                      <span>{preparedImageDisplayName}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Step 2: 모델 이미지 (선택) */}
            <div className={styles.wizardStep}>
              <button className={styles.wizardStepHeader} onClick={() => setExpandedStep(expandedStep === 2 ? 0 : 2)} type="button">
                <span className={modelImage ? styles.wizardStepDone : styles.wizardStepNumber}>
                  {modelImage ? "✓" : "3"}
                </span>
                <span className={styles.wizardStepLabel}>
                  모델 이미지
                  <small> - {modelImage ? modelImageDisplayName : "선택 사항"}</small>
                </span>
                <span className={styles.toggleChevron}>{expandedStep === 2 ? "접기" : "펼치기"}</span>
              </button>
              {expandedStep === 2 ? (
                <div className={styles.wizardStepBody}>
                  <UploadDropzone
                    compact
                    description="인물 이미지 (선택 사항)"
                    hint={modelImage?.fileName ? `선택됨: ${modelImageDisplayName}` : "클릭 또는 드래그"}
                    onSelect={async (file) => { await handleModelImage(file); goToStep(2, 21); }}
                    selectedFileName={modelImage?.fileName}
                    title="모델 이미지를 업로드하세요"
                  />
                  {modelImage ? (
                    <div className={styles.wizardPreviewRow}>
                      <img alt={modelImage.fileName} className={styles.wizardPreviewThumb} src={modelImage.previewUrl} />
                      <span>{modelImageDisplayName}</span>
                      <button className={styles.inlineButton} onClick={() => { setModelImage(null); setModelImageUsage(null); }} type="button">
                        <Trash2 size={12} /> 제거
                      </button>
                    </div>
                  ) : null}
                  <button className={styles.inlineButton} onClick={() => goToStep(2, modelImage ? 21 : 3)} type="button" style={{ marginTop: 8 }}>
                    {modelImage ? "다음 →" : "건너뛰기 →"}
                  </button>
                </div>
              ) : null}
            </div>

            {/* Step 3-1: 모델 적용 위치 (모델 이미지 있을 때만) */}
            {modelImage ? (
              <div className={styles.wizardStep}>
                <button className={styles.wizardStepHeader} onClick={() => setExpandedStep(expandedStep === 21 ? -1 : 21)} type="button">
                  <span className={modelImageUsage ? styles.wizardStepDone : styles.wizardStepNumber}>
                    {modelImageUsage ? "✓" : "-"}
                  </span>
                  <span className={styles.wizardStepLabel}>
                    모델 적용 위치
                    <small> - {modelImageUsage === "hero-only" ? "히어로만" : modelImageUsage === "all-sections" ? "전체" : "선택 필요"}</small>
                  </span>
                  <span className={styles.toggleChevron}>{expandedStep === 21 ? "접기" : "펼치기"}</span>
                </button>
                {expandedStep === 21 ? (
                  <div className={styles.wizardStepBody}>
                    <div className={styles.modelUsageGrid}>
                      <button
                        className={modelImageUsage === "hero-only" ? styles.modelUsageCardActive : styles.modelUsageCard}
                        onClick={() => { setModelImageUsage("hero-only"); goToStep(21, 3); }}
                        type="button"
                      >
                        <strong>히어로에만</strong>
                        <span>첫 섹션에만 적용</span>
                      </button>
                      <button
                        className={modelImageUsage === "all-sections" ? styles.modelUsageCardActive : styles.modelUsageCard}
                        onClick={() => { setModelImageUsage("all-sections"); goToStep(21, 3); }}
                        type="button"
                      >
                        <strong>전체 적용</strong>
                        <span>모든 모델컷에 적용</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Step 3: 추가 정보 */}
            <div className={styles.wizardStep}>
              <button className={styles.wizardStepHeader} onClick={() => setExpandedStep(expandedStep === 3 ? 0 : 3)} type="button">
                <span className={completedSteps.has(3) ? styles.wizardStepDone : styles.wizardStepNumber}>{completedSteps.has(3) ? "✓" : "4"}</span>
                <span className={styles.wizardStepLabel}>
                  추가 정보
                  <small> - {additionalInfo.trim() ? additionalInfo.trim().slice(0, 20) + "..." : "선택 사항"}</small>
                </span>
                <span className={styles.toggleChevron}>{expandedStep === 3 ? "접기" : "펼치기"}</span>
              </button>
              {expandedStep === 3 ? (
                <div className={styles.wizardStepBody}>
                  <textarea
                    className={styles.textarea}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="예: 20대 여성, 여름 시즌, 프리미엄 이미지 강조"
                    rows={3}
                    value={additionalInfo}
                  />
                  <button className={styles.inlineButton} onClick={() => goToStep(3, 4)} type="button" style={{ marginTop: 8 }}>
                    {additionalInfo.trim() ? "다음 →" : "건너뛰기 →"}
                  </button>
                </div>
              ) : null}
            </div>

            {/* Step 4: 톤 */}
            <div className={styles.wizardStep}>
              <button className={styles.wizardStepHeader} onClick={() => setExpandedStep(expandedStep === 4 ? 0 : 4)} type="button">
                <span className={completedSteps.has(4) ? styles.wizardStepDone : styles.wizardStepNumber}>{completedSteps.has(4) ? "✓" : "5"}</span>
                <span className={styles.wizardStepLabel}>
                  톤
                  <small> - {selectedToneLabel}</small>
                </span>
                <span className={styles.toggleChevron}>{expandedStep === 4 ? "접기" : "펼치기"}</span>
              </button>
              {expandedStep === 4 ? (
                <div className={styles.wizardStepBody}>
                  <div className={styles.toneGrid}>
                    {TONE_OPTIONS.map((tone) => {
                      const value = tone === "AI 자동 추천" ? "" : tone;
                      return (
                        <button
                          className={desiredTone === value ? styles.toneButtonActive : styles.toneButton}
                          key={tone}
                          onClick={() => { setDesiredTone(value); goToStep(4, 5); }}
                          type="button"
                        >
                          {tone}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Step 5: 비율 */}
            <div className={styles.wizardStep}>
              <button className={styles.wizardStepHeader} onClick={() => setExpandedStep(expandedStep === 5 ? 0 : 5)} type="button">
                <span className={completedSteps.has(5) ? styles.wizardStepDone : styles.wizardStepNumber}>{completedSteps.has(5) ? "✓" : "6"}</span>
                <span className={styles.wizardStepLabel}>
                  비율
                  <small> - {selectedRatio.label}</small>
                </span>
                <span className={styles.toggleChevron}>{expandedStep === 5 ? "접기" : "펼치기"}</span>
              </button>
              {expandedStep === 5 ? (
                <div className={styles.wizardStepBody}>
                  <div className={styles.ratioGrid}>
                    {RATIO_OPTIONS.map((option) => (
                      <button
                        className={option.value === aspectRatio ? styles.ratioButtonActive : styles.ratioButton}
                        key={option.value}
                        onClick={() => { setAspectRatio(option.value); goToStep(5, 0); }}
                        type="button"
                      >
                        <span className={styles.ratioIcon}>{renderRatioIcon(option.icon)}</span>
                        <strong>{option.label}</strong>
                        <small>{option.description}</small>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* 에러 표시 */}
            {errorMessage ? (
              <div className={styles.errorPanel}>
                <div className={styles.errorBanner}>
                  <AlertCircle size={16} />
                  {errorMessage}
                </div>
              </div>
            ) : null}

            {/* AI 분석 버튼 - 항상 표시 */}
            <button className={styles.primaryButtonWide} disabled={!canAnalyze} onClick={handleAnalyze} type="button" style={{ marginTop: 12 }}>
              <Wand2 size={16} />
              AI 분석 시작하기
            </button>
          </section>
          </div>
        ) : null}

        {appState === "processing" ? (
          <section className={styles.processingPanel}>
            <div className={styles.processingIcon}>
              <Loader2 className={styles.spinIcon} size={32} />
            </div>
            <div>
              <h2>AI가 상세페이지 구조를 만드는 중입니다</h2>
              <p>{loadingStep}</p>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} />
            </div>
          </section>
        ) : null}

      </section>

      <PdpSettingsSheet
        onOpenChange={setIsSettingsOpen}
        onSave={handleSaveSettings}
        open={isSettingsOpen}
        settings={clientSettings}
      />
    </main>
  );
}

function UploadDropzone({
  compact = false,
  description,
  hint,
  onSelect,
  selectedFileName,
  title
}: {
  compact?: boolean;
  description: string;
  hint: string;
  onSelect: (file: File) => Promise<void>;
  selectedFileName?: string;
  title: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      await onSelect(file);
    }
  };

  return (
    <>
      <input
        accept="image/*"
        className={styles.hiddenInput}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            await onSelect(file);
          }
          event.target.value = "";
        }}
        ref={inputRef}
        type="file"
      />

      <button
        className={`${compact ? styles.dropzoneCompact : ""} ${dragActive ? styles.dropzoneActive : styles.dropzone}`.trim()}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        type="button"
      >
        <div className={styles.dropzoneIcon}>
          <Upload size={24} />
        </div>
        <strong>{title}</strong>
        <p>{description}</p>
        <span className={styles.dropzoneHint}>{selectedFileName ? `선택됨: ${selectedFileName}` : hint}</span>
      </button>
    </>
  );
}

function renderRatioIcon(icon: "square" | "portrait" | "phone" | "landscape" | "wide") {
  if (icon === "square") {
    return <Square size={18} />;
  }
  if (icon === "portrait") {
    return <RectangleVertical size={18} />;
  }
  if (icon === "phone") {
    return <Smartphone size={18} />;
  }
  if (icon === "wide") {
    return <RectangleHorizontal size={18} style={{ transform: "scaleX(1.2)" }} />;
  }
  return <RectangleHorizontal size={18} />;
}

function createDefaultEditorDraftState(result: GeneratedResult): PdpEditorDraftState {
  return {
    currentSectionIndex: 0,
    sections: result.blueprint.sections.map((section) => ({ ...section })),
    sectionOptions: {},
    overlaysBySection: {},
    defaultCopyLanguage: "ko",
    notice: "섹션 컷을 고르고 텍스트를 배치한 뒤 바로 다운로드할 수 있습니다.",
    workbenchTab: "image",
    workbenchState: {
      x: 756,
      y: 24,
      width: 332,
      height: 500,
      isOpen: true
    }
  };
}

function formatSavedDraftDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "방금";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatCompactFileName(fileName: string, maxBaseLength = 30) {
  const trimmed = fileName.trim();
  if (!trimmed) {
    return fileName;
  }

  const lastDotIndex = trimmed.lastIndexOf(".");
  const hasExtension = lastDotIndex > 0 && lastDotIndex < trimmed.length - 1;
  const extension = hasExtension ? trimmed.slice(lastDotIndex) : "";
  const baseName = hasExtension ? trimmed.slice(0, lastDotIndex) : trimmed;

  if (baseName.length <= maxBaseLength) {
    return trimmed;
  }

  const leadingLength = Math.max(14, Math.floor(maxBaseLength * 0.58));
  const trailingLength = Math.max(8, maxBaseLength - leadingLength);
  return `${baseName.slice(0, leadingLength)}…${baseName.slice(-trailingLength)}${extension}`;
}
