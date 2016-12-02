var chai = require('chai')
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

global.should = chai.should
global.expect = chai.expect
global.assert = chai.assert

require("babel-core/register")({
  compact: false
});
