

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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Insert a new row into the public.users table
  INSERT INTO public.users (id, email, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'role' -- Assumes role is passed in metadata, defaults to patient
  );

  -- If the new user's role is 'patient', insert into the patients table
  IF new.raw_user_meta_data->>'role' = 'patient' THEN
    INSERT INTO public.patients (user_id, full_name, date_of_birth, gender, email)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      (new.raw_user_meta_data->>'date_of_birth')::date,
      new.raw_user_meta_data->>'gender',
      new.email
    );
  END IF;
  
  -- Add similar blocks here for 'doctor' or 'nurse' if they have separate signup flows

  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."appointments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "patient_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "doctor_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "start_time" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "end_time" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "status" "text" NOT NULL,
    "nurse_id" "uuid"
);


ALTER TABLE "public"."appointments" OWNER TO "postgres";


COMMENT ON COLUMN "public"."appointments"."nurse_id" IS 'Foreign key to the assigned nurse, if any.';



CREATE TABLE IF NOT EXISTS "public"."billing_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "invoice_number" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "status" "text" DEFAULT 'Pending'::"text" NOT NULL,
    "due_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."billing_history" OWNER TO "postgres";


COMMENT ON TABLE "public"."billing_history" IS 'Stores billing invoices and payment history for patients.';



CREATE TABLE IF NOT EXISTS "public"."doctors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "speciality" "text"
);


ALTER TABLE "public"."doctors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."health_stats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "blood_pressure_systolic" integer,
    "blood_pressure_diastolic" integer,
    "bmi" numeric(4,1),
    "blood_sugar" integer
);


ALTER TABLE "public"."health_stats" OWNER TO "postgres";


COMMENT ON TABLE "public"."health_stats" IS 'Stores periodic health metrics for patients.';



CREATE TABLE IF NOT EXISTS "public"."medical_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "record_type" "text" NOT NULL,
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "document_url" "text"
);


ALTER TABLE "public"."medical_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nurses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."nurses" OWNER TO "postgres";


COMMENT ON TABLE "public"."nurses" IS 'staff';



CREATE TABLE IF NOT EXISTS "public"."patients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "full_name" "text",
    "date_of_birth" "date",
    "gender" "text",
    "email" "text"
);


ALTER TABLE "public"."patients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reminders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_read" boolean DEFAULT false
);


ALTER TABLE "public"."reminders" OWNER TO "postgres";


COMMENT ON TABLE "public"."reminders" IS 'Stores notifications and reminders for users.';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL,
    "role" "text" NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'public user face';



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."billing_history"
    ADD CONSTRAINT "billing_history_invoice_number_key" UNIQUE ("invoice_number");



ALTER TABLE ONLY "public"."billing_history"
    ADD CONSTRAINT "billing_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."doctors"
    ADD CONSTRAINT "doctors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."doctors"
    ADD CONSTRAINT "doctors_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."health_stats"
    ADD CONSTRAINT "health_stats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medical_records"
    ADD CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nurses"
    ADD CONSTRAINT "nurses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nurses"
    ADD CONSTRAINT "nurses_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_nurse_id_fkey" FOREIGN KEY ("nurse_id") REFERENCES "public"."nurses"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id");



ALTER TABLE ONLY "public"."billing_history"
    ADD CONSTRAINT "billing_history_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."doctors"
    ADD CONSTRAINT "doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."health_stats"
    ADD CONSTRAINT "health_stats_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."medical_records"
    ADD CONSTRAINT "medical_records_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."medical_records"
    ADD CONSTRAINT "medical_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id");



ALTER TABLE ONLY "public"."nurses"
    ADD CONSTRAINT "nurses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage all billing records" ON "public"."billing_history" USING ((( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Medical staff can view patient health stats" ON "public"."health_stats" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."appointments"
  WHERE (("appointments"."patient_id" = "health_stats"."patient_id") AND (("appointments"."doctor_id" = ( SELECT "doctors"."id"
           FROM "public"."doctors"
          WHERE ("doctors"."user_id" = "auth"."uid"()))) OR ("appointments"."nurse_id" = ( SELECT "nurses"."id"
           FROM "public"."nurses"
          WHERE ("nurses"."user_id" = "auth"."uid"()))))))));



CREATE POLICY "Nurses can insert health stats" ON "public"."health_stats" FOR INSERT WITH CHECK ((( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'nurse'::"text"));



CREATE POLICY "Patients can view their own billing history" ON "public"."billing_history" FOR SELECT USING ((( SELECT "patients"."user_id"
   FROM "public"."patients"
  WHERE ("patients"."id" = "billing_history"."patient_id")) = "auth"."uid"()));



CREATE POLICY "Patients can view their own health stats" ON "public"."health_stats" FOR SELECT USING ((( SELECT "patients"."user_id"
   FROM "public"."patients"
  WHERE ("patients"."id" = "health_stats"."patient_id")) = "auth"."uid"()));



CREATE POLICY "Users can view their own reminders" ON "public"."reminders" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "admins can manage doctor records" ON "public"."doctors" USING ((( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "admins can manage nurse records" ON "public"."nurses" USING ((( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "admins can manage user records" ON "public"."users" USING ((( SELECT "users_1"."role"
   FROM "public"."users" "users_1"
  WHERE ("users_1"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "admins can read all patient records" ON "public"."patients" FOR SELECT USING ((( SELECT "users"."role"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "allow select own user record" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."appointments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "authenticated users can view doctors list" ON "public"."doctors" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "authenticated users can view nurses list" ON "public"."nurses" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."billing_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."doctors" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "doctors can manage patient records" ON "public"."medical_records" USING ((( SELECT "doctors"."user_id"
   FROM "public"."doctors"
  WHERE ("doctors"."id" = "medical_records"."author_id")) = "auth"."uid"())) WITH CHECK ((( SELECT "doctors"."user_id"
   FROM "public"."doctors"
  WHERE ("doctors"."id" = "medical_records"."author_id")) = "auth"."uid"()));



CREATE POLICY "doctors can manage their assigned appointment" ON "public"."appointments" USING ((( SELECT "doctors"."user_id"
   FROM "public"."doctors"
  WHERE ("doctors"."id" = "appointments"."doctor_id")) = "auth"."uid"())) WITH CHECK ((( SELECT "doctors"."user_id"
   FROM "public"."doctors"
  WHERE ("doctors"."id" = "appointments"."doctor_id")) = "auth"."uid"()));



CREATE POLICY "doctors can read patient records linked to their appointments" ON "public"."patients" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."appointments"
  WHERE (("appointments"."patient_id" = "appointments"."patient_id") AND ("appointments"."doctor_id" = ( SELECT "appointments"."doctor_id"
           FROM "public"."doctors"
          WHERE ("doctors"."user_id" = "auth"."uid"())))))));



ALTER TABLE "public"."health_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."medical_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nurses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "nurses can insert supportive records" ON "public"."medical_records" FOR INSERT WITH CHECK (((( SELECT "nurses"."user_id"
   FROM "public"."nurses"
  WHERE ("nurses"."id" = "medical_records"."author_id")) = "auth"."uid"()) AND ("record_type" = ANY (ARRAY['Vitals'::"text", 'Nursing Notes'::"text"]))));



ALTER TABLE "public"."patients" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "patients can create and view their own appointments" ON "public"."appointments" USING ((( SELECT "patients"."user_id"
   FROM "public"."patients"
  WHERE ("patients"."id" = "appointments"."patient_id")) = "auth"."uid"())) WITH CHECK ((( SELECT "patients"."user_id"
   FROM "public"."patients"
  WHERE ("patients"."id" = "appointments"."patient_id")) = "auth"."uid"()));



CREATE POLICY "patients can update their own record" ON "public"."patients" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "patients can view and edit their own record" ON "public"."patients" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "patients can view their own medical records" ON "public"."medical_records" FOR SELECT USING ((( SELECT "patients"."user_id"
   FROM "public"."patients"
  WHERE ("patients"."id" = "medical_records"."patient_id")) = "auth"."uid"()));



ALTER TABLE "public"."reminders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."reminders";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."appointments" TO "anon";
GRANT ALL ON TABLE "public"."appointments" TO "authenticated";
GRANT ALL ON TABLE "public"."appointments" TO "service_role";



GRANT ALL ON TABLE "public"."billing_history" TO "anon";
GRANT ALL ON TABLE "public"."billing_history" TO "authenticated";
GRANT ALL ON TABLE "public"."billing_history" TO "service_role";



GRANT ALL ON TABLE "public"."doctors" TO "anon";
GRANT ALL ON TABLE "public"."doctors" TO "authenticated";
GRANT ALL ON TABLE "public"."doctors" TO "service_role";



GRANT ALL ON TABLE "public"."health_stats" TO "anon";
GRANT ALL ON TABLE "public"."health_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."health_stats" TO "service_role";



GRANT ALL ON TABLE "public"."medical_records" TO "anon";
GRANT ALL ON TABLE "public"."medical_records" TO "authenticated";
GRANT ALL ON TABLE "public"."medical_records" TO "service_role";



GRANT ALL ON TABLE "public"."nurses" TO "anon";
GRANT ALL ON TABLE "public"."nurses" TO "authenticated";
GRANT ALL ON TABLE "public"."nurses" TO "service_role";



GRANT ALL ON TABLE "public"."patients" TO "anon";
GRANT ALL ON TABLE "public"."patients" TO "authenticated";
GRANT ALL ON TABLE "public"."patients" TO "service_role";



GRANT ALL ON TABLE "public"."reminders" TO "anon";
GRANT ALL ON TABLE "public"."reminders" TO "authenticated";
GRANT ALL ON TABLE "public"."reminders" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


