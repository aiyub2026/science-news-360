# Administrator Setup Guide

## 1. Netlify environment variables
Create these variables in Netlify before first administrator activation:

- `NEXT_PUBLIC_SITE_URL=https://sciencenews360.my.id`
- `SN360_ADMIN_BOOTSTRAP_SECRET=<a long private random secret>`

Do not store the real bootstrap secret in GitHub.

## 2. Create the first Administrator
After deployment, open:

`https://sciencenews360.my.id/admin/setup`

Enter the Administrator name, real email address, a strong password of at least 12 characters, and the private bootstrap secret.

The setup endpoint refuses creation of another first Administrator once activation is complete.

## 3. Normal Administrator login
Use:

`https://sciencenews360.my.id/admin/login`

There is no public Administrator registration and no bundled default password.

## 4. Author registration
Readers require no account. Prospective authors use the public author registration form. Their account begins in pending status. The Administrator reviews and approves the application before authoring access is activated.

## 5. Editorial roles
Editor and Publisher roles are assigned only from Administrator user management. Never expose role selection on the public registration page.
