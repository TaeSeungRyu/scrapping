const GET_ELEMENT_BY_XPATH = `
    function getElementByXPath(xpath) {
      let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return result.singleNodeValue; // 요소가 없으면 null 반환
    }
  `;

const ID_SELECTOR_XPATH =
  "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input";
const PASSWORD_SELECTOR_XPATH =
  "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input";
const LOGIN_SELECTOR_XPATH =
  "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/button";

const FIRST_HEADER_TAP_XPATH = "/html/body/div[2]/header/div[2]/nav/ul/li[1]/a";

const SELECTED_ID_FUNCTION = `
function getOptionValueByText(selectSelector, text) {
  const select = document.getElementById(selectSelector);
  if (!select) return null;
  if (text) {
    const options = select.options;
    for (let option of options) {
      if (option.text.trim() === text.trim()) {
        return option.value;
      }
    }
  }
  return document.getElementById(selectSelector).value;
};
`;

const LEFT_MENU_XPATH = "/html/body/div[2]/div/div[3]/aside/nav/ul/li[2]/a";

module.exports = {
  ID_SELECTOR_XPATH,
  PASSWORD_SELECTOR_XPATH,
  LOGIN_SELECTOR_XPATH,
  GET_ELEMENT_BY_XPATH,
  FIRST_HEADER_TAP_XPATH,
  SELECTED_ID_FUNCTION,
  LEFT_MENU_XPATH,
};
