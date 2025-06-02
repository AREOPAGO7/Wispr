import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type User } from '@/types';
import { Link } from '@inertiajs/react';
import { Compass, ArrowDownUp, Handshake, MessageSquareText } from 'lucide-react';
import AppLogo from './app-logo';

interface AppSidebarProps {
    user?: User;
}

const mainNavItems: NavItem[] = [
    {
        title: 'Explore ',
        href: '/home',
        icon: Compass,
    },
    {
        title: 'Deals',
        href: '/deals',
        icon: Handshake,
    },
    {
        title: 'My Swaps',
        href: '/my-swaps',
        icon: ArrowDownUp,
    }
];

const footerNavItems: NavItem[] = [
    // {
    //     title: '',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: '',
    //     href: '',
    //     icon: BookOpen,
    // },
];

export function AppSidebar({ user }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/home" >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
