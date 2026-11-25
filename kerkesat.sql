
CREATE TABLE IF NOT EXISTS public.kerkesat (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    udhetim_id TEXT NOT NULL,
    udhetar_id TEXT NOT NULL,
    statusi TEXT NOT NULL DEFAULT 'ne_pritje',
    krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_kerkesat_udhetimi
        FOREIGN KEY (udhetim_id)
        REFERENCES public.udhetimet(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_kerkesat_udhetar_udhetim
        UNIQUE (udhetar_id, udhetim_id),

    CONSTRAINT chk_kerkesat_statusi
        CHECK (statusi IN ('ne_pritje', 'pranuar'))
);


CREATE OR REPLACE FUNCTION public.prano_kerkesen(
    p_kerkesa_id BIGINT,
    p_shofer_id TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
DECLARE
    v_udhetim_id TEXT;
    v_statusi TEXT;
BEGIN
    SELECT k.udhetim_id, k.statusi
    INTO v_udhetim_id, v_statusi
    FROM kerkesat k
    JOIN udhetimet u ON u.id = k.udhetim_id
    WHERE k.id = p_kerkesa_id
      AND u.shofer_id = p_shofer_id
    FOR UPDATE OF k;

    IF NOT FOUND THEN
        RETURN 'nuk_lejohet';
    END IF;

    IF v_statusi = 'pranuar' THEN
        RETURN 'tashme_pranuar';
    END IF;

    IF v_statusi IS DISTINCT FROM 'ne_pritje' THEN
        RETURN 'status_i_pavlefshem';
    END IF;

    UPDATE udhetimet
    SET vende = vende - 1
    WHERE id = v_udhetim_id
      AND shofer_id = p_shofer_id
      AND vende > 0;

    IF NOT FOUND THEN
        RETURN 'nuk_ka_vende';
    END IF;

    UPDATE kerkesat
    SET statusi = 'pranuar'
    WHERE id = p_kerkesa_id;

    RETURN 'pranuar';
END;
$function$;
