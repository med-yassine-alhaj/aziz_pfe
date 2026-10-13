Frontend quick notes

- Auth flow: the backend `LoginController::login` returns a `token` (plain-text Sanctum token).
- The frontend stores the token in `localStorage` under `engineerium_token` and sends it in `Authorization: Bearer <token>`.
- Files:
  - `src/api/axios.js`: axios instance that attaches `Authorization` from `localStorage`.
  - `src/context/AuthContext.jsx`: stores `engineerium_token` and `engineerium_user` on login/register.

Usage:
1. Login via the UI (or API). The returned token is saved automatically.
2. Subsequent API requests include the bearer token.

This app now uses token-based Bearer auth only. No CSRF cookie call is needed for login or subsequent API requests.

Admin portal:
- Run the same frontend on a separate port with `npm run dev:admin`.
- Open the admin login on port `3002`.
- Start the accountant portal with `npm run dev:accountant` on port `3001`.
- Start the client portal with `npm run dev` on port `3000`.
- Existing seeded admin account: `admin@engineerium.tn` / `Admin@2024`.
- Backend CORS allows `http://localhost:3000`, `http://localhost:3001`, and `http://localhost:3002`.
