import { User } from "../user/userTypes";

export interface Book {
    _id: string;

    title: string;

    auhtor: User;

    genre: string;

    coverImage: string,

    file: string,

    createdAt: Date,

    updatedAt: Date,

}