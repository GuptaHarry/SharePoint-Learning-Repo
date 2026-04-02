import * as React from 'react';
import type { IReactOutsideApiProps } from './IReactOutsideApiProps';

export default class ReactOutsideApi extends React.Component<IReactOutsideApiProps, {}> {
  public render(): React.ReactElement<IReactOutsideApiProps> {
    
    
    return (
      <div>
       <h1> ID is {this.props.id}</h1>
       <h2> Name is : {this.props.name}  Username is : {this.props.username}</h2>
       <h3> Email is : {this.props.email} Phone No is : {this.props.phone} </h3>
       <h4> Address is : {this.props.address.street} , {this.props.address.suite} , {this.props.address.city}</h4>
       <h5> Company is : {this.props.company.name}</h5>
      </div>
    );
  }
}
