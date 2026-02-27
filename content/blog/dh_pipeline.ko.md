---
title: "오픈소스 프로젝트로 디지털 휴먼을 생성하는 방법"
date: "2025-12-26 08:31:05"
description: "MOTA ATOM 오픈소스 프로젝트 동기화: dh_pipeline 기술 백서"
categories: ["오픈소스", "백서"]
tags: ["데이터 파이프라인", "IoT"]
image: "https://raw.githubusercontent.com/mota-techlink/dh_pipeline/refs/heads/main/assets/images/cover.jpg"
canonicalUrl: "https://github.com/mota-techlink/dh_pipeline"
keywords: ["디지털 휴먼", "LivePortrait", "MuseTalk", "AI 비디오 파이프라인", "MOTA ATOM"]
author: "MOTA ATOM"
---

# 올인원 디지털 휴먼 비디오 파이프라인
<p align="center">
  <img src="https://raw.githubusercontent.com/mota-techlink/dh_pipeline/refs/heads/main/assets/images/cover.jpg" alt="MOTA dh_pipeline"/>
</p>

로컬 환경에서 사실적인 디지털 휴먼 비디오를 생성하기 위해 설계된 모듈식 고효율 파이프라인입니다. LivePortrait를 통한 모션 동기화와 MuseTalk을 통한 정밀한 립싱크를 통합하며, MOTA ATOM의 최적화 로직으로 구동됩니다.

<div align="left">  
  <a href="https://zdoc.app/zh/mota-techlink/dh_pipeline">中文</a> | 
  <a href="https://zdoc.app/es/mota-techlink/dh_pipeline">Español</a> |  
  <a href="https://zdoc.app/de/mota-techlink/dh_pipeline">Deutsch</a> | 
  <a href="https://zdoc.app/fr/mota-techlink/dh_pipeline">Français</a> |      
  <a href="https://zdoc.app/pt/mota-techlink/dh_pipeline">Português</a> |   
  <a href="https://zdoc.app/ru/mota-techlink/dh_pipeline">Русский</a> |   
  <a href="https://zdoc.app/ko/mota-techlink/dh_pipeline">한국어</a> |   
  <a href="https://zdoc.app/ja/mota-techlink/dh_pipeline">日本語</a> |     
</div>

<br/>

> 본 프로젝트의 가치:
>
> 독립형 도구와 달리 dh_pipeline은 Torch 2.1.2와 MMCV 간의 버전 충돌을 해결하여 원클릭 배포 경험을 보장합니다.
<br/>

## 1. 환경 준비

> conda 사용을 강력히 권장합니다
```bash
mkdir dh_pipeline
cd dh_pipeline
conda create -n dh_pipeline python=3.10 -y
conda activate dh_pipeline
```

## 2. 번역 및 음성 생성
> Google Deep Translator와 Microsoft EdgeTTS를 설치하여 원본 언어의 콘텐츠를 대상 언어로 번역한 후 해당 음성을 생성합니다.
```bash
pip install deep-translator edge-tts
```

> 번역 및 TTS 생성 실행
```bash
python run_tts.py
```

## 3. 비디오 합성
> 정적 아바타를 샘플 비디오 속 인물의 움직임에 맞춰 움직이게 합니다.

<p align="center">
  <img src="https://github.com/KlingTeam/LivePortrait/raw/main/assets/docs/showcase2.gif" alt="image"/>
</p>

### a. LivePortrait 소스코드 가져오기
```bash
git clone https://github.com/KwaiVGI/LivePortrait
cd LivePortrait
```
### b. 의존성 설치

<details> 
 <summary>CUDA 버전을 확인하세요!!!</summary>

```
nvcc -V # 버전 예시: 11.1, 11.8, 12.1 등
```
그런 다음 해당하는 torch 버전을 설치합니다. 다음은 서로 다른 CUDA 버전의 예시입니다. 사용 중인 CUDA 버전이 목록에 없는 경우 [PyTorch 공식 웹사이트](https://pytorch.org/get-started/previous-versions)에서 설치 명령을 확인하세요:
```bash  
  # CUDA 11.8
  pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
  
  # CUDA 12.1
  pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu121
  # ...
  ```
  > `nvidia-smi`로 CUDA 버전을 확인할 수 있습니다. CUDA 버전이 11.8 이상인 경우 CUDA 11.8 이상의 설치 명령을 사용하고, MuseTalk과의 충돌을 방지하기 위해 torch 버전은 항상 2.1.2를 유지하세요.

  **Numpy를 확인하세요. 2.0보다 크면 다운그레이드가 필요합니다**
  ```
  # Numpy 버전 확인
  pip show numpy

  pip install "numpy==1.26.4"
  ```
</details>

나머지 의존성 설치:

```bash
pip install -r requirements.txt
```

### c. 사전 학습된 가중치 다운로드 📥
사전 학습된 가중치를 다운로드하는 가장 쉬운 방법은 HuggingFace를 이용하는 것입니다:

```bash
# !pip install -U "huggingface_hub[cli]"
huggingface-cli download KlingTeam/LivePortrait --local-dir pretrained_weights --exclude "*.git*" "README.md" "docs"
```

Huggingface에 접속할 수 없는 경우 hf-mirror를 사용하여 다운로드할 수 있습니다:
```bash
# !pip install -U "huggingface_hub[cli]"
export HF_ENDPOINT=https://hf-mirror.com
huggingface-cli download KlingTeam/LivePortrait --local-dir pretrained_weights --exclude "*.git*" "README.md" "docs"
```

[Google Drive](https://drive.google.com/drive/folders/1UtKgzKjFAOmZkhNK-OYT0caJ_w2XAnib) 또는 [바이두 클라우드](https://pan.baidu.com/s/1MGctWmNla_vZxDbEp2Dtzw?pwd=z5cn)에서 모든 사전 학습된 가중치를 다운로드할 수도 있습니다. 압축을 풀고 ./pretrained_weights 디렉토리에 배치하세요.

디렉토리 구조가 다음과 같은지 확인하세요:

> `pretrained_weights` 디렉토리 구조

```text
pretrained_weights
├── insightface
│   └── models
│       └── buffalo_l
│           ├── 2d106det.onnx
│           └── det_10g.onnx
├── liveportrait
│   ├── base_models
│   │   ├── appearance_feature_extractor.pth
│   │   ├── motion_extractor.pth
│   │   ├── spade_generator.pth
│   │   └── warping_module.pth
│   ├── landmark.onnx
│   └── retargeting_models
│       └── stitching_retargeting_module.pth
└── liveportrait_animals
    ├── base_models
    │   ├── appearance_feature_extractor.pth
    │   ├── motion_extractor.pth
    │   ├── spade_generator.pth
    │   └── warping_module.pth
    ├── retargeting_models
    │   └── stitching_retargeting_module.pth
    └── xpose.pth
```

**실행 시작**
> 기본적으로 결과는 LivePortrait/animations에 저장됩니다
```bash
 python inference.py
```

또는 이미지와 드라이빙 비디오 경로를 지정

```bash
python inference.py  --source "assets/examples/source/s12.jpg"   --driving "assets/examples/driving/d13.mp4"
```

## 4. 립싱크

![모델 구조](https://github.com/user-attachments/assets/02f4a214-1bdd-4326-983c-e70b478accba)

## 데모 사례

<table>
<tr>
<td width="33%">

### 입력 비디오
---
https://github.com/TMElyralab/MuseTalk/assets/163980830/37a3a666-7b90-4244-8d3a-058cb0e44107

---
https://github.com/user-attachments/assets/1ce3e850-90ac-4a31-a45f-8dfa4f2960ac

---
https://github.com/user-attachments/assets/fa3b13a1-ae26-4d1d-899e-87435f8d22b3

---
https://github.com/user-attachments/assets/15800692-39d1-4f4c-99f2-aef044dc3251

---
https://github.com/user-attachments/assets/a843f9c9-136d-4ed4-9303-4a7269787a60

---
https://github.com/user-attachments/assets/6eb4e70e-9e19-48e9-85a9-bbfa589c5fcb

</td>
<td width="33%">

### MuseTalk 1.0
---
https://github.com/user-attachments/assets/c04f3cd5-9f77-40e9-aafd-61978380d0ef

---
https://github.com/user-attachments/assets/2051a388-1cef-4c1d-b2a2-3c1ceee5dc99

---
https://github.com/user-attachments/assets/b5f56f71-5cdc-4e2e-a519-454242000d32

---
https://github.com/user-attachments/assets/a5843835-04ab-4c31-989f-0995cfc22f34

---
https://github.com/user-attachments/assets/3dc7f1d7-8747-4733-bbdd-97874af0c028

---
https://github.com/user-attachments/assets/3c78064e-faad-4637-83ae-28452a22b09a

</td>
<td width="33%">

### MuseTalk 1.5
---
https://github.com/user-attachments/assets/999a6f5b-61dd-48e1-b902-bb3f9cbc7247

---
https://github.com/user-attachments/assets/d26a5c9a-003c-489d-a043-c9a331456e75

---
https://github.com/user-attachments/assets/471290d7-b157-4cf6-8a6d-7e899afa302c

---
https://github.com/user-attachments/assets/1ee77c4c-8c70-4add-b6db-583a12faa7dc

---
https://github.com/user-attachments/assets/370510ea-624c-43b7-bbb0-ab5333e0fcc4

---
https://github.com/user-attachments/assets/b011ece9-a332-4bc1-b8b7-ef6e383d7bde

</td>
</tr>
</table>

### a. 코드 다운로드
```bash
git clone https://github.com/TMElyralab/MuseTalk.git
cd MuseTalk
```

### b. 의존성 설치

```bash
pip install -r requirements.txt

# numpy가 2.0 미만인지 확인
# pip install "numpy==1.26.4"

# torch가 2.1.2인지 확인
#pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118

# mmcv 버전이 다음과 같은지 확인:
wget https://download.openmmlab.com/mmcv/dist/cu118/torch2.1.0/mmcv-2.1.0-cp310-cp310-manylinux1_x86_64.whl

pip install mmcv-2.1.0-cp310-cp310-manylinux1_x86_64.whl

# 나머지 의존성 버전을 엄격히 제한
pip install "transformers==4.37.2" "diffusers==0.24.0" "accelerate==0.26.0" "huggingface-hub==0.23.5" "tokenizers==0.15.2" "opencv-python-headless==4.9.0.80" "omegaconf" "imageio-ffmpeg" "av" "scipy"

# 마지막으로 OpenMMLab 컴포넌트 설치
pip install "mmengine>=0.10.0" "mmpose>=1.1.0" "mmdet>=3.1.0"

# 검증
python -c "import torch; import cv2; import numpy; from mmcv.ops import MultiScaleDeformableAttention; print(f'✅ Perfect enviroment: Torch={torch.__version__}, NumPy={numpy.__version__}, MMCV OK')"
```

> '✅ Perfect enviroment: Torch=2.1.2+cu118, NumPy=1.26.4, MMCV OK'이 표시되지 않으면 처음부터 다시 시작하세요!!!

### c. 가중치 다운로드
가중치는 두 가지 방법으로 다운로드할 수 있습니다:

#### 방법 1: 다운로드 스크립트 사용
자동 다운로드를 위한 두 가지 스크립트를 제공합니다:

Linux:
```bash
sh ./download_weights.sh
```

Windows:
```batch
# 스크립트 실행
download_weights.bat
```

다음 링크에서 가중치를 수동으로 다운로드할 수도 있습니다:

1. 우리가 학습한 [가중치](https://huggingface.co/TMElyralab/MuseTalk/tree/main) 다운로드
2. 기타 컴포넌트 가중치 다운로드:
   - [sd-vae-ft-mse](https://huggingface.co/stabilityai/sd-vae-ft-mse/tree/main)
   - [whisper](https://huggingface.co/openai/whisper-tiny/tree/main)
   - [dwpose](https://huggingface.co/yzd-v/DWPose/tree/main)
   - [syncnet](https://huggingface.co/ByteDance/LatentSync/tree/main)
   - [face-parse-bisent](https://drive.google.com/file/d/154JgKpzCPW82qINcVieuPH3fZ2e0P812/view?pli=1)
   - [resnet18](https://download.pytorch.org/models/resnet18-5c106cde.pth)

최종적으로 이 가중치들은 `models` 디렉토리 내에 다음과 같이 배치되어야 합니다:
```
./models/
├── musetalk
│   └── musetalk.json
│   └── pytorch_model.bin
├── musetalkV15
│   └── musetalk.json
│   └── unet.pth
├── syncnet
│   └── latentsync_syncnet.pt
├── dwpose
│   └── dw-ll_ucoco_384.pth
├── face-parse-bisent
│   ├── 79999_iter.pth
│   └── resnet18-5c106cde.pth
├── sd-vae
│   ├── config.json
│   └── diffusion_pytorch_model.bin
└── whisper
    ├── config.json
    ├── pytorch_model.bin
    └── preprocessor_config.json
    
```


### d. 추론 실행
```bash
sh inference.sh v1.5 realtime
```

## ❓ 자주 묻는 질문 (FAQ)

**Q: 이 파이프라인을 일반 소비자용 GPU에서 실행할 수 있나요?**
A: 네, 최소 8GB VRAM이 탑재된 NVIDIA GPU(RTX 3060 이상)에 최적화되어 있습니다.

**Q: 실시간 생성을 지원하나요?**
A: 현재는 고속 오프라인 추론을 지원합니다. 실시간 지원은 MOTA ATOM 로드맵에 포함되어 있습니다.

**Q: 다른 제공업체 대신 Edge-TTS를 사용하는 이유는 무엇인가요?**
A: Edge-TTS는 자연스러운 운율과 비용 없는 로컬 통합 사이에서 최적의 균형을 제공합니다.
