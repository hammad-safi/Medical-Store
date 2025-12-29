// import Image from "next/image";
// import DashboardLayout from "./dashboard/layout";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//      <DashboardLayout children/>
//     </div>
//   );
// }
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}

