export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 light:text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
