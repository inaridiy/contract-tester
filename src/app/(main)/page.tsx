import { Editor } from "@/components/editor/editor";
import { Result } from "@/components/editor/result";
import { Sidebar } from "@/components/sidebar/sidebar";

export default function Home() {
  return (
    <>
      <Sidebar className="col-span-1 h-full border-r" />
      <Editor className="col-span-4 h-full border-r" />
      <Result className="col-span-1 h-full" />
    </>
  );
}
