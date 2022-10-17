const { groupBy, reduce } = require("lodash");

module.exports = (allFile) => {
  const grouped = groupBy(allFile.edges, "node.relativeDirectory");

  return reduce(
    grouped,
    (f, files, group) => {
      if (group) {
        const name = decodeURIComponent(group).replace(/(\d|\s)+/, "");
        f[name] = {};
        files.forEach(({ node }) => {
          const nodeName = decodeURIComponent(node.name);
          const [pn, partName] = nodeName.split("-");
          f[name][partName || pn] = node.childImageSharp;
        });
      } else {
        files.forEach(({ node }) => {
          const nodeName = decodeURIComponent(node.name);

          f[nodeName] = { [nodeName]: node.childImageSharp };
        });
      }
      return f;
    },
    {}
  );
};
