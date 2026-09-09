import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days expiration
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const cookieStore = await cookies();
        
        const customName = cookieStore.get("pending_name")?.value;
        const company = cookieStore.get("pending_company")?.value;
        const purpose = cookieStore.get("pending_purpose")?.value;

        const client = await clientPromise;
        // Explicitly target your 'portfolio' database
        const db = client.db("portfolio"); 

        const result = await db.collection("visitors").updateOne(
          { email: user.email },
          {
            $set: {
              name: customName ? decodeURIComponent(customName) : (user.name || "Unknown"),
              email: user.email,
              company: company ? decodeURIComponent(company) : "",
              purpose: purpose ? decodeURIComponent(purpose) : "",
              timestamp: new Date().toISOString(),
            }
          },
          { upsert: true }
        );

        console.log("MongoDB Visitor Upsert Result:", result);
      } catch (error) {
        console.error("Error saving visitor log to MongoDB:", error);
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };