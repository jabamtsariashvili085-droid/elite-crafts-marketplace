import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import InstallPrompt from './InstallPrompt';
import StarfieldBackground from './StarfieldBackground';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarfieldBackground />
      <Header />
      <main className="flex-1 pt-16 md:pt-20 relative z-10">
        <Outlet />
      </main>
      <InstallPrompt />
      <Footer />
    </div>
  );
};

export default Layout;
