class LoopMachine {
  constructor() {
    this.flag = false;
    this.callbacks = [];
  }
  addCallback(callback) {
    // console.log("list of Callback before add");
    // console.log(this.callbacks);
    // console.log("add");
    // console.log(callback);
    let index = this.callbacks.indexOf(callback);
    if (index > -1) return;
    this.callbacks.push(callback);
    // console.log("list of Callback after add");
    // console.log(this.callbacks);
  }
  removeCallback(callback) {
    // console.log("list of Callback before remove");
    // console.log(this.callbacks);
    // console.log("remove");
    // console.log(callback);
    let index = this.callbacks.indexOf(callback);
    if (index > -1) this.callbacks.splice(index, 1);
    // console.log("list of Callback after remove");
    // console.log(this.callbacks);
  }
  run = () => {
    if (!this.flag) return;
    this.callbacks.forEach((cb) => cb());
    window.requestAnimationFrame(this.run);
  };
  start = () => {
    if (this.flag) return;
    this.flag = true;
    this.run();
  };
  stop() {
    this.flag = false;
  }
}

const loopMachine = new LoopMachine();

export default loopMachine;

export { LoopMachine };
