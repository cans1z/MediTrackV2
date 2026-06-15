import { $api } from '@/api'; 
import type { MedicationRequestDto, MedicationResponseDto } from '@/entities/medications/medication.dto';

export const medicationApi = {
  getById: async (id: number): Promise<MedicationResponseDto> => {
    const response = await $api.get<MedicationResponseDto>(`/medications/${id}`);
    return response.data;
  },

  getAll: async (): Promise<MedicationResponseDto[]> => {
    const response = await $api.get<MedicationResponseDto[]>('/medications');
    return response.data;
  },

  create: async (dto: MedicationRequestDto): Promise<MedicationResponseDto> => {
    const response = await $api.post<MedicationResponseDto>('/medications', dto);
    return response.data;
  },

  update: async (id: number, dto: MedicationRequestDto): Promise<MedicationResponseDto> => {
    const response = await $api.put<MedicationResponseDto>(`/medications/${id}`, dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await $api.delete<void>(`/medications/${id}`);
  },
};