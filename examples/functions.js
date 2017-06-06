const { Template, Output, Lambda, Ref } = require('../dist/index');

const prefixes = ['S3', 'EC2', 'ELB', 'SG', 'RDS'];
let t = Template()
  .add(
    Lambda.Function('S3ReleaseCacheLambdaFunction', {
      Code: {
        ZipFile: {
          'Fn::Join': [
            '\n',
            [
              "'use strict';",
              '',
              "const aws = require('aws-sdk');",
              'const s3 = new aws.S3({ maxRetries: 11 });',
              '',
              "const bucket = 'main';",
              "const keyPrefix = 'plugins/aws-resources/cache';",
              '',
              'exports.handler = (event, context, callback) => {',
              '  let results = [];',
              '  s3',
              '    .listBuckets({})',
              '    .promise()',
              '    .then(list => {',
              '      let shortList = list.Buckets;',
              '      let bucketPromises = [];',
              '      shortList.map(bucket => {',
              '        bucketPromises.push(',
              '          new Promise((resolve, reject) => {',
              '            s3',
              '              .getBucketTagging({ Bucket: bucket.Name })',
              '              .promise()',
              '              .then(tags => {',
              '                bucket.Tags = tags.TagSet;',
              '                bucket.ARN = `arn:aws:s3:::${bucket.Name}`;',
              '                resolve(bucket);',
              '              })',
              '              .catch(e => {',
              '                console.log(e);',
              '                bucket.Tags = [];',
              '                resolve(bucket);',
              '              });',
              '          })',
              '        );',
              '      });',
              '      return Promise.all(bucketPromises);',
              '    })',
              '    .then(buckets => {',
              '      let asv = buckets.reduce((a, c) => {',
              '        c.Tags.map(t => {',
              "          if (t.Key === 'ASV') {",
              '            if (!a[t.Value]) {',
              '              a[t.Value] = [];',
              '            }',
              '            a[t.Value].push(c);',
              '          }',
              '        });',
              '        return a;',
              '      }, {});',
              '      let s3SavePromises = [];',
              '      for (let a in asv) {',
              '        results.push({ name: a, content: asv[a] });',
              '        s3SavePromises.push(',
              '          s3',
              '            .putObject({',
              '              Bucket: bucket,',
              '              Key: `${keyPrefix}/${a}/123456789012/s3.json`,',
              '              Body: JSON.stringify(asv[a]),',
              "              ServerSideEncryption: 'AES256'",
              '            })',
              '            .promise()',
              '        );',
              '      }',
              '      return Promise.all(s3SavePromises);',
              '    })',
              '    .then(output => {',
              "      console.log('Finished updating records');",
              "      callback(null, 'Finished updating records');",
              '    })',
              '    .catch(e => {',
              '      console.error(e);',
              "      callback(e, 'Error!');",
              '    });',
              '};',
              ''
            ]
          ]
        }
      },
      FunctionName: 'S3ReleaseCacheLambdaFunction',
      Handler: 'index.handler',
      MemorySize: 256,
      Role: 'arn:aws:iam::123456789012:role/CapOne-CrossAccount-CustomRole-Chassis-lambda',
      Runtime: 'nodejs4.3',
      Timeout: 300
    })
  )
  .add(
    Lambda.Function('EC2ReleaseCacheLambdaFunction', {
      Code: {
        ZipFile: {
          'Fn::Join': [
            '\n',
            [
              "'use strict';",
              '',
              "const aws = require('aws-sdk');",
              'const ec2 = new aws.EC2({ maxRetries: 10 });',
              'const s3 = new aws.S3({ maxRetries: 10 });',
              '',
              "const bucket = 'main';",
              "const keyPrefix = 'plugins/aws-resources/cache';",
              '',
              'exports.handler = (event, context, callback) => {',
              '  let results = [];',
              '  ec2',
              '    .describeInstances()',
              '    .promise()',
              '    .then(list => {',
              '      let shortList = [];',
              '      list.Reservations.map(r => {',
              '        r.Instances.map(i => {',
              '          i.Name = i.InstanceId;',
              '          i.ARN = `arn:aws:ec2:us-east-1:123456789012:instance/${i.InstanceId}`;',
              '          shortList.push(i);',
              '        });',
              '      });',
              '      console.log(`Instance count: ${shortList.length}`);',
              '      let asv = shortList.reduce((a, c) => {',
              '        c.Tags.map(t => {',
              "          if (t.Key === 'ASV') {",
              '            if (!a[t.Value]) {',
              '              a[t.Value] = [];',
              '            }',
              '            a[t.Value].push(c);',
              '          }',
              '        });',
              '        return a;',
              '      }, {});',
              '      console.log(JSON.stringify(asv, null, 2));',
              '      let s3SavePromises = [];',
              '      for (let a in asv) {',
              '        results.push({ name: a, content: asv[a] });',
              '        s3SavePromises.push(',
              '          s3',
              '            .putObject({',
              '              Bucket: bucket,',
              '              Key: `${keyPrefix}/${a}/123456789012/ec2.json`,',
              '              Body: JSON.stringify(asv[a]),',
              "              ServerSideEncryption: 'AES256'",
              '            })',
              '            .promise()',
              '        );',
              '      }',
              '      return Promise.all(s3SavePromises);',
              '    })',
              '    .then(output => {',
              "      console.log('Finished updating records');",
              "      callback(null, 'Finished updating records');",
              '    })',
              '    .catch(e => {',
              '      console.error(e);',
              "      callback(e, 'Error!');",
              '    });',
              '};',
              ''
            ]
          ]
        }
      },
      FunctionName: 'EC2ReleaseCacheLambdaFunction',
      Handler: 'index.handler',
      MemorySize: 256,
      Role: 'arn:aws:iam::123456789012:role/CapOne-CrossAccount-CustomRole-Chassis-lambda',
      Runtime: 'nodejs4.3',
      Timeout: 300
    })
  )
  .add(
    Lambda.Function('ELBReleaseCacheLambdaFunction', {
      Code: {
        ZipFile: {
          'Fn::Join': [
            '\n',
            [
              "'use strict';",
              '',
              "const aws = require('aws-sdk');",
              'const elb = new aws.ELB({ maxRetries: 10 });',
              'const s3 = new aws.S3({ maxRetries: 10 });',
              '',
              "const bucket = 'main';",
              "const keyPrefix = 'plugins/aws-resources/cache';",
              '',
              'exports.handler = (event, context, callback) => {',
              '  let results = [];',
              '  elb',
              '    .describeLoadBalancers({})',
              '    .promise()',
              '    .then(list => {',
              '      let shortList = list.LoadBalancerDescriptions;',
              '      let elbNames = [];',
              '',
              '      shortList.map(elb => {',
              '        elbNames.push(elb.LoadBalancerName);',
              '      });',
              '',
              '      let blocks = [];',
              '      let chunk = 20;',
              '      let j;',
              '      for (let i = 0, j = elbNames.length; i < j; i += chunk) {',
              '        blocks.push(elbNames.slice(i, i + chunk));',
              '      }',
              '',
              '      let bucketPromises = [];',
              '      blocks.map(block => {',
              '        bucketPromises.push(',
              '          new Promise((resolve, reject) => {',
              '            elb',
              '              .describeTags({ LoadBalancerNames: block })',
              '              .promise()',
              '              .then(tags => {',
              '                resolve(tags.TagDescriptions);',
              '              })',
              '              .catch(e => {',
              '                console.log(e);',
              '                resolve({ TagDescriptions: [] });',
              '              });',
              '          })',
              '        );',
              '      });',
              '      return Promise.all(bucketPromises);',
              '    })',
              '    .then(elbs => {',
              '      let elbResults = [];',
              '      elbs.map(block => {',
              '        block.map(elb => {',
              '          elb.Name = elb.LoadBalancerName;',
              '          elb.ARN = `arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/${elb.LoadBalancerName}`;',
              '          elbResults.push(elb);',
              '        });',
              '      });',
              '      let asv = elbResults.reduce((a, c) => {',
              '        c.Tags.map(t => {',
              "          if (t.Key === 'ASV') {",
              '            if (!a[t.Value]) {',
              '              a[t.Value] = [];',
              '            }',
              '            a[t.Value].push(c);',
              '          }',
              '        });',
              '        return a;',
              '      }, {});',
              '      let s3SavePromises = [];',
              '      for (let a in asv) {',
              '        results.push({ name: a, content: asv[a] });',
              '        s3SavePromises.push(',
              '          s3',
              '            .putObject({',
              '              Bucket: bucket,',
              '              Key: `${keyPrefix}/${a}/123456789012/elb.json`,',
              '              Body: JSON.stringify(asv[a]),',
              "              ServerSideEncryption: 'AES256'",
              '            })',
              '            .promise()',
              '        );',
              '      }',
              '      return Promise.all(s3SavePromises);',
              '    })',
              '    .then(output => {',
              "      console.log('Finished updating records');",
              "      callback(null, 'Finished updating records');",
              '    })',
              '    .catch(e => {',
              '      console.error(e);',
              "      callback(e, 'Error!');",
              '    });',
              '};',
              ''
            ]
          ]
        }
      },
      FunctionName: 'ELBReleaseCacheLambdaFunction',
      Handler: 'index.handler',
      MemorySize: 256,
      Role: 'arn:aws:iam::123456789012:role/CapOne-CrossAccount-CustomRole-Chassis-lambda',
      Runtime: 'nodejs4.3',
      Timeout: 300
    })
  )
  .add(
    Lambda.Function('SGReleaseCacheLambdaFunction', {
      Code: {
        ZipFile: {
          'Fn::Join': [
            '\n',
            [
              "'use strict';",
              '',
              "const aws = require('aws-sdk');",
              'const ec2 = new aws.EC2({ maxRetries: 10 });',
              'const s3 = new aws.S3({ maxRetries: 10 });',
              '',
              "const bucket = 'main';",
              "const keyPrefix = 'plugins/aws-resources/cache';",
              '',
              'exports.handler = (event, context, callback) => {',
              '  let results = [];',
              '  ec2',
              '    .describeSecurityGroups()',
              '    .promise()',
              '    .then(list => {',
              '      let shortList = [];',
              '      list.SecurityGroups.map(sg => {',
              '        sg.Name = sg.GroupName;',
              '        sg.ARN = `arn:aws:ec2:us-east-1:123456789012:security-group/${sg.GroupId}`;',
              '        shortList.push(sg);',
              '      });',
              '      let asv = shortList.reduce((a, c) => {',
              '        c.Tags.map(t => {',
              "          if (t.Key === 'ASV') {",
              '            if (!a[t.Value]) {',
              '              a[t.Value] = [];',
              '            }',
              '            a[t.Value].push(c);',
              '          }',
              '        });',
              '        return a;',
              '      }, {});',
              '      console.log(JSON.stringify(asv, null, 2));',
              '      let s3SavePromises = [];',
              '      for (let a in asv) {',
              '        results.push({ name: a, content: asv[a] });',
              '        s3SavePromises.push(',
              '          s3',
              '            .putObject({',
              '              Bucket: bucket,',
              '              Key: `${keyPrefix}/${a}/123456789012/sg.json`,',
              '              Body: JSON.stringify(asv[a]),',
              "              ServerSideEncryption: 'AES256'",
              '            })',
              '            .promise()',
              '        );',
              '      }',
              '      return Promise.all(s3SavePromises);',
              '    })',
              '    .then(output => {',
              "      console.log('Finished updating records');",
              "      callback(null, 'Finished updating records');",
              '    })',
              '    .catch(e => {',
              '      console.error(e);',
              "      callback(e, 'Error!');",
              '    });',
              '};',
              ''
            ]
          ]
        }
      },
      FunctionName: 'SGReleaseCacheLambdaFunction',
      Handler: 'index.handler',
      MemorySize: 256,
      Role: 'arn:aws:iam::123456789012:role/CapOne-CrossAccount-CustomRole-Chassis-lambda',
      Runtime: 'nodejs4.3',
      Timeout: 300
    })
  )
  .add(
    Lambda.Function('RDSReleaseCacheLambdaFunction', {
      Code: {
        ZipFile: {
          'Fn::Join': [
            '\n',
            [
              "'use strict';",
              '',
              "const aws = require('aws-sdk');",
              'const rds = new aws.RDS({ maxRetries: 10 });',
              'const s3 = new aws.S3({ maxRetries: 10 });',
              '',
              "const bucket = 'main';",
              "const keyPrefix = 'plugins/aws-resources/cache';",
              '',
              'exports.handler = (event, context, callback) => {',
              "  console.log('Executing');",
              '  let results = [];',
              '  let instances = [];',
              '  rds',
              '    .describeDBInstances({})',
              '    .promise()',
              '    .then(list => {',
              '      list.DBInstances.map(instance => {',
              '        instances.push(instance);',
              '      });',
              '      //TOTAL HACK, MUST FIX',
              '      return rds.describeDBInstances({ Marker: list.Marker }).promise();',
              '    })',
              '    .then(list => {',
              '      list.DBInstances.map(instance => {',
              '        instances.push(instance);',
              '      });',
              '      return rds.describeDBInstances({ Marker: list.Marker }).promise();',
              '    })',
              '    .then(list => {',
              '      list.DBInstances.map(instance => {',
              '        instances.push(instance);',
              '      });',
              '      let bucketPromises = [];',
              '      instances.map(inst => {',
              '        inst.Name = inst.DBName;',
              '        inst.ARN = inst.DBInstanceArn;',
              '        bucketPromises.push(',
              '          new Promise((resolve, reject) => {',
              '            rds',
              '              .listTagsForResource({ ResourceName: inst.DBInstanceArn })',
              '              .promise()',
              '              .then(tags => {',
              '                inst.Tags = tags.TagList;',
              '                resolve(inst);',
              '              })',
              '              .catch(e => {',
              '                console.log(e);',
              '                inst.Tags = [];',
              '                resolve(inst);',
              '              });',
              '          })',
              '        );',
              '      });',
              '      return Promise.all(bucketPromises);',
              '    })',
              '    .then(instances => {',
              '      let asv = instances.reduce((a, c) => {',
              '        c.Tags.map(t => {',
              "          if (t.Key === 'ASV') {",
              '            if (!a[t.Value]) {',
              '              a[t.Value] = [];',
              '            }',
              '            a[t.Value].push(c);',
              '          }',
              '        });',
              '        return a;',
              '      }, {});',
              '      let s3SavePromises = [];',
              '      for (let a in asv) {',
              '        results.push({ name: a, content: asv[a] });',
              '        s3SavePromises.push(',
              '          s3',
              '            .putObject({',
              '              Bucket: bucket,',
              '              Key: `${keyPrefix}/${a}/123456789012/rds.json`,',
              '              Body: JSON.stringify(asv[a]),',
              "              ServerSideEncryption: 'AES256'",
              '            })',
              '            .promise()',
              '        );',
              '      }',
              '      return Promise.all(s3SavePromises);',
              '    })',
              '    .then(output => {',
              "      console.log('Finished updating records');",
              "      callback(null, 'Finished updating records');",
              '    })',
              '    .catch(e => {',
              '      console.error(e);',
              "      callback(e, 'Error!');",
              '    });',
              '};',
              ''
            ]
          ]
        }
      },
      FunctionName: 'RDSReleaseCacheLambdaFunction',
      Handler: 'index.handler',
      MemorySize: 256,
      Role: 'arn:aws:iam::123456789012:role/CapOne-RetailBank-Dev-CustomRole-',
      Runtime: 'nodejs4.3',
      Timeout: 300
    })
  );
prefixes.map(p => {
  t = t.add(
    Output(`${p}FunctionOutput`, {
      Description: `${p} Bucket Cache Function.`,
      Value: Ref(`${p}ReleaseCacheLambdaFunction`)
    })
  );
});

console.log(JSON.stringify(t.build(), null, 2));
