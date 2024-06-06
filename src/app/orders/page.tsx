"use client";

import { OrderType } from "../../types/types";
import { useMutation, useQuery, useQueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/orders").then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`http://localhost:3000/api/orders/${id}`, {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const status = input.value;

    mutation.mutate({ id, status });
    toast.success("The order status has been changed!")
  };

  if (isLoading || status === "loading") return "Loading...";

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="hidden md:table-cell p-4 text-center">Order ID</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">Price</th>
              <th className="hidden md:table-cell p-4 text-center">Products</th>
              <th className="p-4 text-center">Quantity</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item: OrderType) => (   
              <tr className={`px-3 py-1 ${item.status.toLowerCase() !== "delivered" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`} key={item.id}>
                <td className="hidden md:table-cell p-4">{item.id}</td>
                <td className="p-4">{item.createdAt.toString().slice(0, 10)}</td>
                <td className="p-4 text-center">{item.price}</td>
                <td className="hidden md:table-cell p-4">
                  {item.products.map((product) => (
                    <div key={product.id} className="my-2 text-center">
                      <p>{product.title}</p>
                    </div>
                  ))}
                </td>
                <td className="p-4">
                  {item.products.map((product) => (
                    <div key={product.id} className="my-2 text-center">
                      <p>{product.quantity}</p>
                    </div>
                  ))}
                </td>
                <td className="p-4">
                  {session?.user.isAdmin ? (
                    <form
                      className="flex items-center justify-center gap-4"
                      onSubmit={(e) => handleUpdate(e, item.id)}
                    >
                      <input
                        placeholder={item.status}
                        className="p-2 ring-1 ring-gray-300 rounded-md"
                      />
                      <button type="submit" className="bg-red-500 p-2 rounded-full hover:bg-black transition duration-300">
                        <Image src="/edit.png" alt="Edit" width={20} height={20} />
                      </button>
                    </form>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "delivered" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                      {item.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrdersPage;
  