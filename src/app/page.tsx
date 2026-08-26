import NoticeBoard from "@/components/NoticeBoard";
import Passerby from "@/components/Passerby";
import WallBackground from "@/components/WallBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <WallBackground />
      <NoticeBoard />
      <Passerby />
    </main>
  );
}
