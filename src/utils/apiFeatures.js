export class ApiFeatures {
  constructor(mongooseQuery, data) {
    this.mongooseQuery = mongooseQuery;
    this.data = data;
  }
  filter() {
    let filter = { ...this.data };
    let excludedParams = ["search"];
    excludedParams.forEach((element) => {
      delete filter[element];
    });
    filter = JSON.parse(JSON.stringify(filter));
    this.mongooseQuery.find(filter);
    return this;
  }

  search() {
    if (this.data.search) {
      this.mongooseQuery.find({
        $or: [
          { companyName: { $regex: this.data.search } },
          { description: { $regex: this.data.search } },
        ],
      });
    }
    return this;
  }
}
