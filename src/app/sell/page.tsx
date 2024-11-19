import { auth, signOut } from "@/auth";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ListingForm from "@/components/listings/form";
import { PrismaAdapter } from "@auth/prisma-adapter"; 
import { prisma } from "@/lib/database"
import { redirect } from "next/navigation"; 

const getUserId = async (session: any) => {
  if (!session?.user?.email) {
    throw new Error("No user email found in session");
  }

  // Query the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  // Check if the user exists
  if (!user) {
    throw new Error("User not found");
  }

  // Return the user ID
  return user.id;
};

const SellPage = async () => {
  const session = await auth();
  if (!session?.user?.email) {
    // Redirect to the sign-in page if no session is found
    redirect("/sign-in");
  }

  let userId;
  if (session?.user?.email) {
    userId = await getUserId(session);
  }
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-4">Let's get rid of that couch, {session.user.email}!</h1>
            <ListingForm userId={userId} /> {/* Pass the userId here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellPage;