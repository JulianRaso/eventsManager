export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse ">{children}</table>
    </div>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody>
      <tr className="hover:bg-gray-50">{children}</tr>
    </tbody>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
      {children}
    </th>
  );
}

export function TableData({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-2 border-b text-md text-gray-800">{children}</td>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-100">
      <tr>{children}</tr>
    </thead>
  );
}
