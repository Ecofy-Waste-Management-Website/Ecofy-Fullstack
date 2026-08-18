from __future__ import annotations

import importlib
import sys
from pathlib import Path


CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))


MODULES = [
    "user_auth_module_selenium",
    "service_booking_and_tracking_module_selenium",
    "staff_management_and_admin_module_selenium",
    "payment_module_selenium",
    "chatbot_and_notification_module_selenium",
]


def main() -> None:
    for module_name in MODULES:
        module = importlib.import_module(module_name)
        run = getattr(module, "main", None)
        if callable(run):
            print(f"\n=== Running {module_name} ===")
            run()


if __name__ == "__main__":
    main()
