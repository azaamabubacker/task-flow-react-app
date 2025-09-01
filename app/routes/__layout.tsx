import { Outlet } from 'react-router';
import Navbar from '~/components/Navbar';
import SideBar from '~/components/Sidebar';

export default function RootLayout() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div>
        <SideBar />
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
