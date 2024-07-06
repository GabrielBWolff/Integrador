import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import toLogin from '@/components/svg/toLogin.svg';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { UserSchema } from '@/types/user.type';
import { registerUserPost } from '@/utils/Getter';
import { useAuth } from '@/context/AuthContext';

type FormValues = z.infer<typeof UserSchema>;

const RegisterUser: React.FC = () => {
  const { setClientToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const {
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: FormValues) => {
    const token = await registerUserPost(data);
    if (Array.isArray(token)) {
      token.forEach(error => {
        toast({
          title: error,
          variant: 'destructive',
        });
      });
      return;
    }

    toast({
      title: 'Cadastro realizado com sucesso!',
    });
    setClientToken(token);
    navigate('/');
  };

  return (
    <div className="grid grid-cols-2 items-center justify-center mx-auto mt-12 md:lg:py-0 justify-items-center divide overflow-hidden">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full bg-white rounded-lg dark:border m-8 md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg border-gray-200 border space-y-4 md:space-y-6"
        >
          <div className="p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Cadastre-se como hotel
            </h1>

            <div className="my-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nome:</FormLabel>
                    <Input
                      type="text"
                      id="name"
                      {...field}
                      placeholder="Nome"
                    />
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="my-2">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email:</FormLabel>
                    <Input
                      type="email"
                      id="email"
                      {...field}
                      placeholder="email@email.com"
                    />
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="my-2">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Senha:</FormLabel>
                    <Input
                      type="password"
                      id="password"
                      {...field}
                      placeholder="********"
                    />
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Cadastrar
            </Button>
          </div>
        </form>
      </Form>

      <div className="w-full bg-white rounded-lg dark:border m-8 md:mt-0 sm:max-w-md xl:p-0">
        <img src={toLogin} alt="ToLogin" />
      </div>
    </div>
  );
};

export default RegisterUser;
