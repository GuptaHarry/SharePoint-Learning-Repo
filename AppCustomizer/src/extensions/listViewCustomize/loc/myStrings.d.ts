declare interface IListViewCustomizeCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'ListViewCustomizeCommandSetStrings' {
  const strings: IListViewCustomizeCommandSetStrings;
  export = strings;
}
