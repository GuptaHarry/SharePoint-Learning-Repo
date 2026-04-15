import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DepartmentSelectedCallback } from "./DepartmentSelectedCallback";

export interface IProviderWebpartProps {
  description: string;
  context : WebPartContext;
  siteUrl : string ;
  onDepartmentSelected : DepartmentSelectedCallback;
}
