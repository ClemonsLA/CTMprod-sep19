import { createContext, useState } from "react";

export const UserContext = createContext(null)

function Context({ children }) {
  const [user, setUser] = useState();
  const [magic, setMagic] = useState();

  return (
    <UserContext.Provider value= {{ user, setUser, magic, setMagic }} >
    { children }
    </ UserContext.Provider>
  );
}

export default Context;