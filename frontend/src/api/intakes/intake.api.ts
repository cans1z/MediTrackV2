import { IntakeRequestDto, IntakeResponseDto } from '@/entities/intakes/intake.dto';
import { BaseHttpClient } from '@/shared/http/axios';
import { APIResponse } from '@/shared/types';

class IntakeApi extends BaseHttpClient {
  public getIntakenById = async (id: number): APIResponse<IntakeResponseDto> => {
    const response = await this.get<IntakeResponseDto>(`/intakes/${id}`);
    return response;
  };

  public getAllIntakes = async (): APIResponse<IntakeResponseDto[]> => {
    const response = await this.get<IntakeResponseDto[]>('/intakes');
    return response;
  };

  public createIntake = async (dto: IntakeRequestDto): APIResponse<IntakeResponseDto> => {
    const response = await this.post<IntakeResponseDto>('/intakes', dto);
    return response;
  };

  public updateIntake = async (id: number, dto: IntakeRequestDto): APIResponse<IntakeResponseDto> => {
    const response = await this.put<IntakeResponseDto>(`/intakes/${id}`, dto);
    return response;
  };

  public deleteIntake = async (id: number): Promise<void> => {
    await this.delete(`/intakes/${id}`);
  }
} 

export const intakeApi = new IntakeApi();


