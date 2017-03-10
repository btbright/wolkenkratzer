'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A CloudFormation ResourceProperty, mapped to those listed at http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-product-property-reference.html
 * @memberof module:Core
 */
function ResourceProperty(name, properties, propertiesObject, conditional) {
    this.WKName = name;
    this.properties = properties;
    this.conditional = conditional;
    for (let prop in this.properties) {
        Object.defineProperty(this, prop, {
            set: value => {
                this.properties[prop].set(value);
            },
            get: () => {
                return this.properties[prop];
            }
        });
    }
    if (propertiesObject) {
        for (let prop in propertiesObject) {
            this.properties[prop] = propertiesObject[prop];
        }
    }
}
exports.ResourceProperty = ResourceProperty;
/**
 * Performs validation and returns a pretty-printed JSON object.
 * @returns {String}
 */
ResourceProperty.prototype.toJson = function () {
    let newProperties = JSON.parse(JSON.stringify(this.properties));
    let errors = [];
    for (let prop in newProperties) {
        if (this.properties[prop] instanceof ResourceProperty ||
            typeof this.properties[prop].toJson === 'function') {
            let result = this.properties[prop].toJson();
            if (result.errors && result.errors.length > 0) {
                result.errors.forEach(e => {
                    errors.push(this.WKName + '.' + e);
                });
            }
            if (result.json != null) {
                newProperties[prop] = result.json;
            }
            else {
                delete newProperties[prop];
            }
        }
        else {
            newProperties[prop] = this.properties[prop];
        }
    }
    if (this.conditional) {
        let result = this.conditional(this.properties);
        if (result.errors) {
            result.errors.forEach(e => {
                errors.push(e);
            });
            errors.push(this.WKName + ' has a condition that was not met.');
        }
    }
    let result = { errors: errors, json: newProperties };
    if (errors.length === 0) {
        result = { errors: null, json: newProperties };
    }
    return result;
};
module.exports = {
    ResourceProperty: ResourceProperty
};
