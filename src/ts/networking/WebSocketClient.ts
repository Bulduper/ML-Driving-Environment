// import WebSocket from 'ws';

import { Car } from "../vehicles/Car";
import { Vehicle } from "../vehicles/Vehicle";
import { World } from "../world/World";

export class WebSocketClient {
  private ws: WebSocket;
  public world: World;
  public vehicles: Vehicle[];
  constructor(world: World) {
    this.world = world;
    this.vehicles = world.vehicles;
  }

  public connectToServer(hostIp: string, port: string): void {
    this.ws = new WebSocket(`ws://${hostIp}:${port}`);
    this.registerCallbacks();
  }

  private registerCallbacks(): void {
    // Connection opened
    this.ws.addEventListener("open", (event) => {
      // this.ws.send("Hello Server!");
      setTimeout(()=>{
        this.sendFrame(document.getElementById('canvas') as HTMLCanvasElement);

      },3000)
    });

    // const datamodel = {
    //   turn: -0.4,
    //   gas: 0,
    //   restart: true
    // }

    this.ws.addEventListener("message", (event) => {
      console.log('event.data :>> ', event.data);
      const actionData = JSON.parse(event.data);
      if(actionData.turn < 0){
        this.vehicles[0].triggerAction('left', true);
        this.vehicles[0].triggerAction('right', false);
      }else if(actionData.turn > 0){
        this.vehicles[0].triggerAction('left', false);
        this.vehicles[0].triggerAction('right', true);
      }else{
        this.vehicles[0].triggerAction('left', false);
        this.vehicles[0].triggerAction('right', false);
      }

      if(actionData.throttle > 0){
        this.vehicles[0].triggerAction('throttle', true);
        this.vehicles[0].triggerAction('brake', false);
        this.vehicles[0].triggerAction('reverse', false);
      }else if(actionData.throttle < 0){
        this.vehicles[0].triggerAction('throttle', false);
        this.vehicles[0].triggerAction('brake', false);
        this.vehicles[0].triggerAction('reverse', true);
      }else{
        this.vehicles[0].triggerAction('throttle', false);
        this.vehicles[0].triggerAction('brake', false);
        this.vehicles[0].triggerAction('reverse', false);
      }
      console.log('actionData :>> ', actionData);
      if(actionData.restart){
        this.world.restartScenario();
      }

      if(actionData.observation){
        this.sendObservation();
      }
      
    })


    //   this.ws.on('open', () => {
    //     console.log('Connected to server');

    //     this.ws.send('Hello, server!');
    //   });

    //   this.ws.on('message', (message: string) => {
    //     console.log(`Received message from server: ${message}`);
    //   });

    //   this.ws.on('close', () => {
    //     console.log('Disconnected from server');
    //   });
  }

  public sendFrame(canvas: HTMLCanvasElement):void {
    const blob = canvas.toDataURL();
    this.ws.send(blob);
  }

  public sendObservation(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const car: Car = this.vehicles[0] as Car;
    
    const observation = {
      speed: car.speed,
      gear: car.gear,
      image: canvas.toDataURL()
    }
    this.ws.send(JSON.stringify(observation));
  }
}
