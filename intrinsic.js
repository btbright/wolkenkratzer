/**
 * Created by arming on 6/15/16.
 */
'use strict'

class Intrinsic {
  toJson () {}
}

class Ref extends Intrinsic {
  constructor (resource) {
    super()
    this.ref = resource
  }
  toJson () {
    return { 'Ref': this.ref.Name }
  }
}

class FnGetAtt extends Intrinsic {
  constructor (resource, attribute) {
    super()
    this.resource = resource
    this.attribute = attribute
  }
  toJson () {
    return { 'Fn::GetAtt': [this.resource.Name, this.attribute] }
  }
}

/* class FnBase64 extends Intrinsic {
 constructor (string) {
 super()
 this.base64 = new Buffer(string).toJson('base64')
 }
 toJson () {}
 }*/

/* class FnFindInMap extends Intrinsic {
 constructor (mapName, topLevelKey, secondLevelKey) {
 super()
 this.mapName = mapName
 this.topLevelKey = topLevelKey
 this.secondLevelKey = secondLevelKey
 }
 toJson () {}
 }*/

/* class FnGetAZs extends Intrinsic {
 constructor (region) {
 super()
 this.region = region
 }
 toJson () {}
 }*/

/* class FnJoin extends Intrinsic {
 constructor (delimiter, values) {
 super()
 this.delimiter = delimiter
 this.values = values
 }
 toJson () {}
 }*/

/* class FnSelect extends Intrinsic {
 constructor (index, list) {
 super()
 this.index = index
 this.list = list
 }
 toJson () {}
 }*/

/* class Conditional extends Intrinsic {
 constructor () {
 super()
 }
 toJson () {}
 }*/

/* class FnIf extends Conditional {
 constructor () {
 super()
 }
 toJson () {}
 }*/

/* class FnEquals extends Conditional {
 constructor () {
 super()
 }
 toJson () {}
 }*/

/* class FnNot extends Conditional {
 constructor () {
 super()
 }
 toJson () {}
 }*/

/* class FnOr extends Conditional {
 constructor () {
 super()
 }
 toJson () {}
 }*/

module.exports = {
  Ref: Ref,
  Intrinsic: Intrinsic,
  FnGetAtt: FnGetAtt
}