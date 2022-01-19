import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as fs from 'fs';
import * as superagent from 'superagent';

const postPresignedObject = async (data) => {
  return new Promise((resolve, reject) => {
    const req = superagent.post(data.postURL);
    Object.keys(data.formData).forEach((key) =>
      req.field(key, data.formData[key]),
    );

    req.attach('file', 'test/minio.png');

    req.end(function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const config = JSON.parse(
    fs.readFileSync(process.env.SETTING_PATH.replace('test', 'dev'), 'utf-8'),
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    if (app) await app.close();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll((done) => {
    app.close();
    done();
  });

  it('get presignedPostObject responds with json and upload image then generate thumbnail', (done) => {
    request(app.getHttpServer())
      .get('/presignedPostObject/minio.png')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(async function (err, res) {
        await postPresignedObject(res.body)
          .then((res) => {
            console.log('Successfully Upload test/minio.png');
          })
          .catch((err) => {
            console.log('err', err.message);
          });
        if (err) return done(err);
        // wait for the thumbnail to be generated
        setTimeout(() => {
          done();
        }, 1000);
      });
  }, 12000);

  it('get pubic setting responds with json', () => {
    return request(app.getHttpServer())
      .get('/publicSetting')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('set setting responds with 201', () => {
    if (fs.existsSync(process.env.SETTING_PATH))
      fs.unlinkSync(process.env.SETTING_PATH);

    return request(app.getHttpServer())
      .post('/setting')
      .send(config)
      .set('Accept', 'application/json')
      .expect(201);
  });

  it('get setting responds with json', () => {
    return request(app.getHttpServer())
      .get('/setting')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('get presignedGetObjects responds with text', () => {
    return request(app.getHttpServer())
      .get('/presignedGetObjects')
      .expect('Content-Type', /text/)
      .expect(200);
  });
});
