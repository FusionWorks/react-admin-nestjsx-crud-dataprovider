# @FusionWorks/ra-data-nest-crud

[![GitHub package.json version](https://img.shields.io/github/package-json/v/FusionWorks/react-admin-nestjsx-crud-dataprovider.svg?label=Version)](https://github.com/FusionWorks/react-admin-nestjsx-crud-dataprovider) 
![NPM](https://img.shields.io/npm/l/@fusionworks/ra-data-nest-crud.svg)



```@FusionWorks/ra-data-nest-crud``` is a dataprovider for [react-admin](https://github.com/marmelab/react-admin), that has been designed to make easier communication between a frontend application built with [react-admin](https://github.com/marmelab/react-admin),
and a backend application built with [nestjs](https://github.com/nestjs/nest) framework and [nestjsx/crud](https://github.com/nestjsx/crud).

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

## Working with relations, and selecting spesific fields

*Quick and less flexible: [Set the relations/fields to eager on server CRUD config side](https://github.com/nestjsx/crud/wiki/Controllers#query)*

Due to how nestjsx/crud works, in order to select only spesific fields, or to join relations, we need to add spesific query params.  
but, REACT ADMIN does not provide a way to configure that on his side. (as to date [react-admin#3411](https://github.com/marmelab/react-admin/issues/3411)).  
To solve that, we've added a way to embed these configurations in the resource name in JSON string form.
In case you want want to work with relationship/select spesific fields:
```jsx
import createDataProvider, { encodeParamsInResource } from "@fusionworks/ra-data-nest-crud";
<Admin dataProvider={createDataProvider("/api/...")} >
...
<Resource
  // without setting a label, you will have the JSON inside the generated label
  options={{ label: 'Books' }}
  name={
    encodeParamsInResource("books", 
    // passed to @nestjsx/crud-request to generate the url
    {
      fields: ["id", "name", "year"],
      join: [
        {
          field: "pages",
          select: ["number", "words"]
        },
        {
          field: "author",
          select: ["id", "name"]
        },
        {
          field: "author.favoriteFood",
          select: ["id", "name"]
        }
      ]
    })}
  list={BooksList}
/>
...
</Admin>

```


### Handeling references/Permutations and encodeParamsInResource.
Due to how REACT ADMIN works, each variant of resource, even with same name, but using `encodeParamsInResource`, is seen as a different resource.
Means that if on one of your components you've used reference input/field based on  `encodeParamsInResource` with different parameters than the top level resource,
You will need to add "headless" resource with same configurations. (What is it headless? what? [see the tags resource here](https://marmelab.com/react-admin/Resource.html#the-resource-component)) 

For example:
```jsx
// CategoryEdit or what ever
<ReferenceInput
  label="Template"
  source="template.id"
  reference={encodeParamsInResource('templates', {
    join: [
      {
        field: 'template',
      },
    ],
  })}
>
  <AutocompleteInput optionText="name" >
</ReferenceInput>

<Admin>
// ...
<Resource name={encodeParamsInResource('templates', {
    join: [
      {
        field: 'template',
      },
    ],
  })} />
// ...
</Admin>

```

**Note**: In case of REST verb "CREATE" and "UPDATE" consider that the data provider will make GET_ONE request hehind the scene to fetch fresh copy of all of the record after the update/create.

## Example
You can find an example of a project that uses ```nestjs``` and ```nestjsx/crud``` on backend and ```admin-ui``` with ```@fusionworks/ra-data-nest-crud``` data provider.

If you need to run it, you need to go to api folder, install dependencies,
change by your needs the config file for nestjs that is located in ```example/api/src/config/```, and run application.
- ```  cd api ```
- ``` npm i ```
- ```npm run start:dev```

For frontend part you need just to go to admin-ui folder, install dependencies, and run the app:
- ``` cd admin-ui ```
- ``` npm i ```
- ``` npm start ```
