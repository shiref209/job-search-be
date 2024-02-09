//fn to get match query for job
//code is robust for tight time, my apologies
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
      //enhance key entered by req
      matchQuery[key] = req.query[key].toString().trim().toLowerCase();
    }
  });
  //staticaly handle if technicalSkills is array
  if (req.query.technicalSkills) {
    if (Array.isArray(req.query.technicalSkills)) {
      matchQuery.technicalSkills = { $in: req.query.technicalSkills };
    } else {
      matchQuery.technicalSkills = req.query.technicalSkills;
    }
  }
  return matchQuery;
};
