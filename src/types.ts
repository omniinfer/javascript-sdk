/**
 * Copyright (c) Omniinfer
 *
 * Typescript type definitions for Omniinfer
 */

export type OmniinferKey = string | undefined;

export interface OmniinferConfig {
  BASE_URL: string;
  key: OmniinferKey;
}

// Request Code Enum
export enum RequestCode {
  SUCCESS = 0,
}

// getModels dependency status
export enum ModelStatus {
  READY = 1,
  UNREADY = 0,
}

export enum ModelType {
  Checkpoint = "checkpoint",
  Lora = "lora",
}

export type Model = {
  name: string;
  hash: string;
  sd_name: string;
  third_source: string | undefined;
  download_status: ModelStatus;
  download_name: string;
  dependency_status: ModelStatus;
  type: ModelType;
  civitai_link: string | undefined;
  civitai_model_id: number | undefined;
  civitai_version_id: number | undefined;
  civitai_nsfw: boolean | undefined;
  civitai_download_url: string | undefined;
  civitai_tags: string | undefined;
  civitai_download_count: number | undefined;
  civitai_favorite_count: number | undefined;
  civitai_comment_count: number | undefined;
  civitai_rating_count: number | undefined;
  civitai_rating: number | undefined;
  omni_used_count: number | undefined;
  civitai_image_url: string | undefined;
  civitai_image_nsfw: string | undefined;
  civitai_origin_image_url: string | undefined;
  civitai_image_prompt: string | undefined;
  civitai_image_negative_prompt: string | undefined;
  civitai_image_sampler_name: string | undefined;
  civitai_image_height: number | undefined;
  civitai_image_width: number | undefined;
  civitai_image_steps: number | undefined;
  civitai_image_cfg_scale: number | undefined;
  civitai_image_seed: number | undefined;
};

export type GetModelsResponse = {
  code: RequestCode;
  msg: string;
  data: {
    models: Array<Model>;
  };
};

export type Lora = {
  sd_name: string;
  weight: number;
};

export type ControlnetUnit = {
  model: string;
  weight: number | undefined;
  control_mode: number;
  module: string;
  input_image: string;
};

export type Txt2ImgRequest = {
  model_name: string;
  prompt: string;
  negative_prompt?: string | undefined;
  sampler_name?: string | undefined;
  steps?: number | undefined;
  cfg_scale?: number | undefined;
  seed?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  n_iter?: number | undefined;
  batch_size?: number | undefined;
  lora?: Array<Lora> | undefined;
  controlnet_units?: Array<ControlnetUnit> | undefined;
};

export type Txt2ImgResponse = {
  code: RequestCode;
  msg: string;
  data: {
    task_id: string;
  };
};

export type SyncConfig = {
  // wait time between each request, default 1000ms
  interval?: number;
  // img result, base64 or url, default base64
  img_type?: "base64" | "url";
};

export type Img2imgRequest = {
  model_name: string;
  prompt: string;
  negative_prompt?: string | undefined;
  sampler_name?: string | undefined;
  steps?: number | undefined;
  cfg_scale?: number | undefined;
  seed?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  n_iter?: number | undefined;
  batch_size?: number | undefined;
  restore_faces?: boolean | undefined;
  denoising_strength?: number | undefined;
  init_images: Array<string>;
  lora?: Array<Lora> | undefined;
};

export type Img2imgResponse = {
  code: RequestCode;
  msg: string;
  data: {
    task_id: string;
  };
};

export type ProgressRequest = {
  task_id: string;
};

export type ProgressResponse = {
  code: RequestCode;
  msg: string;
  data: {
    status: number;
    progress: number;
    eta_relative: number;
    imgs: Array<string>;
    info: string | undefined;
    failed_reason: string | undefined;
    current_images?: string | undefined | null;
  };
};
