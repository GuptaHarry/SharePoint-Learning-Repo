import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactOutsideApiWebPartStrings';
import ReactOutsideApi from './components/ReactOutsideApi';
import { IReactOutsideApiProps } from './components/IReactOutsideApiProps';

import {HttpClient ,HttpClientResponse } from '@microsoft/sp-http';

export interface IReactOutsideApiWebPartProps {
  description: string;
}

export interface IUserDetails {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

export default class ReactOutsideApiWebPart extends BaseClientSideWebPart<IReactOutsideApiWebPartProps> {

  public render(): void {

    this.getUserDetails().then( response =>{

   
    const element: React.ReactElement<IReactOutsideApiProps> = React.createElement(
      ReactOutsideApi,
      {
        id : response.id,
        name : response.name,
        username : response.username,
        email : response.email,
        address : {
          street : response.address.street,
          suite : response.address.suite,
          city : response.address.city
        },
        phone : response.phone,
       website : response.website,
       company : {
        name  : response.company.name
       }

      }
    );

    ReactDom.render(element, this.domElement);
  
 }
).catch((err : Error)=>{
  console.log(err);
});
  }

  
  private   getUserDetails (): Promise<IReactOutsideApiProps>{
    return this.context.httpClient.get(
      'https://jsonplaceholder.typicode.com/users/1' ,
      HttpClient.configurations.v1
    ).then( (response : HttpClientResponse) =>{
      return response.json();
    } ).then(jsonResponse =>{
      return jsonResponse;
    }).catch((err:Error)=>{
      console.log(err);
    }) as Promise<IReactOutsideApiProps>;
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
