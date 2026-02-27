---
title: "Scout 프로젝트: 반전하는 원자의 파수꾼"
date: "2026-01-09 11:43:43"
description: "혼돈을 구조화하다: MOTA ATOM의 오픈소스 파수꾼이 고가치 엣지 데이터를 모니터링하는 방법."
categories: ["오픈소스", "인프라"]
tags: ["Cloudflare Workers", "데이터 파이프라인", "자동화"]
image: "https://raw.githubusercontent.com/mota-techlink/mota-scout-public/main/assets/images/cover.jpg"
canonicalUrl: "https://github.com/mota-techlink/mota-scout-public"
keywords: ["MOTA ATOM", "Scout", "엣지 컴퓨팅", "혼돈을 구조화하다"]
author: "MOTA ATOM"
---

# Scout 프로젝트: 반전하는 원자의 파수꾼

<p align="center">
  <img src="https://raw.githubusercontent.com/mota-techlink/mota-scout-public/main/assets/images/cover.jpg" alt="MOTA Project Scout"/>
</p>

**Scout 프로젝트**는 MOTA 에코시스템의 고효율 엣지 데이터 게이트웨이입니다. "파수꾼"으로 설계되어 YouTube 및 RSS 피드에서 시작하는 고가치 디지털 노이즈를 모니터링하고, Cloudflare Workers와 Supabase를 통해 구조화된 신호로 압축합니다.

> **혼돈을 구조화하다:** 이 프로젝트는 "반전하는 원자" 이론의 실질적 구현으로, 디지털 혼돈이 엣지에서 포착되어 고밀도의 실행 가능한 인사이트로 집약됩니다.



<div align="left">  
  <a href="https://zdoc.app/zh/mota-techlink/mota-scout-public">中文</a> | 
  <a href="https://zdoc.app/es/mota-techlink/mota-scout-public">Español</a> |  
  <a href="https://zdoc.app/de/mota-techlink/mota-scout-public">Deutsch</a> | 
  <a href="https://zdoc.app/fr/mota-techlink/mota-scout-public">Français</a> |      
  <a href="https://zdoc.app/pt/mota-techlink/mota-scout-public">Português</a> |   
  <a href="https://zdoc.app/ru/mota-techlink/mota-scout-public">Русский</a> |   
  <a href="https://zdoc.app/ko/mota-techlink/mota-scout-public">한국어</a> |   
  <a href="https://zdoc.app/ja/mota-techlink/mota-scout-public">日本語</a> |     
</div>

<br/>

## 1. 프로젝트 비전

MOTA 아키텍처에서 **Scout**는 감각 시스템을 담당합니다. 대부분의 파이프라인이 수동 데이터 입력에 의존하는 반면, Scout는 "발견 단계"를 자동화합니다.

- **엣지 우선:** Cloudflare Workers에서 실행되어 0ms 지연 시간과 글로벌 배포를 실현합니다.
- **서버리스 영속성:** Supabase와 통합하여 "디지털 프론티어"의 실시간 상태를 유지합니다.
- **공개 빌드:** 이 모듈은 오픈소스로, 2026년에 견고하고 비용 효율적인 데이터 파이프라인을 구축하는 방법을 보여줍니다.

## 2. 기술 아키텍처

파이프라인은 3계층 구조를 따릅니다:
1. **Scout (공개):** YouTube/RSS 피드를 폴링하는 Cloudflare Worker.
2. **하트 (프라이빗/공개 혼합):** Supabase PostgreSQL이 비디오 메타데이터와 처리 상태를 저장.
3. **머슬 (프라이빗):** 로컬 Worker(Cloudflare Tunnel 경유)가 대규모 트랜스크립션 및 LLM 구조화 작업을 처리.

## 3. 빠른 시작 (참고 가이드)

### a. Supabase 설정
다음 스키마로 `videos` 테이블을 생성합니다:

```sql
create table videos (
  id uuid default uuid_generate_v4() primary key,
  video_id text unique,
  title text,
  url text,
  status text default 'pending', -- pending, processing, completed
  created_at timestamp with time zone default now()
);
```

### b. 파수꾼 배포
Wrangler를 설치하고 Worker를 Cloudflare 계정에 배포합니다:

```Bash
npm install -g wrangler
wrangler deploy
```

### c. 설정
Cloudflare에서 환경 변수를 설정하세요:

SUPABASE_URL: 프로젝트 URL.

SUPABASE_KEY: Service Role 키(Secret으로 저장).

## 4. 이 프로젝트를 참고해야 하는 이유
범용 크롤러와 달리 Scout 프로젝트는 다음에 최적화되어 있습니다:

- **저비용:** Cloudflare의 무료 플랜을 활용한 스케줄링.

- **확장성:** src/index.js를 수정하여 채널이나 데이터 소스를 쉽게 추가 가능.

- **콘텐츠 전략:** MOTA 콘텐츠 엔진의 "첫 번째 숨결"로서, 데이터를 디지털 휴먼 파이프라인(dh_pipeline)에 직접 제공.

## ❓ FAQ
**Q: YouTube 이외의 소스에도 사용할 수 있나요?**  A: 물론입니다. 아키텍처가 모듈식이므로 모든 RSS 또는 API 기반 소스에 연결할 수 있습니다.

**Q: 안전하게 운영할 수 있나요?** A: 네. 모든 민감한 키는 Cloudflare Secrets와 GitHub Actions를 통해 관리됩니다.


[MOTA ATOM:](https://motaiot.com) **비트에서 원자로, 반전.**
