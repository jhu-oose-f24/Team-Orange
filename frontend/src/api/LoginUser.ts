const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com";
// Sends a POST request to the specified API endpoint to login a user based on their jhed, first and last name

const loginUser = async (jhed: string, firstName: string, lastName: string) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jhed, firstName, lastName }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in or registering user:", error);
    throw error;
  }
};

export default loginUser;