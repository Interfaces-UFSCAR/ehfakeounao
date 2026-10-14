import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/router';
import { useEffect } from "react";

const api = process.env.NEXT_PUBLIC_API_URL;

export default function ConfirmEmail() {
  const { toast } = useToast();
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) {
      toast({
        title: "Erro",
        description: "Link de confirmação de email inválido.",
        variant: "destructive",
      });
    }
  }, [token, router, toast]);

  const handleConfirmEmail = async () => {
    try {
      const response = await fetch(`${api}/auth/verifyEmail?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Email confirmado com sucesso!",
          variant: "success"
        });
        router.push('/');
      } else {
        const data = await response.json();
        toast({
          title: "Erro",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Algo de errado aconteceu. Por favor tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header
        title="#ÉFakeOuNão?"
        description="Site desenvolvido para classificar se o tweet é fake ou true news."
        showMenu={false}
      />
      <Card>
        <CardHeader>
          <CardTitle>Confirmação de Email</CardTitle>
          <CardDescription>Clique no botão abaixo para confirmar seu email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Button onClick={handleConfirmEmail}>
              Confirmar Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}