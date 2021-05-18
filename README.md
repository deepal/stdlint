# stdlint
#### A non-opinionated development standard checker that helps you keep your repositories clean and consistent!

### Table of Contents
<!-- toc -->

- [Rationale](#Rationale)
- [What is stdlint](#What-is-stdlint)
- [Installation](#Installation)
  * [Installing per project](#Installing-per-project)
  * [Installing globally](#Installing-globally)
- [Usage](#Usage)
  * [Available options](#Available-options)
  * [Running against a local directory](#Running-against-a-local-directory)
- [Configuring stdlint](#Configuring-stdlint)
- [Using Rule Sets](#Using-Rule-Sets)
- [Writing a rule](#Writing-a-rule)
- [Contribution](#Contribution)

<!-- tocstop -->

### Rationale

TBD

### What is stdlint

`stdlint` can make sure that your projects conform to the agreed development standards.

`stdlint` is a CLI tool that can be run against a GitHub repository (local or/and remote), to automatically identify potential issues in terms of development standards.

### Installation

#### Installing per project
To install `stdlint` in one of your projects, go to the project you need to install stdlint and run the following command:

```
npm i stdlint --save-dev
```

After installing stdlint in your project, you can add an npm script to run stdlint in your package.json.

```
"scripts": {
    "stdlint": "stdlint --path ."
}
```

You can then run stdlint using your npm script.

```
npm run stdlint
```

#### Installing globally

Although we don't recommend installing stdlint globally, you can do so as follows:

```
npm i -g stdlint
```

Once you install stdlint globally, you can use `stdlint` CLI command from any directory.

### Usage

Since stdlint needs to access repositories repositories, you need to provide stdlint a Github personal access token which grants read access to the repositories.

You can pass the personal access token to stdlint by setting it as `GITHUB_AUTH_TOKEN` environment variable in the same shell stdlint is run.

#### Available options
```
$ stdlint --help

Usage: stdlint [options]

Options:
  -p, --path <path>      local path of the project git repository
  -u, --url <url>        github repository URL
  -o, --output <output>  output format for the result. one of json, xml, pretty (default: "pretty")
  -l, --level <level>    maximum error tolerance level (default: 1)
  -h, --help             display help for command
```

|  Option   | Description |   
| --- | --- |
| `-p` or `--path`    | Local path of the project git repository. Can be an absolute path or a relative path   |
| `-u` or `--url`    | Github repository URL   |
| `-l` or `--level`   | Maximum tolerance level of errors. Valid values are -1, 0, 1, 2, 3 where the number increases the tolerance level. Set it to `-1` to exit with exitCode 1 on all types of issues. e.g: If set to 0, stdlint will exit with exitCode 1 if at least one issue with `WARN` severity is found.|
| `-h` or `--help`    | Display help and usage of the command   |

#### Running against a local directory

> To run stdlint against a local directory, it is recommended to install stdlint per project and use it with npm scripts. Please refer to the installation instructions.

If you plan to run stdlint with a git CLI hook or a CI stage, you can do so by running stdlint as follows.

```
stdlint --path <absolute_or_relative_path_to_repository>
```

e.g, To run stdlint on the current working directory, run `stdlint --path .`

### Configuring stdlint

Although stdlint comes with a built-in set of rules, you can disable any rule if it doesn't fit your projects. You can do so by adding a `.stdlintrc` file at the root of your project.

You can disable a rule (for example `myAwesomeRule`), but adding it to the `.stdlintrc` file as follows:

```js
{
    "rules": {
        "myAwesomeRule": false
    }
}
```

Some rules can be re-configured too. This is often useful to tweak the rule to fit your needs. If the rule supports customization, you can pass the rule configuration using `.stdlintrc` as follows:

```js
{
    "rules": {
        "conventionalCommits": {
            "noOfCommitsToCheck": 5
        }
    }
}
```

To see if a particular rule supports any configurations, please refer to the documentation of the rule set.

### Using Rule Sets

`stdlint` does not ship with a built-in rule set. You can instruct `stdlint` to use a rule set by installing it as an npm module and reference the rule set in `.stdlintrc` as the follows. 

e.g,
 - Install `stdlint-config-bibliocircle` module in your project
 - Update the `.stdlintrc` as follows.

 ```
{
  "extends": [
    "stdlint-config-bibliocircle"
  ],
}
 ```

You can extend with more than one rule set by providing them in the `"extends"` array.

### Writing a rule

An example rule is as follows.

```js
module.exports = {
  myAwesomeRule: ({ consts }) => ({
    severity: consts.RULE_SEVERITY.ERROR,
    category: 'Some Rule Category',
    checkFunction: async ({ 
        gitClient, // git client
        repoConfig, // github project configuration object
        defaultBranchProtectionConfig, // github branch protection configuration for the default branch
        ruleConfig // custom configuration for the rule passed via `.stdlintrc`
    }) => {
      // Do your checks here, and return an object in the following format:
      return {
        score: 80, // a number between 0-100
        passed: true, // boolean
        message: "Project passed myAwesomeRule with flying colours" // information to show in the stdlint output
      };
    },
  }),
};
```

### Contribution

If you'd love to contribute to the project, please feel free to raise a PR.
