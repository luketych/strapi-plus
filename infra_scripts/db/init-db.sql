DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'strapi') THEN
      CREATE ROLE strapi LOGIN PASSWORD 'strapi';
   END IF;
END
$do$;