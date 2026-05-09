"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { CreditCard, LogOut, Plus, Settings, User, LayoutDashboard, Shield } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, usePathname } from "@/navigation"
import { createClient } from "@/lib/supabase/client";

interface UserNavProps {
  user?: any; // 可选，如果不提供则自己获取
}

export function UserNav({ user: userProp }: UserNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(userProp || null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 初始化 Supabase 客户端
  const supabase = useMemo(() => createClient(), []);

  // 如果没有提供 user prop，则自己获取用户信息（用于 dashboard 内部）
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const authUser = userProp ? userProp : (await supabase.auth.getUser()).data.user;
        
        if (authUser) {
          setUser(authUser);
          
          // 获取用户角色信息
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authUser.id)
            .single();
          
          if (error) {
            console.warn("Failed to fetch user role:", error);
            setUserRole('member'); // 默认为 member
          } else {
            setUserRole(profile?.role || 'member');
          }
        }
      } catch (error) {
        console.error("Failed to get user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userProp, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/"); // 登出后跳转到主页
  };


  
  // 提取用户首字母用于头像 Fallback
  const initials = user?.email?.slice(0, 2).toUpperCase() || "ME";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/avatars/01.png"} alt="@shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "mota@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Dashboard - 仅在非 dashboard 页面显示 */}
          {!pathname.startsWith('/dashboard') && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard`} className="flex w-full items-center cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Back Office - 仅限 admin 和 staff 用户，且不在 admin 页面时显示 */}
        {(userRole === 'admin' || userRole === 'staff') && !pathname.startsWith('/admin') && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/admin`} className="flex w-full items-center cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Back Office</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
          {/* 🟢 使用 asChild 将 Link 的行为赋给父级 MenuItem，同时保持 UI 样式 */}
          <Link href={`/dashboard/profile`} className="flex w-full items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/settings`} className="flex w-full items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </Link>          
        </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          <span>New Team</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}