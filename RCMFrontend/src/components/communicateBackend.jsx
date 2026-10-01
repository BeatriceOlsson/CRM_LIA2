async function CommunicateBackend({ url, crud, body }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  try {
    const dataToBackend = {
      method: crud,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (crud !== "GET" && body) {
      dataToBackend.body = JSON.stringify(body);
    }

    const respons = await fetch(`${backendURL}${url}`, dataToBackend);
    const data = await respons.json();

    if (!respons.ok) {
      throw new Error(data.message || "Okänt fel uppstog");
    }

    //Reagerar på status 401 som JWT skickar när token ej fins
    if (respons.status === 401) {
      window.dispatchEvent(new CustomEvent("session-expired"));
      throw new Error("Session Expired");
    }

    return data;
  } catch (error) {
    console.error("Fel uppstog: ", error);
    throw error;
  }
}

export default CommunicateBackend;
