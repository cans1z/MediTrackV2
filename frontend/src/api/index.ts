import { medicationApi } from './medications/medication.api';
import { authApi } from './auth/auth.api';

export const api = {medication: medicationApi, auth: authApi};