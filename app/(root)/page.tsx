import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {

  const result = await fetchPosts(1,30)

  return (
    <>
      <h1 className="head-text text-left">Homee</h1>
    </>
  );
}
