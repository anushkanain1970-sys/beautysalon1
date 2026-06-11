-- 1. Alter services table to support both old format (duration_min, price_cents) and new format (duration, price)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS duration integer;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price numeric;

UPDATE public.services SET duration = duration_min WHERE duration IS NULL;
UPDATE public.services SET price = price_cents / 100.0 WHERE price IS NULL;

ALTER TABLE public.services ALTER COLUMN duration SET NOT NULL;
ALTER TABLE public.services ALTER COLUMN price SET NOT NULL;

-- 2. Rename bookings to appointments (if bookings exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
    ALTER TABLE public.bookings RENAME TO appointments;
    
    -- Rename columns to match requested design
    ALTER TABLE public.appointments RENAME COLUMN name TO customer_name;
    ALTER TABLE public.appointments RENAME COLUMN preferred_date TO appointment_date;
    ALTER TABLE public.appointments RENAME COLUMN preferred_time TO appointment_time;
    ALTER TABLE public.appointments RENAME COLUMN admin_notes TO notes;
    
    -- Update status column
    ALTER TABLE public.appointments ALTER COLUMN status TYPE text;
    UPDATE public.appointments SET status = 'pending' WHERE status = 'new';
    ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));
  END IF;
END $$;

-- 3. Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Services
DROP POLICY IF EXISTS "Anyone reads active services" ON public.services;
DROP POLICY IF EXISTS "Admins read all services" ON public.services;
DROP POLICY IF EXISTS "Admins write services" ON public.services;

CREATE POLICY "Anyone reads active services" ON public.services
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins read all services" ON public.services
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write services" ON public.services
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. RLS Policies for Bookings (restored — appointments rename was reverted)
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
DROP POLICY IF EXISTS "Users read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users update own bookings (cancel)" ON public.bookings;
DROP POLICY IF EXISTS "Admins read all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins update all bookings" ON public.bookings;

CREATE POLICY "Anyone can create a booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (
    (user_id IS NULL) OR (auth.uid() = user_id)
  );
CREATE POLICY "Users read own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR email = auth.email());
CREATE POLICY "Admins manage all bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own appointments" ON public.appointments
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR email = auth.email());
CREATE POLICY "Admins manage all appointments" ON public.appointments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. RLS Policies for Customers
DROP POLICY IF EXISTS "Admins manage all customers" ON public.customers;
DROP POLICY IF EXISTS "Users read own customer profile" ON public.customers;

CREATE POLICY "Admins manage all customers" ON public.customers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users read own customer profile" ON public.customers
  FOR SELECT TO authenticated USING (email = auth.email());

-- 8. Trigger to automatically sync appointments to customers
CREATE OR REPLACE FUNCTION public.sync_appointment_customer()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.customers (name, email, phone)
  VALUES (NEW.customer_name, NEW.email, NEW.phone)
  ON CONFLICT (email) DO UPDATE
  SET name = EXCLUDED.name,
      phone = COALESCE(EXCLUDED.phone, public.customers.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_appointment_created ON public.appointments;
CREATE TRIGGER on_appointment_created
  AFTER INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.sync_appointment_customer();

-- 9. Trigger to sync profiles to customers (on user registration)
CREATE OR REPLACE FUNCTION public.sync_profile_customer()
RETURNS trigger AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.customers (id, name, email, phone)
    VALUES (NEW.id, COALESCE(NEW.full_name, split_part(NEW.email, '@', 1)), NEW.email, NEW.phone)
    ON CONFLICT (email) DO UPDATE
    SET name = COALESCE(EXCLUDED.name, public.customers.name),
        phone = COALESCE(EXCLUDED.phone, public.customers.phone);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_customer();

-- Pre-populate existing profiles to customers
INSERT INTO public.customers (id, name, email, phone)
SELECT id, COALESCE(full_name, split_part(email, '@', 1)), email, phone
FROM public.profiles
WHERE email IS NOT NULL
ON CONFLICT (email) DO NOTHING;
