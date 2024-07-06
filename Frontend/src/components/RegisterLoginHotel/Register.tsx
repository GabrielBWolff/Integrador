import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import toLogin from '@/components/svg/toLogin.svg';
import { Checkbox } from '../ui/checkbox';
import { featuresOptionsHotel, Hotelschema } from '@/types/hotel.type';
import { registerHotelPost } from '@/utils/Getter';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';

type FormValues = z.infer<typeof Hotelschema>;

const RegisterHotel: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateHotelToken, hotelToken } = useAuth();
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    cep: '',
    number: '',
    description: '',
    features: [],
    phone: '',
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(Hotelschema),
    defaultValues: formData,
  });

  const {
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: FormValues) => {
    const token = await registerHotelPost(data);

    if (Array.isArray(token)) {
      token.forEach(error => {
        toast({
          title: error,
          variant: 'destructive',
        });
      });
      return;
    }

    if (token) {
      updateHotelToken(token);
      toast({
        title: 'Cadastro realizado com sucesso',
      });
      navigate('/');
    }
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
                    <FormLabel htmlFor="name">Nome do Hotel:</FormLabel>
                    <Input
                      type="text"
                      id="name"
                      {...field}
                      placeholder="Nome do hotel"
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
            <div className="my-2">
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">Telefone:</FormLabel>
                    <Input
                      type="text"
                      id="phone"
                      {...field}
                      placeholder="99 9 9999-9999"
                    />
                    <FormMessage>{errors.phone?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="my-2 grid grid-cols-2 gap-2">
              <FormField
                control={control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">CEP:</FormLabel>
                    <Input
                      type="text"
                      id="address"
                      {...field}
                      placeholder="93542382"
                    />
                    <FormMessage>{errors.cep?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Número:</FormLabel>
                    <Input
                      type="text"
                      id="address"
                      {...field}
                      placeholder="12"
                    />
                    <FormMessage>{errors.number?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="my-2">
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Descrição:</FormLabel>
                    <Input
                      type="text"
                      id="description"
                      {...field}
                      placeholder="Descrição do Hotel"
                    />
                    <FormMessage>{errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem className="mt-4 w-fit">
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Features do Hotel
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {featuresOptionsHotel.map(feature => (
                        <FormField
                          key={feature.id}
                          control={form.control}
                          name="features"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={feature.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature.id)}
                                    onCheckedChange={checked => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            feature.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value: string) =>
                                                value !== feature.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {feature.key}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage className="pl-1" />
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

export default RegisterHotel;
