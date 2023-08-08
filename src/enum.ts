/**
 * Copyright (c) Omniinfer
 */

export const ERROR_BAD_REQUEST = "Bad Request";
export const ERROR_UNAUTHORIZED = "Unauthorized";
export const ERROR_FORBIDDEN = "Forbidden";
export const ERROR_NOT_FOUND = "Not Found";
export const ERROR_METHOD_NOT_ALLOWED = "Method Not Allowed";
export const ERROR_SERVER_ERROR = "Internal Server Error";
export const ERROR_GENERATE_IMG_FAILED = "Generate Image Failed";

export const ControlNetPreprocessor = {
  NULL: "none",
  CANNY: "canny",
  DEPTH: "depth",
  DEPTH_LERES: "depth_leres",
  DEPTH_LERES_PLUS_PLUS: "depth_leres++",
  HED: "hed",
  HED_SAFE: "hed_safe",
  MEDIAPIPE_FACE: "mediapipe_face",
  MLSD: "mlsd",
  NORMAL_MAP: "normal_map",
  OPENPOSE: "openpose",
  OPENPOSE_HAND: "openpose_hand",
  OPENPOSE_FACE: "openpose_face",
  OPENPOSE_FACEONLY: "openpose_faceonly",
  OPENPOSE_FULL: "openpose_full",
  CLIP_VISION: "clip_vision",
  COLOR: "color",
  PIDINET: "pidinet",
  PIDINET_SAFE: "pidinet_safe",
  PIDINET_SKETCH: "pidinet_sketch",
  PIDINET_SCRIBBLE: "pidinet_scribble",
  SCRIBBLE_XDOG: "scribble_xdog",
  SCRIBBLE_HED: "scribble_hed",
  SEGMENTATION: "segmentation",
  THRESHOLD: "threshold",
  DEPTH_ZOE: "depth_zoe",
  NORMAL_BAE: "normal_bae",
  ONEFORMER_COCO: "oneformer_coco",
  ONEFORMER_ADE20K: "oneformer_ade20k",
  LINEART: "lineart",
  LINEART_COARSE: "lineart_coarse",
  LINEART_ANIME: "lineart_anime",
  LINEART_STANDARD: "lineart_standard",
  SHUFFLE: "shuffle",
  TILE_RESAMPLE: "tile_resample",
  INVERT: "invert",
  LINEART_ANIME_DENOISE: "lineart_anime_denoise",
  REFERENCE_ONLY: "reference_only",
  REFERENCE_ADAIN: "reference_adain",
  REFERENCE_ADAIN_PLUS_ATTN: "reference_adain+attn",
  INPAINT: "inpaint",
  INPAINT_ONLY: "inpaint_only",
  INPAINT_ONLY_PLUS_LAMA: "inpaint_only+lama",
  TILE_COLORFIX: "tile_colorfix",
  TILE_COLORFIX_PLUS_SHARP: "tile_colorfix+sharp",
};

export const ControlNetMode = {
  BALANCED: 0,
  PROMPT_IMPORTANCE: 1,
  CONTROLNET_IMPORTANCE: 2,
};

export const ModelType = {
  CHECKPOINT: "checkpoint",
  LORA: "lora",
  VAE: "vae",
  CONTROLNET: "controlnet",
  TEXT_INVERSION: "text_inversion",
};
