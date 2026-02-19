"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Trail update shader: fade + diffuse + paint ───
const TRAIL_VS = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const TRAIL_FS = `
  precision highp float;

  uniform sampler2D u_prevTrail;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_brushSize;
  uniform float u_fadeRate;
  uniform float u_isMoving;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 texel = 1.0 / u_resolution;

    // ─── Diffusion blur: spread like water ───
    float center = texture2D(u_prevTrail, uv).r;
    float left   = texture2D(u_prevTrail, uv + vec2(-texel.x, 0.0)).r;
    float right  = texture2D(u_prevTrail, uv + vec2( texel.x, 0.0)).r;
    float up     = texture2D(u_prevTrail, uv + vec2(0.0,  texel.y)).r;
    float down   = texture2D(u_prevTrail, uv + vec2(0.0, -texel.y)).r;

    // Weighted average: center-heavy with neighbor bleed
    float diffused = center * 0.55 + (left + right + up + down) * 0.1125;

    // Fade over time
    diffused *= u_fadeRate;

    // ─── Paint new trail at mouse position (soft gaussian falloff) ───
    float dist = distance(gl_FragCoord.xy, u_mouse);
    float normalizedDist = dist / u_brushSize;
    float brush = exp(-normalizedDist * normalizedDist * 3.0) * u_isMoving;

    float result = min(max(diffused, brush), 1.0);
    gl_FragColor = vec4(result, result, result, 1.0);
  }
`;

// ─── Main render shader: image + halftone + dither + trail reveal ───
const MAIN_VS = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const MAIN_FS = `
  precision highp float;

  uniform sampler2D u_image;
  uniform sampler2D u_trail;
  uniform vec2 u_resolution;
  uniform float u_dotSize;
  uniform vec3 u_darkColor;
  uniform vec3 u_lightColor;
  uniform float u_halftoneStrength;

  varying vec2 v_texCoord;

  float halftone(vec2 pixel, float value) {
    vec2 cell = floor(pixel / u_dotSize);
    vec2 cellCenter = (cell + 0.5) * u_dotSize;
    float dist = distance(pixel, cellCenter);
    float maxRadius = u_dotSize * 0.55;
    float radius = maxRadius * (1.0 - value);
    return smoothstep(radius + 0.8, radius - 0.8, dist);
  }

  void main() {
    vec2 pixel = gl_FragCoord.xy;
    vec2 pixelFlipped = vec2(pixel.x, u_resolution.y - pixel.y);
    vec2 uv = gl_FragCoord.xy / u_resolution;

    vec4 texColor = texture2D(u_image, v_texCoord);

    float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    luma = smoothstep(0.05, 0.95, luma);

    vec3 duotone = mix(u_darkColor, u_lightColor, luma);

    float dot = halftone(pixelFlipped, luma);
    vec3 halftoned = mix(
      duotone * (1.0 + u_halftoneStrength * 0.15),
      duotone * (1.0 - u_halftoneStrength * 0.3),
      dot
    );

    vec3 result = clamp(halftoned, 0.0, 1.0);

    float reveal = texture2D(u_trail, uv).r;
    reveal = smoothstep(0.05, 0.6, reveal);

    vec3 finalColor = mix(result, texColor.rgb, reveal);
    float alpha = mix(0.82, 1.0, reveal);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ─── Types ───
interface DitherImageProps {
  src: string;
  alt?: string;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  dotSize?: number;
  halftoneStrength?: number;
  /** Brush size for the trail reveal in px. Default 80 */
  brushSize?: number;
  /** How fast the trail fades (0.9=fast, 0.99=slow). Default 0.97 */
  trailFade?: number;
  /** Enable mouse trail reveal. Default true */
  hoverReveal?: boolean;
  style?: React.CSSProperties;
}

function hexToGL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createTrailTexture(gl: WebGLRenderingContext, width: number, height: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export function DitherImage({
  src,
  alt = "",
  className = "",
  darkColor = "#1925AA",
  lightColor = "#B8B0E0",
  dotSize = 5.0,
  halftoneStrength = 0.7,
  brushSize = 80,
  trailFade = 0.97,
  hoverReveal = true,
  style,
}: DitherImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const trailProgramRef = useRef<WebGLProgram | null>(null);
  const mainProgramRef = useRef<WebGLProgram | null>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const targetMouseRef = useRef({ x: -9999, y: -9999 });
  const isMovingRef = useRef(0);
  const targetMovingRef = useRef(0);
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textureLoadedRef = useRef(false);
  const imageTexRef = useRef<WebGLTexture | null>(null);

  // Ping-pong trail buffers
  const trailFBRef = useRef<[WebGLFramebuffer, WebGLFramebuffer] | null>(null);
  const trailTexRef = useRef<[WebGLTexture, WebGLTexture] | null>(null);
  const pingPongRef = useRef(0);

  // Geometry buffers
  const quadBufRef = useRef<WebGLBuffer | null>(null);
  const texQuadBufRef = useRef<WebGLBuffer | null>(null);

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;
    glRef.current = gl;

    // ─── Trail program ───
    const trailVS = compileShader(gl, gl.VERTEX_SHADER, TRAIL_VS);
    const trailFS = compileShader(gl, gl.FRAGMENT_SHADER, TRAIL_FS);
    if (!trailVS || !trailFS) return;
    const trailProg = createProgram(gl, trailVS, trailFS);
    if (!trailProg) return;
    trailProgramRef.current = trailProg;

    // ─── Main program ───
    const mainVS = compileShader(gl, gl.VERTEX_SHADER, MAIN_VS);
    const mainFS = compileShader(gl, gl.FRAGMENT_SHADER, MAIN_FS);
    if (!mainVS || !mainFS) return;
    const mainProg = createProgram(gl, mainVS, mainFS);
    if (!mainProg) return;
    mainProgramRef.current = mainProg;

    // ─── Simple quad (for trail shader) ───
    const quadVerts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
    const quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
    quadBufRef.current = quadBuf;

    // ─── Textured quad (for main shader) ───
    const texQuadVerts = new Float32Array([
      -1,-1, 0,1,  1,-1, 1,1,  -1,1, 0,0,
      -1,1, 0,0,   1,-1, 1,1,   1,1, 1,0,
    ]);
    const texQuadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, texQuadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, texQuadVerts, gl.STATIC_DRAW);
    texQuadBufRef.current = texQuadBuf;

    // ─── Set main program static uniforms ───
    gl.useProgram(mainProg);
    const [rD, gD, bD] = hexToGL(darkColor);
    const [rL, gL, bL] = hexToGL(lightColor);
    gl.uniform3f(gl.getUniformLocation(mainProg, "u_darkColor"), rD, gD, bD);
    gl.uniform3f(gl.getUniformLocation(mainProg, "u_lightColor"), rL, gL, bL);
    gl.uniform1f(gl.getUniformLocation(mainProg, "u_dotSize"), dotSize);
    gl.uniform1f(gl.getUniformLocation(mainProg, "u_halftoneStrength"), halftoneStrength);
    gl.uniform1i(gl.getUniformLocation(mainProg, "u_image"), 0);
    gl.uniform1i(gl.getUniformLocation(mainProg, "u_trail"), 1);

    // ─── Set trail program static uniforms ───
    gl.useProgram(trailProg);
    gl.uniform1f(gl.getUniformLocation(trailProg, "u_brushSize"), brushSize);
    gl.uniform1f(gl.getUniformLocation(trailProg, "u_fadeRate"), trailFade);
    gl.uniform1i(gl.getUniformLocation(trailProg, "u_prevTrail"), 0);

    // ─── Load image texture ───
    const imageTex = gl.createTexture()!;
    imageTexRef.current = imageTex;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, imageTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255]));

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!gl) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      textureLoadedRef.current = true;
    };
    img.src = src;
  }, [src, darkColor, lightColor, dotSize, halftoneStrength, brushSize, trailFade]);

  const setupTrailBuffers = useCallback(() => {
    const gl = glRef.current;
    if (!gl) return;

    const w = gl.canvas.width;
    const h = gl.canvas.height;

    // Clean up old
    if (trailFBRef.current) {
      gl.deleteFramebuffer(trailFBRef.current[0]);
      gl.deleteFramebuffer(trailFBRef.current[1]);
    }
    if (trailTexRef.current) {
      gl.deleteTexture(trailTexRef.current[0]);
      gl.deleteTexture(trailTexRef.current[1]);
    }

    // Create ping-pong textures + framebuffers
    const texA = createTrailTexture(gl, w, h);
    const texB = createTrailTexture(gl, w, h);

    const fbA = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbA);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texA, 0);

    const fbB = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbB);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texB, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    trailTexRef.current = [texA, texB];
    trailFBRef.current = [fbA, fbB];
    pingPongRef.current = 0;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    setupTrailBuffers();
  }, [setupTrailBuffers]);

  const render = useCallback(() => {
    const gl = glRef.current;
    const trailProg = trailProgramRef.current;
    const mainProg = mainProgramRef.current;
    const trailFB = trailFBRef.current;
    const trailTex = trailTexRef.current;

    if (!gl || !trailProg || !mainProg || !trailFB || !trailTex || !textureLoadedRef.current) {
      animRef.current = requestAnimationFrame(render);
      return;
    }

    const w = gl.canvas.width;
    const h = gl.canvas.height;

    // ─── Smooth mouse ───
    const lerp = 0.35;
    mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerp;
    mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerp;

    // ─── Smooth isMoving ───
    isMovingRef.current += (targetMovingRef.current - isMovingRef.current) * 0.15;

    const pp = pingPongRef.current;
    const readIdx = pp;
    const writeIdx = 1 - pp;

    // ═══ PASS 1: Update trail (render to framebuffer) ═══
    gl.bindFramebuffer(gl.FRAMEBUFFER, trailFB[writeIdx]);
    gl.viewport(0, 0, w, h);
    gl.useProgram(trailProg);

    // Bind previous trail as input
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, trailTex[readIdx]);

    gl.uniform2f(gl.getUniformLocation(trailProg, "u_resolution"), w, h);
    gl.uniform2f(gl.getUniformLocation(trailProg, "u_mouse"),
      mouseRef.current.x, h - mouseRef.current.y);
    gl.uniform1f(gl.getUniformLocation(trailProg, "u_isMoving"), isMovingRef.current);

    // Draw quad
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBufRef.current);
    const trailPosAttr = gl.getAttribLocation(trailProg, "a_position");
    gl.enableVertexAttribArray(trailPosAttr);
    gl.vertexAttribPointer(trailPosAttr, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap
    pingPongRef.current = writeIdx;

    // ═══ PASS 2: Main render (to screen) ═══
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.useProgram(mainProg);

    // Image on unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, imageTexRef.current);

    // Trail on unit 1
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, trailTex[writeIdx]);

    gl.uniform2f(gl.getUniformLocation(mainProg, "u_resolution"), w, h);

    // Draw textured quad
    gl.bindBuffer(gl.ARRAY_BUFFER, texQuadBufRef.current);
    const mainPosAttr = gl.getAttribLocation(mainProg, "a_position");
    gl.enableVertexAttribArray(mainPosAttr);
    gl.vertexAttribPointer(mainPosAttr, 2, gl.FLOAT, false, 16, 0);
    const mainTexAttr = gl.getAttribLocation(mainProg, "a_texCoord");
    gl.enableVertexAttribArray(mainTexAttr);
    gl.vertexAttribPointer(mainTexAttr, 2, gl.FLOAT, false, 16, 8);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    initGL();
    resize();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animRef.current);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [initGL, resize, render]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !hoverReveal) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      targetMouseRef.current.x = (e.clientX - rect.left) * dpr;
      targetMouseRef.current.y = (e.clientY - rect.top) * dpr;

      targetMovingRef.current = 1;

      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = setTimeout(() => {
        targetMovingRef.current = 0;
      }, 150);
    },
    [hoverReveal]
  );

  const handleMouseLeave = useCallback(() => {
    targetMovingRef.current = 0;
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={alt}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
