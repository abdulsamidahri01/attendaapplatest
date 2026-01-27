
# Attenda - Smart School Management System

**Attenda** is a high-fidelity, responsive school management dashboard built with **React 19** and **TypeScript**. It features a modern "No-Build" architecture using ES Modules, allowing it to run directly in the browser without complex bundlers.

The system handles complete academic workflows including student enrollment, employee management, class scheduling, and attendance tracking, backed by a persistent local storage engine with production-grade SQL migration capabilities.

---

## 🚀 Key Features

### 🎓 Academic Management
- **Role-Based Access Control (RBAC):** Distinct portals for **Admins**, **Employees** (Teachers), and **Students**.
- **Class & Subject Management:** Dynamic assignment of subjects to classes and mapping teachers to specific subjects.
- **Student Registry:** Full CRUD operations with detailed profiles, including family context and medical history.
- **Bulk Import:** CSV import tool with strict validation logic for mass student enrollment.

### 📊 Attendance System
- **Smart Marking:** Calendar-based attendance marking for specific classes and subjects.
- **Reporting:** Generate CSV reports filtered by date range, class, and subject.
- **Visual Analytics:** Real-time calculation of attendance percentages and visual progress bars.

### 🤖 AI Integration
- **Google Gemini API:** Integrated into the Notice Board module to auto-generate professional school announcements using the `gemini-3-flash-preview` model.

### 💾 Data & Migration
- **Local Persistence:** All data is persisted in `localStorage` for immediate state retention.
- **Production SQL Export:** Generates a canonical `database.sql` and deterministic `attenda_dump.sql` compatible with **MySQL 8.0+**.
  - **Strict Schema:** Uses `INT AUTO_INCREMENT` keys, normalized relationships, and `BCRYPT` password placeholders.
  - **Safety:** Generates transaction-wrapped SQL with subquery-based foreign key resolution (no hardcoded IDs).

### 🎨 UI/UX
- **Modern Design:** Built with **Tailwind CSS** supporting Light and Dark modes.
- **Responsive:** Fully optimized for mobile, tablet, and desktop views.
- **PWA Ready:** Includes `manifest.json` for installable web app capabilities.

---

## 🛠 Tech Stack

- **Core:** React 19, TypeScript (ESM)
- **Styling:** Tailwind CSS (CDN)
- **Icons:** Lucide React
- **Charts:** Recharts
- **AI:** Google GenAI SDK
- **Persistence:** LocalStorage + SQL Generator

---

## 📦 Installation & Setup

This project uses a modern **ES Module** architecture. No `npm install` or build step is required for the frontend logic.

### 1. Clone & Serve
Simply serve the root directory using any static file server.

```bash
# Example using Python
python3 -m http.server 8000

# Example using Node http-server
npx http-server .
```

Navigate to `http://localhost:8000`.

### 2. AI Configuration (Optional)
To enable the AI Notice generator:
1. Open `index.html`.
2. Locate the `window.process` polyfill script.
3. Insert your Google Gemini API Key:
   ```javascript
   window.process = {
     env: {
       API_KEY: 'YOUR_GEMINI_API_KEY_HERE'
     }
   };
   ```

---

## 🔑 Default Credentials

The system initializes with the following default accounts (if local storage is empty):

| Role | Username | Password | Access |
|------|----------|----------|--------|
| **Administrator** | `admin` | `admin123` | Full System Control |
| **Employee** | `john_zoo` | `123` | Dashboard, Attendance, Profile |
| **Student** | `ST-2025-001` | `123` | Read-only Portal |

---

## 🗄️ Project Structure

```
/
├── components/         # React Components (Dashboards, Forms, Modals)
├── dist/               # Static assets for deployment
├── App.tsx             # Main Controller & Router
├── types.ts            # TypeScript Interfaces
├── constants.tsx       # Initial Mock Data
├── database.sql        # Canonical MySQL Schema Definition
├── attenda_dump.sql    # Generated Data Snapshot
├── app.yaml            # Google App Engine Config
└── index.html          # Entry Point & Import Maps
```

## 🚀 Deployment

The app is pre-configured for **Google App Engine** and **Firebase Hosting**.

**Google App Engine:**
```bash
gcloud app deploy
```

**Firebase:**
```bash
firebase deploy
```

---

## 🛡️ Security Note

This is a **Frontend-First** application. 
- **Authentication:** Logic is handled client-side for demonstration.
- **Passwords:** Stored in LocalStorage. 
- **Production Use:** Use the **SQL Export** feature in *Settings* to migrate the data to a real MySQL backend before deploying for actual school usage.
