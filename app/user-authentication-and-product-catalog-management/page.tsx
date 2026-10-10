import { Metadata } from 'next';
import { UserAuthenticationAndProductCatalogManagementView } from '@/src/components/user-authentication-and-product-catalog-management/user-authentication-and-product-catalog-management-view';

export const metadata: Metadata = {
  title: 'Katalog Produk & Autentikasi | UrbanStyle Store LifeWear',
  description: 'Manajemen katalog produk multi-varian, stok master, dan autentikasi pengguna Uniqlo-Style.',
};

export default function UserAuthenticationAndProductCatalogManagementPage() {
  return <UserAuthenticationAndProductCatalogManagementView />;
}
