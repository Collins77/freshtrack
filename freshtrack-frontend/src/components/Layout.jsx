import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;