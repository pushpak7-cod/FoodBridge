'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Utensils, Truck, Building2, Eye, ShieldCheck, Compass, Info } from 'lucide-react';

interface ActiveNodeInfo {
  id: 'kitchen' | 'transit' | 'ngo';
  title: string;
  badge: string;
  status: string;
  detail: string;
  icon: string;
  color: string;
}

const NODES_DATA: Record<string, ActiveNodeInfo> = {
  kitchen: {
    id: 'kitchen',
    title: 'Surplus Kitchen Hub',
    badge: 'FSSAI License Verified',
    status: 'Surplus Packed at 65°C',
    detail: 'Commercial kitchen posts 60 fresh meals. Dynamic shelf-life timer automatically computes a safe 3-hour pickup window.',
    icon: '🍲',
    color: '#E8863A',
  },
  transit: {
    id: 'transit',
    title: 'Cold-Chain Dispatch Unit',
    badge: 'Live GPS & OTP Handoff',
    status: 'In-Transit • Speed 28 km/h',
    detail: 'Insulated thermal carrier maintains hygiene standards. Dual-OTP verification locks handoff between driver and kitchen dock.',
    icon: '🚚',
    color: '#D97528',
  },
  ngo: {
    id: 'ngo',
    title: 'Annam Relief Community Base',
    badge: 'Darpan 12A/80G Certified',
    status: 'Ready for Meal Distribution',
    detail: 'Local hunger relief NGO receives warm surplus meals, feeding 60 people at evening shelter without delay or food waste.',
    icon: '🏢',
    color: '#2F6E52',
  },
};

export default function InteractiveRescueLoop3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<'kitchen' | 'transit' | 'ngo'>('transit');
  const [isInteracting, setIsInteracting] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setSupportsWebGL(false);
        return;
      }
    } catch {
      setSupportsWebGL(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfff7ee, 0.025);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 7.5, 11);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lighting System — Golden Hour Ambient + Vivid Point Lights
    const ambientLight = new THREE.AmbientLight(0xfff3e5, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffecd2, 2.2);
    sunLight.position.set(8, 14, 6);
    scene.add(sunLight);

    // Node Point Lights
    const kitchenLight = new THREE.PointLight(0xe8863a, 3.5, 7);
    kitchenLight.position.set(-4.2, 1.2, 0);
    scene.add(kitchenLight);

    const ngoLight = new THREE.PointLight(0x2f6e52, 3.8, 7);
    ngoLight.position.set(4.2, 1.2, 0);
    scene.add(ngoLight);

    const vanLight = new THREE.PointLight(0xffa726, 3.0, 5);
    scene.add(vanLight);

    // 3. Ground Holographic Grid
    const gridHelper = new THREE.GridHelper(16, 24, 0xe8863a, 0xe2d7c7);
    gridHelper.position.y = -0.05;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.45;
    scene.add(gridHelper);

    // Subtle reflective glass pedestal under the route
    const groundGeo = new THREE.CylinderGeometry(6.5, 6.5, 0.1, 48);
    const groundMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.15,
      metalness: 0.05,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.1;
    scene.add(groundMesh);

    // 4. Curved Rescue Route Curve (Kitchen -> Apex -> NGO)
    const routeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.2, 0.2, 0),
      new THREE.Vector3(-2.2, 0.9, -1.2),
      new THREE.Vector3(0, 1.3, 0),
      new THREE.Vector3(2.2, 0.9, 1.2),
      new THREE.Vector3(4.2, 0.2, 0),
    ]);

    // Luminous Route Tube
    const tubeGeo = new THREE.TubeGeometry(routeCurve, 64, 0.08, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xe8863a,
      emissive: 0xd97528,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.4,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tubeMesh);

    // Pulses traveling on route
    const pulseCount = 8;
    const pulseGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulses: THREE.Mesh[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const p = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(p);
      pulses.push(p);
    }

    // 5. Node 1: Kitchen Station (Amber / Gold Pillar + Rotating Rings)
    const kitchenGroup = new THREE.Group();
    kitchenGroup.position.set(-4.2, 0, 0);

    const kBaseGeo = new THREE.CylinderGeometry(0.85, 1.05, 0.4, 24);
    const kBaseMat = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      metalness: 0.6,
      roughness: 0.2,
    });
    const kBase = new THREE.Mesh(kBaseGeo, kBaseMat);
    kitchenGroup.add(kBase);

    // Holographic Core
    const kCoreGeo = new THREE.OctahedronGeometry(0.55, 0);
    const kCoreMat = new THREE.MeshStandardMaterial({
      color: 0xe8863a,
      emissive: 0xe8863a,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const kCore = new THREE.Mesh(kCoreGeo, kCoreMat);
    kCore.position.y = 0.95;
    kitchenGroup.add(kCore);

    // Thermal Ring
    const kRingGeo = new THREE.TorusGeometry(0.8, 0.03, 16, 40);
    const kRingMat = new THREE.MeshBasicMaterial({ color: 0xffb366, wireframe: true });
    const kRing = new THREE.Mesh(kRingGeo, kRingMat);
    kRing.position.y = 0.95;
    kitchenGroup.add(kRing);
    scene.add(kitchenGroup);

    // 6. Node 2: NGO Relief Hub Station (Emerald Green Beacon + Rings)
    const ngoGroup = new THREE.Group();
    ngoGroup.position.set(4.2, 0, 0);

    const ngoBaseGeo = new THREE.CylinderGeometry(0.85, 1.05, 0.4, 24);
    const ngoBaseMat = new THREE.MeshStandardMaterial({
      color: 0x163324,
      metalness: 0.6,
      roughness: 0.2,
    });
    const ngoBase = new THREE.Mesh(ngoBaseGeo, ngoBaseMat);
    ngoGroup.add(ngoBase);

    // Relief Core
    const ngoCoreGeo = new THREE.IcosahedronGeometry(0.55, 0);
    const ngoCoreMat = new THREE.MeshStandardMaterial({
      color: 0x2f6e52,
      emissive: 0x2f6e52,
      emissiveIntensity: 1.4,
      roughness: 0.1,
    });
    const ngoCore = new THREE.Mesh(ngoCoreGeo, ngoCoreMat);
    ngoCore.position.y = 0.95;
    ngoGroup.add(ngoCore);

    // Shield Ring
    const ngoRingGeo = new THREE.TorusGeometry(0.8, 0.03, 16, 40);
    const ngoRingMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7, wireframe: true });
    const ngoRing = new THREE.Mesh(ngoRingGeo, ngoRingMat);
    ngoRing.position.y = 0.95;
    ngoGroup.add(ngoRing);
    scene.add(ngoGroup);

    // 7. Node 3: Active Cold-Chain Cargo Van Mesh
    const vanGroup = new THREE.Group();

    // Van Body
    const vBodyGeo = new THREE.BoxGeometry(0.75, 0.45, 1.1);
    const vBodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.4,
      roughness: 0.3,
    });
    const vBody = new THREE.Mesh(vBodyGeo, vBodyMat);
    vBody.position.y = 0.25;
    vanGroup.add(vBody);

    // Insulated Refrigeration Top Carrier
    const vTopGeo = new THREE.BoxGeometry(0.65, 0.2, 0.65);
    const vTopMat = new THREE.MeshStandardMaterial({
      color: 0xe8863a,
      metalness: 0.3,
      roughness: 0.2,
    });
    const vTop = new THREE.Mesh(vTopGeo, vTopMat);
    vTop.position.set(0, 0.55, -0.1);
    vanGroup.add(vTop);

    // Headlights
    const hlGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xfff7c2 });
    const hlLeft = new THREE.Mesh(hlGeo, hlMat);
    hlLeft.position.set(-0.25, 0.25, 0.55);
    const hlRight = new THREE.Mesh(hlGeo, hlMat);
    hlRight.position.set(0.25, 0.25, 0.55);
    vanGroup.add(hlLeft, hlRight);

    scene.add(vanGroup);

    // 8. Ambient Golden Floating Micro-particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = Math.random() * 4 + 0.2;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffb366,
      size: 0.07,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 9. Interactive Drag & Orbit
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      targetRotationY += deltaX * 0.005;
      targetRotationX = Math.max(-0.25, Math.min(0.25, targetRotationX + deltaY * 0.003));

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2500);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        setIsInteracting(true);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        targetRotationY += deltaX * 0.004;
        touchStartX = e.touches[0].clientX;
      }
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // 10. Animation Loop
    let animationFrameId: number;
    let progress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Idle auto-rotation when user is not dragging
      if (!isDragging) {
        targetRotationY += 0.0025;
      }

      // Smooth camera orbit interpolation
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.08;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.08;

      // Pulse rotation on Kitchen & NGO
      kCore.rotation.y += 0.02;
      kCore.rotation.x += 0.01;
      kRing.rotation.z += 0.015;

      ngoCore.rotation.y -= 0.018;
      ngoCore.rotation.z += 0.012;
      ngoRing.rotation.x += 0.015;

      // Van movement along route
      progress = (progress + 0.0035) % 1;
      const vanPos = routeCurve.getPointAt(progress);
      const tangent = routeCurve.getTangentAt(progress);

      vanGroup.position.copy(vanPos);
      vanGroup.position.y += 0.08;
      vanGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);

      vanLight.position.copy(vanPos);
      vanLight.position.y += 0.4;

      // Pulses animation
      for (let i = 0; i < pulseCount; i++) {
        const pOffset = (progress + (i / pulseCount)) % 1;
        const pPos = routeCurve.getPointAt(pOffset);
        pulses[i].position.copy(pPos);
      }

      // Floating particles slow drift
      particleSystem.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);

      // Disposal
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
    };
  }, []);

  const currentInfo = NODES_DATA[selectedNode];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/80 bg-gradient-to-b from-white/80 via-[#FFF9F2]/70 to-[#F6EFE6]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(34,40,43,0.08)]">
      {/* Top Interactive Toolbar */}
      <div className="p-4 sm:p-5 border-b border-stone-200/50 flex flex-wrap items-center justify-between gap-3 bg-white/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold text-sm">
            3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-ink">FoodBridge Real-Time Rescue Orbit</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-trust/10 text-accent-trust border border-accent-trust/20 animate-pulse">
                Interactive Holo-Loop
              </span>
            </div>
            <p className="text-[11px] text-ink-muted">Drag to rotate 3D view • Click stages to inspect live handoff protocols</p>
          </div>
        </div>

        {/* 3 Interactive Stage Buttons */}
        <div className="flex items-center gap-1.5 bg-white/70 p-1 rounded-2xl border border-stone-200/60 shadow-xs">
          <button
            onClick={() => setSelectedNode('kitchen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedNode === 'kitchen'
                ? 'bg-ink text-white shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-stone-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-accent-primary" />
            <span>1. Kitchen</span>
          </button>
          <button
            onClick={() => setSelectedNode('transit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedNode === 'transit'
                ? 'bg-ink text-white shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-stone-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-accent-primary" />
            <span>2. Transit</span>
          </button>
          <button
            onClick={() => setSelectedNode('ngo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedNode === 'ngo'
                ? 'bg-ink text-white shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-stone-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-accent-trust" />
            <span>3. NGO Hub</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] cursor-grab active:cursor-grabbing select-none">
        <div ref={containerRef} className="w-full h-full" />

        {/* Orbit Hint Watermark */}
        <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-1.5 text-[11px] font-medium text-ink-light bg-white/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white">
          <Compass className="w-3.5 h-3.5 animate-spin text-accent-primary" />
          <span>Interactive 360° Drag & Zoom</span>
        </div>

        {/* Live Stage Floating Detail Glass Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md pointer-events-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-2xl border border-white shadow-[0_12px_32px_rgba(34,40,43,0.12)] space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl select-none" role="img" aria-label={currentInfo.title}>
                  {currentInfo.icon}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-ink leading-tight">{currentInfo.title}</h4>
                  <span className="text-[11px] font-semibold text-accent-primary">{currentInfo.status}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-trust/10 text-accent-trust border border-accent-trust/20 shrink-0">
                {currentInfo.badge}
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">{currentInfo.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
