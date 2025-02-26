require("dotenv").config();

const _getDay = (isFirst) => {
  const today = new Date();
  let yyyymmdd =
    today.getFullYear().toString() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-";
  if (isFirst) {
    yyyymmdd += "01";
  } else {
    yyyymmdd += String(today.getDate()).padStart(2, "0");
  }

  return yyyymmdd;
};

const FIRST_REQUEST_ACTION = (startDate, endDate) => {
  if (!startDate) startDate = _getDay(true);
  if (!endDate) endDate = _getDay();
  return `   
  async function fetchData() {
var __merGrpId = getOptionValueByText("merGrpId", );
var __mbrId = document.getElementById("mbrId").value;
var __tmpParam = "merGrpId=" + __merGrpId + "&mbrId=" + __mbrId + "&startDate=" + "${startDate}" + "&endDate=" + "${endDate}"
return await fetch("${process.env.FIRST_DATA_URL}?" + __tmpParam)
  .then(response => response.json()) 
  .catch(error => console.error("Error:", error));  
  }
  fetchData();
`;
};

const SECOND_REQUEST_ACTION = (startDate, endDate, stdDateArray) => {
  if (stdDateArray) stdDateArray = stdDateArray.replace(/\-/g, "");
  if (!startDate) startDate = _getDay(true);
  if (!endDate) endDate = _getDay();
  return `
  async function fetchDataDetail() {  
var __merGrpId = getOptionValueByText("merGrpId", );
var __mbrId = document.getElementById("mbrId").value;
var __tmpParam = "q.stdDateArray=${stdDateArray}&q.merGrpId=" + __merGrpId + "&q.mbrId=" + __mbrId + "&q.startDate=" + "${startDate}" + "&q.endDate=" + "${endDate}&q.dataPerPage=500&currentPage=1"
return await fetch("${process.env.SECOND_DATA_URL}?" + __tmpParam)
  .then(response => response.json()) 
  .catch(error => console.error("Error:", error));  
  }
fetchDataDetail();
    `;
};

module.exports = {
  FIRST_REQUEST_ACTION,
  SECOND_REQUEST_ACTION,
};
