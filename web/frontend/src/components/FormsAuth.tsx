import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "./LoadingButton";

const api = process.env.NEXT_PUBLIC_API_URL;

export function FormsAuth() {
  const router = useRouter(); 
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    login: { email: "", password: "" },
    signup: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const [isLoading, setIsLoading] = useState({
    login: false,
    signup: false
  });

  const handleInputChange = (
    tab: "login" | "signup", 
    field: string, 
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  const handleLoginSubmit = async () => {
    if (!formData.login.email || !formData.login.password) {
      toast({
        title: "Erro",
        description: "Por favor preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(prev => ({ ...prev, login: true }));
    try {
      const response = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.login)
      });

      const data = await response.json();  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);
        toast({
          title: "Sucesso",
          description: "Login feito com sucesso!",
          variant: "success"
        })
         router.push('/tweets');
      } else {
          toast({
            title: "Falha.",
            description: data.message,
            variant: "destructive"
          })
      }
    } catch (error) { 
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Algo de errado aconteceu. Por favor tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, login: false }));
    }
  };

  const handleSignupSubmit = async () => {
    if (!formData.signup.fullName || !formData.signup.email || !formData.signup.password || !formData.signup.confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(prev => ({ ...prev, signup: true }));
    try {
      const response = await fetch(api + '/auth/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.signup)
      });
      if (response.ok) {
        localStorage.setItem("email", formData.signup.email);
        router.push('/verify-email');
      } else {
        const data = await response.json();
        toast({
          title: "Falha.",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) { 
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Algo de errado aconteceu. Por favor tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, signup: false }));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Image
        src="/fake-news2.png"
        width={100}
        height={100}
        alt="Fake News free icon"
      />
      <Header
        title="#ÉFakeOuNão?"
        description="Site desenvolvido para classificar se o tweet é fake ou true news."
        showMenu={false}
      />

      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Digite seu email</Label>
                <Input
                  id="email"
                  value={formData.login.email}
                  onChange={(e) =>
                    handleInputChange("login", "email", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Digite sua senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.login.password}
                  onChange={(e) =>
                    handleInputChange("login", "password", e.target.value)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <LoadingButton
                isLoading={isLoading.login}
                text="Entrar"
                loadingText="Entrando..."
                onClick={handleLoginSubmit}
              />
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Criar conta</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="fullName">Digite seu nome</Label>
                <Input
                  id="fullName"
                  value={formData.signup.fullName}
                  onChange={(e) =>
                    handleInputChange("signup", "fullName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-email">Digite seu email</Label>
                <Input
                  id="signup-email"
                  value={formData.signup.email}
                  onChange={(e) =>
                    handleInputChange("signup", "email", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">Crie uma senha</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={formData.signup.password}
                  onChange={(e) =>
                    handleInputChange("signup", "password", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirme sua senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.signup.confirmPassword}
                  onChange={(e) =>
                    handleInputChange(
                      "signup",
                      "confirmPassword",
                      e.target.value
                    )
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <LoadingButton
                isLoading={isLoading.signup}
                text="Criar conta"
                loadingText="Criando conta..."
                onClick={handleSignupSubmit}
              />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
