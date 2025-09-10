"""generate_banana_cloud.py
간단한 n차원 확률적 바나나 구름 생성기 (디버그/샘플용)
출력: JSON 파일 (structured + literary)
"""
import json
import math
import random
import statistics

from typing import List


def make_centerline_1d(t_values, length, curvature, profile="arc"):
    # 1차원 매개변수 t -> nD centerline for simplicity here return points in 2D plane then can be embedded
    pts = []
    radius = length / (math.pi if profile=="arc" else math.pi)
    for t in t_values:
        angle = curvature * math.pi * (t)
        x = t * length
        y = math.sin(angle) * radius
        pts.append([x, y])
    return pts


def sample_cross_section_circle(n_samples, radius):
    pts = []
    for _ in range(n_samples):
        theta = random.random() * 2 * math.pi
        r = math.sqrt(random.random()) * radius
        x = r * math.cos(theta)
        y = r * math.sin(theta)
        pts.append([x, y])
    return pts


def generate_banana_cloud(dimension=3, num_points=2048, length=10.0, radius=1.0, curvature=0.6,
                          distribution='surface', noise_level=0.05, seed=None, tone='서정적',
                          uncertainty_level='medium', anchors=None):
    if seed is not None:
        random.seed(seed)

    # param t in [0,1]
    t_vals = [i/num_points for i in range(num_points)]
    center2d = make_centerline_1d(t_vals, length, curvature)

    points = []
    for i, t in enumerate(t_vals):
        cx, cy = center2d[i]
        # sample in cross section (2D) then embed into dimension space
        if distribution == 'surface':
            rx = radius * (1 if random.random() > 0.5 else -1) * (1 - random.random()*0.2)
            ry = 0
        else:
            cs = sample_cross_section_circle(1, radius)[0]
            rx, ry = cs[0], cs[1]
        # base 3D point
        x = cx + rx
        y = cy + ry
        z = 0.0
        # embed into higher dimensions by padding zeros
        pt = [x, y, z] + [0.0]*(max(0, dimension-3))
        # add noise
        pt = [coord + random.gauss(0, noise_level*radius) for coord in pt]
        points.append(pt)

    # compute simple stats
    radii = [math.hypot(p[0]-center2d[i][0], p[1]-center2d[i][1]) for i,p in enumerate(points)]
    radius_mean = statistics.mean(radii)
    radius_std = statistics.pstdev(radii)
    curvature_mean = curvature
    curvature_std = 0.05 * curvature

    structured = {
        "dimension": dimension,
        "num_points": num_points,
        "points": points,
        "centerline": center2d[:max(3, int(len(center2d)/10))],
        "params": {"length": length, "radius": radius, "curvature": curvature, "distribution": distribution, "noise_level": noise_level}
    }

    # literary text (simple template using anchors & uncertainty)
    literary = {
        "tone": tone,
        "length_words": 40,
        "text": f"이 바나나는 거의 {radius_mean:.2f}의 허리를 지녔으나, 그 허리는 +/-{radius_std:.2f} 정도로 흔들린다; 곡률은 약 {curvature_mean:.2f} (±{curvature_std:.2f})로 느껴진다."
    }

    # uncertainty level mapping (could be used to alter text more)
    if uncertainty_level == 'high':
        literary['text'] = literary['text'] + " 그 형태는 불확실한 안개처럼 계속 변한다."
    elif uncertainty_level == 'low':
        literary['text'] = literary['text'] + " 형태는 비교적 안정적이다."

    result = {"structured": structured, "literary": literary, "anchors": anchors or [], "uncertainty": {"radius_mean": radius_mean, "radius_std": radius_std, "level": uncertainty_level}}
    return result


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--dimension', type=int, default=3)
    parser.add_argument('--num_points', type=int, default=2048)
    parser.add_argument('--length', type=float, default=10.0)
    parser.add_argument('--radius', type=float, default=1.0)
    parser.add_argument('--curvature', type=float, default=0.6)
    parser.add_argument('--distribution', type=str, default='surface')
    parser.add_argument('--noise_level', type=float, default=0.05)
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--tone', type=str, default='서정적')
    parser.add_argument('--uncertainty_level', type=str, default='medium')
    parser.add_argument('--out', type=str, default='prompt/samples/banana_cloud_2048.json')
    args = parser.parse_args()

    data = generate_banana_cloud(dimension=args.dimension, num_points=args.num_points, length=args.length, radius=args.radius, curvature=args.curvature,
                                distribution=args.distribution, noise_level=args.noise_level, seed=args.seed, tone=args.tone,
                                uncertainty_level=args.uncertainty_level)

    # ensure samples dir
    import os
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print('Wrote', args.out)
