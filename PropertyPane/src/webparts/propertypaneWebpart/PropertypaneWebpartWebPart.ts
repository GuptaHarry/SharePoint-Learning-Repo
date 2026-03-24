import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PropertypaneWebpartWebPart.module.scss';

export interface IPropertypaneWebpartWebPartProps {
  description: string;
  productname : string;
  productdescription : string;
  productcost : number;
  quantity: number;
  billamount:number;
  discount:number;
  netbillamount:number;
  IsCertified : boolean;
  currentTime : Date;
  Rating : number;
  processerType : string ;
  invoiceFileType : string;
}

export default class PropertypaneWebpartWebPart extends BaseClientSideWebPart<IPropertypaneWebpartWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.propertypaneWebpart} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
      <div class="${styles.welcome}">
        <img alt="" src="${this._isDarkTheme ? require('./assets/welcome-dark.png') : require('./assets/welcome-light.png')}" class="${styles.welcomeImage}" />
        <h2>Well done, ${escape(this.context.pageContext.user.displayName)}!</h2>
        <div>${this._environmentMessage}</div>
        <div>Web part property value: <strong>${escape(this.properties.description)}</strong></div>
      </div>
      
      <table>
    
       <tr>
       <td>Current Time </td>
       <td>${this.properties.currentTime}</td>
       </tr>

       <tr>
       <td>Product Name </td>
       <td>${this.properties.productname}</td>
       </tr>

       <tr>
       <td>Description</td>
       <td>${this.properties.productdescription}</td>
       </tr>

       <tr>
       <td>Product Cost </td>
       <td>${(this.properties.productcost)}</td>
       </tr>
       <tr>
       <td>Product Quantity </td>
       <td>${this.properties.quantity}</td> 
       </tr>

       <tr>
         <td>Bill Amount </td>
         <td>${this.properties.billamount= (this.properties.productcost) * this.properties.quantity}
         </td>
         </tr>

         <tr>
         <td>Discount</td>
         <td>${this.properties.discount = this.properties.billamount*10/100}</td>
         </tr>

         <tr>
         <td>Net Bill Amount </td>
         <td>${this.properties.netbillamount= this.properties.billamount - this.properties.discount}</td>
         </tr>


       </tr>
       <tr>
       <td>
       Is Certified ? 
       </td>
       <td>
       ${this.properties.IsCertified}
       </td>
       </tr>


        <tr>
       <td>
         Rating
       </td>
       <td>
       ${this.properties.Rating}
       </td>
       </tr>


  <tr>
       <td>
         Processor Type
       </td>
       <td>
       ${this.properties.processerType}
       </td>
       </tr>

       <tr>
       <td>
         Processor Type
       </td>
       <td>
       ${this.properties.invoiceFileType}
       </td>
       </tr>




      </table>
    </section>`;
  }

  protected onInit(): Promise<void> {
  
    return new Promise<void>((resolve ,_reject) => {
         this.properties.productname="Mouse";
         this.properties.productdescription="Mouse Description";
         this.properties.quantity=500;
         this.properties.productcost=300;
         this.properties.IsCertified=false;
         this.properties.currentTime= new Date();
         resolve(undefined);
    })

  }

 protected get disableReactivePropertyChanges() : boolean{
  return true;
 }


  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

//   protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
//     return {
//       pages: [
//         {
//           header: {
//             description: strings.PropertyPaneDescription
//           },
//           groups: [
//             {
//               groupName: strings.BasicGroupName,
//               groupFields: [
//                 PropertyPaneTextField('description', {
//                   label: strings.DescriptionFieldLabel
//                 })
//               ]
//             }
//           ]
//         }
//       ]
//     };
//   }
// }


protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      
       pages : [
        {

          groups : [
            {
              groupName : "Product Details",
              groupFields : [

                PropertyPaneTextField('productname', {
                  label:"Product Name",
                  multiline:false,
                  resizable:false,
                  deferredValidationTime:5000,
                  placeholder : "Please enter product name" , "description" : "Name property field"
                }),
                 
                PropertyPaneTextField('productdescription', {
                  label:"Product Description",
                  multiline:true,
                  resizable:false,
                  deferredValidationTime:5000,
                  placeholder : "Please enter product description" , "description" : "Name property field" 
                }),
                PropertyPaneTextField('productcost', {
                  label:"Product Cost",
                  multiline:false,
                  resizable:false,
                  deferredValidationTime:0,
                   onGetErrorMessage : (value : string)=>{
                    if(!value)
                      return "Requried";
                    if(isNaN(Number(value))){
                      return "Enter a valid Number"
                    }
                    return "";
                  },
                  placeholder : "Please enter product cost" , "description" : "Number property field"
                }),
                PropertyPaneTextField('quantity', {
                  label:"Product Quantity",
                  multiline:false,
                  resizable:false,
                  deferredValidationTime:5000,
                   onGetErrorMessage : (value : string)=>{
                    if(!value)
                      return "Requried";
                    if(isNaN(Number(value))){
                      return "Enter a valid Number"
                    }
                    return "";
                  },
                  placeholder : "Please enter product quantity" , "description" : "Number property field"
                }),
                PropertyPaneToggle ( 'IsCertified', {
                     label:"Is Certified",
                     onText:" ISI Certification Passed",
                     offText:"Not Passed any certification",
                     checked:false
                }),
                PropertyPaneSlider("Rating",{
                  label:" Select your Rating",
                  min:0,
                  max:5,
                  step:0.5,
                  showValue:true,
                  value:1
                }),
                PropertyPaneChoiceGroup("processorType",{
                  label:"Choices",
                  options :[
                    { key:'I5' , text:"Intel I5"},
                    { key:'I7' , text:"Intel I7" , checked:true},
                    { key:'I9' , text:"Intel I9"},
                  ]
                }),
                PropertyPaneChoiceGroup("invoiceFileType",{
                  label:"Select Invoice File Type",
                  options :[
                    { key:'MSWord' , text:"MS Word",
                      imageSrc:"https://freepnglogo.com/images/all_img/microsoft-word-b1ba.png",
                      imageSize:{
                        width: 32, height:32
                      },
                      selectedImageSrc:"https://freepnglogo.com/images/all_img/microsoft-word-b1ba.png"
                    },
                    { key:'MSExcel' , text:"MS Excel" , checked:true,
                      imageSize:{
                        width:32 , height:32
                      },
                      imageSrc:"https://tse1.mm.bing.net/th/id/OIP.VR1Qf7xZqlfBo2WUcl5wAwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                      selectedImageSrc:"https://tse1.mm.bing.net/th/id/OIP.VR1Qf7xZqlfBo2WUcl5wAwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                    },
                    { key:'MSPowerPoint' , text:"MS PowerPoint",
                      imageSize:{
                        width:32,
                        height:32
                      },
                      imageSrc:"https://th.bing.com/th/id/OIP.uVMkMeaYjAgxm-g87ByWAQHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
                      selectedImageSrc:"https://th.bing.com/th/id/OIP.uVMkMeaYjAgxm-g87ByWAQHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
                    },
                    {
                      key:'OneNote', text:"One Note",
                      imageSrc:"https://i.pcmag.com/imagery/reviews/01YrB0BfeToE95hNrrXNbax-24..v1693256733.jpg",
                      selectedImageSrc:"https://i.pcmag.com/imagery/reviews/01YrB0BfeToE95hNrrXNbax-24..v1693256733.jpg",
                      imageSize:{
                        height:32,
                        width:32
                      },
          
                    }
                  ]
                })
                
                
              ] 
            }
          ]
        }
       ]};
  }
}

