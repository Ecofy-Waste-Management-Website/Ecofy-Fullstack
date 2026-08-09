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

Several tests intentionally create bookings, staff accounts, inquiries, blog
posts, payments, cancellations, and notifications. Use disposable records and
the dedicated accounts in the test-case document; do not run the destructive
cases against production data.
