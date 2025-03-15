"use server";
export async function getCooperationById(id: number) {
  const res = await fetch(
    `https://jsk-co.com/api/companies-cooperation/${id}`,
    {
      headers: {
        Authorization:
          "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("No such cooperation");
    }
    throw new Error("Failed to fetch the cooperation data");
  }
  return res.json();
}
