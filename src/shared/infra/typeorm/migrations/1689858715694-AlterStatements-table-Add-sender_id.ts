import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatementsTableAddSenderId1689858715694 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "statements",
            new TableColumn({
                name: "sender_id",
                type: "uuid",
            }, 
            )
        );
        await queryRunner.createForeignKey(
            "statements",
            new TableForeignKey({
                name:"FKStatementsSenderId",
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                columnNames: ["sender_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",

            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("statements","FKStatementsSenderId" );
        await queryRunner.dropColumn("statements", "sender_id");
    }

}
