from __future__ import annotations

import json
import os

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


BASE_URL = os.getenv(
    "ECOFY_BASE_URL", "https://exemplary-learning-production-d528.up.railway.app"
).rstrip("/")
DEFAULT_TIMEOUT = int(os.getenv("ECOFY_TIMEOUT", "20"))
HEADLESS = os.getenv("ECOFY_HEADLESS", "0") == "1"
MANUAL_LOGIN = os.getenv("ECOFY_MANUAL_LOGIN", "1") != "0"
AUTH_TOKEN = os.getenv("ECOFY_TEST_TOKEN", "").strip()


def build_driver() -> webdriver.Chrome:
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1440,1200")
    options.add_argument("--disable-gpu")
    options.add_argument("--start-maximized")
    if HEADLESS:
        options.add_argument("--headless=new")
    return webdriver.Chrome(options=options)


def shutdown_driver(driver: webdriver.Chrome) -> None:
    try:
        driver.quit()
    except Exception:
        pass


def open_route(driver: webdriver.Chrome, route: str) -> None:
    driver.get(f"{BASE_URL}{route}")


def wait_for(driver: webdriver.Chrome, condition, timeout: int = DEFAULT_TIMEOUT):
    return WebDriverWait(driver, timeout).until(condition)


def wait_for_visible(driver: webdriver.Chrome, by: By, value: str, timeout: int = DEFAULT_TIMEOUT):
    return wait_for(driver, EC.visibility_of_element_located((by, value)), timeout)


def wait_for_clickable(driver: webdriver.Chrome, by: By, value: str, timeout: int = DEFAULT_TIMEOUT):
    return wait_for(driver, EC.element_to_be_clickable((by, value)), timeout)


def xpath_literal(text: str) -> str:
    # Python repr() is not an XPath string literal when text contains both quote types.
    if "'" not in text:
        return f"'{text}'"
    if '"' not in text:
        return f'"{text}"'
    return "concat(" + ', "\'", '.join(f"'{part}'" for part in text.split("'")) + ")"


def click_text(driver: webdriver.Chrome, text: str, timeout: int = DEFAULT_TIMEOUT) -> None:
    element = wait_for_clickable(
        driver,
        By.XPATH,
        f"//*[self::button or self::a or self::span or self::div][contains(normalize-space(), {xpath_literal(text)})]",
        timeout,
    )
    element.click()


def find_text(driver: webdriver.Chrome, text: str, timeout: int = DEFAULT_TIMEOUT):
    return wait_for_visible(
        driver,
        By.XPATH,
        f"//*[contains(normalize-space(), {xpath_literal(text)})]",
        timeout,
    )


def assert_text_present(driver: webdriver.Chrome, text: str, timeout: int = DEFAULT_TIMEOUT) -> None:
    find_text(driver, text, timeout)


def fill_input_by_label(driver: webdriver.Chrome, label: str, value: str, timeout: int = DEFAULT_TIMEOUT) -> None:
    label_node = wait_for_visible(
        driver,
        By.XPATH,
        f"//label[contains(normalize-space(), {xpath_literal(label)})]",
        timeout,
    )
    field = label_node.find_element(By.XPATH, "following::input[1]")
    field.clear()
    field.send_keys(value)


def fill_textarea_by_label(driver: webdriver.Chrome, label: str, value: str, timeout: int = DEFAULT_TIMEOUT) -> None:
    label_node = wait_for_visible(
        driver,
        By.XPATH,
        f"//label[contains(normalize-space(), {xpath_literal(label)})]",
        timeout,
    )
    field = label_node.find_element(By.XPATH, "following::textarea[1]")
    field.clear()
    field.send_keys(value)


def select_by_label(driver: webdriver.Chrome, label: str, visible_text: str, timeout: int = DEFAULT_TIMEOUT) -> None:
    label_node = wait_for_visible(
        driver,
        By.XPATH,
        f"//label[contains(normalize-space(), {xpath_literal(label)})]",
        timeout,
    )
    select_element = label_node.find_element(By.XPATH, "following::select[1]")
    Select(select_element).select_by_visible_text(visible_text)


def fill_input_by_name(driver: webdriver.Chrome, name: str, value: str, timeout: int = DEFAULT_TIMEOUT) -> None:
    field = wait_for_visible(driver, By.NAME, name, timeout)
    field.clear()
    field.send_keys(value)


def press_enter(driver: webdriver.Chrome, by: By, value: str, timeout: int = DEFAULT_TIMEOUT) -> None:
    field = wait_for_visible(driver, by, value, timeout)
    field.send_keys(Keys.ENTER)


def wait_for_any_path(driver: webdriver.Chrome, paths: list[str], timeout: int = DEFAULT_TIMEOUT) -> str:
    wait = WebDriverWait(driver, timeout)
    wait.until(lambda current: any(path in current.current_url for path in paths))
    for path in paths:
        if path in driver.current_url:
            return path
    raise TimeoutException(f"None of the expected paths were reached: {paths}")


def manual_step(message: str) -> None:
    print(message)
    if MANUAL_LOGIN:
        input("Press Enter after completing the step in the browser...")


def browser_fetch_json(driver: webdriver.Chrome, url: str, method: str = "GET", body: dict | None = None, headers: dict | None = None):
    request_headers = {"Content-Type": "application/json", **(headers or {})}
    if AUTH_TOKEN:
        request_headers.setdefault("Authorization", f"Bearer {AUTH_TOKEN}")

    script = """
    const done = arguments[arguments.length - 1];
    const [requestUrl, requestMethod, requestHeaders, requestBody] = arguments;
    fetch(requestUrl, {
      method: requestMethod,
      credentials: 'include',
      headers: requestHeaders,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    }).then(async (response) => {
      const text = await response.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (error) { data = text; }
      done({ status: response.status, ok: response.ok, data });
    }).catch((error) => done({ status: 0, ok: false, data: String(error) }));
    """
    return driver.execute_async_script(script, url, method, request_headers, body)


def current_body_text(driver: webdriver.Chrome) -> str:
    return driver.find_element(By.TAG_NAME, "body").text


def assert_any_text_present(driver: webdriver.Chrome, texts: list[str], timeout: int = DEFAULT_TIMEOUT) -> str:
    """Return the first matching expected message, or fail with useful UI text."""
    end = WebDriverWait(driver, timeout, poll_frequency=0.25)
    def matched(current):
        body = current_body_text(current).lower()
        return next((text for text in texts if text.lower() in body), False)
    try:
        return end.until(matched)
    except TimeoutException as error:
        raise AssertionError(f"Expected one of {texts}; page showed: {current_body_text(driver)[:1000]}") from error


def click_if_present(driver: webdriver.Chrome, text: str, timeout: int = 3) -> bool:
    try:
        click_text(driver, text, timeout)
        return True
    except TimeoutException:
        return False


def accept_alert_if_present(driver: webdriver.Chrome, timeout: int = 3) -> bool:
    try:
        WebDriverWait(driver, timeout).until(EC.alert_is_present()).accept()
        return True
    except TimeoutException:
        return False
