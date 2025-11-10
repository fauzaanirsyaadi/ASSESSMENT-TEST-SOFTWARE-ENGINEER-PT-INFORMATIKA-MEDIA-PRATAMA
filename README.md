# Assessment Test - PT Informatika Media Pratama

This repository contains a full-stack web application built as an assessment test for the Software Engineer position at PT Informatika Media Pratama.

The application is a simple Post Management system with user authentication, built using Laravel for the backend API and Next.js (App Router) for the frontend.

## Project Structure

The repository is organized into two main directories:

-   `/laravel`: Contains the Laravel backend API.
-   `/nextjs`: Contains the Next.js frontend application.

This separation ensures a clean and maintainable codebase, with a clear distinction between the backend and frontend concerns.

---

## 1. Backend Setup (Laravel)

The backend is a RESTful API built with Laravel 11. It handles user authentication (using Sanctum) and all CRUD (Create, Read, Update, Delete) operations for posts.

### Requirements

-   PHP >= 8.2
-   Composer
-   A database (e.g., SQLite, MySQL, PostgreSQL)

### Installation and Setup

1.  **Navigate to the Laravel directory:**
    ```bash
    cd laravel
    ```

2.  **Install Composer dependencies:**
    ```bash
    composer install
    ```

3.  **Create the environment file:**
    Copy the example environment file.
    ```bash
    cp .env.example .env
    ```

4.  **Generate an application key:**
    ```bash
    php artisan key:generate
    ```

5.  **Configure your database:**
    Open the `.env` file and configure your database connection details (e.g., `DB_CONNECTION`, `DB_HOST`, `DB_DATABASE`, etc.). For a quick start, you can use SQLite by creating an empty `database.sqlite` file in the `/database` directory and setting `DB_CONNECTION=sqlite` in your `.env` file.

6.  **Run database migrations:**
    This will create the `users` and `posts` tables.
    ```bash
    php artisan migrate
    ```

7.  **Start the development server:**
    By default, it will run on `http://localhost:8000`.
    ```bash
    php artisan serve
    ```

The API is now running and ready to accept requests.

### Troubleshooting

-   **`composer install` fails due to missing PHP extensions:**
    If you encounter errors about missing PHP extensions like `ext-fileinfo`, you can try running Composer with the `--ignore-platform-reqs` flag:
    ```bash
    composer install --ignore-platform-reqs
    ```
    However, the recommended solution is to enable the required extensions in your `php.ini` file.

-   **`composer install` fails with "Filename too long" on Windows:**
    This can happen on Windows due to path length limitations. To resolve this, you can enable long paths in Git with the following command:
    ```bash
    git config --global core.longpaths true
    ```
    After running this command, try running `composer install` again.

---

## 2. Frontend Setup (Next.js)

The frontend is a modern web application built with Next.js 14 (App Router). It consumes the Laravel API to provide a reactive user interface for authentication and post management. It is styled using Tailwind CSS and DaisyUI.

### Requirements

-   Node.js >= 18.x
-   npm or yarn

### Installation and Setup

1.  **Navigate to the Next.js directory:**
    ```bash
    cd nextjs
    ```

2.  **Install npm dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file (optional):**
    You can create a `.env.local` file to specify the backend URL if it's different from the default.
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
    ```
    If you don't create this file, the application will default to `http://localhost:8000/api`.

4.  **Start the development server:**
    By default, it will run on `http://localhost:3000`.
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to `http://localhost:3000` to use the application.

### Troubleshooting

-   **`npm install` fails with "running scripts is disabled on this system":**
    This error is caused by the PowerShell execution policy. To resolve this, you can run the following command in PowerShell as an administrator:
    ```bash
    Set-ExecutionPolicy RemoteSigned
    ```
    After running this command, try running `npm install` again.

---

## 3. Docker Compose Setup (Bonus)

For a quick start with all services running together, you can use Docker Compose. This setup includes MySQL database, Laravel backend, and Next.js frontend.

### Requirements

-   Docker
-   Docker Compose

### Installation and Setup

1.  **Make sure Docker and Docker Compose are installed:**
    ```bash
    docker --version
    docker-compose --version
    ```

2.  **Start all services:**
    ```bash
    docker-compose up -d
    ```

3.  **Set up Laravel environment:**
    ```bash
    # Copy environment file
    cp laravel/.env.example laravel/.env
    
    # Generate application key
    docker-compose exec laravel php artisan key:generate
    
    # Run migrations
    docker-compose exec laravel php artisan migrate
    ```

4.  **Access the application:**
    -   Frontend: `http://localhost:3000`
    -   Backend API: `http://localhost:8000/api`
    -   MySQL: `localhost:3306`

5.  **View logs:**
    ```bash
    docker-compose logs -f
    ```

6.  **Stop all services:**
    ```bash
    docker-compose down
    ```

7.  **Stop and remove volumes (cleanup):**
    ```bash
    docker-compose down -v
    ```

### Docker Compose Services

-   **mysql**: MySQL 8.0 database
-   **laravel**: Laravel backend API (port 8000)
-   **nextjs**: Next.js frontend (port 3000)

### Troubleshooting

-   **Port already in use:**
    If ports 3000, 8000, or 3306 are already in use, you can modify the port mappings in `docker-compose.yml`.

-   **Permission issues on Linux:**
    You may need to adjust file permissions:
    ```bash
    sudo chown -R $USER:$USER laravel nextjs
    ```

-   **Rebuild containers:**
    If you make changes to Dockerfiles, rebuild the containers:
    ```bash
    docker-compose up -d --build
    ```

---

## Core Features Implemented

-   **Authentication:** Secure user sign-up, sign-in, and sign-out functionality.
-   **Post Management (CRUD):**
    -   List all posts with pagination.
    -   View post details.
    -   Create a new post (authenticated users only).
    -   Edit an existing post (authorized users only - post owners).
    -   Delete a post (authorized users only - post owners).
-   **Clean UI:** A clean and responsive user interface built with DaisyUI components.
-   **Best Practices:**
    -   **Backend:** Use of Policies for authorization, route model binding, and API resources.
    -   **Frontend:** Correct Tailwind/DaisyUI integration, global state management with React Context, and a modular component structure.
