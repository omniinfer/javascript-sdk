import { OmniinferConfig } from "./types";
import axios from "axios";

export const Omniinfer_Config: OmniinferConfig = {
  BASE_URL: "https://api.omniinfer.io",
  key: undefined,
};

export const Omniinfer_axiosInstance = axios.create({
  baseURL: Omniinfer_Config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Omni-Source": "Omniinfer",
    ...(Omniinfer_Config.key ? { "X-Omni-Key": Omniinfer_Config.key } : {}),
  },
});

export const Set_Omniinfer_axiosInstance_Key = (key: string) => {
  Omniinfer_Config.key = key;
  Omniinfer_axiosInstance.defaults.headers["X-Omni-Key"] = key;
};
