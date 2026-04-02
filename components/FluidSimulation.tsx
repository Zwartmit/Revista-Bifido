'use client';

import React, { useRef, useEffect } from 'react';

// --- VANILLA WEBGL FLUID SIMULATION ---
// Based on the classic WebGL Fluid Simulation by Pavel Do Great
// Optimized and simplified for a React background component

interface FluidSimulationProps {
  color?: string;
  opacity?: number;
  className?: string;
}

export default function FluidSimulation({ 
  color = '#CCFD29', 
  opacity = 0.6,
  className = "" 
}: FluidSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;

    // --- Shader Sources ---
    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Artistic "Smoky" Fluid approximation shader (Lightweight)
    const fluidFragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform vec2 uResolution;

      // --- 3D Simplex Noise ---
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        // Permutations
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 mouseUv = uMouse;
        
        // Correct aspect ratio for mouse distance
        vec2 distUv = (uv - mouseUv) * vec2(aspect, 1.0);
        float mouseDist = length(distUv);
        float mouseStrength = smoothstep(0.4, 0.0, mouseDist);
        
        // --- VIGNETTE MASK (Clears center, prevents screen flooding) ---
        vec2 centering = uv - 0.5;
        centering.x *= aspect; 
        float distFromCenter = length(centering);
        // Completely clear the center (0.0), scaling up strictly towards the edges (0.9 to 1.1 ensures only corners reach max density)
        float vignette = smoothstep(0.3, 1.0, distFromCenter);

        // --- FLUID NOISE (Larger, softer, less messy shapes) ---
        float timeScale = uTime * 0.1; // Slower evolution
        
        // Lower frequencies mean larger, more elegant smoke shapes instead of grainy noise
        float n1 = snoise(vec3(uv * 0.8, timeScale));
        float n2 = snoise(vec3(uv * 1.5, timeScale * 1.1 + n1 * 0.3));
        float n3 = snoise(vec3(uv * 3.0, timeScale * 1.2 + n2 * 0.4));
        
        // Sparser density: Requires much higher noise value to become visible smoke
        // This leaves the majority of the space completely clean/black.
        float density = smoothstep(0.1, 0.8, n3);
        
        // Add subtle mouse swiping influence (smaller radius)
        density += mouseStrength * 0.25;
        
        // Apply corner focus heavily
        float finalDensity = density * vignette;
        finalDensity = clamp(finalDensity, 0.0, 1.0);

        // Mix color with background
        vec3 baseColor = uColor * (finalDensity + 0.02);
        
        // Softer Glow effect to avoid harsh bright spots
        float glow = pow(finalDensity, 2.5) * 0.9;
        vec3 finalColor = baseColor + uColor * glow;

        gl_FragColor = vec4(finalColor, finalDensity * uOpacity);
      }
    `;

    // --- Helper to create shaders ---
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, baseVertexShader)!;
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fluidFragmentShader)!;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Buffers
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uColor = gl.getUniformLocation(program, 'uColor');
    const uOpacity = gl.getUniformLocation(program, 'uOpacity');
    const uResolution = gl.getUniformLocation(program, 'uResolution');

    // Static center for shader uniforms
    let mouseX = 0.5;
    let mouseY = 0.5;

    // Color conversion
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        ] : [1, 1, 1];
    };

    // Animation Loop
    let animationFrameId: number;
    const render = (time: number) => {
      if (!gl || !canvas) return;

      // Handle Resize
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      // Static mouse position
      mouseX = 0.5;
      mouseY = 0.5;

      // Update Uniforms
      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uOpacity, opacity);
      
      const rgb = hexToRgb(color);
      gl.uniform3f(uColor, rgb[0], rgb[1], rgb[2]);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, opacity]);

  return (
    <canvas 
        ref={canvasRef} 
        className={`w-full h-full block ${className}`}
        style={{ background: 'transparent' }}
    />
  );
}
