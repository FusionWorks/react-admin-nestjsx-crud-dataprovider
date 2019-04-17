import React from 'react';
import { Admin, Resource, ShowGuesser } from 'react-admin';
import crudProvider from './providers/nestjs_crud'
import { UsersList, UserCreate, UserEdit } from './Users'

const dataProvider = crudProvider('http://localhost:3000');
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={UsersList} create={UserCreate} edit={UserEdit} show={ShowGuesser} />
  </Admin>
);
export default App;
