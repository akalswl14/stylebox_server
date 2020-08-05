/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import * as Context from "../context"



declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  eventContentsInputType: { // input type
    order: number; // Int!
    url: string; // String!
  }
  productImageInputType: { // input type
    order: number; // Int!
    url: string; // String!
  }
  productNameInputType: { // input type
    lang: string; // String!
    word: string; // String!
  }
  shopImageInputType: { // input type
    order: number; // Int!
    url: string; // String!
  }
  shopNameInputType: { // input type
    lang: string; // String!
    word: string; // String!
  }
  tagNameInputType: { // input type
    lang: string; // String!
    word: string; // String!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  AuthPayload: { // root type
    token?: string | null; // String
    user?: NexusGenRootTypes['User'] | null; // User
  }
  Category: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    updatedAt: any; // DateTime!
  }
  CategoryName: { // root type
    categoryId?: number | null; // Int
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  Event: { // root type
    createdAt: any; // DateTime!
    discription: string; // String!
    id: number; // Int!
    updatedAt: any; // DateTime!
    wishersCnt?: number | null; // Int
  }
  EventImage: { // root type
    createdAt: any; // DateTime!
    eventId?: number | null; // Int
    id: number; // Int!
    order: number; // Int!
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  EventVideo: { // root type
    createdAt: any; // DateTime!
    eventId?: number | null; // Int
    id: number; // Int!
    order: number; // Int!
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  Mutation: {};
  Post: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    publisher?: string | null; // String
    text?: string | null; // String
    title?: string | null; // String
    updatedAt: any; // DateTime!
  }
  PostImage: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    order: number; // Int!
    postId?: number | null; // Int
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  Product: { // root type
    createdAt: any; // DateTime!
    description?: string | null; // String
    id: number; // Int!
    instaText?: string | null; // String
    shopId?: number | null; // Int
    updatedAt: any; // DateTime!
    wishersCnt?: number | null; // Int
  }
  ProductImage: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    order: number; // Int!
    productId?: number | null; // Int
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  ProductName: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    productId?: number | null; // Int
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  Query: {};
  Shop: { // root type
    address?: string | null; // String
    city?: string | null; // String
    coordinate?: string | null; // String
    createdAt: any; // DateTime!
    discription?: string | null; // String
    id: number; // Int!
    updatedAt: any; // DateTime!
    wishersCnt?: number | null; // Int
  }
  ShopImage: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    order: number; // Int!
    shopId?: number | null; // Int
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  ShopName: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    shopId?: number | null; // Int
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  Tag: { // root type
    categoryId?: number | null; // Int
    createdAt: any; // DateTime!
    id: number; // Int!
    updatedAt: any; // DateTime!
  }
  TagName: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    tagId?: number | null; // Int
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  User: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    updatedAt: any; // DateTime!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  eventContentsInputType: NexusGenInputs['eventContentsInputType'];
  productImageInputType: NexusGenInputs['productImageInputType'];
  productNameInputType: NexusGenInputs['productNameInputType'];
  shopImageInputType: NexusGenInputs['shopImageInputType'];
  shopNameInputType: NexusGenInputs['shopNameInputType'];
  tagNameInputType: NexusGenInputs['tagNameInputType'];
}

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
  }
  Category: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    name: NexusGenRootTypes['CategoryName'][]; // [CategoryName!]!
    tags: NexusGenRootTypes['Tag'][]; // [Tag!]!
    updatedAt: any; // DateTime!
  }
  CategoryName: { // field return type
    Category: NexusGenRootTypes['Category'] | null; // Category
    categoryId: number | null; // Int
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  Event: { // field return type
    createdAt: any; // DateTime!
    discription: string; // String!
    id: number; // Int!
    images: NexusGenRootTypes['EventImage'][]; // [EventImage!]!
    updatedAt: any; // DateTime!
    videos: NexusGenRootTypes['EventVideo'][]; // [EventVideo!]!
    wishers: NexusGenRootTypes['User'][]; // [User!]!
    wishersCnt: number | null; // Int
  }
  EventImage: { // field return type
    createdAt: any; // DateTime!
    Event: NexusGenRootTypes['Event'] | null; // Event
    eventId: number | null; // Int
    id: number; // Int!
    order: number; // Int!
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  EventVideo: { // field return type
    createdAt: any; // DateTime!
    Event: NexusGenRootTypes['Event'] | null; // Event
    eventId: number | null; // Int
    id: number; // Int!
    order: number; // Int!
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  Mutation: { // field return type
    confirmUser: NexusGenRootTypes['AuthPayload'] | null; // AuthPayload
    createEvent: NexusGenRootTypes['Event'] | null; // Event
    createProduct: NexusGenRootTypes['Product'] | null; // Product
    createShop: NexusGenRootTypes['Shop'] | null; // Shop
    createTag: NexusGenRootTypes['Tag'] | null; // Tag
    deleteEvent: NexusGenRootTypes['Event'] | null; // Event
    deleteProduct: NexusGenRootTypes['Product'] | null; // Product
    deleteShop: NexusGenRootTypes['Shop'] | null; // Shop
    example: NexusGenRootTypes['Shop'] | null; // Shop
    toggleWishEvent: boolean; // Boolean!
    toggleWishProduct: boolean; // Boolean!
    toggleWishShop: boolean; // Boolean!
    updateShop: NexusGenRootTypes['Shop'] | null; // Shop
  }
  Post: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    products: NexusGenRootTypes['Product'][]; // [Product!]!
    publisher: string | null; // String
    tags: NexusGenRootTypes['Tag'][]; // [Tag!]!
    text: string | null; // String
    title: string | null; // String
    updatedAt: any; // DateTime!
  }
  PostImage: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    order: number; // Int!
    Post: NexusGenRootTypes['Post'] | null; // Post
    postId: number | null; // Int
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  Product: { // field return type
    createdAt: any; // DateTime!
    description: string | null; // String
    id: number; // Int!
    image: NexusGenRootTypes['ProductImage'][]; // [ProductImage!]!
    instaText: string | null; // String
    name: NexusGenRootTypes['ProductName'][]; // [ProductName!]!
    Post: NexusGenRootTypes['Post'][]; // [Post!]!
    Shop: NexusGenRootTypes['Shop'] | null; // Shop
    shopId: number | null; // Int
    tags: NexusGenRootTypes['Tag'][]; // [Tag!]!
    updatedAt: any; // DateTime!
    wishers: NexusGenRootTypes['User'][]; // [User!]!
    wishersCnt: number | null; // Int
  }
  ProductImage: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    order: number; // Int!
    Product: NexusGenRootTypes['Product'] | null; // Product
    productId: number | null; // Int
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  ProductName: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    Product: NexusGenRootTypes['Product'] | null; // Product
    productId: number | null; // Int
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  Query: { // field return type
    getAllEvent: NexusGenRootTypes['Event'][] | null; // [Event!]
    getAllProduct: NexusGenRootTypes['Product'][] | null; // [Product!]
    getAllProductbyShop: NexusGenRootTypes['Product'][] | null; // [Product!]
    getAllProductbyTag: NexusGenRootTypes['Product'][] | null; // [Product!]
    getAllShop: NexusGenRootTypes['Shop'][] | null; // [Shop!]
    getAllShopbyRank: NexusGenRootTypes['Shop'][] | null; // [Shop!]
    getAllShopbyTag: NexusGenRootTypes['Shop'][] | null; // [Shop!]
    getEvent: NexusGenRootTypes['Event'] | null; // Event
    getProduct: NexusGenRootTypes['Product'] | null; // Product
    getShop: NexusGenRootTypes['Shop'] | null; // Shop
    getWishEvent: NexusGenRootTypes['Event'][] | null; // [Event!]
    getWishProduct: NexusGenRootTypes['Product'][] | null; // [Product!]
    getWishShop: NexusGenRootTypes['Shop'][] | null; // [Shop!]
  }
  Shop: { // field return type
    address: string | null; // String
    city: string | null; // String
    coordinate: string | null; // String
    createdAt: any; // DateTime!
    discription: string | null; // String
    id: number; // Int!
    images: NexusGenRootTypes['ShopImage'][]; // [ShopImage!]!
    name: NexusGenRootTypes['ShopName'][]; // [ShopName!]!
    products: NexusGenRootTypes['Product'][]; // [Product!]!
    tags: NexusGenRootTypes['Tag'][]; // [Tag!]!
    updatedAt: any; // DateTime!
    wishers: NexusGenRootTypes['User'][]; // [User!]!
    wishersCnt: number | null; // Int
  }
  ShopImage: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    order: number; // Int!
    Shop: NexusGenRootTypes['Shop'] | null; // Shop
    shopId: number | null; // Int
    updatedAt: any; // DateTime!
    url: string; // String!
  }
  ShopName: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    Shop: NexusGenRootTypes['Shop'] | null; // Shop
    shopId: number | null; // Int
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  Tag: { // field return type
    Category: NexusGenRootTypes['Category'] | null; // Category
    categoryId: number | null; // Int
    createdAt: any; // DateTime!
    id: number; // Int!
    name: NexusGenRootTypes['TagName'][]; // [TagName!]!
    Post: NexusGenRootTypes['Post'][]; // [Post!]!
    products: NexusGenRootTypes['Product'][]; // [Product!]!
    shops: NexusGenRootTypes['Shop'][]; // [Shop!]!
    updatedAt: any; // DateTime!
  }
  TagName: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    lang: string; // String!
    Tag: NexusGenRootTypes['Tag'] | null; // Tag
    tagId: number | null; // Int
    updatedAt: any; // DateTime!
    word: string; // String!
  }
  User: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    updatedAt: any; // DateTime!
    wishEvents: NexusGenRootTypes['Event'][]; // [Event!]!
    wishProducts: NexusGenRootTypes['Product'][]; // [Product!]!
    wishShops: NexusGenRootTypes['Shop'][]; // [Shop!]!
  }
}

export interface NexusGenArgTypes {
  Category: {
    name: { // args
      skip?: number | null; // Int
    }
    tags: { // args
      skip?: number | null; // Int
    }
  }
  Event: {
    images: { // args
      skip?: number | null; // Int
    }
    videos: { // args
      skip?: number | null; // Int
    }
    wishers: { // args
      skip?: number | null; // Int
    }
  }
  Mutation: {
    createEvent: { // args
      discription?: string | null; // String
      images: NexusGenInputs['eventContentsInputType'][]; // [eventContentsInputType!]!
      videos: NexusGenInputs['eventContentsInputType'][]; // [eventContentsInputType!]!
    }
    createProduct: { // args
      description?: string | null; // String
      images: NexusGenInputs['productImageInputType'][]; // [productImageInputType!]!
      instaText?: string | null; // String
      names: NexusGenInputs['productNameInputType'][]; // [productNameInputType!]!
      shopId: number; // Int!
      tags?: number[] | null; // [Int!]
    }
    createShop: { // args
      address?: string | null; // String
      city?: string | null; // String
      coordinate?: string | null; // String
      discription: string; // String!
      images: NexusGenInputs['shopImageInputType'][]; // [shopImageInputType!]!
      name: NexusGenInputs['shopNameInputType'][]; // [shopNameInputType!]!
      tags?: number[] | null; // [Int!]
    }
    createTag: { // args
      categoryId?: number | null; // Int
      name: NexusGenInputs['tagNameInputType'][]; // [tagNameInputType!]!
    }
    deleteEvent: { // args
      id: number; // Int!
    }
    deleteProduct: { // args
      id: number; // Int!
    }
    deleteShop: { // args
      id: number; // Int!
    }
    toggleWishEvent: { // args
      id: number; // Int!
    }
    toggleWishProduct: { // args
      id: number; // Int!
    }
    toggleWishShop: { // args
      id: number; // Int!
    }
    updateShop: { // args
      address?: string | null; // String
      city?: string | null; // String
      coordinate?: string | null; // String
      discription?: string | null; // String
      id: number; // Int!
      images?: NexusGenInputs['shopImageInputType'][] | null; // [shopImageInputType!]
      name?: NexusGenInputs['shopNameInputType'][] | null; // [shopNameInputType!]
      tags?: number[] | null; // [Int!]
    }
  }
  Post: {
    products: { // args
      skip?: number | null; // Int
    }
    tags: { // args
      skip?: number | null; // Int
    }
  }
  Product: {
    image: { // args
      skip?: number | null; // Int
    }
    name: { // args
      skip?: number | null; // Int
    }
    Post: { // args
      skip?: number | null; // Int
    }
    tags: { // args
      skip?: number | null; // Int
    }
    wishers: { // args
      skip?: number | null; // Int
    }
  }
  Query: {
    getAllEvent: { // args
      id?: number | null; // Int
    }
    getAllProduct: { // args
      id?: number | null; // Int
    }
    getAllProductbyShop: { // args
      id?: number | null; // Int
      shopId: number; // Int!
    }
    getAllProductbyTag: { // args
      filter?: string | null; // String
      id?: number | null; // Int
      pageNum: number; // Int!
      tags: number[]; // [Int!]!
    }
    getAllShop: { // args
      id?: number | null; // Int
    }
    getAllShopbyRank: { // args
      city?: string | null; // String
      id?: number | null; // Int
      pageNum: number; // Int!
    }
    getAllShopbyTag: { // args
      id?: number | null; // Int
      pageNum: number; // Int!
      tags: number[]; // [Int!]!
    }
    getEvent: { // args
      id: number; // Int!
    }
    getProduct: { // args
      id: number; // Int!
    }
    getShop: { // args
      id: number; // Int!
    }
  }
  Shop: {
    images: { // args
      skip?: number | null; // Int
    }
    name: { // args
      skip?: number | null; // Int
    }
    products: { // args
      skip?: number | null; // Int
    }
    tags: { // args
      skip?: number | null; // Int
    }
    wishers: { // args
      skip?: number | null; // Int
    }
  }
  Tag: {
    name: { // args
      skip?: number | null; // Int
    }
    Post: { // args
      skip?: number | null; // Int
    }
    products: { // args
      skip?: number | null; // Int
    }
    shops: { // args
      skip?: number | null; // Int
    }
  }
  User: {
    wishEvents: { // args
      skip?: number | null; // Int
    }
    wishProducts: { // args
      skip?: number | null; // Int
    }
    wishShops: { // args
      skip?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthPayload" | "Category" | "CategoryName" | "Event" | "EventImage" | "EventVideo" | "Mutation" | "Post" | "PostImage" | "Product" | "ProductImage" | "ProductName" | "Query" | "Shop" | "ShopImage" | "ShopName" | "Tag" | "TagName" | "User";

export type NexusGenInputNames = "eventContentsInputType" | "productImageInputType" | "productNameInputType" | "shopImageInputType" | "shopNameInputType" | "tagNameInputType";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: Context.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}