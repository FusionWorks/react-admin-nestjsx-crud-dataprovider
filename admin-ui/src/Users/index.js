import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Create,
  SimpleForm,
  TextInput,
  Edit,
  ShowButton,
  EditButton,
  Filter,
  required,
  email,
} from 'react-admin';
import { DateInput } from 'react-admin-date-inputs';
import InputRow from '../Components/InputRow'

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Name" source="firstname||starts" alwaysOn />
    <TextInput label="Email" source="email" />
    <InputRow source="_created_range" label="Cretaion date">
      <DateInput source="_created_range.created||gte" label="From" options={{ format: 'dd/MM/YYYY' }} />
      <DateInput source="_created_range.created||lte" label="To" options={{ format: 'dd/MM/YYYY' }} />
    </InputRow>
  </Filter>
);

export const UsersList = props => (
  <List {...props} filters={<UserFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="firstname" />
      <TextField source="lastname" />
      <EmailField source="email" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

const validateEmail = [required(), email()];
const validateRequired = required();

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm redirect="show">
      <TextInput source="firstname" validate={validateRequired} />
      <TextInput source="lastname" validate={validateRequired} />
      <TextInput source="email" validate={validateEmail} />
      <TextInput source="password" type="password" validate={validateRequired} />
    </SimpleForm>
  </Create>
);

const UserEditTitle = ({ record }) => (<span>{`${record.firstname} ${record.lastname}`}</span>);

export const UserEdit = props => (
  <Edit {...props} title={<UserEditTitle />}>
    <SimpleForm redirect="list">
      <TextInput source="firstname" validate={validateRequired} />
      <TextInput source="lastname" validate={validateRequired} />
      <TextInput source="email" validate={validateEmail} />
      <TextInput source="password" type="password" />
    </SimpleForm>
  </Edit>
);