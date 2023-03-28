import type { ComponentOptions, DefineComponent, Component } from "vue";

export type profileListItem = {
  icon: string;
  title: string;
  action: (...args: any[]) => any;
  id: string;
};

export type Post = {
  title: string;
  body: string;
  id: string;
  likes: number;
  comments: Array<Comment>;
};

export type AddedUser = {
  name: string;
  email: string;
  photoURL: string;
};

export type Article = {
  content: string;
  id: string;
  createdAt: number;
  author: AddedUser;
};

export type stringMonthSignature = {
  [a: string]: number;
};

export type Tabs = {
  title: string;
  component: Component;
  id: string;
};
export type Photo = {
  url: string;
  description?: string;
};

export type MonthData = {
  name: string;
  days: number;
};

export type sidebarItem = Omit<profileListItem, "action"> & { route: string };
export type entriesNavItem = Omit<profileListItem, "action"> & {
  component: Component;
};

export type Months =
  | "январь"
  | "февраль"
  | "март"
  | "апрель"
  | "май"
  | "июнь"
  | "июль"
  | "август"
  | "сентябрь"
  | "октябрь"
  | "ноябрь"
  | "декабрь";
type A = {
  [Key in Months]: number;
};
export type Birthday = {
  month: string;
  year: string;
  day: string;
};

export type Updates = {
  name: string;
  city: string;
  birthday: string;
  gender: string;
};

export type Message = {
  from: AddedUser;
  message: string;
  id: string;
  createdAt: number;
};

export type Chat = {
  with: AddedUser;
  messages: Array<Message>;
  id: string;
  blocked: boolean;
};

export type User = {
  name: string;
  email: string;
  password: string;
  photoURL: string;
  birthday: string;
  city: string;
  gender: string;
  friends: Array<User>;
  chats: Array<Chat>;
};

export type Comment = {
  author: string;
  authorProfilePhoto: string;
  comment: string;
};

export type UserDB = {
  name: string;
  email: string;
  photoURL: string;
  posts: Array<Post>;
  news: [];
  articles: [];
  photos: Array<Photo>;
  friends: Array<UserDB>;
  birthday: string;
  city: string;
  gender: string;
  chats: Array<Chat>;
};
