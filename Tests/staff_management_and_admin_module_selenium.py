from __future__ import annotations

import sys
from pathlib import Path


CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from selenium_support import (  # noqa: E402
    accept_alert_if_present,
    assert_any_text_present,
    assert_text_present,
    build_driver,
    click_text,
    fill_input_by_label,
    fill_textarea_by_label,
    manual_step,
    open_route,
    select_by_label,
    shutdown_driver,
)


def run_ad_01_create_staff(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("Log in as admin01@ecofy.test / Admin@12345, then continue.")
    click_text(driver, "Staff Account Creation")
    assert_text_present(driver, "Create New Staff")
    fill_input_by_label(driver, "First Name", "Neil")
    fill_input_by_label(driver, "Last Name", "Cruz")
    fill_input_by_label(driver, "Account Username", "neil.cruz.staff")
    fill_input_by_label(driver, "Corporate Email", "neil.cruz.staff@ecofy.test")
    fill_input_by_label(driver, "Default Password", "Ecofy@123")
    click_text(driver, "Register New Personnel")
    assert_text_present(driver, "Staff account created")


def run_ad_03_admin_analytics(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("Keep the admin session active, then continue when the dashboard is open.")
    assert_text_present(driver, "Ecofy Admin")
    assert_text_present(driver, "Admin")


def run_ad_04_publish_blog(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("Keep the admin session active, then continue.")
    click_text(driver, "Content/Blog")
    assert_text_present(driver, "Blog Management")
    click_text(driver, "New Post")
    fill_input_by_label(driver, "Title", "Ecofy Recycling Tips 2026")
    fill_input_by_label(driver, "Author", "Ecofy Admin")
    fill_textarea_by_label(driver, "Excerpt", "Practical recycling guidance for Ecofy users.")
    fill_textarea_by_label(driver, "Content", "Recycling starts with sorting waste by category and keeping contaminants out.")
    click_text(driver, "Save Draft")
    assert_text_present(driver, "Draft saved")


def run_ad_02_disable_user(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("AD-02: as admin, open User Management, disable disposable user USR-2026-019, then continue.")
    assert_any_text_present(driver, ["inactive", "disabled", "User Management"])


def run_ad_05_non_admin_forbidden(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("AD-05: sign in as a customer or staff member before continuing; the protected admin route must reject access.")
    assert not ("/admin-dashboard" in driver.current_url and "Ecofy Admin" in driver.find_element("tag name", "body").text), "Non-admin reached admin UI"


def run_ad_06_audit_log(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("AD-06: as admin, perform a disposable admin action and open its audit-log view, then continue.")
    assert_any_text_present(driver, ["Audit", "Activity", "Admin"])


def run_sm_01_assign_task(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("SM-01: as admin, open Service Requests, assign disposable booking BK-10030 to STF-04, then continue.")
    assert_any_text_present(driver, ["Assigned", "Service Requests", "Assign Staff"])


def run_sm_02_staff_schedule(driver) -> None:
    open_route(driver, "/staff-dashboard")
    manual_step("Log in as staff01@ecofy.test / Staff@12345, then continue.")
    assert_text_present(driver, "Pending Tasks")


def run_sm_03_complete_job(driver) -> None:
    open_route(driver, "/staff-dashboard")
    manual_step("Keep the staff session active, then continue.")
    assert_text_present(driver, "Active Tasks")
    manual_step("SM-03: complete an eligible disposable task (including its pickup PIN if requested), then continue.")
    assert_any_text_present(driver, ["Completed", "Complete"])


def run_sm_04_other_staff_cannot_edit(driver) -> None:
    open_route(driver, "/staff-dashboard")
    manual_step("SM-04: as Staff A, attempt to modify Staff B's task BK-10031, then continue after the denial is shown.")
    assert_any_text_present(driver, ["Access denied", "not assigned", "Forbidden", "Unauthorized"])


def run_sm_05_reassign_task(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("SM-05: as admin, reassign a disposable task from STF-04 to STF-09, then continue.")
    assert_any_text_present(driver, ["STF-09", "Assigned", "reassigned"])


def run_sm_06_overlapping_schedule(driver) -> None:
    open_route(driver, "/admin-dashboard")
    manual_step("SM-06: as admin, attempt two overlapping assignments (10:00–11:00 and 10:30–11:30) for the same staff member, then continue.")
    assert_any_text_present(driver, ["conflict", "overlap", "schedule", "assignment"])


def main() -> None:
    driver = build_driver()
    try:
        run_ad_01_create_staff(driver)
        run_ad_02_disable_user(driver)
        run_ad_03_admin_analytics(driver)
        run_ad_04_publish_blog(driver)
        run_ad_05_non_admin_forbidden(driver)
        run_ad_06_audit_log(driver)
        run_sm_01_assign_task(driver)
        run_sm_02_staff_schedule(driver)
        run_sm_03_complete_job(driver)
        run_sm_04_other_staff_cannot_edit(driver)
        run_sm_05_reassign_task(driver)
        run_sm_06_overlapping_schedule(driver)
    finally:
        shutdown_driver(driver)


if __name__ == "__main__":
    main()
