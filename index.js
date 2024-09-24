import moment from "moment";
import jsonFile from "jsonfile";
import simpleGit from "simple-git";

const filePath = "./data.json";

const makeCommit = (n) => {
  if (n === 0) return simpleGit().push();

  const DATE = moment().format(); // Use current date/time

  const data = {
    // Add meaningful data here (optional)
    date: DATE,
  };
console.log(data)
  jsonFile
    .writeFile(filePath, data)
    .then(() =>
      simpleGit()
        .add([filePath])
        .commit(DATE, { "--date": DATE }, makeCommit.bind(this, --n))
    );
};

makeCommit(1); // Number of commits can be adjusted







const inter = `woow` 
console.log(inter)