CREATE TABLE IF NOT EXISTS preferimet (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id TEXT NOT NULL,
    udhetim_id TEXT NOT NULL,

    CONSTRAINT uq_preferimet_user_udhetim
        UNIQUE (user_id, udhetim_id),

    CONSTRAINT fk_preferimet_udhetimi
        FOREIGN KEY (udhetim_id)
        REFERENCES udhetimet(id)
        ON DELETE CASCADE
);