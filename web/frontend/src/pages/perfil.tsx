import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const api = process.env.NEXT_PUBLIC_API_URL;
interface User {
  fullName: string;
  email: string;
}

interface UserFormData extends User {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        if (!token || !userId) {
          throw new Error("No token or user ID found");
        }
        const response = await fetch(`${api}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: User = await response.json();
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não conferem.",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      if (!token || !userId) {
        throw new Error("No token or user ID found");
      }

      const updateData: Partial<UserFormData> = {
        fullName: formData.fullName,
        email: formData.email
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`${api}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar perfil. Tente novamente mais tarde.");
      }

      setUser({
        fullName: formData.fullName,
        email: formData.email
      });
      
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar perfil. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Header title="#ÉFakeOuNão?" showMenu={true} showBackButton={true} />
        <div className="flex justify-center items-center h-[50vh]">
          <div className="flex justify-center items-center h-24">
      <Progress value={33} />
    </div>; 
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Header title="#ÉFakeOuNão?" showMenu={true} showBackButton={true}/>
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nome completo
                </label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {isEditing && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">
                      Senha atual
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">
                      Nova senha
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirme a nova senha
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-4">
                {!isEditing ? (
                  <Button type="button" onClick={handleEditClick}>
                    Editar perfil
                  </Button>
                ) : (
                  <>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        ...user!,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Salvar mudanças
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 

export default Profile;