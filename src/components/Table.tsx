export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="min-w-full border-collapse text-sm">
      {children}
    </table>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-muted/60">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/30">
      {children}
    </tr>
  );
}

export function TableData({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`px-3 py-3 text-center text-foreground align-middle ${className}`}
    >
      {children}
    </td>
  );
}

export function TableHeaderData({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 py-3 text-center text-sm font-medium text-foreground align-middle ${className}`}
    >
      {children}
    </th>
  );
}

export function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <div className="inline-block min-w-full align-middle">
        {children}
      </div>
    </div>
  );
}
