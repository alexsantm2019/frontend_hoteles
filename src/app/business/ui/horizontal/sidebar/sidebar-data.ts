
import { NavItem } from '../sidebar/vertical/nav-item/nav-item';
import { NavMenuItems } from '../../../../core/menu/nav-menu-items';
import { NavMenuItemsTemplate } from '../../../../core/menu/nav-menu-items-template';
export const navItems: NavItem[] = [
  ...NavMenuItems,
  {
    navCap: 'Home',
  },
  ...NavMenuItemsTemplate,
];
