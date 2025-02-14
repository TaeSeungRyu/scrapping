require("dotenv").config();
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function main() {
  // ✅ Chrome 옵션 설정
  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  options.addArguments("--disable-popup-blocking");
  options.addArguments("--disable-notifications");
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-infobars");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-extensions");

  // ✅ User-Agent 변경 (탐지 우회)
  options.addArguments(
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
  );

  // ✅ Selenium WebDriver 실행
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // ✅ 웹사이트 접속
    await driver.get("https://www.naver.com");

    await driver.sleep(3000);

    // ✅ 새 탭 열기
    await driver.executeScript("window.open('about:blank', '_blank');");
    await driver.sleep(2000);
    let tabs = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabs[1]);
    await driver.get("https://www.cardsales.or.kr/signin");
    await driver.sleep(2000);

    // ✅ 랜덤 입력 함수 (사람처럼 입력)
    async function typeWithDelay(element, text) {
      for (let char of text) {
        await element.sendKeys(char);
        await driver.sleep(Math.floor(300 + Math.random() * 500)); // 100~400ms 랜덤 딜레이
      }
    }

    // ✅ 마우스 이동 및 클릭 함수
    async function moveMouseAndClick(x, y) {
      x = Math.floor(x);
      y = Math.floor(y);
      await driver
        .actions()
        .move({ x, y })
        .pause(Math.floor(300 + Math.random() * 500)) // 랜덤 대기
        .click()
        .perform();
    }

    // ✅ ID 입력
    const idInput = await driver.wait(
      until.elementLocated(
        By.xpath(
          "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input"
        )
      ),
      5000
    );
    await idInput.click();
    await typeWithDelay(idInput, process.env.ID);

    // ✅ Blur 처리 (마우스 이동 및 클릭)
    await moveMouseAndClick(
      200 + Math.random() * 100,
      600 + Math.random() * 100
    );
    await driver.sleep(1000 + Math.random() * 2000);

    // ✅ 비밀번호 입력
    const passwordInput = await driver.wait(
      until.elementLocated(
        By.xpath(
          "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input"
        )
      ),
      5000
    );
    await passwordInput.click();
    await typeWithDelay(passwordInput, process.env.PASSWORD);

    // ✅ 로그인 후 로딩 대기
    await driver.sleep(5000 + Math.random() * 5000);
  } catch (error) {
    console.error("❌ 오류 발생:", error);
  }
})();
