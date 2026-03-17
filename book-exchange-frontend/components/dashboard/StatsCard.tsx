type StatsCardProps = {
  title: string;
  value: number;
};

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}
