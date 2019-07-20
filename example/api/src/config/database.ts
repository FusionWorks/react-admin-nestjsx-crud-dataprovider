export default {
  host: 'localhost',
  type: 'mysql',
  port: '3306',
  username: 'root',
  password: 'testing',
  database: 'testing',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: false,
};
