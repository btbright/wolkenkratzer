'use strict'

const baseawsobject = require('./../baseawsobject')
const resource = require('./../resourceproperty')
const tag = require('./../tag')
const types = require('./../types')

class DeliveryStream extends baseawsobject.BaseAWSObject {
  constructor(name, propertiesObject) {
    let resourceType = 'AWS::KinesisFirehose::DeliveryStream'
    let properties = {
      DeliveryStreamName: new resource.ResourceProperty(String, 'No', null),
      ElasticsearchDestinationConfiguration: new resource.ResourceProperty(types.AmazonKinesisFirehoseDeliveryStreamElasticsearchDestinationConfiguration, 'Conditional', null),
      RedshiftDestinationConfiguration: new resource.ResourceProperty(types.AmazonKinesisFirehoseDeliveryStreamRedshiftDestinationConfiguration, 'Conditional', null),
      S3DestinationConfiguration: new resource.ResourceProperty(types.AmazonKinesisFirehoseDeliveryStreamS3DestinationConfiguration, 'Conditional', null)
    }
    super(name, resourceType, properties, propertiesObject)
  }
}

module.exports = {
  DeliveryStream: DeliveryStream
}