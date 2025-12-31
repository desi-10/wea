import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = (await cookies()).get("session");

  console.log(session, "dashboard");

  if (!session) {
    redirect("/");
  }

  return children;
};

export default DashboardLayout;
