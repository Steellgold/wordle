import Cryptr from "cryptr"
import { env } from "../env.mjs";

const CRYPTR = new Cryptr(env.PRIVATE_KEY!);

export const getEncryptedText = (text: string): string => {
  return CRYPTR.encrypt(text);
};

export const getDecryptedText = (text: string): string => {
  return CRYPTR.decrypt(text);
};