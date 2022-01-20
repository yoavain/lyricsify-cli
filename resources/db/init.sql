BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "main"."lyrics"
(
    "artist"   TEXT NOT NULL,
    "title"    TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "lyrics"   TEXT NOT NULL,
    PRIMARY KEY ("artist", "title")
);
COMMIT;
