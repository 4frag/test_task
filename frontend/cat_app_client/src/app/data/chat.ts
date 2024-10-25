import { IMessage } from "./message"
import { IUser } from "./user"

export interface IChat {
  id: number
  interlocutor: IUser
  last_message: IMessage
}