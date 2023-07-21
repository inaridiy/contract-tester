export const MainLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex h-[100svh] flex-col bg-background">
      <header className="border-b">
        <nav className="flex h-8 items-center px-4"></nav>
      </header>
      <main className="grid flex-1 grid-cols-6">{children}</main>
      <footer className="border-t">
        <nav className="flex h-8 items-center px-4"></nav>
      </footer>
    </div>
  );
};
