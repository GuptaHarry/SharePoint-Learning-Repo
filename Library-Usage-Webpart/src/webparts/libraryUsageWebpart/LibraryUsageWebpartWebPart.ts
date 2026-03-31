import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './LibraryUsageWebpartWebPart.module.scss';
import * as strings from 'LibraryUsageWebpartWebPartStrings';

import * as myLibrary from 'library-usagre';

export interface ILibraryUsageWebpartWebPartProps {
  description: string;
}

export default class LibraryUsageWebpartWebPart extends BaseClientSideWebPart<ILibraryUsageWebpartWebPartProps> {



  public render(): void {


    const myInstance = new myLibrary.LibraryUsageLibrary();

    this.domElement.innerHTML = `
    <section class="${styles.libraryUsageWebpart} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
      
      <p> Calling Library fucntino </p>
      <p> ${myInstance.name()}</p>
      <p> ${myInstance.getCurrentTime()}</p>

    </section>`;
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
