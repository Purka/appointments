import { Controller } from "../controllers/Controller";

export interface IExpressApplicationConfig {
  controllers?: Controller[];
  middlewares?: any[];
  config?: any;
  errorHandler?: any;
}
