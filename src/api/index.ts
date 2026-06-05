import { BaseHttpClient } from "@/shared/http/axios";
import type { components } from "../../schema"; 

type Medication = components["schemas"]["MedicationDto"];

class ApiService extends BaseHttpClient {
  getMedications() {
    return this.get<Medication[]>("/api/medications");
  }

  // Метод для создания нового лекарства
  createMedication(data: Medication) {
    return this.post<Medication>("/api/medications", data);
  }
}

export const api = new ApiService();