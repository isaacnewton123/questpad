export function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh">
      <div className="bg-animated" />
      <div className="w-10 h-10 rounded-full border-3 border-slate-200
        border-t-blue-500 animate-spin" />
    </div>
  );
}

export function NotFoundView() {
  return (
    <div className="p-8 text-center">
      <div className="bg-animated" />
      <p className="text-slate-500">Campaign not found.</p>
    </div>
  );
}
