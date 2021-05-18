const { expect } = require('chai');
const { parseRepoUrl } = require('../../../lib/utils');

describe('utils', () => {
  describe('parseRepoUrl', () => {
    it('should parse a standard github URL', () => {
      const { owner, name } = parseRepoUrl('https://github.com/johndoe/foobar');
      expect(owner).to.equal('johndoe');
      expect(name).to.equal('foobar');
    });

    it('should parse a standard github URL with special characters', () => {
      const { owner, name } = parseRepoUrl('https://github.com/johndoe/foo.bar');
      expect(owner).to.equal('johndoe');
      expect(name).to.equal('foo.bar');
    });

    it('should parse a github URL ending with .git', () => {
      const { owner, name } = parseRepoUrl('https://github.com/johndoe/foo.bar.git');
      expect(owner).to.equal('johndoe');
      expect(name).to.equal('foo.bar');
    });

    it('should parse a github URL with git+https protocol', () => {
      const { owner, name } = parseRepoUrl('git+https://github.com/johndoe/foo.bar.git');
      expect(owner).to.equal('johndoe');
      expect(name).to.equal('foo.bar');
    });
  });
});
