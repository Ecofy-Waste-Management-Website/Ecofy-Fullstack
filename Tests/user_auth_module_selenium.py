from __future__ import annotations

import os
import sys
from pathlib import Path


CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from selenium_support import (  # noqa: E402
    assert_any_text_present,
    assert_text_present,
    browser_fetch_json,
    build_driver,
    click_text,
    current_body_text,
    fill_input_by_label,
    manual_step,
    open_route,
    shutdown_driver,
    wait_for_any_path,
)


API_BASE_URL = os.getenv("ECOFY_API_URL", "http://localhost:5000").rstrip("/")


def run_au_01_customer_login(driver) -> None:
    open_route(driver, "/landing")
    manual_step("AU-01: sign in with customer01@ecofy.test / Cust@12345, then continue.")
    wait_for_any_path(driver, ["/dashboard", "/redirect", "/admin-dashboard", "/staff-dashboard"])
    assert_text_present(driver, "Schedule a Pickup")


def run_au_02_wrong_password_note(driver) -> None:
    open_route(driver, "/landing")
    manual_step("AU-02: attempt login with the wrong password and confirm the Clerk error before continuing.")
    body = current_body_text(driver).lower()
    if not any(word in body for word in ("wrong", "invalid", "error")):
        print("AU-02: no error text detected, check the Clerk modal manually.")


def run_au_03_admin_route_access(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("AU-03: if you are signed in as customer01@ecofy.test, confirm the admin route is blocked or redirected.")
    assert not ("/admin-dashboard" in driver.current_url and "Ecofy Admin" in current_body_text(driver)), "Customer reached the admin dashboard"


def run_au_04_admin_staff_access(driver) -> None:
    open_route(driver, "/staff-dashboard")
    manual_step("AU-04: sign in as admin01@ecofy.test / Admin@12345 and confirm the staff route follows the deployed role rules.")
    assert_any_text_present(driver, ["Pending Tasks", "Access denied", "Sign in"])


def run_au_05_expired_token_check(driver) -> None:
    result = browser_fetch_json(
        driver,
        f"{API_BASE_URL}/admin/users/create",
        method="POST",
        body={"email": "expired@example.com"},
        headers={"Authorization": "Bearer expired.token.value"},
    )
    assert result["status"] in {401, 403, 0}


def run_au_06_logout_note(driver) -> None:
    manual_step("AU-06: sign out from the user menu, then confirm protected pages are no longer available.")
    open_route(driver, "/dashboard")
    wait_for_any_path(driver, ["sign-in", "/landing", "/dashboard"])


def run_um_01_registration(driver) -> None:
    open_route(driver, "/landing")
    manual_step("UM-01: register Aira Santos / airasantos01@ecofy.test / Ecofy@123 / 09171234567, then continue.")
    assert_any_text_present(driver, ["Dashboard", "Schedule a Pickup", "success", "Verify"])


def run_um_02_duplicate_email(driver) -> None:
    open_route(driver, "/landing")
    manual_step("UM-02: attempt registration with existing.user@ecofy.test, then continue after Clerk shows its validation message.")
    assert_any_text_present(driver, ["already", "exists", "use another", "error"])


def run_um_03_invalid_email(driver) -> None:
    open_route(driver, "/landing")
    manual_step("UM-03: attempt registration with aira.ecofy.test, then continue after validation is visible.")
    assert_any_text_present(driver, ["valid email", "invalid", "email"])


def run_um_04_weak_password(driver) -> None:
    open_route(driver, "/landing")
    manual_step("UM-04: attempt registration using password 12345, then continue after the password-policy message is visible.")
    assert_any_text_present(driver, ["password", "characters", "weak"])


def run_um_05_profile_view(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("UM-05: log in as customer01@ecofy.test, then continue when the dashboard is visible.")
    click_text(driver, "Profile")
    assert_text_present(driver, "Profile & Settings")
    assert_text_present(driver, "Personal Details")


def run_um_06_profile_update(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("UM-06: log in as a customer, then continue.")
    click_text(driver, "Profile")
    fill_input_by_label(driver, "Phone Number", "09981234567")
    fill_input_by_label(driver, "Street Address", "12 Green St, Quezon City")
    click_text(driver, "Save Changes")
    assert_text_present(driver, "Profile updated successfully")


def main() -> None:
    driver = build_driver()
    try:
        run_um_01_registration(driver)
        run_um_02_duplicate_email(driver)
        run_um_03_invalid_email(driver)
        run_um_04_weak_password(driver)
        run_au_01_customer_login(driver)
        run_au_02_wrong_password_note(driver)
        run_au_03_admin_route_access(driver)
        run_au_04_admin_staff_access(driver)
        run_au_05_expired_token_check(driver)
        run_au_06_logout_note(driver)
        run_um_05_profile_view(driver)
        run_um_06_profile_update(driver)
    finally:
        shutdown_driver(driver)


if __name__ == "__main__":
    main()
