import * as React from 'react';
import type { IReactListProps } from './IReactListProps';

export interface IRShowListItems {
  listitems : [
    {
      "Title" : "",
      "ID" : "",
      "SoftwareName" : "",
      "SoftwareVersion" : "",
      "SoftwareVendor" : "",
      "SoftwareDescription"  :"",

    }
  ]
}

export default class ReactList extends React.Component<IReactListProps,IRShowListItems, {}> {
  
   static siteUrl : string = "";

   public constructor ( props : IReactListProps , state: IRShowListItems){
    super(props);
    this.state ={
      listitems : [
        {
         "Title" : "",
      "ID" : "",
      "SoftwareName" : "",
      "SoftwareVersion" : "",
      "SoftwareVendor" : "",
      "SoftwareDescription"  :"",
 
        }
      ]
    };
    ReactList.siteUrl= this.props.websiteUrl;
   }


   public async componentDidMount(): Promise<void> {
  try {
    const response = await fetch(
      `${ReactList.siteUrl}/_api/web/lists/getByTitle('SoftwareCatalog')/items`,
      {
        headers: {
          'Accept': 'application/json;odata=verbose'
        }
      }
    );

    const data = await response.json();

    this.setState({
      listitems: data.d.results
    });

  } catch (error) {
    console.log(error);
  }
}
public render(): React.ReactElement<IReactListProps> {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Software Name</th>
            <th>Version</th>
            <th>Vendor</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {
            this.state.listitems.map((listitem, key) => {

              const fullUrl = `${ReactList.siteUrl}/lists/SoftwareCatalog/DispForm.aspx?ID=${listitem.ID}`;

              return (
                <tr key={key}>
                  <td>
                    <a href={fullUrl}>
                      {listitem.Title}
                    </a>
                  </td>
                  <td>{listitem.SoftwareName}</td>
                  <td>{listitem.SoftwareVersion}</td>
                  <td>{listitem.SoftwareVendor}</td>
                  <td>{listitem.SoftwareDescription}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}
}
