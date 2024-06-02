import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserMigration implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE USER test_user WITH PASSWORD 'test_pass';
        CREATE DATABASE test_db OWNER test_user;
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        DROP DATABASE test_db;
        DROP USER test_user;
      `);
    }
}