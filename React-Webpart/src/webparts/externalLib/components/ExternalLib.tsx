import * as React from 'react';

export interface IProps {
  description: string;
}

export default function ExternalLib (props:IProps) : JSX.Element {
 
  return (
    <>
    <h1> hello</h1>
    <p>{props.description}</p>
    </>
  )
}
