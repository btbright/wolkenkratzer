'use strict'

const baseawsobject = require('./../baseawsobject')
const ResourceAttribute = require('./../resourceattribute').ResourceAttribute
const ResourceAttributeArray = require('./../resourceattribute').ResourceAttributeArray
const tag = require('./../tag')
const types = require('./../types')

class Stream extends baseawsobject.BaseAWSObject {
  constructor (name, propertiesObject) {
    let resourceType = 'AWS::Kinesis::Stream'
    let properties = {
      Name: new ResourceAttribute('Name', String, 'No', null),
      ShardCount: new ResourceAttribute('ShardCount', Number, 'Yes', null),
      Tags: new tag.TagSet()
    }
    super(name, resourceType, properties, propertiesObject)
  }
}

module.exports = {
  Stream: Stream
}
