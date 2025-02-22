
export const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("tokenExpiration");
  
    if (!expirationTime) {
      return true;
    }
  
    const currentTime = new Date().getTime();
    return currentTime > parseInt(expirationTime, 10); 
  };