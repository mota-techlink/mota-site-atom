import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import PageWrapper from "@/components/layout/page-wrapper";
import { adminNavItems } from "@/config/menu"; // 👈 使用管理员菜单
import { UserNav } from "@/components/sections/user-nav";
import { requireAdmin } from "@/lib/auth/admin"; // 👈 引入鉴权函数
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { GlobalToggles } from '@/components/global-toggles';
import { AdminBreadcrumb } from "@/components/admin-breadcrumb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔒 核心：在此处拦截，如果不通过，直接在服务端重定向
  // 允许 staff 和 admin 用户访问
  await requireAdmin('staff');
  
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
          
          {/* 传入 Admin 菜单，标题改为 Admin Console */}
          <Sidebar items={adminNavItems} title="Admin Console" />

          <PageWrapper>
            <header className="mb-6 flex items-center justify-between gap-6">
               <div className="flex items-center gap-6 flex-1">
                  {/* Breadcrumb 导航 */}
                  <AdminBreadcrumb />                  
               </div>
               <div className="flex items-center gap-4">  
                  <GlobalToggles position="inline" />
                  <UserNav />
               </div>
            </header>
            <div className="flex-1 p-4 md:p-6">
               {children}
            </div>
          </PageWrapper>

        </div>
      </SidebarProvider>
    </NextIntlClientProvider>
  );
}