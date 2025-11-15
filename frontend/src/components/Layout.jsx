import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-stone-900/40 via-emerald-950/30 to-stone-900/40 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;