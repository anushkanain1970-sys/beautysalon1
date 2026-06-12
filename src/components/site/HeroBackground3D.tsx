import { useEffect, useRef, useCallback } from "react";
import heroImg from "@/assets/hero.jpg";

/*
 * HeroBackground3D — Layered hero background
 *
 * Layer 1: Full-bleed looping video with poster fallback
 * Layer 2: GPU-accelerated WebGL 3D flowing golden light animation
 * Layer 3: Soft overlays for legibility
 *
 * The WebGL canvas uses soft-light blend mode so the video
 * stays visible with an ethereal, glowing 3D depth effect on top.
 */

/* ── Shader sources ───────────────────────────────────────── */

const VERT = `#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2  u_resolution;

/* ── Noise helpers (simplex 3D) ───────────────────────────── */

vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

/* ── Fractional Brownian Motion ───────────────────────────── */

float fbm(vec3 p) {
  float f = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    f += amp * snoise(p);
    p *= 2.03;
    amp *= 0.48;
  }
  return f;
}

/* ── Soft glow orb ────────────────────────────────────────── */

float orb(vec2 uv, vec2 center, float radius, float softness) {
  float d = length(uv - center);
  return smoothstep(radius + softness, radius - softness * 0.25, d);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = u_time * 0.08;  // very slow, dreamy drift

  /* ── Organic 3D noise field ─────────────────────────────── */
  float n1 = fbm(vec3(p * 1.6 + t * 0.25, t * 0.12));
  float n2 = fbm(vec3(p * 2.2 - t * 0.18, t * 0.09 + 3.0));
  float n3 = fbm(vec3(p * 1.0 + t * 0.1,  t * 0.06 + 7.0));

  /* ── Palette ────────────────────────────────────────────── */
  vec3 champagne = vec3(0.831, 0.706, 0.514);
  vec3 warmGold  = vec3(0.784, 0.643, 0.420);
  vec3 roseGold  = vec3(0.812, 0.647, 0.553);
  vec3 cream     = vec3(0.98, 0.96, 0.93);
  vec3 highlight = vec3(1.0, 0.97, 0.92);

  /* ── Base: semi-transparent warm tone ───────────────────── */
  vec3 col = cream;

  // Warm gold wave
  float wave1 = smoothstep(-0.15, 0.55, n1) * 0.4;
  col = mix(col, mix(champagne, warmGold, 0.55), wave1);

  // Rose-gold drift
  float wave2 = smoothstep(-0.05, 0.5, n2) * 0.28;
  col = mix(col, roseGold, wave2);

  // Cream highlights
  float wave3 = smoothstep(0.05, 0.45, n3) * 0.2;
  col = mix(col, cream, wave3);

  /* ── Floating 3D depth orbs ─────────────────────────────── */
  vec2 center = vec2(0.5 * aspect, 0.5);

  // Large deep orb — slow
  vec2 o1 = vec2(
    0.3 * aspect + sin(t * 0.5) * 0.22 * aspect,
    0.3 + cos(t * 0.35) * 0.18
  );
  col = mix(col, mix(champagne, warmGold, 0.6), orb(p + center, o1, 0.1, 0.4) * 0.35);

  // Medium orb — rose tint
  vec2 o2 = vec2(
    0.72 * aspect + cos(t * 0.45 + 1.0) * 0.16 * aspect,
    0.68 + sin(t * 0.3 + 2.0) * 0.14
  );
  col = mix(col, mix(roseGold, warmGold, 0.35), orb(p + center, o2, 0.07, 0.32) * 0.3);

  // Small sparkle orbs — faster
  vec2 o3 = vec2(
    0.5 * aspect + sin(t * 0.8 + 4.0) * 0.28 * aspect,
    0.22 + cos(t * 0.6 + 1.5) * 0.2
  );
  col = mix(col, highlight, orb(p + center, o3, 0.03, 0.2) * 0.4);

  vec2 o4 = vec2(
    0.18 * aspect + cos(t * 0.65 + 3.0) * 0.2 * aspect,
    0.78 + sin(t * 0.5 + 5.0) * 0.15
  );
  col = mix(col, mix(champagne, highlight, 0.4), orb(p + center, o4, 0.04, 0.22) * 0.32);

  vec2 o5 = vec2(
    0.85 * aspect + sin(t * 0.7 + 6.0) * 0.12 * aspect,
    0.45 + cos(t * 0.55 + 3.5) * 0.2
  );
  col = mix(col, warmGold, orb(p + center, o5, 0.025, 0.15) * 0.25);

  /* ── Vignette ───────────────────────────────────────────── */
  float vig = 1.0 - smoothstep(0.25, 0.9, length(uv - 0.5) * 1.15);
  col = mix(col * 0.88, col, vig);

  /* ── Output with alpha for blend ────────────────────────── */
  // We output partial alpha so the video bleeds through
  float alpha = 0.45 + wave1 * 0.15 + wave2 * 0.1;
  fragColor = vec4(col, alpha);
}`;

/* ── React component ──────────────────────────────────────── */

export function HeroBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startRef = useRef(performance.now());

  const initGL = useCallback((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      desynchronized: true,
    });
    if (!gl) return null;

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* compile shaders */
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fs));
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    /* fullscreen quad */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    programRef.current = prog;
    glRef.current = gl;

    return gl;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      glRef.current?.viewport(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = initGL(canvas);
    if (!gl) return;

    resize();
    window.addEventListener("resize", resize);

    const uTime = gl.getUniformLocation(programRef.current!, "u_time");
    const uRes = gl.getUniformLocation(programRef.current!, "u_resolution");

    const tick = (now: number) => {
      const t = (now - startRef.current) / 1000;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(tick);
    };

    // Defer initialization to allow the main thread and video to load smoothly
    const timeoutId = setTimeout(() => {
      startRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initGL, resize]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {/* Layer 1: Video background with poster image fallback */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={heroImg}
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ transform: "translateZ(0)" }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Layer 2: WebGL 3D flowing golden light — blended over video */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full mix-blend-soft-light"
        style={{ willChange: "contents" }}
      />

      {/* Layer 3: Soft ivory gradient for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--ivory) 22%, transparent) 0%, color-mix(in oklab, var(--ivory) 8%, transparent) 40%, color-mix(in oklab, var(--ivory) 28%, transparent) 100%)",
        }}
      />

      {/* Layer 4: Gold mesh glow whisper */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-15"
        style={{ background: "var(--gradient-mesh)" }}
      />
    </div>
  );
}
