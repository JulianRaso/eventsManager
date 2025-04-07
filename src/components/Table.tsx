export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="min-w-full border-collapse table-auto">{children}</table>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody>
      <tr className="hover:bg-gray-50">{children}</tr>
    </tbody>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-100">
      <tr>{children}</tr>
    </thead>
  );
}
