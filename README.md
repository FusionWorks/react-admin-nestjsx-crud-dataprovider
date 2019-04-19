# @fusionworks/ra-data-nest-crud

Data provider for react-admin that works with **nestjsx/crud** back-end aplication.
It's implemented on base of [ra-data-simple-rest](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest)

## Install

Using **npm**:
```npm i @fusionworks/ra-data-nest-crud```

Using **yarn**:
```yarn add @fusionworks/ra-data-nest-crud```


## Usage

```jsx
// in app.js file

import React from 'react';
import { Admin, Resource, ShowGuesser } from 'react-admin';
import crudProvider from '@fusionworks/ra-data-nest-crud'
import { UsersList, UserCreate, UserEdit } from './Users'

const dataProvider = crudProvider('http://localhost:3000');
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={UsersList} create={UserCreate} edit={UserEdit} show={ShowGuesser} />
  </Admin>
);
export default App;
```

**Note**: In case of REST verb "CREATE" consider that the response body is the same as the request body but with the object ID injected .
```
case CREATE:
return { data: { ...params.data, id: json.id } };
```
This is because of backwards compatibility compliance.

## Example
You can find an example of a project that uses ```nestjs``` and ```nestjsx/crud``` on backend and ```admin-ui``` with ```@fusionworks/ra-data-nest-crud``` data provider.

If you need to run it, you need to go to api folder, install dependencies,
change by your needs the config file for nestjs that is located in ```example/api/src/config/```, and run aplication.
- ```  cd api ```
- ``` npm i ```
- ```npm run start:dev```

For frontend part you need just to go to admin-ui folder, install dependencies, and run the app:
- ``` cd admin-ui ```
- ``` npm i ```
- ``` npm start ```