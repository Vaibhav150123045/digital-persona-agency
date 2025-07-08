
-- Drop the existing policies that allow users to modify their limits
DROP POLICY IF EXISTS "Allow authenticated users to insert daily chat limits" ON public.daily_chat_limits;
DROP POLICY IF EXISTS "Allow authenticated users to update their own daily chat limits" ON public.daily_chat_limits;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own daily chat limits" ON public.daily_chat_limits;

-- Keep the SELECT policy so users can view their own limits (for UI display)
-- This policy should already exist from the previous migration

-- Ensure only the service role can insert, update, or delete chat limits
CREATE POLICY "Only service role can insert daily chat limits" 
ON public.daily_chat_limits 
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Only service role can update daily chat limits" 
ON public.daily_chat_limits 
FOR UPDATE 
TO service_role 
USING (true)
WITH CHECK (true);

CREATE POLICY "Only service role can delete daily chat limits" 
ON public.daily_chat_limits 
FOR DELETE 
TO service_role 
USING (true);
