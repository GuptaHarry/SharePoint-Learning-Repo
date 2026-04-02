import * as React from 'react';
import { useEffect, useState } from 'react';
import type { IInsideReactApiProps } from './IInsideReactApiProps';
import { IAnonymousDemo } from './IAnonymousDemo';
import { HttpClient } from '@microsoft/sp-http';

const InsideReactApi: React.FC<IInsideReactApiProps> = (props) => {

  
  const [data, setData] = useState<IAnonymousDemo>({
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    address: {
      suite: '',
      city: '',
      street: ''
    },
    company: {
      name: ''
    }
  });

  const getUserDetails = async (): Promise<IAnonymousDemo> => {
    const url = `${props.apiUrl}/${props.userId}`;

    const response = await props.context.httpClient.get(
      url,
      HttpClient.configurations.v1
    );

    const json = await response.json();
    return json;
  };

  useEffect(() => {

    const fetchData = async (): Promise<void> => {
      try {
        const response = await getUserDetails();

        setData({
          id: response.id,
          name: response.name,
          username: response.username,
          email: response.email,
          phone: response.phone,
          website: response.website,
          address: {
            street: response.address.street,
            city: response.address.city,
            suite: response.address.suite
          },
          company: {
            name: response.company.name
          }
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchData().catch((error) => {
      console.error(error);
    });

  }, [props.userId]); 


  return (
    <div>
      <h1>ID is {data.id}</h1>
      <h2>Name: {data.name} | Username: {data.username}</h2>
      <h3>Email: {data.email} | Phone: {data.phone}</h3>
      <h4>
        Address: {data.address.street}, {data.address.suite}, {data.address.city}
      </h4>
      <h5>Company: {data.company.name}</h5>
    </div>
  );
};

export default InsideReactApi;


