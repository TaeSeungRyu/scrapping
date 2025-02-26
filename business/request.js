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

module.exports = {
  FIRST_REQUEST_ACTION,
};
