const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
chai.should();

chai.use(sinonChai);
chai.use(dirtyChai);
