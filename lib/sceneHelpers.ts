import * as THREE from 'three';
import type { SceneObject, TextureType } from './types';

// ─── Procedural Texture Generator ────────────────────────────────────────────

function drawTexturePattern(
  ctx: CanvasRenderingContext2D,
  texture: string,
  baseColor: string
): void {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 128, 128);

  switch (texture) {
    case 'grass':
      ctx.fillStyle = '#2d5a1b';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        ctx.strokeStyle = `hsl(${100 + Math.random() * 30}, 60%, ${25 + Math.random() * 20}%)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 6);
        ctx.stroke();
      }
      break;

    case 'sand':
      ctx.fillStyle = '#c2a35a';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const r = Math.random() * 2;
        ctx.fillStyle = `rgba(${180 + Math.random() * 40}, ${150 + Math.random() * 30}, 60, 0.3)`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'stone':
      ctx.fillStyle = '#666';
      ctx.fillRect(0, 0, 128, 128);
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 4; col++) {
          const x = col * 32 + (row % 2 === 0 ? 0 : 16);
          const y = row * 16;
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 2, y + 2, 28, 12);
          ctx.fillStyle = `hsl(0, 0%, ${50 + Math.random() * 20}%)`;
          ctx.fillRect(x + 2, y + 2, 28, 12);
        }
      }
      break;

    case 'wood':
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 12; i++) {
        const y = i * 11;
        ctx.strokeStyle = `hsl(25, 50%, ${25 + Math.random() * 20}%)`;
        ctx.lineWidth = 1 + Math.random();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(40, y + 2, 88, y - 2, 128, y);
        ctx.stroke();
      }
      break;

    case 'metal':
      const grad = ctx.createLinearGradient(0, 0, 128, 128);
      grad.addColorStop(0, '#555');
      grad.addColorStop(0.5, '#ccc');
      grad.addColorStop(1, '#555');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, i * 26);
        ctx.lineTo(128, i * 26 + 10);
        ctx.stroke();
      }
      break;

    case 'lava':
      ctx.fillStyle = '#1a0000';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const r = 5 + Math.random() * 15;
        const lavaGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
        lavaGrad.addColorStop(0, '#ff6600');
        lavaGrad.addColorStop(0.5, '#cc2200');
        lavaGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lavaGrad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'snow':
      ctx.fillStyle = '#e8f4f8';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const r = Math.random() * 3;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    default:
      break;
  }
}

export function buildMaterial(color: string, texture: TextureType): THREE.Material {
  if (!texture) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 });
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  drawTexturePattern(ctx, texture, color);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);

  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, metalness: 0.1 });
}

// ─── Composite Object Builders ────────────────────────────────────────────────

function buildCastleGroup(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.color, obj.texture || 'stone');

  // Main keep
  const keepGeo = new THREE.BoxGeometry(2, 3, 2);
  const keep = new THREE.Mesh(keepGeo, mat);
  keep.position.set(0, 1.5, 0);
  group.add(keep);

  // Four corner towers
  const towerPositions: [number, number][] = [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]];
  towerPositions.forEach(([tx, tz]) => {
    const towerGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 8);
    const tower = new THREE.Mesh(towerGeo, mat);
    tower.position.set(tx, 1.75, tz);
    group.add(tower);

    const capGeo = new THREE.ConeGeometry(0.45, 0.8, 8);
    const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: '#8b0000' }));
    cap.position.set(tx, 3.75, tz);
    group.add(cap);
  });

  // Gate arch
  const gateGeo = new THREE.BoxGeometry(0.6, 1.2, 0.3);
  const gate = new THREE.Mesh(gateGeo, new THREE.MeshStandardMaterial({ color: '#1a0a00' }));
  gate.position.set(0, 0.6, 1.05);
  group.add(gate);

  return group;
}

function buildTreeGroup(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();

  const trunkMat = buildMaterial('#6b3a2a', 'wood');
  const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(0, 0.75, 0);
  group.add(trunk);

  const leavesMat = buildMaterial(obj.color || '#2d8a3e', null);
  [0, 0.7, 1.3].forEach((yOff, i) => {
    const r = 0.9 - i * 0.2;
    const leavesGeo = new THREE.ConeGeometry(r, 1.2, 8);
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.set(0, 1.5 + yOff, 0);
    group.add(leaves);
  });

  return group;
}

function buildEnemyGroup(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.color || '#cc1111', null);

  const bodyGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 8);
  const body = new THREE.Mesh(bodyGeo, mat);
  body.position.set(0, 0.6, 0);
  group.add(body);

  const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const head = new THREE.Mesh(headGeo, mat);
  head.position.set(0, 1.45, 0);
  group.add(head);

  const eyeMat = new THREE.MeshStandardMaterial({ color: '#ff0000', emissive: '#ff0000', emissiveIntensity: 0.8 });
  [[-0.12, 0], [0.12, 0]].forEach(([ex]) => {
    const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(ex, 1.5, 0.32);
    group.add(eye);
  });

  return group;
}

function buildPlayerGroup(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.color || '#00aaff', null);

  const bodyGeo = new THREE.CylinderGeometry(0.28, 0.3, 1.1, 8);
  const body = new THREE.Mesh(bodyGeo, mat);
  body.position.set(0, 0.55, 0);
  group.add(body);

  const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const head = new THREE.Mesh(headGeo, mat);
  head.position.set(0, 1.3, 0);
  group.add(head);

  const helmetMat = new THREE.MeshStandardMaterial({ color: '#ffd700', metalness: 0.8, roughness: 0.2 });
  const helmetGeo = new THREE.SphereGeometry(0.32, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const helmet = new THREE.Mesh(helmetGeo, helmetMat);
  helmet.position.set(0, 1.3, 0);
  group.add(helmet);

  return group;
}

function buildSwordGroup(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  
  // Blade
  const bladeMat = buildMaterial(obj.color || '#cccccc', 'metal');
  const bladeGeo = new THREE.BoxGeometry(0.1, 1.2, 0.02);
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.set(0, 0.8, 0);
  group.add(blade);
  
  // Handle
  const handleMat = buildMaterial('#8B4513', 'wood');
  const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4);
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.position.set(0, 0.2, 0);
  group.add(handle);
  
  // Guard
  const guardMat = buildMaterial('#FFD700', 'metal');
  const guardGeo = new THREE.BoxGeometry(0.4, 0.05, 0.05);
  const guard = new THREE.Mesh(guardGeo, guardMat);
  guard.position.set(0, 0.4, 0);
  group.add(guard);

  return group;
}

function buildAnimalGroup(obj: SceneObject): THREE.Group {
  const group = new THREE.Group();
  const mat = buildMaterial(obj.color || '#8B4513', null);
  
  // Body
  const bodyGeo = new THREE.BoxGeometry(0.6, 0.5, 1.2);
  const body = new THREE.Mesh(bodyGeo, mat);
  body.position.set(0, 0.7, 0);
  group.add(body);
  
  // Head
  const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.5);
  const head = new THREE.Mesh(headGeo, mat);
  head.position.set(0, 1.1, 0.7);
  group.add(head);
  
  // Legs
  const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.6);
  [[-0.2, 0.4], [0.2, 0.4], [-0.2, -0.4], [0.2, -0.4]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, mat);
    leg.position.set(x, 0.3, z);
    group.add(leg);
  });
  
  return group;
}

// ─── Main Object Builder ──────────────────────────────────────────────────────

export function buildObject(obj: SceneObject): THREE.Object3D {
  let mesh: THREE.Object3D;

  switch (obj.type) {
    case 'castle':
      mesh = buildCastleGroup(obj);
      break;
    case 'tree':
    case 'plant':
      mesh = buildTreeGroup(obj);
      break;
    case 'enemy':
      mesh = buildEnemyGroup(obj);
      break;
    case 'player':
      mesh = buildPlayerGroup(obj);
      break;
    case 'horse':
    case 'animal':
      mesh = buildAnimalGroup(obj);
      break;
    case 'sword':
      mesh = buildSwordGroup(obj);
      break;
    case 'sphere': {
      const geo = new THREE.SphereGeometry(0.5, 32, 32);
      mesh = new THREE.Mesh(geo, buildMaterial(obj.color, obj.texture));
      break;
    }
    case 'cylinder': {
      const geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
      mesh = new THREE.Mesh(geo, buildMaterial(obj.color, obj.texture));
      break;
    }
    case 'cone': {
      const geo = new THREE.ConeGeometry(0.5, 1, 16);
      mesh = new THREE.Mesh(geo, buildMaterial(obj.color, obj.texture));
      break;
    }
    case 'plane': {
      const geo = new THREE.PlaneGeometry(20, 20, 20, 20);
      const planeMesh = new THREE.Mesh(geo, buildMaterial(obj.color, obj.texture));
      planeMesh.rotation.x = -Math.PI / 2;
      return applyTransforms(planeMesh, obj);
    }
    case 'rock': {
      const geo = new THREE.DodecahedronGeometry(0.5, 0);
      mesh = new THREE.Mesh(geo, buildMaterial(obj.color, obj.texture || 'stone'));
      break;
    }
    default: {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      mesh = new THREE.Mesh(geo, buildMaterial(obj.color, obj.texture));
      break;
    }
  }

  return applyTransforms(mesh, obj);
}

function applyTransforms(obj3d: THREE.Object3D, obj: SceneObject): THREE.Object3D {
  obj3d.position.set(...obj.position);
  obj3d.rotation.set(
    THREE.MathUtils.degToRad(obj.rotation[0]),
    THREE.MathUtils.degToRad(obj.rotation[1]),
    THREE.MathUtils.degToRad(obj.rotation[2])
  );
  obj3d.scale.set(...obj.scale);
  obj3d.castShadow = true;
  obj3d.receiveShadow = true;
  return obj3d;
}
