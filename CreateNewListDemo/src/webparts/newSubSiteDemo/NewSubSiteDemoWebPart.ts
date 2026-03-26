import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import type { IReadonlyTheme } from '@microsoft/sp-component-base';
// import { escape } from '@microsoft/sp-lodash-subset';

import styles from './NewSubSiteDemoWebPart.module.scss';
import * as strings from 'NewSubSiteDemoWebPartStrings';

import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface INewSubSiteDemoWebPartProps {
  description: string;
}

export default class NewSubSiteDemoWebPart extends BaseClientSideWebPart<INewSubSiteDemoWebPartProps> {

  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = '';

  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.newSubSiteDemo} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
       
       <h1>Create a new subsite</h1>
       <p>Please fill the below details to create a new subsite.</p>

       Sub Site Title : <br/> <input type="text" id="txtSubSiteTitle"/><br/>
      Sub Site URL : <br/> <input type="text" id="txtSubSiteUrl"/><br/>
      Sub Site Description : <br/> <input type="text" id="txtSubSiteDescription"/><br/>

      <input type="button" id="btnCreateSubSite" value="create Sub Site"/> <br/>
    </section>`;

    this.bindEvents();
  }


  private bindEvents() : void {
    this.domElement.querySelector('#btnCreateSubSite')?.addEventListener('click',() =>{
      this.createSubSite()});
  }

  private createSubSite() : void {
    const titleInputElement = document.getElementById("txtSubSiteTitle") as HTMLInputElement;
    const subSiteTitle = titleInputElement?.value ?? "";

    const urlInputElement = document.getElementById("txtSubSiteUrl") as HTMLInputElement;
    const subSiteUrl = urlInputElement?.value ?? "";

    const descriptionInputElement = document.getElementById("txtSubSiteDescription") as HTMLInputElement;
    const subSiteDescription = descriptionInputElement?.value ?? ""; 


    const url : string  =  this.context.pageContext.web.absoluteUrl + "/_api/web/webinfos/add";
    const spHttpClientOptions : ISPHttpClientOptions = {
      body : `{
      "parameters" : {
      "@odata.type":"SP.WebInfoCreationInformation",
      "Title":"${subSiteTitle}".
      "Url":"${subSiteUrl}",
      "Description":"${subSiteDescription}",
      "Language":1033,
      "WebTemplate": "STS#0",
      "UseUniquePermissions" : true
      }
    }`
    };


    this.context.spHttpClient.post(url,SPHttpClient.configurations.v1,spHttpClientOptions)
    .then( (response: SPHttpClientResponse)=>{
      if(response.status===200){
        alert("New Subsite has been created successfully");

      }
    }).catch( (response :SPHttpClientResponse)=>{
        alert("Error Message :"+ response.status + "-" + response.statusText);})
  }

  // protected onInit(): Promise<void> {
  //   return this._getEnvironmentMessage().then(message => {
  //     this._environmentMessage = message;
  //   });
  // }






  // private _getEnvironmentMessage(): Promise<string> {
  //   if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
  //     return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
  //       .then(context => {
  //         let environmentMessage: string = '';
  //         switch (context.app.host.name) {
  //           case 'Office': // running in Office
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
  //             break;
  //           case 'Outlook': // running in Outlook
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
  //             break;
  //           case 'Teams': // running in Teams
  //           case 'TeamsModern':
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
  //             break;
  //           default:
  //             environmentMessage = strings.UnknownEnvironment;
  //         }

  //         return environmentMessage;
  //       });
  //   }

  //   return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  // }

  // protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
  //   if (!currentTheme) {
  //     return;
  //   }

  //   this._isDarkTheme = !!currentTheme.isInverted;
  //   const {
  //     semanticColors
  //   } = currentTheme;

  //   if (semanticColors) {
  //     this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
  //     this.domElement.style.setProperty('--link', semanticColors.link || null);
  //     this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
  //   }

  // }

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
