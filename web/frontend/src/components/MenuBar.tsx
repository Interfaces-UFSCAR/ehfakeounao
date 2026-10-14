import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"

import { useRouter } from 'next/router'; 

export interface MenuBarProps {
    username: string
}

export function MenuBar({ username }: MenuBarProps) {
    const router = useRouter();

    const handleProfileClick = () => {
        router.push('/perfil');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        router.push('/');
    };

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>{username}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={handleProfileClick}>
                        Perfil
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={handleLogout}>
                        Sair
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
