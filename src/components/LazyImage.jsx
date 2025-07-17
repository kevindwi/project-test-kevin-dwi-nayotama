import { useEffect, useState, useRef } from "react";

const LazyImage = ({ src, alt, className }) => {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (!imgRef.current) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Jika elemen masuk viewport, atur src sebenarnya
              setImageSrc(src);
              setIsLoaded(true); // Tandai gambar sudah dimuat
              observer.unobserve(entry.target); // Hentikan observasi setelah dimuat
            }
          });
        },
        {
          rootMargin: "0px 0px 50px 0px", // Memuat gambar saat 50px mendekati viewport
        },
      );

      observer.observe(imgRef.current);

      // Cleanup observer saat komponen di-unmount
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    } else {
      // Fallback untuk browser lama: langsung muat gambar
      setImageSrc(src);
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={
        imageSrc || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
      }
      alt={alt}
      className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    />
  );
};

export default LazyImage;
