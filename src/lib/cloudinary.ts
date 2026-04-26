type CloudinaryOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "thumb";
};

export function cloudinaryImageUrl(
  publicId: string | null | undefined,
  options: CloudinaryOptions = {}
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !publicId) {
    return null;
  }

  const transforms = [
    "f_auto",
    "q_auto",
    options.crop ? `c_${options.crop}` : "c_fill",
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null
  ].filter(Boolean);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(
    ","
  )}/${publicId}`;
}
