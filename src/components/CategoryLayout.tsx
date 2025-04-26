interface CategoryProps {
  children: React.ReactNode;
  title: string;
}

export default function CategoryLayout({ children, title }: CategoryProps) {
  return (
    <div className="w-full h-full p-4">
      <div className="text-xl lg:text-2xl font-semibold">{title}</div>
      <div className="w-full flex flex-col gap-1">{children}</div>
    </div>
  );
}
