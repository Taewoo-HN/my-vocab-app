// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// 여기를 고치는 거야!
export const metadata: Metadata = {
  title: {
    template: "%s | HeNa's Vocab", // [동적 제목] 하위 페이지에서 제목을 정하면 뒤에 이게 붙어.
    default: "HeNa's Vocabulary Lab", // [기본 제목] 아무것도 안 정했을 때 뜨는 거.
  },
  description: "The smartest vocabulary app in the multiverse.", // 구글 검색 결과에 나오는 설명

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}