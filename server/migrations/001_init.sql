-- LetsReact_AI schema, version 1.
-- Applied automatically by `npm run migrate` (also runs on container start).

CREATE TABLE users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text        NOT NULL,
  name           text        NOT NULL,
  password_hash  text        NOT NULL,
  role           text        NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'admin')),
  status         text        NOT NULL DEFAULT 'active'  CHECK (status IN ('active', 'disabled')),
  last_login_at  timestamptz,
  last_active_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Emails are compared case-insensitively. The app also stores them lower-cased.
CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email));
CREATE INDEX users_last_active_idx ON users (last_active_at DESC NULLS LAST);
CREATE INDEX users_created_idx ON users (created_at DESC);

-- Server-side sessions. The browser holds a random token; only its SHA-256 hash is
-- stored here, so a leaked database cannot be used to hijack a session, and any
-- session can be revoked instantly by deleting its row.
CREATE TABLE sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash   bytea       NOT NULL UNIQUE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  ip           text,
  user_agent   text
);

CREATE INDEX sessions_user_idx ON sessions (user_id);
CREATE INDEX sessions_expires_idx ON sessions (expires_at);

-- One snapshot of the learner's progress. `version` enables safe multi-device saves.
CREATE TABLE progress (
  user_id    uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  data       jsonb       NOT NULL,
  version    integer     NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Append-only activity feed. This is what the admin portal reads per learner.
CREATE TABLE activity_events (
  id         bigserial PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type       text        NOT NULL,
  ref_id     text,
  detail     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX activity_user_idx ON activity_events (user_id, id DESC);
CREATE INDEX activity_type_time_idx ON activity_events (type, created_at DESC);
CREATE INDEX activity_time_idx ON activity_events (created_at DESC);

-- Security and administration trail. Rows outlive the users they refer to,
-- so there is deliberately no foreign key on target_user_id.
CREATE TABLE audit_log (
  id             bigserial PRIMARY KEY,
  actor_id       uuid REFERENCES users (id) ON DELETE SET NULL,
  actor_email    text,
  action         text        NOT NULL,
  target_user_id uuid,
  detail         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  ip             text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_time_idx ON audit_log (created_at DESC);
CREATE INDEX audit_target_idx ON audit_log (target_user_id);

-- Fixed-window counters used to throttle logins, sign-ups and writes.
CREATE TABLE rate_limits (
  key          text PRIMARY KEY,
  count        integer     NOT NULL,
  window_start timestamptz NOT NULL
);
