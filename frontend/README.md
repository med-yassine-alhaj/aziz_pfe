Frontend quick notes

- Auth flow: the backend `LoginController::login` returns a `token` (plain-text Sanctum token).
- The frontend stores the token in `localStorage` under `fmcom_token` and sends it in `Authorization: Bearer <token>`.
- Files:
  - `src/api/axios.js`: axios instance that attaches `Authorization` from `localStorage`.
  - `src/context/AuthContext.jsx`: stores `fmcom_token` and `fmcom_user` on login/register.

Usage:
1. Login via the UI (or API). The returned token is saved automatically.
2. Subsequent API requests include the bearer token.

This app now uses token-based Bearer auth only. No CSRF cookie call is needed for login or subsequent API requests.

Admin portal:
- Run the same frontend on a separate port with `npm run dev:admin`.
- Open the admin login on port `3001`.
- Existing seeded admin account: `admin@fmcom.ma` / `Admin@2024`.
- Backend CORS now allows both `http://localhost:3000` and `http://localhost:3001`.
