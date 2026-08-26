import NoticeBoard from "@/components/NoticeBoard";
import WallBackground from "@/components/WallBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <WallBackground />
      <NoticeBoard />
    </main>
  );
}
