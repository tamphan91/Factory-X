import { Card } from "@/components/ui/card";

export function KpiCardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card
      className="
      h-[150px]
      rounded-xl
      border
      bg-white
      shadow-sm
      p-2
      gap-2
      justify-between
      "
    >
      {children}
    </Card>
  );
}