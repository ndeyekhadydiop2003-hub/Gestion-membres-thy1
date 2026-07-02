import Sidebar from './Sidebar';

export default function AppLayout({ pageActive, onNaviguer, children }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar pageActive={pageActive} onNaviguer={onNaviguer} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}