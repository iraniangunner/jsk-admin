export async function getResumes() {
  const res = await fetch("https://jsk-co.com/api/resumes", {
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resumes");
  }

  return res.json();
}

export async function getResumeById(id: number) {
  const res = await fetch(`https://jsk-co.com/api/resumes/${id}`, {
    headers: {
      Authorization:
        "Bearer 3|aEbpCRb3dEf0gV3YyrmjFpmGdkEyYGxJue9ResHtb33d8a02",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("No such resume");
    }
    throw new Error("Failed to fetch the resume data");
  }
  return res.json();
}
