---
layout: post
title: Postgres simple audit trail with trigger
excerpt: How to implement a simple audit trail with postgres trigger.
---

How to implement a simple audit trail with postgres trigger.

Credit to:
- [https://til.yulrizka.com/db/postgres-audit-log-trigger](https://til.yulrizka.com/db/postgres-audit-log-trigger)
- [https://stackoverflow.com/a/36043269](https://stackoverflow.com/a/36043269)


Create the `audit_trail` table.
```sql
CREATE TABLE audit_trail
(
    id           serial NOT NULL,
    time_stamp   timestamp DEFAULT NOW(),
    table_name   text,
    row_pk       int,
    operation    text,
    data         jsonb
);

CREATE INDEX audit_trail_time_stamp_table_name_index
    ON audit_trail (time_stamp DESC, table_name ASC);
```

When data changes, store only changed data. For comparing new and old data, create a `jsonb` diff-function.

```sql
CREATE FUNCTION jsonb_diff_val(val1 JSONB,val2 JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  v RECORD;
BEGIN
   result = val1;
   FOR v IN SELECT * FROM jsonb_each(val2) LOOP
     IF result @> jsonb_build_object(v.key,v.value)
        THEN result = result - v.key;
     ELSIF result ? v.key THEN CONTINUE;
     ELSE
        result = result || jsonb_build_object(v.key,'null');
     END IF;
   END LOOP;
   RETURN result;
END;
$$ LANGUAGE plpgsql;
```

Create function for logging database changes. On `INSERT` insert new data, on `UPDATE` insert changed data, on `DELETE` insert only id. 

```sql
CREATE FUNCTION log_audit_trail() RETURNS trigger AS
$$
BEGIN
    IF TG_OP = 'INSERT'
    THEN
        INSERT INTO audit_trail (table_name, row_pk, operation, data)
        VALUES (TG_RELNAME, NEW.id, TG_OP, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE'
    THEN
        INSERT INTO audit_trail (table_name, row_pk, operation, data)
        VALUES (TG_RELNAME, NEW.id, TG_OP, jsonb_diff_val(to_jsonb(NEW), to_jsonb(OLD)));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE'
    THEN
        INSERT INTO audit_trail (table_name, row_pk, operation, data)
        VALUES (TG_RELNAME, OLD.id, TG_OP, to_jsonb(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;
```

Create trigger for table, e.g. `customer` in this example.

```sql
CREATE TRIGGER customer_audit_trail
    BEFORE INSERT OR UPDATE OR DELETE
    ON "customer"
    FOR EACH ROW
    EXECUTE PROCEDURE log_audit_trail();
```

## Links

- [https://www.postgresql.org/docs/current/plpgsql-trigger.html](https://www.postgresql.org/docs/current/plpgsql-trigger.html)
- [https://www.postgresql.org/docs/current/functions-json.html](https://www.postgresql.org/docs/current/functions-json.html)