import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Assam Flood Information System',
  description: 'Administrative dashboard for managing flood updates and alerts',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
