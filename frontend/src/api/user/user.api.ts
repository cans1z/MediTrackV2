import { CreateUserDto, RegisterDto, UserResponseDto, UserRole } from '@/entities/user/user.dto';
import { BaseHttpClient } from '@/shared/http/axios';
import { APIResponse } from '@/shared/types';

class UserApi extends BaseHttpClient {
  // GET: api/user/{id}
  public getUserById = async (id: number): APIResponse<UserResponseDto> => {
    const response = await this.get<UserResponseDto>(`/user/${id}`);
    return response;
  };

  // GET: api/user
  public getAllUsers = async (): APIResponse<UserResponseDto[]> => {
    const response = await this.get<UserResponseDto[]>('/user'); 
    return response;
  };

  // POST: api/auth/register
  public register = async (dto: RegisterDto): APIResponse<UserResponseDto> => {
    const response = await this.post<UserResponseDto>('/auth/register', dto);
    return response;
  };

  // PUT: api/user/{id}/role
  public changeRole = async (id: number, role: string): Promise<void> => {
  await this.put(`/user/${id}/role`, JSON.stringify(role), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

  // PUT: api/user/{id}/ban
  public banUser = async (id: number): Promise<void> => {
    await this.put(`/user/${id}/ban`);
  };

  // DELETE: api/user/{id}
  public deleteUser = async (id: number): Promise<void> => {
    await this.delete(`/user/${id}`);
  };
} 

export const userApi = new UserApi();