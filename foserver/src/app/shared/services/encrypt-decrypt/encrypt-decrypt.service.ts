import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }
  key ="hello"
  encrypt(password:string){
    return CryptoJS.AES.encrypt(password, this.key).toString();
  }
  decrypt(passwordToDecrypt:string){
    return CryptoJS.AES.decrypt(passwordToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
