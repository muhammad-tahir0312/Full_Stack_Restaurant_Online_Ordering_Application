import { prisma } from "../../../../utils/connect";
import { NextRequest, NextResponse } from "next/server";

// GET SINGLE User
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: id,
      },
      include: {
        Order: true, // Include the Order field
      },
    });    
    
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};