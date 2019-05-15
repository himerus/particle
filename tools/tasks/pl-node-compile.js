const { exec } = require('child_process');

/**
 * Compile Pattern Lab
 * @param plPath Full path to PL
 * @returns {function(*)} A compile function that takes a callback
 */
module.exports = function plNodeCompile(plPath) {
  // Note returns a function with the plPath in closure
  return done => {
    exec(`cd ${plPath} && npm run build`, (err, stdout, stderr) => {
      console.log(stdout);

      if (err) {
        console.log(stderr);
        done();
        return false;
      }

      done();
      return true;
    });
  };
};
