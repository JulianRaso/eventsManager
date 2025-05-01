export default function AddLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex justify-center md:items-center">
      <div className="border-2 w-11/12 md:w-8/12 lg:w-6/12 p-8 rounded-2xl bg-white shadow-lg h-fit">
        {children}
      </div>
    </div>
  );
}
