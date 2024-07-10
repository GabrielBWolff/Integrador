/* eslint-disable @typescript-eslint/no-explicit-any */
import { CEP } from '@/types/cep.type';
import { Hotel } from '@/types/hotel.type';
import { ReserveResponse } from '@/types/reserve.type';
import { ResponseProps } from '@/types/responses.type';
import { Room, RoomResponse } from '@/types/room.type';
import { User, UserResponse } from '@/types/user.type';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL as string;

function handleApiError(error: any): string[] {
  if (error.response && error.response.data) {
    const errorResponse: ResponseProps<unknown> = error.response.data;
    if (errorResponse.errors) {
      return errorResponse.errors.map(error => error.message);
    }
  }
  return [error.message || 'Erro desconhecido'];
}

export async function getCEP(cep: string) {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  if (response.status !== 200) throw new Error('CEP inválido');
  return response.data as CEP;
}

export async function registerHotelPost(data: Hotel) {
  try {
    const response = await axios.post(`${API_URL}/hotel`, data);
    const dataResponse: ResponseProps<string> = response.data;
    if (!dataResponse.data) throw new Error('Erro ao cadastrar hotel');
    return dataResponse.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function registerUserPost(data: User) {
  try {
    const response = await axios.post(`${API_URL}/user`, data);
    const dataResponse: ResponseProps<string> = response.data;
    if (!dataResponse.data) throw new Error('Erro ao cadastrar hotel');
    return dataResponse.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function registerRoomPost(data: Room, token: string) {
  try {
    const roomRegisterResponse = await axios.post(
      `${API_URL}/room`,
      { ...data },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const roomData: ResponseProps<RoomResponse> = roomRegisterResponse.data;
    const dataMulti = new FormData();
    dataMulti.append('roomId', roomData.data!.id);
    data.photos?.forEach(photo => dataMulti.append('images', photo));

    await axios.post(`${API_URL}/image/upload/room`, dataMulti, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data`,
        Authorization: token,
      },
    });

    return roomRegisterResponse as unknown as Room;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function validateTokenHotel(token: string) {
  try {
    const response = await axios.get(`${API_URL}/hotel`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    if (response.status !== 200) return false;
    return true;
  } catch (error: any) {
    return false;
  }
}

export async function getRoomsByParams(data: {
  destination: string;
  checkin: string;
  checkout: string;
}) {
  try {
    const response = await axios.post(`${API_URL}/room/search`, {
      ...data,
    });

    const responseData: ResponseProps<RoomResponse[]> = response.data;
    if (!responseData.data) throw new Error('Nenhum quarto encontrado');
    return responseData.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function changeReserveStatus(
  token: string,
  status: string,
  reserveId: number
) {
  try {
    const response = await axios.put(
      `${API_URL}/reserve/`,
      {
        status,
        reserveId,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status !== 200) return false;
    return true;
  } catch (error: any) {
    return false;
  }
}

export async function validateTokenClient(token: string) {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    const responseData: ResponseProps<UserResponse[]> = response.data;
    if (!responseData.data) throw new Error('Token inválido');
    return responseData.data[0]!;
  } catch (error: any) {
    console.log(error);
    return handleApiError(error);
  }
}

export async function loginHotelPost(data: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${API_URL}/hotel/login`, data);
    const responseData: ResponseProps<string> = response.data;
    return responseData.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function userReservePost(
  data: {
    name: string;
    email: string;
    checkin: string;
    checkout: string;
    roomId: string;
    userId: string;
  },
  token: string
) {
  try {
    const response = await axios.post(`${API_URL}/reserve`, data, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const responseData: ResponseProps<ReserveResponse> = response.data;
    if (!responseData.data) throw new Error('Erro ao reservar quarto');
    return responseData.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function getReservesUser(token: string) {
  try {
    const response = await axios.get(`${API_URL}/reserve/user`, {
      headers: {
        Authorization: token,
      },
    });
    const responseData: ResponseProps<ReserveResponse[]> = response.data;
    return responseData.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function getReservesHotel(token: string) {
  try {
    const response = await axios.get(`${API_URL}/reserve/`, {
      headers: {
        Authorization: token,
      },
    });
    const responseData: ResponseProps<ReserveResponse[]> = response.data;
    return responseData.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function loginUserPost(data: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/user/login`, data);
    const responseData: ResponseProps<string> = response.data;
    console.log(responseData);
    return responseData.data!;
  } catch (error: any) {
    console.log(error);
    return handleApiError(error);
  }
}

export async function setStatus(
  token: string,
  orderId: string,
  status: number
) {
  try {
    const response = await axios.post(
      `${API_URL}/orders/status`,
      {
        orderId: orderId,
        status: status,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status !== 200) return false;
    return true;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function getRooms(token: string): Promise<Room[] | string[]> {
  try {
    const response = await axios.get(`${API_URL}/room`, {
      headers: {
        Authorization: token,
      },
    });

    const responseData: ResponseProps<RoomResponse[]> = response.data;
    const rooms = responseData.data as unknown as Room[];
    return rooms;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function getAllRooms(): Promise<RoomResponse[] | string[]> {
  try {
    const response = await axios.get(`${API_URL}/room/all`);
    const responseData: ResponseProps<RoomResponse[]> = response.data;
    if (!responseData.data) throw new Error('Nenhum quarto encontrado');
    return responseData.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function deleteRoom(token: string, roomId: any) {
  try {
    const response = await axios.delete(`${API_URL}/room`, {
      headers: {
        Authorization: token,
      },
      data: {
        id: roomId,
      },
    });
    if (response.status !== 200) return false;
    return true;
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function getRoomById(
  roomId: string
): Promise<RoomResponse | string[]> {
  try {
    const response = await axios.get(`${API_URL}/room/${roomId}`);
    const responseData: ResponseProps<RoomResponse> = response.data;
    if (!responseData.data) throw new Error('Quarto não encontrado');
    return responseData.data!;
  } catch (error: any) {
    return handleApiError(error);
  }
}
