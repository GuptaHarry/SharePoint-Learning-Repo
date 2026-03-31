import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { escape } from '@microsoft/sp-lodash-subset';

// import styles from './CruddemoWebPart.module.scss';
import * as strings from 'InsertRecordsIntoListWebPartStrings';

import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ISoftwareListItem } from './ISoftwareListItem';

export interface IInsertRecordsIntoListWebPartProps {
  description: string;
}

export interface ISoftwareListItemBody {
  Title: string;
  SoftwareVendor: string;
  SoftwareDescription: string;
  SoftwareName: string;
  SoftwareVersion: string;
}

export default class InsertRecordsIntoListWebPart extends BaseClientSideWebPart <IInsertRecordsIntoListWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `<div>
    <div>
    <table border='5' bgcolor='aqua'>

    <tr>
    <td>Please Enter Software ID </td>
    <td><input type='text' id='txtID' />
    <td><input type='submit' id='btnRead' value='Read Details' />
    </td>
    </tr>

     
      <tr>
      <td>Software Title</td>
      <td><input type='text' id='txtSoftwareTitle' />
      </tr>

      <tr>
      <td>Software Name</td>
      <td><input type='text' id='txtSoftwareName' />
      </tr>

      <tr>
      <td>Software Vendor</td>
      <td>
      <select id="ddlSoftwareVendor">
        <option value="Microsoft">Microsoft</option>
        <option value="Sun">Sun</option>
        <option value="Oracle">Oracle</option>
        <option value="Google">Google</option>
      </select>  
      </td>
     
      </tr>

      <tr>
      <td>Software Version</td>
      <td><input type='text' id='txtSoftwareVersion' />
      </tr>

      <tr>
      <td>Software Description</td>
      <td><textarea rows='5' cols='40' id='txtSoftwareDescription'> </textarea> </td>
      </tr>

      <tr>
      <td colspan='2' align='center'>
      <input type='submit'  value='Insert Item' id='btnSubmit' />
      <input type='submit'  value='Update' id='btnUpdate' />
      <input type='submit'  value='Delete' id='btnDelete' />      
      </td>
    </table>
    </div>
    <div id="divStatus"/>
          </div>`;

          this._bindEvents();
          this.readAllItems();
  }

  private readAllItems() : void{
    
    this._getListItems().then(listItems => {
      let html: string = '<table border=1 width=100% style="border-collapse: collapse;">';
      html += '<th>Title</th> <th>Vendor</th><th>Description</th><th>Name</th><th>Version</th>';

    listItems.forEach(listItem => {
      html += `<tr>            
      <td>${listItem.Title}</td>
      <td>${listItem.SoftwareVendor}</td>
      <td>${listItem.SoftwareDescription}</td>
      <td>${listItem.SoftwareName}</td>
      <td>${listItem.SoftwareVersion}</td>      
      </tr>`;
    });
    html += '</table>';
    const listContainer: Element | null = this.domElement.querySelector('#divStatus');
  
    if (listContainer) {
      listContainer.innerHTML = html;
    }
    }).catch ((err: Error)=>{
      alert("Error occured during the proces " + err);
    });


  }

  

  private _getListItems(): Promise<ISoftwareListItem[]> {
    const url: string = this.context.pageContext.site.absoluteUrl+"/_api/web/lists/getbytitle('SoftwareCatalog')/items";
    return this.context.spHttpClient.get(url,SPHttpClient.configurations.v1)
    .then(response => {
    return response.json();
    })
    .then(json => {
    return json.value;
    }) as Promise<ISoftwareListItem[]>;
    }

  private _bindEvents(): void {
    const btnSubmit = this.domElement.querySelector('#btnSubmit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => { this.addListItem(); });
    }
    const btnRead = this.domElement.querySelector('#btnRead');
    if (btnRead) {
      btnRead.addEventListener('click', () => { this.readListItem(); });
    }
    const btnUpdate = this.domElement.querySelector('#btnUpdate');
    if (btnUpdate) {
      btnUpdate.addEventListener('click', () => { this.updateListItem(); });
    }
    const btnDelete = this.domElement.querySelector('#btnDelete');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => { this.deleteListItem(); });
    }
  }


  private deleteListItem(): void {
    const id: string | "" = (document.getElementById("txtID") as HTMLInputElement).value ?? "";
    const url: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('SoftwareCatalog')/items(" + id + ")";          
    interface HeadersType {
      [key: string]: string;
      "X-HTTP-Method": string;
      "IF-MATCH": string;
    }
    const headers: HeadersType = { "X-HTTP-Method": "DELETE", "IF-MATCH": "*" };

    const spHttpClientOptions: ISPHttpClientOptions = {
      "headers": headers
    };


    this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.status === 204) {
        const message: Element | null = this.domElement.querySelector('#divStatus')??null;
        if(message)
        message.innerHTML = "Delete: List Item has been deleted successfully.";
        
      } else {
        const message: Element|null = this.domElement.querySelector('#divStatus')??null;
       if(message)
        message.innerHTML = "Failed to Delete..." + response.status + " - " + response.statusText;
      }
    }).catch( (err : Error)=>
    alert("an error occured "+ err));

  }
  private updateListItem() : void {
    
    const titleElement = document.getElementById("txtSoftwareTitle") as HTMLInputElement | null;
    const title = titleElement?.value ?? '';
    const softwareVendorElement = document.getElementById("ddlSoftwareVendor") as HTMLInputElement | null;
    const softwareVendor = softwareVendorElement?.value ?? '';
    const softwareDescriptionElement = document.getElementById("txtSoftwareDescription") as HTMLInputElement | null;
    const softwareDescription = softwareDescriptionElement?.value ?? '';
    const softwareNameElement = document.getElementById("txtSoftwareName") as HTMLInputElement | null;
    const softwareName = softwareNameElement?.value ?? '';
    const softwareVersionElement = document.getElementById("txtSoftwareVersion") as HTMLInputElement | null;
    const softwareVersion = softwareVersionElement?.value ?? '';

    const idElement = document.getElementById("txtID") as HTMLInputElement | null;
    const id: string = idElement?.value ?? '';

    const url: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('SoftwareCatalog')/items(" + id + ")";
    const itemBody: ISoftwareListItemBody = {
      "Title": title,
      "SoftwareVendor": softwareVendor,
      "SoftwareDescription": softwareDescription,
      "SoftwareName": softwareName,
      "SoftwareVersion": softwareVersion
    
    };
    interface HeadersType {
       [key: string]: string;
       "X-HTTP-Method" : string,
       "IF-MATCH" : string
    }
    const headers: HeadersType = {
      "X-HTTP-Method": "MERGE",
      "IF-MATCH": "*",
    };

    const spHttpClientOptions: ISPHttpClientOptions = {
      "headers": headers,
      "body": JSON.stringify(itemBody)
    };


    this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.status === 204) {
        const message: Element | null = this.domElement.querySelector('#divStatus')?? null;
        if(message)
        message.innerHTML = "List Item has been updated successfully.";          
      } else {
        const message: Element | null = this.domElement.querySelector('#divStatus')??null;
       if(message)
        message.innerHTML = "List Item updation failed. " + response.status + " - " + response.statusText;
      }
    }).catch( (err : Error)=>{
      alert("An error occured " + err);
    });


  }
  private readListItem(): void {
    
    const idElement = document.getElementById("txtID") as HTMLInputElement;
    if (!idElement) {
      const message: Element | null = this.domElement.querySelector('#divStatus')??null;
     if(message)
      message.innerHTML = "Error: txtID element not found.";
      return;
    }
    const id: string = idElement?.value;
    this._getListItemByID(id).then(listItem => {

    const titleElement = document.getElementById("txtSoftwareTitle") as HTMLInputElement;
    if (titleElement) titleElement.value = listItem.Title;
    
    const vendorElement = document.getElementById("ddlSoftwareVendor") as HTMLInputElement;
    if (vendorElement) vendorElement.value = listItem.SoftwareVendor;
    
    const descElement = document.getElementById("txtSoftwareDescription") as HTMLInputElement;
    if (descElement) descElement.value = listItem.SoftwareDescription;
    
    const nameElement = document.getElementById("txtSoftwareName") as HTMLInputElement;
    if (nameElement) nameElement.value = listItem.SoftwareName;
    
    const versionElement = document.getElementById("txtSoftwareVersion") as HTMLInputElement;
    if (versionElement) versionElement.value = listItem.SoftwareVersion;
    
    
    })
    .catch(error => {
      const message: Element | null = this.domElement.querySelector('#divStatus')??null;    
     if(message)
      message.innerHTML = "Read: Could not fetch details.. "+error.message;
    });

  }

  private _getListItemByID(id: string): Promise<ISoftwareListItem> {
    const url: string = this.context.pageContext.site.absoluteUrl+`/_api/web/lists/getbytitle('SoftwareCatalog')/items(${id})`;
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      
    return response.json();
    })
    .then( (listItems: {value: ISoftwareListItem[]}) => {
     
    const untypedItem: ISoftwareListItem = listItems.value[0];
    const listItem: ISoftwareListItem = untypedItem as ISoftwareListItem;
    return listItem;
    }) as Promise <ISoftwareListItem>;

  }


  private addListItem(): void {

    const softwaretitle = (document.getElementById("txtSoftwareTitle") as HTMLInputElement)?.value ?? '';
    const softwarename = (document.getElementById("txtSoftwareName") as HTMLInputElement)?.value ?? '';
    const softwareversion = (document.getElementById("txtSoftwareVersion") as HTMLInputElement)?.value ?? '';
    const softwarevendor = (document.getElementById("ddlSoftwareVendor") as HTMLInputElement)?.value ?? '';
    const softwareDescription = (document.getElementById("txtSoftwareDescription") as HTMLInputElement)?.value ?? '';



    const siteurl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('SoftwareCatalog')/items";

    
    const itemBody: ISoftwareListItemBody = {
      "Title": softwaretitle,
      "SoftwareVendor": softwarevendor,
      "SoftwareDescription": softwareDescription,
      "SoftwareName": softwarename,
      "SoftwareVersion": softwareversion,
    };

    
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(itemBody)
    };

    this.context.spHttpClient.post(siteurl, SPHttpClient.configurations.v1, spHttpClientOptions)
    .then((response: SPHttpClientResponse) => {
     
      if (response.status === 201) {
        const statusmessage: Element | null = this.domElement.querySelector('#divStatus')??null;
        if(statusmessage)
        statusmessage.innerHTML = "List Item has been created successfully.";
        this.clear();
       
       
      } else {
        const statusmessage: Element| null = this.domElement.querySelector('#divStatus')?? null;
        if(statusmessage)
        statusmessage.innerHTML = "An error has occured i.e.  " + response.status + " - " + response.statusText;
      }
    }).catch( ( err : Error)=>{
      alert("An error occured "+ err);
    });
  }


  private clear(): void {
    const titleElement = document.getElementById("txtSoftwareTitle") as HTMLInputElement;
    if (titleElement) titleElement.value = '';
    const vendorElement = document.getElementById("ddlSoftwareVendor") as HTMLInputElement;
    if (vendorElement) vendorElement.value = 'Microsoft';
    const descElement = document.getElementById("txtSoftwareDescription") as HTMLInputElement;
    if (descElement) descElement.value = '';
    const versionElement = document.getElementById("txtSoftwareVersion") as HTMLInputElement;
    if (versionElement) versionElement.value = '';
    const nameElement = document.getElementById("txtSoftwareName") as HTMLInputElement;
    if (nameElement) nameElement.value = '';    
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
