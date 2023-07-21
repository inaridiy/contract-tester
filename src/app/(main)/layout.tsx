import { MainLayout } from "@/components/layout/main-layout";

export default function MainRootLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
