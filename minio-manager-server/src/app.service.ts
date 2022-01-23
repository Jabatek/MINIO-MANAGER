import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import * as Minio from 'minio';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { EventEmitter } from 'events';

export interface ISetting {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  thumbnailBucket: string;
}

@Injectable()
export class AppService implements OnApplicationShutdown {
  async onApplicationShutdown(signal: string) {
    console.log(
      await this.minioClient.getBucketNotification(this.setting.bucket),
    );
  }

  minioClient: Minio.Client;
  setting = {
    endPoint: process.env.DEFAULT_ENDPOINT,
    port: parseInt(process.env.DEFAULT_PORT),
    useSSL: false,
    accessKey: '',
    secretKey: '',
    bucket: '',
    thumbnailBucket: '',
  };
  bucketListener: EventEmitter;

  constructor() {
    this.initMinio();
  }

  async initMinio(fromDisk = true) {
    if (fromDisk)
      try {
        const _setting = fs.readFileSync(process.env.SETTING_PATH, 'utf-8');
        this.setting = { ...this.setting, ...JSON.parse(_setting) };
        console.log(this.setting);
      } catch (error) {
        console.error(error);
        return;
      }

    if (this?.setting.secretKey) {
      // remove removeAllListeners before connecting to new Minio client
      if (this.bucketListener) this.bucketListener.removeAllListeners();
      this.minioClient = new Minio.Client(this.setting);

      // prevent a total crash due to "The AWS Access Key Id does not exist in our records"
      this.minioClient.bucketExists(this.setting.bucket, (err, exists) => {
        console.log('result', this.setting.bucket, exists, err);

        if (exists) {
          this.bucketListener = this.minioClient.listenBucketNotification(
            this.setting.bucket,
            '',
            '',
            ['s3:ObjectCreated:*'],
          );
          this.bucketListener.on('notification', (record) => {
            if (record.s3.object.contentType.includes('image'))
              this.thumbnailGen(record);
          });
        }
      });
    }
  }

  // thumbnail Generator
  thumbnailGen(record) {
    // Allocate resize transformer from sharp().
    // resize to 100 pixels wide and 100 pixes in height,
    const transformer = sharp().resize(100, 100);

    // Sharp defaults to jpeg, to use other formats use
    // sharp() documentation at https://sharp.pixelplumbing.com/

    const bucketName = record.s3.bucket.name;
    const objectName = decodeURIComponent(record.s3.object.key);
    this.minioClient.getObject(bucketName, objectName, (err, dataStream) => {
      if (err) {
        return console.error(err);
      }
      const thumbnailName = objectName + '-thumbnail.jpg';
      this.minioClient.putObject(
        this.setting.thumbnailBucket,
        thumbnailName,
        dataStream.pipe(transformer),
        function (err) {
          if (err) {
            return console.error(err);
          }
          console.log('Successfully uploaded', '"' + thumbnailName + '"');
        },
      );
    });
  }
  // get public minio current server setting for antonymous user
  getPublicSetting(): ISetting {
    return { ...this.setting, accessKey: undefined, secretKey: undefined };
  }
  // get minio current server setting
  getSetting(): ISetting {
    return this.setting;
  }
  // Set minio server setting
  setSetting(setting: ISetting) {
    try {
      fs.writeFileSync(
        process.env.SETTING_PATH,
        JSON.stringify(setting),
        'utf-8',
      );
      this.setting = setting;
      this.initMinio(false);
    } catch (error) {
      console.error(error);
    }
  }

  getMinioClient() {
    return this.minioClient;
  }
  // Generates a presigned URL to post new object
  presignedPostObject(objectName: string): Promise<Minio.PostPolicyResult> {
    return new Promise((resolve, reject) => {
      const policy = this.minioClient.newPostPolicy();

      policy.setBucket(this.setting.bucket);
      policy.setKey(objectName);
      this.minioClient.presignedPostPolicy(policy, (err, data) => {
        if (err) {
          reject(reject);
          return;
        }
        resolve(data);
      });
    });
  }
  // Generates a presigned URL to get list of object in the bucket
  presignedGetObjects(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.minioClient.presignedUrl(
        'GET',
        this.setting.bucket,
        '',
        24 * 60 * 60,
        function (err, presignedUrl) {
          if (err) {
            reject(reject);
            return;
          }
          resolve(presignedUrl);
        },
      );
    });
  }

  // Generates a presigned URL to get the object
  presignedGetObject(objectName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.minioClient.presignedGetObject(
        this.setting.bucket,
        objectName,
        24 * 60 * 60,
        function (err, presignedUrl) {
          if (err) {
            reject(reject);
            return;
          }
          resolve(presignedUrl);
        },
      );
    });
  }
}
