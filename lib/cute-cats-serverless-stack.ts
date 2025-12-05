import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export class CuteCatsServerlessStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 bucket to store cat images
    const catsBucket = new Bucket(this, "CatsBucket", {
      bucketName: `cute-cats-upload-${this.account}`,
      versioned: false,
    });

    // Lambda: upload image
    const uploadFunction = new NodejsFunction(this, "UploadCatFunction", {
      entry: "lambda/upload-handler.ts",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        CATS_BUCKET: catsBucket.bucketName,
      },
    });

    catsBucket.grantPut(uploadFunction);

    // Lambda: list images
    const listFunction = new NodejsFunction(this, "ListCatsFunction", {
      entry: "lambda/list-cats-handler.ts",
      runtime: Runtime.NODEJS_18_X,
      environment: {
        CATS_BUCKET: catsBucket.bucketName,
      },
    });

    catsBucket.grantRead(listFunction);

    // API Gateway with CORS enabled
    const api = new RestApi(this, "CuteCatsApi", {
      restApiName: "Cute Cats Service",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "*"],
      },
    });

    // API route: /cats
    const catsResource = api.root.addResource("cats");

    // POST /cats/upload → upload cat image
    const uploadIntegration = new LambdaIntegration(uploadFunction);
    catsResource.addResource("upload").addMethod("POST", uploadIntegration);

    // GET /cats → get list of cat URLs
    const listIntegration = new LambdaIntegration(listFunction);
    catsResource.addMethod("GET", listIntegration);
  }
}
