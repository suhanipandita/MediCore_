# MEDICORE

This repository contains the full-stack MediCore application, a healthcare portal built with React (Vite) on the frontend and Supabase for the backend.

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

- VS Code

- Node.js _(v18 or higher)_

- npm _(comes with Node.js)_

- Docker Desktop _(must be running)_

- Supabase CLI _(e.g., npm install -g supabase)_

### How to Run Locally

This project consists of two main parts: the supabase backend and the app frontend. Both must be running.

#### 1. Start the Supabase Backend

- The Supabase local development environment runs on Docker.

- Start Docker Desktop: Make sure Docker is running on your machine.

- Start Supabase: From the project's root directory, run:

_Bash_  
`supabase start`

**_Get API Keys: Once started, the terminal will output your local API details. Copy the API URL and the anon key. You will need them for the frontend._**

It will look like this:

`Started Supabase local development setup.`  

`API URL: http://127.0.0.1:{PORT}`  
`DB URL: postgresql://postgres:postgres@127.0.0.1:{PORT}/postgres`  
`Studio URL: http://127.0.0.1:{PORT}`  
`anon key: [YOUR_ANON_KEY]`  
`service_role key: [YOUR_SERVICE_KEY]`  

#### 2. Run the React Frontend

- Navigate to the App Folder:

_Bash_
`cd app`

**_Install Dependencies:_**

_Bash_
`npm install`

- Create Environment File: Create a new file named .env.local inside the app directory (app/.env.local).

- Add Keys to .env.local: Paste the keys from Step 1 into this file:

_Code snippet_
`VITE_SUPABASE_URL=http://127.0.0.1:{PORT}`  
`VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]`  

- (Replace [YOUR_ANON_KEY] with the actual key from your terminal output.)

- Start the Dev Server:

_Bash_  
`npm run dev`

#### 3. Access Your Application

Your full-stack application is now running:

Frontend (React App): Open http://localhost:{PORT} in your browser.

Backend (Supabase Studio): You can manage your local database at http://localhost:{PORT}.


