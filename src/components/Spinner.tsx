export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="border-6 border-t-6 border-gray-200 border-t-gray-800 rounded-full w-24 h-24 animate-spin"></div>
    </div>
  );
}
