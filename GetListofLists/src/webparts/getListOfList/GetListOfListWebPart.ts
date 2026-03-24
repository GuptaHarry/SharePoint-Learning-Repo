import {  Environment, EnvironmentType, Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface IGetListOfListWebPartProps {

}

export interface ISharePointList {
  Title : string;
  Id : string;
}
export interface ISharePointLists {
  value : ISharePointList[];
}

export default class GetListOfListWebPart extends BaseClientSideWebPart<IGetListOfListWebPartProps> {
  
  
  private _getListofLists (): Promise<ISharePointLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl+ `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1).
    then ( (response : SPHttpClientResponse)=>{
      return response.json();
    })
  }

  private _getAndRenderLists () : void {
    if(Environment.type=== EnvironmentType.SharePoint){
      this._getListofLists().then( (response)=>{
        this._renderListOfLists(response.value);
      }).catch( (err)=>{
        console.log(err);
      })
    }
  }

  private _renderListOfLists (items : ISharePointList[]) : void {
    let html : string = '';
    items.forEach( (item:ISharePointList)=>{
      html+=`
      <ul>
      <li>
      <span>${item.Title}</span>
      </li>
      <li>
      <span>${item.Id}</span>
      </li>
      </ul>`;
    });

      const listsPlaceholder  = this.domElement.querySelector("#SPListPlaceHolder") as Element;
      listsPlaceholder.innerHTML = html;
    }



  public render(): void {
    this.domElement.innerHTML = `<div>
    <div id="SPListPlaceHolder">
    
    
    </div >
    </div>`;
   this._getAndRenderLists();  
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
