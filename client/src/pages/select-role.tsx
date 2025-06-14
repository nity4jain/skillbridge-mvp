import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect } from "react";

const RoleSelectPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/signin";
    }
  }, [status]);

  async function setRole(role: string) {
    await axios.post("/api/set-role", { role });
    window.location.href = "/dashboard";
  }

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Select Your Role</h1>
      <p>Welcome, {session?.user?.email}</p>
      <button onClick={() => setRole("JUNIOR")} style={{ margin: "10px" }}>
        I'm a Junior
      </button>
      <button onClick={() => setRole("MENTOR")} style={{ margin: "10px" }}>
        I'm a Mentor
      </button>
    </div>
  );
};

export default RoleSelectPage;
