export interface UserResponseDto {
  id: number
  userName: string
  email: string
  role: UserRole
  isBanned: boolean
}

export interface CreateUserDto {
  userName: string
  email: string
  password: string
  role: UserRole
}

export interface RegisterDto {
  userName: string
  email: string
  password: string
}

export type UserRole = 
  | 'Administrator'
  | 'Doctor' 
  | 'Patient'