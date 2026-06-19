import { CreateUserDto, RegisterDto, UserResponseDto } from '@/entities/user/user.dto';
import { BaseHttpClient } from '@/shared/http/axios';
import { APIResponse } from '@/shared/types';

class UserApi extends BaseHttpClient {
  public getUserById = async (id: number): APIResponse<UserResponseDto> => {
    const response = await this.get<UserResponseDto>(`/users/${id}`);
    return response;
  };

  public getAllUsers = async (): APIResponse<UserResponseDto[]> => {
    const response = await this.get<UserResponseDto[]>('/users');
    return response;
  };

  public register = async (dto: RegisterDto): APIResponse<UserResponseDto> => {
  const response = await this.post<UserResponseDto>('/auth/register', dto);
  return response;
}

  public changeRole = async (id: number, role: string): Promise<void> => {
    await this.put(`/users/${id}/role`, { role });
  }

  public banUser = async (id: number): Promise<void> => {
    await this.put(`/users/${id}/ban`);
  }
  public deleteUser = async (id: number): Promise<void> => {
    await this.delete(`/users/${id}`);
  }
} 

export const userApi = new UserApi();