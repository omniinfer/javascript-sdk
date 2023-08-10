import axios from "axios";
import { ERROR_GENERATE_IMG_FAILED } from "./enum";
import {
  GetModelsResponse,
  Img2imgRequest,
  OmniinferConfig,
  ProgressRequest,
  ProgressResponse,
  RequestCode,
  SyncConfig,
  Txt2ImgRequest,
  Txt2ImgResponse,
  UpscaleResponse,
  UpscalseRequest,
} from "./types";
import { addLoraPrompt, generateLoraString, readImgtoBase64 } from "./util";

const Omniinfer_Config: OmniinferConfig = {
  BASE_URL: "https://api.omniinfer.io",
  key: undefined,
};

export function setOmniinferKey(key: string) {
  Omniinfer_Config.key = key;
}

export function httpFetch({
  url = "",
  method = "GET",
  data = undefined,
  query = undefined,
}: {
  url: string;
  method?: string;
  data?: Record<string, any> | undefined;
  query?: Record<string, any> | undefined;
}) {
  let fetchUrl = Omniinfer_Config.BASE_URL + url;

  if (query) {
    fetchUrl += "?" + new URLSearchParams(query).toString();
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Omni-Source": "Omniinfer",
    ...(Omniinfer_Config.key ? { "X-Omni-Key": Omniinfer_Config.key } : {}),
  };

  return axios({
    url: fetchUrl,
    method: method,
    headers: headers,
    data: data,
    params: query,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error.response ? error.response.data : error.message);
    });
}

export function getModels() {
  return httpFetch({
    url: "/v2/models",
  }).then((res: GetModelsResponse) => {
    if (res.code !== RequestCode.SUCCESS) {
      throw new Error(res.msg);
    }
    return res.data;
  });
}

export function txt2Img(params: Txt2ImgRequest) {
  return httpFetch({
    url: "/v2/txt2img",
    method: "POST",
    data: {
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    },
  }).then((res: Txt2ImgResponse) => {
    if (res.code !== RequestCode.SUCCESS) {
      throw new Error(res.msg);
    }
    return res.data;
  });
}

export function img2img(params: Img2imgRequest) {
  return httpFetch({
    url: "/v2/img2img",
    method: "POST",
    data: {
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    },
  }).then((res: Txt2ImgResponse) => {
    if (res.code !== RequestCode.SUCCESS) {
      throw new Error(res.msg);
    }
    return res.data;
  });
}

export function upscale(params: UpscalseRequest) {
  return httpFetch({
    url: "/v2/upscale",
    method: "POST",
    data: {
      ...params,
      upscaler_1: params.upscaler_1 ?? "R-ESRGAN 4x+",
      upscaler_2: params.upscaler_2 ?? "R-ESRGAN 4x+",
    },
  }).then((res: UpscaleResponse) => {
    if (res.code !== RequestCode.SUCCESS) {
      throw new Error(res.msg);
    }
    return res.data;
  });
}

export function progress(params: ProgressRequest) {
  return httpFetch({
    url: "/v2/progress",
    method: "GET",
    query: {
      ...params,
    },
  }).then((res: ProgressResponse) => {
    if (res.code !== RequestCode.SUCCESS) {
      throw new Error(res.msg);
    }
    return res.data;
  });
}

export function txt2ImgSync(
  params: Txt2ImgRequest,
  config?: SyncConfig
): Promise<any> {
  return new Promise((resolve, reject) => {
    txt2Img({
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    })
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(async () => {
            try {
              const progressResult = await progress({ task_id: res.task_id });
              if (progressResult && progressResult.status === 2) {
                clearInterval(timer);
                let imgs = progressResult.imgs;
                if (config?.img_type === "base64") {
                  imgs = await Promise.all(
                    progressResult.imgs.map((url) => readImgtoBase64(url))
                  );
                }
                resolve(imgs);
              } else if (
                progressResult &&
                (progressResult.status === 3 || progressResult.status === 4)
              ) {
                clearInterval(timer);
                reject(
                  new Error(
                    progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED
                  )
                );
              }
            } catch (error) {
              clearInterval(timer);
              reject(error);
            }
          }, config?.interval ?? 1000);
        } else {
          reject(new Error("Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

export function img2imgSync(
  params: Img2imgRequest,
  config?: SyncConfig
): Promise<any> {
  return new Promise((resolve, reject) => {
    img2img({
      ...params,
      prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
    })
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(async () => {
            try {
              const progressResult = await progress({ task_id: res.task_id });
              if (progressResult && progressResult.status === 2) {
                clearInterval(timer);
                let imgs = progressResult.imgs;
                if (config?.img_type === "base64") {
                  imgs = await Promise.all(
                    progressResult.imgs.map((url) => readImgtoBase64(url))
                  );
                }
                resolve(imgs);
              } else if (
                progressResult &&
                (progressResult.status === 3 || progressResult.status === 4)
              ) {
                clearInterval(timer);
                reject(
                  new Error(
                    progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED
                  )
                );
              }
            } catch (error) {
              clearInterval(timer);
              reject(error);
            }
          }, config?.interval ?? 1000);
        } else {
          reject(new Error("Failed to start the task."));
        }
      })
      .catch(reject);
  });
}

export function upscaleSync(params: UpscalseRequest, config?: SyncConfig) {
  return new Promise((resolve, reject) => {
    upscale({
      ...params,
      upscaler_1: params.upscaler_1 ?? "R-ESRGAN 4x+",
      upscaler_2: params.upscaler_2 ?? "R-ESRGAN 4x+",
    })
      .then((res) => {
        if (res && res.task_id) {
          const timer = setInterval(async () => {
            try {
              const progressResult = await progress({ task_id: res.task_id });
              if (progressResult && progressResult.status === 2) {
                clearInterval(timer);
                let imgs = progressResult.imgs;
                if (config?.img_type === "base64") {
                  imgs = await Promise.all(
                    progressResult.imgs.map((url) => readImgtoBase64(url))
                  );
                }
                resolve(imgs);
              } else if (
                progressResult &&
                (progressResult.status === 3 || progressResult.status === 4)
              ) {
                clearInterval(timer);
                reject(
                  new Error(
                    progressResult.failed_reason ?? ERROR_GENERATE_IMG_FAILED
                  )
                );
              }
            } catch (error) {
              clearInterval(timer);
              reject(error);
            }
          }, config?.interval ?? 1000);
        } else {
          reject(new Error("Failed to start the task."));
        }
      })
      .catch(reject);
  });
}
