export default function Footer() {
  return (
    <footer className="w-full bg-background py-4 mt-8">
      <div className="max-w-6xl px-4 text-left text-sm text-muted-foreground flex flex-col md:flex-row justify-start items-center gap-1">
        <span>© {new Date().getFullYear()} Tim Teknologi Global.</span>
      </div>
    </footer>
  );
}
