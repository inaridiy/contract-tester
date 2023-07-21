import { cn } from "@/lib/utils";

export const Editor: React.FC<{ className: string }> = ({ className }) => {
  return <div className={cn("overflow-y-auto", className)}></div>;
};
