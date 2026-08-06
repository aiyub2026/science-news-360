# Science News 360 V1.3.1A

Enterprise Authentication & Role Management frontend foundation for Science News 360.

## Run
```text
npm install
npm run build
npm run dev
```

Open the Local address printed by Next.js.

## Main routes
- `/id/login`
- `/id/register`
- `/id/verify-email`
- `/id/forgot-password`
- `/id/profile-completion`
- `/id/contributor-application`
- `/admin/login`
- `/dashboard/reader`
- `/dashboard/contributor`
- `/dashboard/author`
- `/dashboard/reviewer`
- `/dashboard/editor`
- `/dashboard/publisher`
- `/dashboard/admin`
- `/dashboard/system-admin`

## Demo behavior
- Any valid email/password of at least six characters can be used for local role testing.
- Emails containing `admin` are routed to Administrator.
- Emails containing `system` are routed to System Administrator.
- Registration creates a Reader account.
- Contributor application remains pending until the local approval simulation is selected.

This browser-local behavior is strictly for frontend workflow validation. Production authentication must be server-side.


## V2.0.7
Real editorial queue, full editorial workspace, capability RBAC and additive persistent data engine. See CHANGELOG_V2.0.7.md.
