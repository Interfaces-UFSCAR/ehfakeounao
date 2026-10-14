import { MenuBar } from "./MenuBar";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

const api = process.env.NEXT_PUBLIC_API_URL;

export interface HeaderProps {
  title?: string,
  description?: string;
  showMenu: boolean;
  showBackButton?: boolean;
}

export function Header({ title, description, showMenu = false, showBackButton = false }: HeaderProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        
        if (!token || !userId) {
          return;
        }

        const response = await fetch(`${api}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const firstName = userData.fullName.split(" ")[0];
          setUsername(firstName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="w-full">
      <div className="flex items-center justify-between">
        {showBackButton && (
          <Button 
            variant="ghost" 
            onClick={() => router.push('/tweets')}
            className="px-2 sm:px-4 sm:mr-4"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
        )}
        <h1 className="text-center flex-1 scroll-m-20 text-2xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
        {showMenu && <MenuBar username={username || "Usuário"}/>}
      </div>
      <p className="text-center text-neutral-500 leading-7 [&:not(:first-child)]:mt-6 mb-4">
        {description}
      </p>
    </header>
  )
};

