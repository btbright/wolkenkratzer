/**
 * Created by arming on 6/15/16.
 */
'use strict';

const WKResource = require('./resource').WKResource;
const Parameter = require('./parameter').Parameter;

/** @module Core */

function makeIntrinsic(obj) {
  if (obj['Ref']) {
    return new Ref(obj['Ref']);
  } else if (obj['Fn::FindInMap']) {
    return new FnFindInMap(obj['Fn::FindInMap']);
  } else if (obj['Fn::GetAtt']) {
    return new FnGetAtt(obj['Fn::GetAtt']);
  } else if (obj['Fn::Join']) {
    return new FnJoin(obj['Fn::Join'][0], obj['Fn::Join'][1]);
  } else if (obj['Fn::Sub']) {
    return new FnSub(obj['Fn::Sub']);
  }
  return null;
}

/**
 * @memberof module:Core
 */
function Intrinsic() {}

/**
 * Returns a JSON Object
 */
Intrinsic.prototype.toJson = function() {};
Intrinsic.prototype.toJSON = function() {
  return this.toJson().json;
};

/**
 * @memberof module:Core
 */
function Ref(resource) {
  Intrinsic.call(this);
  this.ref = resource;
}
Ref.prototype = Object.create(Intrinsic.prototype);

/**
 * Returns a JSON string version
 * @returns {Object}
 */
Ref.prototype.toJson = function() {
  if (this.ref instanceof WKResource || this.ref instanceof Parameter) {
    return { errors: null, json: { Ref: this.ref.WKName } };
  } else {
    return { errors: null, json: { Ref: this.ref } };
  }
};

/**
 * @memberof module:Core
 */
function FnSub(input) {
  Intrinsic.call(this);
  this.sub = input;
}
FnSub.prototype = Object.create(Intrinsic.prototype);

/**
 * Returns a JSON string version
 * @returns {Object}
 */
FnSub.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::Sub': this.sub } };
};

/**
 * @memberof module:Core
 */
function FnGetAtt(resource, attribute) {
  Intrinsic.call(this);
  this.resource = resource;
  this.attribute = attribute;
}
FnGetAtt.prototype = Object.create(Intrinsic.prototype);

/**
 * Returns a JSON string version
 * @returns {Object}
 */
FnGetAtt.prototype.toJson = function() {
  if (
    this.resource instanceof WKResource || this.resource instanceof Parameter
  ) {
    return {
      errors: null,
      json: { 'Fn::GetAtt': [this.resource.WKName, this.attribute] }
    };
  } else {
    return {
      errors: null,
      json: { 'Fn::GetAtt': [this.resource, this.attribute] }
    };
  }
};

/**
 * @memberof module:Core
 */
function FnBase64(content) {
  Intrinsic.call(this);
  this.content = content;
}
FnBase64.prototype = Object.create(Intrinsic.prototype);

/**
 * Returns a JSON string version
 * @returns {Object}
 */
FnBase64.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::Base64': this.content } };
};

/**
 * @memberof module:Core
 */
function FnFindInMap(mapName, topLevelKey, secondLevelKey) {
  Intrinsic.call(this);
  this.mapName = mapName;
  this.topLevelKey = topLevelKey;
  this.secondLevelKey = secondLevelKey;
}
FnFindInMap.prototype = Object.create(Intrinsic.prototype);

/**
 * Returns a JSON string version
 * @returns {Object}
 */
FnFindInMap.prototype.toJson = function() {
  return {
    errors: null,
    json: {
      'Fn::FindInMap': [this.mapName, this.topLevelKey, this.secondLevelKey]
    }
  };
};

function FnGetAZs(region) {
  Intrinsic.call(this);
  if (region) {
    this.region = region;
  } else {
    this.region = { Ref: 'AWS::Region' };
  }
}
FnGetAZs.prototype = Object.create(Intrinsic.prototype);

/**
 *
 * @returns {Object}
 */
FnGetAZs.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::GetAZs': this.region } };
};

/**
 * @memberof module:Core
 */
function FnJoin(delimiter, values) {
  Intrinsic.call(this);
  this.delimiter = delimiter;
  this.values = values;
}
FnJoin.prototype = Object.create(Intrinsic.prototype);

/**
 * Returns a JSON string version
 * @returns {Object}
 */
FnJoin.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::Join': [this.delimiter, this.values] } };
};

function FnSelect(index, list) {
  Intrinsic.call(this);
  this.index = index;
  this.list = list;
}
FnSelect.prototype = Object.create(Intrinsic.prototype);

FnSelect.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::Select': [this.index, this.list] } };
};

function FnAnd(condition, body) {
  Intrinsic.call(this);
  this.condition = condition;
  this.body = body;
}
FnAnd.prototype = Object.create(Intrinsic.prototype);

FnAnd.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::And': [this.condition, this.body] } };
};

function FnEquals(first, second) {
  Intrinsic.call(this);
  this.first = first;
  this.second = second;
}
FnEquals.prototype = Object.create(Intrinsic.prototype);

FnEquals.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::Equals': [this.first, this.second] } };
};

function FnIf(condition, ifTrue, ifFalse) {
  Intrinsic.call(this);
  this.condition = condition;
  this.ifTrue = ifTrue;
  this.ifFalse = ifFalse;
}
FnIf.prototype = Object.create(Intrinsic.prototype);

FnIf.prototype.toJson = function() {
  return {
    errors: null,
    json: { 'Fn::If': [this.condition, this.ifTrue, this.ifFalse] }
  };
};

function FnNot(condition) {
  Intrinsic.call(this);
  this.condition = condition;
}
FnNot.prototype = Object.create(Intrinsic.prototype);

FnNot.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::Not': [this.condition] } };
};

function FnOr(condition, body) {
  Intrinsic.call(this);
  this.condition = condition;
  this.body = body;
}
FnOr.prototype = Object.create(Intrinsic.prototype);

FnOr.prototype.toJson = function() {
  return { errors: null, json: { 'Fn::Or': [this.condition, this.body] } };
};

module.exports = {
  Ref: Ref,
  FnSub: FnSub,
  Intrinsic: Intrinsic,
  FnGetAtt: FnGetAtt,
  FnGetAZs: FnGetAZs,
  FnBase64: FnBase64,
  FnFindInMap: FnFindInMap,
  FnJoin: FnJoin,
  FnSelect: FnSelect,
  FnAnd: FnAnd,
  FnEquals: FnEquals,
  FnIf: FnIf,
  FnNot: FnNot,
  FnOr: FnOr,
  makeIntrinsic: makeIntrinsic
};