
## Scope

Complete backend for the beauty salon site using Lovable Cloud (Supabase) + TanStack Start server functions.

## 1. Database (single migration)

- `profiles` — id (FK auth.users), full_name, phone, avatar_url, timestamps
- `app_role` enum (`admin`, `customer`) + `user_roles` table + `has_role()` security-definer function
- `services` — name, slug, description, duration_min, price, image_url, is_active, sort_order
- `bookings` (replaces current `consultation_bookings`) — user_id (nullable, guest allowed), service_id, name, email, phone, preferred_date, preferred_time, message, status (`new` / `confirmed` / `completed` / `cancelled`), admin_notes, timestamps
- Trigger: auto-create `profiles` row + assign `admin` role to first signup, `customer` to everyone else
- Trigger: `notify_booking_created` calls the booking-confirmation server route via `pg_net` (or we call from the server fn after insert — simpler)
- Strict RLS:
  - profiles: owner read/write, admin read all
  - user_roles: owner read, admin read/write
  - services: public read active; admin full
  - bookings: insert by anyone (guest); user reads their own; admin full
- GRANTs as required

## 2. Auth

- Email + password and Google OAuth (`configure_social_auth`)
- `/auth` page (sign in / sign up, password reset)
- `/reset-password` page
- `_authenticated/` route layout (managed gate)
- Sign-in CTA in header, sign-out hygiene

## 3. Customer portal (`/account`)

- Profile edit (name, phone)
- "My Bookings" list with status badges + cancel button

## 4. Admin dashboard (`/admin`)

Gated by `has_role(uid,'admin')`:
- Overview stats (today, upcoming, total customers)
- Bookings table: filter by status, change status, add notes, view details
- Services CRUD (create / edit / archive / reorder)
- Customers list (profiles)

## 5. Booking flow

- Update existing `BookingDialog` to pick from live `services` table, attach `user_id` when signed in, write to new `bookings` table
- After insert, server fn enqueues:
  - customer confirmation email
  - admin alert email
  - WhatsApp message (see §7)
- Admin status changes trigger a "status update" email

## 6. Emails (Lovable Emails)

- Set up email domain → `setup_email_infra` → `scaffold_transactional_email`
- Templates: `booking-confirmation`, `admin-booking-alert`, `booking-status-update`
- Branded with site colors

## 7. WhatsApp notifications

WhatsApp can't be sent directly — needs a provider. Two clean options I'll set up; **I'll ask you to pick one after the plan is approved**:

- **Twilio WhatsApp** (easiest, sandbox available for testing) — needs `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
- **Meta WhatsApp Cloud API** (production-grade, free tier) — needs `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`

Implementation: a server fn `sendWhatsAppNotification` called alongside the email enqueue. Admin also gets a WhatsApp on new booking (to a configured `ADMIN_WHATSAPP_TO` number).

## 8. Technical notes

- All writes go through `createServerFn` (with `requireSupabaseAuth` where appropriate); admin client used only in server-only paths inside `.handler()` via `await import()`
- First-user-admin uses a trigger that checks `count(*) from user_roles` = 0
- Existing `consultation_bookings` table will be dropped (data migrated into `bookings` if you want — say so)
- After migration approval I'll wire UI, then set up email domain and WhatsApp secrets

## What I need from you before I start coding

1. **Pick WhatsApp provider**: Twilio or Meta Cloud API?
2. **Admin WhatsApp number** to receive new-booking alerts (e.g. `+91…`)
3. **From-email name** (e.g. "Aura Beauty <hello@yourdomain.com>") — and confirm you have a domain to use, or I'll use Lovable's setup dialog
4. **Existing `consultation_bookings` data** — discard, or migrate into the new `bookings` table?

Once you answer, I'll run the migration, then build UI + emails + WhatsApp in parallel.
