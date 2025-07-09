--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

-- Started on 2025-06-18 23:23:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3348 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 73729)
-- Name: qr_codes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.qr_codes (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(200),
    data jsonb NOT NULL,
    type character varying(100),
    this_qr2user integer,
    status smallint NOT NULL,
    create_datetime timestamp without time zone NOT NULL,
    lastchange_datetime timestamp without time zone NOT NULL
);


ALTER TABLE public.qr_codes OWNER TO neondb_owner;

--
-- TOC entry 218 (class 1259 OID 73728)
-- Name: qr_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.qr_codes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.qr_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 81921)
-- Name: url_shortener; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.url_shortener (
    id integer NOT NULL,
    long_url character varying NOT NULL,
    short_url character varying,
    status smallint NOT NULL,
    create_datetime timestamp without time zone NOT NULL
);


ALTER TABLE public.url_shortener OWNER TO neondb_owner;

--
-- TOC entry 220 (class 1259 OID 81920)
-- Name: url_shortner_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.url_shortener ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.url_shortner_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 32769)
-- Name: user; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    user_name character varying(100) NOT NULL,
    password character varying(200),
    status smallint NOT NULL,
    auth_provider character varying(200),
    create_datetime timestamp without time zone NOT NULL,
    lastchange_datetime timestamp without time zone NOT NULL,
    lastlogin_datetime timestamp without time zone
);


ALTER TABLE public."user" OWNER TO neondb_owner;

--
-- TOC entry 217 (class 1259 OID 49157)
-- Name: user_details; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_details (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    dob date,
    gender character varying(20),
    status smallint NOT NULL,
    create_datetime timestamp without time zone NOT NULL,
    lastchange_datetime timestamp without time zone NOT NULL,
    this_user_details2user integer
);


ALTER TABLE public.user_details OWNER TO neondb_owner;

--
-- TOC entry 216 (class 1259 OID 49156)
-- Name: user_details_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.user_details ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 32768)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3196 (class 2606 OID 73735)
-- Name: qr_codes qr_codes_pk; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.qr_codes
    ADD CONSTRAINT qr_codes_pk PRIMARY KEY (id);


--
-- TOC entry 3198 (class 2606 OID 81927)
-- Name: url_shortener url_shortner_pk; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.url_shortener
    ADD CONSTRAINT url_shortner_pk PRIMARY KEY (id);


--
-- TOC entry 3194 (class 2606 OID 49161)
-- Name: user_details user_details_pk; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT user_details_pk PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 40961)
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 73736)
-- Name: qr_codes fk_this_qr2user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.qr_codes
    ADD CONSTRAINT fk_this_qr2user FOREIGN KEY (this_qr2user) REFERENCES public."user"(id);


--
-- TOC entry 3199 (class 2606 OID 65536)
-- Name: user_details fk_this_user_details2user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT fk_this_user_details2user FOREIGN KEY (this_user_details2user) REFERENCES public."user"(id);


-- Completed on 2025-06-18 23:23:38

--
-- PostgreSQL database dump complete
--

