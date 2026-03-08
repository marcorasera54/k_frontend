import api from "@/components/api/api";

export const uploadImage = async (
  file: File,
  folder: string = "/general",
): Promise<{ url: string; file_id: string; name: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/upload/image?folder=${encodeURIComponent(folder)}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data;
};
