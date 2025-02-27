class ScrapperData {
  constructor({ id, name, number, description }) {
    this.id = id;
    this.name = name | "";
    this.number = number | -1;
    this.description = description | "";
  }
}

module.exports = ScrapperData;
