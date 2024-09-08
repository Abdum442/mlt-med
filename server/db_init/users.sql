--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mlt
--

COPY public.users (id, fullname, username, password, role, has_pic) FROM stdin;
1	Mebratu Fenta	mebratu	me	admin	f
2	Abdu Mohammed	abdu	ab	user	f
3	Admin	admin	admin	admin	f
9	Abduselam Mo	aselam	as	admin	f
\.


--
-- PostgreSQL database dump complete
--
