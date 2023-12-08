export class Route {
  constructor(public method: string, public path: string, public handler: any) {
    this.method = method;
    this.path = path;
    this.handler = handler;
  }
}


