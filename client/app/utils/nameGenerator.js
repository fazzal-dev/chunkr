import { uniqueNamesGenerator, starWars } from "unique-names-generator";

export const generateUserName = () => {
  return uniqueNamesGenerator({
    dictionaries: [starWars],
    separator: " ",
    length: 1,
    style: "capital",
  });
};
