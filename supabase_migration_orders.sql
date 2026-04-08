-- =====================================================
-- Shopier Orders Table & RPC Functions
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Orders table to track Shopier payment orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id text NOT NULL,
  credits integer NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'TRY',
  status text NOT NULL DEFAULT 'pending',
  shopier_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Server-side functions can manage all orders
CREATE POLICY "Service can manage orders" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Function: create a pending order
CREATE OR REPLACE FUNCTION public.create_order(
  p_user_id uuid,
  p_package_id text,
  p_credits integer,
  p_amount decimal,
  p_currency text DEFAULT 'TRY'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  INSERT INTO public.orders (user_id, package_id, credits, amount, currency, status)
  VALUES (p_user_id, p_package_id, p_credits, p_amount, p_currency, 'pending')
  RETURNING id INTO v_order_id;
  RETURN v_order_id;
END;
$$;

-- Function: complete order + add credits (idempotent)
CREATE OR REPLACE FUNCTION public.complete_order(
  p_order_id uuid,
  p_shopier_payment_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_credits integer;
  v_status text;
BEGIN
  SELECT user_id, credits, status
  INTO v_user_id, v_credits, v_status
  FROM public.orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  -- Prevent double-completion
  IF v_status = 'completed' THEN
    RETURN true;
  END IF;

  UPDATE public.orders
  SET status = 'completed',
      shopier_payment_id = p_shopier_payment_id,
      updated_at = now()
  WHERE id = p_order_id;

  UPDATE public.profiles
  SET credits = credits + v_credits,
      updated_at = now()
  WHERE id = v_user_id;

  RETURN true;
END;
$$;

-- Function: fail an order
CREATE OR REPLACE FUNCTION public.fail_order(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.orders
  SET status = 'failed', updated_at = now()
  WHERE id = p_order_id AND status = 'pending';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_order(uuid, text, integer, decimal, text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.complete_order(uuid, text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.fail_order(uuid) TO authenticated, anon;
