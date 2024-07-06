// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { featureMapping, Room, RoomSchema } from '@/types/room.type';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion } from 'framer-motion';
// import { ChangeEvent, useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
// import { Features } from '@/types/room.type';
// import { updateRoom } from '@/utils/Getter';
// import { useAuth } from '@/context/AuthContext';

// type EditRoomModalProps = {
//   isModalOpen?: boolean;
//   setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   room: Room;
// };

// export default function EditRoomModal({
//   setIsModalOpen,
//   room,
// }: EditRoomModalProps) {
//   const { hotelToken } = useAuth();
//   const [previews, setPreviews] = useState<string[]>(room.photos || []);
//   const [currentPage, setCurrentPage] = useState<number>(0);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const form = useForm<Room>({
//     resolver: zodResolver(RoomSchema),
//     defaultValues: {
//       ...room,
//       features: {
//         ...room.features,
//       },
//     },
//   });

//   const {
//     control,
//     register,
//     handleSubmit,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = form;

//   useEffect(() => {
//     setPreviews(room.photos || []);
//   }, [room]);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const filePreviews = files.map(file => URL.createObjectURL(file));

//     setValue('photos', [...(getValues('photos') || []), ...files]);
//     setPreviews(prevPreviews => [...prevPreviews, ...filePreviews]);
//   };

//   const handleRemovePreview = (index: number) => {
//     setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
//     setValue(
//       'photos',
//       getValues('photos')?.filter((_, i) => i !== index)
//     );
//   };

//   const onSubmit = async (data: Room) => {
//     console.log(data);
//     const updatedRoom = await updateRoom(data, hotelToken!);
//     console.log(updatedRoom);
//     setIsModalOpen(false);
//   };

//   const getGridCols = (length: number) => {
//     if (length === 1) return 'grid-cols-1';
//     if (length >= 2) return 'grid-cols-2';
//     return 'grid-cols-4';
//   };

//   const handleFeatureChange = (feature: keyof typeof featureMapping) => {
//     const currentFeatures = getValues('features');
//     const updatedValue = !currentFeatures[feature];

//     form.setValue('features', {
//       ...currentFeatures,
//       [feature]: updatedValue,
//     });
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prevPage => (prevPage + 1) % Math.ceil(previews.length / 4));
//   };

//   const handlePrevPage = () => {
//     setCurrentPage(
//       prevPage =>
//         (prevPage - 1 + Math.ceil(previews.length / 4)) %
//         Math.ceil(previews.length / 4)
//     );
//   };

//   const getCurrentPagePreviews = () => {
//     const start = currentPage * 4;
//     const end = start + 4;
//     return previews.slice(start, end);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-scroll">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="w-full h-full relative overflow-hidden"
//       >
//         <div className="bg-white p-6 w-3/5 mx-4 h-screen absolute left-1/2 -translate-x-1/2">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold mb-4">Editar Quarto</h2>
//             <button onClick={() => setIsModalOpen(false)}>X</button>
//           </div>
//           <Form {...form}>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <FormField
//                 control={control}
//                 name="photos"
//                 render={() => (
//                   <FormItem>
//                     <FormLabel />
//                     <FormControl>
//                       <input
//                         type="file"
//                         name="photos"
//                         multiple
//                         onChange={handleInputChange}
//                         className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="mt-4 flex justify-between items-center">
//                 {previews.length <= 4 ? null : (
//                   <button
//                     type="button"
//                     onClick={handlePrevPage}
//                     disabled={currentPage === 0}
//                     className={`bg-gray-200 hover:bg-gray-300 text-gray-800 duration-300 font-bold py-2 px-4 rounded-r ${
//                       currentPage === 0 ? 'cursor-not-allowed' : ''
//                     }`}
//                   >
//                     <BiLeftArrowAlt />
//                   </button>
//                 )}
//                 <div
//                   className={`grid gap-4 ${getGridCols(
//                     getCurrentPagePreviews().length
//                   )}`}
//                 >
//                   {getCurrentPagePreviews().map((preview, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={preview}
//                         alt={`preview ${index}`}
//                         className="w-full h-32 object-cover rounded-md shadow-md transition-transform duration-200 transform cursor-pointer"
//                         onClick={() => setSelectedImage(preview)}
//                       />
//                       <button
//                         onClick={() =>
//                           handleRemovePreview(index + currentPage * 4)
//                         }
//                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-center flex items-center justify-center"
//                       >
//                         x
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 {previews.length <= 4 ? null : (
//                   <button
//                     type="button"
//                     onClick={handleNextPage}
//                     disabled={currentPage >= Math.ceil(previews.length / 4) - 1}
//                     className={`bg-gray-200 hover:bg-gray-300 text-gray-800 duration-300 font-bold py-2 px-4 rounded-r ${
//                       currentPage >= Math.ceil(previews.length / 4) - 1
//                         ? 'cursor-not-allowed'
//                         : ''
//                     }`}
//                   >
//                     <BiRightArrowAlt />
//                   </button>
//                 )}
//               </div>
//               <div className="mb-4 flex flex-col justify-center gap-2 border-gray-200 mt-10">
//                 <FormField
//                   control={control}
//                   name="roomNumber"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Número do Quarto</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           {...field}
//                           className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
//                           onChange={e => {
//                             form.setValue('roomNumber', Number(e.target.value));
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-4 flex flex-col justify-center gap-2 border-gray-200">
//                 <FormField
//                   control={control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel htmlFor="description">Descrição</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           {...field}
//                           className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-4 flex flex-col justify-center gap-2 border-gray-200">
//                 <FormField
//                   control={control}
//                   name="maxCapacity"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Capacidade Máxima</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           {...field}
//                           className="w-full border border-gray-200 px-3 py-2 rounded-md shadow"
//                           required
//                           onChange={e =>
//                             setValue('maxCapacity', Number(e.target.value))
//                           }
//                         />
//                       </FormControl>
//                       <FormMessage>{errors.maxCapacity?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mb-4 flex flex-col">
//                 <p className="mb-2 font-medium text-black">Recursos:</p>
//                 <div className="grid grid-cols-3 flex-wrap gap-2">
//                   {Object.entries(featureMapping).map(
//                     ([key, { label, Icon }]) => {
//                       return (
//                         <label
//                           key={key}
//                           className="flex items-center space-x-2 cursor-pointer"
//                         >
//                           <input
//                             type="checkbox"
//                             name={key}
//                             checked={
//                               getValues('features')[key as keyof Features]
//                             }
//                             onChange={() =>
//                               handleFeatureChange(key as keyof Features)
//                             }
//                             className="form-checkbox"
//                           />
//                           <span className="text-gray-900">{label}</span>
//                         </label>
//                       );
//                     }
//                   )}
//                 </div>
//               </div>
//               <div className="flex justify-end mt-6">
//                 <button
//                   type="submit"
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
//                 >
//                   Salvar Alterações
//                 </button>
//               </div>
//             </form>
//           </Form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
