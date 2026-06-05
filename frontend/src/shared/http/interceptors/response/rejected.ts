import type { AxiosError } from "axios";
import type { APIError } from "@/shared/types";
import { deleteCookie } from "cookies-next";

export const onRejected = (error: AxiosError<APIError>) => {
  if (error.response?.status === 401) {
    deleteCookie("access_token");
  }

  return Promise.reject(error);
};
