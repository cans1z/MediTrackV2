import type { MedicationRequestDto, MedicationResponseDto } from '@/entities/medications/medication.dto';
import { BaseHttpClient } from '@/shared/http/axios';
import { APIResponse } from '@/shared/types';

class MedicationApi extends BaseHttpClient {
  public getMedicationById = async (id: number): APIResponse<MedicationResponseDto> => {
    const response = await this.get<MedicationResponseDto>(`/medications/${id}`);
    return response;
  };

  public getAllMedications = async (): APIResponse<MedicationResponseDto[]> => {
    const response = await this.get<MedicationResponseDto[]>('/medications');
    return response;
  };

  public createMedication = async (dto: MedicationRequestDto): APIResponse<MedicationResponseDto> => {
    const response = await this.post<MedicationResponseDto>('/medications', dto);
    return response;
  };

  public updateMedication = async (id: number, dto: MedicationRequestDto): APIResponse<MedicationResponseDto> => {
    const response = await this.put<MedicationResponseDto>(`/medications/${id}`, dto);
    return response;
  };

  public deleteMedication = async (id: string): Promise<void> => {
    await this.delete(`/medications/${id}`);
  }
} 

export const medicationApi = new MedicationApi();

