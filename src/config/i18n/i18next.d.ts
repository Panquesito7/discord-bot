import { resources } from "./initialiseTranslations";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en-GB"];
    returnNull: false;
  }
}
