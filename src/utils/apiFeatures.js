export class ApiFeatures {
  constructor(mongooseQuery, data) {
    this.mongooseQuery = mongooseQuery;
    this.data = data;
  }
  filter() {
    let filter = { ...this.data };
    filter = JSON.parse(JSON.stringify(filter));
    this.mongooseQuery.find(filter);
    return this;
  }
}
