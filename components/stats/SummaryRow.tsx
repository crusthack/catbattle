import Card from "@/components/ui/card";

export default function SummaryRow({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {items.map((it) => (
        <Card key={it.label} className="p-4">
          <div className="text-sm text-gray-600 mb-1">{it.label}</div>
          <div className="text-2xl font-semibold text-orange-500">{it.value}</div>
        </Card>
      ))}
    </div>
  );
}
