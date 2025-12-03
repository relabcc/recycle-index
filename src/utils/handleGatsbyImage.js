const { groupBy, reduce } = require("lodash");

module.exports = (allFile) => {
  const grouped = groupBy(allFile.edges, "node.relativeDirectory");

  const normalizeName = require("./normalizeName");

  return reduce(
    grouped,
    (f, files, group) => {
      if (group) {
        const name = normalizeName(group);
        f[name] = {};
        files.forEach(({ node }) => {
          const nodeName = node.name;
          const [pn, partName] = nodeName.split("-");
          f[name][partName || pn] = node.childImageSharp;
        });
      } else {
        files.forEach(({ node }) => {
          const nodeName = normalizeName(node.name);

          f[nodeName] = { [nodeName]: node.childImageSharp };
        });
      }
      return f;
    },
    {}
  );
};
