import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

 useEffect(() => {
  if (session?.user?.role === "junior") {
    router.push("/dashboard/junior");
  } else if (session?.user?.role === "mentor") {
    router.push("/dashboard/mentor");
  }
}, [router, session?.user?.role]);

  return <div>Loading dashboard...</div>;
}
