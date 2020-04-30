import mysql from 'mysql';
import {dataBaseConfig} from '../../conf';
import {Pool, MysqlError, PoolConnection} from "mysql";

interface IDataBaseConfig {
    multipleStatements: boolean;
}

type MysqlConnectionConfig = Omit<IDataBaseConfig, 'port'>;

const mysqlConnectionConfig: MysqlConnectionConfig = {...dataBaseConfig, multipleStatements: true};
const pool: Pool = mysql.createPool(mysqlConnectionConfig);

const dbQuery = <T>(sql: string, values?: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection((err: MysqlError, connection: PoolConnection) => {
                err ? reject(err) : connection.query(sql, values, (err: MysqlError, results) => {
                    err ? reject(err) : resolve(results);
                    connection.release();
                });
            })
        } catch (e) {
            reject(e);
        }
    });
};


export default dbQuery;
