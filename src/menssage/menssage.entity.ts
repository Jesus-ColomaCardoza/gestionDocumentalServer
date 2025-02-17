export class Menssage {
  msgId: number;
  msgTxt: string;

  constructor() {
    (this.msgId = -1), (this.msgTxt = '');
  }

  setMessage(msgId: number, msgTxt: string) {
    (this.msgId = msgId), (this.msgTxt = msgTxt);
  }

  getMessage(): any {
    return { msgId: this.msgId, msgTxt: this.msgTxt };
  }
}
