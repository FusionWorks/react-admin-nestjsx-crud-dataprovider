import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Create,
  SimpleForm,
  TextInput,
  Edit,
  SingleFieldList,
  ChipField,
  ShowButton,
  ReferenceManyField,
  EditButton,
  Filter,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceArrayField,
  required,
  ReferenceField,
  email
} from "react-admin";
import { DateInput } from "react-admin-date-inputs";
import InputRow from "../Components/InputRow";

const UserFilter = props => (
  <Filter {...props}>
    <TextInput label="Name" source="firstname||starts" alwaysOn />
    <TextInput label="Email" source="email" />
    <InputRow source="_created_range" label="Cretaion date">
      <DateInput
        source="_created_range.created||gte"
        label="From"
        options={{ format: "dd/MM/YYYY" }}
      />
      <DateInput
        source="_created_range.created||lte"
        label="To"
        options={{ format: "dd/MM/YYYY" }}
      />
    </InputRow>
  </Filter>
);
//array is for many to many
//reference field & reference many is for one to many & many to one
//the groups need extra field to show the group related info
export const UsersList = props => (
  <List {...props} filters={<UserFilter />}>
    <Datagrid rowClick="edit">
      <TextField source="firstname" />
      <TextField source="lastname" />
      <EmailField source="email" />
      <ReferenceManyField
        label="Comments "
        reference="comments"
        target="userId"
      >
        <SingleFieldList>
          <ChipField source="text" />
        </SingleFieldList>
      </ReferenceManyField>
      <ReferenceArrayField
        label="Category"
        source="categoryIds"
        reference="categories"
      >
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>

      <ReferenceManyField
        label="Groups "
        reference="userToGroups"
        target="userId"
      >
        <SingleFieldList>
          <ChipField source="groupId" />
        </SingleFieldList>
      </ReferenceManyField>
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
      <TextInput
        source="password"
        type="password"
        validate={validateRequired}
      />
    </SimpleForm>
  </Create>
);

const UserEditTitle = ({ record }) => (
  <span>{`${record.firstname} ${record.lastname}`}</span>
);

export const UserEdit = props => (
  <Edit {...props} title={<UserEditTitle />}>
    <SimpleForm redirect="list">
      <TextInput source="firstname" validate={validateRequired} />
      <TextInput source="lastname" validate={validateRequired} />
      <TextInput source="email" validate={validateEmail} />
      <ReferenceArrayInput source="categoryIds" reference="categories">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);
