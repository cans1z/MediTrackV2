import { medicationApi } from './medications/medication.api';
import { authApi } from './auth/auth.api';
import { prescriptionApi } from './prescriptions/prescription.api';
import { intakeApi } from './intakes/intake.api';
import { userApi } from './user/user.api';

export const api = {medication: medicationApi, auth: authApi, prescription: prescriptionApi, intake: intakeApi, user: userApi};