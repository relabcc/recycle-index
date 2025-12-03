// normalizeName: decode and remove digits, spaces, underscores (half/fullwidth)
// returns a trimmed display name used as the canonical key for images
module.exports = function normalizeName(input) {
  if (!input && input !== 0) return "";
  const decoded = decodeURIComponent(String(input));
  // strip digits, whitespace, underscores, hyphens and slashes (including fullwidth forms)
  // e.g. "38-電動牙刷" -> "電動牙刷" ; "01_手機" -> "手機"
  return decoded.replace(/[\d\s_\-＿－\/]+/g, "").trim();
};
