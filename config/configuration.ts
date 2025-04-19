import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  serverEnv: process.env.SERVER_ENV,
  databaseUrl: process.env.DATABASE_URL,
  // port: parseInt(process.env.PORT, 10) || 3000,


  // mailPort: parseInt(process.env.MAIL_PORT),

  keyToken: process.env.KEY_TOKEN,
  keyTokenRefresh: process.env.KEY_TOKEN_REFRESH,

  // keyTwilioSid:process.env.TWILIO_ACCOUNT_SID,
  // keyTwiliotoken:process.env.TWILIO_AUTH_TOKEN,

  // keySinchUrl:process.env.SINCH_URL,
  // keySinchToken:process.env.SINCH_AUTH_TOKEN,
  // keySinchId:process.env.SINCH_ACCOUNT_ID,
  
  filesSgdUrl:process.env.FILES_SGD_URL,
  filesSgdFolder:process.env.FILES_SGD_FOLDER,

  // imagekitUrl: process.env.IMAGE_KIT_URL_ENDPOINT,
  // imagekitPublicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  // imagekitPrivateKey: process.env.IMAGE_KIT_PRIVATE_KEY,

  // rentacarUrl : process.env.RENTACAR_URL,
  // rentacarUser:process.env.RENTACAR_USER,
  // rentacarContrasena:process.env.RENTACAR_CONTRASENA,

}));
