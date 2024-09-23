---
layout: post
title: Scaling Databases - A Guide to Sharding and Partitioning
excerpt: Learn how to implement sharding and partitioning in PostgreSQL using the Citus extension to improve database performance and scalability.
---

In today’s data-driven world, applications generate and handle enormous volumes of data. When datasets grow to hundreds of millions or even billions of rows, traditional database architectures can struggle to maintain performance and scalability. To efficiently manage and distribute such massive datasets, it’s essential to implement techniques like sharding and partitioning. In this post, we’ll explore these concepts and demonstrate how to implement them using __PostgreSQL__ and the __Citus__ extension.

## Sharding

_Sharding is a concept and distributed table is a concrete implementation of sharding._

__Shard:__ Is a small, independent piece of data that comes from a larger dataset.

__Sharding:__ Is the process of splitting a large dataset into smaller, more manageable pieces (shards), which are then distributed across different servers or nodes in a database cluster.

__Distributed Table:__ Is a logical table in a distributed database system where the data is spread across multiple nodes or servers.

For example, distributed database system (e.g. Citus), allows you to shard (split) large tables based on a column (sharding key) and distribute these shards across multiple nodes in a cluster.

__Why?__ Sharding is used to improve performance and scalability by distributing data across multiple servers. It allows you to scale out your database horizontally by adding more servers to the cluster.


## Partitioning

__Partitioning:__ Is the division of a database table into smaller, more manageable segments or partitions, based on specific criteria such as range, list, or hash, to improve performance and management.

__Why?__ Partitioning is used to improve query performance, reduce index size, and optimize data management by dividing large tables into smaller, more manageable partitions.

## PostgreSQL and Citus

Sharding and distributed table require a database that supports it. In this example PostgreSQL with Citus extension are used.

__Postgres__ is a relational database that supports SQL. __Citus__ is an extension that transforms Postgres into a distributed database. Citus is a horizontally scalable extension for PostgreSQL that distributes data and queries across multiple nodes.

Data is sharded and distributed among the worker nodes based on the sharding key. Each shard is stored on one or more worker nodes, depending on the replication factor. This means that each worker node holds a subset of the data, not a full copy of the entire distributed table.

Sharding the data always depends on the use case and what is the most likely way that data is queried.

In Citus, you can't explicitly define which specific keys go to which shard or worker. Citus distributes data using a hash-based sharding mechanism on the specified sharding key.

* __Hashing the Key:__ When you insert a row, Citus hashes the value of the sharding key.
* __Shard Assignment:__ The hash value determines which shard the data belongs to.
* __Shard Placement:__ The shard is then placed on one of the worker nodes, distributing data evenly across workers based on the hash values.

## Example with Payment Service Provider events

In the example we have a simple payment service provider event data. Events are different types of events in a payment workflow, such as _AUTHORISATION_, _CAPTURE_, _CANCELLATION_, and _REFUND_.

In this example the data is sharded by the event's `psp_name` and partitioned by the event's `event_timestamp`. This means that events from the same payment service provider are stored together, and events are partitioned by year.

Queries can be done over cross-shards, but is slower than querying data from a single shard. If queries are done across many partitions, the performance is slower than querying data from a single unpartitioned table.


#### SQL Example (PostgreSQL + Citus extension)

We’ll use Docker Compose to set up a local Citus cluster with one master and two worker nodes.

docker-compose.yml:
```yml
version: '3.8'
services:
  citus_master:
    image: citusdata/citus:latest
    environment:
      POSTGRES_USER: citus
      POSTGRES_PASSWORD: password
      POSTGRES_DB: events_db
    ports:
      - "5432:5432"
    command: postgres -c shared_preload_libraries=citus

  citus_worker_1:
    image: citusdata/citus:latest
    environment:
      POSTGRES_USER: citus
      POSTGRES_PASSWORD: password
      POSTGRES_DB: events_db
    depends_on:
      - citus_master
    ports:
      - "5433:5432"
    command: postgres -c shared_preload_libraries=citus

  citus_worker_2:
    image: citusdata/citus:latest
    environment:
      POSTGRES_USER: citus
      POSTGRES_PASSWORD: password
      POSTGRES_DB: events_db
    depends_on:
      - citus_master
    ports:
      - "5434:5432"
    command: postgres -c shared_preload_libraries=citus
```

Start the containers with Docker compose 
```sh
docker compose up
```

Connect to the master node with `psql -h localhost -U citus -d events_db` or use an IDE for databases.

Exexute SQL commands:
```sql
SET citus.shard_count = 32;
SET citus.shard_replication_factor = 1;

-- Add worker nodes to the Citus cluster
SELECT master_add_node('citus_worker_1', 5432);
SELECT master_add_node('citus_worker_2', 5432);

-- Create a distributed table with partitioning for payment service provider events
-- PRIMARY KEY: include psp_name sharding column and event_timestamp partitioning column
CREATE TABLE psp_events (
    event_id serial,
    psp_name text,
    user_id int,
    country text,
    transaction_amount decimal,
    currency text,
    event_type text,
    event_timestamp timestamp
    PRIMARY KEY (event_id, event_timestamp)
) PARTITION BY RANGE (event_timestamp);

-- Create partitions for each year
CREATE TABLE psp_events_2023 PARTITION OF psp_events
    FOR VALUES FROM ('2023-01-01') TO ('2023-12-31');

CREATE TABLE psp_events_2024 PARTITION OF psp_events
    FOR VALUES FROM ('2024-01-01') TO ('2024-12-31');

-- Create a default partition for orders that don't fit into the other partitions
CREATE TABLE psp_events_default PARTITION OF psp_events DEFAULT;

-- Distribute the table by the sharding key `psp_name`
SELECT create_distributed_table('psp_events', 'psp_name');
SELECT truncate_local_data_after_distributing_table('psp_events');

-- Insert more data into 2023 partition
INSERT INTO psp_events (psp_name, user_id, country, transaction_amount, currency, event_type, event_timestamp)
VALUES
    ('Adyen', 3, 'USA', 120.00, 'USD', 'AUTHORISATION', '2023-03-15'),
    ('Stripe', 4, 'UK', 180.00, 'GBP', 'CAPTURE', '2023-06-22'),
    ('Square', 5, 'DE', 90.00, 'EUR', 'REFUND', '2023-09-30'),
    ('PayPal', 6, 'FR', 200.00, 'EUR', 'CANCELLATION', '2023-12-10'),
    ('Adyen', 12, 'USA', 85.00, 'USD', 'AUTHORISATION', '2023-07-12'),
    ('Stripe', 13, 'IT', 155.00, 'EUR', 'AUTHORISATION', '2023-08-19'),
    ('Square', 14, 'ES', 75.00, 'EUR', 'CAPTURE', '2023-09-25'),
    ('PayPal', 15, 'NL', 210.00, 'EUR', 'REFUND', '2023-11-02');

-- Insert more data into 2024 partition
INSERT INTO psp_events (psp_name, user_id, country, transaction_amount, currency, event_type, event_timestamp)
VALUES
    ('Adyen', 7, 'USA', 130.00, 'USD', 'AUTHORISATION', '2024-01-05'),
    ('Stripe', 8, 'UK', 160.00, 'GBP', 'CAPTURE', '2024-04-17'),
    ('Square', 9, 'DE', 110.00, 'EUR', 'REFUND', '2024-07-25'),
    ('PayPal', 10, 'FR', 220.00, 'EUR', 'CANCELLATION', '2024-11-03'),
    ('Adyen', 16, 'CA', 145.00, 'CAD', 'AUTHORISATION', '2024-02-14'),
    ('Stripe', 17, 'AU', 175.00, 'AUD', 'CAPTURE', '2024-05-20'),
    ('Square', 18, 'NZ', 95.00, 'NZD', 'REFUND', '2024-08-10'),
    ('PayPal', 19, 'SE', 250.00, 'SEK', 'CANCELLATION', '2024-10-22');

-- Insert more data into default partition
INSERT INTO psp_events (psp_name, user_id, country, transaction_amount, currency, event_type, event_timestamp)
VALUES
    ('PayPal', 11, 'USA', 140.00, 'USD', 'AUTHORISATION', '2025-02-15'),
    ('Adyen', 20, 'UK', 190.00, 'GBP', 'CAPTURE', '2025-03-12'),
    ('Stripe', 21, 'DE', 170.00, 'EUR', 'REFUND', '2025-04-18'),
    ('Square', 22, 'FR', 130.00, 'EUR', 'CANCELLATION', '2025-05-21');
```

### Verify the data distribution

Check how the data is distributed across shards, nodes, and partitions.

__NOTE:__ When data is distributed across multiple shards and partitions, querying individual shards or partitions directly is not necessary to achieve performance benefits. Citus and PostgreSQL automatically route queries to the appropriate shards and partitions and parallelize query execution across worker nodes. This is just an example to show how the data is distributed.

Check the distribution of tables and partitions:
```sql
SELECT * FROM pg_dist_partition;
```

Check on which worker the data is stored:
```sql
SELECT
    pg_dist_shard.shardid,
    nodename,
    nodeport
FROM pg_dist_shard
JOIN pg_dist_placement ON pg_dist_shard.shardid = pg_dist_placement.shardid
JOIN pg_dist_node ON pg_dist_placement.groupid = pg_dist_node.groupid;
``` 

Combined query:
```sql
SELECT
    pg_dist_partition.logicalrelid AS table_name,
    pg_dist_shard.shardid,
    pg_dist_node.nodename AS worker_node,
    pg_dist_node.nodeport AS worker_port
FROM pg_dist_partition
JOIN pg_dist_shard
    ON pg_dist_partition.logicalrelid = pg_dist_shard.logicalrelid
JOIN pg_dist_placement
    ON pg_dist_shard.shardid = pg_dist_placement.shardid
JOIN pg_dist_node
    ON pg_dist_placement.groupid = pg_dist_node.groupid
ORDER BY pg_dist_partition.logicalrelid, pg_dist_shard.shardid;
```

Fetch the shard where the data is stored:
```sql
SELECT get_shard_id_for_distribution_column('psp_events', 'Adyen');
```

Fetch the `worker_node` and `worker_port` for the shard:
```sql
SELECT shardid, nodename, nodeport
FROM pg_dist_shard_placement
WHERE shardid = get_shard_id_for_distribution_column('psp_events', 'Adyen');
```

Query the data. Remember to connect to correct `worker` and use the correct `shard_id`:

Query through docker:
```sh
docker exec -it <container_name_or_id_of_citus_worker> psql -U citus -d events_db -c "SELECT * FROM psp_events_<shard_id>;"
```

Check the container name with `docker ps`.

Query the data through psql:
```sh
PGPASSWORD=password psql -h localhost -p <worker_node_port> -U citus -d events_db -c "SELECT * FROM psp_events_<shard_id>;"
```

## Conclusion

By implementing sharding and partitioning using PostgreSQL and the Citus extension, you can significantly improve your database’s performance and scalability. This approach allows your application to handle larger datasets and higher traffic without compromising on speed.
