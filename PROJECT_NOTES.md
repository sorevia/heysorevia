# Sorevia Project Notes

## What We Built

- Premium Sorevia peanut butter ecommerce homepage.
- Promotional hero and slideshow sections.
- Product cards connected to backend product data.
- Add to cart and payment/checkout page.
- Supabase backend for products, newsletter, orders, order items, and profiles.
- Supabase Auth signup, login, logout, account page, and forgot password.
- Order history and payment history for logged-in users only.
- Track order page that only shows orders belonging to the logged-in user.
- Stock-aware checkout that blocks orders above available stock.
- Stock decreases automatically when an order is placed.
- Low-stock marketing labels like `Only 10 left`, `Only 2 left`, and `Sold out`.
- Admin dashboard at `/admin`.

## Important Pages

- `/` - homepage
- `/signup` - create account
- `/login` - login
- `/forgot-password` - password reset
- `/account` - user account
- `/payment` - cart and checkout
- `/orders` - logged-in user order/payment history
- `/track-order` - logged-in user order tracking
- `/admin` - private manager dashboard

## Backend API Routes

- `/api/products` - loads products from Supabase
- `/api/newsletter` - saves newsletter signups
- `/api/orders` - creates orders and loads user orders
- `/api/admin/dashboard` - admin analytics/products/orders data
- `/api/admin/products` - admin product updates
- `/api/admin/orders` - admin order/payment status updates

## Supabase Tables

- `products`
- `newsletter_signups`
- `profiles`
- `orders`
- `order_items`

## Supabase Function

- `create_order_with_stock`

This function:
- checks if products are active
- checks stock before order creation
- blocks sold-out products
- blocks quantity above stock
- creates the order
- creates order items
- decreases product stock

## Env Variables

Add these in `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-sb-secret-key

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-sb-publishable-key

ADMIN_EMAILS=your-email@example.com
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
```

## Admin Dashboard

Open:

```text
http://localhost:3000/admin
```

To access admin:

1. Add your admin email to `.env.local`:

```env
ADMIN_EMAILS=heysorevia@gmail.com
NEXT_PUBLIC_ADMIN_EMAILS=heysorevia@gmail.com
```

2. Restart the dev server:

```powershell
.\node_modules\.bin\next.cmd dev
```

3. Login using the same email.
4. Open:

```text
http://localhost:3000/admin
```

The normal account page is:

```text
http://localhost:3000/account
```

The admin dashboard is separate from the customer account page.

Admin can:
- view revenue
- view total orders
- view units sold
- view best seller chart
- view low stock products
- update product stock
- update product price
- edit product descriptions
- activate/deactivate products
- update order status
- update payment status

## Product Stock Rules

- If stock is above `10`, no urgency label.
- If stock is `10` or less, product shows `Only X left`.
- If stock is `0`, product shows `Sold out`.
- Sold-out products cannot be added to cart.
- Cart quantity cannot go above current stock.
- Checkout cannot create an order above available stock.

## Supabase Setup Reminder

Run the full SQL in:

```text
supabase/schema.sql
```

Inside:

```text
Supabase Dashboard -> SQL Editor -> New query -> Run
```

The SQL is safe to rerun. It does not reset manually edited stock.

## Run Locally

```powershell
cd C:\Users\Hamza\Downloads\sorv1
.\node_modules\.bin\next.cmd dev
```

Open:

```text
http://localhost:3000
```

## Checks Used

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\next.cmd build
```

Both were passing after the latest changes.

## Chat History Summary

1. Requested a premium ecommerce marketing website for Sorevia peanut butter with conversion-focused sections, social proof, scarcity, upsells, trust badges, sticky CTAs, newsletter, animations, product showcase, lifestyle storytelling, and responsive UI.
2. Converted the original microbiome-style site into a Sorevia peanut butter brand site.
3. Added promotional slideshow, premium product sections, social proof, trust badges, bundle offers, newsletter/community section, sticky cart CTA, lifestyle story, and animations.
4. Added `3flavors.png` to `public/images` and used it as the main hero/promotional visual.
5. Tried adding and resizing the logo from `public/image.png`, renamed image assets, then reverted that change when asked to undo.
6. Added backend-ready structure with Supabase support:
   - products API
   - newsletter API
   - orders API
   - Supabase server client
   - fallback product data
   - database schema
7. Chose Supabase over MongoDB/SQL-only setup because ecommerce needs structured product, order, customer, payment, and inventory data.
8. Added Supabase setup steps and clarified:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
9. Added cart and payment page:
   - add to cart
   - quantity controls
   - total calculation
   - payment method selection
   - order creation
10. Added order history, payment history, and track order pages.
11. Added login, signup, account, logout, and forgot password using Supabase Auth.
12. Fixed order privacy so users only see their own order history and can only track their own orders.
13. Added UPI-style white success screen with animated green tick after checkout.
14. Replaced the old “How to use” cards with an MP4 advertisement section using `advertisement1.mp4` from `public/videos`.
15. Fixed product grid so all 3 products show correctly and fixed overlapping add-to-cart button text/icon.
16. Added stock display rules:
   - `Only X left` when stock is 10 or less
   - `Sold out` when stock is 0
   - disabled cart button for sold-out products
17. Added backend stock validation and Supabase function `create_order_with_stock` so stock decreases when orders are placed and orders above stock are blocked.
18. Confirmed rerunning `schema.sql` is safe and does not reset manually updated stock.
19. Discussed enabling RLS and recommended enabling it after running the schema because the app uses server-side secret keys through Next.js APIs.
20. Added `/admin` manager dashboard:
   - revenue metrics
   - order count
   - units sold
   - low-stock alerts
   - best-seller graph
   - product stock/price/description editing
   - active/featured toggles
   - recent orders
   - order status updates
   - payment status updates
21. Added admin protection with:

```env
ADMIN_EMAILS=your-email@example.com
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
```

22. Created this notes file so the full project progress is easy to remember later.
