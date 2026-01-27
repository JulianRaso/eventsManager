export default function AddLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
        {children}
      </div>
    </div>
  );
}
