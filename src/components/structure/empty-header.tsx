interface EmptyHeaderProps {
  heading: string | React.ReactNode;
  text?: string;
  children?: React.ReactNode;
  className: string;
}

export function EmptyHeader({
  heading,
  text,
  children,
  className = "",
}: EmptyHeaderProps) {
  className = "flex items-center justify-between px-2 " + className;
  return (
    <div className={className}>
      <div className="grid gap-1">
        <h1 className="font-heading text-4xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
