import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Bucket } from "aws-cdk-lib/aws-s3";

export class CuteCatsServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
   

const catsBucket = new Bucket(this, "CatsBucket", {
  bucketName: `cute-cats-upload-${this.account}`,
  versioned: false,
});


    
  }
}
