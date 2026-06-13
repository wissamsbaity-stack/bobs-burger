export function AdminHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-cream">{title}</h1>
      {description ? (
        <p className="mt-1 text-sm text-muted">{description}</p>
      ) : null}
    </div>
  );
}
