interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        token: data.token,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Login failed. Please check your credentials.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login.",
    };
  }
};
