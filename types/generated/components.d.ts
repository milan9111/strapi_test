import type { Schema, Attribute } from '@strapi/strapi';

export interface DialogContentDialogContent extends Schema.Component {
  collectionName: 'components_dialog_content_dialog_contents';
  info: {
    displayName: 'Dialog_content';
    description: '';
  };
  attributes: {
    message: Attribute.Text;
    date: Attribute.BigInteger;
    author: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'dialog-content.dialog-content': DialogContentDialogContent;
    }
  }
}
