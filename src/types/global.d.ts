/// <reference types="@solidjs/start/env" />

declare module "*.module.css" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}
