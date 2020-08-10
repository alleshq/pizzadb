# PizzaDB
A database system for microservices, built around a http api.
![Pizza Logo](https://raw.githubusercontent.com/alleshq/pizzadb/master/logo.png)

## What Pizza is and isn't
Pizza is a database system that one can perform CRUD operations on via a http api. It uses bases, which are a collection of records. Records contain keys and values, which are strings than can be no more than 255 characters. Pizza does not have, and we do not plan on implementing, advanced selection functions, or support for multiple record selection. Records are selected by specifying the base id, then a key and value that should be unique if you use it to select a record. We do not plan on adding support for multiple database users. Instead, every base has a secret key which can be used to create, read, update and remove records. Records do not have a specific structure. It is similar to MongoDB; you simply specify the keys and values in the body, and you can even add more pairs using the update endpoint. Pizza is a very simple database designed for Alles' microservice architecture, where each microservice has its own database, and if other microservices need to access it, they do so through apis. Therefore, features like multiple user support are not necessary.

## Setup
Pizza works with Docker (and docker-compose). Specify the database variables in the docker-compose file and simply run `docker-compose build && docker-compose up -d` to run an instance of it. Pizza uses a MariaDB database, so you'll need to specify the environmental variables `DB_HOST`, `DB_NAME`, `DB_USERNAME` and `DB_PASSWORD`.  Pizza will automatically create two tables - `bases` and `data`. `data` is where the key/value pairs for records will be stored. See the next section for information on how to set up bases.

## Bases and Records
Bases are collections of records. All operations will involve specifying the base id. Bases have a secret key string, and a `public` boolean. When set to true, the secret key will not be necessary to access base data, though this will only work for reading data, not creating/updating/deleting. Records do not have a specific structure. In fact, Pizza is designed to allow you to specify whatever keys you want when you create or update a record. Each key/value pair is a record in the database table, which reference the base they are in and the record id that groups them.

Base metadata is stored in the `bases` table. There are 3 columns: `id`, `secret` and `public`. We recommend that `id` is a uuid, `secret` is a very long random string, and `public` must be a boolean. You must manage the `bases` table yourself, Pizza does not provide an API for this.

## CRUD operations
Now you're all setup, let's see what you can do with Pizza. There are 4 endpoints, one for each letter of CRUD: Create, Read, Update, Delete. All endpoints require that you have the base's secret key set as the `Authorization` header, except for read if the base is set to public. All requests specify the base id in the url, and apart from the create endpoint, they all specify a key and value, in order to select a specific record. Pizza is designed to allow you to reference records using any key. For example, if you are making a bot that connects GitHub and Discord accounts, you could do `discord/409676977247617034` or `github/42045366` to access the same record.

### Create
You can create a record by making a PUT request to `/:base`. All record data must be specified in the body. Keys and values should be strings that are 255 characters or less.

### Read
You can request record data by making a GET request to `/:base/:key/:value`. You can reference a record by any of its keys, as explained above. If the base's `public` boolean is set to true, this endpoint will not require authentication using the base's `secret`.

### Update
You can update record data by making a PATCH request to `/:base/:key/:value`. The keys you wish to update should be specified in the body, which has the same requirements as when creating a record. If a key/value pair already exists for a key, the value will simply be updated. Otherwise, a new key/value pair will be created. The only way to remove a key/value pair is to delete the entire record.

### Delete
You can delete a record by making a DELETE request to `/:base/:key/:value`. No operations can then be performed on that record, and it will be inaccessible, but note that the key/value pairs will remain in the database. Pizza will loop through each key/value pair and mark it as deleted, so it can no longer be used to reference the record.

## Contributing
This project uses [Standard](https://www.npmjs.com/package/standard) for formatting. Pizza fulfills all the requirements for its intended use case, so no new features need to be added, but feel free to fix any bugs you notice, or open an issue.