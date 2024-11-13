const login = async (username: string,password:string) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        // Handle successful login (e.g., redirect to another page)
        
      } else {
        console.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      console.error("An error occurred during login");
    }
  };
export default login;

  