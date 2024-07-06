import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toLogin from '@/components/svg/toLogin.svg';
import { loginHotelPost } from '@/utils/Getter';
import { useToast } from './ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email({ message: 'Insira um email válido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type FormValues = {
  email: string;
  password: string;
};

type LoginHotelProps = {
  loginFunction: (data: FormValues) => Promise<string | string[]>;
  updateLogin: (token: string) => void;
  registerRedirect: string;
};

export default function Login({
  loginFunction,
  registerRedirect,
  updateLogin,
}: LoginHotelProps) {
  const navigate = useNavigate();
  const { updateHotelToken } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const token = await loginFunction(data);

    if (Array.isArray(token)) {
      token.forEach(error => {
        toast({
          title: error,
          variant: 'destructive',
        });
      });
      return;
    }

    updateLogin(token);
    toast({
      title: 'Logado com sucesso',
    });
    navigate('/');
  };

  return (
    <div className="grid grid-cols-2 items-center justify-center mx-auto mt-12 md:lg:py-0 justify-items-center divide overflow-hidden h-[80vh]">
      <Form {...form}>
        <form
          className="w-full bg-white rounded-lg dark:border m-8 md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg border-gray-200 border space-y-4 md:space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Faça login na sua conta
            </h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Seu email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      placeholder="nome@empresa.com"
                      {...field}
                      className={`bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      {...field}
                      className={`bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    Lembrar-me
                  </label>
                </div>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Button type="submit" className="w-full mt-4">
              Entrar
            </Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
              Ainda não tem uma conta?{' '}
              <a
                href={registerRedirect}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </form>
      </Form>
      <div className="w-full bg-white rounded-lg dark:border m-8 md:mt-0 sm:max-w-md xl:p-0">
        <img src={toLogin} alt="ToLogin" />
      </div>
    </div>
  );
}
