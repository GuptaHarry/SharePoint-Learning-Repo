import * as React from 'react';
import type { IReactUserListsProps } from './IReactUserListsProps';

import { IUser } from './IUser';
import { IShowAllUsersState } from './IShowAllUsersState';

import { MSGraphClientV3} from '@microsoft/sp-http';

import {
  TextField,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode
} from '@fluentui/react';

 import * as strings from 'ReactUserListsWebPartStrings';
import { escape } from '@microsoft/sp-lodash-subset';


 const usersListColumns = [
  {
    key : 'displayName',
    name :'Display Name ',
    fieldName : 'displayName',
    minWidth : 50,
    maxWidth : 150,
    isResizable : true 
  },
   
  {
    key : 'givenName',
    name :'Given Name ',
    fieldName : 'givenName',
    minWidth : 50,
    maxWidth : 150,
    isResizable : true 
  }, 
  {
    key : 'surName',
    name :'Sur Name ',
    fieldName : 'surname',
    minWidth : 50,
    maxWidth : 150,
    isResizable : true 
  },
   
  {
    key : 'mail',
    name :'Mail ',
    fieldName : 'mail',
    minWidth : 150,
    maxWidth : 150,
    isResizable : true 
  }, 
  {
    key : 'mobilePhone',
    name :'Mobile Phone ',
    fieldName : 'mobilePhone',
    minWidth : 50,
    maxWidth : 150,
    isResizable : true 
  }, 
  {
    key : 'userPrincipalName',
    name :'User Principal Name  ',
    fieldName : 'userPrincipalName',
    minWidth : 200,
    maxWidth : 200,
    isResizable : true 
  }
 ]

export default function ReactUserLists ( props : IReactUserListsProps ) : JSX.Element {

  const [data , setData ] = React.useState<IShowAllUsersState>( { users : [] , searchFor : "harikrishna"});
 
   function fetchUserDetails ()  : void {
   
       props.context.msGraphClientFactory.getClient("3").then( (client : MSGraphClientV3):void =>{
           client.api('users').version("v1.0").select("*")
           .filter(`startswith(surname , '${escape(data.searchFor)}')`)
           .get( (error : Error , response )=>{

                 if(error){
                  console.error("Message is :" + error);
                  return ;
                 }

                 const allUsers : IUser[] = [];
                 response.value.map( (item : IUser)=>{
                  allUsers.push({
                    displayName : item.displayName,
                    givenName  : item.givenName,
                    surname : item.surname,
                    mail : item.mail,
                    mobilePhone : item.mobilePhone,
                    userPrincipalName : item.userPrincipalName
                  })
                 })

                 setData({users: allUsers , searchFor : data.searchFor})
           }).catch((err : Error)=>{
            console.log(err);
           })
       }).catch( (err : Error)=>{
        console.log(err);
       })  
   }

    function  search () :  void {
     fetchUserDetails();
      
  }

  function onSearchForChanged ( newValue  :string) : void {
     setData({users: data.users , searchFor : newValue});
  } 

  function getSearchForErrorMessage(value : string) : string {
    return  (value===null || value.length=== 0 || value.indexOf(" ")<0)  ? '' : `${strings.SeacrhForValidationErrorMessage}`
  }

  React.useEffect ( ()=>{
  fetchUserDetails();
  }, []);
   return (
    <>
       
       <TextField
        label = {strings.SearchFor}
        required = {true}
        value = {data.searchFor}
        onChange = {(_, newValue) => onSearchForChanged(newValue === undefined ? '' : newValue)}
        onGetErrorMessage={getSearchForErrorMessage}
       />
     
     <p>
       <PrimaryButton
        text='Search'
        title = 'Search Users'
        onClick= {search}
       />
     </p>
     
      {
        data.users !== null && data.users.length > 0  ? 
        <p>
          <DetailsList
           items = {data.users}
           columns = {usersListColumns}
           setKey = 'set'
           checkboxVisibility = {CheckboxVisibility.onHover}
           selectionMode = {SelectionMode.none}
           layoutMode  = {DetailsListLayoutMode.fixedColumns}
           compact = {true}
          />
        </p> : null
      }
     </>
   )
}
