'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.Pseudo = exports.getInstanceTypeNameList = exports.getInstanceTypeList = exports.S3BucketTransform = exports.ResourceMetadata = exports.CreationPolicy = exports.FnJoin = exports.FnEquals = exports.FnGetAtt = exports.Ref = exports.Condition = exports.CustomResource = exports.Resource = exports.Mapping = exports.Output = exports.Description = exports.Parameter = exports.Template = undefined;var _template = require('./template');Object.defineProperty(exports, 'Template', { enumerable: true, get: function () {return _template.

    Template;} });var _parameter = require('./elements/parameter');Object.defineProperty(exports, 'Parameter', { enumerable: true, get: function () {return _parameter.
    Parameter;} });var _description = require('./elements/description');Object.defineProperty(exports, 'Description', { enumerable: true, get: function () {return _description.
    Description;} });var _output = require('./elements/output');Object.defineProperty(exports, 'Output', { enumerable: true, get: function () {return _output.
    Output;} });var _mapping = require('./elements/mapping');Object.defineProperty(exports, 'Mapping', { enumerable: true, get: function () {return _mapping.
    Mapping;} });var _resource = require('./elements/resource');Object.defineProperty(exports, 'Resource', { enumerable: true, get: function () {return _resource.
    Resource;} });Object.defineProperty(exports, 'CustomResource', { enumerable: true, get: function () {return _resource.CustomResource;} });var _condition = require('./elements/condition');Object.defineProperty(exports, 'Condition', { enumerable: true, get: function () {return _condition.
    Condition;} });var _intrinsic = require('./intrinsic');Object.defineProperty(exports, 'Ref', { enumerable: true, get: function () {return _intrinsic.
    Ref;} });Object.defineProperty(exports, 'FnGetAtt', { enumerable: true, get: function () {return _intrinsic.FnGetAtt;} });Object.defineProperty(exports, 'FnEquals', { enumerable: true, get: function () {return _intrinsic.FnEquals;} });Object.defineProperty(exports, 'FnJoin', { enumerable: true, get: function () {return _intrinsic.FnJoin;} });var _creationpolicy = require('./attributes/creationpolicy');Object.defineProperty(exports, 'CreationPolicy', { enumerable: true, get: function () {return _creationpolicy.

    CreationPolicy;} });var _metadata = require('./attributes/metadata');Object.defineProperty(exports, 'ResourceMetadata', { enumerable: true, get: function () {return _metadata.
    ResourceMetadata;} });var _s = require('./transform/s3');Object.defineProperty(exports, 'S3BucketTransform', { enumerable: true, get: function () {return _s.
    S3BucketTransform;} });var _ec2meta = require('./macros/ec2meta.macro');Object.defineProperty(exports, 'getInstanceTypeList', { enumerable: true, get: function () {return _ec2meta.

    getInstanceTypeList;} });Object.defineProperty(exports, 'getInstanceTypeNameList', { enumerable: true, get: function () {return _ec2meta.
    getInstanceTypeNameList;} });var _pseudo = require('./pseudo');Object.defineProperty(exports, 'Pseudo', { enumerable: true, get: function () {return _pseudo.

    Pseudo;} });var _service = require('./service');

var _fs = require('fs');var fs = _interopRequireWildcard(_fs);
var _path = require('path');var path = _interopRequireWildcard(_path);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}

const files = fs.readdirSync(path.resolve(__dirname, './stubs/json'));

files.map(file => {
  if (file !== 'json') {
    const service = file.replace('.json', '');
    exports[service] = (0, _service.Service)(service);
  }
});

/**
     * @description Wolkenkratzer is a Javascript library that programmatically generates AWS CloudFormation templates. The library targets 100% feature parity with CloudFormation. This is accomplished by scraping the public documentation and using that to build the data model. The scraper and json data model are in the cfn-doc-json-stubs project. Markdown documentation for the data model is available at doc.md.
     */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZSIsIlBhcmFtZXRlciIsIkRlc2NyaXB0aW9uIiwiT3V0cHV0IiwiTWFwcGluZyIsIlJlc291cmNlIiwiQ3VzdG9tUmVzb3VyY2UiLCJDb25kaXRpb24iLCJSZWYiLCJGbkdldEF0dCIsIkZuRXF1YWxzIiwiRm5Kb2luIiwiQ3JlYXRpb25Qb2xpY3kiLCJSZXNvdXJjZU1ldGFkYXRhIiwiUzNCdWNrZXRUcmFuc2Zvcm0iLCJnZXRJbnN0YW5jZVR5cGVMaXN0IiwiZ2V0SW5zdGFuY2VUeXBlTmFtZUxpc3QiLCJQc2V1ZG8iLCJmcyIsInBhdGgiLCJmaWxlcyIsInJlYWRkaXJTeW5jIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsIm1hcCIsImZpbGUiLCJzZXJ2aWNlIiwicmVwbGFjZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBRVNBLFk7QUFDQUMsYTtBQUNBQyxlO0FBQ0FDLFU7QUFDQUMsVztBQUNBQyxZLDhHQUFVQyxjO0FBQ1ZDLGE7QUFDQUMsTyx5R0FBS0MsUSx5R0FBVUMsUSx1R0FBVUMsTTs7QUFFekJDLGtCO0FBQ0FDLG9CO0FBQ0FDLHFCOztBQUVQQyx1QjtBQUNBQywyQjs7QUFFT0MsVSxNQVJUOztBQVVBLHdCLElBQVlDLEU7QUFDWiw0QixJQUFZQyxJOztBQUVaLE1BQU1DLFFBQVFGLEdBQUdHLFdBQUgsQ0FBZUYsS0FBS0csT0FBTCxDQUFhQyxTQUFiLEVBQXdCLGNBQXhCLENBQWYsQ0FBZDs7QUFFQUgsTUFBTUksR0FBTixDQUFVQyxRQUFRO0FBQ2hCLE1BQUlBLFNBQVMsTUFBYixFQUFxQjtBQUNuQixVQUFNQyxVQUFVRCxLQUFLRSxPQUFMLENBQWEsT0FBYixFQUFzQixFQUF0QixDQUFoQjtBQUNBQyxZQUFRRixPQUFSLElBQW1CLHNCQUFRQSxPQUFSLENBQW5CO0FBQ0Q7QUFDRixDQUxEOztBQU9BIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuZXhwb3J0IHsgVGVtcGxhdGUgfSBmcm9tICcuL3RlbXBsYXRlJztcbmV4cG9ydCB7IFBhcmFtZXRlciB9IGZyb20gJy4vZWxlbWVudHMvcGFyYW1ldGVyJztcbmV4cG9ydCB7IERlc2NyaXB0aW9uIH0gZnJvbSAnLi9lbGVtZW50cy9kZXNjcmlwdGlvbic7XG5leHBvcnQgeyBPdXRwdXQgfSBmcm9tICcuL2VsZW1lbnRzL291dHB1dCc7XG5leHBvcnQgeyBNYXBwaW5nIH0gZnJvbSAnLi9lbGVtZW50cy9tYXBwaW5nJztcbmV4cG9ydCB7IFJlc291cmNlLCBDdXN0b21SZXNvdXJjZSB9IGZyb20gJy4vZWxlbWVudHMvcmVzb3VyY2UnO1xuZXhwb3J0IHsgQ29uZGl0aW9uIH0gZnJvbSAnLi9lbGVtZW50cy9jb25kaXRpb24nO1xuZXhwb3J0IHsgUmVmLCBGbkdldEF0dCwgRm5FcXVhbHMsIEZuSm9pbiB9IGZyb20gJy4vaW50cmluc2ljJztcbmltcG9ydCB7IFNlcnZpY2UsIElTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlJztcbmV4cG9ydCB7IENyZWF0aW9uUG9saWN5IH0gZnJvbSAnLi9hdHRyaWJ1dGVzL2NyZWF0aW9ucG9saWN5JztcbmV4cG9ydCB7IFJlc291cmNlTWV0YWRhdGEgfSBmcm9tICcuL2F0dHJpYnV0ZXMvbWV0YWRhdGEnO1xuZXhwb3J0IHsgUzNCdWNrZXRUcmFuc2Zvcm0gfSBmcm9tICcuL3RyYW5zZm9ybS9zMyc7XG5leHBvcnQge1xuICBnZXRJbnN0YW5jZVR5cGVMaXN0LFxuICBnZXRJbnN0YW5jZVR5cGVOYW1lTGlzdFxufSBmcm9tICcuL21hY3Jvcy9lYzJtZXRhLm1hY3JvJztcbmV4cG9ydCB7IFBzZXVkbyB9IGZyb20gJy4vcHNldWRvJztcblxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zdHVicy9qc29uJykpO1xuXG5maWxlcy5tYXAoZmlsZSA9PiB7XG4gIGlmIChmaWxlICE9PSAnanNvbicpIHtcbiAgICBjb25zdCBzZXJ2aWNlID0gZmlsZS5yZXBsYWNlKCcuanNvbicsICcnKTtcbiAgICBleHBvcnRzW3NlcnZpY2VdID0gU2VydmljZShzZXJ2aWNlKTtcbiAgfVxufSk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFdvbGtlbmtyYXR6ZXIgaXMgYSBKYXZhc2NyaXB0IGxpYnJhcnkgdGhhdCBwcm9ncmFtbWF0aWNhbGx5IGdlbmVyYXRlcyBBV1MgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVzLiBUaGUgbGlicmFyeSB0YXJnZXRzIDEwMCUgZmVhdHVyZSBwYXJpdHkgd2l0aCBDbG91ZEZvcm1hdGlvbi4gVGhpcyBpcyBhY2NvbXBsaXNoZWQgYnkgc2NyYXBpbmcgdGhlIHB1YmxpYyBkb2N1bWVudGF0aW9uIGFuZCB1c2luZyB0aGF0IHRvIGJ1aWxkIHRoZSBkYXRhIG1vZGVsLiBUaGUgc2NyYXBlciBhbmQganNvbiBkYXRhIG1vZGVsIGFyZSBpbiB0aGUgY2ZuLWRvYy1qc29uLXN0dWJzIHByb2plY3QuIE1hcmtkb3duIGRvY3VtZW50YXRpb24gZm9yIHRoZSBkYXRhIG1vZGVsIGlzIGF2YWlsYWJsZSBhdCBkb2MubWQuXG4gKi9cbiJdfQ==