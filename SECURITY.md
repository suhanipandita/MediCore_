# Security Policy

## Supported Versions

Only the most recent stable version of this project is actively monitored and supported for security vulnerabilities.

| Version | Supported |
| :--- | :--- |
| 1.0.0+ | :white_check_mark: |
| < 1.0.0 | :x: |

## Reporting a Vulnerability

We take all security bugs in MediCore seriously. To report a security vulnerability, please **do not** create a public GitHub issue.

Instead, please use one of the following methods:

1.  **(Recommended)** Use the "Report a vulnerability" feature on this repository's "Security" tab.
2.  Email a detailed report to `suhanipandita10@gmail.com`.

Please provide all relevant information, including the type of vulnerability, the affected component, and detailed steps to reproduce it. We will make every effort to acknowledge your report within 48 hours.

---

## Security Architecture Overview

This project uses **Supabase** as its Backend as a Service (BaaS). Security is not managed in the frontend application but is enforced at the database level using **PostgreSQL Row Level Security (RLS)**.

### Core Security Principles

1.  **RLS Enabled by Default:** All tables in the `public` schema have Row Level Security enabled. This means all access is **denied by default** unless an explicit policy grants permission.
2.  **Authentication is Required:** Nearly all data policies require a user to be authenticated, checking against `auth.uid()`.
3.  **Role-Based Access Control (RBAC):** Access is governed by a user's `role` (e.g., 'Patient', 'Doctor', 'Nurse', 'Admin') stored in the `public.users` table. Policies use this role to grant specific permissions, such as allowing an 'Admin' to manage billing records or a 'Nurse' to insert health stats.
4.  **Data Segregation (Ownership):** The primary security rule is that users can only access their *own* data.
    * Patients are restricted to viewing records linked to their own user ID (e.g., in `patients`, `appointments`, `medical_records`).
    * Staff (Doctors, Nurses) can *only* access patient data if they are linked to that patient via an `appointments` record. This prevents staff from accessing the records of unassociated patients.
    * Admins have elevated privileges to manage system-wide records like user lists and doctor profiles.

### Detailed Policies

For a complete, explicit list of every table and security policy, please see the **[Technical Architecture](README.md#technical-architecture)** section in the main `README.md` file, which is sourced from the database migration scripts.
