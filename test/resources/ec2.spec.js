/**
 * Created by arming on 6/5/16.
 */
'use strict'

const path = require('path')
const chai = require('chai')
chai.config.truncateThreshold = 0
chai.should()
var should = require('chai').should()

const wk = require(path.join(__dirname, '..', '..', 'index'))
const AWS = require('aws-sdk')
const CloudFormation = new AWS.CloudFormation({ region: 'us-east-1' })

describe('EC2', () => {

  describe ('Instance', () => {
    let t = new wk.Template()

    let instance = new wk.EC2.Instance('myinstance')
    instance.ImageId = 'ami-951945d0'
    instance.InstanceType = 't2.micro'
    t.addResource(instance)
    // console.log(JSON.stringify(t.Resources['myinstance'], null, 2))

    it ('should be able to add an instance to the template', () => {
      t.Resources[ 'myinstance' ].resourceType.should.equal('AWS::EC2::Instance')
    })

    it ('should generate the expected JSON template', () => {
      let jsonString = JSON.parse(t.toJson())
      jsonString.should.deep.equal({
        'Resources': {
          'myinstance': {
            'Type': 'AWS::EC2::Instance',
            'Properties': {
              'ImageId': 'ami-951945d0',
              'InstanceType': 't2.micro'
            }
          }
        },
        'AWSTemplateFormatVersion': '2010-09-09'
      })
    })

    it ('CloudFormation should validate the template', () => {
      let jsonString = t.toJson()
      CloudFormation.validateTemplate({
        TemplateBody: jsonString
      }, (err, data) => {
        if (err) {
          console.error(err)
        }
        should.exist(data)
      })
    })

    it ('should handle property arrays for things like SecurityGroupIds', () => {
      instance.SecurityGroupIds = ['sg-12345', 'sg-4567']
      let jsonString = JSON.parse(t.toJson())
      jsonString.should.deep.equal({
        'Resources': {
          'myinstance': {
            'Type': 'AWS::EC2::Instance',
            'Properties': {
              'ImageId': 'ami-951945d0',
              'InstanceType': 't2.micro',
              'SecurityGroupIds': ['sg-12345', 'sg-4567']
            }
          }
        },
        'AWSTemplateFormatVersion': '2010-09-09'
      })
    })

    it('should handle arrays of sub objects like Amazon EC2 Block Device Mapping Property', () => {
      let device = new wk.Types.AmazonElasticBlockStoreBlockDeviceProperty()
      device.SnapshotId = 'snap-xxxxxx'
      device.VolumeSize = '50'
      device.VolumeType = 'io1'
      device.Iops = 1000
      device.DeleteOnTermination = false
      let mapping = new wk.Types.AmazonEC2BlockDeviceMappingProperty()
      mapping.DeviceName = '/dev/sdc'
      mapping.Ebs = device
      instance.BlockDeviceMappings.push(mapping)
      let jsonString = JSON.parse(t.toJson())
      jsonString.should.deep.equal({
        'Resources': {
          'myinstance': {
            'Type': 'AWS::EC2::Instance',
            'Properties': {
              'ImageId': 'ami-951945d0',
              'InstanceType': 't2.micro',
              'SecurityGroupIds': ['sg-12345', 'sg-4567'],
              'BlockDeviceMappings': [
                {
                  'DeviceName':'/dev/sdc',
                  'Ebs':{
                    'SnapshotId':'snap-xxxxxx',
                    'VolumeSize':'50',
                    'VolumeType':'io1',
                    'Iops': 1000,
                    'DeleteOnTermination': false
                  }
                }
              ]
            }
          }
        },
        'AWSTemplateFormatVersion': '2010-09-09'
      })
    })

  })

  describe('VPC', () => {

    let t = new wk.Template()

    let vpc = new wk.EC2.VPC('myvpc')
    vpc.CidrBlock = '10.0.0.0/16'
    vpc.InstanceTenancy = 'default'
    vpc.EnableDnsSupport = true
    vpc.EnableDnsHostnames = true

    t.addResource(vpc)

    it('should be able to add an instance to the template', () => {
      t.Resources[ 'myvpc' ].resourceType.should.equal('AWS::EC2::VPC')
    })

    it('should generate the expected JSON template', () => {
      let jsonString = JSON.parse(t.toJson())
      jsonString.should.deep.equal({
        'Resources': {
          'myvpc': {
            'Type': 'AWS::EC2::VPC',
            'Properties': {
              'CidrBlock': '10.0.0.0/16',
              'EnableDnsSupport': true,
              'EnableDnsHostnames': true,
              'InstanceTenancy': 'default'
            }
          }
        },
        'AWSTemplateFormatVersion': '2010-09-09'
      })
    })
  })

  describe('VPNGatewayAttachment', () => {

    let t = new wk.Template()

    let vpnGateway = new wk.EC2.VPNGateway('VPNGateway')
    vpnGateway.Type = 'ipsec.1'
    t.addResource(vpnGateway)

    it ('should be able to add a VPN Gateway to the template', () => {
      t.Resources['VPNGateway'].resourceType.should.equal('AWS::EC2::VPNGateway')
    })

    it('conditional should be tested, only ipsec.1 can be allowed as the type', () => {
      vpnGateway.Type = 'ipsec.2'
      try {
        t.toJson()
      } catch(e) {
        e.message.should.equal('VPNGateway has a condition that was not met: The only valid value for Type is "ipsec.1"')
      }
    })

    it ('should generate the expected JSON template', () => {
      vpnGateway.Type = 'ipsec.1'
      let jsonString = JSON.parse(t.toJson())
      jsonString.should.deep.equal({
        'Resources': {
          'VPNGateway': {
            'Type': 'AWS::EC2::VPNGateway',
            'Properties': {
              'Type': 'ipsec.1'
            }
          }
        },
        'AWSTemplateFormatVersion': '2010-09-09'
      })
    })

    it ('CloudFormation should validate the template', () => {
      let jsonString = t.toJson()
      CloudFormation.validateTemplate({
        TemplateBody: jsonString
      }, (err, data) => {
        if (err) {
          console.error(err)
        }
        should.exist(data)
      })
    })

  })

  describe ('Combined Networking', () => {

    let t = new wk.Template()
    let vpcCiderParam = new wk.Parameter('VPCCIDR', { Type: 'String', Default: '10.0.0.0/16' })
    t.addParameter(vpcCiderParam)
    let publicSubnetPubACIDRParam = new wk.Parameter('PublicSubnetPubACIDR', { Type: 'String', Default: '10.0.0.0/24' })
    t.addParameter(publicSubnetPubACIDRParam)
    let publicSubnetPubBCIDRParam = new wk.Parameter('PublicSubnetPubBCIDR', { Type: 'String', Default: '10.0.1.0/24' })
    t.addParameter(publicSubnetPubBCIDRParam)
    let privateSubnetPrivCCIDRParam = new wk.Parameter('PrivateSubnetPrivCCIDR', { Type: 'String', Default: '10.0.2.0/24' })
    t.addParameter(privateSubnetPrivCCIDRParam)
    let privateSubnetPrivDCIDRParam = new wk.Parameter('PrivateSubnetPrivDCIDR', { Type: 'String', Default: '10.0.3.0/24' })
    t.addParameter(privateSubnetPrivDCIDRParam)
    let vPCTagParam = new wk.Parameter('VPCTag', { Type: 'String', Default: 'BaseVPC' })
    t.addParameter(vPCTagParam)

    let vpc = new wk.EC2.VPC('VPC')
    vpc.CidrBlock.ref(vpcCiderParam)
    vpc.InstanceTenancy = 'default'
    vpc.EnableDnsSupport = true
    vpc.EnableDnsHostnames = true
    vpc.Tags.add({ Key: 'Name', Value: 'BaseVPC' })
    vpc.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(vpc)

    let igw = new wk.EC2.InternetGateway('InternetGateway')
    igw.Tags.add({ Key: 'Name', Value: 'InternetGateway' })
    igw.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(igw)

    let vpcgatewayatt = new wk.EC2.VPCGatewayAttachment('AttachInternetGateway')
    vpcgatewayatt.VpcId.ref(vpc)
    vpcgatewayatt.InternetGatewayId.ref(igw)

    t.addResource(vpcgatewayatt)

    let publicSubnetPubA = new wk.EC2.Subnet('PublicSubnetPubA')
    publicSubnetPubA.CidrBlock.ref(publicSubnetPubACIDRParam)
    publicSubnetPubA.VpcId.ref(vpc)
    publicSubnetPubA.MapPublicIpOnLaunch = true
    publicSubnetPubA.Tags.add({ Key: 'Name', Value: 'PublicSubnetPubA' })
    publicSubnetPubA.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(publicSubnetPubA)

    let publicSubnetPubB = new wk.EC2.Subnet('PublicSubnetPubB')
    publicSubnetPubB.CidrBlock.ref(publicSubnetPubBCIDRParam)
    publicSubnetPubB.VpcId.ref(vpc)
    publicSubnetPubB.MapPublicIpOnLaunch = true
    publicSubnetPubB.Tags.add({ Key: 'Name', Value: 'PublicSubnetPubB' })
    publicSubnetPubB.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(publicSubnetPubB)

    let eipPubA = new wk.EC2.EIP('EIPPubA')
    eipPubA.Domain = 'vpc'
    t.addResource(eipPubA)

    let natPubA = new wk.EC2.NatGateway('NATPubA')
    natPubA.SubnetId.ref(publicSubnetPubA)
    natPubA.AllocationId.getAtt(eipPubA, 'AllocationId')
    natPubA.dependsOn(igw)
    t.addResource(natPubA)

    let eipPubB = new wk.EC2.EIP('EIPPubB')
    eipPubB.Domain = 'vpc'
    t.addResource(eipPubB)

    let natPubB = new wk.EC2.NatGateway('NATPubB')
    natPubB.SubnetId.ref(publicSubnetPubB)
    natPubB.AllocationId.getAtt(eipPubB, 'AllocationId')
    natPubB.dependsOn(igw)
    t.addResource(natPubB)

    let privateSubnetPrivC = new wk.EC2.Subnet('PrivateSubnetPrivC')
    privateSubnetPrivC.CidrBlock.ref(privateSubnetPrivCCIDRParam)
    privateSubnetPrivC.VpcId.ref(vpc)
    privateSubnetPrivC.MapPublicIpOnLaunch = false
    privateSubnetPrivC.Tags.add({ Key: 'Name', Value: 'PrivateSubnetPrivC' })
    privateSubnetPrivC.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(privateSubnetPrivC)

    let privateSubnetPrivD = new wk.EC2.Subnet('PrivateSubnetPrivD')
    privateSubnetPrivD.CidrBlock.ref(privateSubnetPrivDCIDRParam)
    privateSubnetPrivD.VpcId.ref(vpc)
    privateSubnetPrivD.MapPublicIpOnLaunch = false
    privateSubnetPrivD.Tags.add({ Key: 'Name', Value: 'PrivateSubnetPrivD' })
    privateSubnetPrivD.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(privateSubnetPrivD)

    let publicRouteTable = new wk.EC2.RouteTable('PublicRouteTable')
    publicRouteTable.VpcId.ref(vpc)
    publicRouteTable.Tags.add({ Key: 'Name', Value: 'PublicRouteTable' })
    publicRouteTable.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(publicRouteTable)

    let routeTablePrivC = new wk.EC2.RouteTable('RouteTablePrivC')
    routeTablePrivC.VpcId.ref(vpc)
    routeTablePrivC.Tags.add({ Key: 'Name', Value: 'RouteTablePrivC' })
    routeTablePrivC.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(routeTablePrivC)

    let routeTablePrivD = new wk.EC2.RouteTable('RouteTablePrivD')
    routeTablePrivD.VpcId.ref(vpc)
    routeTablePrivD.Tags.add({ Key: 'Name', Value: 'RouteTablePrivD' })
    routeTablePrivD.Tags.add({ Key: 'Group', Value: new wk.Ref(vPCTagParam) })
    t.addResource(routeTablePrivD)

    let publicIGWRoute = new wk.EC2.Route('PublicIGWRoute')
    publicIGWRoute.RouteTableId.ref(publicRouteTable)
    publicIGWRoute.DestinationCidrBlock = '0.0.0.0/0'
    publicIGWRoute.GatewayId.ref(igw)
    t.addResource(publicIGWRoute)

    let nATRoutePrivC = new wk.EC2.Route('NATRoutePrivC')
    nATRoutePrivC.RouteTableId.ref(routeTablePrivC)
    nATRoutePrivC.DestinationCidrBlock = '0.0.0.0/0'
    nATRoutePrivC.NatGatewayId.ref(natPubA)
    t.addResource(nATRoutePrivC)

    let nATRoutePrivD = new wk.EC2.Route('NATRoutePrivD')
    nATRoutePrivD.RouteTableId.ref(routeTablePrivD)
    nATRoutePrivD.DestinationCidrBlock = '0.0.0.0/0'
    nATRoutePrivD.NatGatewayId.ref(natPubB)
    t.addResource(nATRoutePrivD)

    let publicSubnetRouteTableAssociationA = new wk.EC2.SubnetRouteTableAssociation('PublicSubnetRouteTableAssociationA')
    publicSubnetRouteTableAssociationA.SubnetId.ref(publicSubnetPubA)
    publicSubnetRouteTableAssociationA.RouteTableId.ref(publicRouteTable)
    t.addResource(publicSubnetRouteTableAssociationA)

    let publicSubnetRouteTableAssociationB = new wk.EC2.SubnetRouteTableAssociation('PublicSubnetRouteTableAssociationB')
    publicSubnetRouteTableAssociationB.SubnetId.ref(publicSubnetPubB)
    publicSubnetRouteTableAssociationB.RouteTableId.ref(publicRouteTable)
    t.addResource(publicSubnetRouteTableAssociationB)

    let privateSubnetRouteTableAssociationPrivC = new wk.EC2.SubnetRouteTableAssociation('PrivateSubnetRouteTableAssociationPrivC')
    privateSubnetRouteTableAssociationPrivC.SubnetId.ref(privateSubnetPrivC)
    privateSubnetRouteTableAssociationPrivC.RouteTableId.ref(routeTablePrivC)
    t.addResource(privateSubnetRouteTableAssociationPrivC)

    let privateSubnetRouteTableAssociationPrivD = new wk.EC2.SubnetRouteTableAssociation('PrivateSubnetRouteTableAssociationPrivD')
    privateSubnetRouteTableAssociationPrivD.SubnetId.ref(privateSubnetPrivD)
    privateSubnetRouteTableAssociationPrivD.RouteTableId.ref(routeTablePrivD)
    t.addResource(privateSubnetRouteTableAssociationPrivD)

    it ('Should generate the expected JSON template', () => {
      // t.toJson()
      let jsonString = JSON.parse(t.toJson())
      jsonString.should.deep.equal({
        'Parameters': {
          'VPCCIDR': {
            'Type': 'String',
            'Default': '10.0.0.0/16'
          },
          'PublicSubnetPubACIDR': {
            'Type': 'String',
            'Default': '10.0.0.0/24'
          },
          'PublicSubnetPubBCIDR': {
            'Type': 'String',
            'Default': '10.0.1.0/24'
          },
          'PrivateSubnetPrivCCIDR': {
            'Type': 'String',
            'Default': '10.0.2.0/24'
          },
          'PrivateSubnetPrivDCIDR': {
            'Type': 'String',
            'Default': '10.0.3.0/24'
          },
          'VPCTag': {
            'Type': 'String',
            'Default': 'BaseVPC'
          }
        },
        'Resources': {
          'VPC': {
            'Type': 'AWS::EC2::VPC',
            'Properties': {
              'CidrBlock': { 'Ref': 'VPCCIDR' },
              'EnableDnsSupport': true,
              'EnableDnsHostnames': true,
              'InstanceTenancy': 'default',
              'Tags': [
                { 'Key': 'Name', 'Value': 'BaseVPC' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ]
            }
          },
          'InternetGateway': {
            'Type': 'AWS::EC2::InternetGateway',
            'Properties': {
              'Tags': [
                { 'Key': 'Name', 'Value': 'InternetGateway' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ]
            }
          },
          'AttachInternetGateway': {
            'Type': 'AWS::EC2::VPCGatewayAttachment',
            'Properties': {
              'InternetGatewayId': { 'Ref': 'InternetGateway' },
              'VpcId': { 'Ref': 'VPC' }
            }
          },
          'PublicSubnetPubA': {
            'Type': 'AWS::EC2::Subnet',
            'Properties': {
              'CidrBlock': { 'Ref': 'PublicSubnetPubACIDR' },
              'MapPublicIpOnLaunch': true,
              'Tags': [
                { 'Key': 'Name', 'Value': 'PublicSubnetPubA' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ],
              'VpcId': { 'Ref': 'VPC' }
            }
          },
          'PublicSubnetPubB': {
            'Type': 'AWS::EC2::Subnet',
            'Properties': {
              'CidrBlock': { 'Ref': 'PublicSubnetPubBCIDR' },
              'MapPublicIpOnLaunch': true,
              'Tags': [
                { 'Key': 'Name', 'Value': 'PublicSubnetPubB' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ],
              'VpcId': { 'Ref': 'VPC' }
            }
          },
          'EIPPubA': {
            'Type': 'AWS::EC2::EIP',
            'Properties': {
              'Domain': 'vpc'
            }
          },
          'NATPubA': {
            'Type': 'AWS::EC2::NatGateway',
            'Properties': {
              'AllocationId': { 'Fn::GetAtt': ['EIPPubA', 'AllocationId'] },
              'SubnetId': { 'Ref': 'PublicSubnetPubA' }
            },
            'DependsOn': 'InternetGateway'
          },
          'PublicRouteTable': {
            'Type': 'AWS::EC2::RouteTable',
            'Properties': {
              'VpcId': { 'Ref': 'VPC' },
              'Tags': [
                { 'Key': 'Name', 'Value': 'PublicRouteTable' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ]
            }
          },
          'PublicIGWRoute': {
            'Type': 'AWS::EC2::Route',
            'Properties': {
              'RouteTableId': { 'Ref': 'PublicRouteTable' },
              'DestinationCidrBlock': '0.0.0.0/0',
              'GatewayId': { 'Ref': 'InternetGateway' }
            }
          },
          'PublicSubnetRouteTableAssociationA': {
            'Type': 'AWS::EC2::SubnetRouteTableAssociation',
            'Properties': {
              'SubnetId': { 'Ref': 'PublicSubnetPubA' },
              'RouteTableId': { 'Ref': 'PublicRouteTable' }
            }
          },
          'PublicSubnetRouteTableAssociationB': {
            'Type': 'AWS::EC2::SubnetRouteTableAssociation',
            'Properties': {
              'SubnetId': { 'Ref': 'PublicSubnetPubB' },
              'RouteTableId': { 'Ref': 'PublicRouteTable' }
            }
          },
          'NATPubB': {
            'Type': 'AWS::EC2::NatGateway',
            'Properties': {
              'AllocationId': { 'Fn::GetAtt': ['EIPPubB', 'AllocationId'] },
              'SubnetId': { 'Ref': 'PublicSubnetPubB' }
            },
            'DependsOn': 'InternetGateway'
          },
          'EIPPubB': {
            'Type': 'AWS::EC2::EIP',
            'Properties': {
              'Domain': 'vpc'
            }
          },
          'PrivateSubnetPrivC': {
            'Type': 'AWS::EC2::Subnet',
            'Properties': {
              'CidrBlock': { 'Ref': 'PrivateSubnetPrivCCIDR' },
              'MapPublicIpOnLaunch': false,
              'Tags': [
                { 'Key': 'Name', 'Value': 'PrivateSubnetPrivC' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ],
              'VpcId': { 'Ref': 'VPC' }
            }
          },
          'PrivateSubnetPrivD': {
            'Type': 'AWS::EC2::Subnet',
            'Properties': {
              'CidrBlock': { 'Ref': 'PrivateSubnetPrivDCIDR' },
              'MapPublicIpOnLaunch': false,
              'Tags': [
                { 'Key': 'Name', 'Value': 'PrivateSubnetPrivD' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ],
              'VpcId': { 'Ref': 'VPC' }
            }
          },
          'RouteTablePrivC': {
            'Type': 'AWS::EC2::RouteTable',
            'Properties': {
              'VpcId': { 'Ref': 'VPC' },
              'Tags': [
                { 'Key': 'Name', 'Value': 'RouteTablePrivC' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ]
            }
          },
          'NATRoutePrivC': {
            'Type': 'AWS::EC2::Route',
            'Properties': {
              'RouteTableId': { 'Ref': 'RouteTablePrivC' },
              'DestinationCidrBlock': '0.0.0.0/0',
              'NatGatewayId': { 'Ref': 'NATPubA' }
            }
          },
          'PrivateSubnetRouteTableAssociationPrivC': {
            'Type': 'AWS::EC2::SubnetRouteTableAssociation',
            'Properties': {
              'SubnetId': { 'Ref': 'PrivateSubnetPrivC' },
              'RouteTableId': { 'Ref': 'RouteTablePrivC' }
            }
          },
          'RouteTablePrivD': {
            'Type': 'AWS::EC2::RouteTable',
            'Properties': {
              'VpcId': { 'Ref': 'VPC' },
              'Tags': [
                { 'Key': 'Name', 'Value': 'RouteTablePrivD' },
                { 'Key': 'Group', 'Value': { 'Ref': 'VPCTag' } }
              ]
            }
          },
          'NATRoutePrivD': {
            'Type': 'AWS::EC2::Route',
            'Properties': {
              'RouteTableId': { 'Ref': 'RouteTablePrivD' },
              'DestinationCidrBlock': '0.0.0.0/0',
              'NatGatewayId': { 'Ref': 'NATPubB' }
            }
          },
          'PrivateSubnetRouteTableAssociationPrivD': {
            'Type': 'AWS::EC2::SubnetRouteTableAssociation',
            'Properties': {
              'SubnetId': { 'Ref': 'PrivateSubnetPrivD' },
              'RouteTableId': { 'Ref': 'RouteTablePrivD' }
            }
          }
        },
        'AWSTemplateFormatVersion': '2010-09-09'
      })
    })

    it ('CloudFormation should validate the template', () => {
      let jsonString = t.toJson()
      CloudFormation.validateTemplate({
        TemplateBody: jsonString
      }, (err, data) => {
        if (err) {
          console.error(err)
        }
        should.exist(data)
      })
    })
  })
})
