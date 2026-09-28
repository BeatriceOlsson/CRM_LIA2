export function ErrorHandler({ error, className }) {
  if (!error) return null;

  if (typeof error === "object") {
    return <p>{error.message}</p>;
  }

  return (
    <div
      className={`flex items-center justify-center text-lg text-red-700 font-medium ${className}`}
    >
      <p>{error}</p>
    </div>
  );
}
