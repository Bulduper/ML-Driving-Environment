import * as THREE from 'three';
import { World } from "../world/World";

export class Helpers{
  private world: World;

  constructor(world: World){
    this.world = world;
  }

  public addPositionHelper(position: THREE.Vector3, hexColor = 0xffff00, radius = 0.1):void {
    const geometry = new THREE.SphereGeometry( radius, 6, 5 ); 
    const material = new THREE.MeshBasicMaterial( { color: hexColor } ); 
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.copy(position);
    this.world.graphicsWorld.add(sphere)
  }
}