import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Bucket } from "aws-cdk-lib/aws-s3";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class CuteCatsServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
   

const catsBucket = new Bucket(this, "CatsBucket", {
  bucketName: `cute-cats-upload-${this.account}`,
  versioned: false,
});

const uploadFunction = new NodejsFunction(this, "UploadCatFunction", {
  entry: "lambda/upload-handler.ts",
  runtime: Runtime.NODEJS_18_X,
  environment: {
    CATS_BUCKET: catsBucket.bucketName,
  },
});

catsBucket.grantPut(uploadFunction);


    
  }
}
