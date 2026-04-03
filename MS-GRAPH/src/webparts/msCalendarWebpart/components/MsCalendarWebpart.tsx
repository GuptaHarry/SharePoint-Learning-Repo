import * as React from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import type { IMsCalendarWebpartProps } from './IMsCalendarWebpartProps';
import type { ICalendarType } from './CalendarEvents';

export default function MsCalendarWebpart ( props : IMsCalendarWebpartProps ) : JSX.Element{

  const [event , setEvent] = React.useState<ICalendarType[]>( []);
  React.useEffect (  ()=>{

    props.context.msGraphClientFactory.getClient("3").then( (client : MSGraphClientV3) : void =>{

      client.api('/me/calendar/events')
      .version("v1.0")
      .select("*")
      .get()
      .then((response: any) => {
         const calendarEvents : any[] = response.value;
         setEvent( calendarEvents);
         if (calendarEvents.length > 0) {
           console.log('All properties of the first event item:', Object.keys(calendarEvents[0]));
         }
      })
      .catch((err : Error)=>{
        console.log(err);
      })
    }).catch((err : Error)=>{
      console.log(err);
    })
  }, []);


  return (
    <>
      <div>
        <ul>
          {
            event.map ( (item , key )=>
            <li key={item.id}>
              {item.subject}
       
            </li>)
          }
        </ul>
      </div>
    </>
  )
}
