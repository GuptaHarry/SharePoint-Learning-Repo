import * as React from 'react';
import type { IReactWebpaProps } from './IReactWebpaProps';

export interface IReactLifecyclewpState {
  stageTitle : string ;
}

export default class ReactWebpa extends React.Component<IReactWebpaProps,IReactLifecyclewpState> {
 
     
  // defining a cosntuctor 

 public constructor  ( props  : IReactWebpaProps , state : IReactLifecyclewpState ){
   super(props);
   this.state  = { 
    stageTitle : 'component Construcotr has been called '
   };

   this.updateState = this.updateState.bind(this);
   console.log(  'Stage Title for m Cosntructor : ' + this.state.stageTitle);
 }
 
  
  //  public componentWillMount(): void {
  //      console.log('compoent will mount has been called');
  //  } npn
 
 public componentDidMount(): void {
      console.log('Stage title from ComponentDidMount :' + this.state.stageTitle);
      this.setState({
        stageTitle :'component DiidMount has been called' 
      });
 }


 public updateState () : void {
  this.setState({
    stageTitle : 'changeState has been callled'
  });

 }
 
  public render(): React.ReactElement<IReactWebpaProps> {
    return (
     <div>
       
       <h1>ReactJS components Lifecylce </h1>
       <h3>{this.state.stageTitle}</h3>
       <button onClick={this.updateState}>Click here to Update State Data !</button>
     </div>
    );
  }


  public componentWillUnMount () : void {
    console.log('COmponent will unmount has been called ');
  }
}
