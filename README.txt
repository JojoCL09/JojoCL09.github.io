# 🎀 My Little Pink World

## What this version does
- Everyone can READ the guestbook.
- Only logged-in users can WRITE.
- Accounts use email + password.
- Your easy-to-edit content is in `content.js`.
- Your Supabase connection is in `config.js`.
- Database security rules are in `guestbook.sql`.

## One-time setup
1. Create a Supabase project.
2. In Supabase SQL Editor, paste everything from `guestbook.sql` and run it.
3. In Supabase project settings, copy the project URL and the PUBLISHABLE key.
4. Put those two values in `config.js`.
5. Upload the whole folder to your web host.

Do NOT put a Supabase `service_role` key in this website. Only the publishable/anon client key belongs in browser code.

## Easy editing
- Change the main text in `content.js`.
- Change colors at the top of `index.html` under `:root`.
- Change blog post text directly in `index.html`.
- Add images by replacing the emoji photo boxes with `<img>` elements.

## Important
Opening `index.html` directly on your computer is useful for previewing the design, but the shared guestbook needs the site to be hosted online and connected to Supabase.


ADMIN BLOG
- admin.html is the private admin page.
- Add your Supabase publishable key to config.js once.
- Open https://jojocl09.github.io/admin.html to log in and publish posts.
- Only the UID configured in the database is allowed to create, edit, or delete posts.
