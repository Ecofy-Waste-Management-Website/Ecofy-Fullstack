# Ecofy Selenium suite

The scripts implement the 54 test IDs in `Ecofy_Test_Cases.docx`.  They target
the Railway deployment by default. Role-based, Stripe, and cross-user checks
pause at `manual_step()` because Clerk authentication and the required test
accounts are external to this repository.

Install the browser dependency once:

```powershell
.\.venv\Scripts\python.exe -m pip install -r Tests\requirements.txt
```

Run the full suite (it opens one browser per module):

```powershell
.\.venv\Scripts\python.exe Tests\test_track.py
```

Useful environment settings:

```powershell
$env:ECOFY_BASE_URL = "https://exemplary-learning-production-d528.up.railway.app"
$env:ECOFY_API_URL = "https://your-api-host"
$env:ECOFY_HEADLESS = "1"       # do not use when manual authentication is needed
$env:ECOFY_MANUAL_LOGIN = "0"   # only when an authenticated test setup is automated
```

## Clerk CAPTCHA / manual Chrome session

Do not attempt to automate the CAPTCHA. Instead, attach Selenium to a Chrome
window that you launch and authenticate yourself:

1. Close every Chrome window first. This prevents Chrome from reusing a normal
   profile without the debugging flag.
2. In PowerShell, launch a dedicated test profile:

   ```powershell
   $chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
   $profile = "$env:TEMP\ecofy-selenium-profile"
   & $chrome --remote-debugging-port=9222 --user-data-dir=$profile
   ```

3. In that Chrome window, open the Railway site, sign in, and complete the
   CAPTCHA normally.
4. Keep that Chrome window open. In a second PowerShell window at the project
   root, run the needed module with:

   ```powershell
   $env:ECOFY_CHROME_DEBUGGER_ADDRESS = "127.0.0.1:9222"
   .\.venv\Scripts\python.exe Tests\service_booking_and_tracking_module_selenium.py
   ```

5. Follow the terminal prompts. Press Enter only after each requested manual
   action is complete. Use one Chrome session per role; sign out and sign in as
   the next test account before running that role's module.

If Selenium says it cannot obtain ChromeDriver, update Chrome and rerun the
Selenium installation command. Selenium Manager downloads the compatible
driver on first use.

Several tests intentionally create bookings, staff accounts, inquiries, blog
posts, payments, cancellations, and notifications. Use disposable records and
the dedicated accounts in the test-case document; do not run the destructive
cases against production data.
