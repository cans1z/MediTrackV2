import { $api } from '@/api';
import type { LoginRequestDto, LoginResponseDto } from '@/entities/auth/auth.dto';

export const authApi = {
  login: async (dto: LoginRequestDto): Promise<LoginResponseDto> => {
    const response = await $api.post<LoginResponseDto>('/auth/login', dto);
    return response.data;
  },
};