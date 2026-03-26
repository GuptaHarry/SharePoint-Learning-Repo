import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
//import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './NewListDemoWebPartStrings.module.scss';
import * as strings from 'NewListDemoWebPartStrings';

import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

export interface INewListCreationWpWebPartProps {
  description: string;
}

export interface IListDefinition {
  Title: string;
  Description: string;
  AllowContentTypes: boolean;
  BaseTemplate: number;
  ContentTypesEnabled: boolean;
}

export default class NewListCreationWpWebPart extends BaseClientSideWebPart <INewListCreationWpWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div>

      <h3>Creating a New List Dynamically</h3><br/><br/><br/>

      <p>Please fill out the below details to create a new list programatically </p><br/><br/>
      
      New List Name: <br/><input type='text' id='txtNewListName' /><br/><br/>
  
      New List Description: <br/><input type='text' id='txtNewListDescription'/><br/><br/>
  
      <input type="button" id="btnCreateNewList" value="Create a New List"/><br/>

          </div>`;

          this.bindEvents();
  }

  private bindEvents(): void {
    const button = this.domElement.querySelector('#btnCreateNewList');
    if (button) {
      button.addEventListener('click', () => { this.createNewList(); });
    }
  }


  private createNewList(): void {

    //var newListName = document.getElementById("txtNewListName")["value"];
    
    //var newListDescription = document.getElementById("txtNewListDescription")["value"];

    const newListName = (document.getElementById("txtNewListName") as HTMLInputElement)?.value ?? '';
    
    const newListDescription = (document.getElementById("txtNewListDescription") as HTMLInputElement)?.value ?? '';



    const listUrl: string = this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('" + newListName + "')";
    
    this.context.spHttpClient.get(listUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 200) {
          alert("A List already does exist with this name.");
          return; 
        }
        if (response.status === 404) {
          const url: string = this.context.pageContext.web.absoluteUrl + "/_api/web/lists";

          const listDefinition: IListDefinition = {
            "Title": newListName,
            "Description": newListDescription,
            "AllowContentTypes": true,
            "BaseTemplate": 100,
            "ContentTypesEnabled": true,
          };
          const spHttpClientOptions: ISPHttpClientOptions = {
            "body": JSON.stringify(listDefinition)
          };
          this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
            .then((response: SPHttpClientResponse) => {
              if (response.status === 201 ) {
                alert("A new List has been created successfully.");
              } else {
                alert("Error Message  " + response.status + " - " + response.statusText);
              }
            }).catch( (error : Error )=>{
              alert("Error Message. " + error);
            });
        } 
        else {
          alert("Error Message. " + response.status + " " + response.statusText);
        }
      }).catch( (error : Error )=>{
        alert("Error Message. " + error);
      });
  }

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              })
            ]
          }
        ]
      }
    ]
  };
}
}
