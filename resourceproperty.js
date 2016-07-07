/**
 * Created by arming on 6/15/16.
 */
'use strict'

const Ref = require('./intrinsic').Ref
const Intrinsic = require('./intrinsic').Intrinsic
const FnGetAtt = require('./intrinsic').FnGetAtt
const FnFindInMap = require('./intrinsic').FnFindInMap
const FnBase64 = require('./intrinsic').FnBase64
const RequiredPropertyException = require('./exceptions').RequiredPropertyException
const TypeException = require('./exceptions').TypeException
const SubPropertyObject = require('./baseawsobject').SubPropertyObject

class ResourceProperty {
  constructor (Type, required, value) {
    this.Type = Type
    this.required = required
    this.val = value
  }
  set (value) {
    let valueType = value
    if (typeof value === 'string') {
      valueType = new String(value)
    } else if (typeof value === 'boolean') {
      valueType = new Boolean(value)
    } else if(typeof value == 'number') {
      valueType = new Number(value)
    }
    if (valueType instanceof this.Type) {
      this.val = value
    } else {
      /*console.log('this:')
      console.log(this)
      console.log('value:')
      console.log(valueType)*/
      throw new TypeException(value + ' is the wrong type, was expecting ' + this.Type)
    }
  }
  get () { return this.val }
  ref (resource) {
    this.val = new Ref(resource)
  }
  getAtt (resource, attribute) {
    this.val = new FnGetAtt(resource, attribute)
  }
  findInMap (map, top, second) {
    this.val = new FnFindInMap(map, top, second)
  }
  base64 (content) {
    this.val = new FnBase64(content)
  }
  toJson () {
    if (this.val !== null) {
      if (this.val instanceof Intrinsic) {
        return this.val.toJson()
      } else if(this.val instanceof SubPropertyObject) {
        return this.val.toJson()
      }
      return this.val
    } else {
      if (this.required === 'Yes') { throw new RequiredPropertyException('this value is required') }
    }
  }
}

class ResourceArray extends ResourceProperty {
  constructor(Type, required, value) {
    super(Type, required, value)
  }
  set (value) {
    if (!Array.isArray(value)) {
      throw new TypeException(value + ' is the wrong type, was expecting an array of ' + this.Type)
    }
    for (let val in value) {
      let valueType = val
      if (typeof val === 'string') {
        valueType = new String(val)
      } else if (typeof val === 'boolean') {
        valueType = new Boolean(val)
      } else if(typeof val == 'number') {
        valueType = new Number(val)
      }
      if (!(valueType instanceof this.Type)) {
        throw new TypeException(value + ' is the wrong type, was expecting ' + this.Type)
      }
      this.val = value
    }
  }
  push (val) {
    let valueType = val
    if (typeof val === 'string') {
      valueType = new String(val)
    } else if (typeof val === 'boolean') {
      valueType = new Boolean(val)
    } else if(typeof val == 'number') {
      valueType = new Number(val)
    }
    if (valueType instanceof this.Type || valueType instanceof Intrinsic) {
      if(!this.val) {
        this.val = []
      }
      this.val.push(val)
    } else {
      throw new TypeException(val + ' is the wrong type, was expecting ' + this.Type)
    }
  }
  toJson () {
    if (this.val !== null) {
      if(this.Type.prototype instanceof SubPropertyObject) {
        let propArray = []
        for (let prop in this.val) {
          propArray.push(this.val[prop].toJson())
        }
        return propArray
      } else {
        let propArray = []
        for (let prop in this.val) {
          if(this.val[prop] instanceof Intrinsic) {
            propArray.push(this.val[ prop ].toJson())
          } else {
            propArray.push(this.val[prop])
          }
        }
        return propArray
        //console.log('array is ' + this.val)
        //console.log(this.val)
      }
    } else {
      if (this.required === 'Yes') { throw new RequiredPropertyException('this value is required') }
    }
  }
}

module.exports = {
  ResourceProperty: ResourceProperty,
  ResourceArray: ResourceArray
}
