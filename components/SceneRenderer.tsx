'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildObject } from '@/lib/sceneHelpers';
import type { GeneratedScene } from '@/lib/types';

interface SceneRendererProps {
  scene: GeneratedScene | null;
  onReady?: (canvas: HTMLCanvasElement) => void;
}

export default function SceneRenderer({ scene, onReady }: SceneRendererProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameRef = useRef<number | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);

  // Init Three.js once
  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color('#0a0f1a');
    sceneRef.current = threeScene;

    // Default ambient light
    const ambient = new THREE.AmbientLight('#ffffff', 0.3);
    threeScene.add(ambient);

    // Grid helper for empty state
    const grid = new THREE.GridHelper(20, 20, '#00f5ff', '#0a2a3a');
    (grid as THREE.GridHelper & { __isGrid: boolean }).__isGrid = true;
    threeScene.add(grid);

    // Objects group
    const group = new THREE.Group();
    objectsGroupRef.current = group;
    threeScene.add(group);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(8, 8, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 40;
    controls.maxPolarAngle = Math.PI / 2.1;
    controlsRef.current = controls;

    // Animate
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(threeScene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    if (onReady) onReady(renderer.domElement);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update scene when data changes
  const buildScene = useCallback(() => {
    const threeScene = sceneRef.current;
    const group = objectsGroupRef.current;
    if (!threeScene || !group || !scene) return;

    // Remove existing objects from group
    while (group.children.length) {
      const child = group.children[0];
      group.remove(child);
    }

    // Remove old lights (keep grid for now)
    threeScene.children
      .filter((c) => c instanceof THREE.Light)
      .forEach((l) => threeScene.remove(l));

    // Remove grid once scene is loaded
    threeScene.children
      .filter((c) => (c as THREE.GridHelper & { __isGrid?: boolean }).__isGrid)
      .forEach((g) => threeScene.remove(g));

    const { scene: sd } = scene;

    // Background + fog
    threeScene.background = new THREE.Color(sd.background);
    if (sd.fog) {
      threeScene.fog = new THREE.Fog(sd.fog.color, sd.fog.near, sd.fog.far);
    } else {
      threeScene.fog = null;
    }

    // Lights
    const ambient = new THREE.AmbientLight(sd.ambientLight.color, sd.ambientLight.intensity);
    threeScene.add(ambient);

    const dirLight = new THREE.DirectionalLight(
      sd.directionalLight.color,
      sd.directionalLight.intensity
    );
    dirLight.position.set(...sd.directionalLight.position);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    threeScene.add(dirLight);

    // Build objects
    sd.objects.forEach((obj) => {
      try {
        const mesh = buildObject(obj);
        group.add(mesh);
      } catch (e) {
        console.warn('Failed to build object:', obj.id, e);
      }
    });
  }, [scene]);

  useEffect(() => {
    buildScene();
  }, [buildScene]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}
