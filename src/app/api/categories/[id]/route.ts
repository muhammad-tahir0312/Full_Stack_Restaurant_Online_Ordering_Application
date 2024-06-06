import { getAuthSession } from "../../../../utils/auth";
import { prisma } from  "../../../../utils/connect";
import { NextRequest, NextResponse } from "next/server";

// DELETE SINGLE PRODUCT
export const DELETE = async (
    req: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const { id } = params;
    const session = await getAuthSession();
  
    if (session?.user.isAdmin) {
      try {
        await prisma.category.delete({
          where: {
            id: id,
          },
        });
  
        return new NextResponse(JSON.stringify("Product has been deleted!"), {
          status: 200,
        });
      } catch (err) {
        console.log(err);
        return new NextResponse(
          JSON.stringify({ message: "Something went wrong!" }),
          { status: 500 }
        );
      }
    }
    return new NextResponse(JSON.stringify({ message: "You are not allowed!" }), {
      status: 403,
    });
  };