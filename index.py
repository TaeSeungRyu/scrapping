import os
import time
import random
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium_stealth import stealth
from webdriver_manager.chrome import ChromeDriverManager

# .env 파일 로드
load_dotenv()

# ✅ Chrome 옵션 설정
chrome_options = Options()
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--disable-popup-blocking")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("--disable-infobars")

# ✅ User-Agent 변경 (탐지 우회)
chrome_options.add_argument(
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
)

# ✅ WebDriver 실행
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

# ✅ Selenium Stealth 적용
stealth(
    driver,
    languages=["en-US", "en"],
    vendor="Google Inc.",
    platform="Win32",
    webgl_vendor="Intel Inc.",
    renderer="Intel Iris OpenGL Engine",
    fix_hairline=True,
)

try:
    # ✅ 웹사이트 접속
    driver.get("https://www.naver.com")
    time.sleep(1)

    # ✅ 새 탭 열기
    driver.execute_script("window.open('about:blank', '_blank');")
    time.sleep(1)

    # ✅ 새 탭으로 전환
    tabs = driver.window_handles
    driver.switch_to.window(tabs[1])
    driver.get("https://www.cardsales.or.kr/signin")
    driver.refresh()
    time.sleep(2)

    # ✅ 랜덤 입력 함수 (사람처럼 입력)
    def type_with_delay(element, text):
        for char in text:
            element.send_keys(char)
            time.sleep(random.uniform(0.3, 0.8))  # 300~800ms 랜덤 딜레이

    # ✅ 마우스 이동 및 클릭 함수
    def move_mouse_and_click(x, y):
        actions = ActionChains(driver)
        actions.move_by_offset(x, y).pause(random.uniform(0.3, 0.8)).click().perform()

    # ✅ ID 입력
    id_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located(
            (By.XPATH, "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input")
        )
    )
    id_input.click()
    type_with_delay(id_input, os.getenv("ID"))

    # ✅ Blur 처리 (마우스 이동 및 클릭)
    move_mouse_and_click(random.randint(200, 300), random.randint(600, 700))
    time.sleep(random.uniform(1, 3))

    # ✅ 비밀번호 입력
    password_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located(
            (By.XPATH, "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input")
        )
    )
    password_input.click()
    type_with_delay(password_input, os.getenv("PASSWORD"))

    time.sleep(2)

except Exception as e:
    print("❌ 오류 발생:", e)

finally:
    driver.quit()
