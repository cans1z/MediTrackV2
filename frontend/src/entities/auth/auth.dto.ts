export interface LoginRequestDto {
  userName: string;
  password: string;
}

export type LoginResponseDto = string;

export interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
}