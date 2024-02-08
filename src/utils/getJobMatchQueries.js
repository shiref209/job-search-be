export const getJobMatchQuery = (req) => {
  let matchQuery = {
    "company.companyName": req.query.companyName,
  };
  [
    "workingTime",
    "jobLocation",
    "seniorityLevel",
    "jobTitle",
    "technicalSkills",
  ].forEach((key) => {
    if (req.query[key]) {
      matchQuery[key] = req.query[key];
    }
  });
  return matchQuery;
};
