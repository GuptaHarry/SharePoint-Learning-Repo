export class LibraryUsageLibrary {
  

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(){
    console.log("helo"); 
  }

  public name () : string {
    return ( "Hello harikrihsna");
  }

  public getCurrentTime () : string {
    const currentDate : Date  = new Date();
    let str : string;
    str = "<br>Today's Date is :" + currentDate.toDateString();
    str+= "<br>Current Time is :" + currentDate.toTimeString();
    return (str);
  }
}


