var assert = require('assert');
var identities = require('../../../lib/platforms/identity');

module.exports = function() {

  this.World = require('../support/world').World;

  this.Then(/^the returned identity object with identifier (.*) has a valid format$/, function(identityId, callback) {

    var response = this.get('response').body;

    identities.get(identityId, function(err, foundIdentity) {

      if (err) {
        return callback(err);
      }

      assert.ok(foundIdentity !== undefined, 'Identity not found');

      foundIdentity = foundIdentity.toObject(); // Convert Mongoose object to plain JS object

      /* Check fields in identity object */
      assert((foundIdentity._id).equals(response.id), 'Identity \'id\' field does not match');
      assert.deepEqual(response.channels, foundIdentity.channels, 'Identity \'channels\' do not match');
      assert.deepEqual(response.devices, foundIdentity.devices, 'Identity \'devices\' do not match');
      return callback();
    });
  });

  this.Then(/^a user asks for profile data to (.*) with id (.*)$/, function(endpoint, identityId, callback) {

    var url = endpoint.replace(':identityId', identityId);

    this.register('url', url);

    var request = this.buildRequest('GET', url, {
      'x-user-id': this.get('identity')
    });

    this.register('request', request);

    return callback();
  });

  this.Then(/^the next GET request to (.*) returns the identity with (.*) field with value (.*)$/, function(endpoint, field, fieldContents, callback) {

    var request = this.buildRequest('GET', endpoint, {
      'x-user-id': this.get('identity')
    });

    fieldContents = this.readJSONResource(fieldContents);


    request
      .expect(200)
      .end(function(err, response) {
        if (err) {
          return callback(err);
        }

        assert.deepEqual(response.body[field], fieldContents[field], 'Edited Identity does not match');

        return callback();
      });
  });

  this.Then(/^the response includes an Identity identifier$/, function(callback) {

    var response = this.get('response');

    assert.ok(response.body.id !== undefined, 'Response does not contain Identity identifier');
    return callback();
  });

  this.When(/^a user makes a PUT to (.*) to change his (.*) field with value (.*)$/, function(endpoint, field, value, callback) {

    var body = this.readJSONResource(value);

    this.register('url', endpoint);

    var request = this.buildRequest('PUT', endpoint, {
      'x-user-id': this.get('identity')
    }, body);

    this.register('request', request);
    this.register('body', body);

    return callback();
  });
};
