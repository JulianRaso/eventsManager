interface CategoryProps {
  children: React.ReactNode;
  title: string;
}

export default function CategoryLayout({ children, title }: CategoryProps) {
  return (
    <div className="w-full h-full p-4">
      <div className="text-xl lg:text-2xl font-semibold mb-4">{title}</div>
      <div className="w-fit lg:w-full p-4 flex flex-col gap-2">{children}</div>
    </div>
  );
}
