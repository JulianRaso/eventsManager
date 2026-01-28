interface CategoryProps {
  children: React.ReactNode;
  title: string;
}

export default function CategoryLayout({ children, title }: CategoryProps) {
  return (
    <div className="flex w-full min-w-0 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
      <h1 className="mb-4 text-xl font-semibold tracking-tight lg:mb-5 lg:text-2xl">
        {title}
      </h1>
      <div className="flex w-full flex-col gap-4 lg:gap-5">{children}</div>
    </div>
  );
}
