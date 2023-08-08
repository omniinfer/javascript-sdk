# Omniinfer Js SDK

this SDK is based on the official [API documentation](https://docs.omniinfer.io/)

**join our discord server for help**

[![](https://dcbadge.vercel.app/api/server/nzqq8UScpx)](https://discord.gg/nzqq8UScpx)

## Installation

```bash
npm i omniinfer-client-sdk
```

## Quick Start

**Get api key refer to [https://docs.omniinfer.io/get-started](https://docs.omniinfer.io/get-started/)**

```javascript
import { txt2ImgSync } from "omniinfer-client-sdk";

txt2ImgSync({
  model_name: "",
  prompt: "a girl",
})
  .then((res) => {
    console.log("imgs", res);
  })
  .catch((err) => {
    console.log(err);
  });
```

## Examples [Online Demo](https://stackblitz.com/edit/stackblitz-starters-phcdal?file=src%2FApp.tsx)

### function list

- setOmniinferKey
- getModels
- img2img
- txt2Img
- txt2ImgSync
- img2imgSync

### Usage in React

```javascript
import * as React from 'react';
import { txt2ImgSync } from 'omniinfer-client-sdk';
import './style.css';

const { useState, useCallback } = React;

export default function App() {
  const [imgs, setImgs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const generateImg = useCallback(() => {
    setLoading(true);
    txt2ImgSync({
      model_name: '',
      prompt: 'a girl',
    })
      .then((res) => {
        setImgs(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h1>Text to image</h1>
      <button onClick={generateImg} disabled={loading}>
        {loading ? 'progressing' : 'click to generate image'}
      </button>
      <div
        style={{
          marginTop: '20px',
        }}
      >
        {imgs.map((one) => (
          <img
            src={one}
            crossOrigin="anonymous"
            referrerPolicy="origin-when-cross-origin"
            style={{
              objectFit: 'cover',
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### Model Search

When you use this model interface, keep an eye on `dependency_status` and `download_status`, **which are only considered to be available if they are both 1**

We recommend that you keep the interface data in memory, e.g. redux.

```javascript
import { getModels } from "omniinfer-client-sdk";
useEffect(() => {
  getModels().then((res) => {
    console.log(res.models.slice(0, 100));
  });
}, []);
```

### Lora Usage

```javascript
txt2ImgSync({
  model_name: "majicmixRealistic_v2.safetensors",
  prompt:
    "Best quality, masterpiece, ultra high res, (photorealistic:1.4), raw photo, 1girl, offshoulder, in the dark, deep shadow, low key, cold light",
  negative_prompt:
    "ng_deepnegative_v1_75t, badhandv4 (worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, normal quality, ((monochrome)), ((grayscale))",
  sampler_name: "DPM++ 2M Karras",
  lora: [
    {
      sd_name: "film",
      weight: 0.4,
    },
  ],
}).then((res) => {
  console.log(res);
});
```

### ControlNet QRCode

```javascript
txt2ImgSync({
  prompt:
    "a beautify butterfly in the colorful flowers, best quality, best details, masterpiece",
  model_name: "",
  steps: 30,
  controlnet_units: [
    {
      input_image: imgbase64,
      module: ControlNetPreprocessor.NULL,
      control_mode: ControlNetMode.BALANCED,
      model: "control_v1p_sd15_qrcode_monster_v2",
      weight: 2.0,
    },
  ],
}).then((res) => {
  console.log(res);
});
```
