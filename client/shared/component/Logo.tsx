import { NavLink } from 'react-router-dom';
import { appName, defaultHome } from '../const';
import s from './Logo.module.css';

export function Logo({ isLink }: { isLink?: boolean }) {
  return isLink ? (
    <NavLink to={defaultHome} className={s.container}>
      <LogoContent />
    </NavLink>
  ) : (
    <div className={s.container}>
      <LogoContent />
    </div>
  );
}

function LogoContent() {
  return <img src="/asset/image/logo.png" width={100} alt="logo" title={appName} className={s.logo} />;
}
