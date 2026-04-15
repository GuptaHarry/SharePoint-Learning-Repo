import * as React from 'react';
import type { IProviderWebpartProps } from './IProviderWebpartProps';
import { IDepartmentState } from './IDepartmentState';
import { IDepartment } from './IDepartment';
import { Selection } from '@fluentui/react';

import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode,
  DetailsRowCheck
} 
 from '@fluentui/react';
 
 import {ISPHttpClientOptions , SPHttpClient , SPHttpClientResponse }
  from '@microsoft/sp-http';

export default function ProviderWebpart(props : IProviderWebpartProps) : JSX.Element{

   
   const departmentListColumns = [
    {
      key : 'ID',
      name : 'ID',
      fieldName : 'ID',
      minWidth : 50,
      maxWidth : 100,
      isResizable : true
    }
    ,{
      key : 'Title',
      name : 'Title',
      fieldName : 'Title',
      minWidth : 50,
      maxWidth : 100,
      isResizable : true
    }
   ]

   
   const [ data , setData] = React.useState<IDepartmentState>({
    status : 'Ready',
    DepartmentListItems : [],
    DepartmentListItem  : {
      Id : 0,
      Title  : ""
    }
   });

   const selectionRef = React.useRef<Selection | null>(null);

   if(!selectionRef.current){
    selectionRef.current = new Selection({
      onSelectionChanged : ()=>{
        const selected = selectionRef.current?.getSelection()[0] as IDepartment;

        if(selected){
          setData({
            ...data,
            DepartmentListItem : selected
          });

          props.onDepartmentSelected?.(selected);
        }
      }
    })
   }

  function getListItems () : Promise<IDepartment[]>{

    const url : string = props.siteUrl + "/_api/web/lists/getbytitle('Departments')/items";
    return props.context.spHttpClient.get(url , SPHttpClient.configurations.v1)
    .then( response =>{
      return response.json();
    })
    .then( json => {
      return json.value;
    }) as Promise<IDepartment[]>;
  }

   React.useEffect( ()=>{
       
    getListItems().then( (listItems : IDepartment[])=>{
           
        setData({
          ...data,
          status : "All records have been loaded successfully",
         DepartmentListItems : listItems
        })   
       }).catch( (err :Error)=>{
        console.log(err);
       })
   } , [] );

  return (
    <>
    
           <DetailsList
            items = {data.DepartmentListItems}
            columns = {departmentListColumns}
            setKey='Id'
            checkboxVisibility={ CheckboxVisibility.always}
            selectionMode={SelectionMode.single}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            compact={true}
            selection={selectionRef.current}
           />

    </>
  )
}
