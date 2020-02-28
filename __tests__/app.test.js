
const User = require('../src/models/users.js');

describe('User Model', () => {
  it('creates a user properly', () => {
    const testUser = new User({username: "peter", password: "geodudeRox"})
    expect(testUser.password).toEqual("geodudeRox")
  });
});
