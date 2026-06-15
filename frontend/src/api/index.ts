import { BaseHttpClient } from '@/shared/http/axios';

// Создаем единственный экземпляр клиента для всего приложения
const httpClient = new BaseHttpClient();

// Экспортируем именно свойство http (инстанс axios)
export const $api = httpClient.http;