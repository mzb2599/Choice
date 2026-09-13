# Cloud backup server

This server keeps Choice backups in MongoDB Atlas. The MongoDB connection string stays on the server and is never shipped inside the mobile app.

## MongoDB Atlas

1. Create an Atlas cluster and database user.
2. In **Network Access**, allow the IP address of the machine running this server. Avoid `0.0.0.0/0` in production.
3. Copy the cluster connection string and replace the placeholders in `server/.env.example`.

## Run locally

From the `server` directory:

```powershell
npm install
$env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/choice_backup"
$env:JWT_SECRET="replace-with-a-long-random-secret"
$env:SMTP_HOST="smtp.example.com"
$env:SMTP_PORT="587"
$env:SMTP_USER="your-smtp-user"
$env:SMTP_PASSWORD="your-smtp-password"
$env:SMTP_FROM="Choice <no-reply@example.com>"
$env:RESET_URL="choice://reset-password?resetToken="
$env:RESET_WEB_URL="https://your-web-app.example.com/?resetToken="
npm start
```

The API listens on `http://localhost:4000` by default. The app's login and signup screens use `/auth/signup` and `/auth/login`; backups are private to the signed-in store owner.

## Connect the app

Set `BACKEND_BASE` in `utils/auth.js` to the server's reachable URL:

- Android emulator: `http://10.0.2.2:4000`
- iOS simulator: `http://localhost:4000`
- Physical device: `http://<your-computer-LAN-IP>:4000`
- Hosted server: `https://<your-api-domain>`

Deploy the server behind HTTPS before using it with real customer data. Keep `JWT_SECRET` private and rotate the MongoDB credentials if they have been exposed outside this machine.

Password reset requires the SMTP variables above. `RESET_URL` points to the app's deep link, while `RESET_WEB_URL` must point to a web deployment that can open the reset flow. For local testing, use `http://localhost:8081/?resetToken=` for `RESET_WEB_URL` and keep the Expo web app running.

For Gmail, use `smtp.gmail.com`, port `587`, `SMTP_SECURE=false`, and a Google app password for `SMTP_PASSWORD`. Do not use your normal Google account password.
