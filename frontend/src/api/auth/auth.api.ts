import type { LoginRequestDto, LoginResponseDto, User } from '@/entities/auth/auth.dto';
import { BaseHttpClient } from '@/shared/http/axios';
import { APIResponse } from '@/shared/types';

class AuthApi extends BaseHttpClient {
  public login =  async (dto: LoginRequestDto): APIResponse<LoginResponseDto> => {
    const response = await this.post<LoginResponseDto>('/auth/login', dto);
    return response;
  };

  public getMe = async (): APIResponse<User> => {
  const response = await this.get<User>('/user/me')
  return response;
  } 
};

export const authApi = new AuthApi();