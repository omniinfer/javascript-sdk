import axios from "axios";
import {
  GetModelsResponse,
  Img2imgRequest,
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
import { ERROR_GENERATE_IMG_FAILED } from "./enum";

export class OmniinferSDK {
  protected key: string;
  protected BASE_URL: string;

  constructor(key: string) {
    this.key = key;
    this.BASE_URL = "https://api.omniinfer.io";
  }

  httpFetch({
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
    let fetchUrl = this.BASE_URL + url;

    if (query) {
      fetchUrl += "?" + new URLSearchParams(query).toString();
    }

    const headers = {
      "Content-Type": "application/json",
      "X-Omni-Source": "js-sdk",
      ...(this.key ? { "X-Omni-Key": this.key } : {}),
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

  getModels() {
    return this.httpFetch({
      url: "/v2/models",
    }).then((res: GetModelsResponse) => {
      if (res.code !== RequestCode.SUCCESS) {
        throw new Error(res.msg);
      }
      return res.data;
    });
  }

  txt2Img(params: Txt2ImgRequest) {
    return this.httpFetch({
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

  img2img(params: Img2imgRequest) {
    return this.httpFetch({
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

  progress(params: ProgressRequest) {
    return this.httpFetch({
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

  txt2ImgSync(params: Txt2ImgRequest, config?: SyncConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.txt2Img({
        ...params,
        prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
      })
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(async () => {
              try {
                const progressResult = await this.progress({
                  task_id: res.task_id,
                });
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

  img2imgSync(params: Img2imgRequest, config?: SyncConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.img2img({
        ...params,
        prompt: addLoraPrompt(generateLoraString(params.lora), params.prompt),
      })
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(async () => {
              try {
                const progressResult = await this.progress({
                  task_id: res.task_id,
                });
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

  upscale(params: UpscalseRequest) {
    return this.httpFetch({
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

  upscaleSync(params: UpscalseRequest, config?: SyncConfig) {
    return new Promise((resolve, reject) => {
      this.upscale({
        ...params,
        upscaler_1: params.upscaler_1 ?? "R-ESRGAN 4x+",
        upscaler_2: params.upscaler_2 ?? "R-ESRGAN 4x+",
      })
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(async () => {
              try {
                const progressResult = await this.progress({
                  task_id: res.task_id,
                });
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
}
