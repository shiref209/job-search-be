export class ApiFeatures {
  constructor(mongooseQuery, data) {
    this.mongooseQuery = mongooseQuery;
    this.data = data;
  }
  filter() {
    let filter = { ...this.data };
    let excludeQueryParams = [
      "page",
      "size",
      "fields",
      "skip",
      "sort",
      "search",
    ];
    excludeQueryParams.forEach((element) => {
      delete filter[element];
    });
    let match = {};
    for (let key in filter) {
      if (
        [
          "workingTime",
          "jobLocation",
          "seniorityLevel",
          "jobTitle",
          "technicalSkills",
        ].includes(key)
      ) {
        match[key] = filter[key];
      }
    }

    return Object.keys(match).length > 0 ? { $match: match } : null;
  }
}
