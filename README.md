# MediCore

MediCore is a full-stack healthcare portal built with a modern technology stack. The frontend is a [React (Vite)](https://vitejs.dev/) application, and the backend is powered by [Supabase](https://supabase.com/) as a Backend as a Service (BaaS).

This document provides instructions for running the project locally and a detailed overview of its technical architecture.

## :rocket: How to Run Locally

### Prerequisites

Before you begin, ensure you have the following tools installed:
* [Node.js](https://nodejs.org/en/) (v18 or higher)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Supabase CLI](https://supabase.com/docs/guides/cli) (run `brew install supabase/tap/supabase` in terminal for macOS)

---

### 1. Start the Supabase Backend

The Supabase local development environment runs on Docker.

1.  **Start Docker Desktop:** Make sure Docker is running on your machine.
2.  **Start Supabase:** From the project's **root directory**, run:
    ```bash
    supabase start
    ```
3.  **Get API Keys:** Once started, the terminal will output your local API details. **Copy the `API URL` and the `publishable key(anon key)`**.

    <details>
    <summary>Click to see example terminal output</summary>

    ```
    Started Supabase local development setup.

    API URL: [http://127.0.0.1:{PORT}](http://127.0.0.1:{PORT})
    DB URL: postgresql://postgres:postgres@127.0.0.1:{PORT}/postgres
    Studio URL: [http://127.0.0.1:{PORT}](http://127.0.0.1:{PORT})
    anon key: [YOUR_ANON_KEY]
    service_role key: [YOUR_SERVICE_KEY]
    ```
    </details>

---

### 2. Run the React Frontend

1.  **Navigate to the App Folder:**
    ```bash
    cd app
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Create Environment File:** Create a new file named `.env.local` inside the `app` directory (`app/.env.local`).

4.  **Add Keys to `.env.local`:** Paste the keys from Step 1 into this file:
    ```.env.local
    VITE_SUPABASE_URL=[http://127.0.0.1:{PORT}](http://127.0.0.1:{PORT})
    VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
    ```
    *(Replace `[YOUR_ANON_KEY]` with the actual key from your terminal output.)*

5.  **Start the Dev Server:**
    ```bash
    npm run dev
    ```

---

### 3. Access Your Application

Your full-stack application is now running:

| Service | URL |
| :--- | :--- |
| **Frontend (React App)** | `http://localhost:5173` |
| **Backend (Supabase Studio)** | `http://localhost:54323` |

---

## :book: Technical Architecture

This project's backend is defined by its database schema and its security policies.

### Data Schema

The database schema is defined in the Supabase migration file. Here is an overview of the core tables:

| Table | Purpose | Key Columns |
| :--- | :--- | :--- |
| **`users`** | Central table linking `auth.users` to roles. | `id` (FK to `auth.users`), `email`, `role` (text) |
| **`patients`** | Stores profile information for patient users. | `id`, `user_id` (FK to `users`), `full_name`, `date_of_birth` |
| **`doctors`** | Stores profile information for doctor users. | `id`, `user_id` (FK to `users`), `name`, `speciality` |
| **`nurses`** | Stores profile information for nurse users. | `id`, `user_id` (FK to `users`), `name` |
| **`appointments`**| Links patients, doctors, and nurses for a scheduled event. | `id`, `patient_id`, `doctor_id`, `nurse_id`, `start_time` |
| **`medical_records`**| Stores notes, vitals, and documents for a patient. | `id`, `patient_id`, `author_id` (FK to `users`), `content` |
| **`health_stats`** | Stores periodic health metrics for patients. | `id`, `patient_id`, `blood_pressure_systolic`, `bmi` |
| **`billing_history`**| Stores invoices and payment status for patients. | `id`, `patient_id`, `invoice_number`, `amount`, `status` |
| **`reminders`** | Stores notifications and reminders for any user. | `id`, `user_id`, `message`, `is_read` |

### BaaS Security Rule Architecture

This project uses Supabase's **Row Level Security (RLS)** to enforce data access rules directly in the database. This architecture ensures that data is secure at the source, and the frontend application can only access what the authenticated user is permitted to see.

**All policies are defined in the `supabase/migrations/20251021102306_remote_schema.sql` file.**

#### Core Principles

1.  **Deny by Default:** All public tables have RLS enabled. This means **no data can be accessed by any user** (even an authenticated one) unless a policy explicitly allows it.
2.  **Authentication is Key:** All policies are built around the authenticated user's ID, which is available in RLS policies via the `auth.uid()` function.
3.  **Role-Based Access Control (RBAC):** The `public.users` table contains a `role` column ('Patient', 'Doctor', 'Nurse', 'Admin'). Policies check this role to grant permissions (e.g., `(SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'::text`).
4.  **Data Segregation (Ownership):** The primary security rule is that users can only access their *own* data. Staff can only access patient data *if* they are associated via an appointment.

#### Detailed Policy Breakdown

Here is an explicit explanation of the access rules for each role:

> [!NOTE]
> **"Manage"** implies full `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rights.

**Patient Role**
* **`users`**: Can `SELECT` their *own* user record.
* **`patients`**: Can `SELECT` and `UPDATE` their *own* patient profile.
* **`appointments`**: Can `SELECT` and `INSERT` (create) appointments for themselves.
* **`medical_records`**: Can only `SELECT` records linked to their `patients.id`.
* **`billing_history`**: Can only `SELECT` their own billing history.
* **`health_stats`**: Can only `SELECT` their own health stats.
* **`reminders`**: Can only `SELECT` reminders sent to their `user_id`.

**Doctor Role**
* **`doctors`**: All authenticated users can `SELECT` the list of doctors.
* **`appointments`**: Can manage appointments assigned to their `doctors.id`.
* **`medical_records`**: Can manage (read/write) records they have *authored* (where `author_id` is their `user_id`).
* **Access to Patient Data:** This is a critical security boundary.
    * **`patients`**: Can only `SELECT` a patient's profile *if* they have an existing appointment with that patient.
    * **`health_stats`**: Can only `SELECT` a patient's health stats *if* they have an existing appointment with that patient.

**Nurse Role**
* **`nurses`**: All authenticated users can `SELECT` the list of nurses.
* **`health_stats`**:
    * Can `INSERT` new `health_stats` for any patient (as part of their duties).
    * Can only `SELECT` stats for patients they are assigned to via an `appointments` record.
* **`medical_records`**: Can only `INSERT` records of type `'Vitals'` or `'Nursing Notes'`.

**Admin Role**
* The 'Admin' role has elevated, system-wide privileges.
* Can manage all `billing_history` records.
* Can manage all `doctors` records.
* Can manage all `nurses` records.
* Can manage all `users` records.
* Can `SELECT` all `patients` records for oversight.
