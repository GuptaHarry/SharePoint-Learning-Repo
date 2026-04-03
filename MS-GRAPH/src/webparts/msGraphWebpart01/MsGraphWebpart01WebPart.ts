import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MsGraphWebpart01WebPartStrings';

import { MSGraphClientV3 } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface IMsGraphWebpart01WebPartProps {
  description: string;
}

export interface ClientType { 
  MSGraphClient : MSGraphClientV3;
}

export default class MsGraphWebpart01WebPart extends BaseClientSideWebPart<IMsGraphWebpart01WebPartProps> {

  public render(): void {

     this.context.msGraphClientFactory.getClient("3")
     .then( (graphClient : MSGraphClientV3) : void =>{
       graphClient.api('/me')
       .get( (error , user : MicrosoftGraph.User , rawResponse ?: string  )=>{

        this.domElement.innerHTML = `
        <div>
         <p>Display Name : ${user.displayName}<p/>
         <p>Given Name : ${user.givenName}<p/>
         <p>Sur-Name : ${user.surname}<p/>
         <p>Emial: ${user.mail}<p/>
         <p>Moible Phone : ${user.mobilePhone}<p/>
        </div>`
       }).catch( (err :Error )=>{
        console.log(err);
       });
     }).catch ( (err : Error)=>{
      console.log(err);
     })
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
