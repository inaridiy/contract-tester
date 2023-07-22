import { Editor } from "@/components/editor";
import { Result } from "@/components/result";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  return (
    <>
      <Sidebar className="col-span-1 h-full border-r" />
      <Editor className="col-span-2 h-full border-r" />
      <Result className="col-span-2 h-full" />
    </>
  );
}
