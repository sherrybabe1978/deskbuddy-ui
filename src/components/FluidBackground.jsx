import React, { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);
    gl.compileShader(vertexShader);

    // Fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
      precision highp float;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= resolution.x / resolution.y;
        
        float t = time * 0.2;
        vec2 m = mouse * 2.0 - 1.0;
        
        float d = length(p - m);
        vec3 color = vec3(0.0);
        
        for(float i = 0.0; i < 3.0; i++) {
          float t2 = t + i * 0.8;
          vec2 p2 = p + vec2(
            sin(t2 + p.y * 4.0) * 0.1,
            cos(t2 + p.x * 4.0) * 0.1
          );
          
          float d2 = length(p2 - m) * exp(-length(p));
          
          color[int(i)] = 0.01 / d2;
        }
        
        color = mix(color, vec3(0.0), 0.8);
        color = pow(color, vec3(2.0));
        
        gl_FragColor = vec4(color, 1.0);
      }
    `);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    // Set attributes
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Get uniforms
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mouseLocation = gl.getUniformLocation(program, 'mouse');

    // Mouse handling
    let mouseX = 0.5;
    let mouseY = 0.5;
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX / canvas.width;
      mouseY = 1.0 - e.clientY / canvas.height;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const time = (Date.now() - startTime) * 0.001;
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'black',
      }}
    />
  );
};

export default FluidBackground;
