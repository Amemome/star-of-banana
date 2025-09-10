# 확률적 바나나 구름 (Probabilistic Banana Cloud)

이 프롬프트는 LLM 또는 인간에게 "모든 내가 꿈꾸는 확률들을 제한하여" 생성되는 바나나 형태의 확률적 구름(포인트클라우드 / 분포)을 만들어내도록 지시합니다. 바나나는 3차원 이상(nD)에서도 의미를 가지며, 출력은 JSON 포인트클라우드 또는 CSV로 제공됩니다.

## 설명

- 개념: "바나나 구름"은 중심선(centerline)을 따라 휘어진 튜브 모양의 분포입니다. 중심선의 곡률, 단면의 분포(원/타원), 그리고 점 샘플링 방식(표면/체적/가우시안 등)을 통해 확률적 형태를 표현합니다.
- 목적: 생성된 샘플은 시각화, 모델 학습, 통계적 분석, 또는 예술적 활용이 가능해야 합니다.

## 입력 파라미터

- `dimension` (int, >=2): 출력 차원 (기본 3)
- `num_points` (int): 생성할 점의 수
- `length` (float): 바나나의 길이(스케일 기준)
- `radius` (float): 평균 단면 반지름
- `curvature` (float, 0..1): 중심선의 굽음 정도
- `bending_profile` (string): 중심선 형태: `arc`, `bezier`, `sine`, `custom` (기본 `arc`)
- `cross_section` (string): 단면 형태: `circle`, `ellipse`, `custom` (기본 `circle`)
- `distribution` (string): 샘플링 방식: `surface`, `volume`, `gaussian`, `poisson` 등
- `noise_level` (float, 0..1): 좌표 노이즈 레벨
- `orientation` (list of float | null): 주축 방향 벡터 (길이=dimension)
- `seed` (int | null): 재현성 시드
- `constraints` (object, optional): 확률 경계 또는 추가 제한 (예: 반사, 절단)
- `meta` (object, optional): 라벨/설명용 추가 메타데이터

## 출력 스키마 (JSON 권장)

{
  "dimension": int,
  "num_points": int,
  "points": [[x1,...,xn], ...],
  "weights": [w1,...] (optional),
  "centerline": [[c1,...,cn], ...] (optional),
  "params": { ... input parameters ... },
  "notes": "설명/경고"
}

CSV: 각 행은 포인트 좌표.

## 생성 규칙 (구현 가이드)

1. 중심선 정의
   - `bending_profile`에 따라 중심선을 매개곡선으로 정의.
   - `curvature` 값은 중심선의 곡률 강도로 사용.
2. 단면 정의
   - 지정된 `cross_section`에 따라 각 중심선 위치에서 n-1 차원의 단면을 생성.
3. 샘플링
   - `distribution`에 따라 표면/체적/가우시안 분포로 포인트를 샘플링.
   - `noise_level`에 따라 각 좌표에 독립적 노이즈 추가.
4. 스케일과 정규화
   - 결과는 `length`와 `radius`에 맞춰 스케일링.
5. 제약 적용
   - `constraints`로 지정된 경계(예: x>0, t in [0,1])를 적용.

## 검증 기준

- 형식: JSON 스키마 일치
- 통계
  - 중심선에 대한 프로젝션 후 주축 길이 ≈ `length`
  - 단면 거리의 중앙값 ≈ `radius`
  - 노이즈 분산이 `noise_level`과 비례
- 시맨틱: `curvature` 및 `bending_profile`의 시각적/수치적 일치

## 문학적 앵커와 불확실성 (Anchors & Uncertainty)

- 목적: 구조적 데이터(`structured`)와 문학적 서술(`literary`) 사이의 의미적 연결을 강화하면서도, 응답에 불확실성(확률성, 모호성)을 자연스럽게 포함시킨다.

- `anchors` 필드 (선택적): 응답의 `literary.text`가 반드시 언급하거나 은유로 연결해야 할 구조적 통계치 목록.
  - 예: `{"anchors": ["mean_radius", "curvature"]}`
  - 구현: LLM은 `mean_radius` 값을 은유(예: "허리의 가느다란 허리") 또는 기술적 언급(예: "평균 반지름 0.98")으로 참조할 수 있다.

- `uncertainty` 표현 규칙:
  1. 구조적 필드에는 불확실성의 수치적 표현을 포함한다(예: `radius_mean: 0.98, radius_std: 0.07`).
  2. 문학적 필드는 수치적 불확실성을 은유, 모호성, 또는 직설 표현으로 병기한다. 예: "반지름은 대략 1에 가깝지만, 때때로 0.9에서 1.1까지 춤춘다." 또는 "곡률은 불확실한 속삭임처럼 변한다(≈0.6±0.05)."
  3. `uncertainty.level` (low/medium/high)로 전반적 불확실성 톤을 제어할 수 있다. 이 값은 문학적 표현의 모호성(은유 사용 빈도, 수사적 장치 등)을 조절한다.

- 규칙 요약:
  - 반드시 `structured`에 수치적 불확실성(평균/표준편차 또는 분포 메타)을 포함한다.
  - `literary`는 그 수치를 인간이 해석할 수 있는 언어로 번역하되, `uncertainty.level`에 따라 더 모호하거나 더 명확하게 쓴다.

예시 추가:

- 입력 파라미터: `dimension=3, num_points=2048, curvature=0.6, length=10, radius=1.0, noise_level=0.05, anchors=["mean_radius","curvature"], uncertainty.level='medium', tone='서정적', length_words=40`

- structured 요약:
  - "radius_mean": 0.99, "radius_std": 0.06, "curvature_mean": 0.59, "curvature_std": 0.04

- literary 예시 텍스트:
  - "이 바나나는 거의 1에 가까운 허리를 지녔으나, 그 허리는 가끔 0.93과 1.05 사이에서 숨을 고른다; 곡률은 부드럽게 0.6을 향해 기울지만, 때때로 작은 숨결에 흔들린다."
