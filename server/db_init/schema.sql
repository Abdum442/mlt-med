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
-- Name: bank_details; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.bank_details (
    id integer NOT NULL,
    account_holder character varying(100),
    bank_name character varying(100),
    account_number integer,
    remarks character varying(100)
);


ALTER TABLE public.bank_details OWNER TO mlt;

--
-- Name: bank_details_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.bank_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bank_details_id_seq OWNER TO mlt;

--
-- Name: bank_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.bank_details_id_seq OWNED BY public.bank_details.id;


--
-- Name: cat_expenses; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.cat_expenses (
    id integer NOT NULL,
    date date NOT NULL,
    description text NOT NULL,
    amount numeric(10,2) NOT NULL,
    expense_category_id integer
);


ALTER TABLE public.cat_expenses OWNER TO mlt;

--
-- Name: cat_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.cat_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_expenses_id_seq OWNER TO mlt;

--
-- Name: cat_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.cat_expenses_id_seq OWNED BY public.cat_expenses.id;


--
-- Name: company_debit; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.company_debit (
    id integer NOT NULL,
    amount numeric(10,2),
    purpose character varying(100),
    interest_rate numeric(5,2),
    payment_terms character varying(100),
    remarks character varying(100)
);


ALTER TABLE public.company_debit OWNER TO mlt;

--
-- Name: company_debit_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.company_debit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_debit_id_seq OWNER TO mlt;

--
-- Name: company_debit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.company_debit_id_seq OWNED BY public.company_debit.id;


--
-- Name: company_loans; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.company_loans (
    id integer NOT NULL,
    amount numeric(10,2),
    interest_rate numeric(5,2),
    duration_days integer,
    start_date date,
    end_date date,
    purpose character varying(100),
    remarks character varying(100)
);


ALTER TABLE public.company_loans OWNER TO mlt;

--
-- Name: company_loans_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.company_loans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_loans_id_seq OWNER TO mlt;

--
-- Name: company_loans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.company_loans_id_seq OWNED BY public.company_loans.id;


--
-- Name: company_stock; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.company_stock (
    product_id integer,
    quantity integer,
    purchase_id integer,
    supplier_id integer,
    remarks character varying(255)
);


ALTER TABLE public.company_stock OWNER TO mlt;

--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.expense_categories (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.expense_categories OWNER TO mlt;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expense_categories_id_seq OWNER TO mlt;

--
-- Name: expense_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.expense_categories_id_seq OWNED BY public.expense_categories.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    description character varying(255),
    amount numeric(10,2),
    expense_date date,
    payment_method character varying(100),
    remarks character varying(255)
);


ALTER TABLE public.expenses OWNER TO mlt;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO mlt;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: payables; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.payables (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text NOT NULL,
    due_date date,
    status character varying(20),
    amount_left numeric(10,2) NOT NULL,
    CONSTRAINT payables_new_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying])::text[])))
);


ALTER TABLE public.payables OWNER TO mlt;

--
-- Name: payables_new_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.payables_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payables_new_id_seq OWNER TO mlt;

--
-- Name: payables_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.payables_new_id_seq OWNED BY public.payables.id;


--
-- Name: payments_made; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.payments_made (
    id integer NOT NULL,
    payable_id integer,
    amount numeric(10,2) NOT NULL,
    payment_date date NOT NULL
);


ALTER TABLE public.payments_made OWNER TO mlt;

--
-- Name: payments_made_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.payments_made_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_made_id_seq OWNER TO mlt;

--
-- Name: payments_made_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.payments_made_id_seq OWNED BY public.payments_made.id;


--
-- Name: payments_received; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.payments_received (
    id integer NOT NULL,
    receivable_id integer,
    amount numeric(10,2) NOT NULL,
    payment_date date NOT NULL
);


ALTER TABLE public.payments_received OWNER TO mlt;

--
-- Name: payments_received_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.payments_received_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_received_id_seq OWNER TO mlt;

--
-- Name: payments_received_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.payments_received_id_seq OWNED BY public.payments_received.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.permissions OWNER TO mlt;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO mlt;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100),
    description character varying(255),
    purchase_price numeric(10,2),
    saling_price numeric(10,2),
    expiry_date date,
    supplier_id integer,
    remarks character varying(100)
);


ALTER TABLE public.products OWNER TO mlt;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO mlt;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: purchase; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.purchase (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    purchase_date date,
    payment_method character varying(100),
    amount_paid numeric(10,2),
    tax_withheld numeric(10,2),
    remarks character varying(100),
    supplier_id integer,
    unit_price numeric(10,2)
);


ALTER TABLE public.purchase OWNER TO mlt;

--
-- Name: purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_id_seq OWNER TO mlt;

--
-- Name: purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.purchase_id_seq OWNED BY public.purchase.id;


--
-- Name: receivables; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.receivables (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text NOT NULL,
    due_date date,
    status character varying(20),
    amount_left numeric(10,2) NOT NULL,
    CONSTRAINT receivables_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'received'::character varying])::text[])))
);


ALTER TABLE public.receivables OWNER TO mlt;

--
-- Name: receivables_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.receivables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receivables_id_seq OWNER TO mlt;

--
-- Name: receivables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.receivables_id_seq OWNED BY public.receivables.id;


--
-- Name: retailers; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.retailers (
    id integer NOT NULL,
    name character varying(100),
    contact character varying(100),
    address character varying(100),
    payment_method character varying(255),
    remarks character varying(100),
    tinnumber character varying(100),
    licencenumber character varying(100)
);


ALTER TABLE public.retailers OWNER TO mlt;

--
-- Name: retailers_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.retailers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.retailers_id_seq OWNER TO mlt;

--
-- Name: retailers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.retailers_id_seq OWNED BY public.retailers.id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.sales (
    id integer NOT NULL,
    product_id integer,
    retailer_id integer,
    quantity_sold integer,
    sale_date date,
    payment_method character varying(100),
    amount_received numeric DEFAULT 0,
    remarks character varying(100),
    tax_withheld numeric(10,2) DEFAULT 0,
    order_id integer,
    checkout_status character varying(20)
);


ALTER TABLE public.sales OWNER TO mlt;

--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_id_seq OWNER TO mlt;

--
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;


--
-- Name: sales_order; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.sales_order (
    id integer NOT NULL,
    customer_id integer,
    order_date date,
    total_amount numeric(10,2),
    amount_paid numeric(10,2),
    amount_remaining numeric(10,2),
    tax_withheld numeric(10,2),
    checkout_status character varying(20)
);


ALTER TABLE public.sales_order OWNER TO mlt;

--
-- Name: sales_order_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.sales_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_order_id_seq OWNER TO mlt;

--
-- Name: sales_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.sales_order_id_seq OWNED BY public.sales_order.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name character varying(255),
    contactinfo character varying(255),
    address character varying(255),
    taxinfo character varying(255),
    paymentterms character varying(255),
    remark character varying(255),
    licencenumber character varying(100)
);


ALTER TABLE public.suppliers OWNER TO mlt;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO mlt;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.user_permissions (
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.user_permissions OWNER TO mlt;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.users (
    id integer NOT NULL,
    fullname character varying(30),
    username character varying(30),
    password character varying(30),
    role character varying(30),
    has_pic boolean
);


ALTER TABLE public.users OWNER TO mlt;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO mlt;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: voided_products; Type: TABLE; Schema: public; Owner: mlt
--

CREATE TABLE public.voided_products (
    id integer NOT NULL,
    product_id integer,
    void_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    void_reason text,
    void_quantity integer
);


ALTER TABLE public.voided_products OWNER TO mlt;

--
-- Name: voided_products_id_seq; Type: SEQUENCE; Schema: public; Owner: mlt
--

CREATE SEQUENCE public.voided_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.voided_products_id_seq OWNER TO mlt;

--
-- Name: voided_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mlt
--

ALTER SEQUENCE public.voided_products_id_seq OWNED BY public.voided_products.id;


--
-- Name: bank_details id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.bank_details ALTER COLUMN id SET DEFAULT nextval('public.bank_details_id_seq'::regclass);


--
-- Name: cat_expenses id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.cat_expenses ALTER COLUMN id SET DEFAULT nextval('public.cat_expenses_id_seq'::regclass);


--
-- Name: company_debit id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.company_debit ALTER COLUMN id SET DEFAULT nextval('public.company_debit_id_seq'::regclass);


--
-- Name: company_loans id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.company_loans ALTER COLUMN id SET DEFAULT nextval('public.company_loans_id_seq'::regclass);


--
-- Name: expense_categories id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.expense_categories ALTER COLUMN id SET DEFAULT nextval('public.expense_categories_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: payables id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payables ALTER COLUMN id SET DEFAULT nextval('public.payables_new_id_seq'::regclass);


--
-- Name: payments_made id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payments_made ALTER COLUMN id SET DEFAULT nextval('public.payments_made_id_seq'::regclass);


--
-- Name: payments_received id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payments_received ALTER COLUMN id SET DEFAULT nextval('public.payments_received_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: purchase id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.purchase ALTER COLUMN id SET DEFAULT nextval('public.purchase_id_seq'::regclass);


--
-- Name: receivables id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.receivables ALTER COLUMN id SET DEFAULT nextval('public.receivables_id_seq'::regclass);


--
-- Name: retailers id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.retailers ALTER COLUMN id SET DEFAULT nextval('public.retailers_id_seq'::regclass);


--
-- Name: sales id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);


--
-- Name: sales_order id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales_order ALTER COLUMN id SET DEFAULT nextval('public.sales_order_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: voided_products id; Type: DEFAULT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.voided_products ALTER COLUMN id SET DEFAULT nextval('public.voided_products_id_seq'::regclass);


--
-- Name: bank_details bank_details_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.bank_details
    ADD CONSTRAINT bank_details_pkey PRIMARY KEY (id);


--
-- Name: cat_expenses cat_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.cat_expenses
    ADD CONSTRAINT cat_expenses_pkey PRIMARY KEY (id);


--
-- Name: company_debit company_debit_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.company_debit
    ADD CONSTRAINT company_debit_pkey PRIMARY KEY (id);


--
-- Name: company_loans company_loans_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.company_loans
    ADD CONSTRAINT company_loans_pkey PRIMARY KEY (id);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: payables payables_new_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payables
    ADD CONSTRAINT payables_new_pkey PRIMARY KEY (id);


--
-- Name: payments_made payments_made_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payments_made
    ADD CONSTRAINT payments_made_pkey PRIMARY KEY (id);


--
-- Name: payments_received payments_received_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payments_received
    ADD CONSTRAINT payments_received_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: purchase purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT purchase_pkey PRIMARY KEY (id);


--
-- Name: receivables receivables_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.receivables
    ADD CONSTRAINT receivables_pkey PRIMARY KEY (id);


--
-- Name: retailers retailers_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.retailers
    ADD CONSTRAINT retailers_pkey PRIMARY KEY (id);


--
-- Name: sales_order sales_order_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales_order
    ADD CONSTRAINT sales_order_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (user_id, permission_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: voided_products voided_products_pkey; Type: CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.voided_products
    ADD CONSTRAINT voided_products_pkey PRIMARY KEY (id);


--
-- Name: cat_expenses cat_expenses_expense_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.cat_expenses
    ADD CONSTRAINT cat_expenses_expense_category_id_fkey FOREIGN KEY (expense_category_id) REFERENCES public.expense_categories(id);


--
-- Name: company_stock company_stock_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.company_stock
    ADD CONSTRAINT company_stock_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE;


--
-- Name: company_stock company_stock_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.company_stock
    ADD CONSTRAINT company_stock_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchase(id);


--
-- Name: company_stock company_stock_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.company_stock
    ADD CONSTRAINT company_stock_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: payments_made payments_made_payable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payments_made
    ADD CONSTRAINT payments_made_payable_id_fkey FOREIGN KEY (payable_id) REFERENCES public.payables(id) ON DELETE CASCADE;


--
-- Name: payments_received payments_received_receivable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.payments_received
    ADD CONSTRAINT payments_received_receivable_id_fkey FOREIGN KEY (receivable_id) REFERENCES public.receivables(id) ON DELETE CASCADE;


--
-- Name: products products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE;


--
-- Name: purchase purchase_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT purchase_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE;


--
-- Name: purchase purchase_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.purchase
    ADD CONSTRAINT purchase_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE;


--
-- Name: sales_order sales_order_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales_order
    ADD CONSTRAINT sales_order_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.retailers(id) ON UPDATE CASCADE;


--
-- Name: sales sales_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.sales_order(id) ON UPDATE CASCADE;


--
-- Name: sales sales_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE;


--
-- Name: sales sales_retailer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_retailer_id_fkey FOREIGN KEY (retailer_id) REFERENCES public.retailers(id) ON UPDATE CASCADE;


--
-- Name: user_permissions user_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: voided_products voided_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mlt
--

ALTER TABLE ONLY public.voided_products
    ADD CONSTRAINT voided_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- PostgreSQL database dump complete
--

