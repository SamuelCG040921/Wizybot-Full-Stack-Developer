import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ChatbotController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/chatbot (POST) should return assistant response', async () => {
    const res = await request(app.getHttpServer())
      .post('/chatbot')
      .send({ query: 'I am looking for a phone' })
      .expect(200);

    expect(res.body).toHaveProperty('response');
    expect(typeof res.body.response).toBe('string');
  });

  afterAll(async () => {
    await app.close();
  });
});
