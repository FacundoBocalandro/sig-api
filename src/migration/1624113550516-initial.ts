import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1624113550516 implements MigrationInterface {
    name = 'initial1624113550516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "pig_status_enum" AS ENUM('Weaned', 'Pregnant', 'Empty')`);
        await queryRunner.query(`ALTER TABLE "pig" ADD "status" "pig_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pig" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "pig_status_enum"`);
    }

}
