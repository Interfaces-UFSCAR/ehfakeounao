import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  
  export function LearnMore() {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Saiba Mais</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
          <div className="flex justify-between items-center">
        <AlertDialogTitle>Sobre o site</AlertDialogTitle>
          <AlertDialogAction>X</AlertDialogAction>
        </div>
            <AlertDialogDescription>
            <p>
                Nosso sistema web foi desenvolvido para combater a disseminação de desinformação durante as eleições, classificando tweets como verdadeiros ou falsos. 
                Focado na eleição presidencial do Brasil de 2022, a plataforma utiliza aprendizado de máquina, especificamente técnicas de aprendizado fraco, para identificar fake news no Twitter/X. 
                </p>
            <p>
                Especialistas desempenham um papel crucial ao verificar tweets com baixa precisão de classificação, garantindo o refinamento contínuo do modelo. 
             </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  