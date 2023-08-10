import axios from "axios";
import { Lora } from "./types";

export function isNodeEnvironment() {
  return typeof window === "undefined";
}

export function generateLoraString(params: Array<Lora> | undefined) {
  if (!Array.isArray(params) || params.length === 0) {
    return [];
  }
  return params.map((item) => {
    return `<lora:${item.sd_name}:${item.weight}>`;
  });
}

export function addLoraPrompt(array: string[], prompt: string) {
  if (!Array.isArray(array) || array.length === 0) {
    return prompt;
  }
  array.forEach((str) => {
    if (!prompt.includes(str)) {
      prompt = prompt + str;
    }
  });
  return prompt;
}

export function readImgtoBase64(url: string): Promise<string> {
  return axios.get(url, { responseType: "arraybuffer" }).then((response) => {
    if (isNodeEnvironment()) {
      const buffer = Buffer.from(response.data);
      return `data:${response.headers["content-type"]};base64,${buffer.toString(
        "base64"
      )}`;
    } else {
      // For browsers
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:${response.headers["content-type"]};base64,${base64}`;
    }
  });
}