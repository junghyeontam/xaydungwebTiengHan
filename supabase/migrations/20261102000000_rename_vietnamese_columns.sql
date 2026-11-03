-- ==============================================================================
-- Migration: Rename Vietnamese columns and normalize values to English
-- Safe migration: preserves all existing data without data loss
-- ==============================================================================

-- 1. Rename columns in public.cards
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'cards' AND column_name = 'vietnamese'
  ) THEN
    ALTER TABLE public.cards RENAME COLUMN vietnamese TO meaning;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'cards' AND column_name = 'example_vietnamese'
  ) THEN
    ALTER TABLE public.cards RENAME COLUMN example_vietnamese TO example_meaning;
  END IF;
END $$;

-- 2. Rename columns in public.vocab
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'vocab' AND column_name = 'vietnamese'
  ) THEN
    ALTER TABLE public.vocab RENAME COLUMN vietnamese TO meaning;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'vocab' AND column_name = 'example_vietnamese'
  ) THEN
    ALTER TABLE public.vocab RENAME COLUMN example_vietnamese TO example_meaning;
  END IF;
END $$;

-- 3. Update defaults and existing data for public.leads
ALTER TABLE public.leads ALTER COLUMN status SET DEFAULT 'new';

UPDATE public.leads SET status = 'new' WHERE status = 'moi';
UPDATE public.leads SET status = 'contacted' WHERE status = 'da_goi';
UPDATE public.leads SET status = 'enrolled' WHERE status = 'chot';
UPDATE public.leads SET status = 'cancelled' WHERE status = 'huy';

UPDATE public.leads SET goal = 'study_abroad' WHERE goal = 'du-hoc';
UPDATE public.leads SET goal = 'employment' WHERE goal = 'xkld';
UPDATE public.leads SET goal = 'kpop_culture' WHERE goal = 'kpop';
UPDATE public.leads SET goal = 'travel' WHERE goal = 'du-lich';

UPDATE public.leads SET current_level = 'zero' WHERE current_level = 'so-0';

-- 4. Update defaults and existing data for public.profiles
ALTER TABLE public.profiles ALTER COLUMN goal SET DEFAULT 'study_abroad';
ALTER TABLE public.profiles ALTER COLUMN current_level SET DEFAULT 'zero';

UPDATE public.profiles SET goal = 'study_abroad' WHERE goal = 'du-hoc';
UPDATE public.profiles SET goal = 'employment' WHERE goal = 'xkld';
UPDATE public.profiles SET goal = 'kpop_culture' WHERE goal = 'kpop';
UPDATE public.profiles SET goal = 'travel' WHERE goal = 'du-lich';

UPDATE public.profiles SET current_level = 'zero' WHERE current_level = 'so-0';
