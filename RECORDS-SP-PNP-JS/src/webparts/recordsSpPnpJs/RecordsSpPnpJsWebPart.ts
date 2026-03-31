import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RecordsSpPnpJsWebPartStrings';
import * as pnp from 'sp-pnp-js';

export interface IRecordsSpPnpJsWebPartProps {

  description: string;
}

export interface ISoftwareCatalogItem {
  ID:string;
  Title: string;
  SoftwareName: string;
  SoftwareDescription: string;
  SoftwareVendor: string;
  SoftwareVersion: string;
}

export default class RecordsSpPnpJsWebPart extends BaseClientSideWebPart<IRecordsSpPnpJsWebPartProps> {


  public onInit(): Promise<void> {
       return super.onInit().then(_=>{
        pnp.setup({
          spfxContext  : this.context
        })
       })
  }
  public render(): void {
    this.domElement.innerHTML = `
    <div>
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
      <input type='submit'  value='Show All Records' id='btnReadAll' />      

      </td>
    </table>
    </div>
    <div id="divStatus"/>
    

    <h2>Get All list items </h2>
    <hr/>
    <div id="spListData"/>
    </div> `;

       this._bindEvents();
       this.readAllItems();

  }

   private readAllItems ( ) : void {
    let html : string = `<table border=1 width=100% style="bordercollapse: collapse;">`;
    html+= `<th>ID</th><th>Title</th><th>Vendor</th><th>Name</th><th>Version</th><th>Description</th>`;

    pnp.sp.web.lists.getByTitle("SoftwareCatalog").items.get().then( (items:ISoftwareCatalogItem[]) =>{

      items.forEach(function ( item){
        html+= `
        <tr>
        <td>${item.ID}</td>
        <td>${item.Title}</td>
                <td>${item.SoftwareVendor}</td>
                        <td>${item.SoftwareName}</td>
                                <td>${item.SoftwareVersion}</td>
                                        <td>${item.SoftwareDescription}</td>
                                        </tr>`;
      });
      html+=`</table>`;
      const allItems : Element  = this.domElement.querySelector('#spListData') as Element;
      allItems.innerHTML= html;
    }).catch((err:Error)=>
    {
      alert("error hapepend");
    })
   }

  private _bindEvents() : void {
    this.domElement.querySelector('#btnSubmit')?.addEventListener('click', ()=>{
      this.addListItem();
    });

    this.domElement.querySelector('#btnRead')?.addEventListener('click', ()=>{this.readListItem();
    });
    this.domElement.querySelector('#btnUpdate')?.addEventListener('click',()=>{
      this.updateListItem();
    });
    this.domElement.querySelector('#btnDelete')?.addEventListener('click',()=>{
      this.deleteListItem();
    })
  }

  private deleteListItem ( ) : void {

      const softwareId : string = (document.getElementById("txtID") as HTMLInputElement)?.value ?? "";
pnp.sp.web.lists.getByTitle("SoftwareCatalog").items.getById(Number(softwareId)).delete().then( (r)=>{
  alert("Operation sucessful");
  this.readAllItems();
}).catch((err:Error)=>{
  alert("erroro  ocucured");
});
  }

  private updateListItem ( ): void {
 
    
  const softwareId : string = (document.getElementById("txtID") as HTMLInputElement)?.value ?? "";
  const softwareTitle : string= (document.getElementById("txtSoftwareTitle") as HTMLInputElement)?.value ?? "";
  const softwareName : string= (document.getElementById("txtSoftwareName") as HTMLInputElement)?.value ?? "";
  const softwareVersion : string= (document.getElementById("txtSoftwareVersion") as HTMLInputElement)?.value ?? "";
    const softwareVendor : string= (document.getElementById("txtSoftwareVendor") as HTMLInputElement)?.value ?? "";
      const softwareDescription : string= (document.getElementById("txtSoftwareDescription") as HTMLTextAreaElement)?.value ?? "";

       pnp.sp.web.lists.getByTitle("SoftwareCatalog").items.getById(Number(softwareId)).update({
        Title : softwareTitle,
        SoftwareVendor : softwareVendor,
        SoftwareName : softwareName,
        SoftwareDescription : softwareDescription,
        SoftwareVersion : softwareVersion
       }).then( (r)=>
      alert("Details Updated")).catch( (err : Error)=>{
        alert("Error occured"+ err);
      })
  }
   private readListItem () : void {
     
     const id : string= (document.getElementById('txtID') as HTMLInputElement)?.value ?? "";
     
     pnp.sp.web.lists.getByTitle("SoftwareCatalog").items.getById(Number(id)).get()
     .then( (item : ISoftwareCatalogItem) => {
     
       const softwareTitle : HTMLInputElement = (document.getElementById("txtSoftwareTitle") as HTMLInputElement)?? null;
  const softwareName : HTMLInputElement= (document.getElementById("txtSoftwareName") as HTMLInputElement)?? null;
  const softwareVersion : HTMLInputElement= (document.getElementById("txtSoftwareVersion") as HTMLInputElement) ?? null;
    const softwareVendor : HTMLInputElement= (document.getElementById("txtSoftwareVendor") as HTMLInputElement)?? null;
      const softwareDescription : HTMLTextAreaElement= (document.getElementById("txtSoftwareDescription") as HTMLTextAreaElement) ?? null;
 

     if(softwareTitle)
       softwareTitle.value = item.Title;
     if(softwareName) 
     softwareName.value = item.SoftwareName;
     if(softwareDescription)  
     softwareDescription.value = item.SoftwareDescription;
     if(softwareVendor)  
     softwareVendor.value = item.SoftwareVendor;
     if(softwareVersion) 
     softwareVersion.value = item.SoftwareVersion;
      
 
     }).catch( (err : Error)=>{
      alert("eeror "+ err);
     })
   }
 private addListItem() : void {

  const softwareId : string = (document.getElementById("txtID") as HTMLInputElement)?.value ?? "";
  const softwareTitle : string= (document.getElementById("txtSoftwareTitle") as HTMLInputElement)?.value ?? "";
  const softwareName : string= (document.getElementById("txtSoftwareName") as HTMLInputElement)?.value ?? "";
  const softwareVersion : string= (document.getElementById("txtSoftwareVersion") as HTMLInputElement)?.value ?? "";
    const softwareVendor : string= (document.getElementById("txtSoftwareVendor") as HTMLInputElement)?.value ?? "";
      const softwareDescription : string= (document.getElementById("txtSoftwareDescription") as HTMLTextAreaElement)?.value ?? "";

    // const siteUrl : string = this.context.pageContext.site.absoluteUrl+ "/_api/web/lists/getbytitle('SoftwareCatalog')/items";

    pnp.sp.web.lists.getByTitle("SoftwareCatalog").items.add({
      ID: softwareId,
      Title:softwareTitle,
      SoftwareVendor:softwareVendor,
      SoftwareName : softwareName,
      SoftwareVersion : softwareVersion,
      SoftwareDescription : softwareDescription,
      
    }).then( (r)=>{
      alert("Success");
    } ).catch((err:Error)=>
    {
      alert("Error occured " + err);
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
