// import WebSocket from 'ws';

import { Socket, io } from "socket.io-client";
import { Car } from "../vehicles/Car";
import { Vehicle } from "../vehicles/Vehicle";
import { World } from "../world/World";

export class SocketIOClient {
  private sio: Socket;
  public world: World;
  public vehicles: Vehicle[];
  constructor(world: World) {
    this.world = world;
    this.vehicles = world.vehicles;
  }

  public connectToServer(hostIp: string, port: number): void {
    // this.sio = io(
    // {
    //   extraHeaders: {
    //     "client": "environment"
    //   }, port:port,
    //   hostname: `http://${hostIp}`,
    //   transports:['websocket'],
    //   // protocols:['http']
    // });
    this.sio = io('http://localhost:8888',{extraHeaders:{"client": "environment"}})
    this.registerCallbacks();
  }

  private registerCallbacks(): void {
    // Connection opened
    this.sio.on("connect", () => {
      // this.ws.send("Hello Server!");
      setTimeout(()=>{
        // this.sendFrame(document.getElementById('canvas') as HTMLCanvasElement);

      },3000)
    });

    // const datamodel = {
    //   turn: -0.4,
    //   gas: 0,
    //   restart: true
    // }

    this.sio.on("action", (data) => {
      // console.log('event.data :>> ', event.data);
      const actionData = data;
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

      // if(actionData.observation){
      // }
      this.sendObservation();
      
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
    this.sio.emit("send_observation",blob);
    // this.sio.emit("send_observation","hello there");

  }


  public sendObservation(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const car: Car = this.vehicles[0] as Car;
    const resizedCanvas = this.resizeCanvasImage(canvas,[100,100]);
    const observation = {
      speed: car.speed,
      gear: car.gear,
      image: this.convertToBase64(resizedCanvas)
    }
    console.log("Sending observation");
    this.sio.emit("observation",JSON.stringify(observation));
  }

  // To be moved somewhere else
  public resizeCanvasImage(sourceCanvas: HTMLCanvasElement, targetShape=[100,100]){
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = targetShape[0];
    outputCanvas.height = targetShape[1];
    const ctx = outputCanvas.getContext("2d");
    ctx.drawImage(sourceCanvas,0,0,targetShape[0],targetShape[1]);
    return outputCanvas;
  }

  public convertToBase64(canvas: HTMLCanvasElement){
    return canvas.toDataURL();
  }
}
