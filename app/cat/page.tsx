// app/cat/page.tsx
import { loadAllCats } from "@/lib/catsLoader";
import CatPage from "@/app/cat/CatPage";

export default async function Page() {
  const cats = await loadAllCats();      // SSR + 파일 읽기
  return <CatPage cats={cats} />;  // CSR에 데이터 전달
}
