import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().nonempty({ message: 'O nome é obrigatório.' }),
  email: z
    .string()
    .email({ message: 'Formato de e-mail inválido.' })
    .nonempty({ message: 'O e-mail é obrigatório.' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    .regex(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula.',
    })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
    .nonempty({ message: 'A senha é obrigatória.' }),
});

export type User = z.infer<typeof UserSchema>;

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  password: string;
  isOwner: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export { UserSchema };
