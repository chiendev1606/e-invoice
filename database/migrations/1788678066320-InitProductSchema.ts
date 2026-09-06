import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitProductSchema1788678066320 implements MigrationInterface {
  name = 'InitProductSchema1788678066320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" text, "sku" character varying(100) NOT NULL, "unit" character varying(50) NOT NULL, "price" double precision NOT NULL DEFAULT '0', "vatRate" double precision NOT NULL DEFAULT '0', CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
