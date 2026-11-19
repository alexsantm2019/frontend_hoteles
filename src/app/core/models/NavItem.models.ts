export interface NavItem {
  navCap?: string;
  displayName: string;
  iconName: string;
  bgcolor?: string;
  route?: string;
  children?: NavItem[];
  // permission?: string;
  permission?: 'superadmin' | 'admin_empresa' | 'usuario';
  isVisible?: boolean;
  ddType?: string;
  badge?: {
    text: string;
    color: string;
  };
}
