export default function Data({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-2 border-b text-md text-gray-800">{children}</td>
  );
}
