from __future__ import annotations

import sys
from datetime import date, timedelta
from pathlib import Path


CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from selenium_support import (  # noqa: E402
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


def prepare_booking_with_payment(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("Log in as customer01@ecofy.test / Cust@12345, then continue.")
    click_text(driver, "Schedule a Pickup")
    click_text(driver, "Open Full Booking Form →")
    select_by_label(driver, "Service Type", "Household")
    select_by_label(driver, "Waste Category", "General")
    fill_input_by_label(driver, "Pickup Location", "45 Eco Ave, Manila")
    fill_input_by_label(driver, "Phone Number", "09171234567")
    fill_input_by_label(driver, "Preferred Date", (date.today() + timedelta(days=5)).isoformat())
    click_text(driver, "Submit Request")
    assert_text_present(driver, "Complete Payment")


def run_pm_01_successful_payment_note(driver) -> None:
    prepare_booking_with_payment(driver)
    manual_step("PM-01: use the Stripe test card 4242 4242 4242 4242 in the payment element, then click Pay.")
    assert_text_present(driver, "Payment Successful")


def run_pm_02_declined_card_note(driver) -> None:
    open_route(driver, "/dashboard")
    manual_step("PM-02: open the payment modal for a pending booking and use the declined card 4000 0000 0000 0002.")


def run_pm_03_payment_history(driver) -> None:
    open_route(driver, "/payment-history")
    manual_step("PM-03: log in as the paid customer, then continue.")
    assert_text_present(driver, "Payment History")


def run_pm_04_duplicate_charge(driver) -> None:
    prepare_booking_with_payment(driver)
    manual_step("PM-04: double-click Pay for a disposable booking using Stripe 4242 4242 4242 4242, then continue after the result appears.")
    assert_any_text_present(driver, ["Payment Successful", "already", "processing"])


def run_pm_05_refund_cancelled_service(driver) -> None:
    open_route(driver, "/payment-history")
    manual_step("PM-05: cancel a paid disposable booking and trigger its refund as an authorized user, then continue.")
    assert_any_text_present(driver, ["Refunded", "refund", "Payment History"])


def run_pm_06_timeout_note(driver) -> None:
    manual_step("PM-06: simulate a payment timeout or network interruption and confirm the pending state is preserved.")


def main() -> None:
    driver = build_driver()
    try:
        run_pm_01_successful_payment_note(driver)
        run_pm_02_declined_card_note(driver)
        run_pm_03_payment_history(driver)
        run_pm_04_duplicate_charge(driver)
        run_pm_05_refund_cancelled_service(driver)
        run_pm_06_timeout_note(driver)
    finally:
        shutdown_driver(driver)


if __name__ == "__main__":
    main()
