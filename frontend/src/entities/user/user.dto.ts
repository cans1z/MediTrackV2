export interface UserResponseDto {
  id: number
  userName: string
  email: string
  role: string
  isBanned: boolean
}

export interface CreateUserDto {
  userName: string
  email: string
  password: string
  role: string
}

export interface RegisterDto {
  userName: string
  email: string
  password: string
}