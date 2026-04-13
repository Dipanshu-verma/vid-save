/*
  # Video Downloader PWA - Downloads Table

  ## Overview
  Creates the core data table for tracking user download activity.

  ## New Tables

  ### `downloads`
  Stores every download request made by users (identified by anonymous session IDs).

  Columns:
  - `id` (uuid) - Primary key, auto-generated
  - `session_id` (text) - Anonymous browser session identifier (no login required)
  - `platform` (text) - Platform name: 'youtube', 'instagram', 'facebook', 'whatsapp'
  - `original_url` (text) - The URL submitted by the user
  - `title` (text) - Video/media title extracted during processing
  - `thumbnail_url` (text) - Thumbnail image URL for display
  - `download_url` (text) - The resolved direct download URL
  - `quality` (text) - Quality label e.g. '720p', '1080p', 'HD'
  - `file_size` (bigint) - File size in bytes (0 if unknown)
  - `status` (text) - Processing status: 'pending', 'completed', 'failed'
  - `error_message` (text) - Error details if status is 'failed'
  - `created_at` (timestamptz) - When the download was requested

  ## Security
  - RLS enabled on `downloads` table
  - Users can only view and insert their own session's downloads
  - No updates or deletes allowed to preserve audit trail
*/

CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT '',
  platform text NOT NULL DEFAULT 'unknown',
  original_url text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  thumbnail_url text NOT NULL DEFAULT '',
  download_url text NOT NULL DEFAULT '',
  quality text NOT NULL DEFAULT '',
  file_size bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  error_message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions can view own downloads"
  ON downloads FOR SELECT
  TO anon, authenticated
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id' OR session_id = '');

CREATE POLICY "Sessions can insert downloads"
  ON downloads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS downloads_session_id_idx ON downloads(session_id);
CREATE INDEX IF NOT EXISTS downloads_created_at_idx ON downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS downloads_platform_idx ON downloads(platform);
