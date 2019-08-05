import React from "react";
import {
  Admin,
  Resource,
  ShowGuesser,
  ListGuesser,
  EditGuesser
} from "react-admin";
// import crudProvider from "@fusionworks/ra-data-nest-crud";

import crudProvider from "./providers/nestjs_crud";

import { UsersList, UserCreate, UserEdit } from "./Users";

const dataProvider = crudProvider("http://localhost:3000");
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="users"
      list={UsersList}
      // create={UserCreate}
      edit={UserEdit}
      // edit={UserEdit}
      // show={ShowGuesser}

      // list={ListGuesser}
      // edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="comments"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />

    <Resource
      name="categories"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="groups"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="paymentMethods"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="photos"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="userToGroups"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
  </Admin>
);
export default App;
