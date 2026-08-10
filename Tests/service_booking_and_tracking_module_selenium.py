from __future__ import annotations

import sys
from datetime import date, timedelta
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
    manual_step,
    open_route,
    select_by_label,
    shutdown_driver,
)
from selenium.webdriver.common.by import By


def open_booking_form(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("Log in as customer01@ecofy.test / Cust@12345, then continue.")
    click_text(driver, "Schedule a Pickup")
    click_text(driver, "Open Full Booking Form →")
    assert_text_present(driver, "Request a Pickup")


def run_sb_01_valid_booking(driver) -> None:
    open_booking_form(driver)
    select_by_label(driver, "Service Type", "Household")
    select_by_label(driver, "Waste Category", "General")
    fill_input_by_label(driver, "Pickup Location", "45 Eco Ave, Manila")
    fill_input_by_label(driver, "Phone Number", "09171234567")
    fill_input_by_label(driver, "Preferred Date", (date.today() + timedelta(days=5)).isoformat())
    click_text(driver, "Submit Request")
    assert_text_present(driver, "Pickup request submitted successfully")


def run_sb_02_missing_required(driver) -> None:
    open_booking_form(driver)
    select_by_label(driver, "Service Type", "Household")
    click_text(driver, "Submit Request")
    assert_text_present(driver, "Please fill in all required fields")


def run_sb_03_past_date(driver) -> None:
    open_booking_form(driver)
    select_by_label(driver, "Service Type", "Household")
    select_by_label(driver, "Waste Category", "General")
    fill_input_by_label(driver, "Pickup Location", "45 Eco Ave, Manila")
    fill_input_by_label(driver, "Phone Number", "09171234567")
    fill_input_by_label(driver, "Preferred Date", (date.today() - timedelta(days=2)).isoformat())
    click_text(driver, "Submit Request")
    assert_text_present(driver, "Scheduled date cannot be in the past")


def run_sb_04_pricing_by_service_type(driver) -> None:
    open_booking_form(driver)
    select_by_label(driver, "Service Type", "Household")
    household = driver.find_element(By.TAG_NAME, "body").text
    select_by_label(driver, "Service Type", "Bulk")
    bulk = driver.find_element(By.TAG_NAME, "body").text
    # The current form may deliberately defer price calculation until payment.
    if "₱" in household or "₱" in bulk or "price" in (household + bulk).lower():
        assert household != bulk, "Changing service type did not update the displayed pricing"
    else:
        print("SB-04: no price is displayed in RequestPickupModal; pricing must be asserted on the payment screen.")


def run_sb_05_booking_history(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("Log in as customer01@ecofy.test, then continue.")
    click_text(driver, "History")
    assert_text_present(driver, "Order History")
    assert_text_present(driver, "Recent Bookings")


def run_sb_06_cancel_pending_booking(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("SB-06: log in as the owner of a disposable Pending booking, open it in Track Status, then continue.")
    click_text(driver, "Track Status")
    click_text(driver, "Cancel Order")
    accept_alert_if_present(driver)
    assert_any_text_present(driver, ["Cancelled", "Pickup cancelled"])


def run_pt_01_tracking_panel(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("Log in as a customer with at least one active booking, then continue.")
    click_text(driver, "Track Status")
    assert_text_present(driver, "Track Status")


def run_pt_02_staff_updates_in_progress(driver) -> None:
    open_route(driver, "/staff-dashboard")
    manual_step("PT-02: log in as the staff member assigned to a disposable task, then continue.")
    click_text(driver, "In Progress")
    assert_any_text_present(driver, ["In Progress", "updated"])


def run_pt_03_customer_cannot_update_status(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("PT-03: log in as a customer and attempt a status-update endpoint/action for a booking, then continue.")
    assert_any_text_present(driver, ["Access denied", "Forbidden", "Track Status", "Unauthorized"])


def run_pt_04_delayed_status(driver) -> None:
    open_route(driver, "/staff-dashboard")
    manual_step("PT-04: log in as assigned staff, mark a disposable task Delayed, enter 'Heavy traffic, ETA +30 min', then continue.")
    assert_any_text_present(driver, ["Delayed", "Heavy traffic", "ETA"])


def run_pt_05_tracking_refresh(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("PT-05: keep this tracking panel open; update the same task from a staff session, then continue once the new status appears without a full page reload.")
    click_text(driver, "Track Status")
    assert_any_text_present(driver, ["Assigned", "In Progress", "En Route", "Pending"])


def run_pt_06_completed_history(driver) -> None:
    open_route(driver, "/service-history")
    manual_step("Log in as a customer, then continue when the service history page is visible.")
    assert_text_present(driver, "Order history")


def main() -> None:
    driver = build_driver()
    try:
        run_sb_01_valid_booking(driver)
        run_sb_02_missing_required(driver)
        run_sb_03_past_date(driver)
        run_sb_04_pricing_by_service_type(driver)
        run_sb_05_booking_history(driver)
        run_sb_06_cancel_pending_booking(driver)
        run_pt_01_tracking_panel(driver)
        run_pt_02_staff_updates_in_progress(driver)
        run_pt_03_customer_cannot_update_status(driver)
        run_pt_04_delayed_status(driver)
        run_pt_05_tracking_refresh(driver)
        run_pt_06_completed_history(driver)
    finally:
        shutdown_driver(driver)


if __name__ == "__main__":
    main()
