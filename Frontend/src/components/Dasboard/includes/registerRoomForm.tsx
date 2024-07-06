import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { featureMapping, Room, RoomSchema } from '@/types/room.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { Features } from '@/types/room.type';
import { registerRoomPost } from '@/utils/Getter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type RegisterRoomModalProps = {
  isModalOpen?: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  rooms: Room[];
};

export default function RegisterRoomModal({
  setIsModalOpen,
  setRooms,
  rooms,
}: RegisterRoomModalProps) {
  const { toast } = useToast();
  const { hotelToken } = useAuth();
  const [n, setN] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const form = useForm<Room>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      roomNumber: 0,
      description: '',
      maxCapacity: 1,
      photos: [],
      features: {
        shower: false,
        bathroom: false,
        airConditioning: false,
        minibar: false,
        safeBox: false,
        tv: false,
        wifi: false,
        workDesk: false,
        hairDryer: false,
      },
      pricePerDay: 0,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const filePreviews = files.map(file => URL.createObjectURL(file));

    setValue('photos', [...(getValues('photos') || []), ...files]);
    setPreviews(prevPreviews => [...prevPreviews, ...filePreviews]);
  };

  const handleRemovePreview = (index: number) => {
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setValue(
      'photos',
      getValues('photos')?.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: Room) => {
    for (const room of rooms) {
      if (room.roomNumber === data.roomNumber) {
        toast({
          title: 'Erro ao adicionar quarto',
          description: 'Número de quarto já cadastrado',
        });
        return;
      }
    }
    const room = await registerRoomPost(data, hotelToken!);

    if (Array.isArray(room)) {
      room.forEach(error => {
        toast({
          title: error,
          variant: 'destructive',
        });
      });
      return;
    }
    setRooms(prevRooms => [...prevRooms, room]);
    setIsModalOpen(false);
  };

  const getGridCols = (length: number) => {
    if (length === 1) return 'grid-cols-1';
    if (length >= 2) return 'grid-cols-2';
    return 'grid-cols-4';
  };
  const handleFeatureChange = (feature: keyof typeof featureMapping) => {
    const currentFeatures = getValues('features');
    const updatedValue = !currentFeatures[feature];

    form.setValue('features', {
      ...currentFeatures,
      [feature]: updatedValue,
    });

    setN(n + 1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage + 1) % Math.ceil(previews.length / 4));
  };

  const handlePrevPage = () => {
    setCurrentPage(
      prevPage =>
        (prevPage - 1 + Math.ceil(previews.length / 4)) %
        Math.ceil(previews.length / 4)
    );
  };

  const getCurrentPagePreviews = () => {
    const start = currentPage * 4;
    const end = start + 4;
    return previews.slice(start, end);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-scroll">
      <div className="hidden">
        <div className="grid grid-cols-1"></div>
        <div className="grid grid-cols-2"></div>
        <div className="grid grid-cols-4"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full relative overflow-hidden"
      >
        <div className="bg-white p-6 w-3/5 mx-4 h-screen absolute left-1/2 -translate-x-1/2 overflow-y-scroll">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4">Adicionar Novo Quarto</h2>
            <button onClick={() => setIsModalOpen(false)}>X</button>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="photos"
                render={() => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <input
                        type="file"
                        name="photos"
                        multiple
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex justify-between items-center">
                {previews.length <= 4 ? null : (
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-800 duration-300 font-bold py-2 px-4 rounded-r ${
                      currentPage === 0 ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    <BiLeftArrowAlt />
                  </button>
                )}
                <div
                  className={`grid gap-4 ${getGridCols(
                    getCurrentPagePreviews().length
                  )}`}
                >
                  {getCurrentPagePreviews().map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`preview ${index}`}
                        className="w-full h-32 object-cover rounded-md shadow-md transition-transform duration-200 transform cursor-pointer"
                        onClick={() => setSelectedImage(preview)}
                      />
                      <button
                        onClick={() =>
                          handleRemovePreview(index + currentPage * 4)
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-center flex items-center justify-center"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                {previews.length <= 4 ? null : (
                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(previews.length / 4) - 1}
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-800 duration-300 font-bold py-2 px-4 rounded-r ${
                      currentPage >= Math.ceil(previews.length / 4) - 1
                        ? 'cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <BiRightArrowAlt />
                  </button>
                )}
              </div>
              <div className="mb-4 flex flex-col justify-center gap-2 border-gray-200 mt-10">
                <FormField
                  control={control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Quarto</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
                          onChange={e => {
                            form.setValue('roomNumber', Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 flex flex-col justify-center gap-2 border-gray-200">
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Descrição</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 flex flex-col justify-center gap-2 border-gray-200">
                <FormField
                  control={control}
                  name="maxCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade Máxima</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
                          required
                          onChange={e =>
                            setValue('maxCapacity', Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage>{errors.maxCapacity?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 flex flex-col justify-center gap-2 border-gray-200">
                <FormField
                  control={control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço por dia</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
                          required
                          onChange={e => {
                            form.setValue(
                              'pricePerDay',
                              Number(e.target.value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage>{errors.maxCapacity?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <p className="mb-2 font-medium text-black">Recursos:</p>
                <div className="grid grid-cols-3 flex-wrap gap-2">
                  {Object.entries(featureMapping).map(
                    ([key, { label, Icon }]) => {
                      return (
                        <label
                          key={key}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            name={key}
                            checked={
                              getValues('features')[key as keyof Features]
                            }
                            onChange={() =>
                              handleFeatureChange(key as keyof Features)
                            }
                            className="form-checkbox"
                          />
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-700">{label}</span>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
                >
                  Salvar
                </button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full Preview"
            className="w-1/2 h-auto"
          />
        </div>
      )}
    </div>
  );
}
