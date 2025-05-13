export function PipelineGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`grid grid-cols-4 gap-4 no-scrollbar ${className}`}>
      {children}
    </div>
  );
}
