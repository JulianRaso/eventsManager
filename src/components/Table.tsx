export function Table({ children }: { children: React.ReactNode }) {
  return <table className="min-w-full border-collapse">{children}</table>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-100 w-full">
      <tr className="w-full">{children}</tr>
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
  return <tbody className={`${className} `}>{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="px-4 py-2 border-b text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
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
      className={`px-4 py-2 border-b text-center text-md text-gray-800 ${className}`}
    >
      {children}
    </td>
  );
}
