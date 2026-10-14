import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send } from "lucide-react";

export default function VerifyEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header
        title="#ÉFakeOuNão?"
        description="Site desenvolvido para classificar se o tweet é fake ou true news."
        showMenu={false}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Send size={44} color="#ffffff" />
            <CardTitle>Por favor, verifique seu email.</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Enviamos um email para {email} com um link de verificação. 
            Clique no link para verificar sua conta.
          </CardDescription>
        </CardContent>
        <CardFooter className="text-sm text-neutral-400">
          Verifique na caixa de entrada ou na pasta de spam.
        </CardFooter>
      </Card>
    </div>
  );
}