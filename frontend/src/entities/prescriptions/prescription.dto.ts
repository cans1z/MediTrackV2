export type Frequency = 
  | 'OnceADay'
  | 'TwiceADay' 
  | 'ThriceADay'
  | 'EveryOtherDay'
  | 'Weekly'

export interface PrescriptionRequestDto {
  dosage: string;
  frequency: Frequency; 
  startDate: string; 
  period: number;
  isFlexible: boolean;
  comment: string;
  patientId: number;
  medicationId: number;
}

export interface PrescriptionResponseDto {
  id: number;
  dosage: string;
  frequency: Frequency; 
  startDate: string; 
  period: number;
  isFlexible: boolean;
  comment: string;
  patientName: string;
  medicationName: string;
  doctorName: string;
}

export interface UpdatePrescriptionDto {
  dosage: string
  frequency: Frequency
  startDate: string
  period: number
  isFlexible: boolean
  comment: string
}


