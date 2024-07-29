import { NavigateFunction } from "react-router";

class Cache {
  navigation: NavigateFunction = () => {};
  private hashedPassword = "";
  private password = "";

  getHashedPassword() {
    return this.hashedPassword;
  }

  setHashedPassword(hashedPassword: string) {
    this.hashedPassword = hashedPassword;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password: string) {
    this.password = password;
  }
}

const CachedService = new Cache();

export default CachedService;
