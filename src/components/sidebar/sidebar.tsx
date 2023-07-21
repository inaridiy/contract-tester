import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

export const Sidebar: React.FC<{ className: string }> = ({ className }) => {
  return (
    <div className={cn("overflow-y-auto flex flex-col p-2", className)}>
      <Button>Import</Button>
    </div>
  );
};
