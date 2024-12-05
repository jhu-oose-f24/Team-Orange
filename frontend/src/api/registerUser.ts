const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com/users";

interface registerUserType {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const registerUser = async (user: registerUserType) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export default registerUser;
