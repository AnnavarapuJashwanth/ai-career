import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Futuristic 3D Roadmap Component
 * Inspired by neon hexagonal platforms with glowing paths
 * Pure Three.js implementation (no React Three Fiber)
 */
export default function FuturisticRoadmap3D({ phases = [] }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const animationIdRef = useRef(null);
  const [hoveredPhase, setHoveredPhase] = useState(null);

  useEffect(() => {
    if (!containerRef.current || phases.length === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.Fog(0x050510, 5, 25);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 20);
    pointLight1.position.set(0, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 20);
    pointLight2.position.set(0, 5, -5);
    scene.add(pointLight2);

    // Create hexagonal platforms and paths
    const platformsGroup = new THREE.Group();
    const pathsGroup = new THREE.Group();
    const platforms = [];
    const paths = [];

    // Define phase positions and colors
    const phasePositions = [
      { x: -6, y: 0, z: 2, color: 0x00ffff, name: 'Foundation' },
      { x: 0, y: 1.5, z: -2, color: 0xff00ff, name: 'Intermediate' },
      { x: 6, y: 3, z: 2, color: 0xff0088, name: 'Advanced' },
    ];

    phases.forEach((phase, index) => {
      const pos = phasePositions[index] || phasePositions[phasePositions.length - 1];

      // Create hexagonal platform
      const hexShape = new THREE.Shape();
      const radius = 1.2;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) hexShape.moveTo(x, y);
        else hexShape.lineTo(x, y);
      }
      hexShape.lineTo(radius, 0);

      const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3,
      };

      const hexGeometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
      const hexMaterial = new THREE.MeshPhongMaterial({
        color: pos.color,
        emissive: pos.color,
        emissiveIntensity: 0.5,
        shininess: 100,
        transparent: true,
        opacity: 0.85,
      });

      const hexMesh = new THREE.Mesh(hexGeometry, hexMaterial);
      hexMesh.position.set(pos.x, pos.y, pos.z);
      hexMesh.rotation.x = -Math.PI / 2;
      hexMesh.userData = { phaseIndex: index, phase };

      // Add glowing edge
      const edgeGeometry = new THREE.EdgesGeometry(hexGeometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: pos.color,
        linewidth: 2,
      });
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      hexMesh.add(edges);

      platformsGroup.add(hexMesh);
      platforms.push(hexMesh);

      // Create connecting path to next platform
      if (index < phases.length - 1) {
        const nextPos = phasePositions[index + 1];
        const pathCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(pos.x, pos.y + 0.5, pos.z),
          new THREE.Vector3((pos.x + nextPos.x) / 2, (pos.y + nextPos.y) / 2 + 1, (pos.z + nextPos.z) / 2),
          new THREE.Vector3(nextPos.x, nextPos.y + 0.5, nextPos.z),
        ]);

        const tubeGeometry = new THREE.TubeGeometry(pathCurve, 40, 0.1, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({
          color: pos.color,
          emissive: pos.color,
          emissiveIntensity: 0.7,
          transparent: true,
          opacity: 0.6,
        });

        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
        pathsGroup.add(tubeMesh);
        paths.push(tubeMesh);

        // Add animated glow particles along the path
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 20;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
          const t = i / particleCount;
          const point = pathCurve.getPoint(t);
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
          color: pos.color,
          size: 0.15,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        particles.userData = { curve: pathCurve, particleCount };
        pathsGroup.add(particles);
        paths.push(particles);
      }

      // Add tech icons/towers above platforms
      const towerGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 6);
      const towerMaterial = new THREE.MeshPhongMaterial({
        color: pos.color,
        emissive: pos.color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.7,
      });

      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.set(pos.x, pos.y + 1.2, pos.z);
      platformsGroup.add(tower);

      // Add pulsing light on top of tower
      const lightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const lightMaterial = new THREE.MeshBasicMaterial({
        color: pos.color,
        transparent: true,
        opacity: 0.9,
      });
      const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
      lightSphere.position.set(pos.x, pos.y + 2, pos.z);
      lightSphere.userData = { initialY: pos.y + 2, phase: phase.name };
      platformsGroup.add(lightSphere);
      platforms.push(lightSphere);
    });

    scene.add(platformsGroup);
    scene.add(pathsGroup);

    // Add grid floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x00ffff, 0x004444);
    gridHelper.position.y = -1;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    scene.add(gridHelper);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(platforms, true);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.userData.phaseIndex !== undefined) {
          setHoveredPhase(intersected.userData.phase);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredPhase(null);
        document.body.style.cursor = 'default';
      }
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Rotate platform group slightly
      platformsGroup.rotation.y = Math.sin(time * 0.3) * 0.1;

      // Animate particles along paths
      paths.forEach((path) => {
        if (path.userData.curve) {
          const positions = path.geometry.attributes.position.array;
          for (let i = 0; i < path.userData.particleCount; i++) {
            const t = ((time * 0.5 + i / path.userData.particleCount) % 1);
            const point = path.userData.curve.getPoint(t);
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
          }
          path.geometry.attributes.position.needsUpdate = true;
        }
      });

      // Pulse lights
      platforms.forEach((platform) => {
        if (platform.userData.initialY) {
          platform.position.y = platform.userData.initialY + Math.sin(time * 2) * 0.1;
          platform.material.opacity = 0.7 + Math.sin(time * 3) * 0.3;
        }
      });

      // Camera gentle movement
      camera.position.x = Math.sin(time * 0.2) * 2;
      camera.lookAt(0, 1, 0);

      renderer.render(scene, camera);
    };

    animate();
    sceneRef.current = { scene, camera, renderer };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [phases]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Hover tooltip */}
      {hoveredPhase && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-cyan-500 rounded-lg p-4 pointer-events-none">
          <h4 className="text-cyan-400 font-bold text-lg mb-2">{hoveredPhase.name}</h4>
          <p className="text-white/80 text-sm mb-2">{hoveredPhase.duration}</p>
          <div className="flex flex-wrap gap-2">
            {hoveredPhase.skills?.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-300 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tech logos overlay with icons */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 justify-center">
        {phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="flex gap-2">
            {phase.skills?.slice(0, 3).map((skill, skillIndex) => {
              // Map skills to logo names
              const logoName = skill.includes('HTML') ? 'HTML5' :
                             skill.includes('CSS') ? 'CSS3' :
                             skill.includes('JavaScript') || skill === 'JavaScript' ? 'JavaScript' :
                             skill.includes('React') ? 'React' :
                             skill.includes('Node') ? 'NodeJS' :
                             skill.includes('SQL') ? 'SQL' :
                             skill.includes('TypeScript') ? 'TypeScript' :
                             skill.includes('Python') ? 'Python' :
                             skill.includes('Docker') ? 'Docker' :
                             skill.includes('AWS') || skill.includes('Cloud') ? 'AWS' :
                             null;

              return (
                <div
                  key={skillIndex}
                  className={`w-12 h-12 bg-black/70 backdrop-blur-sm border rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 ${
                    phaseIndex === 0 ? 'border-cyan-500/50 hover:border-cyan-500' :
                    phaseIndex === 1 ? 'border-purple-500/50 hover:border-purple-500' :
                    'border-pink-500/50 hover:border-pink-500'
                  }`}
                  title={skill}
                >
                  {logoName ? (
                    <span className="text-xl">
                      {logoName === 'HTML5' && <span title="HTML5">📄</span>}
                      {logoName === 'CSS3' && <span title="CSS3">🎨</span>}
                      {logoName === 'JavaScript' && <span title="JavaScript">⚡</span>}
                      {logoName === 'React' && <span title="React">⚛️</span>}
                      {logoName === 'NodeJS' && <span title="Node.js">💚</span>}
                      {logoName === 'SQL' && <span title="SQL">🗄️</span>}
                      {logoName === 'TypeScript' && <span title="TypeScript">📘</span>}
                      {logoName === 'Python' && <span title="Python">🐍</span>}
                      {logoName === 'Docker' && <span title="Docker">🐳</span>}
                      {logoName === 'AWS' && <span title="AWS/Cloud">☁️</span>}
                    </span>
                  ) : (
                    <span className="text-white text-[10px] font-bold text-center px-1">
                      {skill.slice(0, 4)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
