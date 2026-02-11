const collegeCodes = require("../college_codes/codes"); // path to your collegeCodes array

function findCollegesByName(partialName) {
  const lowerPartial = partialName.toLowerCase();

  const results = collegeCodes
    .filter((college) => {
      const code = Object.keys(college)[0];
      const name = college[code];
      return name.toLowerCase().includes(lowerPartial);
    })
    .map((college) => {
      const code = Object.keys(college)[0];
      return {
        collageName: college[code],
        collageCode: code,
      };
    });

  return results;
}
module.exports = findCollegesByName;
