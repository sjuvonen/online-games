CREATE TABLE IF NOT EXISTS users (
  id serial NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(60),
  active boolean DEFAULT true,

  PRIMARY KEY (id),
  UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid NOT NULL,
  user_id int NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE,

  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS players (
  user_id int NOT NULL,
  name varchar(50) NOT NULL,
  rating smallint NOT NULL DEFAULT 75,

  PRIMARY KEY (user_id),

  FOREIGN KEY (user_id)
    REFERENCES users (id),

  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS games (
  id serial NOT NULL,
  slug varchar(50) NOT NULL,
  name varchar(50) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active boolean DEFAULT true,

  PRIMARY KEY (id),
  UNIQUE (slug),
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS rooms (
  id serial NOT NULL,
  game_id int NOT NULL,
  owner_id int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at timestamptz,
  active boolean DEFAULT true,

  settings jsonb NOT NULL,

  PRIMARY KEY (id),

  FOREIGN KEY (game_id)
    REFERENCES games (id),

  FOREIGN KEY (owner_id)
    REFERENCES players (user_id)
);

CREATE TABLE IF NOT EXISTS rooms_players (
  room_id int NOT NULL,
  player_id int NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (room_id, player_id),

  FOREIGN KEY (room_id)
    REFERENCES rooms (id),

  FOREIGN KEY (player_id)
    REFERENCES users (id)
);
