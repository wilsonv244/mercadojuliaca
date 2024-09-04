'use client'
import * as crypto from "crypto";
import Cookies from "js-cookie";
export class CryptoMethod {
  private ckey: string = "LB{DalFj(/)iuA/1I=}/4%&E>+z.=UsQ";
  encriptarToken(dataCtoken: string): string {
    const cipher = crypto.createCipheriv(
      "AES-256-CBC",
      this.ckey,
      Buffer.from("0123456789012345")
    );
    let encriptarToken = cipher.update(dataCtoken, "utf-8", "base64");
    encriptarToken += cipher.final("base64");
    return encriptarToken;
  }
  desencriptarToken(cDataTokenEncriptado: string): string | null {
    try {
      const cipher = crypto.createDecipheriv(
        "AES-256-CBC",
        this.ckey,
        Buffer.from("0123456789012345")
      );
      let desencriptarToken = cipher.update(
        cDataTokenEncriptado,
        "base64",
        "utf-8"
      );
      desencriptarToken += cipher.final("utf-8");
      return desencriptarToken;
    } catch (error) {
      return null;
    }
  }
  verificarToken(tokenGenerate: string, data: any): boolean {
    const tokenNew = this.encriptarToken(data);
    if (tokenGenerate === tokenNew) return true;
    return false;
  }
  getLocalStorage(cValue: string): string | null {
    const cValueLs = localStorage.getItem(cValue);
    const desencriptar = this.desencriptarToken(cValueLs || "");
    return desencriptar;
  }
  saveLocalStorage(key: string, value: string): void {
    const valueEncripted = this.encriptarToken(value);
    Cookies.set(key, valueEncripted);
    localStorage.setItem(key, valueEncripted);
  }
}
