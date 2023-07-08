import { TabsDemo } from "@/components/component";
import { WindowApplication } from "@/components/window/window-application";
import { WindowContainer } from "@/components/window/window-container";

export default function Home() {
  return (
    <>
      <WindowContainer className="h-[100svh] w-full">
        <WindowApplication windowKey="demo-tab" name="Tabs Demo">
          <TabsDemo />
        </WindowApplication>
        <WindowApplication windowKey="demo-tab2" name="Tabs Demo2">
          <TabsDemo />
        </WindowApplication>

        <WindowApplication windowKey="demo-tab3" name="Tabs Demo3">
          <TabsDemo />
        </WindowApplication>

        <WindowApplication windowKey="demo-tab4" name="Tabs Demo4">
          <TabsDemo />
        </WindowApplication>
      </WindowContainer>
    </>
  );
}
