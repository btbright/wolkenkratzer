import { Service } from 'aws-sdk';
import { IResource, TransformFunctionType } from '../types';
import { CloudTrail } from './CloudTrail';
import { EC2 } from './EC2';
import { S3 } from './S3';

export const Transform = {
  /*
  ApiGateway
  ApplicationAutoScaling
  Athena
  AutoScaling
  Batch
  CertificateManager
  CloudFormation
  CloudFront
  */
  CloudTrail,
  /*
  CloudWatch
  CodeBuild
  CodeCommit
  CodeDeploy
  CodePipeline
  Cognito
  Config
  DAX
  DMS
  DataPipeline
  DirectoryService
  DynamoDB
  */
  EC2,
  /*
  ECR
  ECS
  EFS
  EMR
  ElastiCache
  ElasticBeanstalk
  ElasticLoadBalancing
  ElasticLoadBalancingV2
  Elasticsearch
  Events
  GameLift
  Glue
  IAM
  IoT
  KMS
  Kinesis
  KinesisAnalytics
  KinesisFirehose
  Logs
  OpsWorks
  Pseudo
  RDS
  Redshift
  Route53
  SDB
  SNS
  SQS
  SSM
  StepFunctions
  Transform
  WAF
  WAFRegional
  WorkSpaces
  */
  S3,
};
