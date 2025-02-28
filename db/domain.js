const STATUS_ENUM = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

class ScrapperData {
  constructor({ id, username, company, status, loginFailCount, password }) {
    this.id = id;
    this.username = username || "";
    this.company = company || -1;
    this.status = status || "";
    this.loginFailCount = loginFailCount || -1;
    this.password = password || "";
  }
}

module.exports = {
  ScrapperData,
  STATUS_ENUM,
};
