import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "MENTOR") router.push("/dashboard/mentor");
      else if (role === "JUNIOR") router.push("/dashboard/junior");
    }
  }, [status, session, router]);

  return <div>Loading dashboard...</div>;
}
