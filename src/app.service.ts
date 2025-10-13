import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(
    private configEnv: ConfigService,
  ) { }

  getHello(): any {
    return {
      environment: this.configEnv.get('config.serverEnv'),
      message: 'Welcome to the API SGD',
    };
  }
}
