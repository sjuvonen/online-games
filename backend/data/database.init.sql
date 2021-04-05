INSERT INTO users (id, username)
VALUES
  (1000001, 'samu'),
  (1000002, 'botti_1'),
  (1000003, 'botti_2'),
  (1000004, 'botti_3'),
  (1000005, 'botti_4'),
  (1000006, 'botti_5'),
  (1000007, 'botti_6'),
  (1000008, 'botti_7'),
  (1000009, 'botti_8'),
  (1000010, 'botti_9')
ON CONFLICT DO NOTHING
;

INSERT INTO players (user_id, name, rating)
VALUES
  (1000001, 'Samu J', 95),
  (1000002, 'John Deere', 95),
  (1000003, 'Neo', 75),
  (1000004, 'Cybernaut', 34),
  (1000005, 'Kyborg', 90),
  (1000006, 'Zidane', 72),
  (1000007, 'Pistachio', 53),
  (1000008, 'Rudolph', 99),
  (1000009, 'Mistie', 16),
  (1000010, 'Qobher', 49)
ON CONFLICT DO NOTHING
;

INSERT INTO games (id, slug, name)
VALUES
  (1001, 'six-nimmt', 'Six Nimmt!'),
  (1002, 'solo', 'Solo'),
  (1003, 'yahtzee', 'Yahtzee'),
  (1004, 'jaipur', 'Jaipur')
ON CONFLICT DO NOTHING
;

INSERT INTO rooms (id, game_id, owner_id, created_at, settings)
VALUES
  (4000787, 1001, 1000002, current_timestamp - interval '10 minutes', '{
    "minPlayers": 4,
    "maxPlayers": 6
  }'),
  (4000788, 1001, 1000003, current_timestamp - interval '7 minutes', '{
    "minPlayers": 3,
    "maxPlayers": 8
  }'),
  (4000789, 1003, 1000007, current_timestamp - interval '6 minutes', '{
    "minPlayers": 2,
    "maxPlayers": 4
  }'),
  (4000790, 1001, 1000004, current_timestamp - interval '2 minutes', '{
    "minPlayers": 4,
    "maxPlayers": 7
  }')
ON CONFLICT DO NOTHING
;

INSERT INTO rooms_players (room_id, player_id, joined_at)
VALUES
  (4000787, 1000002, current_timestamp - interval '10 minutes'),
  (4000788, 1000003, current_timestamp - interval '7 minutes'),
  (4000789, 1000007, current_timestamp - interval '2 minutes'),
  (4000790, 1000004, current_timestamp - interval '6 minutes'),
  (4000787, 1000009, current_timestamp - interval '8 minutes'),
  (4000787, 1000010, current_timestamp - interval '7 minutes'),
  (4000789, 1000006, current_timestamp - interval '6 minutes')
ON CONFLICT DO NOTHING
;
