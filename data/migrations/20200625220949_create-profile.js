exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('profiles', function (table) {
      table.string('id').notNullable().unique().primary();
      table.string('email').notNullable().unique();
      table.string('name');
      table.string('avatarUrl');
      table.boolean('is_admin').notNullable().defaultTo(0);
      table.timestamps(true, true);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('profiles');
};
