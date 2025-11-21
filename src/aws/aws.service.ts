import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {

    public s3Client: S3
    constructor(
        private configEnv: ConfigService,
    ) {
        this.s3Client = new S3({
            endpoint: this.configEnv.get('config.digOceanEndpoint'),
            region: 'us-east-1',
            credentials: {
                accessKeyId: this.configEnv.get('config.digOceanPKey'),
                secretAccessKey: this.configEnv.get('config.digOceanSKey')
            }
        })
    }
}
