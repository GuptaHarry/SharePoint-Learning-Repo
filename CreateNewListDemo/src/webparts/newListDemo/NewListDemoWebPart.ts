import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'NewListDemoWebPartStrings';

import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

export interface INewListDemoWebPartProps {
  description: string;
}

export default class NewListDemoWebPart extends BaseClientSideWebPart<INewListDemoWebPartProps> {

  // @ts-expect-error - Used by framework but not in custom implementation
  private _environmentMessage: string = '';
  // @ts-expect-error - Used by framework but not in custom implementation
  private _isDarkTheme: boolean = false;

  public render(): void {
    this.domElement.innerHTML = `
    <div>
      <h3>Creating a new List Dynamically</h3>
      <p>Please fill out the below details to create a new list</p>

      <label>New List Name:</label><br/>
      <input type="text" id="txtNewListName"/><br/><br/>

      <label>New List Description:</label><br/>
      <input type="text" id="txtNewListDescription"/><br/><br/>

      <input type="button" id="btnCreateNewList" value="Create a new List"/><br/>
    </div>
    `;

    this.bindEvents();
  }

  // 🔗 Bind button click
  private bindEvents(): void {
    const button = this.domElement.querySelector('#btnCreateNewList');

    button?.addEventListener('click', () => {
      this.createNewList();
    });
  }

  // 🚀 Main logic
  private createNewList(): void {
    const nameInput = this.domElement.querySelector<HTMLInputElement>("#txtNewListName");
    const descInput = this.domElement.querySelector<HTMLInputElement>("#txtNewListDescription");

    const newListName = nameInput?.value.trim() || '';
    const newListDescription = descInput?.value.trim() || '';

    if (!newListName) {
      alert("Please enter a list name.");
      return;
    }

    const checkUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${newListName}')`;

    // 🔍 Check if list exists
    this.context.spHttpClient.get(checkUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {

        if (response.status === 200) {
          alert("List already exists.");
          return;
        }

        if (response.status === 404) {
          this._createList(newListName, newListDescription);
        }

      })
      .catch(() => {
        // If error → assume list doesn't exist
        this._createList(newListName, newListDescription);
      });
  }

  // 📦 Create list
  private _createList(name: string, description: string): void {

    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists`;

    const listDefinition = {
      Title: name,
      Description: description,
      AllowContentTypes: true,
      BaseTemplate: 100,
      ContentTypesEnabled: true
    };

    const options: ISPHttpClientOptions = {
      body: JSON.stringify(listDefinition)
    };

    this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, options)
      .then((response: SPHttpClientResponse) => {

        if (response.status === 201) {
          alert("List created successfully 🎉");
        } else {
          alert(`Error: ${response.status} - ${response.statusText}`);
        }

      })
      .catch((error) => {
        alert("Error creating list: " + error.message);
      });
  }

  // 🌍 Environment setup
  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {

    if (!!this.context.sdks.microsoftTeams) {
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          switch (context.app.host.name) {
            case 'Office':
              return this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;

            case 'Outlook':
              return this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;

            case 'Teams':
            case 'TeamsModern':
              return this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;

            default:
              return strings.UnknownEnvironment;
          }
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  // 🎨 Theme support
  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;

    this._isDarkTheme = !!currentTheme.isInverted;

    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || '');
      this.domElement.style.setProperty('--link', semanticColors.link || '');
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || '');
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // ⚙️ Property Pane
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
