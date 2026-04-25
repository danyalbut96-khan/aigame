export type TextureType = 'grass' | 'sand' | 'stone' | 'wood' | 'metal' | 'lava' | 'snow' | null;

export type ObjectType =
  | 'box'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'plane'
  | 'castle'
  | 'tree'
  | 'rock'
  | 'enemy'
  | 'player';

export interface SceneObject {
  id: string;
  type: ObjectType;
  label: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  texture: TextureType;
}

export interface FogConfig {
  color: string;
  near: number;
  far: number;
}

export interface LightConfig {
  color: string;
  intensity: number;
}

export interface DirectionalLightConfig extends LightConfig {
  position: [number, number, number];
}

export interface SceneData {
  background: string;
  fog: FogConfig | null;
  ambientLight: LightConfig;
  directionalLight: DirectionalLightConfig;
  objects: SceneObject[];
}

export interface GeneratedScene {
  scene: SceneData;
  description: string;
}
