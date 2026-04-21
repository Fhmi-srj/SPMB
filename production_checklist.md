# Production Deployment Checklist

Follow these steps to deploy your application to the cPanel hosting.

## 1. Local Machine (Before Every Deploy)
Since we are using a **Local Build Workflow**, you must prepare the CSS/JS files before pushing to Git.

- [ ] Run `npm run build` in your local terminal.
- [ ] Ensure the `public/build` directory is updated.
- [ ] Commit all changes (including the `public/build` folder) to the `Nurul-Huda` branch.
- [ ] Push to GitHub: `git push origin Nurul-Huda`.

## 2. Server Setup (First Time Only)
These steps are needed when you first set up the production environment.

- [ ] **PHP Version**: Ensure your cPanel is running **PHP 8.2 or higher**.
- [ ] **Database**: Create the database `ps_nurulhuda` and user `psb_nurulhuda`. Assign all permissions.
- [ ] **Environment**: Copy `.env.production` to the server and rename it to `.env`.
- [ ] **App Key**: If this is a fresh install, run `php artisan key:generate`.
- [ ] **Storage Link**: Run `php artisan storage:link`. (Our `deploy.sh` also checks this).

## 3. Deployment (Every Time You Update)
Once the setup is done, updating the site is easy.

- [ ] SSH into your cPanel terminal.
- [ ] Navigate to the project directory.
- [ ] Run the deploy script: `bash deploy.sh`.

## 4. Automation (Recommended)
- [ ] **Laravel Scheduler**: Add a Cron Job in cPanel to run every minute:
  ```
  * * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
  ```
- [ ] **Symlink for cPanel**: If your project is not in `public_html`, make sure your domain points to the `public` folder of this project.

---
**URL Production**: [https://psb.nurulhudaannajah.com](https://psb.nurulhudaannajah.com)
