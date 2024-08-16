import { Messages } from "./../model/user";

export interface ApiResponce {
  success: boolean;
  message: string;
  isAcceptionMessage?: boolean;
  messages?: Array<Messages>;
}
