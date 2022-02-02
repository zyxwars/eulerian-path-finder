var ghpages = require("gh-pages");

ghpages.publish("public", function (err) {
  if (!err) return console.log("ghpages finished");
  console.log(err);
});
