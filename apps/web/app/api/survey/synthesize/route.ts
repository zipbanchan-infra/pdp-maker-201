import { synthesize } from "../../../../lib/shared/survey";
import type { SurveyAnswers } from "../../../../lib/shared/survey";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SurveyAnswers>;

    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "유효한 JSON 본문이 아닙니다." }, { status: 400 });
    }

    if (!body.channel) {
      return Response.json({ ok: false, error: "channel 필드는 필수입니다." }, { status: 400 });
    }

    const payload = synthesize(body as SurveyAnswers);

    return Response.json({
      ok: true,
      payload,
      meta: {
        requestTextLength: payload.requestText.length,
        rolloutRequestLength: payload.rolloutRequest.length,
        knowledgeTextLength: payload.knowledgeText.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
