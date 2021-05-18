exports.parseRepoUrl = (repoUrl) => {
  try {
    let url = repoUrl.endsWith('.git') ? repoUrl.substr(0, repoUrl.length - 4) : repoUrl;
    const { pathname } = new URL(url);
    const { owner, name } = pathname.match(/^\/(?<owner>[^/]+)\/(?<name>[^/]+)(\.git)?$/).groups;
    return {
      owner,
      name,
    };
  } catch (err) {
    throw new Error(`Github URL cannot be parsed (${err.message}). provided: ${repoUrl}`);
  }
};
