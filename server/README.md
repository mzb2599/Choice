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
npm start
```

The API listens on `http://localhost:4000` by default.

## Connect the app

Set `BACKEND_BASE` in `components/BackupToDrive.js` to the server's reachable URL:

- Android emulator: `http://10.0.2.2:4000`
- iOS simulator: `http://localhost:4000`
- Physical device: `http://<your-computer-LAN-IP>:4000`
- Hosted server: `https://<your-api-domain>`

Deploy the server behind HTTPS and add user authentication before using it with real customer data. The current API intentionally has no authentication and should only be used for local development until that is added.
