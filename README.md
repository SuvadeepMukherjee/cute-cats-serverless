# Cute Cats Serverless App

A simple serverless app to upload and view cat images.

## How It Works

- React frontend uploads images (Base64)

- API Gateway routes requests

- Lambda saves images to S3

- Another Lambda lists them as presigned URLs

- UI displays uploaded cats

## Run Backend

`npm install npm run build cdk deploy`

## Run Frontend

`npm install npm start`

Upload cats → see them instantly.



## Demo

![](./assets/cute-cats.png)

## Architecture Diagram

                ┌──────────────────┐
                │   React Frontend  │
                │  (User uploads)   │
                └───────┬──────────┘
                        │ POST/GET
                        ▼
            ┌────────────────────────┐
            │  Amazon API Gateway     │
            │  /cats/upload           │
            │  /cats                  │
            └───────────┬────────────┘
                        │ invokes
             ┌──────────┴───────────────┐
             │            AWS Lambda     │
             │                            │
     ┌────────────────────┐      ┌─────────────────────┐
     │ UploadCatFunction   │      │ ListCatsFunction     │
     │ Stores image in S3  │      │ Lists images &       │
     │                     │      │ creates presigned URLs │
     └─────────┬──────────┘      └──────────┬───────────┘
               │ WRITE                      │ READ
               ▼                             ▼
         ┌─────────────────────────────────────────┐
         │               Amazon S3                  │
         │  Bucket: cute-cats-upload-{account}      │
         │  Stores uploaded cat images              │
         └─────────────────────────────────────────┘
