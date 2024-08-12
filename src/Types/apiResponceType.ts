import { Messages } from "./../model/user";

export interface ApiResponce {
  seucces: boolean;
  message: string;
  isAcceptionMessage?: boolean;
  messages?: Array<Messages>;
}
