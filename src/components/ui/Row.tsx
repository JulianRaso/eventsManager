export default function Row({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
      {children}
    </th>
  );
}
