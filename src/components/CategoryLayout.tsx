interface CategoryProps {
  children: React.ReactNode;
  title: string;
}

export default function CategoryLayout({ children, title }: CategoryProps) {
  return (
    <div className="p-8 w-full h-full">
      <div className="text-xl font-semibold mb-4">{title}</div>
      <div className=" overflow-x-auto">{children}</div>
    </div>
  );
}
