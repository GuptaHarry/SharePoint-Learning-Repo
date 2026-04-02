import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'InsideReactApiWebPartStrings';
import InsideReactApi from './components/InsideReactApi';
import { IInsideReactApiProps } from './components/IInsideReactApiProps';

// export interface IInsideReactApiWebPartProps {
//   description: string;
// }

export default class InsideReactApiWebPart extends BaseClientSideWebPart<IInsideReactApiProps> {

 

  public render(): void {
    const element: React.ReactElement<IInsideReactApiProps> = React.createElement(
      InsideReactApi,
      {
          context : this.context,
          apiUrl : this.properties.apiUrl,
          userId :this.properties.userId
      }
    );

    ReactDom.render(element, this.domElement);
  }
  
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
                }),
                PropertyPaneTextField('apiUrl', {
                  label : "New API URL"
                }),
                PropertyPaneTextField('userId', {
                  label:"User ID"
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
