const { createValidator } = require('../validator/helper');

const schema = {
  type: 'object',
  properties: {
    use24hourFormat: {
      type: 'boolean'
    }
  },
  required: ['use24hourFormat'],
  additionalProperties: false
};

module.exports = {
  rights: {
    padmin: 'rw',
    admin: 'rw',
    user: 'rw'
  },
  validator: createValidator(schema)
};
