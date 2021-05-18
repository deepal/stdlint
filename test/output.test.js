const { expect } = require('chai');
const createOutputFormatter = require('../lib/output');

describe('output formatters', () => {
  it('should throw an error if an unsupported output format is provided', () => {
    expect(() => createOutputFormatter('dunno')).to.throw(`output format should be one of "json", "xml" or "pretty". provided: "dunno"`);
  });
  describe('json output formatter', () => {
    it('should return a stringified json output', () => {
      const getJSONOutput = createOutputFormatter('json');
      const output = getJSONOutput(
        {
          name: 'my-repo',
          url: 'example.com',
          localPath: '/some/path',
        },
        [
          {
            rule: {
              name: 'codeOwnersFile',
              category: 'Some Category',
              severity: 2,
            },
            result: {
              passed: true,
              message: '.github/CODEOWNERS file found',
              score: 100,
            },
          },
        ],
      );
      expect(output).to.equal(
        '{\n' +
          '  "repository": {\n' +
          '    "name": "my-repo",\n' +
          '    "url": "example.com",\n' +
          '    "localPath": "/some/path"\n' +
          '  },\n' +
          '  "results": [\n' +
          '    {\n' +
          '      "rule": {\n' +
          '        "name": "codeOwnersFile",\n' +
          '        "category": "Some Category",\n' +
          '        "severity": 2\n' +
          '      },\n' +
          '      "result": {\n' +
          '        "passed": true,\n' +
          '        "message": ".github/CODEOWNERS file found",\n' +
          '        "score": 100\n' +
          '      }\n' +
          '    }\n' +
          '  ]\n' +
          '}',
      );
    });
  });
});
