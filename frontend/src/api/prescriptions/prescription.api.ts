import type { PrescriptionRequestDto, PrescriptionResponseDto, UpdatePrescriptionDto } from '@/entities/prescriptions/prescription.dto';
import { BaseHttpClient } from '@/shared/http/axios';
import { APIResponse } from '@/shared/types';

class PrescriptionApi extends BaseHttpClient {
  public getPrescriptionById = async (id: number): APIResponse<PrescriptionResponseDto> => {
    const response = await this.get<PrescriptionResponseDto>(`/prescriptions/${id}`);
    return response;
  };

  public getAllPrescriptions = async (): APIResponse<PrescriptionResponseDto[]> => {
    const response = await this.get<PrescriptionResponseDto[]>('/prescriptions');
    return response;
  };

  public createPrescription = async (dto: PrescriptionRequestDto): APIResponse<PrescriptionResponseDto> => {
    const response = await this.post<PrescriptionResponseDto>('/prescriptions', dto);
    return response;
  };

  public updatePrescription = async (id: number, dto: UpdatePrescriptionDto): APIResponse<PrescriptionResponseDto> => {
    const response = await this.put<PrescriptionResponseDto>(`/prescriptions/${id}`, dto);
    return response;
  };

  public deletePrescription = async (id: number): Promise<void> => {
    await this.delete(`/prescriptions/${id}`);
  }
} 

export const prescriptionApi = new PrescriptionApi();