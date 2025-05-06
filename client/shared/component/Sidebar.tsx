import { BookOpenIcon, HomeIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { defaultHome } from '../const';
import { Logo } from './Logo';
import s from './Sidebar.module.css';

function SidebarItem({ to, children, icon, from }: NavItem & { from: string }) {
  return (
    <li className={s.item}>
      <NavLink
        to={to}
        aria-label={children}
        className={({ isActive, isPending, isTransitioning }) =>
          [
            isPending ? s.pending : '',
            isActive ? s.active : '',
            isTransitioning ? s.transitioning : '',
            s.itemLink,
          ].join(' ')
        }
      >
        {icon}
        <span className={s.itemLabel}>{children}</span>
      </NavLink>
    </li>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <nav className={s.container}>
      <ul className={s.ul}>
        <li className={`${s.item} ${s.itemLogo}`}>
          <Logo isLink />
        </li>
        <SidebarItem to={defaultHome} icon={<HomeIcon />} from={pathname}>
          Home
        </SidebarItem>
        <SidebarItem to="/report" icon={<BookOpenIcon />} from={pathname}>
          Report
        </SidebarItem>
      </ul>
    </nav>
  );
}

interface NavItem {
  readonly to: string;
  readonly children?: string;
  readonly icon: ReactNode;
}
