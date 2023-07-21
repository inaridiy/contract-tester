import { cn } from "@/lib/utils";

export const Result: React.FC<{ className: string }> = ({ className }) => {
  return <div className={cn("overflow-y-auto", className)}></div>;
};
