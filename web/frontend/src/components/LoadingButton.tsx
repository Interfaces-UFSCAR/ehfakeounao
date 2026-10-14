import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";

interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
  onClick?: () => void;
}

export function LoadingButton({ 
  isLoading, 
  text, 
  loadingText, 
  onClick 
}: LoadingButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <ProgressBar progress={66} />
          {loadingText}
        </div>
      ) : (
        text
      )}
    </Button>
  );
}