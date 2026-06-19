export interface IntakeRequestDto {
  scheduledAt: string
  takenAt: string | null  // nullable — может не принял ещё
  comment: string
  prescriptionId: number
}

export interface IntakeResponseDto {
  id: number
  scheduledAt: string
  takenAt: string | null
  isTaken: boolean
  comment: string
  medicationName: string
  doctorName: string
}