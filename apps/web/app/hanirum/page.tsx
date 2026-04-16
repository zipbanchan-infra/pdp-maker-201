import type { Metadata } from "next";
import { HanirumScreen } from "./HanirumScreen";

export const metadata: Metadata = {
  title: "집반찬연구소 QR 체크인",
  description: "QR 체크인과 캐릭터 로비 애니메이션이 결합된 집반찬연구소 행사 체크인 화면"
};

export default function HanirumPage() {
  return <HanirumScreen />;
}
