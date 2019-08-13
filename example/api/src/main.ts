import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CrudRequestInterceptor } from '@nestjsx/crud';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new CrudRequestInterceptor());
  setupSwagger(app);

  const options = new DocumentBuilder()
    .setTitle('New API')
    .setDescription(
      `
    
    `,
    )
    .setVersion('1.1')
    .setContactEmail('jeff.chung@mfwauction.com')

    .build();
  const document = SwaggerModule.createDocument(app, {
    ...options,
    swagger: 'test swagger',
  });
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
