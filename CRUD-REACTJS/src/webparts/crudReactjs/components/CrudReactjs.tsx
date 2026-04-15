import * as React from 'react';
import type { ICrudReactjsProps } from './ICrudReactjsProps';
import type { ICrudReactState } from './ICrudReactState';
import { SPHttpClient , SPHttpClientResponse , ISPHttpClientOptions} 
from '@microsoft/sp-http';


import {
  TextField,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  SelectionMode,
  Dropdown,
  IDropdown,
  Selection
} from '@fluentui/react';
import { ISoftwareListItem } from './ISoftwareListItem';


 
const softwareListColumns = [
  {
    key : 'ID',
    name  : 'ID',
    fieldName  :'ID',
    minWidth : 50,
    maxWidth  : 100,
    isResizable  :true 
  },
  {
    key : 'Title',
    name  : 'Title',
    fieldName  :'Title',
    minWidth : 50,
    maxWidth  : 100,
    isResizable  :true 
  },

  {
    key : 'SoftwareName',
    name  : 'SoftwareName',
    fieldName  :'SoftwareName',
    minWidth : 50,
    maxWidth  : 100,
    isResizable  :true 
  },
  {
    key : 'SoftwareVendor',
    name  : 'SoftwareVendor',
    fieldName  :'SoftwareVendor',
    minWidth : 50,
    maxWidth  : 100,
    isResizable  :true 
  },
  {
    key : 'SoftwareVersion',
    name  : 'SoftwareVersion',
    fieldName  :'SoftwareVersion',
    minWidth : 50,
    maxWidth  : 100,
    isResizable  :true 
  },
  {
    key : 'SoftwareDescription',
    name  : 'SoftwareDescription',
    fieldName  :'SoftwareDescription',
    minWidth : 50,
    maxWidth  : 100,
    isResizable  :true 
  },
  
]
export default function CrudReactjs ( props : ICrudReactjsProps) : JSX.Element {

  
  const initialState : ICrudReactState = {
  status : "",
  SoftwareListItems : [],
  SoftwareListItem : {
    Id : 0,
    Title : "",
    SoftwareName : "",
    SoftwareDescription :"",
    SoftwareVendor : "",
    SoftwareVersion:""
  }
  }
  const [data, setData ]= React.useState<ICrudReactState>( initialState);
  const dropdownRef  = React.createRef<IDropdown>();

  const selectionRef = React.useRef<Selection>();
  if(!selectionRef.current){
    selectionRef.current = new Selection({
      onSelectionChanged : ()=>{
        const selected = selectionRef.current?.getSelection()[0] as ISoftwareListItem;

        if(selected){
          setData({
            ...data ,
            SoftwareListItem : selected
          })
        }
      }
    })
  }


 function getSoftwareListItems () : Promise<ISoftwareListItem[]>{

   const url : string = props.siteUrl+"/_api/web/lists/getbytitle('SoftwareCatalog')/items";
   return props.context.spHttpClient.get(url , SPHttpClient.configurations.v1)
   .then( (response : SPHttpClientResponse) => {
     return response.json(); 
  }).then( (responseJSON )=>{
    return responseJSON.value as ISoftwareListItem[];
  }).catch((err : Error)=>{
    console.log(err);
    return [];
  })
 }
 
 function bindDetails ( message : string) : void {
   getSoftwareListItems().then( (listItems : ISoftwareListItem[] )=>{
     setData({
      ...data,
      status : message,
      SoftwareListItems: listItems
     })
     }).catch((err : Error)=>{
      console.log(err);
     })
 }  

 function  btnAdd_Click () : void {
  const url : string = props.siteUrl+ "/_api/web/lists/getbytitle('SoftwareCatalog')/items";
  
  const spHttpClientOptions : ISPHttpClientOptions = {
    "body" : JSON.stringify(data.SoftwareListItem)
  }

  // function call
  props.context.spHttpClient.post(url,SPHttpClient.configurations.v1 , spHttpClientOptions)
  .then( (response : SPHttpClientResponse)=>{

      if(response.ok){
        bindDetails("Item has been added successfully");
      }
      else{
        const errorMessage : string = "An Error has occured " + response.status+"- " + response.statusText;
        setData({
          ...data,
          status : errorMessage
        })
      }
  }).catch( (err:Error)=>{
    console.log(err);
  })
 }

function btnUpdate_Click () : void {

   const id : number = data.SoftwareListItem.Id;
   const url : string = props.siteUrl+ "/_api/web/lists/getbytitle('SoftwareCatalog')/items("+ id + ")";
  
   const headers : Headers = new Headers({
    "X-HTTP-Method" : "MERGE",
    "IF-MATCH" : "*",
   });

  const spHttpClientOptions : ISPHttpClientOptions = {
    "headers" : headers,
    "body" : JSON.stringify(data.SoftwareListItem)
  }

  // function call
  props.context.spHttpClient.post(url,SPHttpClient.configurations.v1 , spHttpClientOptions)
  .then( (response : SPHttpClientResponse)=>{

      if(response.ok){
        bindDetails("Item has been Updated successfully");
      }
      else{
        const errorMessage : string = "An Error has occured " + response.status+"- " + response.statusText;
        setData({
          ...data,
          status : errorMessage
        })
      }
  }).catch( (err:Error)=>{
    console.log(err);
  })
}

 function btnDelete_Click () : void {
   
   const id : number = data.SoftwareListItem.Id;
   const url : string = props.siteUrl+ "/_api/web/lists/getbytitle('SoftwareCatalog')/items(" + id+")";
   const headers : Headers = new Headers ({
    "X-HTTP-Method" : "DELETE",
    "IF-MATCH" : "*"
   })

   const spHttpClientOptions : ISPHttpClientOptions = {
    "headers" : headers
   }

   

   props.context.spHttpClient.post( url,SPHttpClient.configurations.v1 , spHttpClientOptions)
   .then( (response  : SPHttpClientResponse)=>{
     if(response.ok){
      alert("Item has been deleted succesfully");
      bindDetails("Record Deleted and All Records were loaded successfully");
     } 
     else{
      const errorMessage : string = "An Error has occured " + response.status + "-" + response.statusText
;
   setData({
    ...data,
    status : errorMessage
   })
}    
   }).catch( (err : Error)=>{
    console.log(err);
   })
 }

  
 React.useEffect(()=>{
  bindDetails("All Software List Items have been loaded");
    getSoftwareListItems().then( (items : ISoftwareListItem[])=>{
      setData( {
        ...data,
        SoftwareListItems : items 
      })
    }).catch( (err : Error)=>{
      console.log(err);
    })
  
 } , []);



  
  return (
    <>
     <div>
       
       <TextField
       label='ID'
       required={false}
       value = { data.SoftwareListItem.Id.toString()}
       onChange={(e,newValue)=>{
         setData({
          ...data,
          SoftwareListItem : {
            ...data.SoftwareListItem,
            Id : Number(newValue)
          }
         })
       }}
       />

       <TextField
       label ='Software Title'
       required= {true}
       value = { data.SoftwareListItem.Title}
       onChange={(e,newValue)=>{
        setData({
          ...data,
          SoftwareListItem : {
            ...data.SoftwareListItem,
            Title : newValue  || ""
          }
        })
       }}
       />
       <TextField
       label='Software Name'
       required= {true}
       value={ data.SoftwareListItem.SoftwareName}
       onChange={ (e,newValue )=>{
        setData({
          ...data,
          SoftwareListItem : {
            ...data.SoftwareListItem,
            SoftwareName : newValue || ""
          }
        })
       }}
       />

       <TextField
       label='Software Version'
       required= {true}
       value={ data.SoftwareListItem.SoftwareVersion}
       onChange={ (e,newValue)=>{
        setData({
          ...data,
          SoftwareListItem:{
            ...data.SoftwareListItem,
            SoftwareVersion : newValue || ""
          }
        })
       }}
       />
       <TextField
       label='Software Description'
       required= {true}
       value={ data.SoftwareListItem.SoftwareDescription}
       onChange={ (e,newValue)=>{
         setData({
          ...data,
          SoftwareListItem :{
            ...data.SoftwareListItem,
            SoftwareDescription : newValue || ""
          } 
         })
       }}
       />
       <Dropdown
       componentRef={dropdownRef}
       placeholder='Select an Option'
      label='Software Vendor'
      options={[
        {key:'Microsoft' , text :'Microsoft'},
        {key:'Sun' , text:'Sun'},
        {key:'Oracle'  , text: 'Oracle'},
        {key:'Google' , text:'Google'}
      ]}

      selectedKey={data.SoftwareListItem.SoftwareVendor}
      required
      onChange={(e,option)=>{
       setData({
        ...data,
        SoftwareListItem : {
          ...data.SoftwareListItem,
          SoftwareVendor : option?.key as string
        }
       })
      }}
     />


      <PrimaryButton
      text='Add'
      onClick={btnAdd_Click}
      />
      
      <PrimaryButton
      text='Update'
      onClick={btnUpdate_Click}
      />

      <PrimaryButton
      text='Delete'
      onClick={btnDelete_Click}
      /> 

      <div>
        {data.status}
      </div>
 
     <DetailsList
       items={data.SoftwareListItems}
       columns={softwareListColumns}
       setKey='Id'
       checkboxVisibility={CheckboxVisibility.always}
       selectionMode={SelectionMode.single}
      layoutMode={DetailsListLayoutMode.fixedColumns}
      compact={true}
      selection={selectionRef.current}
        />
     </div>
    </>
  )
}
